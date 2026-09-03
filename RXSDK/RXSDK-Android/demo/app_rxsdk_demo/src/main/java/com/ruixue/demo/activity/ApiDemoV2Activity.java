package com.ruixue.demo.activity;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.config.TestButtonConfig;
import com.ruixue.demo.widget.DynamicButtonPanel;
import com.ruixue.demo.widget.ResizableLogPanel;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;

import java.util.List;

/**
 * RXSDK API V2 演示界面
 * <p>
 * 使用 DemoManager 统一管理所有 API 分类，
 * 通过 DynamicButtonPanel 动态展示按钮。
 * <p>
 * <b>V2 版本特点：</b>
 * <ul>
 *   <li>配置化按钮管理</li>
 *   <li>统一的回调处理</li>
 *   <li>模块化 API 分类</li>
 * </ul>
 * <p>
 * <b>包含分类：</b>
 * <ul>
 *   <li>🔐 登录 - 登录状态、Token、登录/登出</li>
 *   <li>👤 用户 - 用户信息、DistinctId、设备码</li>
 *   <li>💰 支付 - 微信、支付宝、易宝支付</li>
 *   <li>🔧 工具 - 分享、WebView、复制</li>
 *   <li>⚙️ 配置 - 初始化配置、语言切换</li>
 * </ul>
 *
 * @since 2.0
 * @see DemoManager API 管理器
 * @see DynamicButtonPanel 动态按钮面板
 */
public class ApiDemoV2Activity extends AppCompatActivity {

    private static final String TAG = "ApiDemoV2Activity";

    private DemoManager demoManager;
    private DynamicButtonPanel buttonPanel;
    private ResizableLogPanel logPanel;
    private TextView tvTitle;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupWindow();
        setContentView(R.layout.activity_api_demo_v2);
        setupWindowInsets();
        initViews();
        initData();
    }

    /** 设置窗口样式 */
    private void setupWindow() {
        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.TRANSPARENT);
    }

    /** 设置窗口边距 */
    private void setupWindowInsets() {
        View main = findViewById(R.id.main);
        if (main != null) {
            ViewCompat.setOnApplyWindowInsetsListener(main, (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);
                return insets;
            });
        }
    }

    /** 初始化视图 */
    private void initViews() {
        tvTitle = findViewById(R.id.tv_title);
        buttonPanel = findViewById(R.id.button_panel);
        logPanel = findViewById(R.id.log_panel);

        // 返回按钮
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        // 清空日志按钮
        findViewById(R.id.btn_clear_log).setOnClickListener(v -> {
            if (logPanel != null) {
                logPanel.clearLog();
            }
        });
    }

    /** 初始化数据 */
    private void initData() {
        // 创建 DemoManager
        demoManager = new DemoManager(this, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                showLog(message);
            }

            @Override
            public void onToast(String message) {
                ToastUtils.showToast(ApiDemoV2Activity.this, message);
            }
        });

        // 加载所有分类的按钮
        List<TestButtonConfig.ButtonGroup> groups = demoManager.getAllButtonGroups();
        if (buttonPanel != null) {
            buttonPanel.setButtonGroups(groups);
        }
    }

    /** 显示日志 */
    private void showLog(String message) {
        RXLogger.d(TAG, message);
        if (logPanel != null) {
            logPanel.log(message);
        }
    }
}
