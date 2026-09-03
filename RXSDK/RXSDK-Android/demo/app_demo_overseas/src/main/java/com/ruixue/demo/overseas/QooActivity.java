package com.ruixue.demo.overseas;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class QooActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qoo);

        findViewById(R.id.qoo_init).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RuiXueSdk.getApi().initThirdSdk(QooActivity.this, null, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        RXLogger.i(" rx third init success: " + data.toString());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        RXLogger.e("rx third init failed :" + cause);
                    }
                });
            }
        });

        findViewById(R.id.qoo_login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                HashMap<String, Object> map = new HashMap<>();
                map.put("forbid_visitor", true);
                RuiXueSdk.login(QooActivity.this, map, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.e("rxsdk", "third login success： " + data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.e("rxsdk", "third login onFailed:" + cause);
                    }
                });
            }
        });

        findViewById(R.id.qoo_pay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> pay = new HashMap<>();
                pay.put("hq_type", "qoo");
                pay.put("goods_tag", "zx");
                pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
//                pay.put("notify_url", "http://game.pay.result.callback");
                RXSdkApi.getInstance().pay(QooActivity.this, pay, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.e("rxsdk", "third pay success1： " + data.toString());
//                        Log.e("rxsdk", "third pay success2： " +
//                                QooSdkHelper.getDataFromResponse(data.optString("msg"))
//                        );
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.e("rxsdk", "third pay fail:  " + cause);
                    }
                });
            }
        });
        findViewById(R.id.qoo_pay1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> pay = new HashMap<>();
                pay.put("hq_type", "qoo");
                pay.put("goods_tag", "zx");
                pay.put("env", 1);
                pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
//                pay.put("notify_url", "http://game.pay.result.callback");
                RXSdkApi.getInstance().pay(QooActivity.this, pay, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.e("rxsdk", "third pay success1： " + data.toString());
//                        Log.e("rxsdk", "third pay success2： " +
//                                QooSdkHelper.getDataFromResponse(data.optString("msg"))
//                        );
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.e("rxsdk", "third pay fail:  " + cause);
                    }
                });
            }
        });
        // QooSdkHelper 相关按钮待 SDK 接入后启用（布局已标记 TODO + disabled）

        findViewById(R.id.qoo_logout).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RuiXueSdk.logout(new OnLogoutCallback() {
                    @Override
                    public void onSuccess(@Nullable String data) {
                        Log.e("rxsdk", "logout onSuccess " + data);
                    }

                    @Override
                    public void onFailed(int code, String msg) {
                        OnLogoutCallback.super.onFailed(code, msg);
                        Log.e("rxsdk", "logout onFailed " + msg);
                    }
                });
            }
        });


    }
}