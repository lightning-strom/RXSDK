# MuMu 渠道 Unity 接入

## 接入方式

* Package Manager 导入公共包 RuiXue.Base、RuiXue.Login、RuiXue.Pay。

## SDK集成

```groovy
    // 与其他渠道库互斥；切换渠道时只替换这一项
    implementation 'com.ruixue:rxsdk_yofun:${version}'
```

## 配置说明

### Android 包名

Yofun 要求 Android 包名以 `.yofun.mumu` 结尾，例如：

```text
com.example.game.yofun.mumu
```

### 角标资源

[下载 MuMu 角标资源](https://oss.ruixueyun.com/upload/20250428/ic_launcher_cover.zip)

### 渠道配置

Android 导出工程必须完成：

#### Maven 仓库

在 `settingsTemplate.gradle` 的 `dependencyResolutionManagement.repositories` 中添加：

```groovy
maven {
    url "https://maven-release.webapp.163.com/repository/maven-releases/"
}
```

#### launcherTemplate.gradle

```groovy
android {
    defaultConfig {
        multiDexEnabled true
        manifestPlaceholders = [
            app_id: "YOUR_YOFUN_APP_ID"
        ]
    }
}
```

#### AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.INTERNET" />

<application android:name="com.ruixue.openapi.RXApplication">
    <meta-data
        android:name="YOFUN_APP_ID"
        android:value="${app_id}" />
</application>
```

Unity SDK 默认使用 `RXApplication`，其中已封装 `attachBaseContext` 和 `onCreate`。
如果项目必须使用自定义 Application，应继承 `RXApplication`：

```java
public class GameApplication extends RXApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        // 游戏自身初始化
    }
}
```

#### 混淆配置

RuiXue.Base `4.0.1` 及以上会在导出 Android 工程时自动复制并启用
MuMu/Yofun 渠道混淆规则：

```text
launcher/ruixue-channel-proguard.pro
```

业务工程无需重复配置；如项目有自定义混淆文件，可保留原有规则。

### 初始化

渠道闪屏必须在瑞雪 SDK 和第三方 SDK 初始化成功后展示。

```csharp
using System.Collections.Generic;
using RuiXue;
using UnityEngine;

RuiXueSdk.Initialize(cpId, productId, channelId, urls, response =>
{
    RuiXueSdk.SetPrivacyAgree(_ =>
    {
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            // 正式发版时必须为 false
            ["debugMode"] = Debug.isDebugBuild
        }, data => RuiXueSdk.InvokeChannelAction(
            RuiXueSdk.ChannelActionShowSplash,
            new Dictionary<string, object>
            {
                // MuMu 闪屏支持 0、1、2
                ["splashType"] = 0
            },
            splashData => Debug.Log("渠道闪屏展示完成：" + splashData),
            Debug.LogError), Debug.LogError);
    });
}, Debug.LogError);
```

### 登录

```csharp
using RuiXue;
using RuiXue.Login;

LoginConfig config = new LoginConfig
{
    loginType = LoginMethod.MuMu
};

RXLogin.Login(config, data =>
{
    Debug.Log("MuMu 登录成功：" + data);
}, Debug.LogError);
```

### 监听渠道 UI 是否展示

```csharp
RuiXueSdk.SetSdkCallback((type, data) =>
{
    if (type == 1)
    {
        // 渠道 UI 展示时，如游戏被暂停则恢复运行
        Time.timeScale = 1f;
        AudioListener.pause = false;
    }
}, OnLogout, OnSwitchAccount);
```

### 上传游戏事件

MuMu 事件类型：

| type | 说明 |
| --- | --- |
| `1` | 创角成功 |
| `2` | 登录成功 |
| `3` | 角色升级 |

```csharp
GameInfo info = new GameInfo(2, "1001", "S001")
{
    roleName = "剑圣",
    serverName = "华东1区",
    gameRoleLevel = "36",
    vipLevel = 5,
    gameRolePower = 98800,
    partyId = "g_8801",
    partyName = "无双战盟",
    balance = "9999",
    attach = "{\"roleType\":\"战士\"}"
};

RuiXueSdk.SetThirdGameInfo(info);
```

## 通用渠道接口

```csharp
RuiXueSdk.InvokeChannelAction(
    RuiXueSdk.ChannelActionShowSplash,
    new Dictionary<string, object>
    {
        ["splashType"] = 0
    },
    OnSuccess,
    OnError);
```

百度与 MuMu 使用同一套 C# 业务代码。百度忽略 `splashType`，MuMu 支持
`0`、`1`、`2`；切换渠道时只替换 Android 渠道依赖和对应构建配置。
