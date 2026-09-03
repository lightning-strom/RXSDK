# rxsdk_h5pay — H5 聚合支付插件

## 功能简介

承载 H5 收银台与多种 H5 支付通道（瑞雪 H5 交易、京东聚合、PayerMax、Xsolla、星驿 H5 等），统一通过 WebView 完成支付流程。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_h5pay:${version}'
```

## 参数配置

### 关键参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `hq_type` | String | **必填** | 支付通道，如 `ruixue_h5_trade` / `jdjh` / `payermax` / `xsolla_inapp` 等 |
| `url` | String | 可选 | 自定义收银台地址；不传时走默认 `static/pay`（海外为 `static/gn-pay`） |
| `currency` | String | XSOLLA 必填 | 币种，xsolla 默认 `USD` |
| `callback_url` | String | 可选 | H5 跳转完成后的回调 URL |
| `openBrowser` | boolean | 可选 | 是否拉起系统浏览器（默认 false，走内置 WebView） |
| `ext.*` | Map | 按通道 | 各通道扩展字段，模块内会与 `hashMap` 合并 |

### AndroidManifest 配置

无；`HQSdkWrapper` 内置 WebView Activity 由 `rxsdk_base_ui` 提供。

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

- 多通道分发：`HQSdkWrapper.pay()` 根据 `hq_type` 选择具体处理逻辑
- AUMS 通道会代理到 `rxsdk_unifypay`，需要同时引入
- 星驿 H5：`hq_type=xy` 且 `ext.is_h5=1`，由 `XingYiH5` 解析 `plug_url` / `ext.h5PayData.payUrl` / `ext.url` / `url` / `ext.h5` / `h5`

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
