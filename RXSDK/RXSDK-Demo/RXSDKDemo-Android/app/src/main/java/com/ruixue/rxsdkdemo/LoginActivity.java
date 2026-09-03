package com.ruixue.rxsdkdemo;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * 登录配置页面
 * 
 * 根据环境配置展示不同的登录方式选择
 * 国内：账号密码、验证码、微信、apple、游客
 * 海外：账号密码、验证码、apple、google、facebook、line、zalo、instagram、tiktok、reddit
 */
public class LoginActivity extends AppCompatActivity {

    // SDK 管理器
    private RXSDKManager sdkManager;

    // UI 组件
    private TextView tvEnvironment;
    private LinearLayout loginMethodsContainer;
    private Button btnLogin;

    // 登录方式 CheckBox 列表
    private List<CheckBox> loginMethodCheckBoxes = new ArrayList<>();

    // 国内登录方式
    private static final String[][] DOMESTIC_LOGIN_METHODS = {
        {"account", "账号密码"},
        {"captcha", "验证码"},
        {"wechat", "微信"},
        {"guest", "游客"}
    };

    // 海外登录方式
    private static final String[][] OVERSEAS_LOGIN_METHODS = {
        {"account", "账号密码"},
        {"captcha", "验证码"},
        {"google", "Google"},
        {"facebook", "Facebook"},
        {"line", "Line"},
        {"zalo", "Zalo"},
        {"instagram", "Instagram"},
        {"tiktok", "TikTok"},
        {"reddit", "Reddit"}
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sdkManager = RXSDKManager.getInstance();
        // TODO: RuiXueSdk.trackingLifecycle(this);

        initViews();
        setupLoginMethods();
    }

    private void initViews() {
        tvEnvironment = findViewById(R.id.tvEnvironment);
        loginMethodsContainer = findViewById(R.id.loginMethodsContainer);
        btnLogin = findViewById(R.id.btnLogin);

        // 显示当前环境
        String envName = sdkManager.isDomestic() ? "国内" : "海外";
        tvEnvironment.setText("当前环境: " + envName);

        btnLogin.setOnClickListener(v -> onLoginClicked());
    }

    /**
     * 根据环境设置登录方式选项
     */
    private void setupLoginMethods() {
        loginMethodsContainer.removeAllViews();
        loginMethodCheckBoxes.clear();

        String[][] methods = sdkManager.isDomestic() ? DOMESTIC_LOGIN_METHODS : OVERSEAS_LOGIN_METHODS;

        for (String[] method : methods) {
            CheckBox checkBox = new CheckBox(this);
            checkBox.setText(method[1]);
            checkBox.setTag(method[0]);
            checkBox.setTextSize(16);
            checkBox.setPadding(0, 24, 0, 24);
            checkBox.setTextColor(getResources().getColor(R.color.text_primary, null));
            
            // 默认选中第一个
            if (loginMethodCheckBoxes.isEmpty()) {
                checkBox.setChecked(true);
            }

            loginMethodsContainer.addView(checkBox);
            loginMethodCheckBoxes.add(checkBox);
        }
    }

    /**
     * 登录按钮点击
     * TODO: 调用 RXSDK 登录接口
     */
    private void onLoginClicked() {
        // 获取选中的登录方式
        List<String> selectedMethods = new ArrayList<>();
        for (CheckBox cb : loginMethodCheckBoxes) {
            if (cb.isChecked()) {
                selectedMethods.add((String) cb.getTag());
            }
        }

        if (selectedMethods.isEmpty()) {
            Toast.makeText(this, "请至少选择一种登录方式", Toast.LENGTH_SHORT).show();
            return;
        }

        // 使用第一个选中的登录方式进行登录
        String loginMethod = selectedMethods.get(0);
        
        // 显示登录中
        btnLogin.setEnabled(false);
        btnLogin.setText("登录中...");
        
        // TODO: 调用 SDK 登录
        // LoginParams params = new LoginParams();
        // params.setMethod(loginMethod);
        // RuiXueSdk.login(this, params, new RXRequestCallback() { ... });
        
        // 模拟登录成功
        btnLogin.postDelayed(() -> {
            btnLogin.setEnabled(true);
            btnLogin.setText("登录");
            
            // 登录成功，直接跳转到服务页面
            Intent intent = new Intent(LoginActivity.this, ServicesActivity.class);
            startActivity(intent);
        }, 500);
    }
    
    /**
     * 显示错误对话框
     */
    private void showErrorDialog(String errorMsg) {
        new AlertDialog.Builder(this)
            .setTitle("登录失败")
            .setMessage(errorMsg)
            .setPositiveButton("确定", null)
            .show();
    }

    /**
     * 获取选中的登录方式名称
     */
    private String getSelectedMethodNames() {
        StringBuilder sb = new StringBuilder();
        for (CheckBox cb : loginMethodCheckBoxes) {
            if (cb.isChecked()) {
                if (sb.length() > 0) {
                    sb.append("、");
                }
                sb.append(cb.getText());
            }
        }
        return sb.toString();
    }
}
