# channel/rxsdk_xuteng_br — 旭腾 BR 渠道接入

## 功能简介

接入旭腾 BR 平台 SDK（`com.brsdk.android:brsdk`），相比 `rxsdk_xuteng` 走精简的 BR 主体（不依赖 `xut.sdk.channel`），提供旭腾 BR 账号登录、支付、退出等渠道方接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_xuteng_br:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| BRSDK 配置 | — | `assets/brsdk.cfg` | **必填** | 旭腾母包工具自动注入 |

### AndroidManifest 配置

`assets/brsdk.cfg` 由旭腾 BR 母包工具生成；模块自带必要 Activity 声明。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
BRSdkApi.getInstance().setEventListener(this);
BRSdkApi.getInstance().onInit();
initCallback = new RXCallbackWrapper(callback, 1, 10000);
```

业务参数（Channel ID、签名等）通过 BRSDK 自带的 `assets/brsdk.cfg` + Manifest meta-data 由 SDK 自行读取，**不**走 `hashMap`。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 初始化回调使用 `RXCallbackWrapper` 包装，10s 超时自动失败
- BRSDK 隐私协议默认未自动弹出，如需开启可解开 `BRSdkApi.getInstance().showProtocol()` 注释

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加（OAID 通用规则）：

```proguard
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

-keep public class com.netease.nis.sdkwrapper.Utils {public <methods>;}
-keep class com.vivo.unionsdk.** { *; }
-dontwarn com.vivo.unionsdk.**
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.brsdk.android:brsdk` | `9.6.4` | 旭腾 BR 主体 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_base_ui`（project） | — | 渠道 UI |
