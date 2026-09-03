# 瑞雪 Unity SDK 接入指南

> **SDK 版本**：3.7.x  
> **Unity 最低版本**：2019.4 LTS  
> **更新日期**：2026-01-28

---

## 目录

- [环境要求](#环境要求)
- [安装 SDK](#安装-sdk)
- [Android 配置](#android-配置)
  - [Gradle 模板配置](#gradle-模板配置)
  - [AndroidManifest 配置](#androidmanifest-配置)
  - [混淆配置](#混淆配置)
  - [渠道参数配置](#渠道参数配置)
  - [渠道配置文件](#渠道配置文件)
- [iOS 配置](#ios-配置)
- [WebGL 配置](#webgl-配置)
- [初始化 SDK](#初始化-sdk)
- [多渠道打包配置](#多渠道打包配置)
  - [打包工具使用](#打包工具使用)
  - [渠道 SDK 说明](#渠道-sdk-说明)
  - [工具 SDK 说明](#工具-sdk-说明)
- [常见问题](#常见问题)

---

## 环境要求

| 平台 | 版本要求 |
|------|---------|
| Unity | 2019.4 LTS 或更高版本 |
| Android | API Level 21+（Android 5.0+），部分渠道要求 API 23+ |
| iOS | iOS 11.0+ |
| WebGL | 支持 |
| .NET | Standard 2.1 |

**Android 构建工具：**

| 工具 | 版本 |
|------|------|
| Gradle | 7.6 |
| Android Gradle Plugin | 7.4.2 |
| compileSdkVersion | 31 |
| Java | 11 |

---

## 安装 SDK

### 方式一：Package Manager（推荐）

1. 打开 Unity 编辑器，菜单 **Window → Package Manager**
2. 点击左上角 **+** 按钮 → **Add package from git URL...**
3. 输入仓库地址：

```
https://git.jiaxianghudong.com/xuqiang/ruixue-unity-sdk.git?path=Packages/com.ruixue.unitysdk
```

### 方式二：本地安装

将 `Packages/com.ruixue.unitysdk` 目录完整复制到项目的 `Packages/` 目录下，Unity 会自动识别并导入。

### 验证安装

打开 **Project Settings → Player** 确认脚本编译无报错；Unity 菜单出现 **瑞雪SDK** 菜单项即表示安装成功。

---

## Android 配置

### Gradle 模板配置

在 **Project Settings → Player → Android → Publishing Settings** 中启用以下模板：

| 模板 | 路径 | 说明 |
|------|------|------|
| Custom Main Gradle Template | `Assets/Plugins/Android/mainTemplate.gradle` | 配置依赖 |
| Custom Launcher Gradle Template | `Assets/Plugins/Android/launcherTemplate.gradle` | 配置应用信息 |
| Custom Base Gradle Template | `Assets/Plugins/Android/baseProjectTemplate.gradle` | 配置构建脚本 |
| Custom Gradle Settings Template | `Assets/Plugins/Android/settingsTemplate.gradle` | 配置 Maven 仓库 |
| Custom Gradle Properties Template | `Assets/Plugins/Android/gradleTemplate.properties` | 配置 JVM 和兼容性 |

#### baseProjectTemplate.gradle

```groovy
buildscript {
    dependencies {
        classpath "com.huawei.agconnect:agcp:1.6.0.300"  // 华为渠道需要
        classpath "com.android.tools.build:gradle:7.0.1"
    }
}

plugins {
    id 'com.android.application' version '7.4.2' apply false
    id 'com.android.library' version '7.4.2' apply false
    **BUILD_SCRIPT_DEPS**
}
```

#### settingsTemplate.gradle（Maven 仓库）

以下仓库已预配置，无需修改：

```groovy
dependencyResolutionManagement {
    repositories {
        mavenCentral()
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven {
            // 瑞雪私有仓库
            url 'http://60.205.123.114:8081/repository/maven-releases/'
            allowInsecureProtocol = true
        }
        maven { url 'https://developer.huawei.com/repo/' }         // 华为
        maven { url 'https://repos.xiaomi.com/maven' }             // 小米
        maven { url 'https://maven.columbus.heytapmobi.com/...' }  // OPPO
        maven { url 'https://developer.hihonor.com/repo' }         // 荣耀
        maven { url 'https://artifact.bytedance.com/repository/ttgamesdk/' }  // 字节
        maven { url 'https://jitpack.io' }
        google()
    }
}
```

#### gradleTemplate.properties

```properties
org.gradle.jvmargs=-Xmx**JVM_HEAP_SIZE**M
org.gradle.parallel=true
unityStreamingAssets=**STREAMING_ASSETS**
**ADDITIONAL_PROPERTIES**

# 兼容 YSDK
android.useNewApkCreator=false
# 兼容 VIVO / OPPO
android.injected.testOnly=false
```

---

### AndroidManifest 配置

位置：`Assets/Plugins/Android/AndroidManifest.xml`

**必须包含以下配置：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.your.package.name"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:extractNativeLibs="true"
        android:allowBackup="false"
        tools:replace="android:allowBackup"
        android:name="com.ruixue.openapi.RXApplication">

        <!-- 微信登录/分享回调（使用微信时必须） -->
        <activity
            android:name="com.ruixue.wechat.WXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" />

        <activity-alias
            android:name="${applicationId}.wxapi.WXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:targetActivity="com.ruixue.wechat.WXEntryActivity" />

        <!-- Facebook 登录（使用 Facebook 时必须） -->
        <meta-data
            android:name="com.facebook.sdk.ApplicationId"
            android:value="@string/facebook_app_id" />
        <meta-data
            android:name="com.facebook.sdk.ClientToken"
            android:value="@string/facebook_client_token" />

    </application>
</manifest>
```

> **注意**：`android:allowBackup="false"` 和 `tools:replace="android:allowBackup"` 是必须的，用于解决与 OAID SDK 的 Manifest 合并冲突。

---

### 混淆配置

位置：`Assets/Plugins/Android/proguard-user.txt`

以下规则已内置，**无需修改**：

```proguard
# 瑞雪 SDK
-keep class com.ruixue.** { *; }

# OAID（设备标识）
-keep class com.bun.miitmdid.** {*;}

# 华为 HMS
-keep class com.huawei.hms.** {*;}

# 小米 SDK
-keep class com.xiaomi.** {*;}

# 支付宝
-keep class com.alipay.** { *; }

# OPPO
-keep class com.nearme.** { *; }
-dontwarn com.nearme.**

# 通用
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions,InnerClasses,Signature,SourceFile,LineNumberTable
```

---

### 渠道参数配置

在 `launcherTemplate.gradle` 中配置各渠道 Key（通过 `resValue` 和 `manifestPlaceholders`）：

```groovy
defaultConfig {
    applicationId '**APPLICATIONID**'
    
    // 资源字符串（用于 strings.xml）
    resValue "string", "facebook_app_id",       "你的 Facebook App ID"
    resValue "string", "facebook_client_token",  "你的 Facebook Client Token"
    resValue "string", "zalo_app_id",            "你的 Zalo App ID"
    resValue "string", "instagram_client_id",    "你的 Instagram Client ID"

    // Manifest 占位符
    manifestPlaceholders = [
        OPPO_APP_KEY    : "你的 OPPO App Key",
        OPPO_APP_SECRET : "你的 OPPO App Secret",
        MI_APP_ID       : "你的小米 App ID",
        MI_APP_KEY      : "你的小米 App Key",
        KWAI_APP_ID     : "你的快手 App ID",
        KWAI_APP_NAME   : "你的应用名称",
        QQ_APP_ID       : "你的 QQ App ID",
        FACEBOOK_APP_ID : "你的 Facebook App ID",
        AMAP_APIKEY     : "你的高德地图 Key"
    ]
}
```

---

### 渠道配置文件

部分渠道需要额外的配置文件，放置位置如下：

| 渠道 | 文件名 | 放置位置 | 来源 |
|------|--------|---------|------|
| 华为 | `agconnect-services.json` | `Assets/Plugins/Android/` | 华为开发者后台 |
| 荣耀 | `agconnect-services.json` | `Assets/Plugins/Android/` | 荣耀开发者后台 |
| 华为海外 | `agconnect-services.json` | `Assets/Plugins/Android/` | 华为开发者后台 |
| Firebase（海外） | `google-services.json` | `Assets/Plugins/Android/` | Firebase 控制台 |
| 抖音 | `config.json` | `Assets/StreamingAssets/` | 抖音开放平台 |
| 应用宝（YSDK） | `ysdkconf.ini` | `Assets/StreamingAssets/` | 腾讯游戏开放平台 |

> **注意**：抖音和 YSDK 的配置文件需放在 `Assets/StreamingAssets/` 目录，Unity 构建时会自动将其复制到 APK 的 `assets/` 目录。

---

## iOS 配置

### 基础配置

在 **Project Settings → Player → iOS** 中设置：

| 配置项 | 说明 |
|--------|------|
| Bundle Identifier | 应用包名（与后台配置一致） |
| Target minimum iOS Version | `11.0` |
| Strip Engine Code | 建议 `false` |

### Info.plist 配置（按功能选择）

```xml
<!-- 微信登录/分享 -->
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>weixin</string>
    <string>weixinULAPI</string>
</array>

<!-- 相机/相册权限（用于头像上传） -->
<key>NSCameraUsageDescription</key>
<string>需要访问相机以上传头像</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册以上传头像</string>

<!-- 位置权限（LBS 功能） -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要获取位置以查找附近玩家</string>

<!-- 通讯录权限 -->
<key>NSContactsUsageDescription</key>
<string>需要访问通讯录以添加好友</string>
```

### URL Scheme 配置（按功能选择）

在 Xcode 的 **Info → URL Types** 中添加：

| 渠道/功能 | URL Scheme | 说明 |
|----------|------------|------|
| 微信 | `wxYOUR_APP_ID` | 微信 App ID |
| QQ | `tencent1234567890` | QQ App ID 前加 `tencent` |
| Google | `com.googleusercontent.apps.YOUR_CLIENT_ID` | |

---

## WebGL 配置

WebGL 平台仅支持以下功能模块：

- ✅ 登录（账号/验证码）
- ✅ 支付（H5 支付）
- ✅ 数据分析
- ✅ 网络请求
- ❌ 推送（不支持）
- ❌ 广告（不支持）

WebGL 回调无需主线程调度，所有回调直接在当前帧触发。

---

## 初始化 SDK

### 步骤一：创建初始化脚本

建议在游戏入口场景创建一个 `SDKManager` 单例：

```csharp
using System.Collections.Generic;
using UnityEngine;
using RuiXue;

public class SDKManager : MonoBehaviour
{
    void Awake()
    {
        DontDestroyOnLoad(gameObject);
        InitSDK();
    }

    void InitSDK()
    {
        // 1. 配置对象
        var config = new RXSdkInitConfig
        {
            cpId        = "1000001",           // 瑞雪后台分配的 CP ID
            productId   = "your_product_id",   // 瑞雪后台创建的应用 ID
            channelId   = "your_channel_id",   // 渠道 ID（如 "weile"、"huawei"）
            baseUrlList = new List<string>
            {
                "https://api.ruixue.com/",     // 主域名
                "https://api2.ruixue.com/",    // 备用域名
            },
            usePrivacy     = true,             // 首次启动展示隐私弹窗
            agreementTitle = "用户协议与隐私政策",
            isLogEnable    = Debug.isDebugBuild,  // 发布版关闭日志
            isUseDNS       = true,             // 开启 DNS 优化
        };

        // 2. 初始化前配置（可选）
        RXSDK.SetLogEnable(Debug.isDebugBuild);

        // 3. 执行初始化
        RXSDK.Initialize(config, result => result.Match(
            ok:   _ => OnSDKReady(),
            fail: e => Debug.LogError("[SDK] 初始化失败: " + e)
        ));
    }

    void OnSDKReady()
    {
        Debug.Log("[SDK] 初始化成功");

        // 4. 设置全局回调
        RXSDK.SetSdkCallback(
            onEvent: (type, json) =>
            {
                Debug.Log($"[SDK] 全局事件 type={type}: {json}");
            },
            onLogout: (code, msg) =>
            {
                Debug.Log($"[SDK] 被动登出 [{code}]: {msg}");
                // 跳转到登录界面
                SceneManager.LoadScene("LoginScene");
            },
            onSwitchAccount: (code, data) =>
            {
                Debug.Log($"[SDK] 切换账号 [{code}]: {data}");
                return true; // 接受切换
            }
        );

        // 5. 设置防沉迷（如需）
        RXSDK.SetupAddictDelegate(new MyAntiAddictDelegate());

        // 6. 进入游戏登录流程
        ShowLoginUI();
    }
}
```

### 步骤二：处理隐私协议

若 `usePrivacy = true`，SDK 会在首次启动时自动弹出隐私弹窗。也可手动控制：

```csharp
// 查询用户是否已同意
if (!RXSDK.IsAgreedPrivacy())
{
    // 自行展示隐私弹窗...
    // 用户点击同意后调用：
    RXSDK.SetPrivacyAgree(agreed =>
    {
        if (agreed) OnPrivacyAgreed();
    });
}
```

### 步骤三：实现防沉迷接口

```csharp
public class MyAntiAddictDelegate : IAntiAddictDelegate
{
    public bool IsGaming()
    {
        // 返回当前是否在游戏中（非暂停/菜单状态）
        return GameManager.Instance.IsInGame;
    }

    public void AddictInfoUpdate(string json)
    {
        // 防沉迷状态变更通知，解析 json 并处理 UI
        // json 示例: {"status":2,"remainTime":30,"msg":"您今日游戏时长即将到达上限"}
        var info = JsonUtility.FromJson<AntiAddictInfo>(json);
        UIManager.ShowAntiAddictNotice(info);
    }

    public bool EnableCustomUI()
    {
        // 返回 false 使用 SDK 默认 UI
        // 返回 true 由游戏自行处理防沉迷 UI
        return false;
    }
}
```

---

## 多渠道打包配置

### 打包工具使用

SDK 内置多渠道打包工具，打开方式：**Unity 菜单 → 瑞雪SDK → 打包配置**

#### channels.json 结构

打包配置保存在 `ChannelConfigs/channels.json`：

```json
{
    "sdkVersion": "3.7.36",
    "outputPath": "Builds/Channels",
    "isOverseas": false,
    "channelProfiles": [
        {
            "channelId": "huawei",
            "rxChannelId": "huawei_001",
            "applicationId": "com.your.game.huawei",
            "appName": "你的游戏",
            "versionCode": 10001,
            "versionName": "1.0.1",
            "isSelected": true,
            "selectedTools": ["base_ui", "push_huawei"],
            "toolParams": [],
            "channelParams": []
        }
    ]
}
```

#### 渠道配置文件目录

华为、抖音等特殊渠道的配置文件放在 `ChannelConfigs/{channelId}/` 目录：

```
ChannelConfigs/
├── channels.json          # 主配置文件
├── huawei/
│   ├── agconnect-services.json   # 华为后台下载
│   └── config.json
├── douyin/
│   └── config.json        # 抖音开放平台下载
├── ysdk/
│   └── ysdkconf.ini       # 腾讯游戏平台下载
└── overseas/
    └── google-services.json      # Firebase 控制台下载
```

#### 打包输出格式

APK 文件统一命名规范：

```
{包名}-{渠道ID}-{SDK版本}.apk

示例：
com-weile-jxmj-huawei-3.7.36.apk
com-weile-jxmj-vivo-3.7.36.apk
com-ruixue-demo-qoo-3.7.36.apk
```

#### 命令行批量打包

```bash
# 批量打包所有启用的渠道
./Scripts/build.sh --all

# 仅打包当前选中渠道
./Scripts/build.sh --current

# 仅验证配置，不打包
./Scripts/build.sh --validate

# 查看帮助
./Scripts/build.sh --help
```

---

### 渠道 SDK 说明

每个 APK 只能选择一个**渠道 SDK**（SdkType.Channel）：

#### 国内渠道

| 渠道 ID | 名称 | 包名后缀建议 | 特殊说明 |
|---------|------|------------|---------|
| `weile` | 微乐/自运营 | 无 | 支持全部工具 SDK |
| `huawei` | 华为 | `.huawei` | 需要 `agconnect-services.json` |
| `honor` | 荣耀 | `.honor` | 需要 `agconnect-services.json` |
| `xiaomi` | 小米 | `.xiaomi` | 厂商渠道 |
| `vivo` | vivo | `.vivo` | 厂商渠道 |
| `oppo` | OPPO | `.oppo` | 厂商渠道 |
| `ysdk` | 应用宝 | 自定义 | 需要 `ysdkconf.ini` |
| `douyin_gb` | 抖音国包 | 自定义 | 需要 `config.json` |
| `kwaiallin` | 快手全量 | 自定义 | |
| `kwai_buy` | 快手电商 | 自定义 | |
| `bilibili` | B站 | 自定义 | |
| `4399` | 4399 | 自定义 | |
| `9game` | 九游 | 自定义 | |
| `baidu_wangxun` | 百度网讯 | 自定义 | |
| `007` | 007 | 自定义 | |
| `quick` | Quick | 自定义 | |

#### 海外渠道

| 渠道 ID | 名称 | 特殊说明 |
|---------|------|---------|
| `overseas` | 海外通用 | 需要 `google-services.json` |
| `overseas_huawei` | 海外华为 | 需要 `agconnect-services.json` + `google-services.json` |
| `overseas_oppo` | 海外 OPPO | |
| `qoo` | Qoo | 东南亚 |
| `xuteng` | 旭腾 | 最低 API 23 |

---

### 工具 SDK 说明

工具 SDK（SdkType.Tool）可按需多选，以下为常用工具：

#### 必选工具

| 工具 ID | 名称 | 说明 |
|---------|------|------|
| `base_ui` | 基础 UI | 登录、支付等基础 UI，建议所有渠道选择 |

#### 登录 / 社交

| 工具 ID | 名称 | 适用区域 | Key 配置 |
|---------|------|---------|---------|
| `weixin` | 微信登录 | 国内 | 微信 AppID/AppSecret |
| `weixin_withpay` | 微信支付 | 国内 | 微信支付商户号 |
| `google` | Google 登录 | 海外 | Firebase `google-services.json` |
| `facebook` | Facebook 登录 | 海外 | Facebook App ID/Client Token |
| `line` | LINE 登录 | 海外（东南亚） | LINE Channel ID |
| `tiktok` | TikTok 登录 | 海外 | TikTok App ID |
| `zalo` | Zalo 登录 | 海外（越南） | Zalo App ID |
| `instagram` | Instagram 登录 | 海外 | Instagram Client ID + Redirect URL |
| `snapchat` | Snapchat | 海外 | Snapchat App ID |
| `reddit` | Reddit 登录 | 海外 | Reddit Client ID |

#### 支付

| 工具 ID | 名称 | 说明 |
|---------|------|------|
| `alipay` | 支付宝支付 | 国内 |
| `h5pay` | H5 支付 | 通用 |

#### 推送（国内，按厂商选择）

| 工具 ID | 名称 | 支持渠道 |
|---------|------|---------|
| `push_huawei` | 华为推送 | 华为/荣耀渠道 |
| `push_mi` | 小米推送 | 小米渠道 |
| `push_oppo` | OPPO 推送 | OPPO 渠道 |
| `push_vivo` | vivo 推送 | vivo 渠道 |
| `push_honor` | 荣耀推送 | 荣耀渠道 |
| `push_meizu` | 魅族推送 | 魅族渠道 |

#### 数据统计 / 归因

| 工具 ID | 名称 | 适用区域 |
|---------|------|---------|
| `alimobile` | 阿里一键登录 | 国内 |
| `firebase` | Firebase 统计/推送 | 海外 |
| `adjust` | Adjust 归因 | 海外 |

---

## 常见问题

### Q1：Gradle 构建失败，提示找不到依赖

```
Could not find com.ruixue:rxsdk_xxx:3.7.36
```

**排查步骤：**
1. 检查 `settingsTemplate.gradle` 中是否包含瑞雪私有 Maven 仓库
2. 确认网络可访问 `http://60.205.123.114:8081/`
3. 检查 `channels.json` 中该渠道的 `isSelected` 是否为 `true`
4. 确认 SDK 版本号与 Maven 仓库中发布的版本一致

---

### Q2：Manifest 合并失败

```
Manifest merger failed: uses-sdk:minSdkVersion 22 cannot be smaller than version 23
```

**原因**：部分渠道 SDK（如 `xuteng`）要求最低 API 23。  
**解决**：在打包工具中为该渠道单独设置 `minSdkVersion = 23`，或在 Unity Player Settings 中全局设置。

---

### Q3：Manifest 合并冲突 `allowBackup`

```
Manifest merger failed: Attribute application@allowBackup
```

**解决**：在 `AndroidManifest.xml` 的 `<application>` 标签中添加：

```xml
android:allowBackup="false"
tools:replace="android:allowBackup"
```

---

### Q4：微信回调不生效

**检查清单：**
1. `AndroidManifest.xml` 中是否声明了 `WXEntryActivity` 和对应的 `activity-alias`
2. 微信后台配置的 **Bundle ID / 包名** 和 **签名 MD5** 是否与打包一致
3. 打包使用的 Keystore 是否与调试时相同

---

### Q5：华为渠道打包失败（AGConnect 相关）

**检查清单：**
1. `agconnect-services.json` 是否放在 `Assets/Plugins/Android/` 目录
2. `baseProjectTemplate.gradle` 中是否包含 `classpath "com.huawei.agconnect:agcp:1.6.0.300"`
3. 华为后台的 SHA-256 指纹是否配置了当前打包 Keystore 的指纹

---

### Q6：Editor 下所有接口报错 `-1001`

这是正常现象。`-1001` 表示当前平台（Unity Editor、PC Standalone）不支持该功能，需在 Android/iOS 真机上测试。

---

### Q7：iOS 构建后崩溃（Symbol not found）

检查是否添加了所需的系统 Framework，常见的必要依赖：

| Framework | 说明 |
|-----------|------|
| `SafariServices.framework` | H5 登录 |
| `AuthenticationServices.framework` | Apple 登录 |
| `StoreKit.framework` | iOS 内购 |
| `AdSupport.framework` | 广告标识符 |
| `AppTrackingTransparency.framework` | iOS 14+ ATT |
| `UserNotifications.framework` | 推送 |

---

### Q8：WebGL 下 async 接口超时

WebGL 平台不支持真正的多线程，建议使用回调形式而非 async/await，避免在 WebGL 下因协程调度问题导致回调丢失。

---

## 相关文档

| 文档 | 路径 |
|------|------|
| 接口文档 | [api/README.md](./api/README.md) |
| Android SDK 文档 | 瑞雪文档中心 |
| iOS SDK 文档 | 瑞雪文档中心 |
| 瑞雪开发者文档 | https://doc.ruixueyun.com |
