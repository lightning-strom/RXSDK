package com.ruixue.demo.jf;


import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/13
 */
public class JFDemoActivity extends AppCompatActivity {
    private static final String TAG = "Quick";

    private static final int REQUEST_CODE = 10011;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.jf_activity_demo);

        TextView tvTitle = findViewById(R.id.tvTitle);
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) tvTitle.getLayoutParams();
        layoutParams.topMargin = AppUtils.getStatusBarHeight();
        tvTitle.setLayoutParams(layoutParams);

        // 注册生命周期监听
        RuiXueSdk.trackingLifecycle(this);


        RuiXueSdk.initialize(getRxSdkInitConfig());

        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                RXLogger.d(TAG, "onLogout code = " + code + " msg = " + msg);
            }

            @Override
            public boolean onSwitchAccount(int code, String data) {
                return super.onSwitchAccount(code, data);
            }
        });

//        checkPermissionPreInit();

        findViewById(R.id.btn_login).setOnClickListener(v -> login());

        findViewById(R.id.btn_realname).setOnClickListener(v -> realName());


        findViewById(R.id.btn_pay).setOnClickListener(v -> pay());

        findViewById(R.id.btn_logout).setOnClickListener(v -> logout());

        findViewById(R.id.btn_exit).setOnClickListener(v -> exit());
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        RuiXueSdk.onRestart(this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        RuiXueSdk.onNewIntent(this, intent);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        RXSdkApi.getInstance().onBackPressed();
        RXLogger.i("onBackPressed called");
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        RuiXueSdk.onWindowFocusChanged(hasFocus);
    }

    @NonNull
    private static RXSdkInitConfig getRxSdkInitConfig() {
        String cpid = "119";
        String productId = "1002";
        String channelId = "1000";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("http://os-api-test.ruixueyun.com");
        RXSdkInitConfig rxSdkInitConfig = new RXSdkInitConfig(cpid, productId, channelId, hostUrls, new RXJSONCallback() {
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
        rxSdkInitConfig.setAutoInitThird(true);
        return rxSdkInitConfig;
    }

    private void realName() {

    }

    private void checkPermissionPreInit() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED
                    || (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)) {
                //没有,申请权限  权限数组
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_PHONE_STATE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
            } else {

            }
        } else {

        }
    }


    private void login() {
        String username = null;
        String loginType = LoginMethod.WEIZHI;
        String password = null;
        String captchaCode = null;
        String loginOpenId = null;
        Map<String, Object> ext = null;
        String[] signFields = null;
        Object migrateArgs = null;
        RuiXueSdk.getApi().login(JFDemoActivity.this, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(JFDemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
                assert data != null;
                LoginData loginData = LoginData.fromJson(data.toString());
                setRoleInfo(loginData.isNewUser() ? 1 : 2, loginData.getCp_user_id(), "default");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Toast.makeText(JFDemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setRoleInfo(int type, String roleId, String serverId) {

        GameInfo gameInfo = new GameInfo(type, roleId, serverId);
        RuiXueSdk.getApi().setGameInfo(gameInfo);


    }

    private void logout() {
        RuiXueSdk.getApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                Toast.makeText(JFDemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(int code, String msg) {
                RXLogger.d("logout failed code = " + code + " msg = " + msg);
                Toast.makeText(JFDemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void pay() {
        Map<String, Object> pay = new HashMap<>();
        pay.put("goods_tag", "bytest");
        pay.put("env", 1);
        pay.put("age", 18);
        RuiXueSdk.getApi().pay(JFDemoActivity.this, pay, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(JFDemoActivity.this, "支付完成", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "pay failed " + cause);
                Toast.makeText(JFDemoActivity.this, "支付失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void exit() {
        RuiXueSdk.exitApp(this, new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                Toast.makeText(JFDemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
                finish();
            }

            @Override
            public void onExitCancel() {
                Toast.makeText(JFDemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
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
        if (requestCode != REQUEST_CODE) {
            return;
        }

        if (grantResults.length == 2 && grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
            //申请成功
        } else {
            //失败  这里逻辑以游戏为准 这里只是模拟申请失败 cp方可改为继续正常初始化调登录然后进游戏 或者继续申请权限 或者退出游戏 或者其他逻辑
            Toast.makeText(this, "权限申请失败, p方可改为继续正常初始化调登录然后进游戏 或者继续申请权限 或者退出游戏 或者其他逻辑，重试需要退出重进游戏", Toast.LENGTH_SHORT).show();
        }
    }
}
