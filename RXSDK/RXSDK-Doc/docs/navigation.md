# 文档导航

> RXSDK 多端文档项目的完整导航

## 🗺️ 文档地图

```
rxsdk-doc/
│
├── 📋 项目级文档 (docs/)
│   ├── navigation.md          # 文档导航（本文件）
│   ├── sdk_inventory.md       # 渠道 SDK 与工具 SDK 清单
│   ├── project_structure.md   # 项目结构说明
│   └── migration_guide.md     # 迁移指南
│
├── 📘 跨端共享文档 (common/)
│   ├── api/                    # API 契约文档（所有平台共享）
│   │   ├── 00_overview.md     # 总览
│   │   ├── 01_error_format.md # 错误格式
│   │   ├── 10_endpoints_used_by_sdk.md  # 接口清单
│   │   ├── 20_passport.md     # 通行证
│   │   ├── 30_social.md        # 社交
│   │   ├── 40_share.md         # 分享
│   │   ├── 50_pay.md           # 支付
│   │   ├── 60_legal.md         # 法务
│   │   └── 90_refactor_plan.md # 重构计划
│   │
│   ├── specs/                  # 技术规范
│   │   ├── error_codes.md      # 错误码规范
│   │   ├── data_structures.md  # 数据结构规范
│   │   └── naming_conventions.md  # 命名规范
│   │
│   └── guidelines/             # 开发规范
│       ├── coding_standards.md # 编码规范
│       ├── security.md         # 安全规范
│       └── performance.md      # 性能规范
│
├── 📱 平台特定文档（根目录）
│   ├── android/                # Android SDK
│   │   ├── api/                # Android API 文档
│   │   ├── integration/        # 集成指南
│   │   └── implementation/     # 实现细节
│   │
│   ├── ios/                    # iOS SDK
│   │   ├── api/                # iOS API 文档
│   │   ├── integration/        # 集成指南
│   │   └── implementation/     # 实现细节
│   │
│   ├── unity/                  # Unity SDK
│   │   └── ...
│   │
│   └── minigame/               # 小游戏 SDK
│       └── ...
│
├── 🤖 AI 开发文档 (ai/)
│   ├── prompts/                # AI 提示词模板
│   │   ├── code_generation.md  # 代码生成
│   │   ├── refactoring.md      # 重构
│   │   └── testing.md          # 测试生成
│   │
│   ├── tools/                   # AI 工具
│   │   ├── code_generator.py   # 代码生成器
│   │   └── api_validator.py    # 契约校验器
│   │
│   └── guidelines/             # AI 开发指南
│       └── best_practices.md   # 最佳实践
│
└── 🛠️ 工具 (tools/)
    └── generate_api_docs.py    # 接口文档生成工具
```

## 🚀 快速导航

### 新手入门

1. [项目 README](../README.md) - 了解项目结构
2. [跨端 API 契约文档](../common/api/README.md) - 了解接口契约
3. [平台快速开始](../android/README.md) - 选择你的平台

### 开发人员

1. **API 开发**
   - [跨端 API 契约](../common/api/README.md)
   - [平台 API 文档](../android/api/README.md)

2. **规范参考**
   - [技术规范](../common/specs/README.md)
   - [开发规范](../common/guidelines/README.md)

3. **AI 辅助开发**
   - [AI 开发指南](../ai/README.md)
   - [代码生成提示词](../ai/prompts/code_generation.md)

### 测试人员

1. [API 契约文档](../common/api/README.md) - 了解接口行为
2. [错误码规范](../common/specs/error_codes.md) - 了解错误码定义
3. [测试规范](../common/guidelines/testing.md) - 了解测试要求

## 📖 文档阅读顺序

### 场景 1：开发新功能

1. 查看 [跨端 API 契约文档](../common/api/README.md) 了解接口定义
2. 查看 [技术规范](../common/specs/README.md) 了解规范要求
3. 查看 [平台 API 文档](../android/api/README.md) 了解实现细节
4. 使用 [AI 工具](../ai/tools/) 生成代码

### 场景 2：重构现有代码

1. 查看 [重构计划](../common/api/90_refactor_plan.md)
2. 查看 [API 契约文档](../common/api/README.md) 确保不破坏兼容性
3. 使用 [AI 重构工具](../ai/tools/) 辅助重构

### 场景 3：跨端开发

1. 查看 [跨端 API 契约文档](../common/api/README.md) 确保接口一致
2. 查看各平台的 [API 文档](../android/README.md) 了解平台差异
3. 使用 [AI 多端代码生成](../ai/prompts/code_generation.md) 生成多端代码

## 🔍 文档搜索

### 按功能模块

- **通行证**：[契约文档](../common/api/20_passport.md) | [Android](../android/api/passport.md) | [iOS](../ios/api/passport.md)
- **社交**：[契约文档](../common/api/30_social.md) | [Android](../android/api/social.md) | [iOS](../ios/api/social.md)
- **分享**：[契约文档](../common/api/40_share.md) | [Android](../android/api/share.md) | [iOS](../ios/api/share.md)
- **支付**：[契约文档](../common/api/50_pay.md) | [Android](../android/api/pay.md) | [iOS](../ios/api/pay.md)

### 按平台

- **Android**：[总览](../android/README.md) | [API 文档](../android/api/README.md)
- **iOS**：[总览](../ios/README.md) | [API 文档](../ios/api/README.md)

### 按主题

- **渠道与工具 SDK**：[渠道 SDK 与工具 SDK 清单](./sdk_inventory.md)
- **API 契约**：[总览](../common/api/README.md) | [错误格式](../common/api/01_error_format.md)
- **技术规范**：[错误码](../common/specs/error_codes.md) | [数据结构](../common/specs/data_structures.md)
- **开发规范**：[编码规范](../common/guidelines/coding_standards.md) | [安全规范](../common/guidelines/security.md)
- **AI 开发**：[指南](../ai/README.md) | [代码生成](../ai/prompts/code_generation.md)
