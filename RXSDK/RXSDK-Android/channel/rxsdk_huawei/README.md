# channel/rxsdk_huawei — 华为（HMS）渠道接入

## 功能简介

接入华为 HMS（HwID 账号、IAP 支付、游戏服务、Analytics），提供华为账号登录、IAP 内购、防沉迷、游戏更新提示等能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_huawei:${version}'
```

## 参数配置

### 初始化参数

参数支持两种来源（按优先级）：

1. `initThirdSdk` 的 `hashMap`（由后台下发的 `init_configs` 注入）
2. 宿主 `AndroidManifest.xml` 与 `agconnect-services.json` 兜底

| 字段 | hashMap key | meta-data / 配置 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| HMS AppID | — | `agconnect-services.json` | **必填** | HMS 自动读取，无需 hashMap 透传 |
| 强制更新 | `force_update` | — | 可选 | 是否使用强制更新弹窗 |

### AndroidManifest 配置

模块自带 HMS 必备组件；宿主仅需保证：

- `applicationId` 与 `agconnect-services.json` 中 `package_name` 一致
- 已配置正式签名指纹

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 完成，主要工作：

- 读取 `force_update` 控制升级提示
- 调用 `JosApps.getJosAppsClient(activity).init(AppParams)` 完成 HMS Core 初始化与防沉迷回调注册
- 处理华为联运隐私窗（拒绝时返回 7401 错误码）

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。
- 游戏浮标测试需区分系统版本与设备类型，见下方常见问题。

## 常见问题

### 游戏浮标展示条件

华为游戏浮标的展示规则与设备系统版本有关，参考 [HMS GameKit 游戏浮标 Codelab](https://developer.huawei.com/consumer/cn/codelab/HMSGameKit-floatingWindow/#7)：

- **EMUI 9.1 以下的华为设备或三方 Android 设备**：需要接入并调用游戏浮标接口；设备必须安装 **9.0 以上版本华为应用市场客户端**，否则无法展示浮标。
- **EMUI 9.1 及以上华为设备、鸿蒙系统设备**：浮标不受 `showFloatWindow()` / `hideFloatWindow()` 接口控制，由华为系统自动控制；需要用户通过 **设置 > 应用 > 应用助手 > 游戏空间** 将应用加入游戏空间，才可以显示游戏浮标。
- `showFloatWindow()` 必须在 HMS 游戏初始化成功后调用；游戏界面 `onResume()` 可调用显示浮标，`onPause()` 可调用隐藏浮标。

### 其他说明

- 防沉迷退出回调中实现保存进度、退出账号
- 华为联运隐私窗未同意会持续返回 7401，应阻止用户进入游戏

## 版本与构建要求

### 混淆配置

HMS aar 自带 consumer 混淆规则；宿主无需追加额外 keep。如开启 R8 fullMode，请按 HMS 官方文档保留 `com.huawei.hms.**`、`com.huawei.agconnect.**`。

### 三方 SDK 版本与依赖

| 依赖 | 版本来源 | 用途 |
| --- | --- | --- |
| `libs.hms.hwid` | version catalog | HMS 账号服务 |
| `libs.hms.iap` | version catalog | HMS 内购 |
| `libs.hms.game` | version catalog | HMS 游戏服务（防沉迷、悬浮按钮） |
| `libs.hms.analytics` | version catalog | HMS 数据分析 |
| `:rxsdk_base`（project） | — | 瑞雪 SDK 基础库 |
| `:rxsdk_weixin`（compileOnly） | — | 微信通道符号兼容 |

> 具体版本号在根 `libs.versions.toml` / `gradle/libs.versions.toml` 中维护。
