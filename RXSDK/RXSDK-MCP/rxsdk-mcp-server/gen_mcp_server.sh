#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

LDFLAGS="-s -w"
OUT_DIR="$ROOT_DIR/ruixue-sdk-mcp/go-bin"
mkdir -p "$OUT_DIR"

echo "==> Building for macOS (arm64)..."
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags="$LDFLAGS" -o "$OUT_DIR/ruixue-sdk-mcp-darwin" ./cmd/mcp

echo "==> Building for Linux (amd64)..."
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="$LDFLAGS" -o "$OUT_DIR/ruixue-sdk-mcp-linux" ./cmd/mcp

echo "==> Building for Windows (amd64)..."
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags="$LDFLAGS" -o "$OUT_DIR/ruixue-sdk-mcp.exe" ./cmd/mcp

chmod +x "$OUT_DIR/ruixue-sdk-mcp-darwin" "$OUT_DIR/ruixue-sdk-mcp-linux" 2>/dev/null || true

echo "==> Done! Binaries in $OUT_DIR"
echo "    stdio:  ./ruixue-sdk-mcp-darwin"
echo "    http:   MCP_MODE=http MCP_API_KEY=xxx PORT=8080 ./ruixue-sdk-mcp-darwin"