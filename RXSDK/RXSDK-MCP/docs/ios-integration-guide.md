# 瑞雪 SDK iOS 快速接入指南

> 🚧 **待实现** - 请提供 iOS SDK 接口文档

## 概述

本文档将指导您完成 iOS 游戏接入瑞雪 SDK 的基本步骤。

## 接入步骤

### 1. 添加依赖

#### CocoaPods

```ruby
# Podfile
# TODO: 待补充实际依赖
pod 'RuiXueSDK', '~> x.x.x'
```

#### Swift Package Manager

```swift
// Package.swift
// TODO: 待补充实际依赖
.package(url: "https://github.com/ruixue/ruixue-sdk-ios.git", from: "x.x.x")
```

### 2. SDK 初始化

#### Swift

```swift
// TODO: 待补充实际代码
import RuiXueSDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, 
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 初始化 SDK
        return true
    }
}
```

#### Objective-C

```objc
// TODO: 待补充实际代码
#import <RuiXueSDK/RuiXueSDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application 
        didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // 初始化 SDK
    return YES;
}

@end
```

### 3. 登录

```swift
// TODO: 待补充实际代码
```

### 4. 支付

```swift
// TODO: 待补充实际代码
```

## MCP 工具

| 工具名 | 描述 | 状态 |
|--------|------|------|
| `ios_agent` | iOS 接入流程指南 | 🚧 待实现 |
| `ios_add_dependency` | 依赖配置 | 🚧 待实现 |
| `ios_init` | SDK 初始化 | 🚧 待实现 |
| `ios_login` | 登录功能 | 🚧 待实现 |
| `ios_payment` | 支付功能 | 🚧 待实现 |

## 下一步

请提供 iOS SDK 接口文档，以便生成完整的接入代码。
