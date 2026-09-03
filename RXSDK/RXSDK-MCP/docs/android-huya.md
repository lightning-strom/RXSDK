# Android 虎牙联运接入

## 功能简介

接入虎牙联运 SDK，提供账号登录、登出、支付、角色信息上报等渠道能力。业务侧通过瑞雪 SDK 统一入口调用，无需直接调用虎牙原生 API。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_huya:${version}'
```

## 参数配置

### 初始化参数

参数由后台下发的 `init_configs` / `thirdSdkParams`（`ext`）经 `initThirdSdk` 注入。

| 字段 | hashMap key | 必填 | 说明 |
| --- | --- | --- | --- |
| 游戏 ID | `gameId` / `game_id` / `huya_game_id` | **必填** | 虎牙分配的 gameId |
| 登录 Client ID | `loginClientID` / `loginClientId` / `login_client_id` | **必填** | 登录用 Client ID |
| 登录 Client Secret | `loginClientSecret` / `login_client_secret` | **必填** | 登录用 Client Secret（正式/测试通常相同） |
| 支付 AppId | `payAppId` / `pay_app_id` | **必填** | 支付 AppId（测试/正式不同） |
| 调试模式 | `debugMode` / `huya_debug_mode` / `isDebug` | 可选 | 默认 `true`；上线改为 `false` |
| 横屏模式 | `landscapeMode` / `landscape_mode` | 可选 | 默认 `false` |
| 游戏中心切号入口 | `isShowSwitchCountInGameCenter` | 可选 | 默认 `true` |

> `payAppKey` / `payappKey` 仅服务端持有，用于生成支付签名，**禁止下发客户端**。

### AndroidManifest 配置

虎牙 Berry `1.3.8+` 一般无需再配 `HY_OPENAPPID`；若登录成功但凭证为空，仍可按官方说明核对 Manifest：

```xml
<meta-data
    android:name="HY_OPENAPPID"
    android:value="YOUR_LOGIN_CLIENT_ID" />
```

微信 / QQ / 支付宝 / 虎牙 App 的 `<queries>` 已内置于本模块 Manifest，宿主无需再声明。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、角色上报等能力；本模块不要求业务直接调用渠道原生 API。

### 初始化

由 SDK 主流程调用 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成。初始化成功以渠道异步回调为准；必填参数缺失会走失败回调。

宿主需将 Activity 生命周期与权限结果转发给瑞雪 SDK（`onResume` / `onPause` / `onActivityResult` / `onRequestPermissionsResult`），渠道内部会完成前后台与登录结果处理。

> 不要在 `Activity.onDestroy` 中销毁渠道 SDK；渠道为进程级单例，误销毁会导致无法再次初始化/登录。

### 登录

- 登录方式：`method = "huya"`
- 成功后三方扩展字段：`unionid`、`access_token`
- 浮球切号 / 被动登出 / 防沉迷踢出通过 `RuiXueSdkCallback#onSwitchAccount` / `onLogout` 通知业务；切号场景 `onSwitchAccount` 返回 `true` 时 SDK 会清理本地会话

### 支付

- 下单 `hq_type = "huya"`
- 服务端按下单结果在 `ext` 中下发：`bizOrderId`、`amount`（单位：分）、`bizSign`、`prodName`
- 服务端签名：`bizSign = SHA256(厂商订单号 + 游戏ID + 支付金额分 + payAppKey)`
- 客户端成功仅表示支付页拉起成功；**发货以后端支付回调为准**
- 可选：下单传顶层 `notify_url` 指定支付结果通知地址

### 角色信息上报

业务侧统一调用 `RuiXueSdk.getApi().setGameInfo(gameInfo)`。

- 上报角色 ID/名称、区服 ID/名称、等级等基础字段
- `GameInfo.attach`（JSON）可透传：`career`、`chapter`、`realmId`、`realmName`、`sdkchannelId`
- 虎牙侧无创角/升级分事件，任意 `type` 均按当前角色快照上报

## 测试与验收

- 控制台包名与 `applicationId` 一致，且与虎牙后台登记一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID / 计费点与渠道及瑞雪后台配置一致；发货以后端 notify 验单为准。

## 常见问题

### 其他说明

- 登录成功但 `unionid` / `access_token` 为空时，优先检查 Manifest `HY_OPENAPPID` 是否与 `loginClientID` 一致
- 测试环境短信验证码一般为 `123456`（以虎牙运营说明为准）
- 虎牙 App 授权登录失败时，核对包名与签名 MD5 是否与提交虎牙运营的信息一致
- 客户端支付成功 ≠ 发货成功，须以后端回调对账后发货

## 版本与构建要求

### 混淆配置

模块已配置 `consumerProguardFiles`，并透传虎牙 Berry 自带混淆规则。宿主开启 minify 时一般无需再手写；如需自定义，可保留：

```proguard
-keep class com.huya.** { *; }
-keep class com.duowan.** { *; }
-dontwarn com.huya.**
-dontwarn com.duowan.**
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.huya.sdk:berry` | `1.4.5-698` | 虎牙联运主体（模块 `api` 透传） |
| Glide / UIL / okhttp / fastjson / RangersAppLog / AppConvert 等 | 以模块 `build.gradle` 为准 | 联运文档要求的运行依赖（已透传） |

> 宿主请勿随意裁剪透传依赖，否则登录阶段可能出现 `NoClassDefFoundError`（如 ImageLoader 相关类）。
