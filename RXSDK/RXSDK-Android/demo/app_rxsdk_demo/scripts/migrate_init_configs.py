#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 rxconfig.json 的 ext/ext_test/env/package_names 合并进 init_configs.json，
使 init_configs.json 成为唯一源。迁移后生成报告供人工核对。

匹配规则：按 cpid + product_id + channel_id 匹配 init_configs 的 key，
domain 能对上优先，对不上则 fallback 到 cpid+产品+渠道首个匹配。
"""
import json
import os
import sys
from collections import OrderedDict, defaultdict

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "main", "assets")
INIT_CONFIGS = os.path.join(ASSETS_DIR, "init_configs.json")
RXCONFIG = os.path.join(ASSETS_DIR, "rxconfig.json")
OUT_INIT_CONFIGS = os.path.join(ASSETS_DIR, "init_configs.json")
REPORT_PATH = os.path.join(os.path.dirname(__file__), "migrate_report.txt")


def norm(v):
    if v is None:
        return ""
    if isinstance(v, str):
        return v.strip()
    return v


def norm_list(v):
    if not v:
        return []
    if isinstance(v, str):
        return [v.strip()] if v.strip() else []
    if isinstance(v, list):
        return [norm(x) for x in v if norm(x)]
    return []


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f, object_pairs_hook=OrderedDict)


def save_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")


def _merge_into_existing(configs, key, pkg_name, rx_env, rx_ext, rx_ext_test, report, ext_conflicts=None):
    """将一个 rxconfig 包的 env/ext/ext_test/package_names 合并进已有 init_configs key。"""
    cfg = configs[key]
    pkg_list = cfg.setdefault("package_names", [])
    if pkg_name not in pkg_list:
        pkg_list.append(pkg_name)
    if rx_env and "env" not in cfg:
        cfg["env"] = rx_env
    elif rx_env and cfg.get("env") and cfg.get("env") != rx_env:
        report.append("[env 冲突] key=%s 已有 env=%s, 包 %s env=%s\n"
                      % (key, cfg.get("env"), pkg_name, rx_env))
    if rx_ext:
        existing_ext = cfg.get("ext")
        if existing_ext is None:
            cfg["ext"] = rx_ext
        else:
            merged = OrderedDict(existing_ext)
            for k, v in rx_ext.items():
                if k not in merged:
                    merged[k] = v
            cfg["ext"] = merged
            diff = [k for k in rx_ext if k in existing_ext and existing_ext.get(k) != rx_ext.get(k)]
            if diff and ext_conflicts is not None:
                ext_conflicts[key].append((pkg_name, diff))
    if rx_ext_test:
        existing = cfg.get("ext_test")
        if existing is None:
            cfg["ext_test"] = rx_ext_test
        else:
            merged = OrderedDict(existing)
            for k, v in rx_ext_test.items():
                if k not in merged:
                    merged[k] = v
            cfg["ext_test"] = merged


def main():
    if not os.path.exists(RXCONFIG):
        print("rxconfig.json not found, nothing to migrate.")
        return
    init_root = load_json(INIT_CONFIGS)
    rx_root = load_json(RXCONFIG)

    configs = init_root.get("configs", OrderedDict())
    # 索引 init_configs: (cpid, product_id, channel_id) -> [(key, domains)]
    init_index = defaultdict(list)
    for key, cfg in configs.items():
        init = cfg.get("init", {})
        cpid = norm(init.get("cpid"))
        pid = norm(init.get("product_id"))
        chid = norm(init.get("channel_id"))
        domains = norm_list(init.get("domain"))
        init_index[(cpid, pid, chid)].append((key, domains))

    report = []
    report.append("===== 迁移报告 (rxconfig -> init_configs) =====\n")

    matched_keys = defaultdict(list)        # key -> [(packageName, domainMatched)]
    unmatched_rx = []                        # 没匹配到 init_configs 的 rxconfig 包
    ext_conflicts = defaultdict(list)        # key -> [(packageName, extKeys)]

    # 第一阶段：尝试匹配已有 init_configs 条目（见上方逻辑）
    # —— 为支持未匹配包自动建条目，先收集所有未匹配包，下方第二阶段处理
    pending_new = []  # 未匹配的 rxconfig 包，待新建 init_configs 条目

    for pkg_name, rx in rx_root.items():
        rx_cpid = norm(rx.get("cpid"))
        rx_pid = norm(rx.get("productid"))
        rx_chid = norm(rx.get("channelid"))
        rx_domains = norm_list(rx.get("baseUrl"))
        rx_env = norm(rx.get("env"))
        rx_ext = rx.get("ext")
        rx_ext_test = rx.get("ext_test")

        candidates = init_index.get((rx_cpid, rx_pid, rx_chid), [])
        if not candidates:
            pending_new.append((pkg_name, rx_cpid, rx_pid, rx_chid, rx_domains, rx_env, rx_ext, rx_ext_test, rx))
            continue

        # 优先 domain 命中；domain 对不上则走新建（避免不同 env/ext 的包被强并）
        chosen_key = None
        domain_matched = False
        for key, domains in candidates:
            if domains and rx_domains and any(d in domains for d in rx_domains):
                chosen_key = key
                domain_matched = True
                break
        if chosen_key is None:
            # domain 不匹配 → 不并入已有 key，转新建条目保留原 env/ext/domain
            pending_new.append((pkg_name, rx_cpid, rx_pid, rx_chid, rx_domains, rx_env, rx_ext, rx_ext_test, rx))
            continue

        _merge_into_existing(configs, chosen_key, pkg_name, rx_env, rx_ext, rx_ext_test, report, ext_conflicts)
        matched_keys[chosen_key].append((pkg_name, domain_matched, rx_domains))

    # 第二阶段：为未匹配包新建 init_configs 条目
    report.append("\n----- 新建条目（rxconfig 包未命中已有 key，自动新建）-----\n")
    used_keys = set(configs.keys())
    for pkg_name, rx_cpid, rx_pid, rx_chid, rx_domains, rx_env, rx_ext, rx_ext_test, rx in pending_new:
        # cpid/产品/渠道全空时用包名尾段做 key，避免 cp___ 这种非法 key
        if not rx_cpid and not rx_pid and not rx_chid:
            tail = pkg_name.split(".")[-1] if pkg_name else "unknown"
            base_key = "cp_pkg_%s" % tail
        else:
            base_key = "cp_%s_%s_%s" % (rx_cpid, rx_pid, rx_chid)
        base_key = base_key.replace(" ", "")
        new_key = base_key
        idx = 2
        while new_key in used_keys:
            new_key = "%s_%d" % (base_key, idx)
            idx += 1
        used_keys.add(new_key)
        new_cfg = OrderedDict()
        new_cfg["_meta"] = OrderedDict([("name", "%s · %s" % (rx_cpid, pkg_name))])
        if rx_env:
            new_cfg["env"] = rx_env
        new_cfg["package_names"] = [pkg_name]
        init_obj = OrderedDict()
        init_obj["cpid"] = rx_cpid
        init_obj["channel_id"] = rx_chid
        init_obj["product_id"] = rx_pid
        if rx_domains:
            init_obj["domain"] = rx_domains
        ipv4 = rx.get("ipv4_url") or rx.get("ipv4Url")
        if ipv4:
            init_obj["ipv4_url"] = ipv4
        new_cfg["init"] = init_obj
        if rx_ext:
            new_cfg["ext"] = rx_ext
        if rx_ext_test:
            new_cfg["ext_test"] = rx_ext_test
        configs[new_key] = new_cfg
        report.append("  新建 %s <- %s cpid=%s 产品=%s 渠道=%s\n"
                      % (new_key, pkg_name, rx_cpid, rx_pid, rx_chid))
        matched_keys[new_key].append((pkg_name, True, rx_domains))
        # 同步索引，避免后续重复
        init_index[(rx_cpid, rx_pid, rx_chid)].append((new_key, rx_domains))

    # 输出报告
    report.append("\n----- 命中明细（init_configs key <- rxconfig 包）-----\n")
    for key in configs.keys():
        pkgs = matched_keys.get(key, [])
        if not pkgs:
            report.append("  %s: (无 rxconfig 包匹配)\n" % key)
            continue
        for pkg_name, dm, doms in pkgs:
            tag = "domain命中" if dm else "fallback"
            report.append("  %s <- %s [%s] domains=%s\n" % (key, pkg_name, tag, doms))

    report.append("\n----- ext 冲突（同一 key 不同包 ext 字段值不同，已保留首个，未覆盖）-----\n")
    if not ext_conflicts:
        report.append("  (无)\n")
    for key, items in ext_conflicts.items():
        for pkg_name, diff in items:
            report.append("  %s <- %s 冲突字段=%s\n" % (key, pkg_name, diff))

    report.append("\n----- 未匹配的 rxconfig 包（init_configs 中无对应 cpid+产品+渠道）-----\n")
    if not unmatched_rx:
        report.append("  (无)\n")
    for pkg_name, cpid, pid, chid, doms in unmatched_rx:
        report.append("  %s cpid=%s 产品=%s 渠道=%s domains=%s\n"
                      % (pkg_name, cpid, pid, chid, doms))

    # 检查 init_configs 里原有但 rxconfig 没有的 key
    report.append("\n----- init_configs 中未被任何 rxconfig 包命中的 key（保留原样，无 ext）-----\n")
    for key in configs.keys():
        if key not in matched_keys:
            report.append("  %s\n" % key)

    save_json(OUT_INIT_CONFIGS, init_root)
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.writelines(report)
    print("迁移完成。新 init_configs.json 已写回，报告: %s" % REPORT_PATH)
    print("未匹配包数: %d, 命中 key 数: %d, ext 冲突 key 数: %d"
          % (len(unmatched_rx), len(matched_keys), len(ext_conflicts)))


if __name__ == "__main__":
    main()
