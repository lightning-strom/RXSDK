# rxsdk_overseas_weizhi — 位置/微知渠道海外版插件

## 功能简介

海外位知（JF）渠道插件，提供 JF 渠道的登录与支付实现（`JFSdkApiImpl`、`JFBillingImpl`）。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_overseas_weizhi:${version}'
```

## 参数配置

### 初始化参数

具体初始化参数由服务端下发的 `ext` 配置提供，请联系运营获取对应渠道的配置字段。

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

- 本模块暂无独立 manifest 声明，依赖宿主和基础包完成 SDK 注册
- UI 层复用 `OverseasSdkUI`

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
