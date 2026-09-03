# channel/rxsdk_xiaomi — 小米渠道接入

## 功能简介

接入小米游戏 SDK（`mioauth` + `onetrack-sdk`），提供小米账号登录、支付、实名/防沉迷、悬浮球、二维码扫码（zxing）等能力，并复用支付宝支付通道。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_xiaomi:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data / Placeholder | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | — | `MI_APP_ID` | **必填** | 小米开放平台 AppID |
| 应用 Key | — | `MI_APP_KEY` | **必填** | 小米开放平台 AppKey |

> 小米 SDK 通过 `<meta-data>` `MiAppID` / `MiAppKey` 自读，使用 `manifestPlaceholders` 注入即可。

### AndroidManifest 配置

```groovy
android {
    defaultConfig {
        manifestPlaceholders = [
            MI_APP_ID : "YOUR_MI_APP_ID",
            MI_APP_KEY: "YOUR_MI_APP_KEY"
        ]
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成。**注意**：当前 `initThirdSdk(...)` 仅直接回调 `onSuccess`，小米 `MiCommplatform.Init(...)` 通过 `manifestPlaceholders` 注入的 AppID/AppKey 由小米 SDK 自动初始化（旧版的代码初始化在源码中已注释保留，便于回滚）。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 小米初始化耗时由 SDK 自身在隐私同意后异步完成
- 切换账号回调通过 `MiCommplatform` 全局事件触发，需要在 `Application` 层确保单例正常

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
# 小米 SDK
-keep class com.xiaomi.** { *; }
-keep class com.wali.** { *; }
-keep class cn.com.wali.** { *; }
-keep class com.miui.** { *; }

# 内嵌 Alipay
-keep class com.alipay.android.app.IAlixPay { *; }
-keep class com.alipay.android.app.IAlixPay$Stub { *; }
-keep class com.alipay.android.app.IRemoteServiceCallback { *; }
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub { *; }
-keep class com.alipay.sdk.app.PayTask { public *; }
-keep class com.alipay.sdk.app.AuthTask { public *; }
-keep class com.alipay.sdk.app.H5PayCallback { <fields>; <methods>; }
-keep class com.alipay.android.phone.mrpc.core.** { *; }
-keep class com.alipay.apmobilesecuritysdk.** { *; }
-keep class com.alipay.mobile.framework.service.annotation.** { *; }
-keep class com.alipay.mobilesecuritysdk.face.** { *; }
-keep class com.alipay.tscenter.** { *; }
-keep class com.alipay.tscenter.biz.rpc.** { *; }
-keep class org.json.alipay.** { *; }
-keep class com.ta.utdid2.** { *; }
-keep class com.ut.device.** { *; }
-dontwarn com.ta.utdid2.**
-dontwarn com.ut.device.**
-dontwarn com.alipay.mobilesecuritysdk.**
-dontwarn com.alipay.security.**
-dontwarn android.net.SSLCertificateSocketFactory
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.xiaomi.gamecenter.sdk:mioauth` | `$lastVersion` | 小米账号 / 支付主体 |
| `com.xiaomi.gamecenter.sdk:onetrack-sdk` | `2.2.5` | 小米数据统计 |
| `com.alipay.sdk:alipaysdk-android` | `15.8.30` | 支付宝支付通道 |
| `com.google.zxing:core` | `3.5.3` | 二维码（小米扫码场景） |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |

> `$lastVersion` 在主工程统一定义。
