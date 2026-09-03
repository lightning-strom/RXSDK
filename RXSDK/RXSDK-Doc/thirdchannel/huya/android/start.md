# 虎牙联运接入

## 功能简介

接入虎牙联运 SDK，提供账号登录、登出、支付、角色信息上报等渠道能力。业务侧通过瑞雪 SDK 统一入口调用，无需直接调用虎牙原生 API。

## SDK 集成

在依赖仓库中加入 Volcengine Maven：

```groovy
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

应用只接入虎牙渠道库：

```groovy
implementation 'com.ruixue:rxsdk_huya:4.0.17'
```

`rxsdk_huya` 已通过 `api` 透传 `rxsdk_base`、虎牙 Berry 和运行所需依赖，
宿主不要再接入百度、MuMu 等其他渠道库。

## 参数配置

### 初始化参数

参数由`initThirdSdk` 注入。

| 字段 | 推荐 hashMap key | 兼容 key | 必填 | 默认值 / 说明 |
| --- | --- | --- | --- | --- |
| 游戏 ID | `game_id` | `gameId`、`huya_game_id` | **必填** | 无；虎牙分配的 gameId |
| 登录 Client ID | `login_client_id` | `loginClientID`、`loginClientId`、`huya_login_client_id` | **必填** | 无 |
| 登录 Client Secret | `login_client_secret` | `loginClientSecret`、`huya_login_client_secret` | **必填** | 无；仅填写渠道提供的客户端参数占位值 |
| 支付 AppId | `pay_app_id` | `payAppId`、`huya_pay_app_id` | **必填** | 无 |
| 调试模式 | `huya_debug_mode` | `debugMode`、`isDebug` | 可选 | `false` |
| 横屏模式 | `landscape_mode` | `landscapeMode` | 可选 | `true` |
| 游戏中心切号入口 | `show_switch_count_in_game_center` | `isShowSwitchCountInGameCenter` | 可选 | `true` |

> 示例中的敏感参数仅使用占位符。支付签名密钥等服务端参数不得写入客户端
> 配置或文档。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、角色上报等能力；本模块不要求业务直接调用渠道原生 API。

### 初始化

由 SDK 主流程调用 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成。初始化成功以渠道异步回调为准；必填参数缺失会走失败回调。
```java
Map<String, Object> params = new HashMap<>();
params.put("game_id", "YOUR_GAME_ID");
params.put("login_client_id", "YOUR_LOGIN_CLIENT_ID");
params.put("login_client_secret", "YOUR_LOGIN_CLIENT_SECRET");
params.put("pay_app_id", "YOUR_PAY_APP_ID");
params.put("huya_debug_mode", false);             // 可选，默认 false
params.put("landscape_mode", true);               // 可选，默认 true
params.put("show_switch_count_in_game_center", true); // 可选

RuiXueSdk.getApi().initThirdSdk(activity, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject json) {
        if (json.optInt("code") == 0) {
            // 渠道初始化成功
        } else {
            // 必填参数缺失或渠道初始化失败
        }
    }
});
```
宿主需将 Activity 生命周期与权限结果转发给瑞雪 SDK（`onResume` / `onPause` / `onActivityResult` / `onRequestPermissionsResult`），渠道内部会完成前后台与登录结果处理。

> 不要在 `Activity.onDestroy` 中销毁渠道 SDK；渠道为进程级单例，误销毁会导致无法再次初始化/登录。

### 登录

- 登录方式：`method = "huya"`
- 浮球切号 / 被动登出 / 防沉迷踢出通过 `RuiXueSdkCallback#onSwitchAccount` / `onLogout` 通知业务；切号场景 `onSwitchAccount` 返回 `true` 时 SDK 会清理本地会话

### 支付

- 下单 `hq_type = "huya"`

### 角色信息上报


业务侧统一调用 `RuiXueSdk.getApi().setGameInfo(gameInfo)`（无回调）。

```java
GameInfo gameInfo = new GameInfo(2, "role_10001", "server_1"); // type: 1创角/2进游/3升级/4退出
gameInfo.setRoleName("角色名");
gameInfo.setServerName("一区");
gameInfo.setGameRoleLevel("12");
gameInfo.setAttach("{"
        + "\"career\":\"战士\","
        + "\"chapter\":\"第一章\","
        + "\"realm_id\":\"1\","
        + "\"realm_name\":\"人界\","
        + "\"sdk_channel_id\":\"huya\""
        + "}");
RuiXueSdk.getApi().setGameInfo(gameInfo);
```

- 上报角色 ID/名称、区服 ID/名称、等级等基础字段
- `GameInfo.attach`（JSON）可透传：`career`、`chapter`、`realm_id`、`realm_name`、`sdk_channel_id`
- 虎牙侧无创角/升级分事件，任意 `type` 均按当前角色快照上报


## 测试与验收

- 控制台包名与 `applicationId` 一致，且与虎牙后台登记一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID / 计费点与渠道及瑞雪后台配置一致；发货以后端 notify 验单为准。

## 常见问题

### 其他说明

- 测试环境短信验证码一般为 `123456`（以虎牙运营说明为准）
- 虎牙 App 授权登录失败时，核对包名与签名 MD5 是否与提交虎牙运营的信息一致
- 客户端支付成功 ≠ 发货成功，须以后端回调对账后发货

## 版本与构建要求

### 混淆配置

模块已配置 `consumerProguardFiles`，并透传虎牙 Berry 自带混淆规则。宿主开启 minify 时一般无需再手写；如需自定义，可保留：

```proguard
-keep class com.huya.** { *; }
-keep class com.duowan.** { *; }
-dontwarn com.huya.**
-dontwarn com.duowan.**
```

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.ruixue:rxsdk_base` | 与 `rxsdk_huya` 同版本 | 瑞雪公共能力（模块 `api` 透传） |
| `com.huya.sdk:berry` | `1.4.5-698` | 虎牙联运主体（模块 `api` 透传） |
| `com.github.bumptech.glide:glide` | `4.8.0` | 图片加载（已透传） |
| `com.nostra13.universalimageloader:universal-image-loader` | `1.9.5` | 图片加载（已透传） |
| `com.jakewharton:disklrucache` | `2.0.2` | 磁盘缓存（已透传） |
| `androidx.lifecycle:lifecycle-extensions` | `2.2.0` | 生命周期（已透传） |
| `com.google.code.gson:gson` | `2.8.5` | JSON（已透传） |
| `com.alibaba:fastjson` | `1.1.34.android` | JSON（已透传） |
| `com.squareup.okhttp3:okhttp` | `3.10.0` | 网络（已透传） |
| `com.squareup.okio:okio` | `1.14.0` | 网络 I/O（已透传） |
| `org.jetbrains.kotlin:kotlin-android-extensions-runtime` | `1.3.72` | Kotlin 运行依赖（已透传） |
| `org.jetbrains.kotlin:kotlin-stdlib-jdk7` | `1.3.50` | Kotlin 标准库（已透传） |
| `org.jetbrains:annotations` | `13.0` | 注解（已透传） |
| `com.bytedance.applog:RangersAppLog-Lite-cn` | `6.16.9` | 数据上报（已透传） |
| `com.bytedance.ads:AppConvert` | `1.3.2.1` | 转化归因（已透传） |

> 宿主请勿随意裁剪透传依赖，否则登录阶段可能出现 `NoClassDefFoundError`（如 ImageLoader 相关类）。
