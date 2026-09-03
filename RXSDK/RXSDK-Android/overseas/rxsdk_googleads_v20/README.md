# rxsdk_googleads_v20 — Google AdMob 广告插件（v20）

## 功能简介

接入 Google Mobile Ads SDK v20+，提供激励视频广告加载与展示能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_googleads_v20:${version}'
```

## 参数配置

### 初始化参数

通过代码调用 `AdMobSdkHelper.init(activity, ad_unit_id, callback)` 传入：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `ad_unit_id` | String | **必填** | AdMob 激励视频广告单元 ID，格式如 `ca-app-pub-xxxx/yyyy` |

宿主 `AndroidManifest.xml` 需配置 AdMob 应用 ID：

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy" />
```

> AdMob 应用 ID 与广告单元 ID 不同，前者是应用级别，后者是具体广告位级别。

### 权限说明

- `INTERNET`
- `com.google.android.gms.permission.AD_ID`（Android 13+ 广告 ID 权限）

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

暂无已知问题；如集成失败，优先检查参数配置、包名签名和渠道后台应用状态。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
