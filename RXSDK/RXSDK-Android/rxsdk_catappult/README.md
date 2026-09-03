# rxsdk_catappult — Catappult AppCoins 支付插件

## 功能简介

接入 AppCoins / Catappult 计费 SDK，提供 Aptoide 商店内购支付与订单消费能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_catappult:${version}'
```

## 参数配置

### 关键参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `catappult_public_key` | String | **必填** | Catappult 后台分配的应用公钥（base64） |

支付时 `hashMap` 需透传：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `token` | String | 消费时必填 | 待消费的 purchase token |

### AndroidManifest 配置

模块已声明 AppCoins 钱包 `queries` 与 `com.appcoins.BILLING` 权限，无需额外配置。

### 权限说明

`INTERNET`、`com.appcoins.BILLING`。

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

未安装 AppCoins 钱包时 SDK 会引导用户跳转商店安装。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
