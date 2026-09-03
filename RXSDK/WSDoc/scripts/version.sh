#!/usr/bin/env bash
# version.sh — Docusaurus 版本管理
# 用法:
#   ./scripts/version.sh                  # 查看当前版本
#   ./scripts/version.sh create v3.6      # 创建新版本
#   ./scripts/version.sh list             # 列出所有版本
set -euo pipefail
cd "$(dirname "$0")/.."

ACTION="${1:-show}"

case "$ACTION" in
  show|"")
    echo "📌 当前版本:"
    cat versions.json 2>/dev/null || echo "(无版本文件)"
    echo ""
    echo "📂 版本目录:"
    ls -d versioned_docs/version-* 2>/dev/null || echo "(无版本目录)"
    ;;
  create|new)
    VERSION="${2:?用法: $0 create <version>，如 $0 create v3.6}"
    echo "📦 创建版本: $VERSION"
    npm run docs:version -- "$VERSION"
    echo "✅ 版本 $VERSION 创建完成"
    echo "   版本文件: versioned_docs/version-${VERSION}/"
    echo "   更新 versions.json 后可通过 sidebars 调整"
    ;;
  list)
    echo "📋 所有版本:"
    cat versions.json 2>/dev/null | python3 -c "
import json, sys
versions = json.load(sys.stdin)
for i, v in enumerate(versions):
    marker = ' ← 当前' if i == 0 else ''
    print(f'  {i+1}. {v}{marker}')
" 2>/dev/null || echo "(无版本文件)"
    ;;
  *)
    echo "用法: $0 [show|create <version>|list]"
    exit 1 ;;
esac
