#!/usr/bin/env python3
"""Scan and auto-fix common MDX doc quality issues.

Scope: docs/**/*.mdx excluding docs/_archive/** and partials (_*.mdx).

Usage:
  python3 scripts/mdx-quality-audit.py --check
  python3 scripts/mdx-quality-audit.py --fix
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
REPORT_PATH = ROOT / "scripts/mdx-quality-report.json"

PLACEHOLDER_USER = "YOUR_MAVEN_USERNAME"
PLACEHOLDER_PASS = "YOUR_MAVEN_PASSWORD"

# --- Auto-fix patterns (applied globally or in groovy blocks) ---

SEMICOLON_FIXES: list[tuple[str, str, str]] = [
    (r"\)；；", ")", "paren_double_fullwidth_semicolon"),
    (r"；；", "；", "double_fullwidth_semicolon"),
    (r";；", "；", "ascii_fullwidth_semicolon"),
]

BROKEN_URL_FIXES: list[tuple[str, str, str]] = [
    (r"doc\.ruixuehttps://", "https://doc.ruixue", "doc_ruixuehttps"),
    (r"ruixueyun\.comhttps://", "ruixueyun.com/https://", "comhttps_glue"),
    (r"\.comhttps://", ".com/https://", "generic_comhttps"),
]

MAVEN_USER_RE = re.compile(
    r"^(\s*)username\s+['\"](?!YOUR_MAVEN_USERNAME)([^'\"]+)['\"]",
    re.MULTILINE,
)
MAVEN_PASS_RE = re.compile(
    r"^(\s*)password\s+['\"](?!YOUR_MAVEN_PASSWORD)([^'\"]+)['\"]",
    re.MULTILINE,
)

# --- Report-only patterns ---

DOC_RUIXUEYUN_RE = re.compile(r"doc\.ruixueyun\.com")
CHINESE_RE = re.compile(r"[\u4e00-\u9fff]")
JAVA_COMMENT_RE = re.compile(r"//.*[\u4e00-\u9fff]|/\*.*[\u4e00-\u9fff].*\*/")


@dataclass
class Issue:
    file: str
    line: int
    pattern: str
    snippet: str


@dataclass
class FileResult:
    path: Path
    fixes: list[str] = field(default_factory=list)
    issues: list[Issue] = field(default_factory=list)


def iter_mdx_files() -> list[Path]:
    files: list[Path] = []
    for path in sorted(DOCS.rglob("*.mdx")):
        rel = path.relative_to(DOCS)
        if "_archive" in rel.parts:
            continue
        if path.name.startswith("_"):
            continue
        files.append(path)
    return files


def snippet_at_line(text: str, line_no: int, width: int = 120) -> str:
    lines = text.splitlines()
    if line_no < 1 or line_no > len(lines):
        return ""
    s = lines[line_no - 1].strip()
    return s[:width] + ("…" if len(s) > width else "")


def in_fenced_block(line: str, state: str | None) -> tuple[str | None, bool]:
    """Return (new_block_lang, is_inside_block)."""
    m = re.match(r"^```(\w*)", line.strip())
    if not m:
        return state, state is not None
    lang = m.group(1) or ""
    if state is None:
        return lang, True
    return None, False


def apply_semicolon_fixes(content: str) -> tuple[str, list[str]]:
    applied: list[str] = []
    out = content
    for pattern, repl, name in SEMICOLON_FIXES:
        new_out, n = re.subn(pattern, repl, out)
        if n:
            applied.append(f"{name}:{n}")
            out = new_out
    return out, applied


def apply_broken_url_fixes(content: str) -> tuple[str, list[str]]:
    applied: list[str] = []
    out = content
    for pattern, repl, name in BROKEN_URL_FIXES:
        new_out, n = re.subn(pattern, repl, out)
        if n:
            applied.append(f"{name}:{n}")
            out = new_out
    return out, applied


def redact_maven_in_groovy(content: str) -> tuple[str, list[str]]:
    """Redact username/password only inside ```groovy fences."""
    lines = content.splitlines(keepends=True)
    state: str | None = None
    applied: list[str] = []
    out_lines: list[str] = []

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            if state is None:
                m = re.match(r"^```(\w*)", stripped)
                state = (m.group(1) if m else "") or ""
            else:
                state = None
            out_lines.append(line)
            continue

        if state == "groovy":
            new_line = line
            mu = MAVEN_USER_RE.match(line.rstrip("\n"))
            if mu:
                indent = mu.group(1)
                new_line = f"{indent}username '{PLACEHOLDER_USER}'\n"
                applied.append(f"maven_username_redacted:L{i}")
            mp = MAVEN_PASS_RE.match(line.rstrip("\n"))
            if mp:
                indent = mp.group(1)
                new_line = f"{indent}password '{PLACEHOLDER_PASS}'\n"
                applied.append(f"maven_password_redacted:L{i}")
            out_lines.append(new_line)
        else:
            out_lines.append(line)

    return "".join(out_lines), applied


def scan_report_only(content: str, rel_path: str) -> list[Issue]:
    issues: list[Issue] = []
    lines = content.splitlines()
    state: str | None = None

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            if state is None:
                m = re.match(r"^```(\w*)", stripped)
                state = (m.group(1) if m else "") or ""
            else:
                state = None
            continue

        if DOC_RUIXUEYUN_RE.search(line):
            issues.append(
                Issue(rel_path, i, "doc.ruixueyun.com", snippet_at_line(content, i))
            )

        if state == "java" and JAVA_COMMENT_RE.search(line):
            issues.append(
                Issue(rel_path, i, "chinese_java_comment", snippet_at_line(content, i))
            )

        # Remaining semicolon glitches (if fix missed any)
        for pat, _, name in SEMICOLON_FIXES:
            if re.search(pat, line):
                issues.append(
                    Issue(rel_path, i, name, snippet_at_line(content, i))
                )
                break

        # Maven creds outside groovy or still present in groovy
        if MAVEN_USER_RE.search(line) or MAVEN_PASS_RE.search(line):
            issues.append(
                Issue(rel_path, i, "maven_credential", snippet_at_line(content, i))
            )

        for pat, _, name in BROKEN_URL_FIXES:
            if re.search(pat, line):
                issues.append(
                    Issue(rel_path, i, name, snippet_at_line(content, i))
                )
                break

    return issues


def process_file(path: Path, fix: bool) -> FileResult:
    rel = str(path.relative_to(ROOT))
    original = path.read_text(encoding="utf-8")
    content = original
    result = FileResult(path=path)

    if fix:
        content, semi = apply_semicolon_fixes(content)
        result.fixes.extend(semi)
        content, urls = apply_broken_url_fixes(content)
        result.fixes.extend(urls)
        content, maven = redact_maven_in_groovy(content)
        result.fixes.extend(maven)
        if content != original:
            path.write_text(content, encoding="utf-8")

    result.issues = scan_report_only(content, rel)
    return result


def aggregate(results: list[FileResult], file_count: int) -> dict:
    fixed_files = sorted(
        {str(r.path.relative_to(ROOT)) for r in results if r.fixes}
    )
    remaining = [
        {
            "file": iss.file,
            "line": iss.line,
            "pattern": iss.pattern,
            "snippet": iss.snippet,
        }
        for r in results
        for iss in r.issues
    ]

    by_pattern: dict[str, int] = {}
    for iss in remaining:
        by_pattern[iss["pattern"]] = by_pattern.get(iss["pattern"], 0) + 1

    fix_counts: dict[str, int] = {}
    for r in results:
        for f in r.fixes:
            key = f.split(":")[0]
            fix_counts[key] = fix_counts.get(key, 0) + 1

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scope": {
            "root": "docs/**/*.mdx",
            "excluded": ["docs/_archive/**", "partials (_*.mdx)"],
            "files_scanned": file_count,
        },
        "summary": {
            "files_fixed": len(fixed_files),
            "total_fixes": sum(len(r.fixes) for r in results),
            "fix_breakdown": fix_counts,
            "remaining_issues_count": len(remaining),
            "remaining_by_pattern": by_pattern,
            "doc_ruixueyun_com_count": by_pattern.get("doc.ruixueyun.com", 0),
            "chinese_java_comment_count": by_pattern.get("chinese_java_comment", 0),
            "maven_credential_remaining": by_pattern.get("maven_credential", 0),
        },
        "fixed_files": fixed_files,
        "remaining_issues": remaining,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="MDX quality audit and safe auto-fix")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="Scan only, no writes")
    mode.add_argument("--fix", action="store_true", help="Apply safe auto-fixes")
    args = parser.parse_args()

    files = iter_mdx_files()
    results = [process_file(p, fix=args.fix) for p in files]
    report = aggregate(results, len(files))
    REPORT_PATH.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    s = report["summary"]
    print(f"Scanned {len(files)} MDX files")
    print(f"Mode: {'fix' if args.fix else 'check'}")
    print(f"Files fixed: {s['files_fixed']}")
    print(f"Total fixes: {s['total_fixes']}")
    if s["fix_breakdown"]:
        print("Fix breakdown:", json.dumps(s["fix_breakdown"], ensure_ascii=False))
    print(f"Remaining issues: {s['remaining_issues_count']}")
    print(f"  doc.ruixueyun.com (report only): {s['doc_ruixueyun_com_count']}")
    print(f"  chinese_java_comment (report only): {s['chinese_java_comment_count']}")
    print(f"  maven_credential remaining: {s['maven_credential_remaining']}")
    if s["remaining_by_pattern"]:
        other = {
            k: v
            for k, v in s["remaining_by_pattern"].items()
            if k
            not in ("doc.ruixueyun.com", "chinese_java_comment", "maven_credential")
        }
        if other:
            print(f"  other patterns: {json.dumps(other, ensure_ascii=False)}")
    print(f"Report: {REPORT_PATH.relative_to(ROOT)}")

    # Non-zero exit if remaining auto-fixable issues in check mode
    auto_patterns = {
        "double_fullwidth_semicolon",
        "paren_double_fullwidth_semicolon",
        "semicolon_fullwidth_combo",
        "ascii_fullwidth_semicolon",
        "doc_ruixuehttps",
        "comhttps_glue",
        "generic_comhttps",
        "maven_credential",
    }
    auto_remaining = sum(
        1
        for iss in report["remaining_issues"]
        if iss["pattern"] in auto_patterns
    )
    return 1 if args.check and auto_remaining else 0


if __name__ == "__main__":
    sys.exit(main())
