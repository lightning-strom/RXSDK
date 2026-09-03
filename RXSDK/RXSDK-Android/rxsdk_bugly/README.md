# rxsdk_bugly — Bugly 异常上报插件

## 功能简介

接入腾讯 Bugly，提供崩溃捕获、ANR 监控、日志上报能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_bugly:${version}'
```

## 参数配置

### 关键参数

Bugly App ID 由 SDK 内部统一配置，业务方无需通过 ext 传入。如需覆盖：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `bugly_appid` | String | 可选 | 自定义 Bugly App ID（默认走 RuiXueSdk 后台下发） |

### 权限说明

`READ_PHONE_STATE`、`INTERNET`、`ACCESS_NETWORK_STATE`、`ACCESS_WIFI_STATE`、`READ_LOGS`。

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

- SDK 自动捕获 Java/Native 崩溃，无需业务方主动调用上报
- 调试期可通过 `BuglyHelper.setDebugMode(true)` 开启日志

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
