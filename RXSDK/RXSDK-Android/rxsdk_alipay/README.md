# rxsdk_alipay — 支付宝支付插件

## 功能简介

接入支付宝 SDK，提供 App 支付、支付宝授权登录能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_alipay:${version}'
```

## 参数配置

### 关键参数

支付参数由服务端下单接口下发，业务侧通常无需在 ext 中显式配置。`pay()` 接口要求 `hq_type=ap`，订单字符串通过 `ext.orderInfo` 透传。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `hq_type` | String | **必填** | 支付通道，固定 `ap` |
| `ext.orderInfo` | String | 必填（服务端下发） | 支付宝完整订单串（含签名） |

### AndroidManifest 配置

无需额外 Activity 声明，已通过 `queries` 适配 Android 11+：

```xml
<queries>
    <package android:name="com.eg.android.AlipayGphone" />
    <package android:name="hk.alipay.wallet" />
</queries>
```

### 权限说明

`INTERNET`、`ACCESS_NETWORK_STATE`、`ACCESS_WIFI_STATE`。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

暂无已知问题；如集成失败，优先检查参数配置、包名签名和渠道后台应用状态。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
