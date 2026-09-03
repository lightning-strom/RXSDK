package com.ruixue.storage;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/17
 */
public class RXPreference {
    protected final SharedPreferences msp;
    private static final String FILE_NAME = "spUtils";

    public RXPreference(Context context) {
        msp = context.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE);
    }

    public void putString(String key, String value) {
        msp.edit().putString(key, value).apply();
    }

    public String getString(String key) {
        return msp.getString(key, null);
    }

    public String getString(String key, String def) {
        return msp.getString(key, def);
    }

    public void putBoolean(String key, boolean value) {
        msp.edit().putBoolean(key, value).apply();
    }

    public boolean getBoolean(String key) {
        return msp.getBoolean(key, false);
    }

    public void putInt(String key, int value) {
        msp.edit().putInt(key, value).apply();
    }

    public int getInt(String key) {
        return msp.getInt(key, 0);
    }
}
