# rxsdk_apkpure — ApkPure (VGamePop ASDK) 插件

## 功能简介

接入 VGamePop ASDK，提供 ApkPure 渠道的登录与支付能力。

### 运营类能力（游戏圈 / VIP 客服 / 用户召回 / 网页活动）

本仓库 **`rxsdk_apkpure`** 当前仅封装 ASDK **初始化、登录、支付、商品查询**（见下方「接入配置清单」「商品查询」）。
依赖 **`com.vgamepop:asdk:1.0.16.4`** 经 R8 混淆后，`ASDKManager` **对外可读静态入口**主要为：`init`、`login`、`purchaseProduct`、`getProducts`、`setUserid`、`getUserid`、生命周期回调等（可用 `javap` 自检），**未出现**可与上述四类运营功能一一对应的稳定公开方法名。

AAR 内可见 **`com.vgamepop.android.asdk.core.rainbow`**、`PayWebViewActivity` / `WebChannel` 等实现，推断部分能力可能是 **服务端配置 + WebView/H5** 或由 **Rainbow 等内部模块** 拉起，**具体方法名与调用顺序必须以 VGamePop/Apkpure 提供的《ASDK Android 接入文档》或新版 AAR 说明为准**。
可向渠道索要附录：**游戏圈、客服（含 VIP）、用户召回、活动页/Web 入口** 的章节；若新版本 ASDK 增加独立 API（例如 `openXxx`/`showXxx`），再评估是否迁入 `rxsdk_apkpure` 做一层封装。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_apkpure:${version}'
```

## 参数配置

### 接入配置清单

按顺序自检即可；**渠道控制台 + 瑞雪 ext** 与 **当前 APK 包名/签名** 必须一致。

### 1. Gradle 与依赖

| 项 | 说明 |
| --- | --- |
| 模块依赖 | 宿主 `implementation project(':overseas:rxsdk_apkpure')`（或你们仓库中等价坐标） |
| ASDK 版本 | 由 `rxsdk_apkpure/build.gradle` 指定，当前为 **`com.vgamepop:asdk:1.0.16.4`**；升级 ASDK 时需与渠道确认兼容性 |

### 3. 瑞雪初始化与 ext（最关键）

| 项 | 说明 |
| --- | --- |
| `apkpure_appid` | **必填**。通过瑞雪 `RuiXueSdk.initialize` 传入的 **thirdSdkParams / ext**（或与 Demo 一致：`RXSdkInitConfig` + `setThirdSdkParams(GlobalConfig.getExt())`）中必须包含字符串 **`apkpure_appid`**，值为 VGamePop 控制台该应用的 App ID。 |
| `rxconfig.json`（Demo / 常见做法） | 以当前 **`applicationId`** 为 key 的配置节下，`ext.apkpure_appid` 与控制台一致；否则 `GlobalConfig.getExt()` 取不到，ASDK 会报 **`app info empty`** / 未初始化。 |
| 调用顺序 | **`ApkpureSdkWrapper.init(Context, paramsMap, callback)`** 须在登录、支付、**`getProducts`** 之前执行，且 `paramsMap` 含 `apkpure_appid`。瑞雪统一 init 时会把整份 ext 下发给各插件 `init`，一般无需重复 init；若业务侧直接调 `getProducts` 而未先走瑞雪 init，需自行先 `init`。 |
| 初始化兜底 | 新版 `ApkpureSdkWrapper` 在 `doLogin/doPay/getProducts` 前会做一次 `ensureAsdkReady` 自动补 init（使用缓存 `apkpure_appid`）；若仍失败，通常是控制台应用配置链路问题（appid/包名/SHA1/应用状态）。 |

**初始化参数表：**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apkpure_appid` | String | **必填** | VGamePop/ApkPure 平台分配的 App ID |

> 缺少 `apkpure_appid` 时插件 `init` 会失败并回调 **`INIT_PARAMS_ERROR`**。

### 4. VGamePop / Apkpure 开发者控制台

| 项 | 说明 |
| --- | --- |
| 包名 | 与当前 APK 的 **`applicationId`** 完全一致 |
| 签名 | **Debug、Release** 证书 SHA1（或控制台要求的指纹）分别登记；与本地打包 keystore 一致，否则 `hasInit()` 为 false 或报签名错误 |
| App ID | 与 `ext.apkpure_appid` 为**同一应用** |
| 商品 SKU | 与瑞雪下单返回的 **`ext.third_tag` / `ext.product_id`**（与 ASDK `Product#getId()`）一致 |

### 5. 支付与订单（瑞雪侧）

| 项 | 说明 |
| --- | --- |
| `hq_type` | 使用 **`apkpure`**，走 `ApkpureBillingImpl` |
| 订单 `ext` | 商品 ID 使用 **`third_tag`**（推荐）或 **`product_id`**（同义）；客户端 `ApkpureOrderData.ExtBean` 已映射到 `getProductId()` |

### 5.1 沙盒支付测试账号

仅用于 ASDK/VGamePop 沙盒/测试支付页。测试前需满足：

1. 初始化 ASDK 时设置 `SDKInitConfig.setDebug(true)` / `isDebug=true`。
2. 在 ASDK 后台把测试设备的 `android_id`、`gaid` 或 `oaid` 加入测试白名单。设备 ID 可通过 debug 初始化日志 `ASDK init succeed, your android_id=` 获取。

| 字段 | 值 |
| --- | --- |
| 卡组织 | Master |
| 卡号 | `5555555555554444` |
| 姓名 | `Allen Black` |
| 有效期 | `11/26` |
| CVV | `357` |

> 如果支付页要求 4 位年份，填 `2026`；如果要求 2 位年份，填 `26`。正式包必须关闭 debug，并禁止使用该测试卡信息。

### 6. Release / R8（游戏主工程）

本库 `consumer-rules.pro` 已保留 **`com.vgamepop.**`**。若你方 R8 规则过强，可参考本模块 **`proguard-rules.pro`**：为 Gson 反序列化保留 **`ApkpureOrderData` / `ApkpureOrderData$ExtBean`**（避免订单 ext 解析失败）。

### 7. 权限

| 权限 | 说明 |
| --- | --- |
| `INTERNET` | 本模块 Manifest 已声明；宿主勿移除合并后的网络权限 |

## 接口调用

### 商品查询 `getProducts`

调用入口：`ApkpureSdkWrapper.getInstance()`。须先完成 ASDK 初始化（`apkpure_appid` 已配置）。

| API | 说明 |
| --- | --- |
| `getProducts(ValueGetListener<List<Product>> listener)` | 拉取当前应用**全量**可购商品 |
| `getProducts(List<String> productIds, ValueGetListener<List<Product>> listener)` | 仅拉取**指定** `product_id` 列表 |

### 回调 `ValueGetListener`（`com.vgamepop.android.asdk.base`）

| 方法 | 说明 |
| --- | --- |
| `onSucceed(List<Product> value)` | 成功；列表可能为空 |
| `onFailed(Throwable throwable)` | 失败；未初始化、网络等 |

### 实体 `Product`（`com.vgamepop.android.asdk.core.net.entity`，以 ASDK 版本为准）

| 方法 / 含义 | 说明 |
| --- | --- |
| `getId()` | 商品/Sku **ID**，与瑞雪支付订单 ext 中 `third_tag` / `product_id` 一致，供 `ASDKManager.purchaseProduct` 使用 |
| `getName()` | 商品展示名称 |
| `getPrice()` | 价格（字符串形式，具体格式以 ASDK 为准） |
| `getUnit()` | 货币单位/符号，与 `getPrice` 一起用于 UI |

### 调用示例

```java
// 全量
ApkpureSdkWrapper.getInstance().getProducts(new ValueGetListener<List<Product>>() {
    @Override
    public void onSucceed(List<Product> value) { /* 遍历 value */ }
    @Override
    public void onFailed(Throwable throwable) { }
});

// 按 ID
ApkpureSdkWrapper.getInstance().getProducts(
        java.util.Arrays.asList("com.example.sku1", "com.example.sku2"),
        new ValueGetListener<List<Product>>() { /* 同上 */ });
```

Demo 参考：`demo/app_demo_overseas` 中 `OverseasHelper.getVGamePopProducts(Activity)`（内含 init → getProducts 顺序）。

网络权限见上文 **§7 权限**。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 排错：`Incorrect signature` / `ASDK not initialized`

VGamePop ASDK 会校验 **applicationId（包名）** 与 **APK 签名证书（如 SHA1）** 是否与控制台为该 `apkpure_appid` 登记的信息一致。常见现象：

- 服务端或客户端报 `Incorrect signature`、`ASDK not initialized`
- `reason: app info empty`：多为 **未先调用** `ASDKManager.init`（缺 `apkpure_appid`）或 init 后服务端未下发应用配置（包名/签名与控制台不一致、App ID 错误）
- `ASDKManager.INSTANCE.hasInit()` 在 `ASDKManager.init` 之后仍为 `false`

处理步骤：

1. 在 VGamePop / Apkpure 开发者控制台核对：**包名** = 当前 App 的 `applicationId`，**签名** = 你实际用来打包的 keystore（Debug 与 Release 证书不同，需分别登记或只用已登记证书打包）。
2. 确认 `rxconfig`（或初始化 ext）里的 **`apkpure_appid`** 对应的是上述包名+签名所在的应用，而不是其它环境占位 ID。
3. 插件侧已用 `hasInit()` 与瑞雪 `init` 结果对齐；若 init 失败请先看 Logcat 中 `ApkpureSdk` / `ASDK_` 前缀日志。

### 排错：`Order '…' create failed`

瑞雪下单已成功，但 **VGamePop 侧为同一笔业务单创建渠道订单失败**（`thirdmsg` 常见为 `Order '<orderNo>' create failed.`）。多与 **商品/环境/重复单** 有关，而非 RX 插件 Java 异常栈。

建议逐项核对：

1. **订单 ext 里的 `third_tag`（或 `product_id`，同义）**（与 ASDK 控制台 SKU 一致；未上架或拼写错误会导致创建失败）。
2. **是否重复拉起支付**：同一 `orderNo` / 同一笔瑞雪订单被多次调 `purchaseProduct`。
3. **用户态**：已按渠道要求完成 **ASDK 登录**（或瑞雪登录后已向 ASDK `setUserid`），与正式包一致。
4. **环境与回调**：正式 `apkpure_appid`、服务端 notify、渠道后台环境与当前包一致。
5. 仍失败时把 **完整 `orderNo` + 瑞雪订单 ext + 发生时间** 交给 VGamePop / 瑞雪后端查渠道侧日志。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
