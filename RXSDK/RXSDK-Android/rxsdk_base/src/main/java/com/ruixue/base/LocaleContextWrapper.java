package com.ruixue.base;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;

import com.ruixue.openapi.RXGlobalData;

import java.util.Locale;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/6/19
 */
public class LocaleContextWrapper extends ContextWrapper {
    public LocaleContextWrapper(Context base) {
        super(base);
    }

    public static Context wrap(Context context) {
        return wrap(context, RXGlobalData.getLanguage());
    }

    public static Context wrap(Context context, String language) {
        if (TextUtils.isEmpty(language)) {
            return context;
        }

        Locale newLocale = new Locale(language);
        Locale.setDefault(newLocale);

        Resources res = context.getResources();
        Configuration config = new Configuration(res.getConfiguration());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            config.setLocale(newLocale);
            config.setLocales(new LocaleList(newLocale));
            context = context.createConfigurationContext(config);
        } else {
            config.setLocale(newLocale);
            res.updateConfiguration(config, res.getDisplayMetrics());
        }

        return new LocaleContextWrapper(context);
    }
}
