# rxsdk_snapchat — Snapchat 登录 & 分享插件

## 功能简介

接入 Snap Kit SDK，提供 Snapchat 账号登录与 Snap Story 图片/视频分享能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_snapchat:${version}'
```

## 参数配置

### 初始化参数

Snap Kit 通过宿主 manifest 和资源文件配置，**无需在 ext 中传入额外字段**：

1. 在宿主 `res/values/arrays.xml` 中声明 OAuth 权限范围（本模块已提供模板 `res/values/arrays.xml`）：

```xml
<string-array name="snap_connect_scopes">
    <item>https://auth.snapchat.com/oauth2/api/user.display_name</item>
    <item>https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar</item>
</string-array>
```

2. 在宿主 `res/values/strings.xml` 中配置 Snap Kit Client ID：

```xml
<string name="snapkit_client_id">你的 Snap Kit Client ID</string>
```

### 权限说明

依赖 Snap Kit SDK AAR 自动合并，宿主无需额外声明。

## 接口调用

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 分享类型：`"image"` 或 `"video"` |
| `image` | String | 图片时必填 | 本地图片文件路径 |
| `video` | String | 视频时必填 | 本地视频文件路径 |

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### FileProvider 说明

本模块已声明 FileProvider（`authorities="${applicationId}.fileprovider"`），用于安全传递文件 Uri。若宿主已有同名 FileProvider，需通过 `tools:replace` 合并解决冲突。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
