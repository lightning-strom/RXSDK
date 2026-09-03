# channel/rxsdk_kwai_buy — 快手买量渠道接入

## 功能简介

接入快手游戏 SDK（买量场景），提供快手账号登录、支付、买量数据上报，并复用支付宝支付通道。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_kwai_buy:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` / `manifestPlaceholders` 兜底

| 字段 | hashMap key | meta-data / Placeholder | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 快手 AppID | `kwai_app_id` | `KWAI_APP_ID`（manifestPlaceholder） | **必填** | 快手开放平台 AppID |
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
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `initKwai(application, hashMap, callback)` 完成。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 初始化失败会回调 `INIT_PARAMS_ERROR` 并附带 `initErrMsg`
- 买量场景下，登录类型默认 `LoginMethod.KUAISHOU`

## 版本与构建要求

### 混淆配置

模块默认未追加自定义 keep；如宿主开启 R8，建议追加：

```proguard
# 快手买量
-keep class com.kwai.** { *; }
-keep class com.yxcorp.** { *; }

# 内嵌 Alipay
-keep class com.alipay.sdk.app.PayTask { public *; }
-keep class com.alipay.sdk.app.AuthTask { public *; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.alipay.sdk:AlipaySdk` | `15.8.01.20210112203525` | 支付宝支付通道 |
| `com.squareup.okhttp3:okhttp` | `3.12.1` | 网络栈（兼容快手 aar） |
| 快手 jar/aar | 跟随 `libs/` | 快手买量主体 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
