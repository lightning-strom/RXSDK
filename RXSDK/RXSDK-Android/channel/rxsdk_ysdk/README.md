# channel/rxsdk_ysdk — YSDK（应用宝/QQ/微信）渠道接入

## 功能简介

接入腾讯 YSDK（应用宝联运），提供 QQ / 微信 / 游客登录、米大师支付、防沉迷、实名等能力，同时整合 OAID 与设备指纹。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_ysdk:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| YSDK App Key | — | `YSDK_KEY` | **必填** | 应用宝后台 |
| QQ AppID | — | `QQ_APP_ID` | **必填** | QQ 互联 AppID |
| WeChat AppID | — | `WX_APP_ID` | **必填** | 微信开放平台 AppID |
| 米大师 Offer ID | — | `OFFER_ID` | **必填** | 米大师计费 Offer ID |
| MSDK Key | — | `MSDK_KEY` | 可选 | 启用 MSDK 时使用 |

> 上述键名以 YSDK 官方文档为准；具体注入由打包工具或宿主直接在 `<application>` 内写 `<meta-data>`。

`hashMap` 中可读取的 **登录** 业务字段：
- `ysdk_login_type`：值为 `RXYsdkConstant.YSDK_LOGIN_TYPE_UI` 时走 YSDK UI 登录页
- `platform_type`：指定登录平台（QQ / WX / Guest）

### AndroidManifest 配置

```xml
<meta-data android:name="YSDK_KEY"  android:value="YOUR_YSDK_KEY" />
<meta-data android:name="QQ_APP_ID" android:value="YOUR_QQ_APP_ID" />
<meta-data android:name="WX_APP_ID" android:value="YOUR_WX_APP_ID" />
<meta-data android:name="OFFER_ID"  android:value="YOUR_OFFER_ID" />
```

腾讯打包工具（PIE）会自动注入 YSDK 必备组件；如手工接入，请按 YSDK 官方文档补充 `WXEntryActivity`、`AssistActivity` 等。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
if (isInited.compareAndSet(false, true)) {
    YSDKApi.init();
    YSDKApi.start();
    YSDKApi.setUserListener(this);
    YSDKApi.setAntiAddictListener(this);
}
```

YSDK 业务参数（QQ AppID / WeChat AppID / Offer ID 等）通过 **Manifest meta-data** 由 YSDK 自读，**不**走 hashMap。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 未初始化即调用 `thirdLogin` 会回调 `THIRD_INIT_ERROR`，请确保 `initThirdSdk` 已成功
- 防沉迷弹窗由 YSDK 自动处理，业务侧只需响应 `setAntiAddictListener` 回调

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加（汇总 YSDK 官方 keep）：

```proguard
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-dontoptimize
-ignorewarnings
-verbose
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# 腾讯 / YSDK / 米大师 / OICQ
-dontwarn com.tencent.**
-keep class com.tencent.** {*;}
-keep class com.qq.** {*;}
-keep class com.qq.jce.** {*;}
-keep class com.qq.taf.** {*;}
-keep class com.qq.taf.jce.** {*;}
-keep class com.pay.** {*;}
-keep class com.demon.plugin.** {*;}
-keep class oicq.wlogin_sdk.** {*;}
-keep class common.** {*;}
-keep class exceptionupload.** {*;}
-keep class mqq.** {*;}
-keep class qimei.** {*;}
-keep class strategy.** {*;}
-keep class userinfo.** {*;}
-keep class android.os.** {*;}
-keep class org.apache.http.** { *; }

# Alipay / Migu
-keep class com.alipay.sdk.** {*;}
-keep class com.alipay.sdk.app.AuthTask {*;}
-keep class com.alipay.sdk.app.PayTask {*;}
-keep class com.migu.sdk.** {*;}

# 设备指纹 / OAID
-keep public class qfc.** {public <methods>;}
-keep class com.bun.miitmdid.** {*;}
-keep class com.tencent.qmsp.oaid2.** { *; }

# 微信
-keep class com.tencent.mm.opensdk.** { *; }
-keep class com.tencent.wxop.** { *; }
-keep class com.tencent.mm.sdk.** { *; }

# OkHttp（YSDK 内置 midas）
-keepattributes Signature,*Annotation*
-keep class okhttp3.midas.** { *; }
-keep interface okhttp3.midas.** { *; }
-dontwarn okhttp3.midas.**

# Android 基础组件
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep class * extends android.app.Dialog {*;}
-keep public class com.android.vending.licensing.ILicensingService
-keepclasseswithmembernames class * {
    native <methods>;
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
-keepattributes InnerClasses
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.tencent.ysdkshell:ysdkshell` | `2.2.4` | YSDK Shell |
| `com.tencent.ysdk:YSDK_Android` | `2.2.4` | YSDK 主体 |
| `androidx.legacy:legacy-support-v4` | `1.0.0` | 兼容 support 库 |
| `com.squareup.okhttp3:okhttp` | `3.12.1` | 网络栈 |
| 内置 jar（QQ / WX / 米大师） | `libs/*.jar` | 登录与支付 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
