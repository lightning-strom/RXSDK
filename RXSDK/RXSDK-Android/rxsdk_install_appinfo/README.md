# rxsdk_install_appinfo — 已安装应用列表插件

## 功能简介

读取设备上已安装应用的包名列表，用于风控、归因或用户画像分析。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_install_appinfo:${version}'
```

## 参数配置

### 权限说明

`QUERY_ALL_PACKAGES`（Android 11+ 受限敏感权限）。

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

- Android 11+ 需在 Play / 应用市场审核中说明 `QUERY_ALL_PACKAGES` 用途，否则会被拒
- 国内合规要求：必须在隐私协议中说明读取已安装应用列表的目的与范围
- 如仅需查询少量已知包名，建议改用 `<queries>` 声明替代该权限

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
