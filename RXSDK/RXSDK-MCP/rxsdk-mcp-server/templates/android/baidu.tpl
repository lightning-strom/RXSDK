# 百度游戏渠道（Android）

百度游戏渠道仅支持 Android。请勿为 iOS 生成对应 API。

## 版本与依赖

```groovy
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.18'
```

Android SDK 必须使用 `4.0.18` 或更高固定版本。

## 初始化顺序与闪屏

先完成瑞雪基础初始化和隐私同意流程，再初始化百度渠道，成功后展示百度闪屏：

```java
// 1. 先按基础接入文档完成 RXSdkInitConfig 与 RXSDK.initialize。
Map<String, Object> config = new HashMap<>();
config.put("appid", "YOUR_BAIDU_APP_ID"); // BDConfig 最终转换为 long
config.put("appkey", "YOUR_BAIDU_APP_KEY");

// 2. 隐私同意后初始化百度渠道。
RuiXueSdk.getApi().initThirdSdk(activity, config, new RXJSONCallback() {
    @Override
    public void onSuccess(JSONObject result) {
        // 3. 渠道初始化成功后通过公共接口展示闪屏。
        RuiXueSdk.invokeChannelAction(activity, RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH,
            new HashMap<>(), splashCallback);
    }

    @Override
    public void onFailed(JSONObject error) {
        // 处理初始化失败
    }
});
```

示例只包含占位符，不要把真实 `appid` 或 `appkey` 写入日志或提交到仓库。

## 登录

```java
Map<String, Object> login = new HashMap<>();
login.put("method", "baidunet");
RuiXueSdk.getApi().login(activity, login, jsonCallback);
```

## 悬浮窗

```java
RuiXueSdk.invokeChannelAction(activity, RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW,
    new HashMap<>(), jsonCallback);
RuiXueSdk.invokeChannelAction(activity, RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW,
    new HashMap<>(), jsonCallback);
```

## 支付

百度支付复用瑞雪通用支付接口；订单字段按通用支付文档填写：

```java
Map<String, Object> pay = new HashMap<>();
pay.put("hq_type", "baidunet");
pay.put("goods_tag", "YOUR_GOODS_TAG");
pay.put("trade_no", "YOUR_TRADE_NO");
RuiXueSdk.getApi().pay(activity, pay, jsonCallback);
```

客户端支付结果不作为发货依据，必须以后端支付通知验签、验单结果为准。

## 角色信息上报

```java
GameInfo gameInfo = new GameInfo(2, "YOUR_ROLE_ID", "YOUR_SERVER_ID");
gameInfo.setRoleName("YOUR_ROLE_NAME");
gameInfo.setServerName("YOUR_SERVER_NAME");
gameInfo.setGameRoleLevel("YOUR_ROLE_LEVEL");
RuiXueSdk.getApi().setGameInfo(gameInfo);
```

## 退出

```java
RuiXueSdk.getApi().exitApp(activity, exitCallback);
```
