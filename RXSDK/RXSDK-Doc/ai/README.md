# AI 开发指南

> 使用 AI 辅助 SDK 开发、重构、测试的指南和工具

## 📚 文档目录

### AI 提示词模板

- [`prompts/`](./prompts/)：用于代码生成、重构、测试的 AI 提示词模板
  - [`code_generation.md`](./prompts/code_generation.md)：代码生成提示词
  - [`refactoring.md`](./prompts/refactoring.md)：重构提示词
  - [`testing.md`](./prompts/testing.md)：测试用例生成提示词
  - [`documentation.md`](./prompts/documentation.md)：文档生成提示词

### AI 工具

- [`tools/`](./tools/)：AI 辅助工具脚本
  - [`code_generator.py`](./tools/code_generator.py)：基于契约生成多端代码
  - [`api_validator.py`](./tools/api_validator.py)：校验实现与契约的一致性
  - [`test_generator.py`](./tools/test_generator.py)：基于契约生成测试用例

### AI 开发指南

- [`guidelines/`](./guidelines/)：AI 开发最佳实践
  - [`best_practices.md`](./guidelines/best_practices.md)：AI 开发最佳实践
  - [`workflow.md`](./guidelines/workflow.md)：AI 开发工作流

## 🎯 使用场景

### 1. 代码生成

基于 API 契约文档，使用 AI 生成多端 SDK 代码：

```bash
python3 ai/tools/code_generator.py \
  --module passport \
  --platform ios \
  --contract common/api/20_passport.md
```

### 2. 代码重构

使用 AI 辅助重构，确保不破坏接口兼容性：

```bash
python3 ai/tools/refactor_assistant.py \
  --platform android \
  --module passport \
  --contract common/api/20_passport.md
```

### 3. 测试生成

基于契约自动生成测试用例：

```bash
python3 ai/tools/test_generator.py \
  --module passport \
  --platform android \
  --contract common/api/20_passport.md
```

### 4. 文档生成

基于代码和契约生成文档：

```bash
python3 ai/tools/doc_generator.py \
  --platform ios \
  --output ios/api/
```

## 🔗 相关文档

- [跨端 API 契约文档](../common/api/README.md)
- [技术规范](../common/specs/README.md)
