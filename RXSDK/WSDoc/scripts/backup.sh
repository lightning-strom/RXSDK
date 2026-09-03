#!/usr/bin/env bash
# backup.sh — 备份文档源文件（不含 node_modules/build）
# 用法:
#   ./scripts/backup.sh                  # 备份到 ~/backups/
#   ./scripts/backup.sh /path/to/dir     # 备份到指定目录
set -euo pipefail
cd "$(dirname "$0")/.."

BACKUP_DIR="${1:-$HOME/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE="${BACKUP_DIR}/rx-docs_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 备份文档源文件..."
tar czf "$ARCHIVE" \
  --exclude='node_modules' \
  --exclude='build' \
  --exclude='.docusaurus' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  docs/ \
  versioned_docs/ \
  versioned_sidebars/ \
  versions.json \
  docusaurus.config.ts \
  sidebars.ts \
  static/ \
  src/ \
  package.json \
  package-lock.json \
  tsconfig.json \
  2>/dev/null

SIZE=$(du -sh "$ARCHIVE" | cut -f1)
echo "✅ 备份完成: $ARCHIVE ($SIZE)"

# 清理 30 天前的旧备份
OLD_COUNT=$(find "$BACKUP_DIR" -name "rx-docs_*.tar.gz" -mtime +30 | wc -l | tr -d ' ')
if [ "$OLD_COUNT" -gt 0 ]; then
  find "$BACKUP_DIR" -name "rx-docs_*.tar.gz" -mtime +30 -delete
  echo "🗑️  清理了 $OLD_COUNT 个旧备份（>30天）"
fi
