# rxsdk_overseas_oppo — OPPO 海外版（ColorOS 国际版）插件

## 功能简介

接入 OPPO/OnePlus GameCenter SDK，提供海外 ColorOS 渠道的登录、支付及区域查询能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_overseas_oppo:${version}'
```

## 参数配置

### 初始化参数

OPPO GameCenter SDK 通过宿主 `AndroidManifest.xml` 中的 meta-data 读取应用信息，**无需在 ext 中传入额外字段**。

> 宿主需在 manifest 中按 OPPO 开放平台要求配置应用信息（App ID / App Key），具体字段参考 OPPO GameCenter 接入文档。

### AndroidManifest 宿主必须配置

- `applicationId.fileProvider`：宿主 FileProvider 的 `authorities` 需与本模块声明一致（`${applicationId}.fileProvider`），若宿主已有同名 FileProvider 需通过 `tools:replace="android:authorities"` 解决冲突。
- 权限 `QUERY_ALL_PACKAGES` 已声明，用于解决 Android 11+ 包可见性问题。

### 权限说明

本模块声明以下权限（自动合并到宿主）：

- `INTERNET`、`ACCESS_NETWORK_STATE`、`ACCESS_WIFI_STATE`
- `MOUNT_UNMOUNT_FILESYSTEMS`
- `SYSTEM_ALERT_WINDOW`
- `GET_TASKS`
- `USE_CREDENTIALS`
- `REQUEST_INSTALL_PACKAGES`
- `QUERY_ALL_PACKAGES`

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
