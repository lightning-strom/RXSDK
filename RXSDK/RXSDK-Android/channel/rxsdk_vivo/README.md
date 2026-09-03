# channel/rxsdk_vivo — VIVO 渠道接入

## 功能简介

接入 VIVO Union SDK（`com.vivo.sdkplugin:vivounionsdk`）+ OAID，提供 VIVO 账号登录、支付、实名/防沉迷、悬浮球等渠道方接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_vivo:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data / Placeholder | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | — | `VIVO_APP_ID` | **必填** | VIVO 开放平台 AppID |
| API Key | — | `VIVO_API_KEY` | **必填** | VIVO API Key |
| CP ID | — | `VIVO_CP_ID` | **必填** | VIVO CP ID |

### AndroidManifest 配置

```groovy
android {
    defaultConfig {
        manifestPlaceholders = [
            VIVO_APP_ID : "YOUR_VIVO_APP_ID",
            VIVO_API_KEY: "YOUR_VIVO_API_KEY",
            VIVO_CP_ID  : "YOUR_VIVO_CP_ID"
        ]
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成，主要工作：
- 首次初始化时调用 `VivoSdkHelper.onPrivacyAgreed(activity)` 通知隐私已同意
- 初始化模块内 `billingClient`
- 注册账号回调 `VivoUnionSDK.registerAccountCallback(activity, this)`

VIVO 业务参数（AppID / API Key / CP ID）走 **`manifestPlaceholders` → `<meta-data>`**，不读 hashMap。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 切换账号回调统一通过 `VivoUnionSDK.registerAccountCallback` 接管
- 初始化失败会回调 `INIT_PARAMS_ERROR` 并附带异常信息

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
# VIVO Union
-keep class com.vivo.unionsdk.** { *; }
-dontwarn com.vivo.unionsdk.**

# OAID
-keep class com.bun.miitmdid.core.** {*;}
-keep class com.bun.miitmdid.** {*;}
-keep class com.bun.lib.** {*;}
-keep class XI.CA.XI.** {*;}
-keep class XI.K0.XI.** {*;}
-keep class XI.XI.K0.** {*;}
-keep class XI.xo.XI.XI.** {*;}
-keep class com.asus.msa.SupplementaryDID.** {*;}
-keep class com.asus.msa.sdid.** {*;}
-keep class com.huawei.hms.ads.identifier.** {*;}
-keep class com.samsung.android.deviceidservice.** {*;}
-keep class com.zui.opendeviceidlibrary.** {*;}
-keep class org.json.** {*;}

# 网易易盾（VIVO 风控依赖）
-keep public class com.netease.nis.sdkwrapper.Utils {public <methods>;}
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.vivo.sdkplugin:vivounionsdk` | `4.8.7.0` | VIVO Union SDK |
| `com.bun.miitmdid:oaid_sdk` | `1.0.25` | OAID 官方 SDK |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
