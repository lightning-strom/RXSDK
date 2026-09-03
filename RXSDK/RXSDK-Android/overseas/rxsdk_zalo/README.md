# rxsdk_zalo — Zalo 登录 & 分享插件

## 功能简介

接入 Zalo SDK，提供 Zalo 账号 OAuth 登录与内容分享（文本、图片、链接）能力，适用于越南市场。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_zalo:${version}'
```

## 参数配置

### 初始化参数

Zalo SDK 通过宿主 manifest 自动读取应用信息，宿主需配置：

```xml
<meta-data
    android:name="com.zing.zalo.zalosdk.appID"
    android:value="你的 Zalo App ID" />
```

> Zalo App ID 在 [Zalo Developer](https://developers.zalo.me/) 后台创建应用后获取。

### AndroidManifest 配置

宿主需声明 Zalo 回调 Activity（处理 OAuth 返回）：

```xml
<activity
    android:name="com.zing.zalo.zalosdk.oauth.BrowserLoginActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="zalo-{你的 Zalo App ID}" />
    </intent-filter>
</activity>
```

### 权限说明

依赖 Zalo SDK AAR 自动合并，宿主无需额外声明。

## 接口调用

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 分享类型：`"text"` / `"image"` / `"webpage"` |
| `content` | String | 文本时必填 | 分享文案 |
| `image` | String | 图片时必填 | 本地图片路径或图片 URL |
| `url` | String | 链接时必填 | 目标网页 URL |
| `title` | String | 链接时推荐 | 链接标题 |

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
