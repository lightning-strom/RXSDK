# rxsdk_contacts — 通讯录读取插件

## 功能简介

提供本机通讯录联系人列表的读取能力，由 `RXSdkUI.requestContacts(...)` 调用。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_contacts:${version}'
```

## 参数配置

### 关键参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `limit` | int | 返回联系人最大条数（默认全部） |

### 权限说明

`READ_CONTACTS`（运行时权限）。宿主须在调用前主动申请。

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

- Android 6.0+ 必须运行时申请；未授权时 Helper 返回空列表
- 仅返回 displayName 与 phoneNumber 字段，不上传服务端

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
