package com.ruixue.utils;

import android.content.Context;
import android.os.LocaleList;

import androidx.annotation.StringRes;

import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;

import java.util.Objects;

public class ResUtils {
    private static ResUtils mInstance = null;

    public static ResUtils getInstance() {
        if (mInstance == null) {
            mInstance = new ResUtils();
        }
        return mInstance;
    }

    private ResUtils() {
    }

    public Context getContext() {
//        if (RuiXueSdk.getCurrentActivity() == null) {
//            RXLogger.e(new Throwable("not set activity,current activity is null").getMessage());
//            new Throwable("not set activity,current activity is null").printStackTrace();
//        }
        return RuiXueSdk.getCurrentActivity() == null ? RuiXueSdk.getContext() : RuiXueSdk.getCurrentActivity();
    }

    public String getString(String resName) {
        return getString(this.getStringId(resName));
    }

    public String getString(@StringRes int resId) {
        if (getContext() != null && 0 != resId) {
            return getContext().getResources().getString(resId);
        }
        return "";
    }

    private int getResourceID(String type, String id) {
        if (getContext() != null) {
            Context context = getContext();
            return getContext().getResources().getIdentifier(id, type, context.getPackageName());
        }
        return 0;
    }

    public int getDrawableId(String id) {
        return getResourceID("drawable", id);
    }

    public int getID(String id) {
        return getResourceID("id", id);
    }

    public int getLayoutId(String id) {
        return getResourceID("layout", id);
    }

    public int getStyleId(String id) {
        return getResourceID("style", id);
    }

    public int getStringId(String id) {
        return getResourceID("string", id);
    }

    public int getColorId(String id) {
        return getResourceID("color", id);
    }
}
