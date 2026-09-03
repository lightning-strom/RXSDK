# rxsdk_twitter — Twitter 登录插件

## 功能简介

提供 Twitter（X）账号登录能力的占位/集成插件。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_twitter:${version}'
```

## 参数配置

### 初始化参数

当前实现为框架骨架，暂无独立初始化参数；Twitter OAuth 配置由服务端下发的 `ext` 字段驱动，具体字段请联系运营获取。

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

- Twitter SDK 官方已于 2023 年停止维护（X 平台迁移），请关注官方最新 API 文档

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
