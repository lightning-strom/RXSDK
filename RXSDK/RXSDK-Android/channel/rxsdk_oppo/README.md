# channel/rxsdk_oppo — OPPO 渠道接入

## 功能简介

接入 OPPO 游戏中心 SDK（`com.nearme.game.sdk`），提供 OPPO 账号登录、支付、实名/防沉迷、悬浮球能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_oppo:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入，对应 `OppoConfig.fromMap`）
2. 宿主 `AndroidManifest.xml` 的 `manifestPlaceholders` / `<meta-data>` 兜底

| 字段 | hashMap key | meta-data / Placeholder | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | `oppo_app_id` / `appid` | `OPPO_APP_ID` | **必填** | OPPO 开放平台 AppID |
| 应用 Key | `oppo_app_key` / `appkey` | `OPPO_APP_KEY` | **必填** | OPPO 开放平台 AppKey |
| 应用 Secret | `oppo_app_secret` / `app_secret` | `OPPO_APP_SECRET` | **必填** | 用于 `GameCenterSDK.initialize` |

> 具体字段以 `OppoConfig#fromMap` / `checkParams` 为准。

### AndroidManifest 配置

```groovy
android {
    defaultConfig {
        manifestPlaceholders = [
            OPPO_APP_ID    : "YOUR_OPPO_APP_ID",
            OPPO_APP_KEY   : "YOUR_OPPO_APP_KEY",
            OPPO_APP_SECRET: "YOUR_OPPO_APP_SECRET"
        ]
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
OppoConfig oppoConfig = OppoConfig.fromMap(hashMap);
GameCenterSDK.initialize(activity, oppoConfig.getAppSecret());
GameCenterSDK.afterPrivacyAgreed(activity);
```

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 必须在隐私窗同意后再调用 `afterPrivacyAgreed`，否则部分接口（实名、上报）会被阻断
- 切换账号场景下需重新调用 `login`，OPPO SDK 不会自动复用上次会话

## 版本与构建要求

### 混淆配置

OPPO 游戏 SDK aar 内附 consumer 混淆规则，宿主无需追加额外 keep；如使用了广告 SDK，请按 OPPO 官方文档另行处理。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.nearme.game.sdk:gamesdk-common` | `20250722` | OPPO 游戏 SDK 公共 |
| `com.nearme.game.sdk:gamesdk` | `20250722` | OPPO 游戏 SDK 主体 |
| `com.nearme.game.sdk:signal-sdk` | `1.0.1` | OPPO Signal SDK |
| `com.nearme.game.sdk:signal-log` | `1.0.1` | OPPO Signal 日志 |
| `com.jakewharton.timber:timber` | `5.0.1` | OPPO SDK 日志依赖 |
| `org.jetbrains.kotlinx:kotlinx-coroutines-core` | `1.6.0` | Kotlin 协程 |
| `androidx.legacy:legacy-support-v4` | `1.0.0` | 兼容 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_weixin`（compileOnly） | — | 微信通道符号兼容 |
