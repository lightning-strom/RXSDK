# 文档项目迁移指南

> 从旧的项目结构迁移到新的多端文档项目结构

## 📋 迁移概述

### 旧结构

```
rxsdk-doc/
└── Android/
    ├── docs/
    │   └── api/          # API 文档
    └── tools/            # 工具脚本
```

### 新结构

```
rxsdk-doc/
├── common/               # 跨端共享文档
│   ├── api/             # API 契约文档（从 Android/docs/api/ 迁移）
│   ├── specs/           # 技术规范
│   └── guidelines/      # 开发规范
├── android/             # Android SDK 文档
├── ios/                 # iOS SDK 文档
└── ...
├── ai/                   # AI 开发文档
└── tools/                # 通用工具（从 Android/tools/ 迁移）
```

## 🔄 迁移步骤

### 1. 文档迁移

#### 跨端共享文档（已迁移）

以下文档已从 `Android/docs/api/` 迁移到 `common/api/`：

- ✅ `00_overview.md` - 总览
- ✅ `01_error_format.md` - 错误格式
- ✅ `10_endpoints_used_by_sdk.md` - 接口清单
- ✅ `20_passport.md` - 通行证
- ✅ `30_social.md` - 社交
- ✅ `40_share.md` - 分享
- ✅ `50_pay.md` - 支付
- ✅ `60_legal.md` - 法务
- ✅ `90_refactor_plan.md` - 重构计划
- ✅ `README.md` - API 文档说明

#### 工具脚本迁移（已迁移）

- ✅ `generate_api_docs.py` - 已迁移到 `tools/`

### 2. 文档更新

#### 更新文档中的路径引用

需要更新以下文档中的路径引用：

1. **API 契约文档**：更新工具使用说明中的路径
2. **README 文档**：更新文档链接

#### 创建平台特定文档

为 Android 平台创建特定文档：

```bash
# 创建 Android API 文档目录
mkdir -p android/api

# 创建平台特定的 API 文档（基于契约文档）
# 这些文档描述 Android 特定的实现细节
```

### 3. 工具脚本更新

#### 更新 generate_api_docs.py

工具脚本需要支持多平台：

```bash
# 旧用法
python3 tools/generate_api_docs.py \
  --rx_api_path rxsdk_base/src/main/java/com/ruixue/openapi/RXApiPath.java \
  --out docs/api/10_endpoints_used_by_sdk.md

# 新用法（支持多平台）
python3 tools/generate_api_docs.py \
  --platform android \
  --rx_api_path rxsdk_base/src/main/java/com/ruixue/openapi/RXApiPath.java \
  --out common/api/10_endpoints_used_by_sdk.md

python3 tools/generate_api_docs.py \
  --platform ios \
  --api_path RXSDK/Sources/RXSDK/API/RXApiPath.swift \
  --out common/api/10_endpoints_used_by_sdk.md
```

## ✅ 迁移检查清单

### 文档完整性

- [x] 跨端 API 契约文档已迁移
- [x] 工具脚本已迁移
- [ ] 更新文档中的路径引用
- [ ] 创建平台特定文档
- [ ] 创建 iOS 平台文档模板
- [ ] 创建 Unity 平台文档模板
- [ ] 创建小游戏平台文档模板

### 工具脚本

- [ ] 更新 `generate_api_docs.py` 支持多平台
- [ ] 创建 AI 辅助工具脚本
- [ ] 创建文档校验工具

### 文档质量

- [ ] 检查所有文档链接是否有效
- [ ] 检查文档格式是否统一
- [ ] 补充缺失的文档内容

## 🚀 后续工作

### 短期（1-2 周）

1. 完善平台特定文档
2. 更新工具脚本支持多平台
3. 创建 AI 开发工具

### 中期（1 个月）

1. 补充 iOS 平台文档
2. 补充 Unity 平台文档
3. 补充小游戏平台文档
4. 完善 AI 开发工具

### 长期（持续）

1. 持续更新 API 契约文档
2. 完善技术规范和开发规范
3. 优化 AI 开发工具和流程

## 📝 注意事项

1. **向后兼容**：迁移过程中保持文档内容的完整性
2. **路径更新**：更新所有文档中的路径引用
3. **平台同步**：确保各平台的文档与契约文档同步
4. **工具更新**：更新工具脚本以支持新的项目结构

## 🔗 相关文档

- [项目 README](../README.md)
- [文档导航](./navigation.md)
