package com.ruixue.sdk;

import android.content.Context;

import com.ruixue.RuiXueSdk;
import com.xut.sdk.channel.DFPlatformApplication;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2026/1/13
 */
public class XTApplication extends DFPlatformApplication {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(this);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
    }
}
