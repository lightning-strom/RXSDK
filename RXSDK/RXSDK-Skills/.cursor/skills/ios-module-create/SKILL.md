---
name: ios-module-create
description: 创建 RXSDK iOS 组件库模块。触发场景：新建 iOS SDK 组件、新建 iOS 原生功能模块、创建 iOS Xcode 工程和 CocoaPods 配置/上传脚本。涵盖 Xcode 工程结构、Podfile、ObjC 源码、Demo 工程、CocoaPods 发布等完整流程。
---

# iOS 组件库创建规范

基于 RXSDK-iOS 工程结构，指导创建新的 iOS SDK 组件模块。

## 组件库目录结构

所有 iOS 组件在 `RXSDK-iOS/` 顶层目录下，命名格式为 `RX[Name]Code` 或 `RX[Name]SDKCode`。

### 现有组件命名示例

| 目录名 | 功能 |
|--------|------|
| `RXAdjustCode` | Adjust 归因 |
| `RXFirebaseSDKCode` | Firebase 分析 |
| `RXGDTSDKCode` | 广点通广告 |
| `RXOpeninstallSDK` | Openinstall 安装追踪 |
| `RXWXSDKCode` | 微信 SDK |
| `RXFacebookSDKCode` | Facebook 登录/分享 |
| `RXToolKitCode` | 公共工具库 |
| `RXUIKitCode` | UI 组件库 |
| `RXContactSDKCode` | 客服 SDK |
| `RXIMSDKCode` | IM 即时通讯 |

---

## 创建流程

### 目录结构模板

```
RX[Name]SDKCode/                         # 或 RX[Name]Code
├── Podfile                               # CocoaPods 依赖配置
├── RX[Name]SDK.xcodeproj/               # SDK 工程
│   └── project.pbxproj
├── RX[Name]SDK.xcworkspace/             # Workspace（含 Pods）
├── RX[Name]SDK/                         # SDK 源码目录
│   ├── RX[Prefix].h                     # 头文件
│   ├── RX[Prefix].m                     # 实现文件
│   ├── RX[Prefix]CommonHeader.h         # 公共头文件（可选）
│   ├── PrivacyInfo.xcprivacy            # 隐私清单
│   └── RX[Name]SDK.docc/               # 文档目录（可选）
├── RX[Name]SDKDemo/                     # Demo 工程
│   ├── RX[Name]SDKDemo.xcodeproj/
│   ├── AppDelegate.h / .m
│   ├── ViewController.h / .m
│   ├── SceneDelegate.h / .m
│   ├── main.m
│   ├── Info.plist
│   └── RXSDK_Pure.framework/           # SDK 主框架依赖
├── Pods/                                # CocoaPods 管理（自动生成）
└── Lipo/                                # 合并架构产物（可选）
```

### Step 1: 创建 Podfile

```ruby
platform :ios, '11.0'
source 'https://github.com/CocoaPods/Specs.git'

workspace 'RX[Name]SDK.xcworkspace'

def commonPods
    use_frameworks!
    pod '[ThirdPartyLib]'    # 第三方依赖
end

target 'RX[Name]SDKDemo' do
  project 'RX[Name]SDKDemo/RX[Name]SDKDemo.xcodeproj'
  commonPods
end

target 'RX[Name]SDK' do
  project 'RX[Name]SDK.xcodeproj'
  commonPods
end
```

### Step 2: 创建 SDK 源码

ObjC 头文件 `RX[Prefix].h`：

```objc
#import <Foundation/Foundation.h>

@interface RX[Prefix] : NSObject

+ (void)initWithAppId:(NSString *)appId;
// 声明公开接口

@end
```

ObjC 实现文件 `RX[Prefix].m`：

```objc
#import "RX[Prefix].h"

@implementation RX[Prefix]

+ (void)initWithAppId:(NSString *)appId {
    // 实现初始化逻辑
}

@end
```

### Step 3: 创建 PrivacyInfo.xcprivacy

Apple 要求的隐私清单文件，声明 SDK 数据收集和 API 使用情况。

### Step 4: 创建 Demo 工程

Demo 工程用于验证 SDK 功能，需包含：
- `AppDelegate`：配置 SDK 初始化
- `ViewController`：展示 API 调用示例
- `Info.plist`：配置所需权限和参数

Demo 工程需引入 `RXSDK_Pure.framework` 和 `RXLanguageKit.framework` 作为基础依赖。

### Step 5: 执行 Pod Install

```bash
cd RXSDK-iOS/RX[Name]SDKCode
pod install
```

### Step 6: CocoaPods 校验与上传

仓库内统一使用 `RXSDK-iOS/scripts/publish-cocoapods.sh` 做 `RXSDK-iOS/CocoaPod` 下 podspec 的校验和上传。脚本会先从源码工程自动编译真机 `framework`，同步到 `CocoaPod/[Pod]` 独立仓库，再执行 lint、提交、tag 和上传。

```bash
cd RXSDK-iOS

# 查看当前 CocoaPod 发布目录里的 Pod
./scripts/publish-cocoapods.sh --list

# 只把脚本内 POD_VERSIONS 配置同步到 podspec，不编译、不上传
./scripts/publish-cocoapods.sh --all --sync-versions-only

# 本地编译真机 framework、同步到 CocoaPod 仓库并执行 pod lib lint，不提交、不创建 tag、不上传
./scripts/publish-cocoapods.sh --dry-run RXUIKit

# 上传单个 Pod 到 CocoaPods trunk，会自动编译真机 framework、提交、推送分支，并按 s.version 创建/推送 git tag
./scripts/publish-cocoapods.sh --trunk RXUIKit

# 按依赖顺序批量上传 CocoaPod 下所有 Pod 到私有 specs repo
./scripts/publish-cocoapods.sh --all --repo rxsdk-specs
```

内置源码工程映射：

- `RXSDK_Pure` -> `RXSDKCode/RXSDK.xcodeproj`，scheme `RXSDK-Pure`
- `RXAdjustSDK` -> `RXAdjustCode/RXAdjustSDK.xcodeproj`
- `RXBDASignalSDK` -> `RXBDASignalSDKCode/RXBDASignalSDK.xcodeproj`
- `RXGoogleSDK` -> `RXGoogleSDKCode/RXGoogleSDK.xcodeproj`
- `RXWXSDK` -> `RXWXSDKCode/RXWXSDK.xcodeproj`
- `RXOpeninstallSDK` -> `RXOpeninstallSDK/RXOpeninstallSDK.xcodeproj`
- `RXOpeninstallOSSDK` -> `RXOpeninstallOSSDKCode/RXOpeninstallOSSDK.xcodeproj`
- `RXGDTSDK` -> `RXGDTSDKCode/RXGDTSDK.xcodeproj`
- `RXPushSDK` -> `RXPushSDKCode/RXPushSDK.xcodeproj`
- `RXGameCenterSDK` -> `RXGameCenterCode/RXGameCenterSDK.xcodeproj`
- `RXUIKit` -> `RXUIKitCode/RXUIKit.xcodeproj`
- `RXOSUIKit` -> `RXOSUIKitCode/RXUIKit-OS.xcodeproj`，scheme `RXUIKit-OS`

编译要求：

- 只使用 `xcodebuild -sdk iphoneos -destination 'generic/platform=iOS'` 编译真机包
- 禁止上传包含 `x86_64` 或 `i386` 模拟器架构的 `framework`
- 默认编译配置为 `Release`，可通过 `BUILD_CONFIGURATION=Release` 覆盖

版本号管理：

- 当前 CocoaPod 版本统一写在 `publish-cocoapods.sh` 顶部的 `POD_VERSIONS`
- 升级版本时先修改 `POD_VERSIONS`，再执行 `--sync-versions-only` 回写 podspec
- `--list` 会同时显示 podspec 当前版本和脚本配置版本，便于检查是否一致

常用参数：

- `--all`：按内置依赖顺序处理 `RXSDK-iOS/CocoaPod` 下所有 podspec
- `--sync-versions-only`：只同步脚本内 `POD_VERSIONS` 到 podspec 后退出
- `--no-sync-versions`：不使用脚本内 `POD_VERSIONS` 回写 podspec
- `--sources <sources>`：指定 CocoaPods sources，多个源用英文逗号分隔
- `--lint <lib|spec>`：选择 `pod lib lint` 或 `pod spec lint`，默认 `lib`
- `--skip-build`：跳过源码工程编译与 `framework` 同步
- `--allow-warnings`：允许 warnings（默认）
- `--skip-import-validation`：跳过 import 校验
- `--skip-tests`：跳过测试
- `--update-repos`：上传前更新本地 specs repo
- `--skip-tag`：跳过 git tag 检查/创建/推送
- `--no-push-tag`：只检查/创建本地 tag，不推送到 origin
- `--no-auto-commit`：不自动提交同步后的 `framework`
- `--no-push-commit`：提交后不推送 CocoaPod 仓库分支

发布前必须确认：

- podspec 的 `s.name`、`s.version`、`s.source` 与本次发布版本一致
- `CocoaPod/<Pod>/` 子目录是对应的独立 git 仓库，`remote origin` 与 podspec 的 `s.source.git` 一致
- 源码工程可以在真机 `iphoneos` 下编译通过，不能使用模拟器产物
- `--dry-run` 或 `--lint-only` 校验通过
- 真实上传必须显式选择 `--trunk` 或 `--repo <name>`

---

## 命名规范

| 项目 | 格式 | 示例 |
|------|------|------|
| 目录名 | `RX[Name]Code` 或 `RX[Name]SDKCode` | `RXAdjustCode`, `RXFirebaseSDKCode` |
| Xcode 工程 | `RX[Name]SDK` | `RXAdjustSDK` |
| 源码目录 | `RX[Name]SDK/` | `RXAdjustSDK/` |
| 类名前缀 | `RX[缩写]` | `RXADJTool`, `RXADJConfig` |
| Demo 工程 | `RX[Name]SDKDemo` | `RXAdjustSDKDemo` |

### 类名前缀约定

- 使用 SDK 名称的缩写作为类前缀（如 Adjust → `RXADJ`，Firebase → `RXFire`）
- 公共类统一以 `RX` 开头
- 工具类后缀 `Tool`，配置类后缀 `Config`

---

## 工程配置要点

参考 [ios-project-config-spec.md](../code-gen-spec/ios-project-config-spec.md)：

| 配置类型 | 应用场景 |
|----------|----------|
| Pod 依赖 | 第三方库接入（Podfile） |
| Info.plist | 权限声明、URL Scheme、APP_KEY |
| Associated Domains | Universal Link、App Clip |
| Entitlements | 应用能力配置 |
| Framework Search Paths | 依赖 framework 路径 |

---

## 执行清单

```text
iOS 组件创建清单：[组件名]

[ ] 1. 确认组件功能和第三方依赖
[ ] 2. 创建 RX[Name]SDKCode 目录
[ ] 3. 创建 Podfile
[ ] 4. 创建 Xcode SDK 工程（RX[Name]SDK）
[ ] 5. 编写 ObjC 头文件和实现文件
[ ] 6. 添加 PrivacyInfo.xcprivacy
[ ] 7. 创建 Demo 工程
[ ] 8. 执行 pod install
[ ] 9. 编译验证
[ ] 10. 创建或更新 podspec
[ ] 11. 确认 scripts/publish-cocoapods.sh --list 中 Pod 与源码工程映射正确
[ ] 12. 使用 scripts/publish-cocoapods.sh --dry-run 编译真机 framework 并校验
[ ] 13. 使用 scripts/publish-cocoapods.sh --trunk 或 --repo 上传
```
