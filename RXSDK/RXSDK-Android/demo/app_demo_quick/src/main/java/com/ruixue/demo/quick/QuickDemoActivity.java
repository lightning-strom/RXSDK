package com.ruixue.demo.quick;


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
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.QuickSdkHelper;
import com.ruixue.openapi.RuiXueSdkCallback;
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
public class QuickDemoActivity extends AppCompatActivity {
    private static final String TAG = "Quick";

    private static final int REQUEST_CODE = 10011;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quick_demo);

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

        String cpid = "114";
        String productId = "1002";
        String channelId = "100";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("https://cn-api-test.ruixueyun.com");

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

            @Override
            public boolean onSwitchAccount(int code, String data) {
                return super.onSwitchAccount(code, data);
            }
        });

        checkPermissionPreInit();

        findViewById(R.id.btn_login).setOnClickListener(v -> login());

        findViewById(R.id.btn_realname).setOnClickListener(v -> realName());

        findViewById(R.id.btn_role_info_up).setOnClickListener(v -> setRoleInfo());

        findViewById(R.id.btn_pay).setOnClickListener(v -> pay());

        findViewById(R.id.btn_logout).setOnClickListener(v -> logout());

        findViewById(R.id.btn_exit).setOnClickListener(v -> exit());
    }

    private void realName() {
        QuickSdkHelper.getInstance().verifyRealName(this, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.d("WLTest", "verify real name success " + data);
                ToastUtils.showToast(QuickDemoActivity.this, "实名认证请求成功 " + data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "verify real name failed " + cause);
                ToastUtils.showToast(QuickDemoActivity.this, "实名认证请求失败 由于母包中并未支持，打渠道包才支持，渠道基本都做了实名跟防沉迷，游戏可以不用调此接口获取实名信息来做防沉迷限制！");
            }
        });
    }

    private void checkPermissionPreInit() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED
                    || (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)) {
                //没有,申请权限  权限数组
                ActivityCompat.requestPermissions(this, new String[] { Manifest.permission.READ_PHONE_STATE ,Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
            } else {
                init();
            }
        } else {
            init();
        }
    }

    private void init() {
        Map<String, Object> initParamsMap = new HashMap<>();
        initParamsMap.put("quick_product_code", "42749022765448085101667623375929");
        initParamsMap.put("quick_product_key", "10311638");
        RuiXueSdk.getApi().initThirdSdk(this, initParamsMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RXLogger.d("init third sdk success");
                ToastUtils.showToast(QuickDemoActivity.this, "初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d("init third sdk failed " + jsonObject);
                ToastUtils.showToast(QuickDemoActivity.this, "初始化失败" + jsonObject);
            }
        });
    }

    private void login() {
        String username = null;
        String loginType = LoginMethod.QUICK;
        String password = null;
        String captchaCode = null;
        String loginOpenId = null;
        Map<String, Object> ext = null;
        String[] signFields = null;
        Object migrateArgs = null;
        RuiXueSdk.getApi().login(QuickDemoActivity.this, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(QuickDemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Toast.makeText(QuickDemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setRoleInfo() {
        GameInfo gameInfo = new GameInfo(1, "1121121", "1");
        gameInfo.setServerName("火星服务器");
        gameInfo.setRoleName("裁决之剑");
        gameInfo.setGameRoleLevel("12");
        gameInfo.setVipLevel(9);
        gameInfo.setBalance("5000");
        gameInfo.setPartyName("无敌联盟");
        gameInfo.setPartyId("1100");
        gameInfo.setRoleCreateTime(1473141432L);
        gameInfo.setGameRolePower(38);
        gameInfo.setAttach("{\"gameRoleGender\":\"男\",\"partyRoleId\":\"11\","
                + "\"partyRoleName\":\"帮主\",\"professionId\":\"38\","
                + "\"profession\":\"法师\",\"friendlist\":\"无\"}");
        RuiXueSdk.getApi().setGameInfo(gameInfo);
        Toast.makeText(QuickDemoActivity.this, "设置成功", Toast.LENGTH_SHORT).show();
    }

    private void logout() {
        RuiXueSdk.getApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                Toast.makeText(QuickDemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(int code, String msg) {
                RXLogger.d("logout failed code = " + code + " msg = " + msg);
                Toast.makeText(QuickDemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void pay() {
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", "quick1111");
        pay.put("goods_tag", "007_test");
        pay.put("env", 1);
        pay.put("age", 18);
        Map<String, Object> gameRoleInfoMap = new HashMap<>();
        gameRoleInfoMap.put("serverId", "1");// 服务器ID，其值必须为数字字符串
        gameRoleInfoMap.put("serverName", "火星服务器");// 服务器名称
        gameRoleInfoMap.put("gameRoleName", "裁决之剑");// 角色名称
        gameRoleInfoMap.put("gameRoleId", "1121121");// 角色ID
        gameRoleInfoMap.put("gameUserLevel", "12");// 等级
        gameRoleInfoMap.put("vipLevel", "Vip4");// VIP等级
        gameRoleInfoMap.put("gameBalance", "5000");// 角色现有金额
        gameRoleInfoMap.put("roleCreateTime", "1473141432"); // UC与1881渠道必传，值为10位数时间戳
        gameRoleInfoMap.put("partyName", "");// 公会名字
        pay.put("game_role_info", gameRoleInfoMap);
        RuiXueSdk.getApi().pay(QuickDemoActivity.this, pay, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(QuickDemoActivity.this, "支付完成", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "pay failed " + cause);
                Toast.makeText(QuickDemoActivity.this, "支付失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void exit() {
        RuiXueSdk.exitApp(this, new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                Toast.makeText(QuickDemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
                finish();
            }

            @Override
            public void onExitCancel() {
                Toast.makeText(QuickDemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
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
            init();
        } else {
            //失败  这里逻辑以游戏为准 这里只是模拟申请失败 cp方可改为继续正常初始化调登录然后进游戏 或者继续申请权限 或者退出游戏 或者其他逻辑
            Toast.makeText(this, "权限申请失败, p方可改为继续正常初始化调登录然后进游戏 或者继续申请权限 或者退出游戏 或者其他逻辑，重试需要退出重进游戏", Toast.LENGTH_SHORT).show();
        }
    }
}
