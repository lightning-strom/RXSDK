package com.ruixue.demo.api.module;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.callback.DemoCallbacks;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.demo.dialog.CaptchaDialog;
import com.ruixue.demo.dialog.EditDialog;
import com.ruixue.demo.dialog.OnDialogClickListener;
import com.ruixue.demo.helper.LoginV2DemoHelper;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.openapi.Constants;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;

import java.util.HashMap;
import java.util.Map;

public class LoginModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;
    private final RXUICallback jsonCallback;

    public LoginModule(@NonNull Activity activity,
                       @NonNull DemoManager.ResultCallback callback,
                       @NonNull RXUICallback jsonCallback) {
        this.activity = activity;
        this.callback = callback;
        this.jsonCallback = jsonCallback;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        registrar.register(R.id.login_default, () -> RXSdkApi.getInstance().login(activity, jsonCallback));
        registrar.register(R.id.login_view_rx, () -> LoginV2DemoHelper.showLoginUI(activity));
        registrar.register(R.id.login_guest, () -> LoginV2DemoHelper.login(activity, "guest"));
        registrar.register(R.id.login_guest_new, () -> LoginV2DemoHelper.loginGuest(activity));
        registrar.register(R.id.login_by_token, () -> LoginV2DemoHelper.loginByOpenid(activity, false));
        registrar.register(R.id.login_quick_openid, () -> LoginV2DemoHelper.loginWithOpenidUI(activity));
        registrar.register(R.id.login_openid_invalid, () -> LoginV2DemoHelper.loginOpenidExpireInvalid(activity));
        registrar.register(R.id.wechatlogin, () -> LoginV2DemoHelper.loginWechat(activity, null));
        registrar.register(R.id.logout, () -> RuiXueSdk.logout(null));
        registrar.register(R.id.login_config, this::setLoginConfig);
        registrar.register(R.id.search_game_account, this::searchGameAccount);
        registrar.register(R.id.test3, this::loginByUsernameAndPassword);
        registrar.register(R.id.btn_open_login, () -> {
            boolean opened = ActivityUtils.startActivityByClass(activity,
                    "com.ruixue.demo.activity.LoginActivity", GlobalConfig.getExt());
            if (opened) activity.finish();
        });

        // 注册
        registrar.register(R.id.register_phone_ui, () -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ignore_check_password", true);
            RXSdkUI.getInstance().registerUI(activity, map, 1, jsonCallback).show();
        });
        registrar.register(R.id.register_username_ui, () -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ignore_check_password", true);
            RXSdkUI.getInstance().registerUI(activity, map, 2, jsonCallback).show();
        });
        registrar.register(R.id.register_email_ui,
                () -> RXSdkUI.getInstance().registerUI(activity, 3, jsonCallback).show());

        // 华为
        registrar.register(R.id.login_hw_google, () -> loginHuawei("huawei_google"));
        registrar.register(R.id.login_hw_facebook, () -> loginHuawei("huawei_fb"));
        registrar.register(R.id.login_hw_os, () -> loginHuawei("hwjos"));

        // 账号密码登录
        registrar.register(R.id.login_by_account, this::loginByAccount);

        // 验证码
        registrar.register(R.id.sendcaptcha, this::sendCaptcha);

        // 免密检查
        registrar.register(R.id.check_quick_ap, () -> RuiXueSdk.getApi().checkQuickAp(jsonCallback));
    }

    private void setLoginConfig() {
        RuiXueSdk.getApi().setGameInfo("role_id", "test_region_tag");
        callback.onToast("设置成功");
    }

    private void searchGameAccount() {
        RuiXueSdk.getApi().searchGameAccount(DemoCallbacks.request(callback, "游戏账号"));
    }

    private void loginByUsernameAndPassword() {
        Map<String, Object> map = new HashMap<>();
        map.put("method", "username");
        map.put("username", DemoTestConfig.TEST_USERNAME);
        map.put("password", DemoTestConfig.TEST_PASSWORD);
        RuiXueSdk.getApi().login(activity, map, jsonCallback);
    }

    private void loginHuawei(String method) {
        Map<String, Object> map = new HashMap<>();
        map.put("method", method);
        RuiXueSdk.getRXSdkApi().login(activity, map, jsonCallback);
    }

    private void loginByAccount() {
        EditDialog editDialog = new EditDialog(activity);
        editDialog
                .setDialogTitle("账号密码登录")
                .setDialogSubtitle("输入测试账号和密码，直接调用账号密码登录流程。")
                .setField1("账号", "请输入账号")
                .setField2("密码", "请输入密码")
                .setFieldValues(DemoTestConfig.TEST_USERNAME, DemoTestConfig.TEST_PASSWORD)
                .setActionText("取消", "立即登录");
        editDialog.setOnDialogClickListener(new OnDialogClickListener() {
            @Override
            public void onConfirmClick(String msg, String msg2) {
                String username = msg == null ? "" : msg.trim();
                String password = msg2 == null ? "" : msg2.trim();
                if (TextUtils.isEmpty(username)) {
                    callback.onToast("请输入账号");
                    return;
                }
                if (TextUtils.isEmpty(password)) {
                    callback.onToast("请输入密码");
                    return;
                }
                LoginV2DemoHelper.loginByAccount(activity, username, password, false);
                editDialog.dismiss();
            }

            @Override
            public void onCancelClick() {
                editDialog.dismiss();
            }
        });
        editDialog.show();
    }

    private void sendCaptcha() {
        CaptchaDialog dialog = new CaptchaDialog(activity, false);
        dialog.setOnDialogClickListener(new OnDialogClickListener() {
            @Override
            public void onConfirmClick(String msg, String msg2) {
                dialog.dismiss();
                Map<String, Object> hashMap = new HashMap<>();
                if (!TextUtils.isEmpty(msg2)) {
                    if (Constants.CAPTCHA_PURPOSE_BINDEMAIL.equals(msg) || (msg != null && msg.contains("@"))) {
                        hashMap.put("email", msg2);
                    } else {
                        hashMap.put("phone", msg2);
                    }
                }
                hashMap.put("purpose", msg);
                RXSdkApi.getInstance().sendCaptcha(hashMap, jsonCallback);
            }

            @Override
            public void onCancelClick() {
                dialog.dismiss();
            }
        });
        dialog.show();
    }
}
