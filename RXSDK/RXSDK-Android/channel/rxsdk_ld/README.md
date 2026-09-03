# channel/rxsdk_ld — 雷电模拟器渠道接入

## 功能简介

接入雷电模拟器（LD）渠道 SDK（`com.ld.sdk.library:ldmnq`），提供雷电账号登录、支付、角色上报、退出确认等渠道方接口。

官方文档：[SDK接入文档（Android）](https://docs.ldmnq.com/docs/3iyTEo)

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_ld:${version}'
```

`v2.5.34` 起 AAR 内已去掉支付宝 jar，模块已传递依赖 `com.alipay.sdk:alipaysdk-android`；宿主无需再单独引入，除非有版本冲突需强制对齐。

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 雷电 AppKey | `ld_app_key` / `app_key` | `rx_leidian_app_key` | **必填** | 雷电平台分配的应用 Key |

meta-data 兜底走 `AppUtils.getMetaDataByPrefix(activity, "rx_" + getChannel() + "_")`，渠道名为 `leidian`，因此名字必须是 `rx_leidian_app_key`（前缀被剥离后即 `app_key`）；不带前缀的 `ld_app_key` 只在后台 `init_configs` 下发时生效。

### AndroidManifest 配置

```xml
<meta-data android:name="rx_leidian_app_key" android:value="YOUR_LD_APP_KEY" />

<!-- 雷电渠道信息（与官方文档一致；GAME_ID 冲突时可改用 LD_GAME_ID） -->
<meta-data android:name="GAME_ID" android:value="YOUR_GAME_ID"/>
<meta-data android:name="CHANNEL_ID" android:value="YOUR_CHANNEL_ID"/>
<meta-data android:name="SUN_CHANNEL_ID" android:value="YOUR_SUN_CHANNEL_ID"/>
```

出包建议带上 `x86` / `x86_64`，模拟器运行更稳定。闪屏/角标素材按官方「闪屏角标」目录配置。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `LdSdkManger.getInstance().init(activity, appId, InitCallBack)` 完成，调用已切到 UI 线程（引擎线程直接调用雷电 init 不会回调）。

AppKey 为空时直接回调 `THIRD_INIT_ERROR`，不再等主流程 `RXCallbackWrapper` 的 100s 超时。

授权弹窗可按需调用 `LDSdkHelper.checkUserEmpower(...)`（同意后再 init）。

### 角色上报

统一入口：`RuiXueSdk.getApi().setGameInfo(GameInfo)` → 雷电 `enterGame`。

| GameInfo | LdGameInfo |
| --- | --- |
| serverId / serverName | serverId / serverName |
| roleId / roleName | roleId / roleName |
| gameRoleLevel | level |
| balance | money |
| partyName | partyName |
| vipLevel / gameRolePower | vipLevel / powerNum |
| attach.roleType/career/profession | roleType |

`type=4`（退出）或无 `roleId` 时不上报渠道；创角与登录场景按官方要求调用。

### 支付

`hq_type=leidian`。下单后读取服务端 `ext` 填 `LdPayInfo`；`productId` 缺省为官方默认值 `12`。金额单位为分（整数）。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `init_configs` / `thirdSdkParams` 中 `ld_app_key` 非空，Manifest 渠道 meta-data 正确。
- 登录、`setGameInfo`、支付、退出弹窗联调通过。

## 常见问题

- 初始化失败会回调 `THIRD_INIT_ERROR` 并附带雷电 SDK 返回的错误描述
- 初始化只报 `RXCallbackWrapper timeout triggered 100000`（`code=9000`）时，说明渠道 init 或打点配置没有回调：先确认 `rx_leidian_app_key` / `init_configs` 的 AppKey 非空，再开 debug 日志看是否有 `Third-party SDK init success`
- 从 `2.4.x` 升级：删除旧资源；初始化/登录/支付改为回调方法（不再返回状态码）；`DoRelease` / `showFloatView` / `hideFloatView` 官方文档已移除建议（AAR 内方法仍可能保留，勿依赖）
- 支付宝依赖缺失会导致支付相关崩溃，确认模块已引入 `alipaysdk-android`

## 版本与构建要求

### 混淆配置

```proguard
-keep class com.ld.sdk.** { *; }
-keep class okhttp3.** { *; }
-keep class com.google.gson.** { *; }
-keep class okio.** { *; }
-keep class com.squareup.picasso.** { *; }
-keep class com.changzhi.net.** { *; }
-keep class io.netty.** { *; }
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.ld.sdk.library:ldmnq` | `2.5.34` | 雷电渠道 SDK（local_repo 发布；AAR Manifest 标注 2.5.22；已剥离内嵌 gson/okhttp/okio 防 Duplicate class） |
| `com.alipay.sdk:alipaysdk-android` | `15.8.37` | 支付宝（v2.5.22+ 起需宿主/渠道库显式引入） |
| `com.google.code.gson:gson` / `okhttp` | `2.8.8` / `3.12.1` | 替代 AAR 内嵌依赖 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
