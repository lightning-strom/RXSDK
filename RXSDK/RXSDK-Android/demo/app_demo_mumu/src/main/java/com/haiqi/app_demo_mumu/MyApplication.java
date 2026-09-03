package com.haiqi.app_demo_mumu;

import android.app.Application;
import android.content.Context;

import com.ruixue.sdk.YofunSdkHelper;

public class MyApplication extends Application {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        YofunSdkHelper.install(base);
        YofunSdkHelper.applicationAttach(this);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        YofunSdkHelper.applicationCreate(this);
    }
}
