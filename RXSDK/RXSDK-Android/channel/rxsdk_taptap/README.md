# channel/rxsdk_taptap — TapTap 渠道接入

## 功能简介

接入 TapTap SDK v4（`tap-core` + `tap-login` + `tap-compliance`），提供 TapTap 账号登录、合规认证（实名/防沉迷），并复用 `rxsdk_h5pay` 完成 H5 支付。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_taptap:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：

1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 的 `<meta-data>` 兜底

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| Client ID | `client_id` | `tap_client_id` | **必填** | TapTap 开发者中心 Client ID |
| Client Token | `client_token` | `tap_client_token` | **必填** | TapTap 开发者中心 Client Token（v4 初始化必填） |
| 区域 | `region` | — | 可选 | `cn`（默认）/ `global`（海外） |
| 合规切换账号 | `compliance_show_switch_account` | — | 可选 | 防沉迷 UI 是否显示切换账号，默认 `false` |
| 合规年龄段 | `compliance_use_age_range` | — | 可选 | 是否获取真实年龄段，默认 `false`（静默授权） |

> Server Secret 仅服务端持有，客户端禁止下发。

### AndroidManifest 配置

如选择 meta-data 注入参数：

```xml
<meta-data android:name="tap_client_id" android:value="YOUR_CLIENT_ID" />
<meta-data android:name="tap_client_token" android:value="YOUR_CLIENT_TOKEN" />
```

需在 TapTap 开发者中心配置包名与签名证书；签名不一致会报 `signature not match`。

## 接口调用

### 初始化

由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
TapTapSdkOptions options = new TapTapSdkOptions(clientId, clientToken, TapTapRegion.CN);
options.setEnableLog(BuildConfig.DEBUG);
TapTapComplianceOptions complianceOptions = new TapTapComplianceOptions(showSwitchAccount, useAgeRange);
TapTapSdk.init(context, options, complianceOptions);
TapTapCompliance.registerComplianceCallback(callback);
```

完成 TapSDK 初始化后会回调基类 `super.initThirdSdk`，串联 `:rxsdk_h5pay` 初始化。

### 登录与合规认证

```text
TapTapLogin.loginWithScopes(...)
  → TapTapCompliance.startup(activity, openId)
  → 合规回调 code=500（LOGIN_SUCCESS）
  → 回传 ext 并继续瑞雪登录
```

登出时调用 `TapTapCompliance.exit()` + `TapTapLogin.logout()`。

登录成功 ext 回传：`access_token`（AccessToken.kid）、`mac_key`、`scopes`、`open_id`、`union_id`、`nickname`、`avatar`、`age_range`。

瑞雪登录成功回调中的 `aas`（剩余可玩时长，秒）由 `TapTapCompliance.getRemainingTime()` 覆盖服务端返回值。

### 充值额度限制

支付前检查与充值上报**不由客户端支付回调自动触发上报**（H5 收银台回调不可靠）。CP 应在服务端确认到账后主动上报。

**支付前检查限额**（`pay()` 内置，或通过 `indulge_auth` 控制；也可单独调用）：

```java
// 方式一：走 pay()，默认 indulge_auth=1 时自动 checkPaymentLimit
Map<String, Object> pay = new HashMap<>();
pay.put("goods_tag", "your_goods_tag");
RuiXueSdk.getApi().pay(activity, pay, callback);

// 方式二：自定义支付流程时，支付前单独检查（amount 单位：分）
RuiXueSdk.getApi().checkChannelPaymentLimit(activity, 600, new RXJSONCallback() {
    @Override
    public void onSuccess(@Nullable JSONObject data) {
        // data: {"allowed": true/false, "amount": 600}
        // allowed=false 时 TapTap SDK 会弹窗提示，无需 CP 额外 UI
    }
    // onFailed / onError ...
});
```

**服务端到账后手动上报**（`amount` 单位：**分**）。

`pay()` 下单成功后会自动缓存下单参数（`goods_tag`、`trade_no`、`order_no`、`bigdata_report` 等）；`submitChannelPayment` 会读取缓存并上报瑞雪大数据 `#rxsdk_payresult`，CP **无需重复传订单字段**：

```java
// 1. 先走 pay 下单/支付（缓存自动写入）
RuiXueSdk.getApi().pay(activity, payParams, payCallback);

// 2. 服务端到账确认后，仅传金额（自动合并最近一笔下单缓存）
RuiXueSdk.getApi().submitChannelPayment(600, callback);

// 可选：补充/覆盖少量字段
Map<String, Object> override = new HashMap<>();
override.put("trade_no", cpOrderId);
RuiXueSdk.getApi().submitChannelPayment(600, override, callback);
```

下单缓存由 SDK 内部维护，CP 无需读取；须先 `pay()` 再 `submitChannelPayment`。

非 TapTap 渠道调用上述接口将返回 `THIRD_PAY_ERROR`（不支持）。

## 测试与验收

- TapTap 开发者中心包名、签名 MD5 与当前 APK 一致；**已开通防沉迷/合规认证服务**。
- `client_id` + `client_token` 非空且与后台一致。
- 主线程完成 `TapTapSdk.init` 后再发起登录。
- TapTap 授权成功后须等合规 `500` 回调再继续瑞雪登录。
- 登录、支付调用前已完成瑞雪 SDK 初始化。

## 常见问题

- `signature not match`：检查 TapTap 后台签名证书配置。
- `INIT_PARAMS_ERROR`：v4 起 `client_token` 为必填，不能只配 `client_id`。
- 海外区服：`region=global`。

## 版本与构建要求

### 混淆配置

TapSDK v4 AAR 已内置 consumer 混淆规则；宿主 R8 严格模式可追加：

```proguard
-keep class com.taptap.sdk.** { *; }
```

不要对 TapSDK 开启资源混淆（`shrinkResources false`）。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.taptap.sdk:tap-core` | `4.10.4` | TapSDK 统一初始化 |
| `com.taptap.sdk:tap-login` | `4.10.4` | TapTap 登录 |
| `com.taptap.sdk:tap-compliance` | `4.10.4` | 实名认证 / 防沉迷 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_h5pay`（project） | — | H5 收银台 |

参考：[TapTap Android 原生集成 v4](https://developer.taptap.cn/docs/sdk/integration-guides/android/)、[合规认证开发指南](https://developer.taptap.cn/docs/sdk/anti-addiction/guide/)
