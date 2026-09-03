#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
厂商私有 Maven 仓库 SDK 版本检测脚本。
对比 gradle/libs.versions.toml 中的版本与各厂商 Maven metadata.xml 中的最新版本，
输出可升级建议报告。可选：通过环境变量 GITLAB_TOKEN 与 CI_PROJECT_ID 创建 GitLab Issue。

使用方式：
  python3 scripts/check_vendor_versions.py
  python3 scripts/check_vendor_versions.py --output report.json
"""

import argparse
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# 项目根目录（脚本所在目录的上级）
ROOT_DIR = Path(__file__).resolve().parent.parent
LIBS_VERSIONS_TOML = ROOT_DIR / "gradle" / "libs.versions.toml"

# 厂商 Maven 仓库及要检查的 artifact（group:artifact 对应 toml 中的 version 键名）
VENDOR_REPOS = {
    "huawei": {
        "base_url": "https://developer.huawei.com/repo/",
        "packages": [
            ("com.huawei.hms", "hwid", "hms-hwid"),
            ("com.huawei.hms", "iap", "hms-iap"),
            ("com.huawei.hms", "game", "hms-game"),
            ("com.huawei.hms", "hianalytics", "hms-analytics"),
        ],
    },
    "honor": {
        "base_url": "https://developer.hihonor.com/repo/",
        "packages": [
            ("com.hihonor.mcs", "game", "honor-game"),
        ],
    },
    # 小米、VIVO、OPPO 等需登录或特殊域名，此处仅列入口；实际 metadata 可能需认证
    "xiaomi": {
        "base_url": "https://repos.xiaomi.com/maven/",
        "packages": [
            ("com.xiaomi.push", "MiPush_SDK_Client", "xiaomi-push"),
        ],
    },
}


def get_maven_metadata_version(base_url: str, group_id: str, artifact_id: str) -> str | None:
    """从 Maven 仓库获取 artifact 的最新 release 版本。"""
    path = f"{group_id.replace('.', '/')}/{artifact_id}/maven-metadata.xml"
    url = f"{base_url.rstrip('/')}/{path}"
    try:
        req = Request(url, headers={"User-Agent": "rxsdk-vendor-check/1.0"})
        with urlopen(req, timeout=15) as resp:
            root = ET.fromstring(resp.read())
            # namespace 可能为 None 或 "http://maven.apache.org/METADATA/1.1.0"
            ns = {"m": "http://maven.apache.org/METADATA/1.1.0"}
            latest = root.find(".//m:versioning/m:release", ns)
            if latest is None:
                latest = root.find(".//versioning/release")
            if latest is not None and latest.text:
                return latest.text.strip()
            # 备选：latest 标签
            latest_tag = root.find(".//m:versioning/m:latest", ns) or root.find(".//versioning/latest")
            if latest_tag is not None and latest_tag.text:
                return latest_tag.text.strip()
    except (URLError, HTTPError, ET.ParseError, OSError) as e:
        print(f"  [WARN] {url}: {e}", file=sys.stderr)
    return None


def read_toml_versions(toml_path: Path) -> dict[str, str]:
    """从 libs.versions.toml 中读取 [versions] 段落的 key = "value"。"""
    versions = {}
    if not toml_path.exists():
        return versions
    content = toml_path.read_text(encoding="utf-8")
    in_versions = False
    for line in content.splitlines():
        line = line.strip()
        if line == "[versions]":
            in_versions = True
            continue
        if in_versions and line.startswith("["):
            break
        if in_versions and "=" in line and not line.startswith("#"):
            m = re.match(r'([a-zA-Z0-9_-]+)\s*=\s*["\']([^"\']+)["\']', line)
            if m:
                versions[m.group(1)] = m.group(2)
    return versions


def main() -> int:
    parser = argparse.ArgumentParser(description="Check vendor SDK versions against libs.versions.toml")
    parser.add_argument("--output", "-o", help="Write JSON report to file")
    parser.add_argument("--quiet", "-q", action="store_true", help="Only print when updates available")
    args = parser.parse_args()

    current = read_toml_versions(LIBS_VERSIONS_TOML)
    if not current:
        print("Could not read [versions] from", LIBS_VERSIONS_TOML, file=sys.stderr)
        return 1

    report = []
    has_updates = False

    for vendor, config in VENDOR_REPOS.items():
        base_url = config["base_url"]
        for group_id, artifact_id, toml_key in config["packages"]:
            current_ver = current.get(toml_key)
            latest_ver = get_maven_metadata_version(base_url, group_id, artifact_id)
            if latest_ver is None:
                if not args.quiet:
                    print(f"[{vendor}] {group_id}:{artifact_id} ({toml_key}): 当前={current_ver} 远程=无法获取")
                report.append({
                    "vendor": vendor,
                    "artifact": f"{group_id}:{artifact_id}",
                    "toml_key": toml_key,
                    "current": current_ver,
                    "latest": None,
                    "upgradable": False,
                })
                continue
            upgradable = current_ver != latest_ver and (current_ver or "") < (latest_ver or "")
            if upgradable:
                has_updates = True
            if not args.quiet or upgradable:
                print(f"[{vendor}] {group_id}:{artifact_id} ({toml_key}): 当前={current_ver} 最新={latest_ver} {'可升级' if upgradable else ''}")
            report.append({
                "vendor": vendor,
                "artifact": f"{group_id}:{artifact_id}",
                "toml_key": toml_key,
                "current": current_ver,
                "latest": latest_ver,
                "upgradable": upgradable,
            })

    if args.output:
        try:
            import json
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
            if not args.quiet:
                print("Report written to", out_path)
        except Exception as e:
            print("Failed to write report:", e, file=sys.stderr)
            return 1

    return 0 if not has_updates else 0  # 仅报告，不因有升级而返回非 0（CI 可选根据 report 创建 Issue）


if __name__ == "__main__":
    sys.exit(main())
