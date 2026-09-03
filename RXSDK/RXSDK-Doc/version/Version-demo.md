# RXSDK Demo 版本记录

> 本文件记录 RXSDK Demo（Android / iOS）的版本变更历史。
> 默认每次修改双端同步，单端修改需特别说明。

---

## 版本历史

### v1.x.x (2026-07-20)

**修改内容：**
- 补全 iOS `RXLBSKitService` 定位能力实现
- RXLBSKitDemo 增加获取位置信息调用示例
- 增加高德 Key 配置项和使用期间定位权限描述

**涉及文件：**
- iOS:
  - `RXSDK-iOS/RXLBSKit/RXLBSKit/RXLBSKitService.h`
  - `RXSDK-iOS/RXLBSKit/RXLBSKit/RXLBSKitService.m`
  - `RXSDK-iOS/RXLBSKit/RXLBSKitDemo/RXLBSKitDemo/ViewController.m`
  - `RXSDK-iOS/RXLBSKit/RXLBSKitDemo/RXLBSKitDemo/Info.plist`

**涉及平台：** iOS（RXLBSKit 平台专属实现）

---

### v1.x.x (2026-05-29)

**修改内容：**
- 新增 `getUserInfoByField` 获取指定用户信息示例入口
- Android v2 Demo 增加“指定用户信息”按钮示例
- iOS Demo 管理类增加 `getUserInfoByFieldWithParams:callback:` 包装示例

**涉及文件：**
- Android:
  - `RXSDK-Android/demo/app_rxsdk_demo/src/main/java/com/ruixue/demo/v2/category/UserDemo.java`
- iOS:
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.h`
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.m`

**涉及平台：** Android / iOS

---

### v1.7.0 (2026-01-22)

**修改内容：**
- 新增屏幕方向设置功能
  - 支持竖屏/横屏切换
  - 默认为竖屏模式
  - 选择后立即应用屏幕方向
- UI 采用双按钮设计，选中按钮显示渐变背景

**涉及文件：**
- Android:
  - `RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/RXSDKManager.java`
  - `RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java`
  - `RXSDKDemo-Android/app/src/main/res/layout/activity_main.xml`
- iOS:
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.h`
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.m`
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/ViewController.m`

**涉及平台：** Android ✅ iOS ✅

---

### v1.6.0 (2026-01-22)

**修改内容：**
- 新增语言设置功能，支持 8 种语言选择
  - 简体中文（默认）
  - 繁体中文
  - English（英语）
  - 日本語（日语）
  - ภาษาไทย（泰语）
  - Tiếng Việt（越南语）
  - Filipino（菲律宾语）
  - العربية（阿拉伯语）
- 语言设置使用单选对话框，默认勾选简体中文
- RXSDKManager 新增语言管理相关方法

**涉及文件：**
- Android:
  - `RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/RXSDKManager.java`
  - `RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java`
  - `RXSDKDemo-Android/app/src/main/res/layout/activity_main.xml`
- iOS:
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.h`
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.m`
  - `RXSDKDemo-iOS/RXSDKDemo-iOS/ViewController.m`

**涉及平台：** Android ✅ iOS ✅

---

### v1.5.0 (2026-01-22)

**修改内容：**
- 重构：将 RXSDK 接口调用逻辑从 UI 代码中分离，创建独立的 SDK 管理类
  - Android: `RXSDKManager.java` - 单例模式，管理 SDK 初始化、登录、支付等接口
  - iOS: `RXSDKManager.h/.m` - 单例模式，管理 SDK 初始化、登录、支付等接口
- UI 层（MainActivity/ViewController）只负责界面展示和用户交互
- SDK 接口调用统一通过 RXSDKManager 处理
- 默认参数常量移至 RXSDKManager 类中统一管理

**涉及文件：**
- Android:
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/RXSDKManager.java` (新增)
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java`
- iOS:
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.h` (新增)
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/RXSDKManager.m` (新增)
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/ViewController.m`

**架构改进：**
- UI 与业务逻辑分离，提高代码可维护性
- SDK 接口调用集中管理，便于后续扩展
- 单例模式确保 SDK 状态一致性

**涉及平台：** Android ✅ iOS ✅

---

### v1.4.0 (2026-01-22)

**修改内容：**
- 优化 SDK 初始化流程，新增两个初始化按钮
  - "默认初始化" - 使用预设参数快速初始化
  - "自定义初始化" - 弹出对话框支持用户输入参数
- 默认初始化参数配置：
  - CPID: 114
  - Product ID: 1002
  - Channel ID: 100 (Android) / iOS (iOS)
  - Base URL: https://cn-api-test.ruixueyun.com/
- 初始化成功后显示"重置 SDK"按钮
- 新增自定义参数输入对话框 UI

**涉及文件：**
- Android:
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java`
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/res/layout/activity_main.xml`
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/res/layout/dialog_custom_init.xml` (新增)
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/res/drawable/button_outline.xml` (新增)
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/res/drawable/edit_text_bg.xml` (新增)
  - `RXSDK-Demo/RXSDKDemo-Android/app/src/main/res/values/colors.xml`
- iOS:
  - `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/ViewController.m`

**涉及平台：** Android ✅ iOS ✅

---

### v1.3.0 (2026-01-21)

**修改内容：**
- 接入瑞雪 SDK Android 初始化功能
- 添加 SDK Maven 仓库配置
- 添加 `rxsdk_weile:3.7.33` 依赖
- 创建 `DemoApplication` 继承 `RXApplication`
- 实现 `RuiXueSdk.initialize()` 初始化调用

**涉及文件：**
- `RXSDK-Demo/RXSDKDemo-Android/build.gradle` - 添加瑞雪 Maven 仓库
- `RXSDK-Demo/RXSDKDemo-Android/app/build.gradle` - 添加 SDK 依赖
- `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/DemoApplication.java` (新增)
- `RXSDK-Demo/RXSDKDemo-Android/app/src/main/AndroidManifest.xml` - 注册 Application
- `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java` - SDK 初始化代码

**SDK 配置：**
- 版本: 3.7.33
- 渠道: rxsdk_weile (自运营)
- 初始化方式: RXSdkInitConfig + RuiXueSdk.initialize()

**涉及平台：** Android ✅ iOS ❌

**备注：** 仅 Android 端接入 SDK，iOS 端待后续同步

---

### v1.2.0 (2026-01-21)

**修改内容：**
- 创建 API 文档关联文件 `api-mapping.md`，记录 Demo 各功能对应的 API 文档位置
- 在 Android `MainActivity.java` 中添加类级和方法级 API 文档引用注释
- 在 iOS `ViewController.m` 中添加文件头和方法级 API 文档引用注释

**涉及文件：**
- `RXSDK-Doc/demo/api-mapping.md` (新增)
- `RXSDK-Demo/RXSDKDemo-Android/app/src/main/java/com/ruixue/rxsdkdemo/MainActivity.java`
- `RXSDK-Demo/RXSDKDemo-iOS/RXSDKDemo-iOS/ViewController.m`

**关联文档：**
- Android: `RXSDK-Doc/android/api/` (passport_api.md, rxsdk_api.md, gamearea_api.md, social_api.md)
- iOS: `RXSDK-Doc/ios/api/` (rxservice_api.md, rxapi_service.md, iap_api.md)

**涉及平台：** Android ✅ iOS ✅

---

### v1.1.0 (2026-01-21)

**修改内容：**
- 替换所有服务按钮图标为 Figma 导出的 PNG 资源
- 移除渐变背景 + 系统图标方案，改用 UIImageView/ImageView 加载图片

**涉及资源：**
- `ic_logo.png` - Logo 图标
- `ic_login.png` - 登录图标
- `ic_user_info.png` - 用户信息图标
- `ic_gameplay.png` - 游戏图标
- `ic_payment.png` - 支付图标
- `ic_share.png` - 分享图标
- `ic_analytics.png` - 统计图标
- `ic_feedback.png` - 反馈图标
- `ic_deregister.png` - 注销图标

**涉及平台：** Android ✅ iOS ✅

---

### v1.0.0 (2026-01-21)

**修改内容：**
- 初始化 Demo 项目结构
- 实现主页 UI（Logo 区域、SDK 状态卡片、API Services 网格、Framework 信息卡片）
- 实现 SDK 初始化/重置功能
- 实现服务按钮点击交互

**Android 配置：**
- Gradle: 7.6
- Gradle Plugin: 7.3.1
- compileSdk: 33
- minSdk: 21

**iOS 配置：**
- 语言: Objective-C
- 最低支持: iOS 13.0
- 架构: arm64

**涉及平台：** Android ✅ iOS ✅

---

## 版本对照表

| 版本 | 日期 | Android | iOS | 说明 |
|------|------|---------|-----|------|
| v1.7.0 | 2026-01-22 | ✅ | ✅ | 新增屏幕方向设置功能（竖屏/横屏） |
| v1.6.0 | 2026-01-22 | ✅ | ✅ | 新增语言设置功能（8种语言） |
| v1.5.0 | 2026-01-22 | ✅ | ✅ | 重构：创建 RXSDKManager 分离 SDK 接口 |
| v1.4.0 | 2026-01-22 | ✅ | ✅ | 优化初始化流程（默认/自定义参数） |
| v1.3.0 | 2026-01-21 | ✅ | ❌ | 接入瑞雪 SDK 初始化 |
| v1.2.0 | 2026-01-21 | ✅ | ✅ | 添加 API 文档关联 |
| v1.1.0 | 2026-01-21 | ✅ | ✅ | 替换图标为 Figma 资源 |
| v1.0.0 | 2026-01-21 | ✅ | ✅ | 初始版本 |

---

## 版本记录模板

```markdown
### vX.X.X (YYYY-MM-DD)

**修改内容：**
- 

**涉及文件：**
- Android: 
- iOS: 

**涉及平台：** Android ✅/❌ iOS ✅/❌

**备注：**（单端修改时说明原因）
```
