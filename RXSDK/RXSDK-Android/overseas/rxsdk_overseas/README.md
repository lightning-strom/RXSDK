# rxsdk_overseas — 海外通用 SDK 包

## 功能简介

海外版基础包，提供 LINE / Twitter / WhatsApp / YouTube 等平台的包可见性查询声明，以及海外版 UI 与登录流程的统一入口实现（`OverseasSdkUI`、`OverseasSdkApiImpl`）。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_overseas:${version}'
```

## 参数配置

### 初始化参数

本模块无独立初始化参数，由 `rxsdk_overseas_*` 子渠道模块组合使用。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 说明

- 本模块提供 `<queries>` 声明（`jp.naver.line.android`、`com.twitter.android`、`com.whatsapp`、`com.google.android.youtube`），满足 Android 11+ 包可见性要求
- 具体登录平台参数见各插件模块 README（`rxsdk_facebook`、`rxsdk_google`、`rxsdk_line` 等）

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
