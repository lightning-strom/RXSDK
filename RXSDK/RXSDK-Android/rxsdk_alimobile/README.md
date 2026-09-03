# rxsdk_alimobile — 阿里一键登录插件

## 功能简介

接入阿里云号码认证服务，提供本机号码一键登录、授权页 UI 自定义能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_alimobile:${version}'
```

## 参数配置

### 关键参数

由 `RXSdkUI` / `doLogin(...)` 的 `paramsMap` 传入：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `auth_secret` / `app_secret` | String | **必填** | 阿里云号码认证后台的 AppSecret |
| `orientation` | int | 可选 | 授权页屏幕方向，默认竖屏 |
| `ui_config` | JSONObject | 可选 | 授权页 UI 自定义配置（颜色/Logo/协议等），结构参考 `AliAuthUIConfig` |

### AndroidManifest 配置

无需额外配置；模块已声明授权页相关 Activity 与协议页 `PrivacyDetailActivity`。

### 权限说明

模块自动声明：`INTERNET`、`ACCESS_WIFI_STATE`、`ACCESS_NETWORK_STATE`、`CHANGE_NETWORK_STATE`、`CHANGE_WIFI_STATE`、`WRITE_EXTERNAL_STORAGE`。

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

- 一键登录依赖运营商网关，仅在数据流量开启时可用
- 授权页主题 `authsdk_activity_dialog_rx` 可在宿主 styles 中覆盖

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
