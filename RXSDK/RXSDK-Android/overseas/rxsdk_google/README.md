# rxsdk_google — Google 登录 & 支付插件

## 功能简介

接入 Google Identity（Credential Manager）和 Google Play Billing，提供 Google 账号登录与 Google Pay 支付能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_google:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `clientId` | String | **必填** | Google OAuth 服务端客户端 ID（Web Client ID，非 Android Client ID） |
| `google_clientid` | String | 可选 | 同 `clientId`，兼容旧字段名 |

> `clientId` 可在 Google Cloud Console → 凭据页面中找到类型为「OAuth 2.0 客户端 ID → 网页应用」的条目。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 宿主需在 `app/build.gradle` 中应用 `com.google.gms.google-services` 插件并放置 `google-services.json`
- 支付走 Google Play Billing（`hq_type=google`），无需额外字段
- 默认实现为 `GoogleBillingImpl`（`ProductDetails`）；依赖 `com.android.billingclient:billing:8.0.0`

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准（当前 Billing `8.0.0`） |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 23（Billing 8.x 要求） |
| 特殊要求 | Billing 9.x 需 compileSdk 35；当前 AGP 7.4.2 / compileSdk 34 使用 Billing 8.x |
