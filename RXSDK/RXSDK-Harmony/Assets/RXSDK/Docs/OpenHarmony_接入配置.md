# 团结（Tuanjie）鸿蒙 — 对外接入配置说明

适用工程：`ruixue_tj_unity`（瑞雪 OpenHarmony / 团结引擎包）  
当前 SDK 版本：`3.10.1`（`Assets/RXSDK/Runtime/Version.cs` → `Version.INFO`）  
发布物示例：`publish/rxsdk_harmony_v3.10.1.unitypackage`

> 本文面向 **CP / 宿主工程接入配置**。原生 ArkTS 直连 `hmssdk` 见 MCP `harmony` 工具或 `ruixue_harmony` 工程，不在此展开。

---

## 1. 接入产物

| 项 | 说明 |
| --- | --- |
| UnityPackage | `rxsdk_harmony_v*.unitypackage`，导入宿主团结工程 |
| 运行时入口 | C# `RXSDK.RuiXueSdk`（回调类型 `RXCallback<T>`） |
| 原生桥接 | `Assets/Plugins/OpenHarmony/`（含 `HMSMessageBind`、`RXInterface`、WebView 等） |
| 原生 HAR | `hmssdk.har`（由 `ruixue_harmony` 同步进 OpenHarmony libs） |

引擎要求：团结 **≥ 1.10**（Editor 如 `2022.3.62t12`）时按本文 TJ1.10 配置；更低版本请与瑞雪确认兼容包。

---

## 2. Player Settings（唯一配置源）

在团结编辑器：**Edit → Project Settings → Player → OpenHarmony**。

| 配置项 | 用途 | 导出落点 |
| --- | --- | --- |
| Application Identifier | 包名 `bundleName` | `AppScope/app.json5` |
| OpenHarmony App ID | AGC 应用 ID | `entry/.../module.json5` → `metadata.app_id` |
| OpenHarmony Client ID | Account Kit OAuth Client ID | `entry/.../module.json5` → `metadata.client_id` |
| Publishing → Keystore / Profile / Cert | 签名材料路径 | 导出工程 `build-profile.json5` → `signingConfigs` |
| Compatible SDK / API Level | 兼容 API | `compatibleSdkVersion`（由导出后处理写入） |

说明：

- **不要**再使用已废弃的 `HMSSetting.asset`。
- Account Kit 报错 `1001502003` 多为 **Client ID 与 Profile 包名不匹配**；以 entry `module.json5` 的 `client_id` 为准。
- `targetSdkVersion` 由 SDK 导出后处理固定为 **`6.1.0(23)`**；`compatibleSdkVersion` 跟随 Player Settings API Level。

### 参考测试包（捕鱼）

| 字段 | 值 |
| --- | --- |
| bundleName | `com.jixiang.game.fish.os.huawei` |
| Client ID | `111965797` |
| APP ID | `5765880207855351397` |

---

## 3. 签名密码（本地机密，不进仓库）

团结 Export 会把 `storePassword` / `keyPassword` 置空。导出后由 `HMSBuildProcessor` 回写签名：

1. 路径优先读 **Player Settings**
2. 密码优先读工程根目录：

```text
Local/OpenHarmonySigning.local.json
```

模板：`Local/OpenHarmonySigning.local.json.example`

```json
{
  "storeFile": "/path/to/xxx.p12",
  "storePassword": "DevEco加密串或明文（仅本机）",
  "keyAlias": "your_alias",
  "keyPassword": "DevEco加密串或明文（仅本机）",
  "profile": "/path/to/xxx.p7b",
  "certpath": "/path/to/xxx.cer",
  "signAlg": "SHA256withECDSA"
}
```

该文件须 **gitignore**，禁止提交。也可用 DevEco 打开导出工程补签名。

---

## 4. 瑞雪业务初始化参数

C# 入口：

```csharp
using RXSDK;

RuiXueSdk.Init(cpId, productId, channelId, baseUrls, (code, data, msg) => {
    // code == 0 成功
});
```

或使用 `InitArgs`：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `cpId` | 是 | 瑞雪 CP ID |
| `productId` | 是 | 产品 ID |
| `channelId` | 是 | 渠道 ID（鸿蒙联运常见如 `214`） |
| `baseUrls` | 是 | 业务域名数组，首元素为优先域名 |
| `debugEnable` | 否 | 调试开关 |

联调可参考：

| 场景 | cpid / product / channel | 域名 |
| --- | --- | --- |
| 公共测试 | `114` / `1002` / `100` | `https://cn-api-test.ruixueyun.com` |
| 捕鱼类参考 | `1000038` / `264` / `214` | 以瑞雪后台下发为准 |

> 包名、AGC Client ID、瑞雪 cpid/channel 三者需与后台登记一致，否则登录/支付会失败。

---

## 5. 导出与构建流程（宿主侧）

1. 导入对应版本 `rxsdk_harmony_v*.unitypackage`
2. 填好 §2 Player Settings 与 §3 签名本地文件
3. 团结 **File → Build Settings → OpenHarmony → Export Project**（或团队既有导出菜单）
4. 确认导出工程中：
   - `entry/oh-package.json5` 含 `hmssdk` 依赖
   - `exported.ets` 已导出 `HMSMessageBind`（TJ≥1.10 由 `HMSBuildProcessor` 自动补）
   - `entry` `Index.ets` 已接线 `UIContext` / `HMSMessageBind.bindWithRetry()`（自动补丁；若工程自定义 Index 需手工合并）
5. 用 DevEco / hvigor 编译签名 HAP 安装真机

### 原生工程要不要手写代码？

**标准导出流程下：一般不用。** TJ≥1.10 必需的宿主胶水由 `HMSBuildProcessor` 在 Export 后自动写入：

| 位置 | 自动内容 | 何时需手工 |
| --- | --- | --- |
| `tuanjieLib/exported.ets` | `export { HMSMessageBind } from '...'` | 找不到 `exported.ets` 时 |
| `entry/.../pages/Index.ets` | `import` 增加 `SetToGlobalThis`、`HMSMessageBind`；新增 `aboutToAppear` 里 `SetToGlobalThis('UIContext', ...)` + `HMSMessageBind.bindWithRetry()` | Index 已有自定义 `aboutToAppear`、或 import 行与模板不一致（日志会提示 merge manually） |
| `app.json5` / `module.json5` / 签名 / SDK 版本 | 包名、app_id、client_id、signingConfigs、compatible/targetSdk | Player Settings / Local 签名未填全时 |

若需手工合并，在 entry `Index.ets` 保证等价于：

```ts
import { /* 原有 */, SetToGlobalThis, HMSMessageBind } from 'tuanjieLib';

aboutToAppear() {
  SetToGlobalThis('UIContext', this.getUIContext());
  HMSMessageBind.bindWithRetry();
}
```

业务登录/支付/埋点在 **C# `RuiXueSdk`** 调用即可，原生侧无需再抄一遍 `RXApi.init/login`。

纯 ArkTS 工程（不走团结 Export、直接依赖 `hmssdk`）才需要按 MCP `harmony` / `ruixue_harmony` 自行写 `RXApi.getInstance().init(...)`。

TJ≥1.10 注意：引擎 ArkTS 进 `classesLib.har`；瑞雪宿主薄胶水保留在 `Plugins/OpenHarmony`，**勿删除** `HMSMessageBind` / 本地 `webview/WebviewControl`。

---

## 6. 能力验收清单

- [ ] 冷启动初始化成功（`Init` code=0）
- [ ] 华为账号 / 渠道登录可拉起，取消有明确回调
- [ ] 支付能拉起收银台（发货以后端 notify 为准）
- [ ] 若接实名 IIFAA：`GetIIFAARedirectURL` / `GetIIFAAResultWithRetryCount` 联调通过
- [ ] 签名、包名、Client ID 与 AGC 控制台一致

---

## 7. 相关内部资料（非对外必读）

| 路径 | 内容 |
| --- | --- |
| `Assets/RXSDK/Runtime/Platform/README_Platform.md` | 平台抽象说明 |
| `Assets/RXSDK/Runtime/README_Structure.md` | Runtime 目录结构 |
| `Assets/RXSDK/Editor/HMSEditor/HMSBuildProcessor.cs` | 导出后处理（签名 / SDK 版本 / Index 胶水） |
| MCP `harmony` / `unity`（`sdkApiVersion=tj`） | 代码片段生成 |

问题排查优先查：包名、`client_id`、Profile、瑞雪 `cpId/channelId/baseUrls`、TJ 版本是否 ≥1.10。
