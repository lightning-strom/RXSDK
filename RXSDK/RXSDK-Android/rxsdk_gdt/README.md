# rxsdk_gdt — 广点通转化数据上报

## 功能简介

接入腾讯广点通（GDT Action SDK），上报激活、注册、付费等买量归因事件。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_gdt:${version}'
```

## 参数配置

### 关键参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `gdt_user_action_set_id` | String | GDT 后台分配的 UserActionSetID |
| `gdt_app_secret_key` | String | App Secret Key |

> 一般由后台下发到 SDK，业务方无需在 ext 中显式传参。

### 权限说明

`INTERNET`、`ACCESS_NETWORK_STATE`、`READ_PHONE_STATE`、`WRITE_EXTERNAL_STORAGE`。

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

- 仅在国内 Android 包中启用
- 与 `rxsdk_bytedance_log` 可同时存在，互不冲突

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
