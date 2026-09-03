# Changelog

本文件记录 `com.ruixue.unitysdk.feedbackui` 的版本变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [1.6.17] - 2025-11-28

### Fixed

- 修复已知问题

## [1.6.16] - 2025-11-20

### Added

- 新增 `SetArea` 设置地区接口

## [1.6.15] - 2025-11-07

### Added

- 新增 `SetPasswordStrength` 设置密码强度
- 新增 `SetPwdPattern` 设置密码正则

### Changed

- Android 原生依赖更新

## [1.6.14] - 2025-10-16

### Changed

- UWA 升级至 1.4.4.0
- UWA 剔除鸿蒙与 x86 架构

## [1.6.13] - 2025-08-18

### Changed

- UWA 升级至 1.4.3.3
- iOS 登录回调调整

### Added

- 微信小游戏补全区服相关接口
- 微信小游戏 JS SDK 升级至 3.10.11
- 抖音 SDK 升级，新增 `OpenCustomerServiceConversation`
- 微信小游戏补全广点通上报接口

## [1.6.12] - 2025-05-16

### Changed

- 更新抖音 JS SDK

## [1.6.11] - 2025-05-13

### Changed

- UWA 升级至 1.4.1.3

### Removed

- 移除 UWA Open Harmony so

## [1.6.10] - 2025-04-24

### Changed

- 删除海外库 RXContactSDK 引用

### Fixed

- 修复 UWA 包描述

## [1.6.9] - 2025-03-04

### Changed

- iOS Facebook 删除 RXContactSDK 引用
- 微信小游戏版本号升级

### Added

- 微信小游戏补全缺失接口

### Fixed

- 微信小游戏多线程打包关闭

## [1.6.7] - 2025-02-17

### Added

- 添加瑞雪 SDK 微信、抖音小游戏插件开关

### Changed

- 更新抖音 JS SDK

## [1.6.6] - 2025-02-11

### Fixed

- 分享参数为空时移除（避免异常）

### Changed

- 代码优化
- UWA 版本升级至 1.3.2.4

## [1.6.5] - 2025-01-23

### Changed

- 更新抖音 JS 代码
- 优化 JS 日志输出，使用 `SetLogEnable` 开关控制

### Fixed

- 修复 LBS 库 Demo 在 Windows 平台编译报错
- 替换 Unity 即将废弃接口 `Pointer_stringify` 为 `UTF8ToString`

## [1.6.4] - 2025-01-21

### Changed

- 优化抖音 SDK 代码

## [1.6.3] - 2025-01-18

### Changed

- 平台隔离优化
- 优化抖音支付与分享

## [1.6.2] - 2025-01-17

### Added

- 抖音小额支付支持

## [1.6.1] - 2024-12-11

### Added

- 新增 `LoginOpenidExpireInvalid` 接口（iOS / Android）
- UWA 新增发送通知
- 添加 link.xml 防止 Unity 打包剔除接口

### Fixed

- 修复 iOS 编译失败问题

## [1.6.0] - 2024-11-05

### Added

- 新增 Quick 库
- 新增 `LoginOpenidExpireInvalid` 基础接口

### Changed

- 同步原生 SDK 3.6.1
- 国内外登录配置参数重构
- UWA SDK 更新
- 支付同步 native 3.6.1+

## [1.5.0] - 2024-10-26

### Added

- 新增 FeedbackUI（意见反馈 UI）独立模块

### Changed

- 微信 SDK JS 更新至 3.9.40
- UWA SDK 更新

### Fixed

- 修复版本更新接口返回解析报错（嵌套 JSON 反序列化）

## [1.0.0] - 2024-06-14

### Added

- 全平台架构搭建（Android / iOS / WebGL）
- 登录、支付、分享、数据上报、推送、排行、反馈、帮助中心等核心模块
- 海外模块：Google、Facebook、Instagram、TikTok、Snapchat、Reddit、Line、Zalo 等桥接
- Adjust、Firebase 桥接
- 微信小游戏（WebGL）、抖音小游戏（WebGL）支持
- UWA 性能模块

## [0.1.0] - 2024-03-13

### Added

- 初始版本，项目结构搭建

