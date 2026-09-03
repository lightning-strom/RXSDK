# 瑞雪 SDK iOS 接入流程指南
# TODO: 待实现

name: ios_integration_guide
version: "{{.Version}}"
platform: iOS

description: |
  此模板用于指导 iOS 游戏接入瑞雪 SDK。
  待提供 iOS SDK 接口文档后实现。

steps:
  - id: dependency
    name: 添加 SDK 依赖
    description: 使用 CocoaPods 或 SPM 添加 SDK 依赖
    mcp_tool: ios_add_dependency
    status: TODO

  - id: init
    name: SDK 初始化
    description: 在 AppDelegate 中初始化 SDK
    mcp_tool: ios_init
    status: TODO

  - id: login
    name: 登录功能
    description: 集成登录功能
    mcp_tool: ios_login
    status: TODO

  - id: payment
    name: 支付功能
    description: 集成支付功能
    mcp_tool: ios_payment
    status: TODO

mcp_tools:
  - name: ios_agent
    description: iOS 接入流程指南
    status: TODO
  - name: ios_add_dependency
    description: CocoaPods/SPM 依赖配置
    status: TODO
  - name: ios_init
    description: SDK 初始化代码
    status: TODO
  - name: ios_login
    description: 登录代码
    status: TODO
  - name: ios_payment
    description: 支付代码
    status: TODO

note: |
  iOS SDK 接入功能待实现。
  请提供 iOS SDK 接口文档以便生成对应代码。
