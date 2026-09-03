# MCP Server 同步规则

## 适用范围
当用户要求"同步 MCP server"、"编译 MCP server"、"更新 MCP server" 时适用此规则。

## 执行步骤

当需要同步/编译 MCP server 时，必须执行以下脚本：

```bash
cd /Users/chenhan/Desktop/Git/RXSDK/RXSDK-MCP/rxsdk-mcp-server && bash gen_mcp_server.sh
```

## 脚本说明

`gen_mcp_server.sh` 会执行以下操作：
1. 编译 macOS ARM64 版本 (ruixue-sdk-mcp-darwin)
2. 编译 Linux AMD64 版本 (ruixue-sdk-mcp-linux)
3. 编译 Windows AMD64 版本 (ruixue-sdk-mcp.exe)
4. 将编译产物移动到 `../ruixue-sdk-mcp/go-bin` 目录

## 注意事项

- 需要网络权限下载依赖（如有需要）
- 如果 goproxy.cn 不可用，使用 `GOPROXY=direct` 环境变量
- 执行完成后确认文件已正确移动到目标目录
