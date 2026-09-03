package com.ruixue.demo.config;

import android.view.View;

import java.util.ArrayList;
import java.util.List;

/**
 * 测试按钮配置
 * <p>
 * 通过配置动态添加测试按钮，支持分组管理
 *
 * @since 2.0
 */
public class TestButtonConfig {

    // ==================== 样式常量（简化调用）====================
    
    /** 默认样式 */
    public static final int NORMAL = 0;
    /** 主要样式（蓝色） */
    public static final int PRIMARY = 1;
    /** 强调样式（绿色） */
    public static final int ACCENT = 2;
    /** 危险样式（红色） */
    public static final int DANGER = 3;

    /**
     * 按钮样式枚举
     */
    public enum ButtonStyle {
        DEFAULT,  // 默认灰色
        PRIMARY,  // 主要蓝色
        ACCENT,   // 强调绿色
        DANGER;   // 危险红色

        public static ButtonStyle fromInt(int style) {
            switch (style) {
                case 1: return PRIMARY;
                case 2: return ACCENT;
                case 3: return DANGER;
                default: return DEFAULT;
            }
        }
    }

    /**
     * 按钮项
     */
    public static class ButtonItem {
        public final String id;
        public final String text;
        public final String group;
        public final ButtonStyle style;
        public final View.OnClickListener clickListener;

        public ButtonItem(String id, String text, String group, ButtonStyle style, View.OnClickListener clickListener) {
            this.id = id;
            this.text = text;
            this.group = group;
            this.style = style;
            this.clickListener = clickListener;
        }

        /** 创建默认样式按钮 */
        public static ButtonItem create(String id, String text, View.OnClickListener listener) {
            return new ButtonItem(id, text, "默认", ButtonStyle.DEFAULT, listener);
        }

        /** 创建指定分组按钮 */
        public static ButtonItem create(String id, String text, String group, View.OnClickListener listener) {
            return new ButtonItem(id, text, group, ButtonStyle.DEFAULT, listener);
        }

        /** 创建指定样式按钮 */
        public static ButtonItem create(String id, String text, String group, ButtonStyle style, View.OnClickListener listener) {
            return new ButtonItem(id, text, group, style, listener);
        }

        /** 创建指定样式按钮（int 版本，更简洁）*/
        public static ButtonItem create(String id, String text, String group, int style, View.OnClickListener listener) {
            return new ButtonItem(id, text, group, ButtonStyle.fromInt(style), listener);
        }
    }

    /**
     * 按钮分组
     */
    public static class ButtonGroup {
        public final String name;
        public final String emoji;
        public final List<ButtonItem> buttons;

        public ButtonGroup(String name, String emoji) {
            this.name = name;
            this.emoji = emoji;
            this.buttons = new ArrayList<>();
        }

        public ButtonGroup addButton(ButtonItem item) {
            buttons.add(item);
            return this;
        }

        /** 快速添加默认样式按钮 */
        public ButtonGroup add(String id, String text, View.OnClickListener listener) {
            return addButton(new ButtonItem(id, text, name, ButtonStyle.DEFAULT, listener));
        }

        /** 快速添加指定样式按钮 */
        public ButtonGroup add(String id, String text, int style, View.OnClickListener listener) {
            return addButton(new ButtonItem(id, text, name, ButtonStyle.fromInt(style), listener));
        }
    }

    /**
     * 配置构建器
     */
    public static class Builder {
        private final List<ButtonGroup> groups = new ArrayList<>();
        private ButtonGroup currentGroup;

        /** 开始新分组 */
        public Builder group(String name, String emoji) {
            currentGroup = new ButtonGroup(name, emoji);
            groups.add(currentGroup);
            return this;
        }

        /** 添加默认样式按钮 */
        public Builder button(String id, String text, View.OnClickListener listener) {
            return button(id, text, NORMAL, listener);
        }

        /** 添加指定样式按钮（使用 int 常量：NORMAL/PRIMARY/ACCENT）*/
        public Builder button(String id, String text, int style, View.OnClickListener listener) {
            if (currentGroup == null) {
                group("默认", "🔧");
            }
            currentGroup.addButton(new ButtonItem(id, text, currentGroup.name, ButtonStyle.fromInt(style), listener));
            return this;
        }

        /** 添加指定样式按钮（使用枚举）*/
        public Builder button(String id, String text, ButtonStyle style, View.OnClickListener listener) {
            if (currentGroup == null) {
                group("默认", "🔧");
            }
            currentGroup.addButton(new ButtonItem(id, text, currentGroup.name, style, listener));
            return this;
        }

        public List<ButtonGroup> build() {
            return groups;
        }
    }

    /** 创建配置构建器 */
    public static Builder builder() {
        return new Builder();
    }
}
