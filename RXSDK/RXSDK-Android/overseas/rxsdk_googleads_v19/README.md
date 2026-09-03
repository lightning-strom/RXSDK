# rxsdk_googleads_v19 — Google AdMob 广告插件（v19）

## 功能简介

接入 Google AdMob SDK（Mobile Ads v19），提供激励视频广告展示能力。

> ⚠️ 该版本为旧版（API 已废弃），新项目请使用 `rxsdk_googleads_v20`。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_googleads_v19:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `admob_app_id` | String（string resource） | **必填** | AdMob 应用 ID，需在宿主 `res/values/strings.xml` 中声明 `admob_app_id` 字符串资源 |

宿主 `AndroidManifest.xml` 需配置：

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="@string/admob_app_id" />
```

### 权限说明

- `INTERNET`

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 广告单元 ID

激励视频的广告单元 ID 在调用 `AdsHelper.init(activity)` 后通过资源文件 `R.string.admob_unit_id` 读取，需在宿主中声明。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
