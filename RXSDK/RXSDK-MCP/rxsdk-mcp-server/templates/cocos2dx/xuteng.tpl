# 栩腾渠道（Cocos2dx Android）

栩腾不使用专属 Cocos Bridge，登录、支付、角色上报、登出和退出均使用公共 `RuixueBridge`。Android 固定依赖要求：

```groovy
implementation 'com.ruixue:rxsdk_xuteng:4.0.19'
```

宿主最低 API 23，最终 Application 为 `com.ruixue.sdk.XTApplication`，并配置真实 `CHANNELSDK_ID`、`CHANNELSDK_GAME_VERSION` placeholder。将母包工具生成的 `brsdk.cfg` 放入应用 assets；不要生成或提交假配置。

```cpp
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
auto bridge = ruixue::RuixueBridge::getInstance();

bridge->init(baseConfigJson, callback);
bridge->initThirdSdk("{}", callback);

bridge->login(R"({"loginType":"xuteng"})", callback);

bridge->pay(R"({
    "payType":"xuteng",
    "goodsTag":"YOUR_GOODS_TAG",
    "tradeNo":"YOUR_SERVER_ORDER"
})", callback);

bridge->setGameInfo(R"({
    "type":2,
    "roleId":"YOUR_ROLE_ID",
    "roleName":"YOUR_ROLE_NAME",
    "serverId":"YOUR_SERVER_ID",
    "serverName":"YOUR_SERVER_NAME",
    "gameRoleLevel":"YOUR_ROLE_LEVEL"
})", callback);

bridge->logout(callback);
bridge->exitApp(callback);
#else
// iOS 不支持栩腾渠道。
#endif
```

Cocos 公共桥真实输入为 `payType=xuteng`，Android Java 支付层会转换为渠道参数 `hq_type=xuteng`。客户端支付结果不作为发货依据。
