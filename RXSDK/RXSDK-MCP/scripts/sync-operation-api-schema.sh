#!/usr/bin/env bash
# 从 operation-api 同步 schema 到本仓库（只读外部源码，不修改 operation-api）。
set -euo pipefail
cd "$(dirname "$0")/../rxsdk-mcp-server"
ROOT="${OPERATION_API_ROOT:-../../operation-api}"
go run ./cmd/schemagen -root "$ROOT" -out ./knowledge/api_schemas/operation_api.json
go test -count=1 ./schemagen ./ -run TestApiSchema 2>&1 | tail -5
