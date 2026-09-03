# 栩腾渠道 Unity 接入

## 接入方式

* Package Manager 导入公共包 RuiXue.Base、RuiXue.Login、RuiXue.Pay，版本均不低于 `4.0.3`。
* 栩腾不提供独立 UPM；渠道能力由公共包调用 Android 原生渠道库。

> 栩腾渠道仅支持 Android，iOS 不支持。

## SDK集成

```groovy
    // 与其他渠道库互斥；切换渠道时只替换这一项
    implementation 'com.ruixue:rxsdk_xuteng:${version}'
```

### 版本要求

* Unity 公共包: 4.0.3
* Android: 4.0.19
* Android `minSdkVersion`: 23

### 渠道配置

#### launcherTemplate.gradle

在 Android `defaultConfig` 中配置栩腾提供的真实参数：

```groovy
android {
    defaultConfig {
        minSdkVersion 23
        manifestPlaceholders.put("CHANNELSDK_ID", "YOUR_CHANNELSDK_ID")
        manifestPlaceholders.put("CHANNELSDK_GAME_VERSION", "YOUR_GAME_VERSION")
    }
}
```

#### AndroidManifest.xml

最终应用的 `Application` 必须使用 `XTApplication`：

```xml
<application
    android:name="com.ruixue.sdk.XTApplication"
    ... />
```

宿主已有自定义 `Application` 时，应让自定义类继承
`com.ruixue.sdk.XTApplication`，不能同时声明两个 `Application`。

#### brsdk.cfg

将栩腾母包工具生成的配置文件放到：

```text
Assets/Plugins/Android/assets/brsdk.cfg
```

导出后应位于应用的 `src/main/assets/brsdk.cfg`。该文件必须使用栩腾交付的真实配置，
不要生成或提交包含真实敏感值的示例配置。

#### 混淆配置

栩腾渠道所需混淆规则已通过 Android AAR 的 `consumer-rules.pro` 自动透传，
业务工程无需重复复制，也不需要栩腾专属 BuildProcessor。

## 配置说明

### 栩腾渠道参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `CHANNELSDK_ID` | `string` | 栩腾后台分配的渠道 ID |
| `CHANNELSDK_GAME_VERSION` | `string` | 栩腾要求上报的游戏版本 |
| `brsdk.cfg` | `file` | 栩腾母包工具生成的渠道配置 |

### 初始化

先初始化瑞雪 SDK，再在隐私授权通过后初始化第三方 SDK：

```csharp
using System.Collections.Generic;
using RuiXue;
using UnityEngine;

RuiXueSdk.Initialize(
    "YOUR_CP_ID",
    "YOUR_PRODUCT_ID",
    "YOUR_CHANNEL_ID",
    new List<string> { "https://YOUR_BASE_URL" },
    response =>
    {
        RuiXueSdk.SetPrivacyAgree(isAgree =>
        {
            if (!isAgree)
            {
                Debug.LogWarning("用户未同意隐私协议，停止初始化栩腾渠道");
                return;
            }

            RuiXueSdk.InitThirdSdk(
                new Dictionary<string, object>(),
                data => Debug.Log("栩腾渠道初始化成功：" + data),
                Debug.LogError);
        });
    },
    Debug.LogError);
```

### 登录

```csharp
using RuiXue.Login;

RXLogin.Login(new LoginConfig
{
    loginType = LoginMethod.Xuteng
}, data => Debug.Log("栩腾登录成功：" + data), Debug.LogError);
```

`LoginMethod.Xuteng` 对应底层 `method=xuteng`。必须在
`RuiXueSdk.InitThirdSdk` 成功后调用。

### 支付

以下为示例，商品和订单参数必须由业务服务端提供：

```csharp
using System.Collections.Generic;
using RuiXue.Pay;

RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "xuteng",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_SERVER_ORDER"
}, data => Debug.Log("栩腾支付结果：" + data), Debug.LogError);
```

客户端支付结果不作为发货依据，必须以后端支付通知验签、验单结果为准。

### 上传游戏角色信息

栩腾角色事件类型：`1` 选服、`2` 创角、`3` 进入游戏、`4` 升级。

```csharp
GameInfo info = new GameInfo(
    /* type */ 2,
    /* roleId */ "YOUR_ROLE_ID",
    /* serverId */ "YOUR_SERVER_ID")
{
    roleName = "YOUR_ROLE_NAME",
    serverName = "YOUR_SERVER_NAME",
    gameRoleLevel = "YOUR_ROLE_LEVEL",
    vipLevel = 0,
    gameRolePower = 0,
    partyId = "YOUR_PARTY_ID",
    partyName = "YOUR_PARTY_NAME",
    experience = "0",
    balance = "0",
    attach = string.Empty
};

RuiXueSdk.SetThirdGameInfo(info);
```

### 登出

```csharp
RXLogin.Logout(
    data => Debug.Log("栩腾登出成功：" + data),
    Debug.LogError);
```

### 退出

```csharp
RuiXueSdk.ExitApp(
    data => Debug.Log("栩腾渠道确认退出：" + data),
    () => Debug.Log("栩腾渠道取消退出"));
```

## 方法API

栩腾 Unity 接入全部使用公共 API：

* `RuiXueSdk.Initialize`：初始化瑞雪 SDK
* `RuiXueSdk.InitThirdSdk`：初始化栩腾渠道 SDK
* `RXLogin.Login`：渠道登录，使用 `LoginMethod.Xuteng`
* `RXPay.Pay`：渠道支付，使用 `hq_type=xuteng`
* `RuiXueSdk.SetThirdGameInfo`：上传角色信息
* `RXLogin.Logout`：渠道登出
* `RuiXueSdk.ExitApp`：渠道退出

完整示例见：

* `Assets/Samples/RuiXue.Xuteng/4.0.3/RuiXueXutengDemo/RuiXueXutengDemo.cs`
* `Assets/Samples/RuiXue.Xuteng/4.0.3/RuiXueXutengDemo/RuiXueXutengDemo.unity`
