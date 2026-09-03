package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.ACCENT;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.dialog.LanguageSelectDialog;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;

/**
 * 配置相关 API 示例
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li>{@link #switchLanguage()} - 切换语言</li>
 *   <li>{@link #getCurrentLanguage()} - 获取当前语言</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.RuiXueSdk#getSdkVersion() SDK 版本
 * @see com.ruixue.RuiXueSdk#getCpId() CPID
 * @see com.ruixue.RuiXueSdk#setLanguage 设置语言
 */
public class ConfigDemo extends DemoCategory {

    public ConfigDemo(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        super(activity, callback);
    }

    @Override
    public String getName() {
        return "语言";
    }

    @Override
    public String getEmoji() {
        return "🌐";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("switch_lang", "切换语言", ACCENT, this::switchLanguage));
        group.addButton(button("current_lang", "当前语言", ACCENT, this::getCurrentLanguage));
    }

    // ==================== API 示例方法 ====================

    /** 切换语言 */
    public void switchLanguage() {
        LanguageSelectDialog.show(activity, code -> {
            RuiXueSdk.setLanguage(activity, code);
            showResult("语言已切换: " + code);
            showToast("语言已切换: " + code);
        });
    }

    /** 获取当前语言 */
    public void getCurrentLanguage() {
        String lang = RuiXueSdk.getLanguage();
        showResult("当前语言: " + lang);
    }
}
