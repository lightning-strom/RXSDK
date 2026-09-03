#!/usr/bin/env bash
# dev.sh — 开发模式快捷启动
# 用法:
#   ./scripts/dev.sh           # 启动开发服务器 (localhost:3000)
#   ./scripts/dev.sh --port 3001  # 指定端口
#   ./scripts/dev.sh --lan     # 局域网可访问 (0.0.0.0)
set -euo pipefail
cd "$(dirname "$0")/.."

PORT=3000
HOST="localhost"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port) PORT="$2"; shift 2 ;;
    --lan) HOST="0.0.0.0"; shift ;;
    --help|-h)
      echo "用法: $0 [--port <num>] [--lan]"
      echo "  --port <num>  指定端口（默认 3000）"
      echo "  --lan         监听 0.0.0.0，局域网可访问"
      exit 0 ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

echo "🚀 启动开发服务器: http://${HOST}:${PORT}"
echo "   Ctrl+C 停止"
npm run start -- --host "$HOST" --port "$PORT"
