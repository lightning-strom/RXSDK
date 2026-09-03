#!/usr/bin/env bash
# build-check.sh — 构建前检查：链接、类型、构建
# 用法:
#   ./scripts/build-check.sh          # 全量检查
#   ./scripts/build-check.sh --quick  # 只检查类型+构建
set -euo pipefail
cd "$(dirname "$0")/.."

QUICK=false
[[ "${1:-}" == "--quick" ]] && QUICK=true

ERRORS=0

step() { echo -e "\n── $1 ──"; }

# 1. 类型检查
step "TypeScript 类型检查"
if npm run typecheck 2>&1; then
  echo "  ✅ 类型检查通过"
else
  echo "  ❌ 类型检查失败"
  ((ERRORS++))
fi

# 2. 构建
step "Docusaurus 构建"
if npm run build 2>&1; then
  echo "  ✅ 构建成功"
else
  echo "  ❌ 构建失败"
  ((ERRORS++))
fi

# 3. 构建产物检查
step "构建产物检查"
if [ -f "build/index.html" ]; then
  FILE_COUNT=$(find build -type f | wc -l | tr -d ' ')
  SIZE=$(du -sh build | cut -f1)
  echo "  ✅ build/ 目录: ${FILE_COUNT} 个文件, ${SIZE}"
else
  echo "  ❌ build/index.html 不存在"
  ((ERRORS++))
fi

# 4. 死链检查（非 quick 模式）
if ! $QUICK; then
  step "Broken links 检查"
  BROKEN=$(grep -r "onBrokenLinks" docusaurus.config.ts | grep -c "throw" || true)
  if [ "$BROKEN" -gt 0 ]; then
    echo "  ⚠️  onBrokenLinks=throw，构建时已检查"
  else
    echo "  ℹ️  onBrokenLinks=warn，跳过独立检查"
  fi
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ 全部通过"
else
  echo "❌ ${ERRORS} 项失败"
  exit 1
fi
