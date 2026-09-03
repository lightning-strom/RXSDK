# 虎牙联运（Unity Android）

## 版本与依赖

- Unity 使用公共 UPM，不安装虎牙专属包：

```json
"com.ruixue.unitysdk.base": "4.0.2",
"com.ruixue.unitysdk.login": "4.0.2",
"com.ruixue.unitysdk.pay": "4.0.2"
```

- 三个公共包均要求固定版本 `4.0.2` 或更高；同一工程中的瑞雪固定 UPM 应保持同一最低版本。
- Android 渠道选择 `rxsdk_huya`，原生依赖 `com.ruixue:rxsdk_huya:4.0.19` 或更高。
- 使用 `unity feature=channel_config thirdChannel=huya` 可声明式写入原生依赖、Volcengine Maven 与初始化参数说明；不需要虎牙专属配置类或 BuildProcessor。
- 仅支持 Android；iOS 不支持虎牙联运。

## Android Gradle

`Assets/Plugins/Android/mainTemplate.gradle`：

```groovy
implementation 'com.ruixue:rxsdk_huya:4.0.19'
```

`Assets/Plugins/Android/settingsTemplate.gradle` 的仓库配置：

```groovy
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

## 初始化

先完成 `RuiXueSdk.Initialize` 基础初始化，再调用虎牙渠道初始化：

```csharp
var config = new Dictionary<string, object>
{
    ["game_id"] = "YOUR_GAME_ID",
    ["login_client_id"] = "YOUR_LOGIN_CLIENT_ID",
    ["login_client_secret"] = "YOUR_LOGIN_CLIENT_SECRET",
    ["pay_app_id"] = "YOUR_PAY_APP_ID",
    ["huya_debug_mode"] = Debug.isDebugBuild,
    ["landscape_mode"] = true,
    ["show_switch_count_in_game_center"] = true
};

RuiXueSdk.InitThirdSdk(config, OnSuccess, OnError);
```

生产环境的 `loginClientSecret` / `login_client_secret` 必须通过安全配置注入，禁止写入日志或提交到公开仓库。示例值均为占位符。

## 登录

```csharp
RXLogin.Login(new LoginConfig
{
    loginType = LoginMethod.Huya
}, OnSuccess, OnError);
```

`LoginMethod.Huya` 等价于底层 `method=huya`。

## 支付

```csharp
RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "huya",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
}, OnSuccess, OnError);
```

客户端支付结果仅用于展示；发货必须以后端支付通知验签、验单结果为准。

## 角色信息上报

```csharp
RuiXueSdk.SetThirdGameInfo(new GameInfo(2, "role_10001", "server_1")
{
    roleName = "角色名",
    serverName = "一区",
    gameRoleLevel = "12",
    attach = "{\"sdk_channel_id\":\"huya\"}"
});
```

## Android Activity 生命周期

导出工程的 Activity 必须向 `RuiXueSdk` 转发 `onResume`、`onPause`、`onActivityResult` 和 `onRequestPermissionsResult`；公共 Base 负责原生导出处理，无需专属 BuildProcessor。
