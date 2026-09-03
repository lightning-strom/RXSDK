# 虎牙渠道 Unity 接入

## 接入方式

* Package Manager 导入公共包 RuiXue.Base、RuiXue.Login、RuiXue.Pay。

> 虎牙联运仅支持 Android，不提供独立 UPM。

## SDK集成

```groovy
    // 与其他渠道库互斥；切换渠道时只替换这一项
    implementation 'com.ruixue:rxsdk_huya:${version}'
```

### 版本要求

* Unity 公共包: 4.0.2
* Android: 4.0.19

### 渠道配置

RuiXue.Base `4.0.2` 及以上会在导出 Android 工程时自动补充虎牙联运所需的
Volcengine Maven 仓库。自定义导出流程时需手动添加：

```groovy
maven {
    url 'https://artifact.bytedance.com/repository/Volcengine/'
}
```

Android 渠道库必须与百度、MuMu 等其他宿主渠道库互斥。

## 配置说明

### 虎牙渠道参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `game_id` | `string` | 虎牙游戏 ID |
| `login_client_id` | `string` | 虎牙登录 Client ID |
| `login_client_secret` | `string` | 虎牙登录 Client Secret |
| `pay_app_id` | `string` | 虎牙支付 App ID |
| `huya_debug_mode` | `bool` | 调试模式，正式发版必须为 `false` |
| `landscape_mode` | `bool` | 是否横屏 |
| `show_switch_count_in_game_center` | `bool` | 是否展示切换账号入口 |

参数必须通过安全配置注入，禁止将生产 Client Secret 写入代码、日志或仓库。

### 初始化

```csharp
RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
{
    ["game_id"] = "YOUR_GAME_ID",
    ["login_client_id"] = "YOUR_LOGIN_CLIENT_ID",
    ["login_client_secret"] = "YOUR_LOGIN_CLIENT_SECRET",
    ["pay_app_id"] = "YOUR_PAY_APP_ID",
    ["huya_debug_mode"] = false,
    ["landscape_mode"] = true,
    ["show_switch_count_in_game_center"] = true
}, OnSuccess, OnError);
```

### 登录

```csharp
RXLogin.Login(new LoginConfig
{
    loginType = LoginMethod.Huya
}, OnSuccess, OnError);
```

### 支付

```csharp
RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "huya",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
}, OnSuccess, OnError);
```

### 渠道回调

切号、被动登出等渠道事件统一使用 Base 包的公共回调：

```csharp
RuiXueSdk.SetSdkCallback(OnPublicEvent, OnLogout, OnSwitchAccount);
```

### 上传游戏角色信息

```csharp
RuiXueSdk.SetThirdGameInfo(new GameInfo(2, "role_10001", "server_1")
{
    roleName = "角色名",
    serverName = "一区",
    gameRoleLevel = "12",
});
```

### Android Activity 生命周期

宿主 Activity 必须向 `RuiXueSdk` 转发 `onResume`、`onPause`、
`onActivityResult` 和 `onRequestPermissionsResult`。iOS 不支持虎牙联运。

## 测试与验收

* Unity Android `Application Identifier` 与虎牙后台登记的包名一致。
* Debug / Release 签名及签名 MD5 已按渠道要求登记。
* `game_id`、`login_client_id`、`login_client_secret`、`pay_app_id` 均非空。
* 登录、支付和角色上报前，`RuiXueSdk.Initialize` 与
  `RuiXueSdk.InitThirdSdk` 均已成功回调。
* 导出的 Gradle 工程包含 `rxsdk_huya`，且未混入无关的
  `rxsdk_overseas`、`rxsdk_xingyi` 等渠道依赖。
* 支付商品 ID / 计费点与虎牙及瑞雪后台配置一致；发货以后端 notify
  验签、验单结果为准。

## 常见问题

### 虎牙初始化提示必填参数为空

确认传给 `RuiXueSdk.InitThirdSdk` 的 Dictionary 使用
`game_id`、`login_client_id`、`login_client_secret`、`pay_app_id`，并确认
重新导出 Unity 工程，而不是只执行旧导出工程的 Gradle 构建。

### 登录返回 `access_token invalid`

先确认虎牙渠道初始化已成功。检查测试/正式环境是否匹配、
`loginClientId` 是否与虎牙返回的 `accessToken`、`unionid` 属于同一环境，
以及 Manifest 合并后的 `HY_OPENAPPID` 是否正确。

### 虎牙 App 授权登录失败

核对应用包名、签名 MD5 与虎牙后台登记信息；同时确认 Activity 已转发
`onActivityResult` 和 `onRequestPermissionsResult`。

### 测试环境验证码

测试环境短信验证码一般为 `123456`，最终以虎牙运营说明为准。

### 客户端支付成功但未发货

客户端成功仅表示支付流程已拉起或完成回调，不可直接发货。必须以后端支付
通知和订单查询结果为准。
