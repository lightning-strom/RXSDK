package com.ruixue.demo.quick;


import android.content.Context;

import com.quicksdk.QuickSdkApplication;
import com.ruixue.RuiXueSdk;

/**
 * Created by wangliang on 2024/11/13
 */
public class MyApplication extends QuickSdkApplication {

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
}
