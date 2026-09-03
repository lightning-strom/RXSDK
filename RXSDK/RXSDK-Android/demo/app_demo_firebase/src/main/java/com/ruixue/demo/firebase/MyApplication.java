package com.ruixue.demo.firebase;

import android.app.Application;
import android.content.Context;

import com.ruixue.RuiXueSdk;

// Created by wangliang on 2024/5/20.
public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(this);
    }
}
