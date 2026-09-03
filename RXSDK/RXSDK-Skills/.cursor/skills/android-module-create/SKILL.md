---
name: android-module-create
description: 创建 RXSDK Android 组件库或渠道库模块。触发场景：新建 Android 组件模块、新建 Android 渠道模块、新建 Android 海外模块。涵盖 build.gradle、AndroidManifest、Java 源码、settings.gradle 注册等完整流程。
---

# Android 组件库 / 渠道库创建规范

基于 RXSDK-Android 工程的模块化结构，指导创建新的组件库或渠道库。

## 模块分类

| 类型 | 目录位置 | settings.gradle 注册格式 | 用途 |
|------|----------|--------------------------|------|
| 组件库 | `RXSDK-Android/rxsdk_[name]` | `include ':rxsdk_[name]'` | 功能性组件（bugly、topon、weixin 等） |
| 渠道库 | `RXSDK-Android/channel/rxsdk_[name]` | `include ':channel:rxsdk_[name]'` | 渠道对接（huawei、oppo、xiaomi 等） |
| 海外库 | `RXSDK-Android/overseas/rxsdk_[name]` | `include ':overseas:rxsdk_[name]'` | 海外渠道（google、facebook、adjust 等） |

---

## 一、组件库创建流程

### 目录结构模板

```
rxsdk_[name]/
├── .gitignore
├── build.gradle
├── consumer-rules.pro
├── proguard-rules.pro
└── src/main/
    ├── AndroidManifest.xml
    └── java/com/ruixue/sdk/[name]/
        └── [Name]Helper.java
```

### Step 1: 创建 build.gradle

```groovy
plugins {
    id 'com.android.library'
}
project.group 'com.ruixue'
apply from: "${rootDir}/maven.gradle"
def libs = rootProject.ext.libraries
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion

    defaultConfig {
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode rootProject.ext.versionCode
        versionName rootProject.ext.versionName

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles "consumer-rules.pro"
        ndk {
            abiFilters 'armeabi-v7a', 'x86_64', 'arm64-v8a'
        }
        buildConfigField("String", "BUILD_TIME", "\"${getTimestamp()}\"")
        buildConfigField("String", "COMMIT_ID", "\"${getGitCommit()}\"")
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        packagingAAR(project, android)
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    // 添加第三方依赖
}
```

### Step 2: 创建 AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ruixue.sdk.[name]">
</manifest>
```

### Step 3: 创建核心类 [Name]Helper.java

- 包名: `com.ruixue.sdk.[name]`
- 命名: `[Name]Helper` 为模块入口类
- 提供 `init(Context, ...)` 等静态方法

### Step 4: 注册到 settings.gradle

在 `RXSDK-Android/settings.gradle` 中添加：

```groovy
include ':rxsdk_[name]'
```

### Step 5: 创建辅助文件

- `.gitignore`: 使用标准 Android library 忽略规则
- `consumer-rules.pro`: 空文件或消费者混淆规则
- `proguard-rules.pro`: 空文件或混淆规则

---

## 二、渠道库创建流程

### 目录结构模板

```
channel/rxsdk_[name]/
├── .gitignore
├── build.gradle
├── consumer-rules.pro
├── proguard-rules.pro
└── src/main/
    ├── AndroidManifest.xml
    └── java/com/ruixue/
        ├── openapi/
        │   └── RXSdkApiImpl.java      # 必须：渠道 API 入口
        └── sdk/
            ├── [Name]SdkHelper.java    # SDK 辅助类
            ├── [Name]SdkApiImpl.java   # 实际 API 实现
            ├── [Name]BillingImpl.java  # 支付实现（如需要）
            ├── [Name]OrderData.java    # 订单数据（如需要）
            └── [Name]Config.java       # 配置类（如需要）
```

### 渠道库与组件库的关键差异

1. **必须包含 `RXSdkApiImpl.java`**（在 `com.ruixue.openapi` 包下），继承自渠道的实际实现类：

```java
package com.ruixue.openapi;

public class RXSdkApiImpl extends [Name]SdkApiImpl {
}
```

2. **依赖 rxsdk_base**：

```groovy
dependencies {
    api project(path: ':rxsdk_base')
    // 渠道 SDK 依赖
}
```

3. **注册到 settings.gradle** 使用 channel 前缀：

```groovy
include ':channel:rxsdk_[name]'
```

### 渠道库核心类说明

| 类 | 职责 |
|----|------|
| `RXSdkApiImpl` | openapi 包下的入口，继承实际实现 |
| `[Name]SdkHelper` | SDK 初始化、生命周期管理 |
| `[Name]SdkApiImpl` | 登录、用户信息等 API 实际实现 |
| `[Name]BillingImpl` | 支付相关逻辑 |
| `[Name]OrderData` | 订单数据模型 |

---

## 三、海外库创建流程

与渠道库结构类似，但放置在 `overseas/` 目录下：

```groovy
include ':overseas:rxsdk_[name]'
```

海外库通常不需要 `RXSdkApiImpl`，而是作为功能组件被 `rxsdk_overseas` 依赖。

---

## 执行清单

```
Android 模块创建清单：[模块名]

[ ] 1. 确认模块类型（组件/渠道/海外）
[ ] 2. 创建目录结构
[ ] 3. 编写 build.gradle（含正确依赖）
[ ] 4. 创建 AndroidManifest.xml
[ ] 5. 创建核心 Java 类
[ ] 6. 渠道库：创建 RXSdkApiImpl.java
[ ] 7. 创建 .gitignore / proguard 文件
[ ] 8. 注册到 settings.gradle
[ ] 9. 验证编译通过
```

## 命名规范

- 模块目录: `rxsdk_[小写名称]`（如 `rxsdk_bugly`）
- Java 包名: `com.ruixue.sdk.[name]`（组件）或 `com.ruixue.sdk` + `com.ruixue.openapi`（渠道）
- 类名前缀与渠道/组件名一致（如 Huawei → `HmsSdkHelper`，Oppo → `OppoSdkHelper`）
