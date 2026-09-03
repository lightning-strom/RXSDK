#!/usr/bin/env bash
# deploy.sh — 一键构建 Docker 镜像并部署
# 用法:
#   ./scripts/deploy.sh              # 构建 + 部署
#   ./scripts/deploy.sh --build-only # 只构建不部署
#   ./scripts/deploy.sh --tag v3.6   # 指定 tag
set -euo pipefail
cd "$(dirname "$0")/.."

IMAGE_NAME="rx-docs"
TAG="latest"
BUILD_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build-only) BUILD_ONLY=true; shift ;;
    --tag) TAG="$2"; shift 2 ;;
    --help|-h)
      echo "用法: $0 [--build-only] [--tag <version>]"
      echo "  --build-only  只构建镜像，不启动容器"
      echo "  --tag <ver>   指定镜像 tag（默认 latest）"
      exit 0 ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

echo "🔨 构建镜像: ${IMAGE_NAME}:${TAG}"
docker build -t "${IMAGE_NAME}:${TAG}" .

if $BUILD_ONLY; then
  echo "✅ 构建完成（--build-only），未启动容器"
  exit 0
fi

echo "🚀 部署容器..."
docker compose down 2>/dev/null || true
docker compose up -d

echo ""
echo "✅ 部署完成"
echo "   访问: http://localhost:3000"
echo "   日志: docker compose logs -f rx-docs"
echo "   停止: docker compose down"
