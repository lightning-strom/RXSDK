# 跨端 API 契约文档

> **目标**：定义 SDK 与后端交互的接口契约，作为 AI 重构和代码生成的依据，确保多端 SDK 行为一致。

## 📋 文档说明

### 文档来源

- **源码提取（强一致）**：以各平台 SDK 源码中的 API 路径定义、接口调用代码为准
  - Android: `rxsdk_base` 模块中的 `RXApiPath` / `RXSdkApi` / `RXApiHelper` / `PassportManager` 等
  - iOS: 对应的 Swift/Objective-C 接口定义
  - Unity: C# 接口定义
  - 小游戏: JavaScript/TypeScript 接口定义
- **产品文档（参考）**：瑞雪云文档页面仅作为业务含义参考

### 文档用途

1. **AI 代码生成**：作为 AI 生成多端 SDK 代码的契约依据
2. **重构校验**：确保重构过程中不破坏接口兼容性
3. **跨端一致性**：保证 Android、iOS、Unity、小游戏等平台行为一致
4. **测试用例生成**：基于契约自动生成接口测试用例

## 📚 文档目录

### 基础文档

- [`00_overview.md`](./00_overview.md)：总览（鉴权、回调线程、trace_id、restfulData）
- [`01_error_format.md`](./01_error_format.md)：统一错误结构与错误码约定

### 接口清单

- [`10_endpoints_used_by_sdk.md`](./10_endpoints_used_by_sdk.md)：SDK 使用到的后端接口清单（自动生成）

### 功能模块文档

- [`20_passport.md`](./20_passport.md)：通行证（注册/登录/验证码/用户信息等）
- [`30_social.md`](./30_social.md)：社交（LBS/关系/排行）
- [`40_share.md`](./40_share.md)：分享/调度
- [`50_pay.md`](./50_pay.md)：支付/兑换
- [`60_legal.md`](./60_legal.md)：法务相关

### AI 重构指南

- [`90_refactor_plan.md`](./90_refactor_plan.md)：基于契约的 AI 重构建议与落地步骤

## 🔄 如何更新

### 自动生成接口清单

从各平台源码提取接口清单：

```bash
# Android
python3 tools/generate_api_docs.py \
  --platform android \
  --rx_api_path rxsdk_base/src/main/java/com/ruixue/openapi/RXApiPath.java \
  --out common/api/10_endpoints_used_by_sdk.md

# iOS (待实现)
python3 tools/generate_api_docs.py \
  --platform ios \
  --api_path RXSDK/Sources/RXSDK/API/RXApiPath.swift \
  --out common/api/10_endpoints_used_by_sdk.md
```

### 手动更新

1. **接口变更**：修改对应的功能模块文档（`20_passport.md` 等）
2. **错误码变更**：更新 `01_error_format.md`
3. **通用行为变更**：更新 `00_overview.md`
4. **多端同步**：确保所有平台的实现与契约文档一致

## ✅ 契约校验原则

1. **向后兼容**：新增接口不破坏现有接口行为
2. **跨端一致**：所有平台的接口行为必须一致
3. **错误处理**：错误码和错误信息格式统一
4. **参数校验**：入参约束、返回值格式明确
5. **线程安全**：回调线程约定明确

## 🔗 相关文档

- [技术规范](../specs/README.md)：错误码、数据结构等规范
- [开发规范](../guidelines/README.md)：编码规范、安全规范等
- [Android 平台文档](../../android/README.md)
- [iOS 平台文档](../../ios/README.md)
