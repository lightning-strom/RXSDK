# 星驿支付（Unity）

## 版本要求

- RuiXue Unity SDK：`4.0.0` 或更高
- RuiXue Android SDK：`4.0.14` 或更高
- 支持平台：Android

在 `Packages/manifest.json` 中安装 `com.ruixue.unitysdk.xingyi`，并确保所有
`com.ruixue.unitysdk.*` 包使用相同版本。

## App 支付

```csharp
var order = new Dictionary<string, object>
{
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
};
RXXingYiPay.PayApp(order, OnPaySuccess, OnPayError);
```

## H5 支付

```csharp
var order = new Dictionary<string, object>
{
    ["goods_tag"] = "YOUR_GOODS_TAG",
    ["trade_no"] = "YOUR_TRADE_NO"
};
RXXingYiPay.PayH5(order, OnPaySuccess, OnPayError);
```

本包在导出 Android 工程时自动加入 `rxsdk_xingyi`、`rxsdk_h5pay` 和
Volcengine Maven 仓库。已有高于 `4.0.14` 的瑞雪 Android 依赖不会降级。

> iOS 不支持星驿支付，调用会通过错误回调返回平台不支持。
