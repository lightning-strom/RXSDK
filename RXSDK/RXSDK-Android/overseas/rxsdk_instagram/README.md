# rxsdk_instagram — Instagram 登录 & 分享插件

## 功能简介

通过 Instagram Basic Display API 提供 Instagram OAuth 登录，以及本地图片/视频分享到 Instagram Story。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_instagram:${version}'
```

## 参数配置

### 初始化参数

Instagram 的参数通过宿主 `AndroidManifest.xml` 的 `<meta-data>` 读取（在 `Application.onCreate` 时自动解析）：

```xml
<meta-data
    android:name="com.ruixue.sdk.instagram.clientId"
    android:value="你的 Instagram App ID" />

<meta-data
    android:name="com.ruixue.sdk.instagram.redirectUrl"
    android:value="你的重定向 URI，如 https://your.domain/callback" />
```

| meta-data 名称 | 必填 | 说明 |
| --- | --- | --- |
| `com.ruixue.sdk.instagram.clientId` | **必填** | Instagram 应用 ID（App ID） |
| `com.ruixue.sdk.instagram.redirectUrl` | **必填** | OAuth 授权后的回调地址，需与 Instagram 后台配置一致 |

## 接口调用

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 分享内容类型：`"image"` 或 `"video"` |
| `image` | String | 图片时必填 | 本地图片文件路径 |
| `video` | String | 视频时必填 | 本地视频文件路径 |

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
