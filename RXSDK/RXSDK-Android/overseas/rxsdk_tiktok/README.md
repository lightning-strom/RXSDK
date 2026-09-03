# rxsdk_tiktok — TikTok 登录 & 分享插件

## 功能简介

接入 TikTok Open SDK，提供 TikTok 账号 OAuth 登录（PKCE 流程）与本地图片/视频分享能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_tiktok:${version}'
```

## 参数配置

### 初始化参数

TikTok 参数通过宿主 `AndroidManifest.xml` 的 `<meta-data>` 读取（在 `Application.onCreate` 时解析）：

```xml
<meta-data
    android:name="com.ruixue.sdk.tiktok.clientKey"
    android:value="你的 TikTok Client Key" />

<meta-data
    android:name="com.ruixue.sdk.tiktok.auth.scheme"
    android:value="你的 Redirect URI Scheme，如 tiktok_yourapp" />
```

| meta-data 名称 | 必填 | 说明 |
| --- | --- | --- |
| `com.ruixue.sdk.tiktok.clientKey` | **必填** | TikTok 开放平台应用的 Client Key |
| `com.ruixue.sdk.tiktok.auth.scheme` | **必填** | OAuth 回调的 URI Scheme |

### 权限说明

依赖 TikTok Open SDK AAR 自动合并，宿主无需额外声明。

## 接口调用

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 分享类型：`"image"` 或 `"video"` |
| `atlas` | List&lt;Map&gt; | 图片时必填 | 图片列表，每项含 `local_uri` 字段（本地图片路径） |
| `video` | String | 视频时必填 | 本地视频文件路径 |
| `format` | int | 可选 | 视频格式编码 |
| `clientKey` | String | 可选 | 分享时动态覆盖的 Client Key |

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
