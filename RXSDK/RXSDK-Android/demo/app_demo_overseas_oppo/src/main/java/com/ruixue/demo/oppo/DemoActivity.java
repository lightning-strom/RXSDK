package com.ruixue.demo.oppo;


import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.passport.LoginMethod;
import com.ruixue.sdkdemo.R;
import com.ruixue.utils.AppUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/13
 */
public class DemoActivity extends AppCompatActivity {
    private static final String TAG = "Infinix";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);

        TextView tvTitle = findViewById(R.id.tvTitle);
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) tvTitle.getLayoutParams();
        layoutParams.topMargin = AppUtils.getStatusBarHeight();
        tvTitle.setLayoutParams(layoutParams);

        // 注册生命周期监听
        RuiXueSdk.trackingLifecycle(this);

        // 同意隐私协议
        RuiXueSdk.setPrivacyAgree(new PrivacyCallback() {
            @Override
            public void onPrivacyAgree(boolean b) {

            }
        });

        String cpid = "119";
        String productId = "SDKOS";
        String channelId = "AndroidOS";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("https://os-api-test.ruixueyun.com");

        RuiXueSdk.initialize(cpid, productId, channelId, hostUrls, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RuiXueSdk.setDebugEnabled(true);
                RXLogger.d("RXSDK 初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d("RXSDK 初始化失败 - " + jsonObject);
            }
        });

        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                RXLogger.d(TAG, "onLogout code = " + code + " msg = " + msg);
            }
        });

        findViewById(R.id.btn_init).setOnClickListener(v -> init());

        findViewById(R.id.btn_login).setOnClickListener(v -> login());

        findViewById(R.id.btn_pay).setOnClickListener(v -> pay());

        findViewById(R.id.btn_logout).setOnClickListener(v -> logout());

        findViewById(R.id.btn_exit).setOnClickListener(v -> exit());

    }

    private void init() {
        Map<String, Object> ext = new HashMap<>();
        ext.put("appSecret", "7121b567b6a940199317dfadb49d767f");
        RuiXueSdk.getApi().initThirdSdk(this, ext, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RXLogger.d("init third sdk success");
                ToastUtils.showToast(DemoActivity.this, "初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d("init third sdk failed " + jsonObject);
                ToastUtils.showToast(DemoActivity.this, "初始化失败" + jsonObject);
            }
        });
    }



    private void login() {
        String username = null;
        String loginType = LoginMethod.GUEST;
        String password = null;
        String captchaCode = null;
        String loginOpenId = null;
        Map<String, Object> ext = null;
        String[] signFields = null;
        Object migrateArgs = null;
        RuiXueSdk.getApi().login(DemoActivity.this, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(DemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Toast.makeText(DemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void logout() {
        RuiXueSdk.getApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                Toast.makeText(DemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(int code, String msg) {
                RXLogger.d("logout failed code = " + code + " msg = " + msg);
                Toast.makeText(DemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void pay() {
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", "gl_oppo");
        pay.put("goods_tag", "oppo_os");
        pay.put("callback_url", "jixiang433://pay?code=0");
        pay.put("env", 1);
        pay.put("age", 18);
        RuiXueSdk.getApi().pay(DemoActivity.this, pay, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(DemoActivity.this, "支付完成", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "pay failed " + cause);
                Toast.makeText(DemoActivity.this, "支付失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void exit() {
        RuiXueSdk.exitApp(this, new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                Toast.makeText(DemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onExitCancel() {
                Toast.makeText(DemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        RuiXueSdk.onConfigurationChanged(this, newConfig);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }
}
