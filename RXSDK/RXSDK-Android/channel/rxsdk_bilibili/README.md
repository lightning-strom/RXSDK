# channel/rxsdk_bilibili — B 站游戏渠道接入

## 功能简介

接入哔哩哔哩游戏 SDK（GSC PubCommon），提供 B 站账号登录、支付、实名认证、登出能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_bilibili:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：

1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 商户 ID | `merchant_id` | `bili_merchant_id` | **必填** | B 站平台分配的 cpid |
| 应用 ID | `appid` | `bili_app_id` | **必填** | B 站应用唯一标识 |
| 应用密钥 | `appkey` | `bili_app_key` | **必填** | 客户端校验密钥 |
| 区服 ID | `server_id` | — | **必填** | 我方分配的区服 ID（多区服需在选区后调用 `notifyZone` 透传） |
| 区服名称 | `server_name` | — | 可选 | 区服显示名称 |

> `secret_key`（订单签名密钥）仅服务端持有，**客户端禁止下发**。

### AndroidManifest 配置

模块已声明 `uses-library org.apache.http.legacy`（适配 Android P）；如选择 meta-data 方式注入参数，宿主 `<application>` 内追加：

```xml
<meta-data android:name="bili_merchant_id" android:value="YOUR_MERCHANT_ID" />
<meta-data android:name="bili_app_id" android:value="YOUR_APP_ID" />
<meta-data android:name="bili_app_key" android:value="YOUR_APP_KEY" />
```

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

- 登录回调透传字段：`uid` / `username` / `nickname` / `access_token` / `expire_times` / `refresh_token`
- 实名/防沉迷由 SDK 自动弹窗处理
- 多区服游戏：每次切换区服后必须调用 `GSCPubCommon.notifyZone(...)`，否则风控会驳回订单

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
# B 站 SDK
-keep class com.gsc.** { *; }
-keep interface com.gsc.** { *; }
-keep class com.gsc.pub.** { *; }

# OAID
-keep class com.bun.** { *; }
-keep class XI.** { *; }
-keep class com.asus.** { *; }
-keep class com.heytap.** { *; }
-keep class com.huawei.** { *; }
-keep class com.meizu.** { *; }
-keep class com.samsung.** { *; }
-keep class com.zui.** { *; }
-keep class com.netease.** { *; }
-keepattributes *Annotation*

# 微信 SDK（依赖自 rxsdk_weixin）
-keep class com.tencent.mm.opensdk.** { *; }
-keep class com.tencent.wxop.** { *; }
-keep class com.tencent.mm.sdk.** { *; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.gsc.pub:gsc_android_library` | `5.9.2` | B 站游戏 SDK（GSCPubCommon） |
| `com.base.oaid:game-oaid` | `2.0.1` | OAID 适配层 |
| `com.bun.miitmdid:oaid_sdk` | `2.5.1` | OAID 官方 SDK |
| `com.alipay.sdk:alipaysdk-android` | `15.8.11` | 支付宝支付通道（B 站联运支付场景） |
| `:rxsdk_weixin`（project） | — | 微信登录/分享通道（已排除内嵌 okhttp） |
