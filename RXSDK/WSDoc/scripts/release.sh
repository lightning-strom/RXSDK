#!/usr/bin/env bash
# release.sh — 文档热更新：把静态产物发布到挂载目录并原子切换 current 软链接
# nginx 容器常驻、零重启即可生效（详见 docker-compose.yml 挂载模式）
#
# 用法:
#   ./scripts/release.sh                 # 本地 npm run build 后发布 build/
#   ./scripts/release.sh --from build    # 发布已构建好的目录（如 CI 产物）
#   ./scripts/release.sh --from site.tar.gz  # 发布 tar 包内的产物
#   ./scripts/release.sh --rollback      # 回滚到上一个版本
#   ./scripts/release.sh --list          # 列出已有版本
#
# 环境变量:
#   SITE_DIR  站点根目录（默认 /opt/rx-docs/site），需与 docker-compose 一致
#   KEEP      保留最近多少个版本（默认 5）
set -euo pipefail
cd "$(dirname "$0")/.."

SITE_DIR="${SITE_DIR:-/opt/rx-docs/site}"
KEEP="${KEEP:-5}"
RELEASES_DIR="${SITE_DIR}/releases"
FROM=""
ACTION="release"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from) FROM="$2"; shift 2 ;;
    --rollback) ACTION="rollback"; shift ;;
    --list) ACTION="list"; shift ;;
    --help|-h)
      sed -n '2,18p' "$0"; exit 0 ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

mkdir -p "$RELEASES_DIR"

list_releases() {
  ls -1 "$RELEASES_DIR" 2>/dev/null | sort
}

if [[ "$ACTION" == "list" ]]; then
  current_target="$(readlink "${SITE_DIR}/current" 2>/dev/null || echo '(无)')"
  echo "当前: $current_target"
  echo "版本:"
  list_releases | sed 's/^/  /'
  exit 0
fi

if [[ "$ACTION" == "rollback" ]]; then
  mapfile -t vers < <(list_releases)
  if [[ ${#vers[@]} -lt 2 ]]; then
    echo "❌ 版本不足，无法回滚"; exit 1
  fi
  prev="${vers[-2]}"
  ln -sfn "releases/${prev}" "${SITE_DIR}/current.tmp"
  mv -Tf "${SITE_DIR}/current.tmp" "${SITE_DIR}/current"
  echo "↩️  已回滚到: $prev"
  exit 0
fi

# ── 发布流程 ──────────────────────────────────────────────
WORKDIR=""
cleanup() { [[ -n "$WORKDIR" && -d "$WORKDIR" ]] && rm -rf "$WORKDIR"; }
trap cleanup EXIT

if [[ -z "$FROM" ]]; then
  echo "🔨 本地构建 (npm run build)..."
  npm run build
  SRC="build"
elif [[ -f "$FROM" ]]; then
  echo "📦 解包产物: $FROM"
  WORKDIR="$(mktemp -d)"
  tar -xzf "$FROM" -C "$WORKDIR"
  # 兼容 tar 内含或不含顶层目录两种情况
  if [[ -f "$WORKDIR/index.html" ]]; then
    SRC="$WORKDIR"
  else
    SRC="$(find "$WORKDIR" -maxdepth 2 -name index.html -printf '%h\n' | head -1)"
  fi
elif [[ -d "$FROM" ]]; then
  SRC="$FROM"
else
  echo "❌ --from 路径不存在: $FROM"; exit 1
fi

if [[ ! -f "$SRC/index.html" ]]; then
  echo "❌ 产物目录缺少 index.html: $SRC"; exit 1
fi

TS="$(date +%Y%m%d-%H%M%S)"
REL="${RELEASES_DIR}/${TS}"
echo "📂 写入新版本: $REL"
mkdir -p "$REL"
rsync -a --delete "$SRC/" "$REL/"

# 原子切换 current（ln -sfn + mv -T 确保 rename 级原子替换）
ln -sfn "releases/${TS}" "${SITE_DIR}/current.tmp"
mv -Tf "${SITE_DIR}/current.tmp" "${SITE_DIR}/current"
echo "🔗 current → releases/${TS}"

# 清理旧版本，保留最近 KEEP 个
mapfile -t all < <(list_releases)
if (( ${#all[@]} > KEEP )); then
  remove=$(( ${#all[@]} - KEEP ))
  for old in "${all[@]:0:$remove}"; do
    rm -rf "${RELEASES_DIR:?}/${old}"
    echo "🧹 清理旧版本: $old"
  done
fi

echo ""
echo "✅ 热更新完成，nginx 已即时生效（无需重启容器）"
echo "   版本: $TS"
echo "   访问: http://localhost:3000"
