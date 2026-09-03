# rxsdk_line — LINE 登录 & 分享插件

## 功能简介

接入 LINE SDK，提供 LINE 账号登录与内容分享（文本、图片、链接）能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_line:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `line_channel_id` | String | **必填** | LINE 开发者后台的 Channel ID |

> 缺少 `line_channel_id` 时会抛出 `IllegalArgumentException`。

### 权限说明

- `INTERNET`

## 接口调用

### 登录参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `permission` | String[] | 请求的权限范围，默认 `["profile", "openid", "email"]` |
| `force_auth` | Boolean | 是否强制重新授权，默认 `false`（已登录时复用） |

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 内容类型：`"text"` / `"image"` / `"webpage"` |
| `image` | String | 图片时必填 | 图片 URL 或本地路径 |
| `content` | String | 文本时必填 | 分享文案 |
| `title` | String | 链接时必填 | 链接标题 |
| `url` | String | 链接/网络图片时必填 | 目标 URL |

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
