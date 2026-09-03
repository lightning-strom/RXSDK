#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从源码提取 SDK 使用到的后端接口（RXApiPath）并生成 Markdown 文档。

为什么不用直接抓取文档链接？
 - doc.ruixueyun.com 属于前端路由（#/view?...），页面内容通常由前端再请求接口获取；
 - 为了保证"用于重构"的准确性，这里以 SDK 源码为单一可信来源（Single Source of Truth）。

使用：
  # Android
  python3 tools/generate_api_docs.py \
    --platform android \
    --rx_api_path rxsdk_base/src/main/java/com/ruixue/openapi/RXApiPath.java \
    --out common/api/10_endpoints_used_by_sdk.md

  # iOS (待实现)
  python3 tools/generate_api_docs.py \
    --platform ios \
    --api_path RXSDK/Sources/RXSDK/API/RXApiPath.swift \
    --out common/api/10_endpoints_used_by_sdk.md
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple


_RE_CLASS_DECL = re.compile(r"^\s*public\s+static\s+final\s+class\s+(\w+)\s*\{")
_RE_CONST_DECL = re.compile(
    r'^\s*public\s+static\s+final\s+String\s+(\w+)\s*=\s*"([^"]+)"\s*;'
)
_RE_IGNORE_ADD = re.compile(r"IGNORE_TOKEN_ARRAY\.add\(([^)]+)\)\s*;")


def _has_cjk(s: str) -> bool:
    return any("\u4e00" <= ch <= "\u9fff" for ch in s)


def _clean_javadoc(lines: List[str]) -> str:
    cleaned: List[str] = []
    for raw in lines:
        line = raw.strip()
        if line.startswith("/**") or line.startswith("*/"):
            continue
        if line.startswith("*"):
            line = line[1:].strip()
        if line:
            cleaned.append(line)
    # 合并为一句（保留必要空格）
    return " ".join(cleaned).strip()


@dataclass(frozen=True)
class ApiConst:
    group: str
    name: str
    path: str
    desc: str

    @property
    def full_name(self) -> str:
        return f"{self.group}.{self.name}" if self.group != "Root" else self.name


def parse_rx_api_path(java_text: str) -> Tuple[List[ApiConst], Dict[str, str], List[str]]:
    """
    返回：
      - constants: 解析出的所有常量（带分组与注释）
      - ref_to_path: 常量引用名 -> path 值（用于解析 IGNORE_TOKEN_ARRAY）
      - ignore_refs: IGNORE_TOKEN_ARRAY.add(...) 里的引用列表
    """
    constants: List[ApiConst] = []
    ref_to_path: Dict[str, str] = {}
    ignore_refs: List[str] = []

    brace_depth = 0
    group_stack: List[Tuple[str, int]] = []
    pending_group: Optional[str] = None

    in_doc = False
    doc_lines: List[str] = []
    pending_desc: str = ""
    pending_inline_comments: List[str] = []

    lines = java_text.splitlines()
    for line in lines:
        stripped = line.strip()

        # Javadoc capture
        if stripped.startswith("/**"):
            in_doc = True
            doc_lines = [line]
            continue
        if in_doc:
            doc_lines.append(line)
            if "*/" in stripped:
                in_doc = False
                pending_desc = _clean_javadoc(doc_lines)
                doc_lines = []
            continue

        # 过滤“注释掉的代码块”，只保留看起来像“说明文本”的单行注释
        if stripped.startswith("//"):
            comment_text = stripped[2:].strip()
            # 排除：被注释掉的 Javadoc/代码（常见以 /**、*、*/、@ 开头）
            if comment_text.startswith(("*", "/", "@")):
                continue
            if _has_cjk(comment_text) and "public" not in comment_text and "@Deprecated" not in comment_text:
                pending_inline_comments.append(comment_text)
            continue

        # class declaration
        m_class = _RE_CLASS_DECL.match(line)
        if m_class:
            pending_group = m_class.group(1)

        # ignore token list
        m_ignore = _RE_IGNORE_ADD.search(line)
        if m_ignore:
            ref = m_ignore.group(1).strip()
            ignore_refs.append(ref)

        # constant declaration
        m_const = _RE_CONST_DECL.match(line)
        if m_const:
            const_name = m_const.group(1)
            const_path = m_const.group(2)
            group = group_stack[-1][0] if group_stack else "Root"
            desc = pending_desc.strip() if pending_desc.strip() else "；".join(pending_inline_comments).strip()

            api_const = ApiConst(group=group, name=const_name, path=const_path, desc=desc)
            constants.append(api_const)

            # build ref mapping
            ref_to_path[api_const.full_name] = const_path
            if group == "Root":
                ref_to_path[const_name] = const_path
            else:
                ref_to_path[f"{group}.{const_name}"] = const_path

            # reset pending desc
            pending_desc = ""
            pending_inline_comments = []

        # update brace depth + group stack
        open_count = line.count("{")
        close_count = line.count("}")
        brace_depth += open_count - close_count

        if pending_group is not None:
            group_stack.append((pending_group, brace_depth))
            pending_group = None

        while group_stack and brace_depth < group_stack[-1][1]:
            group_stack.pop()

    return constants, ref_to_path, ignore_refs


def render_markdown(constants: List[ApiConst], ref_to_path: Dict[str, str], ignore_refs: List[str]) -> str:
    ignore_values = set()
    unresolved: List[str] = []
    for ref in ignore_refs:
        ref_clean = ref.replace(" ", "")
        # 支持：LEGAL / Passport.REGISTER
        if ref_clean in ref_to_path:
            ignore_values.add(ref_to_path[ref_clean])
        else:
            unresolved.append(ref)

    by_group: Dict[str, List[ApiConst]] = {}
    for c in constants:
        by_group.setdefault(c.group, []).append(c)

    # 排序：Root 在前，其它按名称
    group_names = ["Root"] + sorted([g for g in by_group.keys() if g != "Root"])

    lines: List[str] = []
    lines.append("## SDK 使用到的后端接口清单（从源码自动提取）")
    lines.append("")
    lines.append("- **来源**：`RXApiPath`（SDK 真实调用的后端 path）")
    lines.append("- **说明**：`needLoggedIn` 的默认值来自 `RXApiPath.needVerifyToken(apiPath)`（即：不在 IGNORE_TOKEN_ARRAY 列表里则默认需要登录）")
    lines.append("")

    if unresolved:
        lines.append("> 注意：以下 IGNORE_TOKEN_ARRAY 引用未能解析到常量值（后续可手动核对）：")
        for r in unresolved:
            lines.append(f"> - `{r}`")
        lines.append("")

    for group in group_names:
        items = by_group.get(group, [])
        if not items:
            continue
        lines.append(f"### {group}")
        lines.append("")
        lines.append("| 常量 | path | 默认需登录 | 说明 |")
        lines.append("|---|---|---:|---|")
        for c in items:
            need_login = "是" if c.path not in ignore_values else "否"
            desc = c.desc.replace("\n", " ").strip()
            const_display = f"`{c.full_name}`"
            path_display = f"`{c.path}`"
            lines.append(f"| {const_display} | {path_display} | {need_login} | {desc} |")
        lines.append("")

    return "\n".join(lines).strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--platform",
        choices=["android", "ios", "unity", "minigame"],
        default="android",
        help="平台类型（默认：android）",
    )
    parser.add_argument(
        "--rx_api_path",
        help="Android: RXApiPath.java 文件路径（相对或绝对均可）",
    )
    parser.add_argument(
        "--api_path",
        help="iOS/Unity/小游戏: API 路径定义文件路径（相对或绝对均可）",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="输出 Markdown 文件路径（相对或绝对均可）",
    )
    args = parser.parse_args()

    # 根据平台选择输入文件
    if args.platform == "android":
        if not args.rx_api_path:
            parser.error("--rx_api_path 对于 Android 平台是必需的")
        api_path = Path(args.rx_api_path).expanduser().resolve()
    else:
        if not args.api_path:
            parser.error(f"--api_path 对于 {args.platform} 平台是必需的")
        api_path = Path(args.api_path).expanduser().resolve()

    out_path = Path(args.out).expanduser().resolve()

    # 目前只支持 Android 平台解析
    if args.platform != "android":
        print(f"警告：{args.platform} 平台的解析器尚未实现，请使用 Android 平台")
        return 1

    java_text = api_path.read_text(encoding="utf-8")
    constants, ref_to_path, ignore_refs = parse_rx_api_path(java_text)
    md = render_markdown(constants, ref_to_path, ignore_refs)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(md, encoding="utf-8")
    print(f"✅ 已生成接口文档: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

