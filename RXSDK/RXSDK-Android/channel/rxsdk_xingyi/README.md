# rxsdk_xingyi — 星驿支付插件

## 功能简介

以支付插件方式接入星驿支付，可随国内渠道宿主一起集成，实现多支付方式并存。统一使用 `hq_type=xy`，通过 `ext.is_h5` 区分 App / H5：

| 场景 | `hq_type` | `ext` |
| --- | --- | --- |
| App 原生支付（DyPay） | `xy` | 不传 `is_h5` 或 `is_h5=0` | `channel/rxsdk_xingyi` |
| H5 支付（WebView/浏览器） | `xy` | `is_h5=1` | `rxsdk_h5pay` |

Android App 端走服务端下单返回的抖音支付参数拉起原生支付；H5 端解析 `ext.url` / `url` / `ext.h5` / `h5` 打开收银页。支付成功或结果未知时，最终到账与发货仍以后端通知和查单为准。

> 兼容：旧版 `hq_type=xyh5` 会自动归一化为 `xy` + `ext.is_h5=1`。

## 后台配置项

企业管理后台支付方式 type 统一为 `xy`。

配置字段：

| 字段 | 说明 |
| --- | --- |
| `tp_business_id` | 机构编号 |
| `tp_merchant_id` | 商户编号 |
| `tp_public_key` | 公钥 |
| `tp_partner_id` | 抖音商户号（partnerid） |
| `tp_appid` | appid |

## 支付参数

App 支付：

```java
Map<String, Object> pay = new HashMap<>();
pay.put("hq_type", "xy");
RuiXueSdk.getApi().pay(activity, pay, callback);
```

H5 支付：

```java
Map<String, Object> ext = new HashMap<>();
ext.put("is_h5", 1);
Map<String, Object> pay = new HashMap<>();
pay.put("hq_type", "xy");
pay.put("ext", ext);
RuiXueSdk.getApi().pay(activity, pay, callback);
```

App 支付：服务端下单返回后，客户端**不做字段转换**，按以下优先级原样透传给 DyPay：

1. `ext.appPayData`（存在时）
2. `ext`
3. 下单 `data` 顶层

服务端须在 `appPayData` 中直接下发 DyPay 所需字段（`appid` / `partnerid` / `prepayid` / `package` / `noncestr` / `timestamp` / `sign`）。

H5 支付：服务端返回 `ext.url` / `url` / `ext.h5` / `h5`；可选 `openBrowser=true` 拉起系统浏览器。

## SDK 回调约定

`dy-pay-sdk-tob` 回调 `resultCode` 映射：

- `0`：回调成功，客户端返回成功并提示以后端查单为准
- `1`：用户取消，返回 `PAY_CANCEL`
- `3`：结果未知，客户端返回成功并提示以后端查单为准
- 其它：返回 `THIRD_PAY_ERROR`

H5 WebView 识别 `ruixue://pay/success|failure|cancel` 回跳（由 `:rxsdk_h5pay` 实现）。

## 构建要求

- 依赖 `:rxsdk_base`
- 依赖 `com.bytedance.caijing:dy-pay-sdk-tob:1.1.0.7`
- 宿主渠道需把 `RX_PLUGIN_PAY_XINGYI` 加入 `getSupportPluginNames()`，或手动注册 `com.ruixue.sdk.XingYiSdkWrapper`
- H5 支付（`ext.is_h5=1`）由 `:rxsdk_h5pay` + `RX_PLUGIN_HQ` 处理，需同时集成
