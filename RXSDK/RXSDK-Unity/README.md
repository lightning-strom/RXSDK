# 瑞雪 Unity SDK（RuiXue Unity SDK）

本仓库为 **Unity Package Manager（UPM）** 形式的瑞雪 SDK 源码与示例工程，按功能拆分为多个 `com.ruixue.*` 包，业务项目可按需引用。

## 环境要求

- **Unity**：建议与 `ProjectSettings/ProjectVersion.txt` 中版本一致（当前为 **2022.3 LTS** 系列）。
- **Node.js**：用于维护脚本（如批量生成 README、发布 UPM），可选。

## 业务工程接入（UPM）

### 1. 配置 Scoped Registry

在目标 Unity 工程的 `Packages/manifest.json` 中增加私有源（地址与账号以你们环境为准），例如：

```json
{
  "scopedRegistries": [
    {
      "name": "RuiXueUnitySdk",
      "url": "http://60.205.123.114:4873",
      "scopes": [ "com.ruixue" ]
    }
  ],
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.17"
  }
}
```

### 2. 添加依赖

在 `dependencies` 中声明需要的包，**所有 `com.ruixue.*` 包版本号应与 `com.ruixue.unitysdk.base` 保持一致**。

### 3. 初始化顺序

先完成 **RuiXue.Base**（`RuiXueSdk` 初始化），再调用各业务模块 API。

---

## 本仓库目录说明

| 路径 | 说明 |
|------|------|
| `Packages/com.ruixue.unitysdk.*` | 各 UPM 分包源码，每包含 `package.json`、`Runtime`、`README.md` 等 |
| `Assets/` | 示例资源、Android/iOS 插件与工程级配置（如 `Plugins/Android/mainTemplate.gradle`） |
| `scripts/` | 发布、依赖切换、README 生成等脚本，见 [`scripts/README.md`](scripts/README.md) |

---

## UPM 分包一览

| UPM 名称 | 显示名 | 说明 |
|----------|--------|------|
| `com.ruixue.unitysdk.ad` | RuiXue.Ad | 广告库 |
| `com.ruixue.unitysdk.adjust` | RuiXue.Adjust | Adjust 桥接 |
| `com.ruixue.unitysdk.alidns` | RuiXue.AliDns | 阿里 DNS 桥接 |
| `com.ruixue.unitysdk.analysis` | RuiXue.Analysis | 数据上报 |
| `com.ruixue.unitysdk.base` | RuiXue.Base | 基础库（必引） |
| `com.ruixue.unitysdk.bytedance` | RuiXue.Bytedance | 抖音 SDK |
| `com.ruixue.unitysdk.facebook` | RuiXue.Facebook | Facebook 桥接 |
| `com.ruixue.unitysdk.feedback` | RuiXue.Feedback | 反馈库 |
| `com.ruixue.unitysdk.firebase` | RuiXue.Firebase | Firebase 桥接 |
| `com.ruixue.unitysdk.gdt` | RuiXue.GDT | 腾讯广告 GDT Android/iOS 数据上报 |
| `com.ruixue.unitysdk.google` | RuiXue.Google | Google 桥接 |
| `com.ruixue.unitysdk.helpcenter` | RuiXue.Help | 帮助中心 |
| `com.ruixue.unitysdk.im` | RuiXue.IM | 即时通信 |
| `com.ruixue.unitysdk.instagram` | RuiXue.Instagram | Instagram 桥接 |
| `com.ruixue.unitysdk.lbs` | RuiXue.LBS | 定位 |
| `com.ruixue.unitysdk.legal` | RuiXue.Legal | 法务条款 |
| `com.ruixue.unitysdk.line` | RuiXue.Line | Line 桥接 |
| `com.ruixue.unitysdk.login` | RuiXue.Login | 账号登录 |
| `com.ruixue.unitysdk.oaidv2` | RuiXue.Oaidv2 | OAID 等（见包内说明） |
| `com.ruixue.unitysdk.pay` | RuiXue.Pay | 支付 |
| `com.ruixue.unitysdk.push` | RuiXue.Push | 推送 |
| `com.ruixue.unitysdk.qoo` | RuiXue.Qoo | Qoo 相关 |
| `com.ruixue.unitysdk.quick` | RuiXue.quick | Quick |
| `com.ruixue.unitysdk.rank` | RuiXue.Rank | 排行 |
| `com.ruixue.unitysdk.reddit` | RuiXue.Reddit | Reddit 桥接 |
| `com.ruixue.unitysdk.review` | RuiXue.Review | 评分 |
| `com.ruixue.unitysdk.share` | RuiXue.Share | 分享 |
| `com.ruixue.unitysdk.snapchat` | RuiXue.SnapChat | Snapchat 桥接 |
| `com.ruixue.unitysdk.social` | RuiXue.Social | 社交 |
| `com.ruixue.unitysdk.tiktok` | RuiXue.TikTok | TikTok 桥接 |
| `com.ruixue.unitysdk.txdns` | RuiXue.TxDns | 腾讯 DNS 桥接 |
| `com.ruixue.unitysdk.ui` | RuiXue.UI | 登录界面（国内） |
| `com.ruixue.unitysdk.uifeedback` | RuiXue.UIFeedback | 意见反馈 UI |
| `com.ruixue.unitysdk.uioverseas` | RuiXue.UIOverseas | 登录界面（海外） |
| `com.ruixue.unitysdk.unipin` | RuiXue.UniPin | UniPin 桥接 |
| `com.ruixue.unitysdk.uwa` | RuiXue.Uwa | UWA 相关 |
| `com.ruixue.unitysdk.versioncheck` | RuiXue.VersionCheck | 版本检查 |
| `com.ruixue.unitysdk.minigame.douyin` | RuiXue.MiniGame.DouYin | 抖音小游戏 WebGL（目录名 `webgl.douyin`） |
| `com.ruixue.unitysdk.minigame.weixin` | RuiXue.MiniGame.WeiXin | 微信小游戏 WebGL（目录名 `webgl.weixin`） |
| `com.ruixue.unitysdk.weixin` | RuiXue.WeiXin | 微信 |
| `com.ruixue.unitysdk.zalo` | RuiXue.Zalo | Zalo 桥接 |

各包详细说明见对应目录下的 **`README.md`**。

---

## MCP 接口（Unity 代码生成）

本仓库是 Unity SDK 代码仓库，**不内置 MCP Server**。
Unity MCP 工具定义在 `rxsdk-mcp/rxsdk-mcp-server/unity.go`，工具名为 `unity`。

### 调用参数

- `feature`：必填，功能模块名
- `version`：可选，依赖/接入版本；`1.x` 自动走 v1，`2.x`/`3.x` 自动走 v2
- `sdkApiVersion`：可选，`v1` 或 `v2`，仅用于显式覆盖自动识别结果
- `installType`：可选，`upm` 或 `unitypackage`（常用于 `dependency`/`setup`）
- `workspacePath`：可选，`setup` 时使用

### Feature 列表（30 个）

- 基础接入：`init` `agent` `dependency` `setup`
- 账号与支付：`login` `payment`
- 通行证：`passport` `captcha` `real_auth` `account_binding` `password` `deregister`
- 社交与游戏：`social` `friends` `lbs` `rank` `game_area` `game_character`
- 其他能力：`share` `feedback` `tracking` `legal_ui` `promo` `announcement` `device` `user_center` `ad` `push` `version_check` `review`

> 说明：MCP 的 `feature` 是“能力级”抽象，不与 SDK 包结构做 1:1 映射。

### 调用示例（统一模板）

```bash
# v1 初始化/登录规范（默认 v1，也可传 version=1.6.17）
unity feature=init
unity feature=login version=1.6.17

# v2 初始化/登录规范（version=3.0.0 自动识别 v2）
unity feature=init version=3.0.0
unity feature=login version=3.0.0

# 生成依赖接入步骤（UPM）
unity feature=dependency version=1.6.17 installType=upm
unity feature=dependency version=3.0.0 installType=upm

# 生成自动接入步骤
unity feature=setup version=1.6.17 installType=upm workspacePath=/path/to/unity-project
unity feature=setup version=3.0.0 installType=upm workspacePath=/path/to/unity-project
```

---

## Android 原生依赖（国内 / 海外）

Gradle 模板位于 `Assets/Plugins/Android/mainTemplate.gradle`。**国内**与**海外**一般通过 `rxsdk_weile` / `rxsdk_overseas` 二选一（勿同时启用），具体版本与仓库地址以瑞雪 Maven 配置为准。

便捷切换（脚本说明见 [`scripts/README.md`](scripts/README.md)）：

- `./scripts/android-deps-overseas.sh` — 切到海外依赖  
- `./scripts/android-deps-domestic.sh` — 切回国内依赖  

---

## 维护与发布

- **批量更新各包 README**（根据 `package.json` 生成）：`node scripts/generate-readmes.mjs`
- **发布到 UPM 私有源**：`./scripts/publish-upm.sh`（用法见 [`scripts/README.md`](scripts/README.md)）

---

## 文档与变更

- 接口与业务细节以**瑞雪内部文档**为准；本仓库 README 用于导航与工程约定。
- 各包变更见包内 `CHANGELOG.md`（若有）。

---

## 许可证

内部项目以公司/仓库约定为准；未对外声明开源许可证时请勿擅自对外分发。
