# API Schema 知识库

JSON Schema 2020-12 接口定义，供 MCP `api_schema` 工具检索。

**rxsdk-mcp 运行时只 embed 并提供检索**，不在请求处理中解析外部源码。

## 维护同步（不修改 operation-api 仓库）

从 operation-api **只读**拉取 struct + 已注册路由，生成本文件：

```bash
# 在 rxsdk-mcp 根目录
export OPERATION_API_ROOT=/path/to/operation-api   # 可选
./scripts/sync-operation-api-schema.sh
```

或：

```bash
cd rxsdk-mcp-server
go run ./cmd/schemagen -root ../../operation-api -out ./knowledge/api_schemas/operation_api.json
```

生成前会执行质量校验（`$schema`、无畸形 property key 等）。提交更新后的 `operation_api.json` 即可发布。

## 格式

- `source`: `operation_api`
- `endpoints[]`: `path`, `method`, `module`, `requestSchema`, `responseSchema`

## 新增 API 来源

1. 增加 `{source}.json`
2. 在 `api_schema.go` 注册 embed 与 source 枚举
