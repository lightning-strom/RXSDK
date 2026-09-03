package com.ruixue.demo.m007;


import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.M007SdkHelper;

/**
 * Created by wangliang on 2024/11/13
 */
public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
        M007SdkHelper.getInstance().applicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(base);
        M007SdkHelper.getInstance().applicationAttachBaseContext(base, this);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        M007SdkHelper.getInstance().applicationConfigurationChanged(newConfig);
    }
}
