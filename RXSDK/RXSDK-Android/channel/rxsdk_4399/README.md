# channel/rxsdk_4399 — 4399 渠道接入

## 功能简介

接入 4399 游戏运营 SDK（OperateCenter），提供 4399 账号登录、支付、悬浮窗、实名/防沉迷能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_4399:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 游戏运营 Key | `appid` | `m4399_app_id` | **必填** | 4399 原创开放平台分配的 GameKey |
| 屏幕方向 | `screen_orientation` | — | 可选 | `ActivityInfo.SCREEN_ORIENTATION_*`，默认横屏 |
| 调试模式 | `debug` | — | 可选 | `true` 打开 4399 SDK debug 日志，发布须关 |
| 充值超额 | `support_excess` | — | 可选 | 是否允许超额充值，默认 `true` |

### AndroidManifest 配置

模块已声明 4399 SDK 需要的 Activity / Provider；如选择 meta-data 注入参数：

```xml
<meta-data android:name="m4399_app_id" android:value="YOUR_APP_ID" />
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `OperateCenter.init(activity, OperateConfig)` 完成。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 4399 SDK 同时引入电信/联通一键登录、上海数美风控、Tencent / Alipay 支付通道
- 横屏游戏建议显式设置 `screen_orientation = 0` 与宿主 Activity 方向一致

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加（模块自带，引入聚合时可参照）：

```proguard
# 4399 SDK
-dontwarn cn.m4399.operate.**
-keep class cn.m4399.operate.** {*;}
-keepclassmembers class cn.m4399.operate.R$* {*;}
-keep class com.m4399.gamecenter.** {*;}

# 4399 内置一键登录依赖
-keep class cn.com.chinatelecom.account.** {*;}
-dontwarn com.unicom.xiaowo.account.shield.**
-keep class com.unicom.xiaowo.account.shield.**{*;}

# 反作弊 / 风控
-keep class com.ishumei.** { *; }

# 内嵌 Tencent / Alipay 通道
-keeppackagenames com.tencent
-keep class com.tencent.** {*;}
-keep class com.alipay.** {*;}
-keep class org.json.alipay.** {*;}

-keepattributes InnerClasses,*Annotation*,Signature,Exceptions
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `cn.m4399.sdk:operate` | `3.20.1` | 4399 游戏运营 SDK（官方 Maven 最新正式版） |
| `com.android.volley:volley` | `1.2.1` | 4399 内部网络栈依赖 |
| `com.android.support:support-v4` | `28.0.0` | 4399 旧版兼容 support 库 |
| `okhttp` / `okio` / `logging-interceptor` | `3.12.8` / `1.15.0` | 官方 3.20+ 要求的外部依赖 |
| `kotlin-stdlib*` | 跟随工程 `kotlin_version` | 官方要求 ≥1.6.0 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
