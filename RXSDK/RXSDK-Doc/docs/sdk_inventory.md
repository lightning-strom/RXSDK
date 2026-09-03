# 渠道 SDK 与工具 SDK 清单（Android / iOS）

> 瑞雪 **Android** 与 **iOS** 双端的**渠道 SDK**（按上架商店必选其一）与**工具 SDK**（按需选配）清单。  
> **更新日期**：2026-02-04

---

## 一、概念与适用规则

### 1.1 渠道 SDK 与工具 SDK

| 类型 | 说明 | 使用方式 |
|------|------|----------|
| **渠道 SDK** | 与具体应用商店/联运渠道绑定，负责该渠道的登录、支付、合规等 | **Android**：根据上架商店选择对应 Maven 渠道包（必选其一），与 `rxsdk_base`、`rxsdk_base_ui` 一起使用。<br>**iOS**：无独立渠道包，通过初始化参数 **channelId** 区分渠道，核心为 `RXSDK_Pure` + 国内/海外 UI。 |
| **工具 SDK** | 第三方登录、支付方式、推送、归因、地图、反馈 UI 等独立功能 | **按需选配**：在选定渠道/核心基础上按业务需要添加。 |

### 1.2 海外 / 国内适用规则

| 场景 | 推送 / 统计 可用能力 | 说明 |
|------|----------------------|------|
| **海外** | 仅 **华为**（海外华为渠道 + 华为推送）与 **Firebase** | 海外推送、统计仅此二者可用（Android 与 iOS 一致）。 |
| **国内** | 各厂商推送（华为/小米/OPPO/vivo/荣耀/魅族等） | **Firebase 国内不可用**，仅海外可用。 |

### 1.3 渠道专属能力（非通用工具）

以下能力**仅在使用对应渠道时可用**，不可作为通用工具在其他渠道使用：

| 能力 | Android 模块 | 依赖渠道 | iOS |
|------|--------------|----------|-----|
| 华为回放 | `rxsdk_huawei_replay` | 仅 **华为渠道**（`rxsdk_huawei`） | 华为渠道时按需集成，见 iOS 接入文档 |
| 华为时刻 | `rxsdk_huawei_moment` | 仅 **华为渠道**（`rxsdk_huawei`） | 同上 |

---

## 二、渠道 SDK 清单

### 2.1 Android 国内渠道（Maven Artifact）

在 `app/build.gradle` 的 `dependencies` 中**根据上架商店选择其一**。

| 渠道名称 | Maven Artifact | 说明 |
|----------|----------------|------|
| 自运营 | `com.ruixue:rxsdk_weile` | 自运营 |
| 百度网讯 | `com.ruixue:rxsdk_baidu_wangxun` | 百度游戏中心 |
| YSDK 应用宝 | `com.ruixue:rxsdk_ysdk` | 应用宝上架 |
| vivo | `com.ruixue:rxsdk_vivo` | vivo 应用商店 |
| OPPO | `com.ruixue:rxsdk_oppo` | OPPO 应用商店 |
| 华为 | `com.ruixue:rxsdk_huawei` | 华为应用商店（含华为回放、华为时刻） |
| 小米 | `com.ruixue:rxsdk_xiaomi` | 小米应用商店 |
| 荣耀 | `com.ruixue:rxsdk_honor` | 荣耀渠道 |
| 抖音 | `com.ruixue:rxsdk_douyin_gb` | 抖音联运 |
| 快手 | `com.ruixue:rxsdk_kwaiallin` | 快手联运 |
| 快手买量 | `com.ruixue:rxsdk_kwai_buy` | 快手买量 |
| TapTap | `com.ruixue:rxsdk_taptap` | TapTap 上架 |
| 哔哩哔哩 | `com.ruixue:rxsdk_bilibili` | Bilibili 渠道 |
| 4399 | `com.ruixue:rxsdk_4399` | 4399 渠道 |
| 九游 | `com.ruixue:rxsdk_9game` | 九游上架 |
| 007 | `com.ruixue:rxsdk_007` | 007 上架 |
| Quick | `com.ruixue:rxsdk_quick` | Quick 上架 |
| 旭腾 | `com.ruixue:rxsdk_xuteng` | 旭腾渠道 |
| 雷电模拟器 | `com.ruixue:rxsdk_ld` | 雷电模拟器 |
| MuMu 模拟器 | `com.ruixue:rxsdk_yofun` | MuMu 模拟器 |

### 2.2 Android 海外渠道（Maven Artifact）

| 渠道名称 | Maven Artifact | 说明 |
|----------|----------------|------|
| Google Play | `com.ruixue:rxsdk_overseas` | 海外主包 |
| 华为海外 | `com.ruixue:rxsdk_overseas_huawei` | 海外华为（推送/统计海外仅华为+Firebase） |
| 海外 OPPO | `com.ruixue:rxsdk_overseas_oppo` | 海外 OPPO |
| Qoo | `com.ruixue:overseas:rxsdk_qoo` | Qoo 上架 |
| Infinix | `com.ruixue:rxsdk_infinix` | Infinix 海外 |

### 2.3 iOS 说明

**iOS 没有渠道概念**，仅需按需接入不同组件即可。

| 项目 | 说明 |
|------|------|
| 核心 SDK | `RXSDK_Pure`（CocoaPods 名以实际仓库为准，如 `RXSDK_Pure` / `RuiXueSDK`） |
| 国内 UI | `RXUIKit`（或 `RXUIKitCode`） |
| 海外 UI | `RXOSUIKit`（或 `RXOSUIKitCode`） |
| 第三方登录 | 按需引入对应组件，如 `RXWXSDK`（微信）、`RXGoogleSDK`（Google）、`RXFacebookSDK`（Facebook）等 |
| 特殊组件 | 007、Quick 等若需独立能力，有对应 Pod/工程：`RX007SDKCode`、`RXQuickSDKCode` 等，按需引入 |

**登录类型常量**（`LoginType` 枚举值，见 [public_class_methods.md](../ios/public_class_methods.md#rxloginconfig登录配置)）：

| 枚举值 | 说明 |
|--------|------|
| `LoginTypeVisitor` | 游客登录 |
| `LoginTypeAccount` | 账号密码登录 |
| `LoginTypeCapCode` | 验证码登录 |
| `LoginTypeApple` | 苹果登录 |
| `LoginTypeW` | 微信登录 |
| `LoginTypeGoogle` | Google 登录 |
| `LoginTypeFacebook` | Facebook 登录 |
| `LoginTypeLine` | Line 登录 |
| `LoginTypeAuth` | 一键登录 |
| `LoginTypeZalo` | Zalo 登录 |
| `LoginTypeTikTok` | TikTok 登录 |
| `LoginTypeSnapChat` | SnapChat 登录 |

### 2.4 源码与 Unity

- **Android 源码**：国内渠道在 `rxsdk-android/channel/`，海外在 `overseas/`。
- **iOS 源码**：各模块在 `rxsdk-ios/` 下以独立目录存在（如 `RXSDKCode`、`RXWXSDKCode`）。
- **Unity**：统一包 `com.ruixue.unitysdk`，渠道通过 `channelid` 及打包配置区分，无单独渠道包清单。

---

## 三、工具 SDK 清单

> 工具均**按需选配**。带「仅海外」的模块国内不可用；海外推送/统计仅华为与 Firebase 可用（见 1.2）。

### 3.1 登录 / 社交 / 分享

| 工具名称 | 适用范围 | Android 模块 | iOS Pod/模块 | 说明 |
|----------|----------|-------------|--------------|------|
| 微信 | 国内 | `rxsdk_weixin` / `rxsdk_weixin_withpay` | `RXWXSDK` | 登录、分享、小程序、支付（withpay） |
| QQ / 微博 | 国内 | （见 base 或 UI） | - | RXQQPlugin / RXWeiboPlugin |
| 支付宝 | 国内 | `rxsdk_alipay` | - | 支付宝支付（iOS 仅有内购） |
| 阿里/腾讯手机账号 | 国内 | `rxsdk_alimobile` / `rxsdk_txmobile` | - | 手机号登录 |
| 高德 | 国内 | `rxsdk_gaode` | `RXLBSKit` | 地图/定位 |
| Google | 仅海外 | `overseas:rxsdk_google` | `RXGoogleSDK` | 登录 |
| Facebook | 仅海外 | `overseas:rxsdk_facebook` | `RXFacebookSDK` | 登录/分享 |
| Line | 仅海外 | `overseas:rxsdk_line` | `RXLineSDK` | 登录 |
| TikTok | 仅海外 | `overseas:rxsdk_tiktok` | `RXTikTokSDK` | 登录/分享 |
| Zalo / Snapchat / Instagram / Reddit | 仅海外 | `overseas:rxsdk_*` | `RXZaloSDK` / `RXSnapChatSDK` / `RXInstagramSDK` / `RXRedditSDK` | 对应第三方登录/分享 |
| Game Center | - | - | `RXGameCenterCode` | Apple 游戏中心 |
| 苹果登录 | - | - | 核心 SDK 内 AppleLogin | 苹果 Sign in with Apple |

### 3.2 支付

| 工具名称 | Android 模块 | iOS Pod/模块 | 说明 |
|----------|-------------|--------------|------|
| UPay | `rxsdk_upay` | - | UPay |
| 易宝 | `rxsdk_yeepay` | - | 易宝支付 |
| H5 支付 | `rxsdk_h5pay` | - | H5 聚合支付 |
| 杉德支付 | `rxsdk_snfpay` | - | 杉德支付 |
| Catappult | `rxsdk_catappult` | - | Catappult 支付 |
| Unipin | - | `RXUnipinSDKCode` | Unipin 支付（海外） |
| 内购 IAP | 见核心 | `RXIAPService` / `RXStoreKitService`（核心内） | 苹果内购 |

### 3.3 推送

| 工具名称 | 适用范围 | Android 模块 | iOS Pod/模块 | 说明 |
|----------|----------|-------------|--------------|------|
| 推送基座 | 通用 | `push:rxsdk_push_base` | `RXPushSDK` | 推送基础能力 |
| 华为推送 | 国内 + 海外 | `push:rxsdk_push_huawei` | - | 海外推送仅华为与 Firebase 可用 |
| 小米/OPPO/vivo/荣耀/魅族 | 国内 | `push:rxsdk_push_*` | - | 各厂商推送（Android） |
| Firebase 推送 | 仅海外 | `overseas:rxsdk_firebase` | `RXFirebaseSDKCode`（含 RXFirebasePush） | FCM/APNs，国内不可用 |

### 3.4 归因 / 统计 / 埋点

| 工具名称 | 适用范围 | Android 模块 | iOS Pod/模块 | 说明 |
|----------|----------|-------------|--------------|------|
| Adjust | 仅海外 | `overseas:rxsdk_adjust` | `RXAdjustCode` | 归因、事件 |
| Firebase | 仅海外 | `overseas:rxsdk_firebase` | `RXFirebaseSDKCode`（RXFIRAnalyticsService 等） | 统计、属性，国内不可用 |
| 字节埋点 | 国内 | `rxsdk_bytedance_log` | `RXBDASignalSDKCode` | 字节系埋点 |
| 广点通 GDT | 国内 | `rxsdk_gdt` | `RXGDTSDKCode` | 广点通广告/行为 |
| TopOn | 国内 | `rxsdk_topon` | - | TopOn 聚合（Android） |
| Bugly | 国内 | `rxsdk_bugly` | - | 腾讯 Bugly 崩溃统计 |
| ASA | 国内 + 海外 | - | `RXASAKitCode` | Apple Search Ads 归因 |

### 3.5 其他工具

| 工具名称 | Android 模块 | iOS Pod/模块 | 说明 |
|----------|-------------|--------------|------|
| OAID | `rxsdk_oaid` / `rxsdk_oaidv2` | - | 设备 OAID（Android） |
| Openinstall | `rxsdk_openinstall` | `RXOpeninstallSDK` | 安装参数（国内） |
| Openinstall 海外 | `rxsdk_openinstall_os` | `RXOpeninstallOSSDKCode` | 海外版 |
| 反馈 UI | `rxsdk_feedback_ui` | `RXFeedbackSDKCode` | 意见反馈界面 |
| 性能监控 | `rxsdk_performance` | - | 性能数据（Android） |
| WebSocket | `rxsdk_websocket` | - | WebSocket（Android） |
| 安装信息 | `rxsdk_install_appinfo` | `RXAppListSDKCode` | 安装包/来源信息 |
| 通讯录 | `rxsdk_contacts` | `RXAddressBookCode` | 通讯录 |
| 设备信息 | `rxsdk_deviceinfo` | - | 设备信息（Android） |
| 腾讯 DNS | `ruixue_tencent_dns` | `RXTecentDNSSDKCode` / `RXTecentCloudDNSSDK` | HTTPDNS |
| 阿里 DNS | `ruixue_aliyun_dns` | `RXAliDNSSDKCode` | HTTPDNS |
| 语言/多语言 | - | `RXLanguageKitCode` | 多语言 |
| 工具库/WebView | - | `RXToolKitCode`（RXPublicWebView 等） | 通用 WebView/工具 |

### 3.6 Unity 工具（统一包内）

Unity 统一包 `com.ruixue.unitysdk` 内：

- **ThirdParty**：微信、Google、Facebook、Line、TikTok、抖音、Instagram、Reddit、Snapchat、Zalo、Qoo、Quick、Unipin 等。
- **WebGL**：微信小游戏、抖音小游戏。

---

## 四、核心基础模块（必选）

各端接入时均需依赖，非“渠道二选一”、非“可选工具”：

| 模块 | Android | iOS | 说明 |
|------|---------|-----|------|
| 核心基础 | `rxsdk_base` | `RXSDK_Pure`（或仓库内实际 Pod 名） | 初始化、登录、支付、分享、社交等核心 API |
| 基础 UI（国内） | `rxsdk_base_ui` | `RXUIKit` / `RXUIKitCode` | 登录界面、用户中心、客服、实名、分享 UI、WebView 等 |
| 基础 UI（海外） | - | `RXOSUIKit` / `RXOSUIKitCode` | 海外版登录/用户中心等 UI |

Unity 对应统一包内 `Runtime/Core`、`Runtime/Login`、`Runtime/UI` 等。

---

## 五、依赖速查

### 5.1 Android（build.gradle）

**渠道（必选其一）：**

```groovy
implementation 'com.ruixue:rxsdk_weile:版本号'           // 自运营
// implementation 'com.ruixue:rxsdk_huawei:版本号'      // 华为
// implementation 'com.ruixue:rxsdk_overseas:版本号'    // Google Play / 海外
// 其他见 2.1、2.2 表格
```

**基础（必选）：**

```groovy
implementation 'com.ruixue:rxsdk_base:版本号'
implementation 'com.ruixue:rxsdk_base_ui:版本号'
```

**工具（按需）：**

```groovy
// implementation 'com.ruixue:rxsdk_weixin:版本号'
// implementation 'com.ruixue:rxsdk_push_huawei:版本号'
// implementation 'com.ruixue:rxsdk_feedback_ui:版本号'
// 海外：rxsdk_firebase、rxsdk_adjust 等（仅海外可用）
```

### 5.2 iOS（Podfile）

**核心与 UI（必选）：**

```ruby
pod 'RXSDK_Pure', '~> x.x.x'
pod 'RXUIKit', '~> x.x.x'        # 国内 UI（二选一）
# pod 'RXOSUIKit', '~> x.x.x'   # 海外 UI
```

**工具（按需）：**

```ruby
# pod 'RXWXSDK', '~> x.x.x'           # 微信
# pod 'RXGoogleSDK', '~> x.x.x'       # Google
# pod 'RXFacebookSDK', '~> x.x.x'     # Facebook
# pod 'RXLineSDK', '~> x.x.x'
# pod 'RXPushSDK', '~> x.x.x'         # 推送
# pod 'RXFirebaseSDKCode', '~> x.x.x' # Firebase（仅海外）
# pod 'RXAdjustCode', '~> x.x.x'      # Adjust（仅海外）
# pod 'RXFeedbackSDKCode', '~> x.x.x' # 反馈
# pod 'RXOpeninstallSDK', '~> x.x.x'
# pod 'RXLanguageKit', '~> x.x.x'
```

Pod 名以实际 CocoaPods 仓库或本地工程为准（如 `RXUIKitCode`、`RXOSUIKitCode` 等）。

---

## 六、相关文档

- **Android 接入**：渠道选择与 Maven 配置见团队 Android 接入规范。
- **Android API**：[API 文档](../android/api/README.md) | [接口清单](../android/api/API_LIST.md) | [第三方 SDK 封装](../android/public_class_methods.md#第三方-sdk-封装)。
- **Android initThirdSdk**：[rxsdk_api.md](../android/api/rxsdk_api.md)（百度、抖音、快手、YSDK 等渠道初始化）。
- **iOS 文档**：[iOS README](../ios/README.md) | [iOS API](../ios/api/README.md) | [iOS 公开类列表](../ios/public_classes.md)。
- **iOS 接入规范**：初始化与 channelId 配置见团队 iOS 接入规范（如 `RXSdkInitConfig`、`channelId`）。

---

*文档归属：rxsdk-doc。Android 以 Maven 名、iOS 以 Pod/工程名为准，有变更请以实际仓库为准。*
