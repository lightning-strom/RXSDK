package com.ruixue.demo.dialog;

import android.app.AlertDialog;
import android.content.Context;

import androidx.annotation.NonNull;

/**
 * 语言选择对话框
 * <p>
 * 提供多语言切换的单选列表弹窗
 * @since 2.0
 */
public class LanguageSelectDialog {

    /**
     * 语言项
     */
    public static class LanguageItem {
        public final String name;
        public final String code;

        public LanguageItem(String name, String code) {
            this.name = name;
            this.code = code;
        }
    }

    /**
     * 回调接口
     */
    public interface OnLanguageSelectedListener {
        void onSelected(String languageCode);
    }

    /**
     * 预定义的语言列表
     */
    public static final LanguageItem[] LANGUAGES = {

            new LanguageItem("🇨🇳 简体中文", "zh"),
            new LanguageItem("🇺🇸 英语", "en"),
            new LanguageItem("🇯🇵 日语", "ja"),
            new LanguageItem("🇹🇼 繁体中文", "tc"),
            new LanguageItem("🇵🇭 菲律宾语", "tl"),
            new LanguageItem("🇹🇭 泰语", "th"),
            new LanguageItem("🇻🇳 越南语", "vi"),
            new LanguageItem("🇮🇩 印度尼西亚语", "id"),
            new LanguageItem("🇸🇦 阿拉伯语", "ar")
    };

    /**
     * 显示语言选择对话框
     * @param context     上下文
     * @param currentCode 当前语言代码
     * @param listener    选择回调
     */
    public static void show(@NonNull Context context,
                            String currentCode,
                            @NonNull OnLanguageSelectedListener listener) {

        String[] names = new String[LANGUAGES.length];
        int selectedIndex = 0;

        for (int i = 0; i < LANGUAGES.length; i++) {
            names[i] = LANGUAGES[i].name;
            if (LANGUAGES[i].code.equals(currentCode)) {
                selectedIndex = i;
            }
        }

        final int[] selected = {selectedIndex};

        new AlertDialog.Builder(context)
                .setTitle("🌐 选择语言")
                .setSingleChoiceItems(names, selectedIndex, (dialog, which) -> {
                    selected[0] = which;
                })
                .setPositiveButton("确定", (dialog, which) -> {
                    listener.onSelected(LANGUAGES[selected[0]].code);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 显示语言选择对话框（无当前选中）
     */
    public static void show(@NonNull Context context,
                            @NonNull OnLanguageSelectedListener listener) {
        show(context, "zh", listener);
    }
}
