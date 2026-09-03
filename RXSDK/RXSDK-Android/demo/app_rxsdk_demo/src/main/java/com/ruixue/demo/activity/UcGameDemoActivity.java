package com.ruixue.demo.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.qipai.databinding.ActivityUcGameDemoBinding;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2024/4/30.
public class UcGameDemoActivity extends AppCompatActivity {

    private ActivityUcGameDemoBinding binding;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityUcGameDemoBinding.inflate(LayoutInflater.from(this));
        setContentView(binding.getRoot());

        binding.btnInit.setOnClickListener(v -> {
            Map<String, Object> params = new HashMap<>();
            RuiXueSdk.getApi().initThirdSdk(UcGameDemoActivity.this, params, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    Toast.makeText(UcGameDemoActivity.this, "初始化成功", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    Log.d("WLTest", cause.toString());
                    Toast.makeText(UcGameDemoActivity.this, "初始化失败", Toast.LENGTH_SHORT).show();
                }
            });
        });

        binding.btnLogin.setOnClickListener(v -> {
            Map<String, Object> map = new HashMap<>();
            RuiXueSdk.login(UcGameDemoActivity.this, map, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    Toast.makeText(UcGameDemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    Toast.makeText(UcGameDemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
                }
            });
        });

        binding.btnLogout.setOnClickListener(v -> {
            RuiXueSdk.logout(new OnLogoutCallback() {
                @Override
                public void onSuccess(@Nullable String data) {
                    Toast.makeText(UcGameDemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailed(int code, String msg) {
                    Toast.makeText(UcGameDemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
                }
            });
        });

        binding.btnExit.setOnClickListener(v -> {
            RuiXueSdk.exitApp(this, new OnAppExitCallback() {
                @Override
                public void onExitConfirm(@Nullable String res) {
                    Toast.makeText(UcGameDemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onExitCancel() {
                    Toast.makeText(UcGameDemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
                }
            });
        });

        binding.btnPay.setOnClickListener(v -> {
            Map<String, Object> pay = new HashMap<>();
            pay.put("hq_type", "jiuyou");
            pay.put("goods_tag", "007_test");
            pay.put("env", 1);
            pay.put("age", 18);
            RuiXueSdk.getRXSdkApi().pay(UcGameDemoActivity.this, pay, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    Toast.makeText(UcGameDemoActivity.this, "支付完成，客户端无支付成功回调，订单成功已服务端回调为准", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    Toast.makeText(UcGameDemoActivity.this, "支付失败", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}
