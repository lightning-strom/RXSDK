# 项目结构说明

> 详细说明新的多端文档项目结构

## 📁 目录结构

```
rxsdk-doc/
├── common/                    # 跨端共享文档
│   ├── api/                   # API 契约文档（所有平台共享）
│   │   ├── README.md         # API 契约文档说明
│   │   ├── 00_overview.md    # 总览
│   │   ├── 01_error_format.md # 错误格式
│   │   ├── 10_endpoints_used_by_sdk.md  # 接口清单（自动生成）
│   │   ├── 20_passport.md    # 通行证模块
│   │   ├── 30_social.md      # 社交模块
│   │   ├── 40_share.md       # 分享模块
│   │   ├── 50_pay.md         # 支付模块
│   │   ├── 60_legal.md       # 法务模块
│   │   └── 90_refactor_plan.md  # 重构计划
│   │
│   ├── specs/                 # 技术规范
│   │   ├── README.md         # 技术规范说明
│   │   ├── error_codes.md    # 错误码规范
│   │   ├── data_structures.md  # 数据结构规范
│   │   └── naming_conventions.md  # 命名规范
│   │
│   └── guidelines/            # 开发规范
│       ├── README.md         # 开发规范说明
│       ├── coding_standards.md  # 编码规范
│       ├── security.md       # 安全规范
│       ├── performance.md    # 性能规范
│       └── testing.md        # 测试规范
│
├── android/                   # Android SDK
│   ├── README.md             # Android SDK 总览
│   ├── api/                   # Android API 文档
│   │   ├── README.md         # Android API 说明
│   │   ├── overview.md       # Android SDK 总览
│   │   ├── passport.md        # 通行证模块（Android）
│   │   ├── social.md          # 社交模块（Android）
│   │   ├── share.md           # 分享模块（Android）
│   │   ├── pay.md             # 支付模块（Android）
│   │   └── legal.md           # 法务模块（Android）
│   ├── integration/           # 集成指南
│   │   ├── getting_started.md # 快速开始
│   │   └── faq.md            # 常见问题
│   └── implementation/        # 实现细节
│       ├── threading.md       # 线程模型
│       ├── lifecycle.md       # 生命周期管理
│       └── permissions.md     # 权限处理
│
├── ios/                       # iOS SDK
│   ├── README.md             # iOS SDK 总览
│   ├── api/                   # iOS API 文档
│   ├── integration/           # 集成指南
│   └── implementation/        # 实现细节
│
├── unity/                     # Unity SDK
│   └── ...
│
└── minigame/                  # 小游戏 SDK
    └── ...
│
├── ai/                        # AI 开发相关文档和工具
│   ├── README.md             # AI 开发指南
│   ├── prompts/               # AI 提示词模板
│   │   ├── code_generation.md  # 代码生成提示词
│   │   ├── refactoring.md    # 重构提示词
│   │   ├── testing.md        # 测试生成提示词
│   │   └── documentation.md  # 文档生成提示词
│   ├── tools/                 # AI 辅助工具
│   │   ├── code_generator.py  # 代码生成器
│   │   ├── api_validator.py  # 契约校验器
│   │   └── test_generator.py  # 测试生成器
│   └── guidelines/            # AI 开发指南
│       ├── best_practices.md  # 最佳实践
│       └── workflow.md        # 工作流
│
├── tools/                     # 通用工具脚本
│   └── generate_api_docs.py  # 接口文档生成工具
│
├── docs/                      # 项目级文档
│   ├── navigation.md         # 文档导航
│   ├── migration_guide.md    # 迁移指南
│   └── project_structure.md  # 项目结构说明（本文档）
│
└── README.md                  # 项目主 README
```

## 📂 目录说明

### common/ - 跨端共享文档

**目的**：存放所有平台共享的文档，确保多端 SDK 行为一致。

#### common/api/ - API 契约文档

- **用途**：定义 SDK 与后端交互的接口契约
- **目标**：作为 AI 重构和代码生成的依据
- **原则**：以各平台 SDK 源码为单一可信来源

#### common/specs/ - 技术规范

- **用途**：统一的错误码、数据结构、命名规范等
- **原则**：所有平台必须遵循相同的规范

#### common/guidelines/ - 开发规范

- **用途**：编码规范、安全规范、性能规范等
- **原则**：规范原则一致，具体实现可适配各平台特性

### 平台特定文档（根目录）

**目的**：存放各平台 SDK 的特定文档，直接放在根目录下（如 `android/`、`ios/`）。

#### {platform}/api/ - 平台 API 文档

- **用途**：描述平台特定的 API 实现细节
- **关系**：与 `common/api/` 中的契约文档对应
- **内容**：平台特定的调用方式、实现细节、注意事项

#### {platform}/integration/ - 集成指南

- **用途**：快速开始、集成示例、常见问题

#### {platform}/implementation/ - 实现细节

- **用途**：平台特定的实现细节（线程模型、生命周期、权限等）

### ai/ - AI 开发文档

**目的**：支持使用 AI 辅助 SDK 开发、重构、测试。

#### ai/prompts/ - AI 提示词模板

- **用途**：用于代码生成、重构、测试的 AI 提示词模板

#### ai/tools/ - AI 辅助工具

- **用途**：基于契约文档生成代码、校验实现、生成测试用例

#### ai/guidelines/ - AI 开发指南

- **用途**：AI 开发最佳实践和工作流

### tools/ - 通用工具

**目的**：存放通用的工具脚本。

- `generate_api_docs.py`：从源码提取接口清单并生成文档

### docs/ - 项目级文档

**目的**：存放项目级的导航、迁移、结构说明等文档。

## 🔄 文档关系

### 契约文档 → 平台文档

```
common/api/20_passport.md (契约)
    ↓
android/api/passport.md (Android 实现)
ios/api/passport.md (iOS 实现)
unity/api/passport.md (Unity 实现)
```

### 规范文档 → 平台实现

```
common/specs/error_codes.md (规范)
    ↓
android/implementation/error_handling.md
ios/implementation/error_handling.md
```

## 📝 文档维护原则

1. **契约优先**：先更新 `common/api/` 中的契约文档
2. **平台同步**：各平台的实现文档与契约文档保持一致
3. **规范统一**：所有平台遵循 `common/specs/` 和 `common/guidelines/` 中的规范
4. **工具辅助**：使用工具脚本自动生成和校验文档

## 🔗 相关文档

- [项目 README](../README.md)
- [文档导航](./navigation.md)
- [迁移指南](./migration_guide.md)
