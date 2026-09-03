# 百度渠道 Unity 接入

## 接入方式

* Package Manager 导入公共包 RuiXue.Base、RuiXue.Login、RuiXue.Pay。

> 百度游戏渠道仅支持 Android。

## SDK集成

```groovy
    // 与其他渠道库互斥；切换渠道时只替换这一项
    implementation 'com.ruixue:rxsdk_baidu_wangxun:${version}'
```

### 版本要求

* Unity 公共包: 4.0.2
* Android: 4.0.19

### 渠道配置

#### AndroidManifest.xml

`rxsdk_baidu_wangxun` 已合并 Provider 时不要重复声明；只有宿主需要自行配置时才添加：

```xml
<!-- v1.9.0.6 新增 -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission
    android:name="android.permission.READ_MEDIA_IMAGES"
    android:minSdkVersion="33" />
<uses-permission
    android:name="android.permission.READ_MEDIA_VIDEO"
    android:minSdkVersion="33" />

<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:grantUriPermissions="true"
    android:exported="false">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/provider_paths" />
</provider>
```

如果项目已经配置相同 authority 的 FileProvider，不要重复声明，只需将百度路径合并到
已有的 `provider_paths.xml`。

#### provider_paths.xml

RuiXue.Base `4.0.1` 及以上会在导出 Android 工程时自动合并该文件。以下内容仅用于
自定义导出流程或排查资源冲突：

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 保留项目已有路径，并追加以下百度渠道路径 -->
    <files-path name="files-path" path="com.baidu.plaformsdk/" />
    <cache-path name="cache-path" path="/." />
    <external-path name="external-path" path="/." />
    <external-files-path name="external-files-path" path="com.baidu.plaformsdk/" />
    <external-cache-path name="external-cache-path" path="/." />
</paths>
```

#### 混淆配置

RuiXue.Base `4.0.1` 及以上会在导出 Android 工程时自动复制并启用百度渠道混淆规则：

```text
launcher/ruixue-channel-proguard.pro
```

业务工程无需重复配置；如项目有自定义混淆文件，可保留原有规则。

## 配置说明

### 百度渠道参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `appid` | `string` | 百度后台分配的应用 ID |
| `appkey` | `string` | 百度后台分配的应用 Key |

### 初始化

百度渠道闪屏必须在瑞雪 SDK、隐私授权和第三方 SDK 初始化成功后展示。

```csharp
using System.Collections.Generic;
using RuiXue;
using UnityEngine;

RuiXueSdk.Initialize(cpId, productId, channelId, urls, response =>
{
    RuiXueSdk.SetPrivacyAgree(isAgree =>
    {
        if (!isAgree)
        {
            Debug.LogWarning("用户未同意隐私协议，停止初始化百度渠道");
            return;
        }

        Dictionary<string, object> config = new Dictionary<string, object>
        {
            ["appid"] = baiduAppId,
            ["appkey"] = baiduAppKey
        };

        RuiXueSdk.InitThirdSdk(config, data =>
        {
        // 如果初始化成功后已展示闪屏则不需要额外调用。
        //     RuiXueSdk.InvokeChannelAction(
        //         RuiXueSdk.ChannelActionShowSplash,
        //         new Dictionary<string, object>(),
        //         splashData => Debug.Log("渠道闪屏展示完成：" + splashData),
        //         Debug.LogError);
        // }, Debug.LogError);
    });
}, Debug.LogError);
```

### 登录

```csharp
using RuiXue;
using RuiXue.Login;

LoginConfig config = new LoginConfig
{
    loginType = LoginMethod.BaiduNet
};

RXLogin.Login(config, data =>
{
    Debug.Log("百度登录成功：" + data);
}, Debug.LogError);
```

### 支付

以下为示例，完整支付功能参考文档：[Unity 支付](https://doc.ruixueyun.com/main/#/view?path=708d6f55-e7f8-4c32-9aa7-d5beabfdcdee)

```csharp
using RuiXue.Pay;

RXPay.Pay(new Dictionary<string, object>
{
    ["hq_type"] = "baidunet",
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
}, OnSuccess, OnError);
```

### 退出

```csharp
RuiXueSdk.ExitApp(
    data => Debug.Log("百度渠道确认退出：" + data),
    () => Debug.Log("百度渠道取消退出"));
```

### 上传游戏角色信息

百度渠道按当前角色快照上报，不区分创角、进入游戏、升级和退出事件。
详情参考文档：[上报区服角色](https://doc.ruixueyun.com/main/#/view?viewPath=dc62db49-5412-4a60-a8c9-14f38408a04b&title=%E4%B8%8A%E6%8A%A5%E5%8C%BA%E6%9C%8D%E8%A7%92%E8%89%B2&tab=&index=1)

```csharp
GameInfo info = new GameInfo(/* type */ 2, /* roleId */ "1001", /* serverId */ "S001")
{
    roleName = "剑圣",
    serverName = "华东1区",
    gameRoleLevel = "36",
    vipLevel = 5,
    gameRolePower = 98800,
    partyId = "g_8801",
    partyName = "无双战盟",
    experience = "123456",
    balance = "9999",
    attach = "{\"career\":\"战士\",\"region\":\"华东\"}"
};

RuiXueSdk.SetThirdGameInfo(info);
```

## 方法API

### 展示渠道闪屏
如果初始化成功后已展示闪屏则不需要额外调用。
```csharp
RuiXueSdk.InvokeChannelAction(
    RuiXueSdk.ChannelActionShowSplash,
    new Dictionary<string, object>(),
    data => Debug.Log("渠道闪屏展示完成：" + data),
    Debug.LogError);
```

### 展示渠道悬浮窗

```csharp
RuiXueSdk.InvokeChannelAction(
    RuiXueSdk.ChannelActionShowFloatView,
    new Dictionary<string, object>(),
    OnSuccess,
    OnError);
```

### 关闭渠道悬浮窗

```csharp
RuiXueSdk.InvokeChannelAction(
    RuiXueSdk.ChannelActionHideFloatView,
    new Dictionary<string, object>(),
    OnSuccess,
    OnError);
```

上述 C# 代码不包含百度类型。切换到其他渠道时，业务代码无需修改，只需替换
Android 渠道依赖及对应 Manifest/资源配置。

完整示例见：

* `Assets/Samples/RuiXue.Baidu/4.0.0/RuiXueBaiduDemo/RuiXueBaiduDemo.cs`
* `Assets/Samples/RuiXue.Baidu/4.0.0/RuiXueBaiduDemo/RuiXueBaiduDemo.unity`
