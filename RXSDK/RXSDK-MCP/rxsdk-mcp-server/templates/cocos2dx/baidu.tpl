# 百度游戏渠道（Cocos2dx Android）

百度渠道仅支持 Android；iOS 不支持，必须使用平台宏保护，不能生成 iOS 伪接口。

## 版本与依赖

```groovy
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.18'
```

Android 原生 SDK 必须使用 `4.0.18` 或更高固定版本。

## 初始化顺序与闪屏

```cpp
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
auto bridge = ruixue::RuixueBridge::getInstance();

// 1. 先完成瑞雪 SDK 基础初始化。
bridge->init(baseConfigJson, [](const std::string& responseJson) {
    // 处理基础初始化结果
});

// 2. 隐私同意后初始化百度渠道。示例仅使用占位符。
bridge->initThirdSdk(R"({
    "appid":"YOUR_BAIDU_APP_ID",
    "appkey":"YOUR_BAIDU_APP_KEY"
})", [bridge](const std::string& initResponse) {
    // 3. 渠道初始化成功后通过公共接口展示百度闪屏。
    bridge->invokeChannelAction(
        ruixue::ChannelAction::SHOW_SPLASH,
        "{}",
        [](const std::string& splashResponse) {
            // 处理闪屏结果
        });
});
#else
// iOS 不支持百度游戏渠道。
#endif
```

不要把真实 `appid` 或 `appkey` 写入日志或提交到仓库。Android 原生 `BDConfig` 最终会把 `appid` 转换为 long。

## 登录

```cpp
bridge->login(R"({"loginType":"baidunet"})", [](const std::string& responseJson) {
    // 处理登录结果
});
```

## 悬浮窗

```cpp
bridge->invokeChannelAction(ruixue::ChannelAction::SHOW_FLOAT_VIEW, "{}", callback);
bridge->invokeChannelAction(ruixue::ChannelAction::HIDE_FLOAT_VIEW, "{}", callback);
```

## 支付

百度支付复用通用 `pay`：

```cpp
bridge->pay(R"({
    "hq_type":"baidunet",
    "goodsTag":"YOUR_GOODS_TAG",
    "tradeNo":"YOUR_TRADE_NO"
})", [](const std::string& responseJson) {
    // 客户端支付结果不作为发货依据
});
```

发货必须以后端支付通知验签、验单结果为准。

## 角色信息上报

```cpp
bridge->setGameInfo(R"({
    "type":2,
    "roleId":"YOUR_ROLE_ID",
    "serverId":"YOUR_SERVER_ID",
    "roleName":"YOUR_ROLE_NAME",
    "serverName":"YOUR_SERVER_NAME",
    "gameRoleLevel":"YOUR_ROLE_LEVEL"
})", [](const std::string& responseJson) {
    // 处理上报结果
});
```

## 退出

```cpp
bridge->exitApp([](const std::string& responseJson) {
    // 处理百度渠道退出结果
});
```
