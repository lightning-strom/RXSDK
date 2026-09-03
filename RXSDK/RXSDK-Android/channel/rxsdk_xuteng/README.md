# channel/rxsdk_xuteng — 旭腾（DF / xuteng-channel）渠道接入

## 功能简介

接入旭腾平台 SDK（DFPlatformAPI + xuteng channel core），整合小程序/H5 与原生联运能力，提供旭腾账号登录、支付、退出、跳转应用商店等渠道接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_xuteng:4.0.19'
```

宿主最低支持 `minSdkVersion 23`。Unity、Cocos2dx 和原生 Android 宿主只需选择该渠道依赖，无需再单独选择瑞雪基础模块。

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 渠道 ID | — | `CHANNELSDK_ID` | **必填** | 旭腾后台分配的渠道 ID |
| 渠道版本号 | — | `CHANNELSDK_GAME_VERSION` | **必填** | `getSdkInfo()` 上报旭腾的版本号 |
| BRSDK 配置 | — | `assets/brsdk.cfg` | **必填** | 旭腾打包工具自动注入 |

推荐在宿主 `app/build.gradle` 中使用占位符注入，值替换为当前游戏在旭腾后台的实际配置：

```groovy
android {
    defaultConfig {
        minSdkVersion 23
        manifestPlaceholders += [
                CHANNELSDK_ID          : "your_channel_id",
                CHANNELSDK_GAME_VERSION: "your_game_version"
        ]
    }
}
```

`assets/brsdk.cfg` 由旭腾母包工具生成。

### Application 配置

渠道库 Manifest 不强制合并 `android:name`，避免与其他渠道或宿主已有 `Application` 冲突。宿主必须在最终应用的 `AndroidManifest.xml` 中配置：

```xml
<application
    android:name="com.ruixue.sdk.XTApplication"
    ... />
```

`XTApplication` 同时继承旭腾的 `DFPlatformApplication`，并转发生命周期给瑞雪 SDK。宿主已有自定义 `Application` 时，需要让其继承 `XTApplication`；Java 只能单继承，不能同时配置多个 `Application`。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
if (isInited.compareAndSet(false, true)) {
    initCallback = new RXCallbackWrapper(callback, 1, 10000);
    DFPlatformAPI.getInstance().init(activity, this);
}
```

业务参数（Channel ID、签名等）通过 BRSDK 自带的 `assets/brsdk.cfg` + Manifest meta-data 由 SDK 自行读取，**不**走 `hashMap`。

### 支付

支付参数缺少 `hq_type` 时，渠道库会自动补为 `xuteng`；宿主已传入的值不会被覆盖：

```java
Map<String, Object> payParams = new HashMap<>();
payParams.put("hq_type", "xuteng");
RuiXueSdk.getApi().pay(activity, payParams, callback);
```

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 初始化回调使用 `RXCallbackWrapper` 包装，10s 超时自动失败
- 跳转应用商店调用 `jumpToAppStore(activity)`，由 BRSDK 决定具体跳转策略

## 版本与构建要求

### 混淆配置

渠道所需的 OAID、旭腾内嵌依赖混淆规则已通过 AAR 的 `consumer-rules.pro` 自动透传，宿主无需重复复制。模块自身 Release 构建仍保留原有 `proguard-rules.pro` 配置。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.brsdk.android.df:brsdk` | `9.4.1` | DF / BRSDK 主体 |
| `com.xut.sdk.channel:sdk-core` | `1.1.0` | 旭腾 channel 核心 |
| `com.xut.sdk.channel:xuteng` | `1.1.0` | 旭腾 channel 业务 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_base_ui`（project） | — | 渠道 UI |
