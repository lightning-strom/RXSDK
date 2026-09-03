# RuiXue.GDT

腾讯广告 GDT Android/iOS 数据上报 UPM 包。

## 依赖

- `com.ruixue.unitysdk.base` `1.6.38`
- Android：宿主需包含 `com.ruixue:rxsdk_gdt`
- iOS：导出时自动合并 `RXGDTSDK 1.0.2`、`RXSDK_Pure 4.0.8`

## 初始化

iOS 必须先于瑞雪 SDK 初始化调用 `RegisterSdk`；Android 调用该方法为空操作。

```csharp
RXGDT.RegisterSdk();
RXGDT.Initialize("action-set-id", "secret-key", "tencent", "tencent");
```

iOS 原生接口只使用 `actionSetId` 与 `secretKey`，`channel`、`channelId` 仅传给
Android。iOS 插件会自动上报应用进入前台的 `START_APP`，并处理 URL Scheme 唤起。

## 事件上报

```csharp
RXGDT.ReportRegister("guest", true);
RXGDT.ReportLogin("guest", true);
RXGDT.ReportCreateRole("role-id");
RXGDT.ReportCheckout("item", "礼包", "sku-1", 1, false, "", "CNY", true);
RXGDT.ReportPurchase("item", "礼包", "sku-1", 1, "wechat", "CNY", 600, true);
RXGDT.ReportQuestFinish("tutorial-1", "tutorial", "新手教学", 1, "", true);
RXGDT.ReportShare("wechat", true);
RXGDT.ReportUpdateLevel(10);
RXGDT.ReportRateApp(5.0f);
RXGDT.ReportViewContent("item", "礼包", "sku-1");
RXGDT.ReportAddToCart("item", "礼包", "sku-1", 1, true);
```

`ReportPurchase` 的金额参数单位固定为“分”。复杂事件也可使用
`RXGDTCheckoutEvent`、`RXGDTPurchaseEvent`、`RXGDTQuestEvent` 和
`RXGDTCartEvent` DTO。

完整示例见 `Samples~/Demo/RuiXueGDTDemo.cs`。
