package com.ruixue.openapi;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import com.ruixue.RuiXueSdk;

public class RXApplication extends Application {

    /**
     * before onCreate call
     */
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

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }
}
