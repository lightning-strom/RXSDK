# rxsdk_googlegame — Google Play 游戏服务插件

## 功能简介

接入 Google Play Games Services SDK，提供游戏账号鉴权、服务端 Token 获取及玩家信息查询能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_googlegame:${version}'
```

## 参数配置

### AndroidManifest 宿主可选配置

如果使用 Play Games 排行榜/成就等功能，需在宿主 manifest 中配置游戏服务项目 ID：

```xml
<meta-data
    android:name="com.google.android.gms.games.APP_ID"
    android:value="@string/game_services_project_id" />
```

对应在 `res/values/strings.xml` 中声明：

```xml
<string name="game_services_project_id">你的 Play Games 项目 ID</string>
```

## 接口调用

### 初始化

通过代码调用（在 `Application.onCreate` 或 `Activity.onCreate` 中）：

```java
GooglePlayGameSdkHelper.init(context);
```

无需在 ext 配置中传入额外字段。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 获取服务端 Token 参数

```java
GooglePlayGameSdkHelper.requestServerSideAccess(activity, webClientId, callback);
```

| 参数 | 说明 |
| --- | --- |
| `webClientId` | Google Cloud Console 中网页应用客户端 ID（用于服务端验证） |

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
