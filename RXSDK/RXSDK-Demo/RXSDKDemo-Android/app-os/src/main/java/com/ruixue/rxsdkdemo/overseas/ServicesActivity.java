package com.ruixue.rxsdkdemo.overseas;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.ruixue.RXRequestCallback;
import com.ruixue.openapi.CaptchaType;
import com.ruixue.openapi.PasswordStrength;
import com.ruixue.openapi.RXSDK;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.LoginParams;
import com.ruixue.openapi.IRXRequest;
import com.ruixue.passport.RegisterParams;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * API Services 页面
 * <p>
 * 按模块分类展示 SDK 提供的各种 API 服务入口
 * 支持 API/UI 分类切换
 * SDK 接口调用统一由 RXSDKManager 管理
 * <p>
 * 模块分类参考：RXSDK-Doc/ios/public_class_methods.md
 */
public class ServicesActivity extends AppCompatActivity {

    // SDK 管理器
    private RXSDKManager sdkManager;

    // 分类类型
    private static final int CATEGORY_API = 0;
    private static final int CATEGORY_UI = 1;
    private int currentCategory = CATEGORY_API;

    // UI 组件
    private Button btnCategoryApi;
    private Button btnCategoryUi;
    private LinearLayout modulesContainer;
    private ScrollView scrollView;

    // API 模块定义
    private static final String[][] API_MODULES = {
            {"初始化", "初始化SDK"},
            {"登录", "登录Api", "获取法务配置", "自定义请求"},
            {"配置", "设置子渠道ID", "设置语言", "设置密码强度", "设置密码正则", "设置游戏角色信息", "设置错误码", "设置地区"},
            {"信息获取", "获取请求域名", "获取OpenID", "获取BaseUrl", "获取配置数据"},
            {"验证码", "发送验证码", "校验验证码"},
            {"账号绑定", "绑定邮箱", "解绑邮箱", "绑定手机", "解绑手机", "修改手机号"},
            {"用户信息", "获取用户信息", "修改用户信息"},
            {"密码", "修改密码", "重置密码"},
            {"注册", "注册账号"},
            {"实名认证", "实名认证", "IIFAA快速实名"},
            {"设备信息", "获取设备码", "获取时区偏移", "获取系统语言"},
            {"游戏区服", "查询区服", "查询区服列表", "创建区服", "修改区服", "删除区服"},
            {"游戏角色", "创建角色", "修改角色", "删除角色", "查询角色列表", "查询角色信息", "查询游戏账号"},
            {"公告/邮件", "获取公告列表", "获取临时公告", "获取邮件列表", "获取邮件详情", "领取道具", "删除邮件"},
            {"反馈", "创建反馈", "获取反馈列表", "获取反馈详情", "领取反馈道具", "获取反馈类型", "创建意见反馈", "满意度评价", "上报反馈日志"},
            {"福利码", "请求福利码", "兑换福利码"},
            {"埋点", "用户行为统计", "终止行为统计"},
            {"支付(IAP)", "支付", "查询"},
            {"分享", "一键分享", "自定义分享"},
            {"注销账号", "申请注销", "撤销注销"}
    };

    // UI 模块定义
    private static final String[][] UI_MODULES = {
            {"登录", "登录弹窗"},
            {"协议/法务", "协议声明", "隐私政策弹框"},
            {"实名/防沉迷", "实名认证弹窗", "防沉迷弹窗"},
            {"密码", "找回密码", "设置密码"},
            {"用户中心", "用户中心", "帮助中心"},
            {"账号注销", "申请注销UI", "撤销注销UI"},
            {"其他", "展示邮件", "绑定手机UI", "绑定邮箱UI", "展示公告"}
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sdkManager = RXSDKManager.getInstance();
        // TODO: RuiXueSdk.trackingLifecycle(this);

        setupUI();
    }

    private void setupUI() {
        // 根布局
        LinearLayout rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(ContextCompat.getColor(this, R.color.background));

        int padding = dpToPx(16);

        // 头部容器（固定）
        LinearLayout headerContainer = new LinearLayout(this);
        headerContainer.setOrientation(LinearLayout.VERTICAL);
        headerContainer.setPadding(padding, padding, padding, 0);
        headerContainer.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        // 标题
        TextView titleView = new TextView(this);
        titleView.setText("API Services");
        titleView.setTextSize(24);
        titleView.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        titleView.setTypeface(null, Typeface.BOLD);
        titleView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.bottomMargin = dpToPx(4);
        titleView.setLayoutParams(titleParams);
        headerContainer.addView(titleView);

        // 副标题
        TextView subtitleView = new TextView(this);
        subtitleView.setText("SDK 功能接口测试");
        subtitleView.setTextSize(14);
        subtitleView.setTextColor(ContextCompat.getColor(this, R.color.text_secondary));
        subtitleView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subtitleParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        subtitleParams.bottomMargin = dpToPx(16);
        subtitleView.setLayoutParams(subtitleParams);
        headerContainer.addView(subtitleView);

        // 分类切换按钮容器
        LinearLayout categoryContainer = new LinearLayout(this);
        categoryContainer.setOrientation(LinearLayout.HORIZONTAL);
        categoryContainer.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams categoryParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        categoryParams.bottomMargin = dpToPx(16);
        categoryContainer.setLayoutParams(categoryParams);

        // API 按钮
        btnCategoryApi = new Button(this);
        btnCategoryApi.setText("API");
        btnCategoryApi.setTextSize(14);
        btnCategoryApi.setAllCaps(false);
        btnCategoryApi.setPadding(dpToPx(32), dpToPx(12), dpToPx(32), dpToPx(12));
        LinearLayout.LayoutParams apiParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        apiParams.setMargins(0, 0, dpToPx(8), 0);
        btnCategoryApi.setLayoutParams(apiParams);
        btnCategoryApi.setOnClickListener(v -> switchCategory(CATEGORY_API));
        categoryContainer.addView(btnCategoryApi);

        // UI 按钮
        btnCategoryUi = new Button(this);
        btnCategoryUi.setText("UI");
        btnCategoryUi.setTextSize(14);
        btnCategoryUi.setAllCaps(false);
        btnCategoryUi.setPadding(dpToPx(32), dpToPx(12), dpToPx(32), dpToPx(12));
        btnCategoryUi.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        btnCategoryUi.setOnClickListener(v -> switchCategory(CATEGORY_UI));
        categoryContainer.addView(btnCategoryUi);

        headerContainer.addView(categoryContainer);
        rootLayout.addView(headerContainer);

        // 滚动区域
        scrollView = new ScrollView(this);
        scrollView.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        // 模块容器
        modulesContainer = new LinearLayout(this);
        modulesContainer.setOrientation(LinearLayout.VERTICAL);
        modulesContainer.setPadding(padding, 0, padding, padding);
        modulesContainer.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        scrollView.addView(modulesContainer);
        rootLayout.addView(scrollView);

        setContentView(rootLayout);

        // 初始化显示 API 分类
        updateCategoryButtons();
        loadModules();
    }

    /**
     * 切换分类
     */
    private void switchCategory(int category) {
        if (currentCategory == category) return;
        currentCategory = category;
        updateCategoryButtons();
        loadModules();
        scrollView.scrollTo(0, 0);
    }

    /**
     * 更新分类按钮样式
     */
    private void updateCategoryButtons() {
        if (currentCategory == CATEGORY_API) {
            btnCategoryApi.setBackgroundResource(R.drawable.button_gradient);
            btnCategoryApi.setTextColor(ContextCompat.getColor(this, R.color.white));
            btnCategoryUi.setBackgroundResource(R.drawable.service_button_bg);
            btnCategoryUi.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        } else {
            btnCategoryUi.setBackgroundResource(R.drawable.button_gradient);
            btnCategoryUi.setTextColor(ContextCompat.getColor(this, R.color.white));
            btnCategoryApi.setBackgroundResource(R.drawable.service_button_bg);
            btnCategoryApi.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        }
    }

    /**
     * 加载模块列表
     */
    private void loadModules() {
        modulesContainer.removeAllViews();

        String[][] modules = currentCategory == CATEGORY_API ? API_MODULES : UI_MODULES;

        for (String[] module : modules) {
            addModuleSection(module);
        }
    }

    /**
     * 添加模块区块
     */
    private void addModuleSection(String[] module) {
        String moduleTitle = module[0];

        // 模块标题
        TextView titleView = new TextView(this);
        titleView.setText(moduleTitle);
        titleView.setTextSize(14);
        titleView.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        titleView.setTypeface(null, Typeface.BOLD);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dpToPx(16);
        titleParams.bottomMargin = dpToPx(8);
        titleView.setLayoutParams(titleParams);
        modulesContainer.addView(titleView);

        // 按钮容器
        LinearLayout buttonContainer = new LinearLayout(this);
        buttonContainer.setOrientation(LinearLayout.VERTICAL);
        buttonContainer.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        LinearLayout currentRow = null;
        int buttonsInRow = 0;

        for (int i = 1; i < module.length; i++) {
            String buttonTitle = module[i];

            if (buttonsInRow == 0) {
                currentRow = new LinearLayout(this);
                currentRow.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );
                rowParams.bottomMargin = dpToPx(8);
                currentRow.setLayoutParams(rowParams);
                buttonContainer.addView(currentRow);
            }

            Button button = createServiceButton(buttonTitle, moduleTitle);
            currentRow.addView(button);

            buttonsInRow++;
            if (buttonsInRow >= 2) {
                buttonsInRow = 0;
            }
        }

        modulesContainer.addView(buttonContainer);

        // 分割线
        View divider = new View(this);
        divider.setBackgroundColor(ContextCompat.getColor(this, R.color.divider));
        LinearLayout.LayoutParams dividerParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(1)
        );
        dividerParams.topMargin = dpToPx(8);
        divider.setLayoutParams(dividerParams);
        modulesContainer.addView(divider);
    }

    /**
     * 创建服务按钮
     */
    private Button createServiceButton(String title, String moduleTitle) {
        Button button = new Button(this);
        button.setText(title);
        button.setTextSize(12);
        button.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        button.setBackgroundResource(R.drawable.service_button_bg);
        button.setAllCaps(false);
        button.setPadding(dpToPx(12), dpToPx(8), dpToPx(12), dpToPx(8));

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1
        );
        params.setMargins(dpToPx(4), 0, dpToPx(4), 0);
        button.setLayoutParams(params);

        String categoryName = currentCategory == CATEGORY_API ? "API" : "UI";
        button.setOnClickListener(v -> onServiceClicked(categoryName, moduleTitle, title));

        return button;
    }

    /**
     * 服务按钮点击
     */
    private void onServiceClicked(String category, String module, String service) {
        // 初始化模块不需要检查 SDK 初始化状态
        if ("初始化".equals(module)) {
            handleInitModule(service);
            return;
        }

        // 其他功能需要检查 SDK 是否已初始化
        if (!sdkManager.isInitialized()) {
            showDialog("SDK 未初始化", "请先点击「初始化」模块中的「初始化SDK」后再使用其他 API 服务");
            return;
        }

        // 登录模块 (API)
        if ("登录".equals(module) && "API".equals(category)) {
            handleLoginModule(service);
            return;
        }

        // 登录模块 (UI)
        if ("登录".equals(module) && "UI".equals(category)) {
            handleLoginUIModule(service);
            return;
        }

        // 协议/法务模块 (UI)
        if ("协议/法务".equals(module)) {
            handleLegalUIModule(service);
            return;
        }

        // 实名/防沉迷模块 (UI)
        if ("实名/防沉迷".equals(module)) {
            handleRealAuthUIModule(service);
            return;
        }

        // 密码模块 (UI)
        if ("密码".equals(module) && "UI".equals(category)) {
            handlePasswordUIModule(service);
            return;
        }

        // 用户中心模块 (UI)
        if ("用户中心".equals(module)) {
            handleUserCenterUIModule(service);
            return;
        }

        // 账号注销模块 (UI)
        if ("账号注销".equals(module) && "UI".equals(category)) {
            handleDeregisterUIModule(service);
            return;
        }

        // 其他模块 (UI)
        if ("其他".equals(module) && "UI".equals(category)) {
            handleOtherUIModule(service);
            return;
        }

        // 配置模块
        if ("配置".equals(module)) {
            handleConfigModule(service);
            return;
        }

        // 信息获取模块
        if ("信息获取".equals(module)) {
            handleInfoModule(service);
            return;
        }

        // 验证码模块
        if ("验证码".equals(module)) {
            handleCaptchaModule(service);
            return;
        }

        // 账号绑定模块
        if ("账号绑定".equals(module)) {
            handleBindingModule(service);
            return;
        }

        // 密码模块
        if ("密码".equals(module)) {
            handlePasswordModule(service);
            return;
        }

        // 注册模块
        if ("注册".equals(module)) {
            handleRegisterModule(service);
            return;
        }

        // 实名认证模块
        if ("实名认证".equals(module)) {
            handleRealAuthModule(service);
            return;
        }

        // 设备信息模块
        if ("设备信息".equals(module)) {
            handleDeviceInfoModule(service);
            return;
        }

        // 游戏区服模块
        if ("游戏区服".equals(module)) {
            handleGameAreaModule(service);
            return;
        }

        // 游戏角色模块
        if ("游戏角色".equals(module)) {
            handleGameCharacterModule(service);
            return;
        }

        // 公告/邮件模块
        if ("公告/邮件".equals(module)) {
            handleAnnouncementMailModule(service);
            return;
        }

        // 反馈模块
        if ("反馈".equals(module)) {
            handleFeedbackModule(service);
            return;
        }

        // 福利码模块
        if ("福利码".equals(module)) {
            handleWelfareCodeModule(service);
            return;
        }

        // 埋点模块
        if ("埋点".equals(module)) {
            handleTrackingModule(service);
            return;
        }

        // 支付(IAP)模块
        if ("支付(IAP)".equals(module)) {
            handlePaymentModule(service);
            return;
        }

        // 分享模块
        if ("分享".equals(module)) {
            handleShareModule(service);
            return;
        }

        // 注销账号模块
        if ("注销账号".equals(module)) {
            handleDeregisterModule(service);
            return;
        }

        showDialog("[" + category + "] " + module + " - " + service, service + " 调用\n\n待实现具体功能");
    }

    /**
     * 处理登录 UI 模块
     */
    private void handleLoginUIModule(String service) {
        switch (service) {
            case "登录弹窗":
                showLoginUI();
                break;
            default:
                showDialog("登录UI模块", service + "\n\n待实现");
        }
    }

    // ==================== 登录 UI 模块实现 ====================

    /**
     * 显示登录弹窗 UI
     */
    private void showLoginUI() {
        // ========== 瑞雪 SDK 登录弹窗 UI ==========
        // 注意：需要添加 UI 模块依赖 implementation 'com.ruixue:rxsdk_base_ui:${version}'

        com.ruixue.openapi.RXLoginUIModel loginUIConfig = new com.ruixue.openapi.RXLoginUIModel();
        loginUIConfig.setLoginMode(1);  // 登录模式

        // 可选配置
        // loginUIConfig.setMethod(loginMethodList);  // 登录方式列表
        // loginUIConfig.setLoginOpenid(openid);      // 自动登录的 openid
        // Map<String, String> privacies = new HashMap<>();
        // privacies.put("隐私政策", "url https://example.com/privacy");
        // loginUIConfig.setPrivacies(privacies);

        com.ruixue.openapi.RXSdkUI.getInstance().showLoginUI(
                this,           // 当前 Activity
                loginUIConfig,  // 登录 UI 配置
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        String openid = data != null ? data.optString("openid") : "";
                        showDialog("登录成功", "openid: " + openid);
                    } else {
                        showDialog("登录失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理协议/法务 UI 模块
     */
    private void handleLegalUIModule(String service) {
        switch (service) {
            case "协议声明":
                showProtocolView();
                break;
            case "隐私政策弹框":
                showPrivacyPolicyDialog();
                break;
            default:
                showDialog("协议/法务模块", service + "\n\n待实现");
        }
    }

    // ==================== 协议/法务 UI 模块实现 ====================

    /**
     * 显示协议声明（全屏 H5 样式）
     */
    private void showProtocolView() {
        // ========== 瑞雪 SDK 协议声明 ==========
        // 需要添加 UI 模块依赖 implementation 'com.ruixue:rxsdk_base_ui:${version}'

        // 要展示的协议 key 列表
        // 常用 key: "00001" - 服务协议, "00002" - 隐私政策
        java.util.List<String> keyList = java.util.Arrays.asList("00001", "00002");
        String defaultKey = "00001";  // 默认展示服务协议

        com.ruixue.openapi.RXSdkUI.getInstance().protocolView(this, defaultKey, keyList).show();
    }

    /**
     * 显示隐私政策弹窗
     */
    private void showPrivacyPolicyDialog() {
        // ========== 瑞雪 SDK 隐私政策弹窗 ==========
        // 注意：需要添加 UI 模块依赖

        String title = "用户协议和隐私政策";
        String content = "<h3>隐私政策</h3><p>感谢您使用我们的产品和服务。我们非常重视您的隐私保护...</p>";

        com.ruixue.openapi.RXSdkUI.getInstance().userPrivacyPolicy(
                this,
                title,
                content,
                new com.ruixue.RXJSONCallback() {
                    @Override
                    public void onSuccess(JSONObject data) {
                        runOnUiThread(() -> showDialog("隐私政策", "用户同意协议"));
                    }

                    @Override
                    public void onFailed(JSONObject cause) {
                        runOnUiThread(() -> showDialog("隐私政策", "用户拒绝协议"));
                    }

                    @Override
                    public void onError(com.ruixue.error.RXException e) {
                        runOnUiThread(() -> showDialog("隐私政策错误", e.getMessage()));
                    }
                }
        ).show();
    }

    /**
     * 处理实名/防沉迷 UI 模块
     */
    private void handleRealAuthUIModule(String service) {
        switch (service) {
            case "实名认证弹窗":
                showRealAuthUI();
                break;
            case "防沉迷弹窗":
                showAntiAddictionUI();
                break;
            default:
                showDialog("实名/防沉迷模块", service + "\n\n待实现");
        }
    }

    // ==================== 实名/防沉迷 UI 模块实现 ====================

    /**
     * 显示实名认证弹窗
     */
    private void showRealAuthUI() {
        // ========== 瑞雪 SDK 实名认证弹窗 ==========
        // 注意：需要添加 UI 模块依赖 implementation 'com.ruixue:rxsdk_base_ui:${version}'

        boolean cancelable = true;  // 是否可关闭，false 表示强制实名

        com.ruixue.openapi.RXSdkUI.getInstance().realAuthUI(this, cancelable, new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("实名认证", "实名认证成功\n\n" + data.toString()));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("实名认证", "实名认证取消或失败"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("实名认证错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 显示防沉迷弹窗
     */
    private void showAntiAddictionUI() {
        // ========== 瑞雪 SDK 防沉迷弹窗 ==========

        String title = "防沉迷提示";
        String content = "根据国家最新法规规定，未进行实名认证的用户不能体验任何游戏内容。" +
                "当前账号游戏累计时间已超过限制，请合理安排游戏时间，做适当的身体活动。";
        String buttonText = "我知道了";

        com.ruixue.openapi.RXSdkUI.getInstance().antiAdditionView(this, title, content, buttonText, new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("防沉迷", "用户点击确认"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("防沉迷", "弹窗关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("防沉迷错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 处理密码 UI 模块
     */
    private void handlePasswordUIModule(String service) {
        switch (service) {
            case "找回密码":
                showForgotPasswordUI();
                break;
            case "设置密码":
                showChangePasswordUI();
                break;
            default:
                showDialog("密码模块", service + "\n\n待实现");
        }
    }

    // ==================== 密码 UI 模块实现 ====================

    /**
     * 显示找回密码弹窗
     */
    private void showForgotPasswordUI() {
        // ========== 瑞雪 SDK 找回密码弹窗 ==========
        // 注意：需要添加 UI 模块依赖

        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("username", "");           // 默认填充的账号（可选）
        params.put("account_type", 2);        // 账号类型：1-通用，2-手机号，3-邮箱
        params.put("password_hint", "请输入新密码");  // 密码输入提示（可选）

        com.ruixue.openapi.RXSdkUI.getInstance().findPassWordUI(this, params, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("找回密码", "密码重置成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("找回密码", "操作取消或失败"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("找回密码错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 显示设置/修改密码弹窗
     */
    private void showChangePasswordUI() {
        // ========== 瑞雪 SDK 修改密码弹窗 ==========
        // isPasswordSet: true 表示已设置密码（修改密码），false 表示未设置密码（设置密码）

        boolean isPasswordSet = false;  // 设置为 false 表示"设置密码"场景

        com.ruixue.openapi.RXSdkUI.getInstance().changePwdUI(this, isPasswordSet, new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("设置密码", "密码设置成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("设置密码", "操作取消或失败"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("设置密码错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 处理用户中心 UI 模块
     */
    private void handleUserCenterUIModule(String service) {
        switch (service) {
            case "用户中心":
                showUserCenterUI();
                break;
            case "帮助中心":
                showHelperCenterUI();
                break;
            default:
                showDialog("用户中心模块", service + "\n\n待实现");
        }
    }

    // ==================== 用户中心 UI 模块实现 ====================

    /**
     * 显示用户中心弹窗
     */
    private void showUserCenterUI() {
        // ========== 瑞雪 SDK 用户中心弹窗 ==========
        // 注意：需要添加 UI 模块依赖

        com.ruixue.openapi.RXUserCenterConfig config = new com.ruixue.openapi.RXUserCenterConfig();
        config.setGame_user_id("demo_user_001");   // 游戏用户 ID
        config.setNickname("Demo用户");            // 用户昵称
        config.setHead_img_url("");                // 用户头像 URL（可选）
        config.setQueue_name("default");           // 队列名称
        // config.setLightTheme(true);             // 是否使用浅色主题

        com.ruixue.openapi.RXSdkUI.getInstance().userCenterUI(this, config, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("用户中心", "操作成功\n\n" + data.toString()));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("用户中心", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("用户中心错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 显示帮助中心弹窗
     */
    private void showHelperCenterUI() {
        // ========== 瑞雪 SDK 帮助中心弹窗 ==========

        com.ruixue.openapi.RXUserCenterConfig config = new com.ruixue.openapi.RXUserCenterConfig();
        config.setGame_user_id("demo_user_001");
        config.setNickname("Demo用户");

        com.ruixue.openapi.RXSdkUI.getInstance().helperCenterUI(this, config, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("帮助中心", "操作成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("帮助中心", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("帮助中心错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 处理账号注销 UI 模块
     */
    private void handleDeregisterUIModule(String service) {
        switch (service) {
            case "申请注销UI":
                showApplyDeregisterUI();
                break;
            case "撤销注销UI":
                showDestroyAccountStatusUI();
                break;
            default:
                showDialog("账号注销UI模块", service + "\n\n待实现");
        }
    }

    // ==================== 账号注销 UI 模块实现 ====================

    /**
     * 显示申请注销 UI（H5 页面）
     */
    private void showApplyDeregisterUI() {
        // ========== 瑞雪 SDK 申请注销 UI ==========
        // 注意：需要添加 UI 模块依赖

        com.ruixue.openapi.RXUserCenterConfig config = new com.ruixue.openapi.RXUserCenterConfig();
        config.setGame_user_id("demo_user_001");   // 游戏用户 ID
        config.setNickname("Demo用户");            // 用户昵称
        config.setQueue_name("default");           // 队列名称

        com.ruixue.openapi.RXSdkUI.getInstance().applyForDeregisterUI(this, config, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("申请注销", "注销申请已提交"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("申请注销", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("申请注销错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 显示撤销注销弹窗
     */
    private void showDestroyAccountStatusUI() {
        // ========== 瑞雪 SDK 撤销注销弹窗 ==========
        // isLoginContinue: true 表示撤销后继续登录，false 表示撤销后退出登录

        boolean isLoginContinue = true;

        com.ruixue.openapi.RXSdkUI.getInstance().destroyAccountStatusView(this, isLoginContinue, new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("撤销注销", "撤销注销成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("撤销注销", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("撤销注销错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 处理其他 UI 模块
     */
    private void handleOtherUIModule(String service) {
        switch (service) {
            case "展示邮件":
                showMailCenterUI();
                break;
            case "绑定手机UI":
                showBindPhoneUI();
                break;
            case "绑定邮箱UI":
                showBindEmailUI();
                break;
            case "展示公告":
                showAnnounceUI();
                break;
            default:
                showDialog("其他UI模块", service + "\n\n待实现");
        }
    }

    // ==================== 其他 UI 模块实现 ====================

    /**
     * 展示邮件中心
     */
    private void showMailCenterUI() {
        // ========== 瑞雪 SDK 展示邮件中心 ==========
        String userId = "demo_user_001";  // 游戏用户 ID

        com.ruixue.openapi.RXSdkUI.getInstance().showMailCenter(this, userId).show();
    }

    /**
     * 绑定手机 UI
     */
    private void showBindPhoneUI() {
        // ========== 瑞雪 SDK 绑定手机 UI ==========

        com.ruixue.openapi.RXSdkUI.getInstance().bindPhoneUI(this, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("绑定手机", "绑定成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("绑定手机", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("绑定手机错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 绑定邮箱 UI
     */
    private void showBindEmailUI() {
        // ========== 瑞雪 SDK 绑定邮箱 UI ==========

        com.ruixue.openapi.RXSdkUI.getInstance().bindEmailUI(this, new com.ruixue.callback.RXUICallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> showDialog("绑定邮箱", "绑定成功"));
            }

            @Override
            public void onFailed(JSONObject cause) {
                runOnUiThread(() -> showDialog("绑定邮箱", "操作取消或关闭"));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                runOnUiThread(() -> showDialog("绑定邮箱错误", e.getMessage()));
            }
        }).show();
    }

    /**
     * 展示公告 UI
     */
    private void showAnnounceUI() {
        // ========== 瑞雪 SDK 展示公告 UI ==========

        int limit = 10;  // 读取公告条数

        com.ruixue.openapi.RXSdkUI.getInstance().showAnnounceView(this, limit, new com.ruixue.view.notice.NoticeCallback() {
            @Override
            public void onLink(String link) {
                runOnUiThread(() -> showDialog("公告链接", "用户点击: " + link));
            }

            @Override
            public void hasAnnounceUI(boolean isHas) {
                if (!isHas) {
                    runOnUiThread(() -> showDialog("公告", "暂无公告"));
                }
            }
        });
    }

    /**
     * 处理注销账号模块
     */
    private void handleDeregisterModule(String service) {
        switch (service) {
            case "申请注销":
                applyDeregister();
                break;
            case "撤销注销":
                cancelDeregister();
                break;
            default:
                showDialog("注销账号模块", service + "\n\n待实现");
        }
    }

    // ==================== 注销账号模块实现 ====================

    /**
     * 申请注销账号
     */
    private void applyDeregister() {
        // ========== 瑞雪 SDK 申请注销账号 ==========
        // 注意：注销有冷静期，期间可以撤销

        com.ruixue.openapi.RXDeregisterConfig config = new com.ruixue.openapi.RXDeregisterConfig();
        config.setIdCard("xxxxxx");       // 必填，身份证号码
        config.setRealName("测试用户");    // 必填，真实姓名
        // config.setCpData("custom_data");  // 可选，CP 自定义数据

        RXSDK.getInstance().deregister(
                config,  // 注销配置
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        String cancelDeadline = data != null ? data.optString("cancel_deadline") : "";
                        showDialog("申请注销成功", "注销申请已提交\n\n冷静期截止: " + cancelDeadline + "\n\n冷静期内可撤销注销");
                    } else {
                        showDialog("申请注销失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 撤销注销申请
     */
    private void cancelDeregister() {
        // ========== 瑞雪 SDK 撤销注销申请 ==========
        // 在冷静期内可以撤销注销申请

        RXSDK.getInstance().deregisterCancel(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("撤销注销成功", "账号已恢复正常");
                    } else {
                        showDialog("撤销注销失败", "错误码: " + code + "\n" + response.optString("msg") + "\n\n可能已超过冷静期");
                    }
                });
            }
        });
    }

    /**
     * 处理分享模块
     */
    private void handleShareModule(String service) {
        switch (service) {
            case "一键分享":
                doShare();
                break;
            case "自定义分享":
                doShareCustom();
                break;
            default:
                showDialog("分享模块", service + "\n\n待实现");
        }
    }

    // ==================== 分享模块实现 ====================

    /**
     * 一键分享
     */
    private void doShare() {
        // ========== 瑞雪 SDK 一键分享 ==========
        // 注意：需要配置对应分享平台的依赖和 SDK

        com.ruixue.openapi.RXShareConfig config = new com.ruixue.openapi.RXShareConfig();
        config.setFunc("share_func_id");       // 必填，埋点标识
        config.setPlatform("wechat");          // 必填，分享平台：wechat/system/facebook/messenger/line/tiktok/zalo
        config.setRegion("CN");                // 可选，地区码
        config.setTransmits("custom_data");    // 可选，透传参数
        config.setShareScene(0);               // 可选，0 好友，1 朋友圈
        config.setUseShortUrl(true);           // 可选，是否使用短链接
        config.setAutoReport(true);            // 可选，是否自动上报，默认 true

        RXSDK.getInstance().share(
                this,    // 当前 Activity
                config,  // 分享配置
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("分享成功", "分享到微信成功");
                    } else {
                        showDialog("分享失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 自定义分享
     */
    private void doShareCustom() {
        // ========== 瑞雪 SDK 自定义分享 ==========
        // 注意：需要配置对应分享平台的依赖和 SDK

        com.ruixue.openapi.RXCustomShareConfig config = new com.ruixue.openapi.RXCustomShareConfig();
        config.setPlatform("wechat");                      // 必填，分享平台
        config.setType("link");                            // 必填，分享类型：text/image/link/url
        config.setTitle("分享标题");                        // 可选，分享标题
        config.setDescription("分享描述");                  // 可选，分享描述
        config.setUrl("https://example.com/share");        // 可选，分享链接
        config.setImage("https://example.com/image.png");  // 可选，图片 url 或本地路径
        config.setShareScene(0);                           // 可选，0 好友，1 朋友圈

        RXSDK.getInstance().shareCustom(
                this,    // 当前 Activity
                config,  // 自定义分享配置
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("自定义分享成功", "分享成功");
                    } else {
                        showDialog("自定义分享失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理支付模块
     */
    private void handlePaymentModule(String service) {
        switch (service) {
            case "支付":
                doWechatPay();
                break;
            case "查询":
                tradeQuery();
                break;
            default:
                showDialog("支付(IAP)模块", service + "\n\n待实现");
        }
    }

    // ==================== 支付模块实现 ====================

    /**
     * 微信支付
     */
    private void doWechatPay() {
        // ========== 瑞雪 SDK 微信支付 ==========
        // ⚠️ 前置条件: 必须添加依赖 implementation 'com.ruixue:rxsdk_weixin_withpay:${version}'

        String payType = "wechat";              // 支付类型：wechat / alipay
        String goodsTag = "goods_001";          // 必填，瑞雪后台计费点名称
        String tradeNo = "order_" + System.currentTimeMillis();  // 必填，CP 订单号

        // 构造游戏信息
        // HQParams.GameInfo gameInfo = new HQParams.GameInfo();
        // gameInfo.setCpGameCharacterId("角色ID");  // 角色 ID
        // gameInfo.setCpGameServerId("区服ID");     // 区服 ID

        // 构造支付参数
        Map<String, Object> payParams = new HashMap<>();
        payParams.put("hq_type", payType);           // 支付类型
        payParams.put("goods_tag", goodsTag);        // 瑞雪后台计费点名称
        payParams.put("trade_no", tradeNo);          // CP 订单号
        payParams.put("transmit_args", "");          // CP 透传参数（可选）
        payParams.put("indulge_auth", 1);            // 防沉迷验证（自运营默认 1）
        // payParams.put("game_info", gameInfo.toMap()); // 游戏信息

        // 【可选】支付宝支付
        // String payType = "alipay";
        // payParams.put("hq_type", payType);

        RXSDK.getInstance().pay(
                this,        // 当前 Activity
                payParams,   // 支付参数
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        showDialog("支付成功", "订单号: " + tradeNo + "\n\n注意: 实际发货以服务端回调为准");
                    } else {
                        String msg = response.optString("msg");
                        String thirdcode = String.valueOf(response.opt("thirdcode"));
                        String thirdmsg = String.valueOf(response.opt("thirdmsg"));
                        showDialog("支付失败", "错误码: " + code + "\n" + msg +
                            "\n\nthirdcode: " + thirdcode + "\nthirdmsg: " + thirdmsg);
                    }
                });
            }
        });
    }

    /**
     * 查询订单状态
     */
    private void tradeQuery() {
        // ========== 瑞雪 SDK 查询订单状态 ==========
        String orderNo = "order_12345";  // 必填，订单号

        RXSDK.getInstance().tradeQuery(
                orderNo,  // 订单号
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        int status = data != null ? data.optInt("status", -1) : -1;
                        showDialog("查询订单成功", "订单号: " + orderNo + "\n状态: " + status);
                    } else {
                        showDialog("查询订单失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理埋点模块
     */
    private void handleTrackingModule(String service) {
        switch (service) {
            case "用户行为统计":
                trackUserAction();
                break;
            case "终止行为统计":
                stopTrackUserAction();
                break;
            default:
                showDialog("埋点模块", service + "\n\n待实现");
        }
    }

    // ==================== 埋点模块实现 ====================

    /**
     * 用户行为统计
     */
    private void trackUserAction() {
        // ========== 瑞雪 SDK 用户行为上报 ==========
        String userId = "user_openid";     // 必填，用户 ID
        String action = "button_click";    // 行为类型

        Map<String, Object> properties = new HashMap<>();
        properties.put("action", action);              // 行为类型
        properties.put("button_name", "purchase");     // 按钮名称
        properties.put("page", "shop");                // 页面名称
        properties.put("action_time", System.currentTimeMillis());  // 行为时间

        RXSDK.getInstance().trackUserAction(
                userId,      // 用户 ID
                properties   // 属性
        );

        showDialog("用户行为统计", "行为已上报\n\n用户ID: " + userId + 
            "\n行为: " + action + "\n页面: shop");
    }

    /**
     * 终止行为统计
     */
    private void stopTrackUserAction() {
        // ========== 瑞雪 SDK 停止用户行为上报 ==========
        RXSDK.getInstance().stopTrackUserAction();

        showDialog("终止行为统计", "用户行为上报已停止");
    }

    /**
     * 处理福利码模块
     */
    private void handleWelfareCodeModule(String service) {
        switch (service) {
            case "请求福利码":
                getPromoDisplayKey();
                break;
            case "兑换福利码":
                exchangePromoCode();
                break;
            default:
                showDialog("福利码模块", service + "\n\n待实现");
        }
    }

    // ==================== 福利码模块实现 ====================

    /**
     * 请求福利码
     */
    private void getPromoDisplayKey() {
        // ========== 瑞雪 SDK 获取达人福利码 ==========
        boolean autoRefresh = true;  // true: 如果过期自动刷新，false: 直接返回当前值

        RXSDK.getInstance().getPromoDisplayKEY(
                autoRefresh,  // 是否自动刷新
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            String promoKey = data.optString("promo_key");
                            long expireTime = data.optLong("expire_time");
                            boolean isPromoUser = data.optBoolean("is_promo_user", false);

                            if (isPromoUser) {
                                showDialog("获取福利码成功", 
                                    "福利码: " + promoKey + "\n过期时间: " + expireTime);
                            } else {
                                showDialog("获取福利码", "当前用户不是达人");
                            }
                        } else {
                            showDialog("获取福利码", "数据为空");
                        }
                    } else {
                        showDialog("获取福利码失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 兑换福利码
     */
    private void exchangePromoCode() {
        // ========== 瑞雪 SDK 兑换达人福利码 ==========
        String cdKey = "PROMO123456";  // 必填，福利码

        RXSDK.getInstance().exchangePromoCDKEY(
                cdKey,  // 福利码
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            JSONArray rewards = data.optJSONArray("rewards");
                            showDialog("兑换福利码成功", 
                                "福利码: " + cdKey + "\n\n奖励: " + (rewards != null ? rewards.toString() : "无"));
                        } else {
                            showDialog("兑换福利码成功", "福利码: " + cdKey);
                        }
                    } else {
                        String msg = response.optString("msg");
                        showDialog("兑换福利码失败", "错误码: " + code + "\n" + msg + 
                            "\n\n常见原因:\n• 福利码无效\n• 已被使用\n• 已过期");
                    }
                });
            }
        });
    }

    /**
     * 处理反馈模块
     */
    private void handleFeedbackModule(String service) {
        switch (service) {
            case "创建反馈":
                createFeedback();
                break;
            case "获取反馈列表":
                getFeedbackList();
                break;
            case "获取反馈详情":
                getFeedbackDetail();
                break;
            case "领取反馈道具":
                getFeedbackAward();
                break;
            case "获取反馈类型":
                getFeedbackKindList();
                break;
            case "创建意见反馈":
                createOpinionFeedback();
                break;
            case "满意度评价":
                satisfactionEvaluation();
                break;
            case "上报反馈日志":
                reportFeedbackLog();
                break;
            default:
                showDialog("反馈模块", service + "\n\n待实现");
        }
    }

    // ==================== 反馈模块实现 ====================

    /**
     * 创建反馈
     */
    private void createFeedback() {
        // ========== 瑞雪 SDK 创建反馈 ==========
        String kindId = "bug_report";          // 必填，反馈类型 ID
        String content = "游戏闪退问题描述";    // 必填，反馈内容
        String contact = "13800138000";         // 可选，联系方式

        Map<String, Object> params = new HashMap<>();
        params.put("kind_id", kindId);          // 反馈类型 ID
        params.put("content", content);         // 反馈内容
        params.put("contact", contact);         // 联系方式

        RXSDK.getInstance().createFeedback(
                params,  // 反馈参数
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("创建反馈成功", "反馈已提交\n\n类型: " + kindId + "\n内容: " + content);
                    } else {
                        showDialog("创建反馈失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取反馈列表
     */
    private void getFeedbackList() {
        // ========== 瑞雪 SDK 获取反馈列表 ==========
        int page = 1;    // 必填，页数
        int size = 10;   // 必填，每页个数
        int status = 0;  // 必填，状态（0=所有，1=未处理，2=已处理）

        RXSDK.getInstance().getFeedbackList(
                page,    // 页数
                size,    // 每页个数
                status,  // 状态
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 条反馈:\n\n");
                            for (int i = 0; i < Math.min(list.length(), 5); i++) {
                                JSONObject item = list.optJSONObject(i);
                                sb.append("• [").append(item.optString("id")).append("] ")
                                  .append(item.optString("content", "").substring(0, Math.min(item.optString("content", "").length(), 20)))
                                  .append("...\n");
                            }
                            showDialog("反馈列表", sb.toString());
                        } else {
                            showDialog("反馈列表", "暂无反馈记录");
                        }
                    } else {
                        showDialog("获取反馈列表失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取反馈详情
     */
    private void getFeedbackDetail() {
        // ========== 瑞雪 SDK 获取反馈详情 ==========
        int feedbackId = 12345;  // 必填，反馈 ID
        
        RXSDK.getInstance().getFeedbackDetail(
                feedbackId,  // 反馈 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            showDialog("反馈详情", 
                                "ID: " + data.optString("id") + "\n" +
                                "内容: " + data.optString("content") + "\n" +
                                "状态: " + data.optString("status"));
                        } else {
                            showDialog("反馈详情", "数据为空");
                        }
                    } else {
                        showDialog("获取反馈详情失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 领取反馈道具
     */
    private void getFeedbackAward() {
        // ========== 瑞雪 SDK 领取反馈道具 ==========
        int feedbackId = 12345;  // 必填，反馈 ID
        
        RXSDK.getInstance().feedbackGetprop(
                feedbackId,  // 反馈 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("领取道具成功", "反馈ID: " + feedbackId + "\n\n道具已领取");
                    } else {
                        showDialog("领取道具失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取反馈类型列表
     */
    private void getFeedbackKindList() {
        // ========== 瑞雪 SDK 获取反馈类型 ==========
        RXSDK.getInstance().getFeedbackKindList(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 种反馈类型:\n\n");
                            for (int i = 0; i < list.length(); i++) {
                                JSONObject item = list.optJSONObject(i);
                                sb.append("• ").append(item.optString("kind_id")).append(" - ")
                                  .append(item.optString("kind_name")).append("\n");
                            }
                            showDialog("反馈类型", sb.toString());
                        } else {
                            showDialog("反馈类型", "暂无反馈类型");
                        }
                    } else {
                        showDialog("获取反馈类型失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 创建意见反馈
     */
    private void createOpinionFeedback() {
        // ========== 瑞雪 SDK 创建意见反馈 ==========
        String content = "这是一条意见反馈";  // 必填，反馈内容
        String phone = "13800138000";          // 必填，手机号
        
        RXSDK.getInstance().feedbackCreate(
                content,  // 反馈内容
                null,     // 附件地址数组（可选）
                phone,    // 手机号
                null,     // 游戏透传标识（可选）
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("创建意见反馈成功", "反馈内容: " + content + "\n联系方式: " + phone);
                    } else {
                        showDialog("创建意见反馈失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 满意度评价
     */
    private void satisfactionEvaluation() {
        // ========== 瑞雪 SDK 满意度评价 ==========
        String feedbackId = "12345";   // 必填，反馈 ID
        int score = 5;                  // 必填，评分（1-5）
        String comment = "问题解决很快"; // 可选，评价内容

        Map<String, Object> params = new HashMap<>();
        params.put("feedback_id", feedbackId);  // 反馈 ID
        params.put("score", score);             // 评分
        params.put("comment", comment);         // 评价内容

        RXSDK.getInstance().satisfactionEvaluation(
                params,  // 评价参数
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("满意度评价成功", "反馈ID: " + feedbackId + "\n评分: " + score + "\n评价: " + comment);
                    } else {
                        showDialog("满意度评价失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 上报反馈日志
     */
    private void reportFeedbackLog() {
        // ========== 瑞雪 SDK 上报反馈日志 ==========
        // 注意：实际使用时需要传入真实的日志文件数据
        showDialog("上报反馈日志", "请在实际项目中读取日志文件并调用:\n\nRXSDK.getInstance().reportFeedbackLog(logData, callback)");
    }

    /**
     * 处理公告/邮件模块
     */
    private void handleAnnouncementMailModule(String service) {
        switch (service) {
            case "获取公告列表":
                getAnnouncement();
                break;
            case "获取临时公告":
                getTempNotice();
                break;
            case "获取邮件列表":
                getEmailList();
                break;
            case "获取邮件详情":
                getEmailDetail();
                break;
            case "领取道具":
                getEmailAward();
                break;
            case "删除邮件":
                deleteEmailAction();
                break;
            default:
                showDialog("公告/邮件模块", service + "\n\n待实现");
        }
    }

    // ==================== 公告/邮件模块实现 ====================

    /**
     * 获取公告列表
     */
    private void getAnnouncement() {
        // ========== 瑞雪 SDK 获取公告列表 ==========
        int limit = 10;  // 必填，获取条数（1-100）
        
        RXSDK.getInstance().getAnnouncement(
                limit,  // 获取条数
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 条公告:\n\n");
                            for (int i = 0; i < Math.min(list.length(), 5); i++) {
                                JSONObject item = list.optJSONObject(i);
                                sb.append("• ").append(item.optString("title")).append("\n");
                            }
                            showDialog("公告列表", sb.toString());
                        } else {
                            showDialog("公告列表", "暂无公告");
                        }
                    } else {
                        showDialog("获取公告失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取临时公告
     */
    private void getTempNotice() {
        // ========== 瑞雪 SDK 获取临时公告 ==========
        RXSDK.getInstance().getTempNotice(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            String title = data.optString("title");
                            String content = data.optString("content");
                            showDialog("临时公告", "标题: " + title + "\n\n内容: " + content);
                        } else {
                            showDialog("临时公告", "暂无临时公告");
                        }
                    } else {
                        showDialog("获取临时公告失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取邮件列表
     */
    private void getEmailList() {
        // ========== 瑞雪 SDK 获取邮件列表 ==========
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        
        RXSDK.getInstance().getEmailList(
                cpUserId,  // CP 用户 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 封邮件:\n\n");
                            for (int i = 0; i < Math.min(list.length(), 5); i++) {
                                JSONObject item = list.optJSONObject(i);
                                sb.append("• [").append(item.optString("id")).append("] ")
                                  .append(item.optString("title")).append("\n");
                            }
                            showDialog("邮件列表", sb.toString());
                        } else {
                            showDialog("邮件列表", "暂无邮件");
                        }
                    } else {
                        showDialog("获取邮件列表失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 获取邮件详情
     */
    private void getEmailDetail() {
        // ========== 瑞雪 SDK 获取邮件详情 ==========
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        int emailId = 12345;                 // 必填，邮件 ID
        
        RXSDK.getInstance().getEmailDetail(
                cpUserId,  // CP 用户 ID
                emailId,   // 邮件 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            String title = data.optString("title");
                            String content = data.optString("content");
                            showDialog("邮件详情", "标题: " + title + "\n\n内容: " + content);
                        } else {
                            showDialog("邮件详情", "数据为空");
                        }
                    } else {
                        showDialog("获取邮件详情失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 领取邮件道具
     */
    private void getEmailAward() {
        // ========== 瑞雪 SDK 领取邮件道具 ==========
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        int type = 1;                        // 必填，领取类型（1=领取当前，2=一键领取所有）
        int emailId = 12345;                 // 必填，邮件 ID（type=2 时可传 0）
        
        RXSDK.getInstance().getEmailAward(
                cpUserId,  // CP 用户 ID
                type,      // 领取类型
                emailId,   // 邮件 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("领取道具成功", "邮件ID: " + emailId + "\n\n道具已领取");
                    } else {
                        showDialog("领取道具失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 删除邮件
     */
    private void deleteEmailAction() {
        // ========== 瑞雪 SDK 删除邮件 ==========
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        int type = 1;                        // 必填，删除类型（1=删除当前，2=一键删除所有）
        int emailId = 12345;                 // 必填，邮件 ID（type=2 时可传 0）
        
        RXSDK.getInstance().deleteEmail(
                cpUserId,  // CP 用户 ID
                type,      // 删除类型
                emailId,   // 邮件 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("删除邮件成功", "邮件ID: " + emailId + "\n\n已删除");
                    } else {
                        showDialog("删除邮件失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理游戏角色模块
     */
    private void handleGameCharacterModule(String service) {
        switch (service) {
            case "创建角色":
                createGameCharacter();
                break;
            case "修改角色":
                updateGameCharacter();
                break;
            case "删除角色":
                deleteGameCharacter();
                break;
            case "查询角色列表":
                searchGameCharacterList();
                break;
            case "查询角色信息":
                searchGameCharacterInfo();
                break;
            case "查询游戏账号":
                searchGameAccount();
                break;
            default:
                showDialog("游戏角色模块", service + "\n\n待实现");
        }
    }

    // ==================== 游戏角色模块实现 ====================

    /**
     * 创建游戏角色
     */
    private void createGameCharacter() {
        // ========== 瑞雪 SDK 创建游戏角色 ==========
        String areaId = "server_001";                                // 必填，区服 ID
        String characterName = "测试角色";                            // 必填，角色名称
        String characterLevel = "1";                                 // 必填，角色等级
        String characterFaction = "联盟";                             // 可选，阵营
        String characterProfession = "战士";                          // 可选，职业
        String characterStatus = "normal";                           // 可选，状态
        String characterType = "main";                               // 可选，类型
        String characterVipLevel = "0";                              // 可选，VIP 等级
        String cpUserId = "cp_user_" + System.currentTimeMillis();   // 必填，CP 用户 ID
        
        // 扩展字段（可选）
        Map<String, Object> extension = new HashMap<>();
        extension.put("combat_power", 1000);
        
        RXSDK.getInstance().createGameCharacter(
                areaId,              // 区服 ID
                characterName,       // 角色名称
                characterLevel,      // 角色等级
                characterFaction,    // 阵营
                characterProfession, // 职业
                characterStatus,     // 状态
                characterType,       // 类型
                characterVipLevel,   // VIP 等级
                cpUserId,            // CP 用户 ID
                extension,           // 扩展字段
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                JSONObject data = response.optJSONObject("data");
                                String characterId = data != null ? data.optString("character_id") : "";
                                showDialog("创建角色成功", 
                                    "角色ID: " + characterId + "\n" +
                                    "角色名: " + characterName + "\n" +
                                    "等级: " + characterLevel + "\n" +
                                    "职业: " + characterProfession);
                            } else {
                                showDialog("创建角色失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 修改游戏角色
     */
    private void updateGameCharacter() {
        // ========== 瑞雪 SDK 更新角色信息 ==========
        String characterId = "char_001";    // 必填，角色 ID
        String newLevel = "50";             // 新等级
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        
        // 扩展字段（可选）
        Map<String, Object> extension = new HashMap<>();
        extension.put("combat_power", 5000);
        
        RXSDK.getInstance().updateGameCharacterInfo(
                characterId,       // 必填，角色 ID
                null,              // 区服 ID（不修改传 null）
                null,              // 阵营（不修改传 null）
                newLevel,          // 角色等级
                null,              // 角色名称（不修改传 null）
                null,              // 职业（不修改传 null）
                null,              // 状态（不修改传 null）
                null,              // 类型（不修改传 null）
                null,              // VIP 等级（不修改传 null）
                cpUserId,          // 必填，CP 用户 ID
                extension,         // 扩展字段
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                showDialog("修改角色成功", "角色ID: " + characterId + "\n新等级: " + newLevel);
                            } else {
                                showDialog("修改角色失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 删除游戏角色
     */
    private void deleteGameCharacter() {
        // ========== 瑞雪 SDK 删除角色 ==========
        String areaId = "server_001";        // 必填，区服 ID
        String characterId = "char_001";     // 必填，角色 ID
        String cpUserId = "cp_user_12345";   // 必填，CP 用户 ID
        
        RXSDK.getInstance().deleteGameCharacter(
                areaId,        // 区服 ID
                characterId,   // 角色 ID
                cpUserId,      // CP 用户 ID
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                showDialog("删除角色成功", "已删除角色: " + characterId);
                            } else {
                                showDialog("删除角色失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 查询角色列表
     */
    private void searchGameCharacterList() {
        // ========== 瑞雪 SDK 查询角色列表 ==========
        String cpUserId = "cp_user_12345";  // 必填，CP 用户 ID
        
        RXSDK.getInstance().searchGameCharacterListInfo(
                cpUserId,  // CP 用户 ID
                new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 个角色:\n\n");
                            for (int i = 0; i < list.length(); i++) {
                                JSONObject character = list.optJSONObject(i);
                                sb.append("• ").append(character.optString("character_name"))
                                  .append(" Lv.").append(character.optString("character_level"))
                                  .append(" [").append(character.optString("area_id")).append("]\n");
                            }
                            showDialog("角色列表", sb.toString());
                        } else {
                            showDialog("角色列表", "暂无角色数据");
                        }
                    } else {
                        showDialog("查询角色列表失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 查询角色信息
     */
    private void searchGameCharacterInfo() {
        // ========== 瑞雪 SDK 查询角色详情 ==========
        String cpUserId = "cp_user_12345";   // 必填，CP 用户 ID
        String areaId = "server_001";        // 必填，区服 ID
        String characterId = "char_001";     // 必填，角色 ID
        
        RXSDK.getInstance().searchGameCharacterInfo(
                cpUserId,      // CP 用户 ID
                areaId,        // 区服 ID
                characterId,   // 角色 ID
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                JSONObject data = response.optJSONObject("data");
                                if (data != null) {
                                    showDialog("角色信息", 
                                        "角色ID: " + data.optString("character_id") + "\n" +
                                        "角色名: " + data.optString("character_name") + "\n" +
                                        "等级: " + data.optString("character_level") + "\n" +
                                        "职业: " + data.optString("character_profession") + "\n" +
                                        "VIP: " + data.optString("character_vip_level"));
                                } else {
                                    showDialog("角色信息", "数据为空");
                                }
                            } else {
                                showDialog("查询角色信息失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 查询游戏账号
     */
    private void searchGameAccount() {
        // ========== 瑞雪 SDK 查询游戏账号 ==========
        RXSDK.getInstance().searchGameAccount(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        showDialog("游戏账号信息", data != null ? data.toString() : "无数据");
                    } else {
                        showDialog("查询游戏账号失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理游戏区服模块
     */
    private void handleGameAreaModule(String service) {
        switch (service) {
            case "查询区服":
                searchGameAreaInfo();
                break;
            case "查询区服列表":
                searchGameAreaListInfo();
                break;
            case "创建区服":
                createGameArea();
                break;
            case "修改区服":
                updateGameAreaInfo();
                break;
            case "删除区服":
                deleteGameArea();
                break;
            default:
                showDialog("游戏区服模块", service + "\n\n待实现");
        }
    }

    // ==================== 游戏区服模块实现 ====================

    /**
     * 查询区服信息
     */
    private void searchGameAreaInfo() {
        // ========== 瑞雪 SDK 查询区服信息 ==========
        String areaId = "server_001";
        
        RXSDK.getInstance().searchGameAreaInfo(areaId, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            String areaName = data.optString("area_name");
                            String areaStatus = data.optString("area_status");
                            String areaType = data.optString("area_type");
                            showDialog("查询区服成功", 
                                "区服ID: " + areaId + "\n" +
                                "区服名称: " + areaName + "\n" +
                                "状态: " + areaStatus + "\n" +
                                "类型: " + areaType);
                        } else {
                            showDialog("查询区服成功", "区服数据为空");
                        }
                    } else {
                        showDialog("查询区服失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 查询区服列表
     */
    private void searchGameAreaListInfo() {
        // ========== 瑞雪 SDK 查询区服列表 ==========
        RXSDK.getInstance().searchGameAreaListInfo(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONArray list = response.optJSONArray("data");
                        if (list != null && list.length() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("共 ").append(list.length()).append(" 个区服:\n\n");
                            for (int i = 0; i < list.length(); i++) {
                                JSONObject area = list.optJSONObject(i);
                                sb.append("• ").append(area.optString("area_id"))
                                  .append(" - ").append(area.optString("area_name"))
                                  .append(" [").append(area.optString("area_status")).append("]\n");
                            }
                            showDialog("区服列表", sb.toString());
                        } else {
                            showDialog("区服列表", "暂无区服数据");
                        }
                    } else {
                        showDialog("查询区服列表失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 创建区服
     */
    private void createGameArea() {
        // ========== 瑞雪 SDK 创建区服 ==========
        String areaId = "server_" + System.currentTimeMillis();
        String areaName = "测试区服";
        String areaStatus = "new";
        String areaType = "pve";
        
        Map<String, Object> extension = new HashMap<>();
        extension.put("max_players", 10000);
        
        RXSDK.getInstance().createGameArea(areaId, areaName, areaStatus, areaType, extension,
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                showDialog("创建区服成功", 
                                    "区服ID: " + areaId + "\n" +
                                    "区服名称: " + areaName + "\n" +
                                    "状态: " + areaStatus);
                            } else {
                                showDialog("创建区服失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 修改区服信息
     */
    private void updateGameAreaInfo() {
        // ========== 瑞雪 SDK 更新区服信息 ==========
        String areaId = "server_001";
        String areaStatus = "hot";
        
        RXSDK.getInstance().updateGameAreaInfo(areaId, null, areaStatus, null, null,
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                showDialog("修改区服成功", "区服ID: " + areaId + "\n新状态: " + areaStatus);
                            } else {
                                showDialog("修改区服失败", "错误码: " + code + "\n" + response.optString("msg"));
                            }
                        });
                    }
                });
    }

    /**
     * 删除区服
     */
    private void deleteGameArea() {
        // ========== 瑞雪 SDK 删除区服 ==========
        String areaId = "server_001";
        
        RXSDK.getInstance().deleteGameArea(areaId, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        showDialog("删除区服成功", "已删除区服: " + areaId);
                    } else {
                        showDialog("删除区服失败", "错误码: " + code + "\n" + response.optString("msg"));
                    }
                });
            }
        });
    }

    /**
     * 处理设备信息模块
     */
    private void handleDeviceInfoModule(String service) {
        switch (service) {
            case "获取设备码":
                getDeviceCode();
                break;
            case "获取时区偏移":
                getTimeZoneOffset();
                break;
            case "获取系统语言":
                getSystemLanguage();
                break;
            default:
                showDialog("设备信息模块", service + "\n\n待实现");
        }
    }

    // ==================== 设备信息模块实现 ====================

    /**
     * 获取设备码
     */
    private void getDeviceCode() {
        // ========== 瑞雪 SDK 获取设备码 ==========
        String deviceCode = RXSDK.getInstance().getDeviceCode(this);
        Log.d("RXSDK", "设备码: " + deviceCode);
        showDialog("获取设备码", "设备码:\n" + deviceCode);
    }

    /**
     * 获取时区偏移
     */
    private void getTimeZoneOffset() {
        // ========== 瑞雪 SDK 获取时区偏移 ==========
        String offset = RXSDK.getInstance().getTimeZoneOffset();
        Log.d("RXSDK", "时区偏移: " + offset);
        showDialog("获取时区偏移", "时区偏移: " + offset);
    }

    /**
     * 获取系统语言
     */
    private void getSystemLanguage() {
        // ========== 瑞雪 SDK 获取系统语言 ==========
        String language = RXSDK.getInstance().getSystemLanguage();
        Log.d("RXSDK", "系统语言: " + language);
        showDialog("获取系统语言", "系统语言: " + language);
    }


    /**
     * 处理实名认证模块
     */
    private void handleRealAuthModule(String service) {
        switch (service) {
            case "实名认证":
                realAuth();
                break;
            case "IIFAA快速实名":
                getIIFAARedirectURL();
                break;
            default:
                showDialog("实名认证模块", service + "\n\n待实现");
        }
    }

    // ==================== 实名认证模块实现 ====================

    /**
     * 实名认证
     */
    private void realAuth() {
        // ========== 瑞雪 SDK 实名认证 ==========
        String realname = "张三";                 // 必填，真实姓名
        String idcard = "110101199001011234";     // 必填，18位身份证号码
        
        Toast.makeText(this, "正在进行实名认证...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().realAuth(realname, idcard, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "实名认证成功");
                        JSONObject data = response.optJSONObject("data");
                        if (data != null) {
                            int age = data.optInt("age", 0);
                            boolean isAdult = age >= 18;
                            String pi = data.optString("pi", "");
                            showDialog("实名认证成功", 
                                "姓名: " + realname + "\n" +
                                "身份证: " + idcard.substring(0, 6) + "****" + idcard.substring(14) + "\n" +
                                "年龄: " + age + "\n" +
                                "是否成年: " + (isAdult ? "是" : "否") + "\n" +
                                "PI: " + pi);
                        } else {
                            showDialog("实名认证成功", "认证完成");
                        }
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "实名认证失败: " + msg);
                        showDialog("实名认证失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 获取 IIFAA 支付宝授权跳转地址（快速实名）
     */
    private void getIIFAARedirectURL() {
        String appName = "测试应用";
        String thirdPartSchema = "rxsdkdemo://";

        Toast.makeText(this, "正在获取IIFAA跳转地址...", Toast.LENGTH_SHORT).show();

        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("app_name", appName);
        params.put("third_part_schema", thirdPartSchema);

        com.ruixue.openapi.RXApiHelper.Passport.getIIFAARedirectURL(params, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        String redirectURL = data != null ? data.optString("redirect_url", "") : "";
                        showDialog("IIFAA快速实名", "跳转地址:\n" + redirectURL);
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        showDialog("IIFAA快速实名失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 处理注册模块
     */
    private void handleRegisterModule(String service) {
        switch (service) {
            case "注册账号":
                registerAccount();
                break;
            default:
                showDialog("注册模块", service + "\n\n待实现");
        }
    }

    // ==================== 注册模块实现 ====================

    /**
     * 注册账号
     */
    private void registerAccount() {
        // ========== 瑞雪 SDK 用户注册 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: register）
        String phone = "15043052309";        // 手机号
        String password = "123456";          // 密码
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在注册...", Toast.LENGTH_SHORT).show();
        
        // 构造注册参数（使用 setter 方法）
        RegisterParams params = new RegisterParams();
        params.setUsername(phone);           // 必填，用户名（手机号/邮箱）
        params.setPassword(password);        // 必填，密码
        params.setCaptcha_code(captchaCode); // 必填，验证码
        // params.setNickname("昵称");       // 可选，昵称
        // params.setSex("1");               // 可选，性别 1男 0女
        // params.setAvatarUrl("");          // 可选，头像URL
        
        RXSDK.getInstance().register(params, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        Log.d("RXSDK", "注册成功: " + data);
                        showDialog("注册成功", "手机号: " + phone + "\n\n注册成功，可以使用该账号登录");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "注册失败: " + msg);
                        showDialog("注册失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 处理密码模块
     */
    private void handlePasswordModule(String service) {
        switch (service) {
            case "修改密码":
                changePassword();
                break;
            case "重置密码":
                resetPassword();
                break;
            default:
                showDialog("密码模块", service + "\n\n待实现");
        }
    }

    // ==================== 密码模块实现 ====================

    /**
     * 修改密码
     */
    private void changePassword() {
        // ========== 瑞雪 SDK 修改密码 ==========
        String oldPassword = "111111";       // 旧密码
        String newPassword = "123456";       // 新密码
        
        Toast.makeText(this, "正在修改密码...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().changePassword(oldPassword, newPassword, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "密码修改成功");
                        showDialog("修改密码成功", "密码已修改\n\n建议重新登录");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "密码修改失败: " + msg);
                        showDialog("修改密码失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 重置密码
     */
    private void resetPassword() {
        // ========== 瑞雪 SDK 重置密码 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: resetpwd）
        String phone = "15043052308";        // 手机号
        String newPassword = "123456";       // 新密码
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在重置密码...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().resetPassword(phone, newPassword, captchaCode, null, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "密码重置成功");
                        showDialog("重置密码成功", "手机号: " + phone + "\n\n密码已重置，请重新登录");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "密码重置失败: " + msg);
                        showDialog("重置密码失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 处理账号绑定模块
     */
    private void handleBindingModule(String service) {
        switch (service) {
            case "绑定邮箱":
                bindEmail();
                break;
            case "解绑邮箱":
                unbindEmail();
                break;
            case "绑定手机":
                bindPhone();
                break;
            case "解绑手机":
                unbindPhone();
                break;
            case "修改手机号":
                changePhone();
                break;
            default:
                showDialog("账号绑定", service + "\n\n待实现");
        }
    }

    // ==================== 账号绑定模块实现 ====================

    /**
     * 绑定邮箱
     */
    private void bindEmail() {
        // ========== 瑞雪 SDK 绑定邮箱 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: bindemail）
        String email = "test@example.com";   // 邮箱地址
        String password = "123456";          // 密码
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在绑定邮箱...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().bindEmail(email, password, captchaCode, null, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "邮箱绑定成功");
                        showDialog("绑定邮箱成功", "邮箱: " + email + "\n\n绑定成功");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "邮箱绑定失败: " + msg);
                        showDialog("绑定邮箱失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 解绑邮箱
     */
    private void unbindEmail() {
        // ========== 瑞雪 SDK 解绑邮箱 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: unbindemail）
        String email = "test@example.com";   // 当前绑定的邮箱
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在解绑邮箱...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().unBindEmail(email, captchaCode, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "邮箱解绑成功");
                        showDialog("解绑邮箱成功", "邮箱: " + email + "\n\n解绑成功");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "邮箱解绑失败: " + msg);
                        showDialog("解绑邮箱失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 绑定手机
     */
    private void bindPhone() {
        // ========== 瑞雪 SDK 绑定手机 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: bindphone）
        String phone = "15043052309";        // 手机号
        String password = "123456";          // 密码
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在绑定手机...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().bindPhone(phone, password, captchaCode, null, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "手机绑定成功");
                        showDialog("绑定手机成功", "手机号: " + phone + "\n\n绑定成功");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "手机绑定失败: " + msg);
                        showDialog("绑定手机失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 解绑手机
     */
    private void unbindPhone() {
        // ========== 瑞雪 SDK 解绑手机 ==========
        // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: unbindphone）
        String phone = "15043052309";        // 当前绑定的手机号
        String captchaCode = "1111";         // 验证码
        
        Toast.makeText(this, "正在解绑手机...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().unBindPhone(phone, captchaCode, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "手机解绑成功");
                        showDialog("解绑手机成功", "手机号: " + phone + "\n\n解绑成功");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "手机解绑失败: " + msg);
                        showDialog("解绑手机失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 修改手机号
     */
    private void changePhone() {
        // ========== 瑞雪 SDK 修改手机号 ==========
        // 前置条件：需要先给新旧手机都发送验证码
        String newPhone = "13900139000";     // 新手机号
        String newPhoneCaptcha = "1111";     // 新手机验证码
        String oldPhoneCaptcha = "1111";     // 旧手机验证码
        
        Toast.makeText(this, "正在修改手机号...", Toast.LENGTH_SHORT).show();
        
        RXSDK.getInstance().changePhone(newPhone, newPhoneCaptcha, oldPhoneCaptcha, null, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        Log.d("RXSDK", "手机号修改成功");
                        showDialog("修改手机号成功", "新手机号: " + newPhone + "\n\n修改成功");
                    } else {
                        String msg = response.optString("msg", "未知错误");
                        Log.e("RXSDK", "手机号修改失败: " + msg);
                        showDialog("修改手机号失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 处理验证码模块
     */
    private void handleCaptchaModule(String service) {
        switch (service) {
            case "发送验证码":
                showSendCaptchaDialog();
                break;
            case "校验验证码":
                showVerifyCaptchaDialog();
                break;
            default:
                showDialog("验证码模块", service + "\n\n待实现");
        }
    }

    /**
     * 显示发送验证码对话框
     */
    private void showSendCaptchaDialog() {
        // 用途选项
        String[] purposes = {
            "注册 (register)",
            "登录 (login)",
            "绑定手机 (bindphone)",
            "解绑手机 (unbindphone)",
            "重置密码 (resetpwd)",
            "修改密码 (changepwd)",
            "设置密码 (setpwd)",
            "绑定邮箱 (bindemail)",
            "解绑邮箱 (unbindemail)"
        };
        String[] purposeValues = {
            "register", "login", "bindphone", "unbindphone", 
            "resetpwd", "changepwd", "setpwd", "bindemail", "unbindemail"
        };

        new AlertDialog.Builder(this)
                .setTitle("选择验证码用途")
                .setItems(purposes, (dialog, which) -> {
                    String purpose = purposeValues[which];
                    // 根据用途选择发送类型
                    if (purpose.equals("bindemail") || purpose.equals("unbindemail")) {
                        sendEmailCaptcha(purpose);
                    } else {
                        sendPhoneCaptcha(purpose);
                    }
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 发送手机验证码
     */
    private void sendPhoneCaptcha(String purpose) {
        // ========== 瑞雪 SDK 发送手机验证码 ==========
        String phone = "15043052309";  // 测试手机号
        
        Toast.makeText(this, "正在发送验证码...", Toast.LENGTH_SHORT).show();
        
        boolean result = RXSDK.getInstance().sendCaptcha(
                CaptchaType.CaptchaType_phone,
                phone,
                purpose,
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                Log.d("RXSDK", "验证码发送成功");
                                showDialog("发送验证码成功", 
                                    "手机号: " + phone + "\n用途: " + purpose + "\n\n请注意查收短信");
                            } else {
                                String msg = response.optString("msg", "未知错误");
                                Log.e("RXSDK", "验证码发送失败: " + msg);
                                showDialog("发送验证码失败", 
                                    "错误码: " + code + "\n错误信息: " + msg);
                            }
                        });
                    }
                }
        );
        
        if (!result) {
            showDialog("发送验证码", "请求失败，请检查参数");
        }
    }

    /**
     * 发送邮箱验证码
     */
    private void sendEmailCaptcha(String purpose) {
        // ========== 瑞雪 SDK 发送邮箱验证码 ==========
        String email = "test@example.com";  // 测试邮箱
        
        Toast.makeText(this, "正在发送邮箱验证码...", Toast.LENGTH_SHORT).show();
        
        boolean result = RXSDK.getInstance().sendCaptcha(
                CaptchaType.CaptchaType_email,
                email,
                purpose,
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                Log.d("RXSDK", "邮箱验证码发送成功");
                                showDialog("发送验证码成功", 
                                    "邮箱: " + email + "\n用途: " + purpose + "\n\n请注意查收邮件");
                            } else {
                                String msg = response.optString("msg", "未知错误");
                                Log.e("RXSDK", "邮箱验证码发送失败: " + msg);
                                showDialog("发送验证码失败", 
                                    "错误码: " + code + "\n错误信息: " + msg);
                            }
                        });
                    }
                }
        );
        
        if (!result) {
            showDialog("发送验证码", "请求失败，请检查参数");
        }
    }

    /**
     * 显示校验验证码对话框
     */
    private void showVerifyCaptchaDialog() {
        // ========== 瑞雪 SDK 校验验证码 ==========
        String phone = "15043052309";   // 测试手机号
        String captchaCode = "1111";    // 测试验证码
        String purpose = "login";       // 用途
        
        Toast.makeText(this, "正在校验验证码...", Toast.LENGTH_SHORT).show();
        
        boolean result = RXSDK.getInstance().verifyCaptcha(
                CaptchaType.CaptchaType_phone,
                phone,
                purpose,
                captchaCode,
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                Log.d("RXSDK", "验证码校验成功");
                                showDialog("校验验证码成功", 
                                    "手机号: " + phone + "\n验证码: " + captchaCode + "\n\n校验通过");
                            } else {
                                String msg = response.optString("msg", "未知错误");
                                Log.e("RXSDK", "验证码校验失败: " + msg);
                                showDialog("校验验证码失败", 
                                    "错误码: " + code + "\n错误信息: " + msg);
                            }
                        });
                    }
                }
        );
        
        if (!result) {
            showDialog("校验验证码", "请求失败，请检查参数");
        }
    }

    /**
     * 处理配置模块
     */
    private void handleConfigModule(String service) {
        switch (service) {
            case "设置子渠道ID":
                configSetSubChannelId();
                break;
            case "设置语言":
                configSetLanguage();
                break;
            case "设置密码强度":
                configSetPasswordStrength();
                break;
            case "设置密码正则":
                configSetPasswordRegex();
                break;
            case "设置游戏角色信息":
                configSetGameInfo();
                break;
            case "设置错误码":
                configSetErrorCode();
                break;
            case "设置地区":
                configSetRegion();
                break;
            default:
                showDialog("配置模块", service + "\n\n待实现");
        }
    }

    // ==================== 配置模块实现 ====================

    /**
     * 设置子渠道ID
     */
    private void configSetSubChannelId() {
        // ========== 瑞雪 SDK 设置子渠道 ID ==========
        String subChannelId = "sub_channel_001";  // 子渠道 ID

        RXSDK.getInstance().setSubChannelId(subChannelId);
        Log.d("RXSDK", "已设置子渠道 ID: " + subChannelId);

        showDialog("设置子渠道ID", "子渠道 ID 已设置为: " + subChannelId);
    }

    /**
     * 设置语言
     */
    private void configSetLanguage() {
        String[] languages = {"zh-Hans (简体中文)", "zh-Hant (繁体中文)", "en (英语)", "ja (日语)", "th (泰语)", "vi (越南语)"};
        String[] languageCodes = {"zh-Hans", "zh-Hant", "en", "ja", "th", "vi"};

        new AlertDialog.Builder(this)
                .setTitle("选择语言")
                .setItems(languages, (dialog, which) -> {
                    String language = languageCodes[which];
                    // ========== 瑞雪 SDK 设置当前语言 ==========
                    RXSDK.getInstance().setLanguage(this, language);
                    Log.d("RXSDK", "已设置语言为: " + language);
                    showDialog("设置语言", "语言已设置为: " + languages[which]);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 设置密码强度
     */
    private void configSetPasswordStrength() {
        // ========== 瑞雪 SDK 设置密码强度 ==========
        String[] strengthLevels = {"默认", "自定义", "简易密码", "强密码"};
        PasswordStrength[] strengthValues = {PasswordStrength.Default, PasswordStrength.Custom, PasswordStrength.Average, PasswordStrength.Strong};

        new AlertDialog.Builder(this)
                .setTitle("选择密码强度")
                .setItems(strengthLevels, (dialog, which) -> {
                    RXSDK.setPasswordStrength(strengthValues[which]);
                    Log.d("RXSDK", "密码强度设置为: " + strengthValues[which]);
                    showDialog("设置密码强度", "密码强度已设置为: " + strengthLevels[which]);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 设置密码正则
     */
    private void configSetPasswordRegex() {
        // ========== 瑞雪 SDK 设置密码正则 ==========
        String regex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
        RXSDK.setPwdPattern(regex);
        Log.d("RXSDK", "密码正则设置为: " + regex);
        showDialog("设置密码正则", "密码正则已设置为:\n\n" + regex + "\n\n(8位以上，含字母和数字)");
    }

    /**
     * 设置游戏角色信息
     */
    private void configSetGameInfo() {
        // ========== 瑞雪 SDK 设置游戏信息 ==========
        String roleId = "role_001";     // 游戏角色 ID
        String regionTag = "cn";        // 地区标签

        RXSDK.getInstance().setGameInfo(roleId, regionTag);
        Log.d("RXSDK", "已设置游戏信息: roleId=" + roleId + ", regionTag=" + regionTag);

        showDialog("设置游戏角色信息", "游戏信息已设置:\n\n• 角色ID: " + roleId + "\n• 地区标签: " + regionTag);
    }

    /**
     * 设置错误码
     */
    private void configSetErrorCode() {
        // ========== 瑞雪 SDK 设置自定义错误码 ==========
        Map<String, Map<String, String>> map = new HashMap<>();
        
        // 中文错误消息
        Map<String, String> zh = new HashMap<>();
        zh.put("2002", "自定义消息 $code$$thirdcode$$thirdmsg$");
        zh.put("2000", "");
        zh.put("default", "$msg$:$code$");
        
        // 英文错误消息
        Map<String, String> en = new HashMap<>();
        en.put("2002", "custom error $code$$thirdcode$$thirdmsg$");
        en.put("2000", "error demo ");
        en.put("default", "$msg$:$code$");
        
        map.put("zh", zh);
        map.put("en", en);
        
        RXSDK.setErrorMsg(map);
        Log.d("RXSDK", "已设置自定义错误码");
        showDialog("设置错误码", "自定义错误码已设置:\n\n中文:\n• 2002: 自定义消息\n• default: $msg$:$code$\n\n英文:\n• 2002: custom error\n• default: $msg$:$code$");
    }

    /**
     * 设置地区
     */
    private void configSetRegion() {
        String[] regions = {"CN (中国大陆)", "HK (香港)", "TW (台湾)", "US (美国)", "JP (日本)", "KR (韩国)", "SEA (东南亚)"};
        String[] regionCodes = {"CN", "HK", "TW", "US", "JP", "KR", "SEA"};

        new AlertDialog.Builder(this)
                .setTitle("选择地区")
                .setItems(regions, (dialog, which) -> {
                    // ========== 瑞雪 SDK 设置地区 ==========
                    String region = regionCodes[which];
                    RXSDK.setArea(region);
                    Log.d("RXSDK", "地区设置为: " + region);
                    showDialog("设置地区", "地区已设置为: " + regions[which]);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 处理信息获取模块
     */
    private void handleInfoModule(String service) {
        switch (service) {
            case "获取请求域名":
                infoGetApiDomain();
                break;
            case "获取OpenID":
                infoGetOpenId();
                break;
            case "获取BaseUrl":
                infoGetBaseUrl();
                break;
            case "获取配置数据":
                infoGetConfigData();
                break;
            default:
                showDialog("信息获取", service + "\n\n待实现");
        }
    }

    // ==================== 信息获取模块实现 ====================

    /**
     * 获取请求域名
     */
    private void infoGetApiDomain() {
        // ========== 瑞雪 SDK 获取请求域名 ==========
        String baseUrl = RXSDK.getInstance().getFirstBaseUrl();
        Log.d("RXSDK", "请求域名: " + baseUrl);
        showDialog("获取请求域名", "当前请求域名:\n\n" + baseUrl);
    }

    /**
     * 获取 OpenID
     */
    private void infoGetOpenId() {
        // ========== 瑞雪 SDK 获取 OpenID ==========
        String openId = RXSDK.getInstance().getOpenId();
        Log.d("RXSDK", "OpenID: " + openId);
        if (openId != null && !openId.isEmpty()) {
            showDialog("获取OpenID", "当前用户 OpenID:\n\n" + openId);
        } else {
            showDialog("获取OpenID", "用户未登录或 OpenID 为空");
        }
    }

    /**
     * 获取 BaseUrl
     */
    private void infoGetBaseUrl() {
        // ========== 瑞雪 SDK 获取 BaseUrl ==========
        String baseUrl = RXSDK.getInstance().getFirstBaseUrl();
        Log.d("RXSDK", "BaseUrl: " + baseUrl);
        showDialog("获取BaseUrl", "当前 BaseUrl:\n\n" + baseUrl);
    }

    /**
     * 获取配置数据
     */
    private void infoGetConfigData() {
        // ========== 瑞雪 SDK 获取配置数据 ==========
        StringBuilder sb = new StringBuilder();
        sb.append("产品ID: ").append(RXSDK.getProductId()).append("\n");
        sb.append("渠道ID: ").append(RXSDK.getChannelId()).append("\n");
        sb.append("子渠道ID: ").append(RXSDK.getSubChannelId()).append("\n");
        sb.append("CpID: ").append(RXSDK.getCpId()).append("\n");
        sb.append("SDK版本: ").append(RXSDK.getSdkVersion()).append("\n");
        sb.append("语言: ").append(RXSDK.getLanguage());
        
        Log.d("RXSDK", "配置数据: " + sb.toString());
        showDialog("获取配置数据", sb.toString());
    }

    /**
     * 处理登录模块
     */
    private void handleLoginModule(String service) {
        switch (service) {
            case "登录Api":
                showLoginApiDialog();
                break;
            case "获取法务配置":
                getLegalConfig();
                break;
            case "自定义请求":
                showCustomRequestDemo();
                break;
            default:
                showDialog("登录模块", service + "\n\n待实现");
        }
    }

    /**
     * 显示登录 API 对话框
     */
    private void showLoginApiDialog() {
        String[] loginTypes = {"游客登录", "账号密码登录", "验证码登录"};

        new AlertDialog.Builder(this)
                .setTitle("选择登录方式")
                .setItems(loginTypes, (dialog, which) -> {
                    switch (which) {
                        case 0:
                            loginAsGuest();
                            break;
                        case 1:
                            showUsernameLoginDialog();
                            break;
                        case 2:
                            showCaptchaLoginDialog();
                            break;
                    }
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 游客登录
     */
    private void loginAsGuest() {
        Toast.makeText(this, "正在登录...", Toast.LENGTH_SHORT).show();

        LoginParams params = new LoginParams(LoginMethod.GUEST);

        RXSDK.getInstance().login(this, params, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> handleLoginResponse(response, "游客"));
            }
        });
    }

    /**
     * 账号密码登录（使用测试账号）
     */
    private void showUsernameLoginDialog() {
        loginWithUsername("lee1", "111111");
    }

    /**
     * 账号密码登录
     */
    private void loginWithUsername(String username, String password) {
        Toast.makeText(this, "正在登录...", Toast.LENGTH_SHORT).show();

        LoginParams params = new LoginParams(LoginMethod.USERNAME);
        params.setUsername(username);
        params.setPassword(password);

        RXSDK.getInstance().login(this, params, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> handleLoginResponse(response, "账号密码"));
            }
        });
    }

    /**
     * 验证码登录（使用测试账号）
     */
    private void showCaptchaLoginDialog() {
        loginWithCaptcha("15043052309", "1111");
    }

    /**
     * 验证码登录（先发送验证码，成功后再登录）
     */
    private void loginWithCaptcha(String phone, String captcha) {
        Toast.makeText(this, "正在发送验证码...", Toast.LENGTH_SHORT).show();

        // 先发送验证码
        RXSDK.getInstance().sendCaptcha(
                CaptchaType.CaptchaType_phone,
                phone,
                "login",  // 用途：登录
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        runOnUiThread(() -> {
                            int code = response.optInt("code", -1);
                            if (code == 0 || code == 312231) {
                                Log.d("RXSDK", "验证码发送成功");
                                Toast.makeText(ServicesActivity.this, "验证码发送成功，正在登录...", Toast.LENGTH_SHORT).show();
                                // 验证码发送成功，执行登录
                                doLoginWithCaptcha(phone, captcha);
                            } else {
                                String msg = response.optString("msg", "未知错误");
                                Log.e("RXSDK", "验证码发送失败: " + msg);
                                showDialog("验证码发送失败", "错误码: " + code + "\n错误信息: " + msg);
                            }
                        });
                    }
                }
        );
    }

    /**
     * 执行验证码登录
     */
    private void doLoginWithCaptcha(String phone, String captcha) {
        LoginParams params = new LoginParams(LoginMethod.CAPTCHACODE);
        params.setUsername(phone);
        Map<String, Object> ext = new HashMap<>();
        ext.put("captcha_code", captcha);
        params.setExt(ext);

        RXSDK.getInstance().login(this, params, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> handleLoginResponse(response, "验证码"));
            }
        });
    }

    /**
     * 处理登录响应
     */
    private void handleLoginResponse(JSONObject response, String loginType) {
        int code = response.optInt("code", -1);
        if (code == 0) {
            JSONObject data = response.optJSONObject("data");
            String openid = data != null ? data.optString("openid", "") : "";
            String token = data != null ? data.optString("token", "") : "";

            String successMsg = loginType + "登录成功！\n\n" +
                    "OpenID: " + openid + "\n" +
                    "Token: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token);

            showDialog("登录成功", successMsg);
        } else {
            String msg = response.optString("msg", "未知错误");
            showDialog("登录失败", "错误码: " + code + "\n错误信息: " + msg);
        }
    }

    /**
     * 获取法务配置
     */
    private void getLegalConfig() {
        Toast.makeText(this, "正在获取...", Toast.LENGTH_SHORT).show();

        RXSDK.getInstance().legal(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                runOnUiThread(() -> {
                    int code = response.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = response.optJSONObject("data");
                        showDialog("法务配置", "获取成功\n\n" + (data != null ? data.toString() : "无数据"));
                    } else {
                        showDialog("获取失败", response.optString("msg", "未知错误"));
                    }
                });
            }
        });
    }

    /**
     * 自定义请求示例
     */
    private void showCustomRequestDemo() {
        Toast.makeText(this, "请看 Demo 代码", Toast.LENGTH_SHORT).show();

        // ========== 瑞雪 SDK 创建自定义请求 ==========
        String api = "/api/custom/endpoint";  // 接口路径
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("param1", "value1");
        bodyMap.put("param2", 123);

        IRXRequest request = RXSDK.getInstance().createRequest(api, bodyMap);

        // 发起异步请求（避免主线程阻塞）
        request.postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                runOnUiThread(() -> {
                    int code = jsonObject.optInt("code", -1);
                    if (code == 0) {
                        JSONObject data = jsonObject.optJSONObject("data");
                        Log.d("RXSDK", "自定义请求成功: " + data);
                        showDialog("自定义请求成功", "返回数据:\n" + (data != null ? data.toString() : "无数据"));
                    } else {
                        String msg = jsonObject.optString("msg", "未知错误");
                        Log.e("RXSDK", "自定义请求失败: " + msg);
                        showDialog("自定义请求失败", "错误码: " + code + "\n错误信息: " + msg);
                    }
                });
            }
        });
    }

    /**
     * 处理初始化模块
     */
    private void handleInitModule(String service) {
        switch (service) {
            case "初始化SDK":
                showInitDialog();
                break;
            default:
                showDialog("初始化模块", service + "\n\n待实现");
        }
    }

    /**
     * 显示初始化对话框
     */
    private void showInitDialog() {
        if (sdkManager.isInitialized()) {
            // 已初始化，提示重置
            new AlertDialog.Builder(this)
                    .setTitle("SDK 已初始化")
                    .setMessage("SDK 已经初始化成功\n\n" +
                            "当前参数：\n" +
                            "• CPID: " + sdkManager.getCurrentCpid() + "\n" +
                            "• Product ID: " + sdkManager.getCurrentProductId() + "\n" +
                            "• Channel ID: " + sdkManager.getCurrentChannelId() + "\n" +
                            "• Base URL: " + sdkManager.getCurrentBaseUrl())
                    .setPositiveButton("确定", null)
                    .setNegativeButton("重置 SDK", (dialog, which) -> {
                        sdkManager.reset();
                        Toast.makeText(this, "SDK 已重置", Toast.LENGTH_SHORT).show();
                    })
                    .show();
            return;
        }

        // 选择初始化方式
        new AlertDialog.Builder(this)
                .setTitle("初始化 SDK")
                .setMessage("请选择初始化方式")
                .setPositiveButton("默认参数", (dialog, which) -> showDefaultInitConfirm())
                .setNegativeButton("自定义参数", (dialog, which) -> showCustomInitDialog())
                .setNeutralButton("取消", null)
                .show();
    }

    /**
     * 显示默认参数初始化确认
     */
    private void showDefaultInitConfirm() {
        String envName = sdkManager.isDomestic() ? "国内" : "海外";
        String message = "即将使用" + envName + "环境默认参数初始化 SDK：\n\n" +
                "• CPID: " + sdkManager.getEnvDefaultCpid() + "\n" +
                "• Product ID: " + sdkManager.getEnvDefaultProductId() + "\n" +
                "• Channel ID: " + sdkManager.getEnvDefaultChannelId() + "\n" +
                "• Base URL: " + sdkManager.getEnvDefaultBaseUrl();

        new AlertDialog.Builder(this)
                .setTitle("默认初始化参数")
                .setMessage(message)
                .setPositiveButton("确认初始化", (dialog, which) -> startDefaultInit())
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 显示自定义参数初始化对话框
     */
    private void showCustomInitDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_custom_init, null);
        EditText etCpid = dialogView.findViewById(R.id.etCpid);
        EditText etProductId = dialogView.findViewById(R.id.etProductId);
        EditText etChannelId = dialogView.findViewById(R.id.etChannelId);
        EditText etBaseUrl = dialogView.findViewById(R.id.etBaseUrl);

        // 预填充默认值
        etCpid.setText(sdkManager.getEnvDefaultCpid());
        etProductId.setText(sdkManager.getEnvDefaultProductId());
        etChannelId.setText(sdkManager.getEnvDefaultChannelId());
        etBaseUrl.setText(sdkManager.getEnvDefaultBaseUrl());

        new AlertDialog.Builder(this)
                .setTitle("自定义初始化参数")
                .setView(dialogView)
                .setPositiveButton("初始化", (dialog, which) -> {
                    String cpid = etCpid.getText().toString().trim();
                    String productId = etProductId.getText().toString().trim();
                    String channelId = etChannelId.getText().toString().trim();
                    String baseUrl = etBaseUrl.getText().toString().trim();

                    if (TextUtils.isEmpty(cpid) || TextUtils.isEmpty(productId) ||
                            TextUtils.isEmpty(channelId) || TextUtils.isEmpty(baseUrl)) {
                        Toast.makeText(this, "请填写所有参数", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    startCustomInit(cpid, productId, channelId, baseUrl);
                })
                .setNegativeButton("取消", null)
                .show();
    }

    /**
     * 使用默认参数初始化
     */
    private void startDefaultInit() {
        Toast.makeText(this, "正在初始化...", Toast.LENGTH_SHORT).show();
        sdkManager.initWithDefaultParams(this, this::onInitSuccess);
    }

    /**
     * 使用自定义参数初始化
     */
    private void startCustomInit(String cpid, String productId, String channelId, String baseUrl) {
        Toast.makeText(this, "正在初始化...", Toast.LENGTH_SHORT).show();
        sdkManager.initSDK(this, cpid, productId, channelId, baseUrl, this::onInitSuccess);
    }

    /**
     * 初始化成功回调
     */
    private void onInitSuccess(JSONObject response) {
        runOnUiThread(() -> {
            Log.d("WLTest", "onInitSuccess: " + response);
            int code = response.optInt("code", -1);
            if (code == 0) {
                String successMsg = "SDK 初始化成功！\n\n" +
                        "使用参数：\n" +
                        "• CPID: " + sdkManager.getCurrentCpid() + "\n" +
                        "• Product ID: " + sdkManager.getCurrentProductId() + "\n" +
                        "• Channel ID: " + sdkManager.getCurrentChannelId() + "\n" +
                        "• Base URL: " + sdkManager.getCurrentBaseUrl();

                showDialog("初始化成功", successMsg);
            } else {
                String errorMsg = "初始化失败\n\n" + response.optString("msg", "未知错误");
                showDialog("初始化失败", errorMsg);
            }
        });
    }

    private void showDialog(String title, String message) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("确定", null)
                .show();
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
