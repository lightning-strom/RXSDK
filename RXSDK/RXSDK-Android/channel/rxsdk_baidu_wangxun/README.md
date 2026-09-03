# channel/rxsdk_baidu_wangxun — 百度网讯渠道接入

## 功能简介

接入百度游戏 SDK（BDGameSDK + Poly3 收银台 + Sapi2 通行证），提供百度账号登录、支付、游戏更新提示、防沉迷等能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_baidu_wangxun:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：
1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入，对应 `BDConfig.fromMap`）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 应用 ID | `appid` | `bd_app_id` | **必填** | 百度游戏 AppID |
| 应用 Key | `appkey` | `bd_app_key` | **必填** | 百度游戏 AppKey |
| 屏幕方向 | `screen_orientation` | — | 可选 | 默认横屏 |
| 调试模式 | `debug` | — | 可选 | 开启百度 SDK 日志 |

> 具体字段以 `BDConfig#fromMap` / `checkParams` 为准。

### AndroidManifest 配置

模块自带百度 SDK Activity / Provider 声明；如选择 meta-data 注入参数：

```xml
<meta-data android:name="bd_app_id" android:value="YOUR_APP_ID" />
<meta-data android:name="bd_app_key" android:value="YOUR_APP_KEY" />
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
BDConfig bdConfig = BDConfig.fromMap(hashMap);
BDGameSDK.init(activity, bdConfig.toBDGameSDKSetting(), response);
```

### 角色信息上报

业务侧统一调用 `RuiXueSdk.getApi().setGameInfo(gameInfo)`（无回调），内部映射为 `BDGameSDK.reportUserData(json)`（网游必接）。

| GameInfo | reportUserData JSON |
| --- | --- |
| `roleName` | `nick`；`role`（无职业扩展时同 `nick`） |
| `attach.career` / `profession` / `role` | `role`（职业/角色类型，优先） |
| `serverName`；`attach.realm_name` | `region`（大区） |
| `serverId` | `server` |
| `gameRoleLevel` | `level` |
| `gameRolePower` | `power` |

百度侧无创角/升级分事件，任意 `type` 均按当前角色快照上报。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 切换账号、会话失效、防沉迷退出共享同一个 `IResponse` 回调
- 默认在初始化后立刻调用 `BDSdkHelper.queryGameUpdateInfo(...)` 检查游戏更新

## 版本与构建要求

### 混淆配置

宿主 `proguard-rules.pro` 追加：

```proguard
-keep class org.json.alipay.** { *; }
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment
-keepclassmembers public class * extends android.app.Activity { public *; }

# 百度 / 收银台 / Sapi2
-keep class com.baidu.** { *; }
-keep class com.baidu.poly3.** { *; }
-dontwarn com.baidu.sapi2.**
-dontnote com.baidu.sapi2.**

# 一键登录
-keep class com.bun.miitmdid.core.** {*;}
-keep class com.sdk.base.api.* {*;}
-keep class com.sdk.mobile.manager.** {*;}
-keep class com.sdk.base.framework.bean.* {*;}
-keep class com.sdk.base.module.config.* {*;}
-keep class com.sdk.base.module.manager.* {*;}
-keep class com.sdk.mobile.config.* {*;}
-dontwarn com.cmic.sso.sdk.**
-keep class com.cmic.sso.sdk.**{*;}
-keep class cn.com.chinatelecom.gateway.**{*;}

# 第三方支付
-keep class com.tencent..** { *; }
-keep class com.alipay.** { *; }
-dontwarn com.alipay.**
-dontwarn com.squareup.picasso.**
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.baidu.gamesdk.lib:BaiduGameSDK` | `1.9.0.6` | 百度游戏主 SDK |
| `com.baidu:poly3-default-pay` | `1.0.1` | Poly3 默认支付通道 |
| `com.baidu:poly3-core` | `3.0.33` | Poly3 收银台核心 |
| `com.baidu.sofire:sofire-sdk` | `9.5.3.7` | 百度安全 SDK |
| `com.baidu.sapi2.enhanced:pass-module-enhanced` | `9.6.4.11` | 百度 Sapi2 增强模块 |
| `com.baidu.passport.sapi2:pass-sdk-core` | `9.6.4.12` | 百度 Sapi2 核心 |
| `com.baidu.pass:pass-httpclient` | `1.6.0` | Sapi2 网络栈 |
| `com.baidu.sso:onekey_login_ssolibrary` | `1.2.7` | 一键登录 SSO 适配 |
| `com.baidu.pass_img_loader:img-loader` | `1.2.7` | Sapi2 图片加载 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
