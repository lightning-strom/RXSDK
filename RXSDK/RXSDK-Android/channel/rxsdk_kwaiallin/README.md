# channel/rxsdk_kwaiallin — 快手联运（Allin）渠道接入

## 功能简介

接入快手联运 SDK（KwaiSdk），提供快手账号登录、支付、悬浮窗、注销等渠道方接口。相比 `rxsdk_kwai_buy`，本模块面向联运场景，引入了完整的 AndroidX / Kotlin 运行时。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_kwaiallin:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data / Placeholder | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 快手 AppID | `kwai_app_id` | `KWAI_APP_ID` | **必填** | 快手开放平台 AppID |
| 快手 AppName | `kwai_app_name` | `KWAI_APP_NAME` | **必填** | 快手开放平台 App 名称 |

> 推荐使用 `manifestPlaceholders` 注入，与快手 SDK 内部读取一致。

### AndroidManifest 配置

```groovy
android {
    defaultConfig {
        manifestPlaceholders = [
            KWAI_APP_ID  : "YOUR_KWAI_APP_ID",
            KWAI_APP_NAME: "YOUR_KWAI_APP_NAME"
        ]
        multiDexEnabled true
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成；`isInited` 状态由 `KwaiSdk` 内部维护。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- `KwaiSdk.isLoginSuccess()` 决定是否走 `thirdLogin` 直接复用快手当前登录态
- 多区服游戏请在登录后调用 `notifyZone`（按快手联运文档）

## 版本与构建要求

### 混淆配置

模块默认未追加自定义 keep；如宿主开启 R8：

```proguard
# 快手联运
-keep class com.kwai.** { *; }
-keep class com.yxcorp.** { *; }
-keep class com.kuaishou.** { *; }

# 内嵌 Alipay
-keep class com.alipay.sdk.app.PayTask { public *; }
-keep class com.alipay.sdk.app.AuthTask { public *; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.alipay.sdk:AlipaySdk` | `15.8.01.20210112203525` | 支付宝支付通道 |
| `com.squareup.okhttp3:okhttp` | `3.12.1` | 网络栈 |
| `com.squareup.okio:okio` | `1.14.0`（解析为 `1.15.0`） | 快手登录风控依赖 |
| `com.alibaba:fastjson` | `1.2.83_noneautotype` | 快手登录风控依赖 |
| `androidx.swiperefreshlayout:swiperefreshlayout` | `1.1.0` | 快手登录风控依赖 |
| `android-networking.jar` | `1.0.2` | 快手登录风控依赖（模块 `libs/` 内置） |
| `org.jetbrains.kotlin:kotlin-stdlib-jdk8` | `1.4.0` | Kotlin 运行时 |
| `androidx.appcompat:appcompat` | `1.3.0` | UI 兼容 |
| `androidx.constraintlayout:constraintlayout` | `2.0.4` | 约束布局 |
| `androidx.room:room-runtime` | `2.0.0` | 本地数据 |
| `androidx.multidex:multidex` | `2.0.1` | MultiDex |
| `androidx.lifecycle:lifecycle-extensions` | `2.2.0` | 生命周期感知 |
| 快手联运 AAR | `kwaisdk-base-release-1.5.0-5540439.aar` | KwaiSdk 主体 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
