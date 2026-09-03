# 百度游戏渠道（Unity Android）

百度渠道仅支持 Android；iOS 不支持，运行时必须先判断平台。

## 版本与依赖

- UPM：`com.ruixue.unitysdk.base`、`com.ruixue.unitysdk.login`、`com.ruixue.unitysdk.pay`，均使用固定版本 `4.0.1` 或更高。
- Android 原生依赖：`com.ruixue:rxsdk_baidu_wangxun:4.0.18` 或更高。
- 公共 Base 已自动注入百度混淆规则；原生依赖由 Android 工程配置提供。项目存在 `mainTemplate.gradle` 时必须核对其中版本。

## 初始化顺序与闪屏

先完成 `RuiXueSdk.Initialize` 和隐私同意流程，再初始化百度渠道，成功后展示闪屏：

```csharp
var config = new Dictionary<string, object>
{
    ["appid"] = "YOUR_BAIDU_APP_ID",
    ["appkey"] = "YOUR_BAIDU_APP_KEY"
};

RuiXueSdk.InitThirdSdk(config,
    _ => RuiXueSdk.InvokeChannelAction(
        RuiXueSdk.ChannelActionShowSplash,
        new Dictionary<string, object>(),
        data => Debug.Log("百度闪屏展示完成：" + data),
        error => Debug.LogError(error)),
    error => Debug.LogError(error));
```

`appid` 在 Unity 示例中按 string 传入，Android 原生 `BDConfig` 最终转换为 long。示例只包含占位符，不要记录或提交真实参数。

## 登录

```csharp
RXLogin.Login(new LoginConfig
{
    loginType = LoginMethod.BaiduNet
}, OnSuccess, OnError);
```

## 悬浮窗

```csharp
RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowFloatView,
    new Dictionary<string, object>(), OnSuccess, OnError);
RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionHideFloatView,
    new Dictionary<string, object>(), OnSuccess, OnError);
```

## 支付

百度支付复用 `RXPay` 通用支付；订单字段按通用支付文档填写：

```csharp
RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "baidunet",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
}, OnSuccess, OnError);
```

客户端支付结果不作为发货依据，必须以后端支付通知验签、验单结果为准。

## 角色信息上报

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
    result => Debug.Log("百度渠道确认退出：" + result),
    () => Debug.Log("百度渠道取消退出"));
```
