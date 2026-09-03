package com.ruixue.demo;

import android.app.Application;
import android.util.Log;

/**
 * Demo 应用程序入口
 * 
 * @author RXSDK Team
 * @version 1.0.0
 */
public class DemoApplication extends Application {
    
    private static final String TAG = "DemoApplication";
    
    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "DemoApplication onCreate");
        
        // 在这里初始化 SDK
        // RuiXueSdk.init(this, "your_app_key");
    }
}
