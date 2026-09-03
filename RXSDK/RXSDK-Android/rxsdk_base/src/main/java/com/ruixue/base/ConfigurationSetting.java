package com.ruixue.base;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.text.TextUtils;
import android.util.DisplayMetrics;

import java.util.Locale;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/16
 */
public class ConfigurationSetting {
    /**
     * 切换语言
     * @param language
     */
    public static void switchLanguage(Context context, String language) {
        Resources resources = context.getResources();
        Configuration config = resources.getConfiguration();
        DisplayMetrics dm = resources.getDisplayMetrics();
        if (TextUtils.isEmpty(language)) {
            config.locale = Locale.forLanguageTag(language);
        } else {
            config.locale = Locale.getDefault();
        }
//        if (language.equals("zh_simple")) {
//            config.locale = Locale.SIMPLIFIED_CHINESE;
//        } else if (language.equals("en")) {
//            config.locale = Locale.ENGLISH;
//        } else {
//            config.locale = Locale.getDefault();
//        }
        resources.updateConfiguration(config, dm);
    }
}
