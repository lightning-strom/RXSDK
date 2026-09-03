# 虎牙联运（Android）

## 版本与依赖

```groovy
implementation 'com.ruixue:rxsdk_huya:4.0.19'
```

- Android SDK 必须为 `4.0.19` 或更高固定版本。
- 模块会通过 `api` 透传 `com.huya.sdk:berry:1.4.5-698` 及其运行依赖，宿主不要随意裁剪。
- 在依赖仓库中显式添加 Volcengine Maven：

```groovy
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

## 初始化

```java
Map<String, Object> config = new HashMap<>();
config.put("game_id", "YOUR_GAME_ID");
config.put("login_client_id", "YOUR_LOGIN_CLIENT_ID");
config.put("login_client_secret", "YOUR_LOGIN_CLIENT_SECRET");
config.put("pay_app_id", "YOUR_PAY_APP_ID");
config.put("huya_debug_mode", true); // 联调 true，上线必须 false
config.put("landscape_mode", true);
config.put("show_switch_count_in_game_center", true);

RuiXueSdk.getApi().initThirdSdk(activity, config, callback);
```

生产环境的 `login_client_secret` 必须通过安全配置注入，禁止写入日志或提交到公开仓库。示例值均为占位符。

## 登录

```java
Map<String, Object> login = new HashMap<>();
login.put("method", "huya");
RuiXueSdk.getApi().login(activity, login, jsonCallback);
```

## 支付

```java
Map<String, Object> pay = new HashMap<>();
pay.put("hq_type", "huya");
pay.put("goods_tag", "YOUR_GOODS_TAG");
pay.put("trade_no", "YOUR_TRADE_NO");
RuiXueSdk.getApi().pay(activity, pay, jsonCallback);
```

客户端支付成功不等于发货成功，发货必须以后端支付通知验签、验单结果为准。

## 角色信息上报

```java
GameInfo gameInfo = new GameInfo(2, "role_10001", "server_1");
gameInfo.setRoleName("角色名");
gameInfo.setServerName("一区");
gameInfo.setGameRoleLevel("12");
gameInfo.setAttach("{\"sdk_channel_id\":\"huya\"}");
RuiXueSdk.getApi().setGameInfo(gameInfo);
```

## Activity 生命周期

宿主 Activity 必须把以下回调转发给 `RuiXueSdk`：

```java
RuiXueSdk.onResume(this);
RuiXueSdk.onPause(this);
RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
```

不要在 `Activity.onDestroy` 中主动销毁进程级虎牙渠道 SDK。
