# 虎牙联运（Cocos2dx）

虎牙联运仅支持 Android，最低 RuiXue Android SDK 版本为 `4.0.17`。
Cocos2dx 侧复用公共 bridge，不提供虎牙专属 bridge 或客户端接口。

## Android 依赖

仅将 Android 渠道 artifact 替换为虎牙：

```gradle
implementation 'com.ruixue:rxsdk_huya:4.0.17'
```

虎牙渠道库不可与百度、MuMu 等其他渠道库共存。除瑞雪 Maven 外，还需配置
Volcengine Maven：

```gradle
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

## 渠道初始化

```cpp
bridge->initThirdSdk(R"({
  "game_id": "YOUR_GAME_ID",
  "login_client_id": "YOUR_LOGIN_CLIENT_ID",
  "login_client_secret": "YOUR_LOGIN_CLIENT_SECRET",
  "pay_app_id": "YOUR_PAY_APP_ID",
  "huya_debug_mode": false,
  "landscape_mode": true,
  "show_switch_count_in_game_center": true
})", callback);
```

## 登录和支付

```cpp
bridge->login(R"({"loginType":"huya"})", callback);

bridge->pay(R"({
  "payType": "huya",
  "goodsTag": "YOUR_GOODS_TAG",
  "tradeNo": "YOUR_TRADE_NO"
})", callback);
```

## 角色上报

```cpp
bridge->setGameInfo(R"({
  "type": 2,
  "roleId": "role_10001",
  "roleName": "角色名",
  "serverId": "server_1",
  "serverName": "一区",
  "gameRoleLevel": "12",
  "attach": "{\"sdk_channel_id\":\"huya\"}"
})", callback);
```

Android Activity 必须转发 `onResume`、`onPause`、`onActivityResult` 和
`onRequestPermissionsResult`。iOS 不支持虎牙联运。

