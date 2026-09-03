# channel/rxsdk_quick — QuickSDK 渠道接入

## 功能简介

接入 QuickSDK 聚合渠道（`com.quicksdk`），提供登录、支付、退出、用户中心等聚合渠道接口，支撑通过 QuickSDK 一键打多渠道母包。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_quick:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 产品代号 | `quick_product_code` / `product_code` | `quick_product_code` | **必填** | QuickSDK 后台分配的 productCode |
| 产品 Key | `quick_product_key` / `product_key` | `quick_product_key` | **必填** | QuickSDK 后台分配的 productKey |

> 任一字段为空都会回调 `INIT_PARAMS_ERROR`。

### AndroidManifest 配置

如选择 meta-data 注入参数：

```xml
<meta-data android:name="quick_product_code" android:value="YOUR_PRODUCT_CODE" />
<meta-data android:name="quick_product_key"  android:value="YOUR_PRODUCT_KEY" />
```

子渠道（OPPO/VIVO/华为等）需按 QuickSDK 母包工具填充对应 placeholders。

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部调用 `Sdk.getInstance().init(activity, productCode, productKey)` 完成；初始化结果通过 QuickSDK 内部 `QkNotifiers` 异步回调。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 子渠道动态注入由 QuickSDK 母包工具完成，本模块不感知具体子渠道
- 退出建议优先调用 QuickSDK 自带退出弹窗

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
-keep class com.quicksdk.** { *; }
```

### 三方 SDK 版本与依赖

| 依赖 | 版本来源 | 用途 |
| --- | --- | --- |
| QuickSDK jar | `libs/*.jar` | QuickSDK 聚合主体 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
