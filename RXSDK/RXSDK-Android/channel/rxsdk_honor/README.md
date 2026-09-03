# channel/rxsdk_honor — 荣耀（HONOR）渠道接入

## 功能简介

接入荣耀 MCS 游戏 SDK 与 OAID 标识符，提供荣耀账号登录、支付、广告标识获取等能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_honor:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | `honor_appid` / `appid` | `honor_app_id` | **必填** | 荣耀开发者后台 AppID |
| CP ID | `honor_cpid` / `cpid` | `honor_cp_id` | **必填** | 荣耀开发者后台 CP ID |
| 沙盒 token | `sandbox_token` | — | 可选 | 联调阶段沙盒环境标识 |
| 强制更新 | `force_update` | — | 可选 | 升级提示是否强制 |
| 二次确认登录 | `reconfirm_login` | — | 可选 | 切换账号时弹二次确认 |

### AndroidManifest 配置

如选择 meta-data 注入参数：

```xml
<meta-data android:name="honor_app_id" android:value="YOUR_APP_ID" />
<meta-data android:name="honor_cp_id" android:value="YOUR_CP_ID" />
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成，主要工作：
- 缓存 hashMap 业务参数（appid / cpid / sandbox_token 等）
- 异步获取荣耀广告标识 `AdvertisingIdClient`，写入 `RuiXueSdk.setOAID(...)`


### 角色信息上报

业务侧统一调用 `RuiXueSdk.getApi().setGameInfo(gameInfo)`（无回调），内部映射为 `GCJointSdk.reportUserGameInfoData`。

| GameInfo | UserGameInfoParam |
| --- | --- |
| `roleId` / `roleName` | `roleId` / `roleName` |
| `gameRoleLevel` | `roleLevel` |
| `serverId`；`attach.realm_id` | `realmId` |
| `serverName`；`attach.realm_name` | `realmName` |
| `attach.chapter` | `chapter` |
| 其余 `attach` 字段 | `ext` |

荣耀侧无创角/升级分事件，任意 `type` 均按当前角色快照上报。历史 `HonorSdkApiImpl#reportUserData(...)` 仍保留，供兼容调用。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- OAID 获取在子线程，失败不会阻塞初始化回调
- 支付/登录失败码请参考荣耀开发者文档

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
-keeppackagenames com.hihonor.ads.identifier
-keeppackagenames com.hihonor.cloudservice.oaid
-keep class com.hihonor.ads.identifier.AdvertisingIdClient* {*;}
```

> 荣耀游戏 SDK aar 内附 consumer 规则，无需再 keep。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.hihonor.mcs:ads-identifier` | `1.0.3.300` | 荣耀 OAID |
| `com.hihonor.mcs:game` | `2.0.14.301` | 荣耀游戏 SDK |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_weixin`（compileOnly） | — | 微信通道符号兼容 |

> 已注释的 `iap-sdk` 在当前版本走荣耀游戏 SDK 内置支付，无需单独引入。
