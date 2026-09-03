package com.ruixue.demo.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.qipai.R;

import org.json.JSONObject;

/**
 * 测试 Activity 基类
 * <p>
 * 提供统一的日志显示和回调处理
 *
 * @since 2.0
 */
public abstract class BaseTestActivity extends AppCompatActivity {

    private static final String TAG = "TestActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutId());
        setupWindowInsets();
        initViews();
        com.ruixue.demo.widget.CollapsibleHelper.bind(getWindow().getDecorView());
    }

    /** 获取布局 ID */
    protected abstract int getLayoutId();

    /** 初始化视图 */
    protected abstract void initViews();

    /** 设置窗口边距 */
    protected void setupWindowInsets() {
        View main = findViewById(R.id.main);
        if (main != null) {
            ViewCompat.setOnApplyWindowInsetsListener(main, (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });
        }
    }

    /** 显示日志 */
    protected void showLog(String log) {
        RXLogger.d(TAG, "结果：" + log);
        TextView tvLog = findViewById(R.id.tv_log);
        if (tvLog != null) {
            tvLog.setText(log);
        }
    }

    /** 统一 JSON 回调 */
    protected final RXJSONCallback jsonCallback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            showLog(data != null ? data.toString() : "成功");
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            showLog("失败: " + cause.toString());
        }
    };

    /** 统一请求回调 */
    protected final RXRequestCallback requestCallback = new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject json) {
            if (json.optInt("code") != 0) {
                showLog("错误: " + json.toString());
            } else {
                showLog(json.toString());
            }
        }
    };
}
