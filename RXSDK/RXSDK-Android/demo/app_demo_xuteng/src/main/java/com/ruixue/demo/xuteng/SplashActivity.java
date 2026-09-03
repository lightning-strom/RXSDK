package com.ruixue.demo.xuteng;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Splash Activity for Xuteng Demo
 * Created on 2025-12-10
 */
public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        // 停留几秒后启动主界面
        new Handler().postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, XutengDemoActivity.class);
            startActivity(intent);
            finish(); // 关闭闪屏界面
        }, 2000); // 2秒
    }
}

