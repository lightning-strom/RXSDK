package com.ruixue.demo.quick;


import android.content.Intent;
import android.graphics.Color;

import com.quicksdk.QuickSdkSplashActivity;

/**
 * Created by wangliang on 2024/11/14
 */
public class SplashActivity extends QuickSdkSplashActivity {

    @Override
    public int getBackgroundColor() {
        return Color.WHITE;
    }

    @Override
    public void onSplashStop() {
        Intent intent = new Intent(SplashActivity.this, QuickDemoActivity.class);
        startActivity(intent);
        finish(); // 关闭闪屏界面
    }
}
