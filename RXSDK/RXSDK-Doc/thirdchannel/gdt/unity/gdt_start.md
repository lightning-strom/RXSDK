# Unity App 广点通接入

## 支持范围

Unity 广点通组件用于 Android、iOS 游戏的腾讯广告转化归因和行为上报。

| 项目 | 版本 |
| --- | --- |
| Unity UPM 包 | `com.ruixue.unitysdk.gdt` `1.6.38` |
| 瑞雪 Unity 基础包 | `com.ruixue.unitysdk.base` `1.6.38` |
| Android 原生 SDK | `com.ruixue:rxsdk_gdt:4.0.16` |
| iOS 原生 SDK | `RXGDTSDK 1.0.2`、`RXSDK_Pure 4.0.8` |
| Unity 版本 | Unity 2022.3 及以上 |

:::tip
Unity 微信小游戏使用独立的《Unity 微信小游戏广点通接入》文档。
:::

## 安装 Unity 包

在 Unity 工程的 `Packages/manifest.json` 中加入：

```json
{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.38",
    "com.ruixue.unitysdk.gdt": "1.6.38"
  }
}
```

同一 Unity 工程中的 `com.ruixue.unitysdk.*` 包版本应保持一致。

## 原生依赖

### Android

确保导出的 Android 工程包含：

```groovy
dependencies {
    implementation 'com.ruixue:rxsdk_gdt:4.0.16'
}
```

同时保留 GDT consumer ProGuard 规则。若宿主工程自行维护混淆配置，应至少包含：

```proguard
-dontwarn com.qq.gdt.action.**
-keep class com.qq.gdt.action.** { *; }
-keepclassmembers class com.qq.gdt.action.** { *; }
-keep public class com.tencent.turingfd.sdk.**
-keepclasseswithmembers class * {
    native <methods>;
}
```

Android 最低支持 API 21。`READ_PHONE_STATE` 等权限不是强制权限，用户拒绝后不得阻塞游戏正常运行。

### iOS

Unity 导出 Xcode 工程时，组件的 `Editor/Podfile` 会加入：

```ruby
pod 'RXGDTSDK', '1.0.2'
pod 'RXSDK_Pure', '4.0.8'
```

导出完成后执行 `pod install`，使用生成的 `.xcworkspace` 构建。

组件会自动处理：

- App 进入前台时上报 `START_APP`
- URL Scheme 唤起时转发 `handleOpenUrl:`

## 初始化

在代码文件中引入命名空间：

```csharp
using RuiXue.GDT;
```

### 自动上报模式

激活、注册、登录事件由瑞雪 SDK 自动上报。iOS 必须先注册 GDT 组件，再初始化瑞雪基础 SDK：

```csharp
private void InitializeSdk()
{
    // 必须早于 RuiXueSdk.Initialize 调用。
    // Android 为安全的空操作，建议双端统一调用。
    RXGDT.RegisterSdk();

    RuiXueSdk.Initialize(
        "cp-id",
        "product-id",
        "channel-id",
        baseUrlList,
        OnSuccess,
        OnError);
}
```

:::warning
`RXGDT.RegisterSdk()` 必须在 `RuiXueSdk.Initialize` 之前调用，否则 iOS 可能无法收到自动激活、注册和登录事件。
:::

### 手动上报模式

关闭服务端自动上报配置后，使用以下接口手动初始化：

```csharp
RXGDT.RegisterSdk();
RXGDT.Initialize(
    "action-set-id",
    "secret-key",
    "tencent",
    "tencent");
```

也可以使用配置对象：

```csharp
var config = new RXGDTConfig(
    "action-set-id",
    "secret-key",
    "tencent",
    "tencent");

RXGDT.Initialize(config);
```

- `actionSetId`：腾讯广告行为数据源 ID。
- `secretKey`：腾讯广告 SecretKey。
- `channel`：Android 渠道类型，默认 `tencent`。
- `channelId`：Android 渠道 ID，默认 `tencent`。
- iOS 只使用 `actionSetId` 和 `secretKey`。

:::warning
不要在代码仓库中提交真实 `secretKey`。请通过构建环境、CI Secret 或安全配置系统注入。
:::

自动模式和手动模式只能选择一种，避免注册、登录等事件重复上报。

## 事件上报

### 注册

```csharp
RXGDT.ReportRegister("guest", true);
```

- `method`：注册方式，例如 `guest`、`phone`、`wechat`。
- `success`：是否注册成功。

自动上报模式无需再次调用。

### 登录

```csharp
RXGDT.ReportLogin("guest", true);
```

- `method`：登录方式。
- `success`：是否登录成功。

自动上报模式无需再次调用。

### 创建角色

```csharp
RXGDT.ReportCreateRole("role-id");
```

建议在角色创建成功后立即调用。

### 下单

```csharp
RXGDT.ReportCheckout(
    "item",
    "新手礼包",
    "sku-1001",
    1,
    false,
    "",
    "CNY",
    true);
```

也可以使用 DTO：

```csharp
RXGDT.ReportCheckout(new RXGDTCheckoutEvent
{
    type = "item",
    name = "新手礼包",
    id = "sku-1001",
    number = 1,
    isVirtualCurrency = false,
    virtualCurrencyType = "",
    currency = "CNY",
    success = true
});
```

### 支付

```csharp
RXGDT.ReportPurchase(
    "item",
    "新手礼包",
    "sku-1001",
    1,
    "wechat",
    "CNY",
    600,
    true);
```

:::warning
`valueInCents` 的单位固定为“分”。例如人民币 6 元应传 `600`。
:::

也可以使用 `RXGDTPurchaseEvent`：

```csharp
RXGDT.ReportPurchase(new RXGDTPurchaseEvent
{
    goodsType = "item",
    goodsName = "新手礼包",
    goodsId = "sku-1001",
    number = 1,
    goodsChannel = "wechat",
    currency = "CNY",
    valueInCents = 600,
    success = true
});
```

### 完成关键事件

用于新手教学、任务或副本完成：

```csharp
RXGDT.ReportQuestFinish(
    "tutorial-1",
    "tutorial",
    "完成新手教学",
    1,
    "进入主界面",
    true);
```

复杂参数也可使用 `RXGDTQuestEvent`。

### 分享

```csharp
RXGDT.ReportShare("wechat", true);
```

### 角色升级

```csharp
RXGDT.ReportUpdateLevel(10);
```

### App 评分

```csharp
RXGDT.ReportRateApp(5.0f);
```

### 查看内容或商品

```csharp
RXGDT.ReportViewContent("item", "新手礼包", "sku-1001");
```

### 加入购物车

```csharp
RXGDT.ReportAddToCart("item", "新手礼包", "sku-1001", 1, true);
```

复杂参数也可使用 `RXGDTCartEvent`。

## 完整示例

```csharp
using RuiXue.GDT;
using UnityEngine;

public sealed class GDTExample : MonoBehaviour
{
    public void InitializeGDT()
    {
        RXGDT.RegisterSdk();
        RXGDT.Initialize(
            "action-set-id",
            "secret-key",
            "tencent",
            "tencent");
    }

    public void ReportEvents()
    {
        RXGDT.ReportRegister("guest", true);
        RXGDT.ReportLogin("guest", true);
        RXGDT.ReportCreateRole("role-id");
        RXGDT.ReportCheckout("item", "新手礼包", "sku-1001", 1, false, "", "CNY", true);
        RXGDT.ReportPurchase("item", "新手礼包", "sku-1001", 1, "wechat", "CNY", 600, true);
        RXGDT.ReportQuestFinish("tutorial-1", "tutorial", "新手教学", 1, "", true);
        RXGDT.ReportShare("wechat", true);
        RXGDT.ReportUpdateLevel(10);
        RXGDT.ReportRateApp(5.0f);
        RXGDT.ReportViewContent("item", "新手礼包", "sku-1001");
        RXGDT.ReportAddToCart("item", "新手礼包", "sku-1001", 1, true);
    }
}
```

完整 Demo 位于：

```text
Packages/com.ruixue.unitysdk.gdt/Samples~/Demo/RuiXueGDTDemo.cs
```

## 接入验证

### Android 验证

1. 确认导出工程已解析 `com.ruixue:rxsdk_gdt:4.0.16`。
2. 使用 release 混淆包进行真机验证。
3. 触发事件后检查控制台是否出现 `LogAction success`。
4. 在腾讯广告后台确认事件到达。

### iOS 验证

1. 确认使用 `.xcworkspace` 构建。
2. 确认 Pods 中包含 `RXGDTSDK 1.0.2` 和 `RXSDK_Pure 4.0.8`。
3. 使用真机验证冷启动、前后台切换和 URL Scheme 唤起。
4. 触发事件后检查控制台 `action name` 日志，并在腾讯广告后台确认事件。

## 常见问题

### iOS 没有自动上报激活、注册或登录

检查 `RXGDT.RegisterSdk()` 是否在 `RuiXueSdk.Initialize` 之前调用。

### Android 提示找不到 `GDTSdkWrapper`

检查导出工程是否包含：

```groovy
implementation 'com.ruixue:rxsdk_gdt:4.0.16'
```

### 出现重复注册或登录事件

检查是否同时启用了自动上报，并手动调用了 `ReportRegister` 或 `ReportLogin`。

### 支付金额不正确

`ReportPurchase` 的金额单位是“分”，不要传元。
