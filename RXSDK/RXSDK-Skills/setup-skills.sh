#!/bin/bash
# 将 RXSDK Skills 暴露给 Cursor、Codex 和 Claude Code。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(dirname "$SCRIPT_DIR")"
SKILLS_SOURCE="$SCRIPT_DIR/.cursor/skills"
SKILLS_RELATIVE_TARGET="../RXSDK-Skills/.cursor/skills"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

if [ ! -d "$SKILLS_SOURCE" ]; then
    echo "❌ Skills 源目录不存在: $SKILLS_SOURCE" >&2
    exit 1
fi

SKILLS_SOURCE_REAL="$(cd "$SKILLS_SOURCE" && pwd -P)"

ensure_skills_link() {
    local client_name="$1"
    local parent_dir="$2"
    local link_path="$parent_dir/skills"

    mkdir -p "$parent_dir"

    if [ -L "$link_path" ] && [ -d "$link_path" ]; then
        local actual_target
        actual_target="$(cd "$link_path" && pwd -P)"
        if [ "$actual_target" = "$SKILLS_SOURCE_REAL" ]; then
            echo "✅ $client_name: $link_path"
            return
        fi
    fi

    if [ -e "$link_path" ] || [ -L "$link_path" ]; then
        local backup_path="${link_path}.backup.${TIMESTAMP}"
        echo "⚠️  $client_name: 备份现有路径到 $backup_path"
        mv "$link_path" "$backup_path"
    fi

    ln -s "$SKILLS_RELATIVE_TARGET" "$link_path"
    echo "✅ $client_name: 已创建 $link_path"
}

check_rules() {
    local agents_file="$WORKSPACE_ROOT/AGENTS.md"
    local claude_file="$WORKSPACE_ROOT/CLAUDE.md"
    local cursor_rules="$WORKSPACE_ROOT/.cursor/rules"

    echo ""
    echo "Rules 检查:"

    if [ -d "$cursor_rules" ]; then
        echo "✅ Cursor: $cursor_rules"
    else
        echo "⚠️  Cursor rules 不存在；如项目需要 Cursor 专用规则，请创建 .cursor/rules/*.mdc"
    fi

    if [ -s "$agents_file" ]; then
        echo "✅ Codex/公共规则: $agents_file"
    else
        echo "⚠️  AGENTS.md 不存在或为空；脚本不会自动生成项目规则"
    fi

    if [ ! -e "$claude_file" ]; then
        if [ -s "$agents_file" ]; then
            printf '@AGENTS.md\n' > "$claude_file"
            echo "✅ Claude Code: 已创建 CLAUDE.md 并引用 AGENTS.md"
        else
            echo "⚠️  Claude Code: 未创建 CLAUDE.md，因为 AGENTS.md 不存在"
        fi
    elif grep -qxF '@AGENTS.md' "$claude_file"; then
        echo "✅ Claude Code: CLAUDE.md 已引用 AGENTS.md"
    else
        echo "⚠️  CLAUDE.md 未包含独立的 @AGENTS.md 引用；为避免覆盖现有规则，请手动处理"
    fi
}

echo "🔧 RXSDK Agent Skills 设置"
echo "========================="
echo "工作区: $WORKSPACE_ROOT"
echo "Skills 源: $SKILLS_SOURCE"
echo ""

ensure_skills_link "Cursor" "$WORKSPACE_ROOT/.cursor"
ensure_skills_link "Codex" "$WORKSPACE_ROOT/.agents"
ensure_skills_link "Claude Code" "$WORKSPACE_ROOT/.claude"
check_rules

echo ""
echo "当前可用的 Skills:"
for skill_path in "$SKILLS_SOURCE"/*; do
    if [ -d "$skill_path" ] && [ -f "$skill_path/SKILL.md" ]; then
        echo "  - $(basename "$skill_path")"
    fi
done

echo ""
echo "🎉 设置完成！请重新启动对应客户端以刷新 Skills 和 Rules。"
