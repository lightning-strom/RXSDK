# channel/rxsdk_007 — 007 渠道接入

## 功能简介

接入 007 游戏平台 SDK，覆盖账号登录、登出、支付、用户信息上报等渠道方接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_007:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | `app_id` | `m007_app_id` | **必填** | 007 平台分配的应用 ID |
| 应用 Key | `app_key` | `m007_app_key` | **必填** | 应用密钥（仅签名/校验，客户端只读） |

> CP Key 仅服务端持有，客户端禁止下发。

### AndroidManifest 配置

无额外 Activity / Provider 声明；模块自带 `INTERNET` / `ACCESS_NETWORK_STATE` 权限。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `SDK007Manager.initSDK(...)` 完成，业务侧无需直接调用 007 SDK API。

### 角色信息上报

业务侧统一调用 `RuiXueSdk.getApi().setGameInfo(gameInfo)`；模块内部转换为
`SDK007Manager.setRoleInfo(...)`。

- `type=1`：创建角色
- `type=2`：进入游戏
- `type=3`：角色升级
- `type=4`：007 SDK 无对应事件，忽略渠道上报但保留瑞雪 SDK 内部角色缓存
- `GameInfo.attach` 透传为 007 的 `channelExt`

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 登录、登出、注销监听走 `OnLogoutListener` 标准回调
- 支付订单需服务端通过 007 后台对账后发货

## 版本与构建要求

### 混淆配置

模块默认无强制 keep 规则；如宿主开启代码混淆，建议追加：

```proguard
-keep class com.sdk007.** { *; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.sdk007:lib` | `1.0.8` | 007 渠道 SDK |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
