# Unity Adjust 接入文档

`RuiXue.Adjust` 是瑞雪 Unity SDK 的 Adjust 桥接包，用于接入 Adjust 初始化、事件上报、归因回调、深链再归因和会话参数能力。

## 版本要求

| 项 | 内容 |
|----|------|
| UPM 名称 | `com.ruixue.unitysdk.adjust` |
| 最低版本 | `1.6.30` |
| 依赖 | `com.ruixue.unitysdk.base` `1.6.30` |
| Android Maven | `com.ruixue:rxsdk_adjust:${rxVersion}` |
| iOS Pod | `RXAdjustSDK` |
| 示例 | `Samples~/Demo/RuiXueAdjustDemo.cs` |

接入方 Unity 工程中所有 `com.ruixue.unitysdk.*` 依赖建议保持同一版本。若通过 MCP 进行工程配置，低于 `1.6.30` 的瑞雪 Unity 依赖会被强制升级到 `1.6.30`。

## 安装方式

在 Unity 工程的 `Packages/manifest.json` 中添加依赖：

```json
{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.30",
    "com.ruixue.unitysdk.adjust": "1.6.30"
  }
}
```

如果项目已经接入 `com.ruixue.unitysdk.uioverseas` `1.6.30`，则会自动依赖 `com.ruixue.unitysdk.adjust`，无需重复添加。

## 平台配置

### Android

1. 确认 Unity Android 工程启用了自定义 Gradle 模板：

```text
Assets/Plugins/Android/mainTemplate.gradle
Assets/Plugins/Android/settingsTemplate.gradle
```

2. 在 `mainTemplate.gradle` 的 `dependencies` 中添加瑞雪 Adjust Android 原生库：

```gradle
dependencies {
    def rxVersion = "4.0.x"

    implementation "com.ruixue:rxsdk_base:${rxVersion}"
    implementation "com.ruixue:rxsdk_overseas:${rxVersion}"
    implementation "com.ruixue:rxsdk_adjust:${rxVersion}"
}
```

`rxVersion` 使用项目当前接入的瑞雪 Android 原生 SDK 版本。`rxsdk_overseas` 是海外渠道示例，实际渠道库按项目选择；Adjust 功能必须额外加入 `rxsdk_adjust`。若通过 MCP 配置 Unity Android 原生依赖，调用 `unity feature=android_native_setup` 时在 `components` 中加入 `rxsdk_adjust`，MCP 会自动写入 Maven 依赖、瑞雪 Maven 仓库和 Proguard 配置。

3. 确认项目已接入瑞雪基础库并完成 `RuiXueSdk.Initialize`。
4. 在 Adjust 控制台创建应用，获取 `App Token` 和事件 token。
5. 若使用深链或再归因能力，请按项目需要配置 Android intent-filter / scheme / host。

### iOS

1. 确认 iOS Pod 依赖已包含：

```ruby
pod 'RXAdjustSDK'
```

2. 可通过 Unity 菜单创建 Adjust 配置资产：

```text
瑞雪SDK/XCode Settings/Adjust
```

该菜单会创建：

```text
Assets/RuiXueSettings/RuiXueSDK_AdjustXcodeSetting.asset
```

配置项：

| 字段 | 说明 |
|------|------|
| `AppToken` | Adjust 控制台应用 App Token |
| `Environment` | `production` 正式环境，`sandbox` 测试环境 |

当前运行时初始化仍以代码传入的 `RxAdjustConfig` 为准，配置资产主要用于工程配置流程留痕和 MCP 自动配置。

## 初始化

建议先完成瑞雪基础库初始化，再初始化 Adjust。

```csharp
using System.Collections.Generic;
using RuiXue;
using RuiXue.Adjust;

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

    InitAdjust();
}

public void InitAdjust()
{
    RxAdjustConfig config = new RxAdjustConfig(
        "your_adjust_app_token",
        RxAdjustConfig.ENVIRONMENT_SANDBOX
    );

    config.needsCost = true;
    config.SetLogLevel(RxLogLevel.DEBUG);
    config.OnRxAttributionChangedDelegateListener = OnAttributionChanged;
    config.OnRxEventTrackingSucceededDelegateListener = OnEventTrackingSucceeded;
    config.OnRxEventTrackingFailedDelegateListener = OnEventTrackingFailed;
    config.OnRxSessionTrackingSucceededDelegateListener = OnSessionTrackingSucceeded;
    config.OnRxSessionTrackingFailedDelegateListener = OnSessionTrackingFailed;
    config.OnRxDeeplinkDelegateResponseListener = OnDeeplink;

    RXAdjust.Init(config);
}
```

生产环境请把 `RxAdjustConfig.ENVIRONMENT_SANDBOX` 改为 `RxAdjustConfig.ENVIRONMENT_PRODUCTION`。

## 事件上报

基础事件：

```csharp
RxAdjustEvent adjustEvent = new RxAdjustEvent("your_event_token");
RXAdjust.TrackEvent(adjustEvent);
```

收入事件：

```csharp
RxAdjustEvent adjustEvent = new RxAdjustEvent("your_revenue_event_token");
adjustEvent.setRevenue(0.99, "USD");
RXAdjust.TrackEvent(adjustEvent);
```

带回传参数 / 合作伙伴参数 / 订单号：

```csharp
RxAdjustEvent adjustEvent = new RxAdjustEvent("your_event_token");
adjustEvent.addCallbackParameter("role_id", "10001");
adjustEvent.addPartnerParameter("server_id", "1001");
adjustEvent.setOrderId("order_123456");
adjustEvent.setCallbackId("callback_123456");

RXAdjust.TrackEvent(adjustEvent);
```

## 生命周期

Android 支持手动通知前后台：

```csharp
void OnApplicationPause(bool pause)
{
    if (pause)
    {
        RXAdjust.OnPause();
    }
    else
    {
        RXAdjust.OnResume();
    }
}
```

注意：当前 Unity Adjust 包的 iOS 实现中，`OnResume` / `OnPause` 会返回 `WarningNotSupport`。

## 会话参数

会话回传参数：

```csharp
RXAdjust.AddSessionCallbackParameter("foo", "bar");
RXAdjust.RemoveSessionCallbackParameter("foo");
RXAdjust.ResetSessionCallbackParameters();
```

会话合作伙伴参数：

```csharp
RXAdjust.AddSessionPartnerParameter("partner_key", "partner_value");
RXAdjust.RemoveSessionPartnerParameter("partner_key");
RXAdjust.ResetSessionPartnerParameters();
```

## 深链与归因

获取当前深链数据（Android）：

```csharp
string data = RXAdjust.GetData();
LogUtil.Log("EventManager", $"Adjust data: {data}");
```

深链再归因（Android）：

```csharp
RXAdjust.AppWillOpenUrl("your_deeplink_url");
```

链接解析（Android）：

```csharp
RXAdjust.ResolveLink("https://example.com/link", new[] { "example.com" });
```

获取归因：

```csharp
RxAdjustAttribution attribution = RXAdjust.GetAttribution();
if (attribution != null)
{
    LogUtil.Log("EventManager", $"adid: {attribution.adid}");
    LogUtil.Log("EventManager", $"network: {attribution.network}");
    LogUtil.Log("EventManager", $"campaign: {attribution.campaign}");
}
```

## 回调处理

```csharp
public void OnAttributionChanged(RxAdjustAttribution attribution)
{
    LogUtil.Log("EventManager", $"AttributionChanged adid: {attribution.adid}");
}

public void OnEventTrackingSucceeded(RxAdjustEventSuccess data)
{
    LogUtil.Log("EventManager", data.ToString());
}

public void OnEventTrackingFailed(RxAdjustEventFailure data)
{
    LogUtil.Log("EventManager", data.ToString());
}

public void OnSessionTrackingSucceeded(RxAdjustSessionSuccess data)
{
    LogUtil.Log("EventManager", data.ToString());
}

public void OnSessionTrackingFailed(RxAdjustSessionFailure data)
{
    LogUtil.Log("EventManager", data.ToString());
}

public bool OnDeeplink(string deeplink)
{
    LogUtil.Log("EventManager", $"deeplink: {deeplink}");
    return true;
}
```

## 平台支持范围

| API | Android | iOS |
|-----|---------|-----|
| `Init` | 支持 | 支持 |
| `TrackEvent` | 支持 | 支持 |
| `OnResume` / `OnPause` | 支持 | 暂不支持 |
| `GetData` | 支持 | 暂不支持 |
| `AppWillOpenUrl` | 支持 | 暂不支持 |
| `ResolveLink` | 支持 | 暂不支持 |
| `AddSessionCallbackParameter` | 支持 | 支持 |
| `RemoveSessionCallbackParameter` | 支持 | 支持 |
| `ResetSessionCallbackParameters` | 支持 | 支持 |
| `AddSessionPartnerParameter` | 支持 | 支持 |
| `RemoveSessionPartnerParameter` | 支持 | 支持 |
| `ResetSessionPartnerParameters` | 支持 | 支持 |
| `SendFirstPackages` | 支持 | 暂不支持 |
| `GetAttribution` | 支持 | 支持 |
| 归因/事件/会话回调 | 支持 | 支持 |
| Deeplink 回调 | 支持 | 当前 C# 配置字段存在，iOS 运行时未注册该回调 |

## 注意事项

1. `App Token`、事件 token 必须替换为 Adjust 控制台中的真实值。
2. 测试环境使用 `RxAdjustConfig.ENVIRONMENT_SANDBOX`，正式发包使用 `RxAdjustConfig.ENVIRONMENT_PRODUCTION`。
3. `TrackEvent` 通常不会在 Unity 控制台即时返回业务结果，应以 Adjust 后台、回调或原生日志作为验证依据。
4. iOS 暂不支持的方法会通过 `LogUtil.WarningNotSupport` 输出提示，不代表初始化失败。
5. 使用 `com.ruixue.unitysdk.uioverseas` 时，Adjust 依赖已随海外聚合包引入。

## 示例工程

- 独立示例：`Packages/com.ruixue.unitysdk.adjust/Samples~/Demo/RuiXueAdjustDemo.cs`
- 海外聚合示例：`Packages/com.ruixue.unitysdk.uioverseas/Samples~/Demo/OverSeasUIDemo.cs`

## 相关文件

- `Runtime/RXAdjust.cs`
- `Runtime/Impl/RxAdjustConfig.cs`
- `Runtime/Impl/RxAdjustEvent.cs`
- `Runtime/Impl/RxAdjustAttribution.cs`
- `Editor/RuiXueSDK_AdjustXcodeSetting.cs`
- `CHANGELOG.md`
