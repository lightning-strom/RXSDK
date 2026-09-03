package com.haiqi.app_demo_mumu;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.openapi.HubActionAdapter;
import com.ruixue.sdk.YofunSdkHelper;

public class SplashActivity extends AppCompatActivity {

    private HubActionAdapter mAction;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mAction = new HubActionAdapter() {
            @Override
            public void onSplash() {
                Log.d("SplashActivity", "进入首页");
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent);
            }

            @Override
            public void onQuit(boolean realQuit) {
                if (realQuit) {
                    Log.d("SplashActivity", "退出");
                }else {
                    // 用户取消
                }
            }
        };

        YofunSdkHelper.setDebugMode(true);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        YofunSdkHelper.splashOnDestroy(this, mAction);
    }
}