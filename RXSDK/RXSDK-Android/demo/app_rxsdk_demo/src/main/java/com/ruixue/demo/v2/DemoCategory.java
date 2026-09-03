package com.ruixue.demo.v2;

import static com.ruixue.demo.config.TestButtonConfig.NORMAL;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.demo.config.TestButtonConfig;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;

/**
 * Demo V2 分类基类
 * <p>
 * 每个分类继承此类，实现具体的 API 示例
 * <p>
 * 按钮样式常量（可直接使用）：
 * <ul>
 *   <li>{@link TestButtonConfig#NORMAL} - 默认灰色</li>
 *   <li>{@link TestButtonConfig#PRIMARY} - 主要蓝色</li>
 *   <li>{@link TestButtonConfig#ACCENT} - 强调绿色</li>
 *   <li>{@link TestButtonConfig#DANGER} - 危险红色</li>
 * </ul>
 *
 * @since 2.0
 */
public abstract class DemoCategory {

    protected final Activity activity;
    protected final DemoManager.ResultCallback callback;

    public DemoCategory(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        this.activity = activity;
        this.callback = callback;
    }

    /** 获取分类名称 */
    public abstract String getName();

    /** 获取分类图标 */
    public abstract String getEmoji();

    /** 注册按钮 */
    protected abstract void registerButtons(ButtonGroup group);

    /** 获取按钮分组 */
    public ButtonGroup getButtonGroup() {
        ButtonGroup group = new ButtonGroup(getName(), getEmoji());
        registerButtons(group);
        return group;
    }

    // ==================== 辅助方法 ====================

    /** 显示结果 */
    protected void showResult(String message) {
        callback.onResult(message);
    }

    /** 显示 Toast */
    protected void showToast(String message) {
        callback.onToast(message);
    }

    // ==================== 按钮创建（简化 API）====================

    /** 创建默认样式按钮 */
    protected TestButtonConfig.ButtonItem button(String id, String text, Runnable action) {
        return TestButtonConfig.ButtonItem.create(id, text, getName(), NORMAL, v -> action.run());
    }

    /** 创建指定样式按钮（使用 NORMAL/PRIMARY/ACCENT/DANGER）*/
    protected TestButtonConfig.ButtonItem button(String id, String text, int style, Runnable action) {
        return TestButtonConfig.ButtonItem.create(id, text, getName(), style, v -> action.run());
    }
}
