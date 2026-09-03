# rxsdk_gaode — 高德定位插件

## 功能简介

接入高德开放平台 AMap Location SDK，提供经纬度、地理逆编码、运营商信息读取能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_gaode:${version}'
```

## 参数配置

### AndroidManifest 配置

宿主必须声明高德 API Key：

```xml
<meta-data
    android:name="com.amap.api.v2.apikey"
    android:value="YOUR_AMAP_KEY" />
```

模块已声明定位服务 `com.amap.api.location.APSService`，无需额外配置。

### 权限说明

定位类完整权限（`ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` / `ACCESS_BACKGROUND_LOCATION` / `READ_PHONE_STATE` / `WRITE_EXTERNAL_STORAGE` / `WAKE_LOCK` 等）。

> 后台定位需在 Android 10+ 上额外申请 `ACCESS_BACKGROUND_LOCATION` 运行时权限。

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

- 隐私合规：必须在用户同意隐私协议后再调用 `AMapLocationClient.updatePrivacyShow/Agree`
- 单次定位推荐 `LocationMode = Hight_Accuracy`

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
