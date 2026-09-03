# rxsdk_infinix — Infinix (Transsion) 广告插件

## 功能简介

接入 Transsion 广告 SDK（Game Ad），提供插屏广告、Banner 广告、激励视频广告及开屏广告能力，适用于 Infinix 渠道。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_infinix:${version}'
```

## 参数配置

### 初始化参数

通过 `initThirdSdk` 传入的 `hashMap` 配置：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `infinix_debuggable` | Boolean | 可选 | 是否开启调试模式，默认 `false` |
| `infinix_env` | String | 可选 | 广告环境，如 `"sandbox"` / `"production"`（默认生产） |

> `AdInitializer` 由 SDK 内部在 `initThirdSdk` 时自动调用，无需宿主手动初始化。

### 权限说明

模块未额外声明权限，依赖宿主及 Transsion SDK AAR 自动合并。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 广告方法说明

| 方法 | 说明 |
| --- | --- |
| `InfinixSdkHelper.loadInterstitial(activity, listener)` | 加载插屏广告 |
| `InfinixSdkHelper.showInterstitial(activity, listener)` | 展示插屏广告（需先 load） |
| `InfinixSdkHelper.showBanner(activity, listener)` | 展示 Banner 广告（实时加载） |
| `InfinixSdkHelper.loadRewardVideo(activity, listener)` | 加载激励视频 |
| `InfinixSdkHelper.showRewardVideo(activity, listener)` | 展示激励视频 |

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
