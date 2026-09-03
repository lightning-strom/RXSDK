# RXSDK 项目规则

## iOS 真机验证

当任务涉及 iOS 新建项目、工程配置、构建验证、测试验证、Demo 验证或 SDK 接入验证时：

- 不需要验证 iOS 模拟器，也不需要为了验证任务而安装、启动或调试模拟器。
- 验证结论以真机为准；能连接真机时，只执行真机构建、安装、运行或测试验证。
- 如果当前环境没有可用真机，回复中明确说明“未进行真机验证”，不要将未验证模拟器视为失败或阻塞项。
- 除非用户明确要求模拟器相关适配或排查，否则不要把模拟器兼容性作为默认检查项。

## MCP 本地同步

当用户明确要求“同步 MCP server”或“编译 MCP server”时，执行：

```bash
cd /Users/chenhan/Desktop/Git/RXSDK/RXSDK-MCP/rxsdk-mcp-server
bash gen_mcp_server.sh
```

- 脚本负责构建 macOS ARM64、Linux AMD64 和 Windows AMD64 产物，并同步至 `../ruixue-sdk-mcp/go-bin`。
- 如需下载依赖而 `goproxy.cn` 不可用，使用 `GOPROXY=direct`。
- 执行完成后确认目标目录中的产物已更新。

## MCP 服务更新与发布

当用户要求“mcp 服务更新”、“更新 MCP 服务”、“发布 MCP”、“MCP 发布”、“触发 MCP CI”或同义操作时，必须执行 `.agents/skills/mcp-publish-ci/SKILL.md` 中的 CI 发布流程。

- 不要只运行 `gen_mcp_server.sh` 就宣称服务已更新；该脚本只用于本地二进制同步或发布前验证。
- 默认正式发布变量：`CPID=2000144`、`CMD=mcp`、`JUMPTEST=0`、`USECGO=0`、`PORTLIST=8080,8081,8888`。
- 发布前检查 `RXSDK-MCP/` 独立 Git 仓库状态，并执行 Skill 要求的测试和 release 构建验证。
- 缺少 GitLab API 凭证、远程权限或必要版本号信息时，明确阻塞项并询问用户。
- 不得输出 token、私钥、CI 凭证或镜像仓库密钥。
