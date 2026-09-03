/**
 * GameApplication.java
 * 游戏 Application 类，用于初始化瑞雪 SDK
 */

package com.wl.rx;

import android.app.Application;
import android.content.Context;

import com.ruixue.openapi.RXSDK;

public class GameApplication extends Application {
    
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RXSDK.attachBaseContext(base);
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        RXSDK.onApplicationCreate(this);
    }
}
