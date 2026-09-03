package com.ruixue.aliqin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Insets;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;

import androidx.annotation.DimenRes;
import androidx.annotation.RequiresApi;
import androidx.core.util.Consumer;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.util.Objects;

public class AppUtils {


    public static boolean hasNavigationBar(Activity activity) {
        if (activity == null)
            return false;
        View decorView = activity.getWindow().getDecorView();
        WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(decorView);
        return insets != null && insets.isVisible(WindowInsetsCompat.Type.navigationBars());
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    public static int getNavigationBarHeightWithInsets(Activity activity) {
        View decorView = activity.getWindow().getDecorView();
        WindowInsets insets = decorView.getRootWindowInsets();
        if (insets != null) {
            Insets navBarInsets = insets.getInsets(WindowInsets.Type.navigationBars());
            return navBarInsets.bottom; // 返回导航栏底部高度（像素）
        }
        return 0;
    }

    public static int getNavigationBarHeight(Context context) {
        Resources resources = context.getResources();
        @SuppressLint({"DiscouragedApi", "InternalInsetResource"}) int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId > 0) {
            return resources.getDimensionPixelSize(resourceId); // 返回导航栏高度（像素）
        }
        return 0;
    }

    public static float getNavigationBarHeightInDp(Activity context) {
        if (hasNavigationBar(context)) {
            int h = 0;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                h = getNavigationBarHeightWithInsets(context);
            } else {
                // 使用 Resources 方法（适用于老版本）
                h = getNavigationBarHeight(context);
            }
            if (h > 0) {
                return px2dp(context, h);
            } else {
                return px2dp(context, 16);
            }
        }
        return 0;
    }

    public static int dp2px(Context context, float dipValue) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (dipValue * scale + 0.5f);
        } catch (Exception e) {
            return (int) dipValue;
        }
    }

    public static int px2dp(Context context, float px) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (px / scale + 0.5f);
        } catch (Exception e) {
            return (int) px;
        }
    }

    public static int getPhoneWidthPixels(Context context) {
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics var2 = new DisplayMetrics();
        if (wm != null) {
            wm.getDefaultDisplay().getMetrics(var2);
        }

        return var2.widthPixels;
    }

    public static float getDimensionDp(Context context, @DimenRes int id) {
        float tmp = context.getResources().getDimension(id);
        final float density = context.getResources().getDisplayMetrics().density;
        return tmp / density;
    }

    public static int getPhoneHeightPixels(Context context) {
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics var2 = new DisplayMetrics();
        if (wm != null) {
            wm.getDefaultDisplay().getMetrics(var2);
        }

        return var2.heightPixels;
    }
}
