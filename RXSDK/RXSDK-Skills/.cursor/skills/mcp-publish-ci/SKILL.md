---
name: mcp-publish-ci
description: RXSDK MCP 服务更新和发布 CI 操作规范。Use when the user says mcp 服务更新、更新 MCP 服务、发布 MCP、MCP 发布、触发 MCP GitLab CI、构建 MCP 镜像、更新 ruixue-sdk-mcp 远程服务或排查 MCP 发布流水线。必须按 CI 发布流程处理服务更新/发布，涵盖版本 tag 递增、发布前验证、GitLab CI 变量、构建产物检查、发布后验证和敏感信息处理。
---

# MCP 发布 CI 规范

用于 RXSDK MCP 服务的发布、CI 触发、镜像构建和发布问题排查。

## 适用范围

- 用户要求“mcp 服务更新”、“更新 MCP 服务”、“执行 mcp 服务更新”
- 用户要求“发布 MCP”、“MCP 发布”、“mcp 发布 ci”
- 用户要求触发或排查 `RXSDK-MCP/.gitlab-ci.yml`
- 用户要求构建 `ruixue-sdk-mcp` 远程 HTTP 服务镜像
- 用户明确要求同步/编译 MCP 二进制产物

## 强制执行规则

- 当用户说“mcp 服务更新”或“发布 MCP”时，默认目标是远程 MCP 服务更新，必须走 GitLab CI 发布流程。
- 不要只运行 `gen_mcp_server.sh` 就回复“服务已更新”；本地同步二进制不等于远程服务发布。
- 只有用户明确说“本地同步 MCP 二进制”“本地编译 MCP server”时，才只执行本地同步二进制流程。
- 如果缺少 GitLab API 凭证、远程权限、版本号或触发 CI 所需信息，先说明阻塞项并询问用户。

## 关键路径

| 用途 | 路径 |
| --- | --- |
| MCP 仓库 | `RXSDK-MCP/` |
| CI 配置 | `RXSDK-MCP/.gitlab-ci.yml` |
| CI 构建入口 | `RXSDK-MCP/Makefile` |
| MCP 服务入口 | `RXSDK-MCP/cmd/mcp/main.go` |
| 本地多平台编译脚本 | `RXSDK-MCP/rxsdk-mcp-server/gen_mcp_server.sh` |
| npm 包目录 | `RXSDK-MCP/ruixue-sdk-mcp/` |

## 版本 tag 规则

- 当前记录 tag：`v1.0.3`
- tag 格式固定为 `vx.x.x`，例如 `v1.0.3`
- 发布版本时，如果用户没有指定版本号，就将最后一位加 1
- 基于当前记录 tag，默认下一个发布版本为 `v1.0.4`
- 如果用户指定版本号，必须先确认格式符合 `v数字.数字.数字`

## 发布前检查

1. 进入 `RXSDK-MCP/`，确认这是独立 Git 仓库：

```bash
git status --short
git branch --show-current
```

1. 确定本次发布 tag：

```text
用户指定版本号：使用用户指定的 vx.x.x
用户未指定版本号：使用当前记录 tag 的 patch + 1
```

1. 确认本地 Git 操作、推送和 CI 触发命令没有报错即可继续：

```bash
git status -sb
git push origin <branch>
git push origin <tag>
```

1. 本地验证不是发布前强制项。除非用户明确要求，发布前不需要执行：

```bash
go mod download
make test
make lint
make race
make release name=mcp
```

1. 如果上一步命令已执行且没有报错，可继续发布；如果命令报错，先停止并说明报错，不要继续触发 CI。

> 说明：质量检查、测试、release 构建由 GitLab CI 负责；本地无需重复验证。

## GitLab CI 发布参数

`RXSDK-MCP/.gitlab-ci.yml` 只允许通过 Web 或 API 触发：

```yaml
rules:
  - if: '$CI_PIPELINE_SOURCE == "web" || $CI_PIPELINE_SOURCE == "api"'
```

触发流水线时使用以下变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `CPID` | `2000144` | 发布目标 CPID；只能指定一个 CPID 或 `all` |
| `CMD` | `mcp` | `cmd/` 下要发布的入口名；MCP 服务使用 `mcp` |
| `JUMPTEST` | `1` | 是否跳过静态检查和测试；正式发布建议设为 `0` |
| `USECGO` | `0` | 是否启用 CGO；MCP 默认 `0` |
| `CMDENV` | 空 | 注入给程序的环境变量，程序可从 `GO_CI_ENV` 读取 |
| `PORTLIST` | `8080,8081,8888` | 镜像开放端口列表 |

推荐正式发布变量：

```text
CPID=2000144
CMD=mcp
JUMPTEST=0
USECGO=0
CMDENV=
PORTLIST=8080,8081,8888
```

## CI 执行逻辑

CI 会按顺序执行：

1. 设置 Go 代理和私有仓库认证
2. `go mod download`
3. 当 `JUMPTEST != 1` 时执行 `make lint`、`make test`、`make race`
4. 执行 `make release name=mcp`
5. 生成 `mcp-linux-amd64`
6. 调用 `buildimage` 构建并发布镜像

## ciconfig 配置要求

镜像构建依赖 `ruixue/ciconfig` 项目中的：

```text
build/${CPID}/config.sh
```

配置项应包含：

```bash
RegistryHost="registry.cn-beijing.aliyuncs.com"
RegistryImageNamespace="haiqiruixue"
NotifyURL="http://gw.ruixueyun.com/api/v1/gwadmin/git/save_image"
```

如果 CI 在 `buildimage` 阶段失败，优先检查该 CPID 的 ciconfig 是否存在、变量是否正确、镜像仓库权限是否可用。

## 本地同步二进制

仅当用户明确要求“本地同步 MCP server”、“本地编译 MCP server”、“同步 MCP 二进制”时，执行：

```bash
cd /Users/chenhan/Desktop/Git/RXSDK/RXSDK-MCP/rxsdk-mcp-server
bash gen_mcp_server.sh
```

脚本会生成并移动：

- `ruixue-sdk-mcp-darwin`
- `ruixue-sdk-mcp-linux`
- `ruixue-sdk-mcp.exe`

目标目录：

```text
RXSDK-MCP/ruixue-sdk-mcp/go-bin/
```

注意：当用户要求“mcp 服务更新”或“发布”时，本地同步二进制最多作为发布前验证步骤之一，后续仍必须继续触发或指导触发 GitLab CI。

## 发布后验证

1. 确认 CI 成功，且日志中出现 `build_image` 完成信息。
2. 确认目标 CPID 收到新镜像通知。
3. 远程 MCP 服务更新后，用 Cursor MCP 配置验证：

```json
{
  "mcpServers": {
    "ruixue-sdk-mcp": {
      "type": "http",
      "url": "https://rx-sdk-mcp.ruixueyun.com/mcp",
      "headers": {
        "Content-Type": "application/json",
        "Tool-Range": "[]"
      }
    }
  }
}
```

1. 重启 Cursor 后检查 Settings -> MCP 中 `ruixue-sdk-mcp` 是否为绿色。
1. 用一个简单需求验证工具可用，例如“生成 Android 登录功能代码”。

## 敏感信息规则

- 不要在回复中输出 token、私钥、CI 凭证或仓库访问密钥。
- 如果必须查看带密钥的脚本或配置，只说明是否存在和是否疑似可用，不复述具体值。
- 不要把凭证文件加入提交；发现凭证变更时先提醒用户确认。

## 常见问题

- `go mod download` 失败：检查网络、Go 代理和私有仓库权限。
- `make lint` 失败：如果是 CI 中失败，先修复 lint；本地发布前未执行 lint 不视为阻塞。
- `make race` 失败：确认是否因 CGO 环境缺失导致；race 测试需要 `CGO_ENABLED=1`。
- 找不到 `mcp-linux-amd64`：检查 `CMD=mcp`、`cmd/mcp/main.go` 是否存在，以及 `make release name=mcp` 是否成功。
- `buildimage` 失败：检查 `CPID`、ciconfig、镜像仓库权限和 `PORTLIST`。
