# 栩腾渠道（Unity Android）

栩腾不提供专属 UPM。只使用以下公共包的固定版本 `4.0.3` 或更高：

```json
"com.ruixue.unitysdk.base": "4.0.3",
"com.ruixue.unitysdk.login": "4.0.3",
"com.ruixue.unitysdk.pay": "4.0.3"
```

Android 原生渠道依赖为 `com.ruixue:rxsdk_xuteng:4.0.19` 或更高，最低 API 23。`mainTemplate.gradle` 中不得与其他渠道库并存。

`launcherTemplate.gradle` 的 `defaultConfig` 必须配置真实 `CHANNELSDK_ID` 和 `CHANNELSDK_GAME_VERSION` placeholder。最终 Manifest 的 Application 必须为 `com.ruixue.sdk.XTApplication`；将母包工具生成的 `brsdk.cfg` 放到 `Assets/Plugins/Android/assets/brsdk.cfg`。不要生成或提交假配置。混淆规则由 AAR consumer rules 透传，无需专属 BuildProcessor 或专属 UPM。

## 初始化

```csharp
RuiXueSdk.Initialize(cpId, productId, channelId, baseUrlList,
    data =>
    {
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>(),
            OnSuccess, OnError);
    },
    OnError);
```

## 登录

```csharp
RXLogin.Login(new LoginConfig
{
    loginType = LoginMethod.Xuteng
}, OnSuccess, OnError);
```

`LoginMethod.Xuteng` 对应底层 `method=xuteng`。

## 支付

```csharp
RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "xuteng",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_SERVER_ORDER"
}, OnSuccess, OnError);
```

客户端结果不作为发货依据，必须以后端支付通知验签、验单结果为准。

## 角色上报

```csharp
RuiXueSdk.SetThirdGameInfo(new GameInfo(2, "YOUR_ROLE_ID", "YOUR_SERVER_ID")
{
    roleName = "YOUR_ROLE_NAME",
    serverName = "YOUR_SERVER_NAME",
    gameRoleLevel = "YOUR_ROLE_LEVEL"
});
```

## 退出

```csharp
RuiXueSdk.ExitApp(
    result => Debug.Log("栩腾渠道确认退出：" + result),
    () => Debug.Log("栩腾渠道取消退出"));
```

仅支持 Android；iOS 不支持栩腾渠道。
