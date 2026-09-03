package com.ruixue.demo.activity;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.qipai.R;

/**
 * 基于 Navigation Graph 的 Demo 预览入口。
 * <p>
 * 通过 {@code card_test_entry.xml} 的"功能演示"按钮进入，
 * 内部由 {@code nav_graph.xml} 组织 MainFragment / LoginFragment / ConfigFragment 等片段。
 */
public class NavActivity extends BaseSdkLifecycleActivity implements View.OnClickListener {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nav);

        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        window.getDecorView().setSystemUiVisibility(uiOptions);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        RxSdkHelper.onCreate(this);
    }

    @Override
    public void onClick(View view) {
    }
}
