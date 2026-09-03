# RXCocosGame

瑞雪 SDK Cocos2d-x 集成开发示例

## 项目介绍

本项目是一个基于 **Cocos2d-x 3.17** 引擎的游戏开发 Demo，用于演示如何在 Cocos2d-x 项目中集成和使用**瑞雪 SDK**。

## 技术栈

- **游戏引擎**: Cocos2d-x 3.17
- **开发语言**: C++ / Java / Objective-C
- **瑞雪 SDK**: 3.7.36-beta1

## 支持平台

| 平台 | 状态 |
|------|------|
| iOS | ✅ 支持 |
| Android | ✅ 支持 |

## 项目结构

```
RXCocosGame/
├── Classes/              # 游戏核心代码
│   └── RuixueSDK/        # 瑞雪 SDK 桥接层
├── Resources/            # 游戏资源文件
├── cocos2d/              # Cocos2d-x 引擎源码
├── proj.ios_mac/         # iOS 工程 (Xcode)
└── proj.android/         # Android 工程 (Gradle)
```

## 快速开始

### 环境要求

- Cocos2d-x 3.17
- Xcode 12+ (iOS)
- Android Studio / Gradle (Android)

### 编译运行

#### iOS

1. 打开 `proj.ios_mac/RXCocosGame.xcodeproj`
2. 选择 `RXCocosGame-mobile` target
3. 选择 iOS 模拟器或真机
4. 点击运行

#### Android

```bash
cd proj.android
./gradlew assembleDebug
```

## 瑞雪 SDK 集成

### SDK 架构

本项目采用 C++ 桥接层设计，实现跨平台调用原生 SDK：

```
┌─────────────────────────────────────────────────────────┐
│                    游戏逻辑层 (C++)                       │
│                  RuixueSDKExample.h                      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  C++ 桥接层                               │
│              RuixueBridge.h / .cpp                       │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
┌────────────▼────────────┐  ┌────────────▼───────────────┐
│   Android 平台实现        │  │      iOS 平台实现           │
│ RuixueBridge_android.cpp │  │   RuixueBridge_ios.mm      │
│        (JNI)             │  │    (Objective-C++)         │
└────────────┬─────────────┘  └────────────┬──────────────┘
             │                             │
┌────────────▼─────────────┐  ┌────────────▼──────────────┐
│   Android 原生层          │  │      iOS 原生层            │
│    RuixueSDK.java        │  │  RuixueSDKWrapper.mm      │
└──────────────────────────┘  └───────────────────────────┘
```

### 文件结构

```
Classes/RuixueSDK/
├── RuixueBridge.h              # C++ 接口定义
├── RuixueBridge.cpp            # C++ 通用实现
├── RuixueSDKExample.h          # 使用示例
├── android/
│   └── RuixueBridge_android.cpp  # Android JNI 实现
└── ios/
    ├── RuixueBridge_ios.mm       # iOS C++ 到 OC 桥接
    ├── RuixueSDKWrapper.h        # iOS 原生层头文件
    └── RuixueSDKWrapper.mm       # iOS 原生层实现

proj.android/app/src/
├── com/ruixue/sdk/
│   └── RuixueSDK.java          # Android 原生层
├── com/wl/rx/
│   └── GameApplication.java    # Application 类
└── org/cocos2dx/cpp/
    └── AppActivity.java        # 游戏 Activity
```

### 使用方法

#### 1. 初始化 SDK

```cpp
#include "RuixueSDK/RuixueBridge.h"

auto bridge = ruixue::RuixueBridge::getInstance();

// 参数: cpid, productId, channelId, baseUrlsJson (JSON 数组格式)
bridge->init("114", "1002", "100", 
             R"(["https://cn-api-test.ruixueyun.com/"])",
             [](bool success, const std::string& message) {
    if (success) {
        CCLOG("SDK 初始化成功");
    } else {
        CCLOG("SDK 初始化失败: %s", message.c_str());
    }
});
```

#### 2. 登录

```cpp
bridge->login([](bool success, const std::string& userId, const std::string& token) {
    if (success) {
        CCLOG("登录成功, userId: %s", userId.c_str());
    }
});
```

#### 3. 支付

```cpp
// 星驿 App 支付（仅 Android）
bridge->pay(R"({
    "payType": "xy",
    "goodsTag": "replace_with_goods_tag",
    "tradeNo": "cp_order_001"
})", [](const std::string& responseJson) {
        CCLOG("支付结果: %s", responseJson.c_str());
    });

// 星驿 H5 支付（仅 Android）
bridge->pay(R"({
    "payType": "xy",
    "goodsTag": "replace_with_goods_tag",
    "tradeNo": "cp_order_002",
    "ext": {"is_h5": 1}
})", [](const std::string& responseJson) {
        CCLOG("支付结果: %s", responseJson.c_str());
    });
```

星驿支付要求 Android SDK `4.0.14` 或更高，并同时按实际场景接入
`rxsdk_xingyi` / `rxsdk_h5pay`。iOS 不支持星驿支付。

虎牙联运（仅 Android）需接入 `rxsdk_huya:4.0.17`，先调用
`initThirdSdk` 传入渠道参数，再使用：

```cpp
bridge->login(R"({"loginType":"huya"})", callback);
bridge->pay(R"({
    "payType":"huya",
    "goodsTag":"replace_with_goods_tag",
    "tradeNo":"replace_with_server_order"
})", callback);
bridge->setGameInfo(R"({
    "type":2,
    "roleId":"role_10001",
    "serverId":"server_1",
    "attach":"{\"sdk_channel_id\":\"huya\"}"
})", callback);
```

`setGameInfo` 在 Android 上上报完整渠道角色信息；iOS 会读取 `roleId` 和
`serverId`，调用基础 SDK 的角色/区服设置接口。

### 栩腾渠道（Android）

栩腾不使用专属 Cocos Bridge，登录、支付、角色上报、登出和退出都走公共接口。
先初始化基础 SDK，再初始化渠道 SDK。当前栩腾实现可传空对象；如果渠道交付包
要求附加运行时参数，则将交付参数 JSON 原样传入（不要在仓库中保存真实凭证）：

```cpp
bridge->initThirdSdk(R"({})", callback);
// 或：bridge->initThirdSdk(xutengParamsJson, callback);

bridge->login(R"({"loginType":"xuteng"})", callback);
bridge->pay(R"({
    "payType":"xuteng",
    "goodsTag":"replace_with_goods_tag",
    "age":18
})", callback);
bridge->setGameInfo(R"({
    "type":2,
    "roleId":"role_1001",
    "roleName":"角色名",
    "serverId":"1",
    "serverName":"服务器名",
    "gameRoleLevel":"10"
})", callback);
bridge->logout(callback);
bridge->exitApp(callback);
```

Cocos 的 `payType: "xuteng"` 会由公共 Java 支付层转换为渠道参数
`hq_type: "xuteng"`。`exitApp` 回调通过 `data.confirmed` 区分确认与取消。
iOS 明确返回 `code=-2`，不模拟栩腾退出能力。

示例工程当前仍启用百度依赖。切换栩腾时必须：

1. 将 `com.ruixue:rxsdk_baidu_wangxun:4.0.18` 替换为
   `com.ruixue:rxsdk_xuteng:4.0.19`，不得与百度或其它渠道库并存。
2. 将 Manifest 的 Application 从示例的 `.GameApplication` 替换为
   `com.ruixue.sdk.XTApplication`。
3. 在 `android.defaultConfig` 中配置栩腾提供的 `CHANNELSDK_ID` 和
   `CHANNELSDK_GAME_VERSION` Manifest placeholder；仓库不填写真实值。
4. 将栩腾母包工具生成的 `brsdk.cfg` 放到 Android 应用的
   `assets/brsdk.cfg`。本项目 `sourceSets.main.assets` 指向 `Resources`，
   因此示例工程对应路径为 `Resources/brsdk.cfg`。

### Android 渠道动作

C++ 业务统一调用 `invokeChannelAction`，不引用百度或 MuMu 的专属类和方法。
当前示例工程选择百度渠道库：

```groovy
implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.18'
```

先完成通用 `init` 和 `initThirdSdk`，再调用渠道动作：

```cpp
// 百度 showSplash
bridge->invokeChannelAction(
    ruixue::ChannelAction::SHOW_SPLASH, R"({})", callback);

// MuMu showSplash
bridge->invokeChannelAction(
    ruixue::ChannelAction::SHOW_SPLASH, R"({"splashType":0})", callback);

bridge->invokeChannelAction(
    ruixue::ChannelAction::SHOW_FLOAT_VIEW, R"({})", callback);
bridge->invokeChannelAction(
    ruixue::ChannelAction::HIDE_FLOAT_VIEW, R"({})", callback);

// 登录、支付、角色上报继续使用通用接口
bridge->login(R"({"loginType":"baidunet"})", callback);
bridge->setGameInfo(R"({
    "type":2,
    "roleId":"replace_with_role_id",
    "serverId":"replace_with_server_id"
})", callback);
```

登录、支付、角色上报和退出仍走项目既有通用流程。百度与 MuMu 之间切换时，
C++ 和 Java 业务代码不变，只替换 Android 渠道 artifact。切换到 MuMu 时，
将百度 artifact 替换为与基础库同版本的固定
`com.ruixue:rxsdk_yofun:<version>`，并按 MuMu 文档补齐其 Maven 仓库、
Manifest、`.yofun.mumu` 包名等必要配置；不要同时引入两个渠道库。

示例工程保留的 `provider_paths.xml` 和 proguard 规则是百度构建配置。
使用 `install_sdk.sh --baidu` 时，脚本只复制百度 Android 构建资源，并提示
添加固定版本渠道依赖及同步混淆规则。

#### 4. 分享

```cpp
bridge->share(2, "分享标题", "分享内容", "https://example.com/image.png",
    [](bool success, const std::string& data) {
        // 处理分享结果
    });
```

## Android 集成

### 1. 添加 Gradle 依赖

在 `build.gradle` 中添加 Maven 仓库：

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        // 瑞雪 SDK Maven 仓库
        maven {
            url 'http://60.205.123.114:8081/repository/maven-releases/'
            allowInsecureProtocol = true
        }
        maven {
            credentials {
                username '600685104fb2132a19e09a29'
                password '2IfrbLKz50J1'
            }
            url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
        }
    }
}
```

在 `app/build.gradle` 中添加依赖：

```groovy
dependencies {
    implementation 'com.ruixue:rxsdk_weile:3.7.36-beta1'
    implementation 'com.ruixue:rxsdk_base_ui:3.7.36-beta1'
}
```

在 `gradle.properties` 中添加：

```properties
android.useAndroidX=true
android.enableJetifier=true
```

### 2. 配置 Application

创建 `GameApplication.java`：

```java
package com.wl.rx;

import android.app.Application;
import android.content.Context;
import com.ruixue.openapi.RXSDK;

public class GameApplication extends Application {
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RXSDK.attachBaseContext(base);
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        RXSDK.onApplicationCreate(this);
    }
}
```

在 `AndroidManifest.xml` 中注册：

```xml
<application android:name=".GameApplication" ...>
```

### 3. 配置 Activity 生命周期

在 `AppActivity.java` 中：

```java
import com.ruixue.openapi.RXSDK;
import com.ruixue.sdk.RuixueSDK;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RXSDK.onCreate(this);
    RuixueSDK.setActivity(this);
}

@Override
protected void onStart() {
    super.onStart();
    RXSDK.onStart(this);
}

@Override
protected void onResume() {
    super.onResume();
    RXSDK.onResume(this);
}

@Override
protected void onPause() {
    super.onPause();
    RXSDK.onPause(this);
}

@Override
protected void onStop() {
    super.onStop();
    RXSDK.onStop(this);
}
```

## iOS 集成

### 1. 添加源文件到工程

1. 在 Xcode 中右键点击 `Classes` 组 → Add Files to "RXCocosGame"
2. 选择 `Classes/RuixueSDK` 整个文件夹
3. 勾选 "Create groups" 和 "Add to targets: RXCocosGame-mobile"
4. **注意：不要勾选 RXCocosGame-desktop (macOS)**

需要确保以下文件被编译：
- `RuixueBridge.cpp`
- `ios/RuixueBridge_ios.mm`
- `ios/RuixueSDKWrapper.mm`

### 2. 配置 Build Settings

在 `Header Search Paths` 中添加：
- `$(SRCROOT)/../Classes`
- `$(SRCROOT)/../Classes/RuixueSDK`

## 屏幕适配

本项目采用竖屏 1080p 分辨率设计：

| 配置项 | 值 |
|--------|------|
| 设计分辨率 | 1080 x 1920 |
| 适配策略 | FIXED_WIDTH |
| 宽度固定 | 1080，高度自适应 |

## 许可证

本项目仅供学习和参考使用。
