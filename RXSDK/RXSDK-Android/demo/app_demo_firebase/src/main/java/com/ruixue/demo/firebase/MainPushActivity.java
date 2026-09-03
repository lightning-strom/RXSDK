package com.ruixue.demo.firebase;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Gravity;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.net.ToastUtils;
import com.ruixue.passport.LoginMethod;
import com.ruixue.push.RxPushManager;
import com.ruixue.push.core.DeviceResultCallback;
import com.ruixue.view.AlertTipView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Created by wangliang on 2024/6/5.
public class MainPushActivity extends AppCompatActivity {

    private static final String TAG = "FirebaseDemo";

    private static final int PERMISSION_REQUEST_CODE = 100;

    private Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_push);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, PERMISSION_REQUEST_CODE);
            }
        }

        // 注册生命周期监听
        RuiXueSdk.trackingLifecycle(this);

        // 同意隐私协议
        RuiXueSdk.setPrivacyAgree(new PrivacyCallback() {
            @Override
            public void onPrivacyAgree(boolean b) {

            }
        });

        // push
        RxPushManager.init(this);
        openAppCallback(getIntent());

        String cpid = "119";
        String productId = "SDKOS";
        String channelId = "AndroidOS";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("http://os-api-test.ruixueyun.com");

        RuiXueSdk.initialize(cpid, productId, channelId, hostUrls, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                Log.d(TAG, "RXSDK 初始化成功");
                RuiXueSdk.setDebugEnabled(true);
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                Log.d(TAG, "RXSDK 初始化失败 - " + jsonObject);
            }
        });

        Map<String, Object> map = new HashMap<>();

        // google 测试 clientId 使用方换成自己的 clientId
        // 海外捕鱼 google clientId
        map.put("clientId", "<REDACTED_GOOGLE_CLIENT_ID>");
        RuiXueSdk.getRXSdkApi().initThirdSdk(this, map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                Log.d(TAG, "init third sdk success");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                Log.d(TAG, "init third sdk failed " + jsonObject);
            }
        });


        findViewById(R.id.initPushBtn).setOnClickListener(v -> {
            Map<String, Object> loginParams = new HashMap<>();
            loginParams.put("method", LoginMethod.GUEST);
            RuiXueSdk.getRXSdkApi().login(this, loginParams, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    ToastUtils.showLongToast(MainPushActivity.this, "登录成功, 即将退到后台，等待通知推送测试");
                    RxPushManager.registerToken(new DeviceResultCallback() {
                        @Override
                        public void onResult(String result) {
                            Log.w("rxsdk", result);
                            backToHome();
                        }
                    });

                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    ToastUtils.showToast(MainPushActivity.this, "登录失败");
                }
            });
        });

        findViewById(R.id.backHomeBtn).setOnClickListener(v -> {
            backToHome();
        });
    }

    private void backToHome() {
        Log.w("rxsdk", "token:" + RxPushManager.getDeviceToken());
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        startActivity(intent);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        openAppCallback(intent);
    }

    private void openAppCallback(Intent intent) {
        RxPushManager.openAppCallback(intent);
        String logstr = "";
        Map<String, Object> map = new HashMap<>();
        Bundle bundle = intent.getExtras();
        if (null != bundle) {
            StringBuilder log = new StringBuilder();
            for (String key : bundle.keySet()) {
                log.append("\n").append(key).append(" = ").append(bundle.get(key));
                map.put(key, bundle.get(key));
            }
            logstr = log.toString();
        }
        if (logstr.contains("task_id")) {
            AlertTipView.create(MainPushActivity.this, "debug", logstr, null).setContentGravity(Gravity.START).show();
        }

        if (map.containsKey("payload")) {
            parseDeeplink(intent);
        }
    }

    /**
     *  使用瑞雪 **推送自定义透传参数（deeplink）**  的解析示例
     * @param intent 在 LAUNCHER Activity 的 onCreate 或 onNewIntent 中获取 deeplink ，并调用 openAppCallback 传 intent 统计点击
     */
    private void parseDeeplink(Intent intent) {

        String ob = intent.getStringExtra("payload");
        //todo 解析 deeplink 值,执行相应业务逻辑
        AlertTipView.create(MainPushActivity.this, "payload",ob , null).setContentGravity(Gravity.START).show();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
            } else {
                // Permission denied
                Toast.makeText(this, "通知权限受限，请到手机系统中打开，以保证推送正常接收", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        handler.removeCallbacksAndMessages(null);
    }
}
