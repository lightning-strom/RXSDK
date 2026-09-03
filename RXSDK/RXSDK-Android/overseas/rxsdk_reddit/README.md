# rxsdk_reddit — Reddit 登录 & 分享插件

## 功能简介

通过 Reddit OAuth 2.0 授权流程提供 Reddit 账号登录，以及内容帖子分享能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_reddit:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `reddit_clientid` | String | **必填** | Reddit 应用 Client ID（在 Reddit 开发者后台创建 App 后获取） |
| `reddit_redirecturi` | String | **必填** | OAuth 授权回调 URI，需与 Reddit 后台配置完全一致 |

> 缺少上述任一字段，登录时会立即返回 `INIT_PARAMS_ERROR`。

## 接口调用

### 分享参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `material_type` | String | **必填** | 分享类型：`"text"` 或 `"image"` |
| `title` | String | **必填** | 帖子标题 |
| `subreddit` | String | **必填** | 目标 subreddit 名称（不含 `r/` 前缀） |
| `content` / `url` | String | 按类型必填 | 文本内容或图片/链接 URL |

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
