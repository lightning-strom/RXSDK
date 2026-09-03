# rxsdk_facebook — Facebook 登录 & 分享插件

## 功能简介

接入 Facebook SDK，支持 Facebook / Messenger / Instagram 登录与内容分享。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_facebook:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `appid` | String | **必填** | Facebook App ID（即 Facebook 开发者后台的应用 ID） |
| `clientToken` | String | **必填** | Facebook 客户端令牌（Client Token） |

### AndroidManifest 宿主必填配置

宿主 `AndroidManifest.xml` 中需通过 `manifestPlaceholders` 注入 Facebook App ID，否则 `FacebookContentProvider` 的 `authorities` 注册失败：

```groovy
// build.gradle
manifestPlaceholders = [
    FACEBOOK_APP_ID: "你的 Facebook App ID"
]
```

对应 manifest 占位符：

```xml
<!-- 自动合并自本模块，宿主无需手动添加 -->
<provider
    android:name="com.facebook.FacebookContentProvider"
    android:authorities="com.facebook.app.FacebookContentProvider${FACEBOOK_APP_ID}"
    android:exported="true" />

<activity android:name="com.facebook.CustomTabActivity" android:exported="true">
    <intent-filter>
        <data android:scheme="fb${FACEBOOK_APP_ID}" />
    </intent-filter>
</activity>
```

### 权限说明

- `INTERNET`（必须）

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
