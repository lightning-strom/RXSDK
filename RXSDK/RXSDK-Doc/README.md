# RXSDK 多端文档项目

> 用于 Android、iOS、Unity、小游戏等多端 SDK AI 开发的统一文档项目

## 📚 项目结构

```
rxsdk-doc/
├── common/                    # 跨端共享文档（API 契约、规范等）
│   ├── api/                   # API 契约文档（用于重构和 AI 开发）
│   ├── specs/                 # 技术规范（错误码、数据结构等）
│   └── guidelines/            # 开发规范和最佳实践
├── android/                   # Android SDK 文档
├── ios/                       # iOS SDK 文档
├── unity/                     # Unity SDK 文档
└── minigame/                  # 小游戏 SDK 文档
├── ai/                        # AI 开发相关文档和工具
│   ├── prompts/               # AI 提示词模板
│   ├── tools/                 # AI 辅助工具脚本
│   └── guidelines/            # AI 开发指南
├── tools/                     # 通用工具脚本
└── docs/                      # 项目级文档（导航、索引等）
```

## 🎯 文档分类

### 1. 跨端共享文档（`common/`）

**API 契约文档**：定义 SDK 与后端交互的接口契约，作为 AI 重构和代码生成的依据。

- **目标**：确保多端 SDK 行为一致，避免重构时破坏兼容性
- **来源**：以各平台 SDK 源码为单一可信来源（Single Source of Truth）
- **用途**：
  - AI 代码生成和重构
  - 跨端兼容性校验
  - 接口测试用例生成

**技术规范**：统一的错误码、数据结构、命名规范等。

**开发规范**：编码规范、安全规范、性能规范等。

### 2. 平台特定文档（根目录）

各平台 SDK 的：
- 快速开始指南
- API 参考文档
- 平台特定实现细节
- 集成示例
- 常见问题

### 3. AI 开发文档（`ai/`）

- AI 提示词模板（用于代码生成、重构、测试等）
- AI 辅助工具（文档生成、代码分析等）
- AI 开发最佳实践

## 🚀 快速开始

### 查看 API 契约文档

```bash
# 跨端 API 契约（所有平台共享）
cat common/api/README.md

# 平台特定 API 实现
cat android/api/README.md
cat ios/api/README.md
```

### 使用 AI 工具

```bash
# 生成 API 文档
python3 tools/generate_api_docs.py --platform android --out common/api/

# AI 代码生成（示例）
python3 ai/tools/code_generator.py --module passport --platform ios
```

## 📖 文档导航

- [跨端 API 契约文档](./common/api/README.md)
- [技术规范](./common/specs/README.md)
- [开发规范](./common/guidelines/README.md)
- [Android SDK 文档](./android/README.md)
- [iOS SDK 文档](./ios/README.md)
- [AI 开发指南](./ai/README.md)

## 🔄 文档更新流程

1. **API 契约更新**：修改 `common/api/` 下的文档（需多端同步）
2. **平台实现更新**：修改 `{platform}/` 下的文档（如 `android/`、`ios/`）
3. **自动生成**：使用工具脚本从源码提取接口清单
4. **AI 辅助**：使用 AI 工具生成文档、代码、测试用例

## 📝 贡献指南

1. 遵循项目文档结构规范
2. 跨端共享内容放在 `common/`，平台特定内容放在根目录（如 `android/`、`ios/`）
3. 所有文档使用 Markdown 格式
4. 代码示例需包含多端实现（如适用）

## 📄 许可证

[待补充]
