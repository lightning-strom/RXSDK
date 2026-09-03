# rxsdk_rustore — RuStore 支付插件

## 功能简介

接入 RuStore Pay SDK **10.5.0**（BOM `2026.06.01`），为俄罗斯市场提供应用内购买能力，支持服务端回调（默认）与客户端回调两种模式。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_rustore:${version}'
```

## 参数配置

### 初始化参数

RuStore SDK 通过宿主 `AndroidManifest.xml` 的 `<meta-data>` 读取配置，**无需在 ext 中传入额外字段**。

宿主 manifest 必须声明以下两项，否则 SDK 在 init / purchase 时抛出 `RuStorePayInvalidConsoleAppId` / `ApplicationSchemeWasNotProvided`：

```xml
<meta-data
    android:name="console_app_id_value"
    android:value="${RUSTORE_CONSOLE_APP_ID}" />

<meta-data
    android:name="sdk_pay_scheme_value"
    android:value="${RUSTORE_APP_SCHEME}" />
```

在 `app/build.gradle` 的 `manifestPlaceholders` 中配置：

```groovy
manifestPlaceholders = [
    RUSTORE_CONSOLE_APP_ID : "你的 RuStore 应用 ID",
    RUSTORE_APP_SCHEME     : "你的 Deeplink Scheme，如 rustore_yourapp"
]
```

> scheme 仅允许 ASCII，格式须符合 RFC-3986；须与 RuStore Console「Deep link」后台配置完全一致。

### 宿主 Activity 配置（Deeplink，Pay SDK 10.5.0 必填）

支付承载 Activity 需声明 `launchMode="singleTop"`、`exported="true"`（若对外暴露 deeplink）并添加 VIEW intent-filter：

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTop"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="${RUSTORE_APP_SCHEME}" />
    </intent-filter>
</activity>
```

Activity 生命周期须严格按 [RuStore 10.5.0 Deeplink 文档](https://www.rustore.ru/help/en/sdk/pay/kotlin-java/10-5-0#deeplinks) 处理：

```java
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // 推荐：由瑞雪 SDK 自动分发给 RuStore 插件
    RuiXueSdk.onCreate(this, savedInstanceState);
}

@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    RuiXueSdk.onNewIntent(this, intent);
}
```

或直接调用：

```java
RuStoreSdkWrapper.getInstance().onCreate(this, savedInstanceState); // 内部 savedInstanceState==null 时才 proceedIntent
RuStoreSdkWrapper.getInstance().onNewIntent(this, intent);
```

### 权限说明

- `INTERNET`

## 接口调用

### 商品信息查询

`RuStoreSdkWrapper.getProductsInfo(productIds, callback)`：

- 入参：`productIds`（`List<String>`，必填，商品 ID 列表）
- 成功回调：`data.products`（数组，字段按 RuStore SDK 返回对象展开）
- 失败回调：返回 `THIRD_PAY_ERROR` 或参数错误

### 支付参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `hq_type` | String | 自动注入 | 固定值 `"rustore"`，SDK 内部自动补填 |
| `order_no` | String | **必填** | 业务订单号，作为 `developerPayload` |
| `product_id` | String | **必填** | RuStore 商品 ID |
| `callback_from` | int | 可选 | 回调模式：`0` 服务端回调（默认），`1` 客户端回调 |

### 回调模式说明

- **服务端回调（默认，`callback_from=0`）**：支付成功后由 RuStore Webhook 通知游戏服务端对账发货，客户端仅返回支付成功事件，不携带 `purchaseId` 等敏感字段。
- **客户端回调（`callback_from=1`）**：支付成功后客户端直接回调并携带完整支付结果，由业务层自行验证。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `sdk_pay_scheme_value` 与 Console Deep link、Activity intent-filter 三者一致。
- 银行 App（SBP/SberPay）支付后须能回跳并还原支付页（验证 `onCreate`/`onNewIntent` + `singleTop`）。

## 常见问题

- **`ApplicationSchemeWasNotProvided`**：检查 `sdk_pay_scheme_value` 与 intent-filter scheme。
- **银行 App 支付后无法回到游戏**：确认 Activity `launchMode="singleTop"` 且已实现 deeplink 生命周期。

## 版本与构建要求

- RuStore Pay / Core **10.x（BOM 2026.06.01 / pay 10.5.0）为 Java 17 字节码**；请使用 **JDK 17+ 运行 Gradle**。
- 仓库内仅本模块 `compileOptions` 为 **Java 17**；其余 SDK 模块仍为 **Java 11**。
