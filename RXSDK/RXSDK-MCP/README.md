# 瑞雪 SDK MCP 接入指南

## 什么是瑞雪 SDK MCP

瑞雪 SDK MCP 是一个为 AI 编程助手提供的智能接入工具。配置后，你可以在 Cursor 中通过自然语言对话完成 SDK 的接入、代码生成和功能集成，无需手动查阅文档。

支持平台：iOS、Android、Unity、团结 OpenHarmony、Harmony / OpenHarmony、小游戏。

Unity 已支持 v1/v2/团结 OpenHarmony 多版本代码生成：默认生成 v1 分模块 API（`RuiXueSdk` / `RXLogin` / `RXPay` + 双回调）；传入 `version=3.0.0` 等 2.x/3.x 包版本时会自动使用 v2 模板；传入 `sdkApiVersion=tj` / `tuanjie` / `openharmony` 时生成团结 OpenHarmony 版 `RXSDK.RuiXueSdk` 代码。

---

## 配置方式

### 本地接入

在项目根目录创建 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "ruixue-sdk-mcp": {
      "command": "npx",
      "args": ["-y", "ruixue-sdk-mcp"]
    }
  }
}
```

> 需要本地安装 Node.js（v18+）。

### 远程接入

如已部署云端服务，配置 `.cursor/mcp.json`：

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

> 远程地址和 API Key 请联系瑞雪技术支持获取。

### 验证

配置完成后重启 Cursor，打开 **Settings → MCP**，确认 `ruixue-sdk-mcp` 状态为绿色即可。

---

## 如何使用

配置完成后，直接在 Cursor 对话框中用自然语言描述需求，AI 会自动调用 MCP 工具生成代码。

**示例：**

```text
帮我接入瑞雪 SDK，iOS 项目
```

```text
生成 Android 登录功能代码
```

```text
接入微信分享，海外版本
```

```text
Unity 项目添加内购支付
```

```text
Unity v2 项目添加游客登录
```

```text
团结 OpenHarmony 项目添加登录和支付
```

```text
Harmony 项目添加瑞雪 SDK 初始化
```

```text
配置 Facebook 登录，App ID 是 123456
```

不需要记忆任何参数或 API 名称，正常描述需求即可。

---

## Unity 版本说明

Unity 使用统一 MCP 工具 `unity`，通过 `feature` 选择功能模块，并优先根据 `version` 包版本号自动识别 SDK API 代际；团结 OpenHarmony 版可显式传 `sdkApiVersion=tj`。

```text
unity feature=<feature_name> [version=1.6.17|3.0.0|tuanjie-openharmony] [sdkApiVersion=v1|v2|tj] [installType=upm|unitypackage] [workspacePath=项目路径]
```

- `version` 为 `1.x` 时自动走 v1，为 `2.x`/`3.x` 时自动走 v2
- `sdkApiVersion` 可选，仅用于显式覆盖自动识别结果；不传且无法从 `version` 识别时默认 `v1`
- `sdkApiVersion=tj` / `tuanjie` / `openharmony` 走团结 OpenHarmony 版，入口为 `RXSDK.RuiXueSdk`
- `v1` 模板目录：`rxsdk-mcp-server/templates/unity/`
- `v2` 模板目录：`rxsdk-mcp-server/templates/unity_v2/`
- 团结 OpenHarmony 版当前覆盖 `init`、`dependency`、`setup`、`agent`、`login`、`payment`、`share`、`tracking`
- `version` 不传时按代际使用默认值：v1 为 `1.6.17`，v2 为 `3.0.0`，团结版为 `tuanjie-openharmony`
- 当前 Unity 覆盖 31 个 feature，包括 `init`、`dependency`、`setup`、`login`、`payment`、`passport`、`game_character`、`mumu`、`share`、`feedback`、`ad`、`push`、`version_check` 等

常用调用示例：

```text
unity feature=init
unity feature=login
unity feature=login version=3.0.0
unity feature=dependency version=3.0.0 installType=upm
unity feature=setup version=1.6.17 installType=upm workspacePath=/path/to/unity-project
unity feature=init sdkApiVersion=tj
unity feature=payment sdkApiVersion=tj
```

---

## Harmony / OpenHarmony 说明

Harmony 使用独立 MCP 工具 `harmony`，通过 `feature` 选择 ArkTS 功能模板。

```text
harmony feature=<feature_name> [version=3.7.12] [workspacePath=项目路径]
```

- 入口包：`hmssdk`
- 主要入口：`RXApi.getInstance()`
- 初始化：`RXApi.getInstance().init(config, this.getUIContext())`
- 当前仓库本地依赖写法：`"hmssdk": "file:../hmssdk"`；发布包接入时再使用具体版本号
- 当前覆盖 `init`、`dependency`、`setup`、`agent`、`login`、`payment`、`share`、`tracking`

常用调用示例：

```text
harmony feature=dependency version=3.7.12
harmony feature=init
harmony feature=login
harmony feature=payment
```

---

## ruixuego 服务端 SDK 说明

工具名：`ruixuego`。面向 **Go 游戏服 / CP 后端**，生成 [github.com/ruixueyun/ruixuego](https://github.com/ruixueyun/ruixuego) 接入规范与示例代码（模板模式，不直接调用瑞雪云 API）。

与 ios/android 相同：示例中的 **`@test` 是占位符**，写入工程前必须替换为真实业务参数（`APIDomain`、`CPKey`、`ProductID`、`OpenID` 等）。数字类型（如 `CPID`）会用明显假值并附旁注「必须替换」。

```text
ruixuego feature=<feature_name> [version=v0.1.57] [workspacePath=Go模块根路径]
```

**feature 一览：**

| 分组 | feature |
|------|---------|
| 基础接入 | `init` `dependency` `agent` |
| OpenID / 通行证 | `openid` `passport` |
| 社交 / LBS / 排行榜 | `social` `lbs` `rank` |
| 大数据 / IMS / 推送 | `bigdata` `ims` `pusher` |
| 风控 / 支付 / 运营 | `risk` `pay` `operation` |
| 角色 / 归因 / 私域 | `cp_role` `attribution` `siyu` |

常用示例：

```text
ruixuego feature=dependency
ruixuego feature=init
ruixuego feature=openid
ruixuego feature=social workspacePath=/path/to/game-server
ruixuego feature=bigdata workspacePath=/path/to/game-server
ruixuego feature=rank
```

推荐顺序：`dependency` → `init`（替换全部 `@test`）→ 按业务调用对应 feature。传入 `workspacePath` 时，非基础 feature 会检查 `go.mod` 是否含 `ruixuego`、工程是否已有 `ruixuego.Init(`。

---

## operation-api HTTP Schema 说明（`api_schema`）

工具名：`api_schema`。面向 **瑞雪分享裂变运营 HTTP API**（operation-api），返回 JSON Schema 2020-12 格式的请求/响应结构。与 `ruixuego`（游戏服 Go SDK）不同，不要混用。

```text
api_schema source=operation_api path=<路由> [module=<模块>] [keyword=<关键词>]
```

- `source`：固定填 `operation_api`
- `path` / `module` / `keyword` 至少一项，可组合
- `path` 精确或后缀匹配（如 `share/data`），不会用 `url` 匹配全部 `url/*`
- `module=legal` 可覆盖 `legal/terms` 与 `legal_terms_other`

常用示例：

```text
查 share/data 接口的请求和返回字段
api_schema source=operation_api path=share/data

列出 legal 模块相关接口 schema
api_schema source=operation_api module=legal

哪个接口需要 product_id
api_schema source=operation_api keyword=product_id
```

schema 数据嵌入 MCP 二进制，由维护脚本从 operation-api **只读**同步（不修改 operation-api 仓库）：

```bash
./scripts/sync-operation-api-schema.sh
```

详见 `rxsdk-mcp-server/knowledge/api_schemas/README.md`。

