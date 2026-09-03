# RuiXue.XingYi

星驿 App/H5 支付 Unity 接入包，仅支持 Android。

## 版本要求

- RuiXue Unity SDK：`4.0.0` 或更高
- RuiXue Android SDK：`4.0.14` 或更高

本包会在导出 Android Gradle 工程时注入：

```gradle
implementation 'com.ruixue:rxsdk_xingyi:4.0.14'
implementation 'com.ruixue:rxsdk_h5pay:4.0.14'
```

已有更高版本的 `com.ruixue:*` 依赖不会被降级。

仅星驿构建需要启用注入：导入并启用 `RuiXueXingYiDemo` 场景，或通过
`瑞雪SDK/Android Settings/XingYi` 创建配置并勾选 `enabled`。其他渠道构建不会
注入星驿依赖。

## 调用

安装本包并完成 `RuiXueSdk.Initialize` 后，使用：

- `RXXingYiPay.PayApp(...)`：星驿 App 支付。
- `RXXingYiPay.PayH5(...)`：星驿 H5 支付，自动传入 `ext.is_h5=1`。

支付成功或结果未知时，最终到账与发货以后端通知和查单为准。

> iOS 不支持星驿支付，调用会通过错误回调返回平台不支持。
