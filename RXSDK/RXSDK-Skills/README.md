# RXSDK Skills

RXSDK 的 Agent Skills 集合，可供 Cursor、Codex 和 Claude Code 共用。

## 快速开始

Clone 仓库后，运行设置脚本：

```bash
cd RXSDK-Skills
./setup-skills.sh
```

脚本会将同一份 Skills 链接到：

```text
RXSDK/.cursor/skills   # Cursor
RXSDK/.agents/skills   # Codex
RXSDK/.claude/skills   # Claude Code
```

Rules 与 Skills 的完整映射、冲突处理和验证方式见 [CROSS-AGENT-SYNC.md](CROSS-AGENT-SYNC.md)。

## 可用 Skills

- `android-module-create`
- `channel-prd-create`
- `code-gen-spec`
- `harmony-har-sync`
- `harmony-sdk-release`
- `ios-module-create`
- `jssdk-channel-release`
- `mcp-publish-ci`
- `minigame-module-create`
- `publish-upm-version`
- `unity-module-create`
- `uwa-unity-sdk-update`
- `wsdoc-build-release`

## 添加新 Skill

1. 在 `.cursor/skills/` 下创建新目录
2. 添加 `SKILL.md` 文件（必须包含 YAML frontmatter）
3. 提交并推送到 Git

### SKILL.md 模板

```markdown
---
name: your-skill-name
description: 描述这个 skill 做什么，以及何时触发。
---

# Skill 标题

## 内容
...
```

## 团队协作

- `RXSDK-Skills` 是独立 Git 仓库。
- Skills 只在 `.cursor/skills/` 中维护，其他客户端通过符号链接复用。
- 修改后提交并推送，团队成员 pull 即可同步。
- 链接通常只需设置一次；脚本可重复执行并会修复错误链接。
