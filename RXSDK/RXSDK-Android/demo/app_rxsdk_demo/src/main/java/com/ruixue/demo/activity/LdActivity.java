package com.ruixue.demo.activity;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.billing.HQParams;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.openapi.GameInfo;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;

import org.json.JSONObject;

import java.util.HashMap;

public class LdActivity extends Activity {

    public final static String TAG = "LdActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ld);

        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("ld_app_key", "82451108656044469d666b73573688c8");

        RuiXueSdk.getApi().initThirdSdk(this, hashMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Log.d(TAG, "initThirdSdk onSuccess: ");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.d(TAG, "initThirdSdk onFailed: " + cause.toString());
            }
        });

        findViewById(R.id.btn_login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HashMap<String, Object> loginMap = new HashMap<>();
                loginMap.put("method", LoginMethod.LEIDIAN);
                RuiXueSdk.login(LdActivity.this, loginMap, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.d(TAG, "login onSuccess: " + data.toString());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.d(TAG, "login onFailed: " + cause.toString());
                    }
                });
            }
        });

        findViewById(R.id.btn_set_game_info).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setGameInfo();
            }
        });

        findViewById(R.id.btn_pay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

//                Map<String, Object> pay = new HashMap<>();
//                pay.put("hq_type", PayType.MUMU);
//                pay.put("goods_tag", "youtube_test");
//                pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
//                pay.put("notify_url", "http://game.pay.result.callback");

                HQParams payParams = new HQParams.Builder()
                        .setHQType("leidian")
                        .setGoodsTag("youtube_test")
                        .setTradeNo(String.valueOf(System.currentTimeMillis()))
                        .setNotifyUrl("http://game.pay.result.callback")
                        .build();
                RuiXueSdk.getApi().pay(LdActivity.this, payParams, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.d(TAG, "pay onSuccess: " + data.toString());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.d(TAG, "pay onFailed: " + cause.toString());
                    }
                });
            }
        });

        findViewById(R.id.btn_exit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RuiXueSdk.getApi().exitApp(LdActivity.this, new OnAppExitCallback() {
                    @Override
                    public void onExitConfirm(@Nullable String res) {
//                        LdActivity.this.finish();
                        Log.d(TAG, "exit onExitConfirm: " + res);
                    }
                });
            }
        });



    }

    private void setGameInfo() {
        GameInfo gameInfo = new GameInfo(2, "ld_role_001", "1");
        gameInfo.setServerName("雷电测试服");
        gameInfo.setRoleName("雷电测试角色");
        gameInfo.setGameRoleLevel("12");
        gameInfo.setBalance("5000");
        gameInfo.setPartyName("雷电测试公会");
        gameInfo.setVipLevel(1);
        gameInfo.setGameRolePower(10000);
        gameInfo.setAttach("{\"roleType\":\"mage\",\"profession\":\"法师\"}");
        RuiXueSdk.getApi().setGameInfo(gameInfo);
        Toast.makeText(this, "setGameInfo 已调用", Toast.LENGTH_SHORT).show();
    }
}