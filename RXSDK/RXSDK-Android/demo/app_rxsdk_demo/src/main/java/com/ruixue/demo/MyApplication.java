package com.ruixue.demo;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.clipper.ClipperReceiver;
import com.ruixue.demo.config.InitConfigSelector;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.utils.Logger;


public class MyApplication extends Application {
    private static final String TAG = "rxsdk";

    @Override
    public void onCreate() {
        super.onCreate();

        Logger.init(this);
        ClipperReceiver.registerReceiver(this);
        try {
            WebView.setWebContentsDebuggingEnabled(true);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Log.i(TAG, "app onCreate");
        
        // 初始化配置选择器（IDE 调试运行时自动清除记忆）
        InitConfigSelector.init(this);
        
        RxSdkHelper.readConfig(this);
        RuiXueSdk.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        Log.i(TAG, "app attachBaseContext");
        RxSdkHelper.attachBaseContext(base);


    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Log.i(TAG, "onConfigurationChanged");
        RxSdkHelper.onConfigurationChanged(newConfig);

    }

}

