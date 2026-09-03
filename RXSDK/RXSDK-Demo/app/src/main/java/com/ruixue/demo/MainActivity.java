package com.ruixue.demo;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.ruixue.demo.databinding.ActivityMainBinding;

/**
 * 主界面 Activity
 * 
 * 展示 RXSDK 的基本功能示例
 * 根据 Figma 设计 1:1 还原
 * 
 * @author RXSDK Team
 * @version 1.0.0
 */
public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private boolean isInitialized = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        initViews();
    }

    /**
     * 初始化视图和点击事件
     */
    private void initViews() {
        // Initialize 按钮
        binding.btnInitialize.setOnClickListener(v -> {
            if (!isInitialized) {
                initializeSDK();
            } else {
                showToast("SDK 已初始化");
            }
        });

        // API Services 按钮 - 使用 getRoot() 获取 include 布局的根视图
        binding.btnLogin.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Login - 登录功能");
                // TODO: 实现登录功能
            }
        });

        binding.btnUserInfo.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("User Info - 用户信息");
                // TODO: 实现用户信息功能
            }
        });

        binding.btnGameplay.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Gameplay - 游戏数据");
                // TODO: 实现游戏数据功能
            }
        });

        binding.btnPayment.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Payment - 支付功能");
                // TODO: 实现支付功能
            }
        });

        binding.btnShare.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Share - 分享功能");
                // TODO: 实现分享功能
            }
        });

        binding.btnAnalytics.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Analytics - 数据分析");
                // TODO: 实现数据分析功能
            }
        });

        binding.btnFeedback.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Feedback - 反馈功能");
                // TODO: 实现反馈功能
            }
        });

        binding.btnDeregister.getRoot().setOnClickListener(v -> {
            if (checkInitialized()) {
                showToast("Deregister - 注销功能");
                // TODO: 实现注销功能
            }
        });
    }

    /**
     * 初始化 SDK
     */
    private void initializeSDK() {
        showToast("正在初始化 RXSDK...");

        // 模拟初始化过程
        binding.btnInitialize.postDelayed(() -> {
            isInitialized = true;
            showToast("RXSDK 初始化成功!");

            // 更新状态指示器为绿色
            binding.statusDot.setBackgroundResource(R.drawable.status_dot_green);

            // 更新提示文字
            binding.tvStatusHint.setText("SDK initialized successfully");

            // 启用所有 API 按钮（移除半透明效果）
            enableApiButtons();
        }, 1000);
    }

    /**
     * 启用 API 按钮
     */
    private void enableApiButtons() {
        binding.btnLogin.getRoot().setAlpha(1.0f);
        binding.btnUserInfo.getRoot().setAlpha(1.0f);
        binding.btnGameplay.getRoot().setAlpha(1.0f);
        binding.btnPayment.getRoot().setAlpha(1.0f);
        binding.btnShare.getRoot().setAlpha(1.0f);
        binding.btnAnalytics.getRoot().setAlpha(1.0f);
        binding.btnFeedback.getRoot().setAlpha(1.0f);
        binding.btnDeregister.getRoot().setAlpha(1.0f);
    }

    /**
     * 检查 SDK 是否已初始化
     */
    private boolean checkInitialized() {
        if (!isInitialized) {
            showToast("请先初始化 SDK");
            return false;
        }
        return true;
    }

    /**
     * 显示 Toast 提示
     * 
     * @param message 提示信息
     */
    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}
