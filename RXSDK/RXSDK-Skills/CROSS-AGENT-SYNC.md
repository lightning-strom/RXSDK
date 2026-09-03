# Cursor、Codex 与 Claude Code 同步说明

本文说明 RXSDK 项目如何让三种客户端共享 Skills，并保持项目 Rules 一致。

## 文件映射

### Skills

`RXSDK-Skills/.cursor/skills/` 是唯一内容源。`setup-skills.sh` 在 RXSDK 根目录创建以下链接：

```text
RXSDK/
├── .cursor/skills  -> ../RXSDK-Skills/.cursor/skills
├── .agents/skills  -> ../RXSDK-Skills/.cursor/skills
└── .claude/skills  -> ../RXSDK-Skills/.cursor/skills
```

各客户端的发现路径：

- Cursor：`.cursor/skills/`，同时也兼容 `.agents/skills/` 和 `.claude/skills/`
- Codex：`.agents/skills/`
- Claude Code：`.claude/skills/`

每个 Skill 必须使用 `<skill-name>/SKILL.md` 结构。为了跨客户端兼容，YAML frontmatter 默认只使用：

```yaml
---
name: skill-name
description: 说明 Skill 做什么，以及何时使用。
---
```

Claude Code 的 `allowed-tools`、Cursor 的 `disable-model-invocation` 等专用字段不能作为跨客户端行为保证。

### Rules

三种客户端的 Rules 格式不同，不能把 `.cursor/rules/*.mdc` 直接链接给 Codex 或 Claude Code：

```text
RXSDK/
├── .cursor/rules/*.mdc   # Cursor 专用，可包含 globs、alwaysApply
├── AGENTS.md             # Codex 项目规则，也是公共规则正文
└── CLAUDE.md             # Claude Code 入口，内容包含 @AGENTS.md
```

处理原则：

1. 通用项目约束写入 `AGENTS.md`。
2. Claude Code 通过 `CLAUDE.md` 中的 `@AGENTS.md` 复用通用约束。
3. Cursor 路径匹配、`alwaysApply` 等专用能力继续放在 `.cursor/rules/*.mdc`。
4. 修改通用规则时，同时检查 Cursor 专用规则是否需要保持语义一致。
5. 脚本只检查 Rules 入口，不自动覆盖现有项目规则，避免丢失人工配置。

## 使用同步脚本

目录需保持为：

```text
RXSDK/
└── RXSDK-Skills/
    └── setup-skills.sh
```

执行：

```bash
cd RXSDK-Skills
./setup-skills.sh
```

脚本会：

1. 校验 Skills 源目录。
2. 为 Cursor、Codex、Claude Code 创建或校验 Skills 链接。
3. 对错误链接、真实目录或文件先创建时间戳备份，再建立链接。
4. 检查 `.cursor/rules` 和 `AGENTS.md`。
5. `CLAUDE.md` 不存在且 `AGENTS.md` 有效时，自动创建 `@AGENTS.md` 引用。
6. 已有 `CLAUDE.md` 但未引用 `AGENTS.md` 时仅提示，不自动覆盖。

脚本可重复执行；已经指向同一 Skills 源的链接会直接跳过。

## 验证

执行脚本后检查：

```bash
readlink .cursor/skills
readlink .agents/skills
readlink .claude/skills
```

然后重新启动对应客户端：

- Cursor：确认项目 Skills 可被自动发现或通过 `/` 调用。
- Codex：确认 Skills 可见，并检查启动上下文包含 `AGENTS.md`。
- Claude Code：使用 `/context` 检查 `CLAUDE.md` / `AGENTS.md`，并确认 Skills 可见。

## 团队维护

- Skill 内容只修改 `RXSDK-Skills/.cursor/skills/`，不要在链接目标中维护副本。
- 新增 Skill 后重新运行脚本不是必需的；目录链接会自动包含新内容。
- 更新 Rules 时以 `AGENTS.md` 的通用语义为基准，再维护 Cursor 专用 `.mdc`。
- `RXSDK-Skills` 是独立 Git 仓库；提交 Skill、文档和脚本时应在该仓库中操作。
