# Unity Firebase 接入文档

`RuiXue.Firebase` 是瑞雪 Unity SDK 的 Firebase 桥接包，当前用于接入 Firebase Analytics、Crashlytics 和 FCM 推送能力。

## 版本要求

| 项 | 内容 |
|----|------|
| UPM 名称 | `com.ruixue.unitysdk.firebase` |
| 最低版本 | `1.6.30` |
| 依赖 | `com.ruixue.unitysdk.base` `1.6.30` |
| Android Maven | `com.ruixue:rxsdk_firebase:${rxVersion}` |
| iOS Pod | `RXFirebaseSDK` |
| 示例 | `Samples~/Demo/RuiXueFirebaseDemo.cs` |

接入方 Unity 工程中所有 `com.ruixue.unitysdk.*` 依赖建议保持同一版本。若通过 MCP 进行工程配置，低于 `1.6.30` 的瑞雪 Unity 依赖会被强制升级到 `1.6.30`。

## 安装方式

在 Unity 工程的 `Packages/manifest.json` 中添加依赖：

```json
{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.30",
    "com.ruixue.unitysdk.firebase": "1.6.30"
  }
}
```

如果项目已经接入 `com.ruixue.unitysdk.uioverseas` `1.6.30`，则会自动依赖 `com.ruixue.unitysdk.firebase`，无需重复添加。

## 平台配置

### Android

1. 确认 Unity Android 工程启用了自定义 Gradle 模板：

```text
Assets/Plugins/Android/mainTemplate.gradle
Assets/Plugins/Android/settingsTemplate.gradle
```

2. 在 `mainTemplate.gradle` 的 `dependencies` 中添加瑞雪 Firebase Android 原生库：

```gradle
dependencies {
    def rxVersion = "4.0.x"

    implementation "com.ruixue:rxsdk_base:${rxVersion}"
    implementation "com.ruixue:rxsdk_overseas:${rxVersion}"
    implementation "com.ruixue:rxsdk_firebase:${rxVersion}"
}
```

`rxVersion` 使用项目当前接入的瑞雪 Android 原生 SDK 版本。`rxsdk_overseas` 是海外渠道示例，实际渠道库按项目选择；Firebase 功能必须额外加入 `rxsdk_firebase`。若通过 MCP 配置 Unity Android 原生依赖，调用 `unity feature=android_native_setup` 时在 `components` 中加入 `rxsdk_firebase`，MCP 会自动写入 Maven 依赖、瑞雪 Maven 仓库和 Proguard 配置。

3. 将 Firebase 控制台下载的 `google-services.json` 放到 Unity 工程：

```text
Assets/Plugins/Android/google-services.json
```

4. 如需通知默认图标，将 `ic_notification_default.png` 放到：

```text
Assets/Resources/ic_notification_default.png
```

Android 构建时，包内 `FirebaseAfterBuildToDo` 会把 `google-services.json` 拷贝到导出的 Gradle `launcher` 工程，并把默认通知图标拷贝到 `res/drawable`。

### iOS

1. 将 Firebase 控制台下载的 `GoogleService-Info.plist` 放到 Unity 工程：

```text
Assets/Plugins/IOS/GoogleService-Info.plist
```

2. 确认 iOS Pod 依赖已包含：

```ruby
pod 'RXFirebaseSDK'
```

3. 可通过 Unity 菜单创建配置标记：

```text
瑞雪SDK/XCode Settings/Firebase
```

该菜单会创建：

```text
Assets/RuiXueSettings/RuiXueSDK_FirebaseXcodeSetting.asset
```

iOS 构建后，包内 `FirebaseIOSPostBuildProcessor` 会把 `GoogleService-Info.plist` 拷贝到 Xcode 工程根目录，并加入 Unity 主 Target。

## 初始化

调用 Firebase API 前，建议先完成瑞雪基础库初始化，再初始化 Firebase Analytics。

```csharp
using System.Collections.Generic;
using RuiXue;
using RuiXue.Firebase;

public void InitSdk()
{
    RuiXueSdk.Initialize(
        "cpId",
        "productId",
        "channelId",
        new List<string> { "https://api.example.com/" },
        data => LogUtil.Log("EventManager", data),
        error => LogUtil.Log("EventManager", error)
    );

    RXFirebase.InitFirebaseAnalytics();
}
```

## Analytics 埋点

```csharp
using System.Collections.Generic;
using RuiXue.Firebase;

public void LogSignUp()
{
    Dictionary<string, object> parameters = new()
    {
        { RxFirebaseAnalytics.Param.METHOD, "guest" }
    };

    RXFirebase.LogEvent(RxFirebaseAnalytics.Event.SIGN_UP, parameters);
}
```

设置默认事件参数：

```csharp
Dictionary<string, object> defaultParameters = new()
{
    { "server_id", "1001" },
    { "role_level", 12 }
};

RXFirebase.SetDefaultEventParameters(defaultParameters);
```

设置用户属性和用户 ID：

```csharp
RXFirebase.SetUserProperty("vip_level", "3");
RXFirebase.SetAnalyticsUserId("user_123456");
RXFirebase.SetAnalyticsCollectionEnabled(true);
```

## Crashlytics

Android 支持 Crashlytics 相关接口：

```csharp
RXFirebase.SetCustomKey("server_id", "1001");
RXFirebase.SetCustomKey("role_level", 12);
RXFirebase.Log("game enter battle");
RXFirebase.SetCrashUserId("user_123456");
RXFirebase.RecordException(new System.Exception("test exception"));
RXFirebase.SetCrashlyticsCollectionEnabled(true);
```

注意：当前 Unity Firebase 包的 iOS 实现中，Crashlytics 相关接口会返回 `WarningNotSupport`，不会实际调用原生 Crashlytics。

## FCM 推送

Android 支持 FCM 回调：

```csharp
RXFirebase.SetFCMCallBack(OnMessageReceived, OnNewToken);

void OnMessageReceived(RemoteMessage message)
{
    LogUtil.Log("EventManager", $"messageId: {message.messageId}");
    if (message.data != null)
    {
        foreach (var item in message.data)
        {
            LogUtil.Log("EventManager", $"{item.Key}: {item.Value}");
        }
    }
}

void OnNewToken(string token)
{
    LogUtil.Log("EventManager", $"fcm token: {token}");
}
```

清除回调：

```csharp
RXFirebase.ClearFCMCallBack();
```

注意：当前 Unity Firebase 包的 iOS 实现中，FCM 回调接口会返回 `WarningNotSupport`。

## 平台支持范围

| API | Android | iOS |
|-----|---------|-----|
| `InitFirebaseAnalytics` | 支持 | 支持 |
| `LogEvent` | 支持 | 支持 |
| `SetDefaultEventParameters` | 支持 | 支持 |
| `SetUserProperty` | 支持 | 支持 |
| `SetAnalyticsUserId` | 支持 | 支持 |
| `SetAnalyticsCollectionEnabled` | 支持 | 支持 |
| `SetCustomKey` / `SetCustomKeys` | 支持 | 暂不支持 |
| `Log` | 支持 | 暂不支持 |
| `SetCrashUserId` | 支持 | 暂不支持 |
| `RecordException` | 支持 | 暂不支持 |
| `SetCrashlyticsCollectionEnabled` | 支持 | 暂不支持 |
| `SetFCMCallBack` / `ClearFCMCallBack` | 支持 | 暂不支持 |

## 调试与验证

Analytics 事件默认不会在 Unity 控制台即时打印。验证埋点建议使用 Firebase DebugView：

1. iOS：Xcode Scheme 的 Run Arguments 增加 `-FIRAnalyticsDebugEnabled`。
2. Android：使用 Firebase 官方 debug mode 开启方式。
3. 运行真机，触发 `RXFirebase.LogEvent`。
4. 在 Firebase 控制台 Analytics DebugView 查看事件。

常见初始化日志中，`Analytics started`、`Analytics collection enabled` 表示 Analytics 初始化成功。若出现 `Attempted to register protocol FIRAnalyticsInterop, but it already has an implementation`，通常表示 Firebase 相关依赖被重复链接，功能正常时可先忽略，若需消除需排查 Pod 或原生库重复引入。

## 示例工程

- 独立示例：`Packages/com.ruixue.unitysdk.firebase/Samples~/Demo/RuiXueFirebaseDemo.cs`
- 海外聚合示例：`Packages/com.ruixue.unitysdk.uioverseas/Samples~/Demo/OverSeasUIDemo.cs`

## 相关文件

- `Runtime/RXFirebase.cs`
- `Runtime/RxFirebaseAnalytics.cs`
- `Runtime/RemoteMessage.cs`
- `Editor/FirebaseAfterBuildToDo.cs`
- `Editor/FirebaseIOSPostBuildProcessor.cs`
- `Editor/RuiXueSDK_FirebaseXcodeSetting.cs`
- `CHANGELOG.md`
