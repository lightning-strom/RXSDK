# RXSDK-Demo

瑞雪 SDK Android Demo 项目，用于演示和测试 RXSDK 的各项功能。

## 项目简介

本项目是一个独立的 Android 应用示例项目，展示了如何使用瑞雪 SDK（RXSDK）进行开发。项目包含登录、支付、分享、反馈等核心功能的示例代码。

## 环境要求

- **Android Studio**: Arctic Fox (2020.3.1) 或更高版本
- **JDK**: 1.8 或更高版本
- **Android SDK**: 
  - `compileSdkVersion`: 34
  - `minSdkVersion`: 21
  - `targetSdkVersion`: 28
- **Gradle**: 7.3.1 或更高版本
- **编程语言**: Java 8

## 项目结构

```
rxsdk-demo/
├── app/                          # 应用模块
│   ├── build.gradle             # 应用构建配置
│   ├── proguard-rules.pro       # ProGuard 混淆规则
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/ruixue/demo/
│           │   ├── DemoApplication.java  # 应用程序入口
│           │   └── MainActivity.java     # 主界面
│           └── res/                      # 资源文件
├── build.gradle                 # 项目级构建配置
├── settings.gradle              # 项目设置
├── gradle.properties            # Gradle 属性配置
└── README.md                    # 项目说明文档
```

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd rxsdk-demo
```

### 2. 配置 SDK 依赖

#### 方式一：引用本地 SDK 模块（推荐用于开发）

在 `app/build.gradle` 中取消注释并配置本地 SDK 路径：

```gradle
dependencies {
    // 引用本地 SDK 模块
    implementation project(':rxsdk_base')
    implementation project(':rxsdk_base_ui')
    // ... 其他依赖
}
```

在 `settings.gradle` 中添加 SDK 模块：

```gradle
include ':rxsdk_base'
project(':rxsdk_base').projectDir = new File('../ruixue_sdk_android/rxsdk_base')

include ':rxsdk_base_ui'
project(':rxsdk_base_ui').projectDir = new File('../ruixue_sdk_android/rxsdk_base_ui')
```

#### 方式二：从 Maven 仓库引用

在 `app/build.gradle` 中添加：

```gradle
dependencies {
    implementation 'com.ruixue:rxsdk-base:1.0.0'
    implementation 'com.ruixue:rxsdk-base-ui:1.0.0'
    // ... 其他依赖
}
```

### 3. 配置应用信息

在 `app/src/main/AndroidManifest.xml` 中配置应用包名和权限。

在 `DemoApplication.java` 中初始化 SDK：

```java
@Override
public void onCreate() {
    super.onCreate();
    // 初始化 SDK，替换为您的 AppKey
    RuiXueSdk.init(this, "your_app_key");
}
```

### 4. 构建和运行

1. 使用 Android Studio 打开项目
2. 等待 Gradle 同步完成
3. 连接 Android 设备或启动模拟器
4. 点击运行按钮或使用命令：`./gradlew installDebug`

## 功能示例

### 登录功能

在 `MainActivity.java` 中，点击"登录"按钮可以触发登录流程：

```java
binding.btnLogin.setOnClickListener(v -> {
    // 实现登录逻辑
    RuiXueSdk.login(this, new RXLoginCallback() {
        @Override
        public void onSuccess(RXLoginResult result) {
            showToast("登录成功: " + result.getUserId());
        }
        @Override
        public void onError(RXError error) {
            showToast("登录失败: " + error.getMessage());
        }
    });
});
```

### 支付功能

```java
binding.btnPay.setOnClickListener(v -> {
    // 实现支付逻辑
    // TODO: 添加支付示例代码
});
```

### 分享功能

```java
binding.btnShare.setOnClickListener(v -> {
    // 实现分享逻辑
    // TODO: 添加分享示例代码
});
```

### 反馈功能

```java
binding.btnFeedback.setOnClickListener(v -> {
    // 实现反馈逻辑
    // TODO: 添加反馈示例代码
});
```

## 开发规范

本项目遵循以下开发规范：

1. **代码规范**：遵循 Alibaba Java 开发手册
2. **版本控制**：所有代码必须添加版本控制信息和注释
3. **接口设计**：保持接口简洁易用，参数不超过 5 个
4. **异常处理**：所有接口必须包含异常处理机制
5. **安全规范**：敏感数据加密存储和传输，禁止硬编码密钥
6. **性能优化**：避免创建大量临时对象，支持资源自动释放

## 测试

运行单元测试：

```bash
./gradlew test
```

运行 UI 测试：

```bash
./gradlew connectedAndroidTest
```

## 常见问题

### Q: 如何配置 SDK 的 AppKey？

A: 在 `DemoApplication.kt` 的 `onCreate()` 方法中调用 `RuiXueSdk.init(this, "your_app_key")`。

### Q: 如何引用本地 SDK？

A: 在 `settings.gradle` 中添加 SDK 模块路径，然后在 `app/build.gradle` 中使用 `implementation project()` 引用。

### Q: 编译错误：找不到 SDK 类？

A: 请确保已正确配置 SDK 依赖，并同步 Gradle 项目。

## 版本历史

### v1.0.0 (2024-01-XX)
- 初始版本
- 创建基础项目结构
- 实现主界面和基本功能入口

## 许可证

[在此添加许可证信息]

## 联系方式

如有问题或建议，请联系开发团队。
