package com.ruixue.demo.xuteng;

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
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.utils.AppUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Xuteng SDK Demo Activity
 * Created on 2025-12-10
 */
public class XutengDemoActivity extends AppCompatActivity {
    private static final String TAG = "XutengDemo";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_xuteng_demo);

        TextView tvTitle = findViewById(R.id.tvTitle);
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) tvTitle.getLayoutParams();
        layoutParams.topMargin = AppUtils.getStatusBarHeight();
        tvTitle.setLayoutParams(layoutParams);

        // 注册生命周期监听
        RuiXueSdk.trackingLifecycle(this);

        // // 同意隐私协议
        // RuiXueSdk.setPrivacyAgree(new PrivacyCallback() {
        // @Override
        // public void onPrivacyAgree(boolean b) {
        // // 隐私协议同意回调
        // }
        // });

        // RuiXueSdk.setDebugEnabled(false);
        // SDK 初始化参数
        String cpid = "114";
        String productId = "1002";
        String channelId = "100";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("http://cn-api-test.ruixueyun.com");
        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RXLogger.d(TAG, "RXSDK 初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d(TAG, "RXSDK 初始化失败 - " + jsonObject);
            }

        };
        RXSdkInitConfig rxSdkInitConfig = new RXSdkInitConfig(cpid, productId, channelId, hostUrls, callback);

        // rxSdkInitConfig.setAgreementMap();
        rxSdkInitConfig.setAutoInitThird(true);
        rxSdkInitConfig.setUsePrivacy(true);
        RuiXueSdk.initialize(rxSdkInitConfig);

        // 设置登出回调
        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                RXLogger.d(TAG, "onLogout code = " + code + " msg = " + msg);
            }
        });

        // 绑定按钮事件
        findViewById(R.id.btn_init).setOnClickListener(v -> init());
        findViewById(R.id.btn_login).setOnClickListener(v -> login());
        findViewById(R.id.btn_role_info_up).setOnClickListener(v -> setRoleInfo());
        findViewById(R.id.btn_pay).setOnClickListener(v -> pay());
        findViewById(R.id.btn_logout).setOnClickListener(v -> logout());
        findViewById(R.id.btn_exit).setOnClickListener(v -> exit());
    }

    /**
     * 初始化第三方 SDK
     */
    private void init() {
        RuiXueSdk.getApi().initThirdSdk(this, new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RXLogger.d(TAG, "init third sdk success");
                ToastUtils.showToast(XutengDemoActivity.this, "初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d(TAG, "init third sdk failed " + jsonObject);
                ToastUtils.showToast(XutengDemoActivity.this, "初始化失败: " + jsonObject);
            }
        });
    }

    /**
     * 登录
     */
    private void login() {
        // Xuteng SDK 使用 thirdLogin 方法，通过 initThirdSdk 初始化后调用
        Map<String, Object> loginParams = new HashMap<>();
        RuiXueSdk.getApi().login(
                XutengDemoActivity.this,
                loginParams,
                new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Toast.makeText(XutengDemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Toast.makeText(XutengDemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    /**
     * 设置角色信息
     */
    private void setRoleInfo() {
        GameInfo gameInfo = new GameInfo("1001", "101");
        gameInfo.setRoleName("角色名");
        gameInfo.setServerId("1");
        gameInfo.setServerName("服务器名");
        gameInfo.setBalance("1000");
        gameInfo.setGameRoleLevel("10");
        gameInfo.setRoleCreateTime(System.currentTimeMillis());
        gameInfo.setPartyId("11");
        gameInfo.setPartyName("帮派/工会名");
        gameInfo.setVipLevel(5);
        gameInfo.setGameRolePower(1000000);
        gameInfo.setType(2);
        gameInfo.setExperience("1000");

        RXLogger.i(TAG, "setGameInfo click: roleId=" + gameInfo.getRoleId()
                + ", roleName=" + gameInfo.getRoleName()
                + ", serverId=" + gameInfo.getServerId()
                + ", serverName=" + gameInfo.getServerName()
                + ", roleCreateTime=" + gameInfo.getRoleCreateTime()
                + ", roleLevel=" + gameInfo.getGameRoleLevel()
                + ", type=" + gameInfo.Type());

        RuiXueSdk.getApi().setGameInfo(gameInfo);
        RXLogger.i(TAG, "setGameInfo invoked");
        Toast.makeText(XutengDemoActivity.this, "设置角色信息成功", Toast.LENGTH_SHORT).show();
    }

    /**
     * 登出
     */
    private void logout() {
        RuiXueSdk.getApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                Toast.makeText(XutengDemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(int code, String msg) {
                RXLogger.d(TAG, "logout failed code = " + code + " msg = " + msg);
                Toast.makeText(XutengDemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 支付
     */
    private void pay() {
        Map<String, Object> payParams = new HashMap<>();

        payParams.put("hq_type", "xuteng");
        payParams.put("goods_tag", "bytest");

        payParams.put("age", 18);

        RuiXueSdk.getApi().pay(XutengDemoActivity.this, payParams, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(XutengDemoActivity.this, "支付完成", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("pay failed " + cause);
                Toast.makeText(XutengDemoActivity.this, "支付失败" + cause, Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 退出游戏
     */
    private void exit() {
        RuiXueSdk.exitApp(this, new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                Toast.makeText(XutengDemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onExitCancel() {
                Toast.makeText(XutengDemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
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
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
            @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }
}
