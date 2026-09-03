package com.ruixue.demo.oppo;


import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;

/**
 * Created by wangliang on 2024/11/13
 */
public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(base);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }
}
