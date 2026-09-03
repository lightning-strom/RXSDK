package com.ruixue.utils;

import android.content.Context;
import android.content.res.Resources;

import androidx.annotation.NonNull;
import androidx.core.text.TextUtilsCompat;
import androidx.core.view.ViewCompat;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/25
 */
public class DisplayUtils {

    public static boolean isRtl(Context context) {
        return TextUtilsCompat.getLayoutDirectionFromLocale(
                context.getResources().getConfiguration().locale) == ViewCompat.LAYOUT_DIRECTION_RTL;
    }


    public static int dip2px(@NonNull Context context, float dip) {
        float density = context.getResources().getDisplayMetrics().density;
        return (int) (dip * density + 0.5F);
    }

    public static int dip2px(float dip) {
        float density = Resources.getSystem().getDisplayMetrics().density;
        return (int) (dip * density + 0.5F);
    }
}
