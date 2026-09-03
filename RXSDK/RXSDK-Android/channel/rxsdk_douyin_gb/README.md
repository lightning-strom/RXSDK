# channel/rxsdk_douyin_gb — 抖音游戏（GBSDK）渠道接入

## 功能简介

接入字节跳动游戏 SDK（GBSDK / 抖音小程序入口、AppLog、Aweme 联运、Union 广告），提供抖音账号登录、支付、分享/数据上报等能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_douyin_gb:${version}'
```

## 参数配置

### 初始化参数

`hashMap` 当前未读取业务字段；所有渠道参数走 GBSDK 标准配置：

| 字段 | 配置位置 | 必填 | 说明 |
| --- | --- | --- | --- |
| GBSDK appId / appName | `tt_game_config.xml`（GBSDK 模板） | **必填** | 字节跳动后台分配 |
| GBSDK channel | 同上 | **必填** | 渠道标识 |
| 调试开关 | 同上 / `applicationInfo.debug` | 可选 | GBSDK 内部读取 |

> 详细字段以字节跳动 GBSDK 接入文档为准。

### AndroidManifest 配置

模块自带 GBSDK 所需 `Activity`、`Provider`、`Service` 声明。宿主如开启了 `useLibrary 'org.apache.http.legacy'`，无须重复配置。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `GBCommonSDK.init(activity, InitCallback)` 完成；GBSDK 业务参数（appId / channel / debug）通过 **资源文件 `tt_game_config.xml` + Manifest** 由 GBSDK 自身规则读取，**不**走 `hashMap`。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 初始化成功后会注册全局支付回调 `GBSdkHelper.setPaySuccessListener(billingClient)`，用于 SDK 悬浮球内补单
- 注销监听通过 `GBSdkHelper.setLogoutCallback(...)` 接管

## 版本与构建要求

### 混淆配置

GBSDK aar 已内置 consumer 混淆规则，宿主无需追加额外 keep；如自定义混淆，参考字节官方文档。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.bytedance.ttgame:gbsdk_common_host` | `$sdkVersion` | GBSDK 主体宿主 |
| `com.bytedance.ttgame:gbsdk_common_plugin` | `$sdkVersion` | GBSDK 通用插件 |
| `com.bytedance.ttgame:gbsdk_optional_applog` | `$sdkVersion` | AppLog 数据上报 |
| `com.bytedance.ttgame:gbsdk_optional_aweme` | `$sdkVersion` | 抖音联运 |
| `com.bytedance.ttgame:gbsdk_optional_union_plugin` | `$sdkVersion` | 穿山甲联盟广告 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |

> `$sdkVersion` 在主工程 `build.gradle` / `gradle.properties` 中统一定义。
