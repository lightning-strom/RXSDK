# rxsdk_overseas_huawei — 华为海外版（HMS OS）插件

## 功能简介

接入华为 HMS Core，提供华为账号登录（hwjos / huawei_fb）、HMS IAP 支付及 AppGallery 游戏服务能力（海外版）。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_overseas_huawei:${version}'
```

## 参数配置

### 初始化参数

HMS SDK 通过宿主工程中的 `agconnect-services.json` 文件自动读取配置，**无需在 ext 中传入额外字段**。

宿主工程须满足：

1. 在 `app/` 目录放置从 AppGallery Connect 下载的 `agconnect-services.json`
2. 根 `build.gradle` 添加 HMS 插件依赖：`classpath 'com.huawei.agconnect:agcp:x.x.x'`
3. `app/build.gradle` 应用插件：`apply plugin: 'com.huawei.agconnect'`

### AndroidManifest 自动声明

模块已配置以下 meta-data（自动合并）：

```xml
<meta-data android:name="com.huawei.hms.client.channel.androidMarket" android:value="false" />
<meta-data android:name="install_channel" android:value="AppGallery" />
```

### 权限说明

依赖 HMS Core AAR 自动合并权限，宿主无需额外声明。

## 接口调用

### 登录方式

| `method` 值 | 说明 |
| --- | --- |
| `"hwjos"` | HMS JOS 游戏账号登录 |
| `"huawei_fb"` | HMS Facebook Bridge 登录 |

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

如集成失败，优先检查参数配置、包名签名和渠道后台应用状态。

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
