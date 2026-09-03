package com.ruixue.rxsdkdemo;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

/**
 * RXSDKDemo 主界面
 * 
 * UI 层只负责界面展示和用户交互
 * SDK 接口调用统一由 RXSDKManager 管理
 * 
 * API 文档关联（详见 RXSDK-Doc/demo/api-mapping.md）
 */
public class MainActivity extends AppCompatActivity {

    // SDK 管理器
    private RXSDKManager sdkManager;

    // UI 组件
    private View statusDot;
    private TextView statusDescText;
    private Button btnDefaultInit;
    private Button btnCustomInit;
    private Button btnResetSdk;
    private LinearLayout initButtonsLayout;

    // 语言设置
    private TextView tvCurrentLanguage;
    private Button btnSelectLanguage;

    // 屏幕方向设置
    private TextView tvCurrentOrientation;
    private Button btnPortrait;
    private Button btnLandscape;

    // 环境设置
    private TextView tvCurrentEnv;
    private Button btnDomestic;
    private Button btnOverseas;

    // 配置完成按钮
    private Button btnConfigComplete;

    // 打开 WebView 按钮
    private Button btnOpenWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 初始化 SDK 管理器
        sdkManager = RXSDKManager.getInstance();

        // TODO: 自动监听 Activity 生命周期（推荐方式）
        // RuiXueSdk.trackingLifecycle(this);

        initViews();
        setupClickListeners();

        if (sdkManager.isInitialized()) {
            statusDot.setBackgroundResource(R.drawable.status_dot_active);
            statusDescText.setText("SDK initialized successfully");
            btnDefaultInit.setVisibility(View.GONE);
            btnCustomInit.setVisibility(View.GONE);
            btnResetSdk.setVisibility(View.VISIBLE);
        } else {
            statusDot.setBackgroundResource(R.drawable.status_dot_inactive);
            statusDescText.setText("Initialize SDK to begin");
            btnDefaultInit.setVisibility(View.VISIBLE);
            btnCustomInit.setVisibility(View.VISIBLE);
            btnDefaultInit.setEnabled(true);
            btnCustomInit.setEnabled(true);
            btnResetSdk.setVisibility(View.GONE);
        }
    }

    private void initViews() {
        // SDK Status Card
        statusDot = findViewById(R.id.statusDot);
        statusDescText = findViewById(R.id.statusDescText);
        btnDefaultInit = findViewById(R.id.btnDefaultInit);
        btnCustomInit = findViewById(R.id.btnCustomInit);
        btnResetSdk = findViewById(R.id.btnResetSdk);

        // Language Settings
        tvCurrentLanguage = findViewById(R.id.tvCurrentLanguage);
        btnSelectLanguage = findViewById(R.id.btnSelectLanguage);
        updateLanguageDisplay();

        // Orientation Settings
        tvCurrentOrientation = findViewById(R.id.tvCurrentOrientation);
        btnPortrait = findViewById(R.id.btnPortrait);
        btnLandscape = findViewById(R.id.btnLandscape);
        updateOrientationDisplay();

        // Environment Settings
        tvCurrentEnv = findViewById(R.id.tvCurrentEnv);
        btnDomestic = findViewById(R.id.btnDomestic);
        btnOverseas = findViewById(R.id.btnOverseas);
        updateEnvDisplay();

        // Config Complete Button
        btnConfigComplete = findViewById(R.id.btnConfigComplete);

        // Open WebView Button
        btnOpenWebView = findViewById(R.id.btnOpenWebView);
    }

    private void setupClickListeners() {
        // Init buttons
        btnDefaultInit.setOnClickListener(v -> onDefaultInitClicked());
        btnCustomInit.setOnClickListener(v -> onCustomInitClicked());
        btnResetSdk.setOnClickListener(v -> onResetSdkClicked());

        // Language selector
        btnSelectLanguage.setOnClickListener(v -> onSelectLanguageClicked());

        // Orientation selector
        btnPortrait.setOnClickListener(v -> onOrientationClicked(RXSDKManager.ORIENTATION_PORTRAIT));
        btnLandscape.setOnClickListener(v -> onOrientationClicked(RXSDKManager.ORIENTATION_LANDSCAPE));

        // Environment selector
        btnDomestic.setOnClickListener(v -> onEnvClicked(RXSDKManager.ENV_DOMESTIC));
        btnOverseas.setOnClickListener(v -> onEnvClicked(RXSDKManager.ENV_OVERSEAS));

        // Config complete button
        btnConfigComplete.setOnClickListener(v -> onConfigCompleteClicked());

        // Open WebView button
        btnOpenWebView.setOnClickListener(v -> onOpenWebViewClicked());
    }

    /**
     * 默认初始化按钮点击 - 使用预设参数初始化 SDK
     */
    private void onDefaultInitClicked() {
        if (sdkManager.isInitialized()) {
            Toast.makeText(this, "SDK 已初始化，请先重置", Toast.LENGTH_SHORT).show();
            return;
        }

        // 显示确认对话框（根据当前环境显示对应参数）
        String envName = sdkManager.isDomestic() ? "国内" : "海外";
        String message = "即将使用" + envName + "环境默认参数初始化 SDK：\n\n" +
                "• CPID: " + sdkManager.getEnvDefaultCpid() + "\n" +
                "• Product ID: " + sdkManager.getEnvDefaultProductId() + "\n" +
                "• Channel ID: " + sdkManager.getEnvDefaultChannelId() + "\n" +
                "• Base URL: " + sdkManager.getEnvDefaultBaseUrl();

        new AlertDialog.Builder(this)
                .setTitle("默认初始化参数")
                .setMessage(message)
                .setPositiveButton("确认初始化", (dialog, which) -> {
                    startDefaultInitialization();
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 自定义初始化按钮点击 - 弹出参数输入对话框
     */
    private void onCustomInitClicked() {
        if (sdkManager.isInitialized()) {
            Toast.makeText(this, "SDK 已初始化，请先重置", Toast.LENGTH_SHORT).show();
            return;
        }

        // 加载自定义对话框布局
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_custom_init, null);
        EditText etCpid = dialogView.findViewById(R.id.etCpid);
        EditText etProductId = dialogView.findViewById(R.id.etProductId);
        EditText etChannelId = dialogView.findViewById(R.id.etChannelId);
        EditText etBaseUrl = dialogView.findViewById(R.id.etBaseUrl);

        // 预填充默认值（根据当前环境）
        etCpid.setText(sdkManager.getEnvDefaultCpid());
        etProductId.setText(sdkManager.getEnvDefaultProductId());
        etChannelId.setText(sdkManager.getEnvDefaultChannelId());
        etBaseUrl.setText(sdkManager.getEnvDefaultBaseUrl());

        new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("初始化", (dialog, which) -> {
                    // 获取用户输入
                    String cpid = etCpid.getText().toString().trim();
                    String productId = etProductId.getText().toString().trim();
                    String channelId = etChannelId.getText().toString().trim();
                    String baseUrl = etBaseUrl.getText().toString().trim();

                    // 验证输入
                    if (TextUtils.isEmpty(cpid) || TextUtils.isEmpty(productId) ||
                            TextUtils.isEmpty(channelId) || TextUtils.isEmpty(baseUrl)) {
                        Toast.makeText(this, "请填写所有参数", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    // 执行自定义参数初始化
                    startCustomInitialization(cpid, productId, channelId, baseUrl);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 重置 SDK 按钮点击
     */
    private void onResetSdkClicked() {
        sdkManager.reset();
        statusDot.setBackgroundResource(R.drawable.status_dot_inactive);
        statusDescText.setText("Initialize SDK to begin");
        
        // 切换按钮显示
        btnDefaultInit.setVisibility(View.VISIBLE);
        btnCustomInit.setVisibility(View.VISIBLE);
        btnDefaultInit.setEnabled(true);
        btnCustomInit.setEnabled(true);
        btnResetSdk.setVisibility(View.GONE);

        Toast.makeText(this, "SDK 状态已重置", Toast.LENGTH_SHORT).show();
    }

    /**
     * 使用默认参数初始化
     */
    private void startDefaultInitialization() {
        // 显示正在初始化
        statusDescText.setText("Initializing...");
        btnDefaultInit.setEnabled(false);
        btnCustomInit.setEnabled(false);

        // 调用 SDK 管理器初始化
        sdkManager.initWithDefaultParams(this, this::onInitSuccess);
    }

    /**
     * 使用自定义参数初始化
     */
    private void startCustomInitialization(String cpid, String productId, String channelId, String baseUrl) {
        // 显示正在初始化
        statusDescText.setText("Initializing...");
        btnDefaultInit.setEnabled(false);
        btnCustomInit.setEnabled(false);

        // 调用 SDK 管理器初始化
        sdkManager.initSDK(this, cpid, productId, channelId, baseUrl, this::onInitSuccess);
    }

    /**
     * 初始化成功回调
     */
    private void onInitSuccess(JSONObject response) {
        runOnUiThread(() -> {
            statusDot.setBackgroundResource(R.drawable.status_dot_active);
            statusDescText.setText("SDK initialized successfully");
            
            // 切换按钮显示
            btnDefaultInit.setVisibility(View.GONE);
            btnCustomInit.setVisibility(View.GONE);
            btnResetSdk.setVisibility(View.VISIBLE);

            String successMsg = "SDK 初始化成功！\n\n" +
                    "使用参数：\n" +
                    "• CPID: " + sdkManager.getCurrentCpid() + "\n" +
                    "• Product ID: " + sdkManager.getCurrentProductId() + "\n" +
                    "• Channel ID: " + sdkManager.getCurrentChannelId() + "\n" +
                    "• Base URL: " + sdkManager.getCurrentBaseUrl() + "\n\n" +
                    "Response: " + response.toString();

            showDialog("RXSDK Initialized", successMsg);
        });
    }

    /**
     * 打开 WebView 按钮点击
     */
    private void onOpenWebViewClicked() {
        Intent intent = new Intent(this, WebViewActivity.class);
        startActivity(intent);
    }

    /**
     * 前往登录配置按钮点击
     * 跳转到登录配置页面
     */
    private void onConfigCompleteClicked() {
        if (!sdkManager.isInitialized()) {
            Toast.makeText(this, "请先初始化", Toast.LENGTH_SHORT).show();
            return;
        }
        
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }

    private void showDialog(String title, String message) {
        new AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show();
    }

    // ==================== 语言设置 ====================

    /**
     * 选择语言按钮点击
     */
    private void onSelectLanguageClicked() {
        String[][] languages = RXSDKManager.SUPPORTED_LANGUAGES;
        String[] displayNames = new String[languages.length];
        for (int i = 0; i < languages.length; i++) {
            displayNames[i] = languages[i][1];
        }

        int currentIndex = sdkManager.getLanguageIndex();

        new AlertDialog.Builder(this)
                .setTitle("选择语言")
                .setSingleChoiceItems(displayNames, currentIndex, (dialog, which) -> {
                    String selectedCode = languages[which][0];
                    sdkManager.setLanguage(selectedCode);
                    updateLanguageDisplay();
                    dialog.dismiss();
                    
                    Toast.makeText(this, 
                            "语言已设置为: " + languages[which][1], 
                            Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 更新语言显示
     */
    private void updateLanguageDisplay() {
        tvCurrentLanguage.setText(sdkManager.getCurrentLanguageDisplayName());
    }

    // ==================== 屏幕方向设置 ====================

    /**
     * 屏幕方向按钮点击
     */
    private void onOrientationClicked(int orientation) {
        sdkManager.setOrientation(orientation);
        updateOrientationDisplay();
        applyOrientation(orientation);
        
        String orientationName = orientation == RXSDKManager.ORIENTATION_PORTRAIT ? "竖屏" : "横屏";
        Toast.makeText(this, "屏幕方向已设置为: " + orientationName, Toast.LENGTH_SHORT).show();
    }

    /**
     * 更新屏幕方向显示
     */
    private void updateOrientationDisplay() {
        boolean isPortrait = sdkManager.isPortrait();
        tvCurrentOrientation.setText(sdkManager.getCurrentOrientationDisplayName());
        
        // 更新按钮样式
        if (isPortrait) {
            btnPortrait.setBackgroundResource(R.drawable.button_gradient);
            btnPortrait.setTextColor(getResources().getColor(R.color.white, null));
            btnLandscape.setBackgroundResource(R.drawable.button_outline);
            btnLandscape.setTextColor(getResources().getColor(R.color.primary, null));
        } else {
            btnLandscape.setBackgroundResource(R.drawable.button_gradient);
            btnLandscape.setTextColor(getResources().getColor(R.color.white, null));
            btnPortrait.setBackgroundResource(R.drawable.button_outline);
            btnPortrait.setTextColor(getResources().getColor(R.color.primary, null));
        }
    }

    /**
     * 应用屏幕方向
     */
    private void applyOrientation(int orientation) {
        if (orientation == RXSDKManager.ORIENTATION_PORTRAIT) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }
    }

    // ==================== 环境设置 ====================

    // 海外版包名
    private static final String OVERSEAS_PACKAGE = "com.ruixue.rxsdkdemo.overseas";

    /**
     * 环境按钮点击
     */
    private void onEnvClicked(int env) {
        if (env == RXSDKManager.ENV_OVERSEAS) {
            // 点击海外按钮，跳转到海外版 app
            launchAppByPackage(OVERSEAS_PACKAGE);
            return;
        }
        
        // 当前已是国内版，点击国内按钮无需处理
        Toast.makeText(this, "当前已是国内版", Toast.LENGTH_SHORT).show();
    }
    
    /**
     * 通过包名启动另一个应用
     */
    private void launchAppByPackage(String packageName) {
        PackageManager pm = getPackageManager();
        Intent intent = pm.getLaunchIntentForPackage(packageName);
        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish(); // 关闭当前应用
        } else {
            Toast.makeText(this, "未安装海外版Demo应用", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 更新环境显示
     */
    private void updateEnvDisplay() {
        boolean isDomestic = sdkManager.isDomestic();
        tvCurrentEnv.setText(sdkManager.getCurrentEnvDisplayName());
        
        // 更新按钮样式
        if (isDomestic) {
            btnDomestic.setBackgroundResource(R.drawable.button_gradient);
            btnDomestic.setTextColor(getResources().getColor(R.color.white, null));
            btnOverseas.setBackgroundResource(R.drawable.button_outline);
            btnOverseas.setTextColor(getResources().getColor(R.color.primary, null));
        } else {
            btnOverseas.setBackgroundResource(R.drawable.button_gradient);
            btnOverseas.setTextColor(getResources().getColor(R.color.white, null));
            btnDomestic.setBackgroundResource(R.drawable.button_outline);
            btnDomestic.setTextColor(getResources().getColor(R.color.primary, null));
        }
    }
}
