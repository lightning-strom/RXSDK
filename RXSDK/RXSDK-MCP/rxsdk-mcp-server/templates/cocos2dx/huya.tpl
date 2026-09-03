# 虎牙联运（Cocos2dx Android）

虎牙联运仅支持 Android，iOS 不支持。Android Gradle 必须包含固定版本依赖：

```groovy
implementation 'com.ruixue:rxsdk_huya:4.0.19'
```

Android 工程的依赖仓库必须显式包含：

```groovy
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

## 初始化

```cpp
auto bridge = ruixue::RuixueBridge::getInstance();

bridge->init(baseConfigJson, [](const std::string& responseJson) {
    // 瑞雪 SDK 初始化结果
});

bridge->initThirdSdk(R"({
    "game_id":"YOUR_GAME_ID",
    "login_client_id":"YOUR_LOGIN_CLIENT_ID",
    "login_client_secret":"YOUR_LOGIN_CLIENT_SECRET",
    "pay_app_id":"YOUR_PAY_APP_ID",
    "huya_debug_mode":true,
    "landscape_mode":true,
    "show_switch_count_in_game_center":true
})", [](const std::string& responseJson) {
    // 虎牙渠道初始化结果
});
```

生产环境的 `login_client_secret` 必须通过安全配置注入，禁止写入日志或提交到公开仓库。示例值均为占位符。

## 登录

```cpp
bridge->login(R"({"loginType":"huya"})", [](const std::string& responseJson) {
    // 底层 method=huya
});
```

## 支付

```cpp
bridge->pay(R"({
    "payType":"huya",
    "goodsTag":"YOUR_GOODS_TAG",
    "tradeNo":"YOUR_TRADE_NO"
})", [](const std::string& responseJson) {
    // 客户端结果不作为发货依据
});
```

发货必须以后端支付通知验签、验单结果为准。

## 角色信息上报

```cpp
bridge->setGameInfo(R"({
    "type":2,
    "roleId":"role_10001",
    "roleName":"角色名",
    "serverId":"server_1",
    "serverName":"一区",
    "gameRoleLevel":"12",
    "attach":"{\"sdk_channel_id\":\"huya\"}"
})", [](const std::string& responseJson) {
    // 上报结果
});
```

Cocos2dx Android 的 `AppActivity` 必须转发 `onResume`、`onPause`、`onActivityResult` 和 `onRequestPermissionsResult` 到 `RXSDK`/`RuiXueSdk`。
