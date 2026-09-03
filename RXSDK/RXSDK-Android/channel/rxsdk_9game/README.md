# channel/rxsdk_9game — 九游（UC）渠道接入

## 功能简介

接入九游 SDK（cn.uc / cn.gundam），提供九游账号登录、支付、悬浮窗、退出弹窗等渠道方接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_9game:${version}'
```

## 参数配置

### 初始化参数

九游 `gameId` **不**从 `hashMap` 读取，必须通过宿主 `AndroidManifest.xml` 的 `<meta-data>` 提供：

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 游戏 ID | — | `uc_game_id` | **必填** | 九游分配的 gameId（数字） |
| 屏幕方向 | `screen_orientation` | — | 可选 | `ActivityInfo.SCREEN_ORIENTATION_*`，默认横屏 |

### AndroidManifest 配置

```xml
<meta-data android:name="uc_game_id" android:value="YOUR_UC_GAME_ID" />
```

如九游版本要求声明额外 `Activity`、`Provider`，请按九游官方文档补充。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用九游 `UCGameSdk.init(...)` 完成。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- gameId 解析失败、为 0 都会回调 `THIRD_INIT_ERROR`，请确认 meta-data 注入正确
- 退出登录建议优先调用九游内置退出弹窗
- `net-sdk` 9.8+ 已自带 `ProxyActivity`/`ThemeProxyActivity`（`exported=false`），宿主/渠道库勿再覆盖声明，否则 Manifest merger 会因 `exported` 冲突失败

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
-keepattributes Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LineNumberTable,LocalVariable*Table,*Annotation*,Synthetic,EnclosingMethod
-keepclasseswithmembers class * extends cn.gundam.sdk.shell.even.SDKEventReceiver
-keep class cn.uc.** { <methods>; <fields>; }
-keep class cn.gundam.** { <methods>; <fields>; }
-keep class org.json.** { <methods>; <fields>; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `cn.uc.gamesdk:net-sdk` | `9.8.10.2` | 九游网游 SDK 主体（local_repo 发布） |
| `cn.uc.paysdk:ugpsdk-net` | `7.8.5.0` | 九游支付 SDK（local_repo 发布） |
| `com.alipay.sdk:alipaysdk` | `15.8.03-20210429105552` | 支付宝（联运依赖） |
