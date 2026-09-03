package com.ruixue.demo.activity;
import com.ruixue.demo.helper.PayTestHelper;
import com.ruixue.demo.helper.RxSdkHelper;

import android.os.Bundle;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.Logger;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;
import com.ruixue.view.AlertTipView;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class HWOSActivity extends BaseSdkLifecycleActivity {

    public void showLog(String json) {
        Logger.i("showLog:" + json);
//        ToastUtils.showLongToast(this, json);
        AlertTipView.create(this).setContent(json).show();
    }

    RXUICallback jsonCallback = new RXRequestCallback() {
        @Override
        public Map<String, Object> onClickHandle(Map<String, Object> loginParams) {
            String password = (String) loginParams.get("password");
            if (password != null && password.length() < 4) {
                loginParams.put("break", true);
            }
            return loginParams;
        }

        @Override
        public void onResponse(JSONObject jsonObject) {
            if (jsonObject.optInt("code") == 0) {
                Logger.i("showLog:" + jsonObject.toString());
//                AlertTipView.create(HWOSActivity.this).setContent("demo成功了").show();
                ToastUtils.showLongToast(HWOSActivity.this, "demo登录成功了");

            } else {
                showLog(jsonObject.toString());
            }
        }

        @Override
        public void onError(RXException e) {
            super.onError(e);
            Logger.e("onError:" + e.toString());
        }

    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hwos);
        RxSdkHelper.onCreate(this);

        findViewById(R.id.btn_huawei_fb).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> map = new HashMap<>();
                map.put("method", "huawei_fb");
//            map.put("login_provider", 2);
                RuiXueSdk.getRXSdkApi().login(HWOSActivity.this, map, jsonCallback);
            }
        });

        findViewById(R.id.btn_hwjos).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> map = new HashMap<>();
                map.put("method", "hwjos");
//            map.put("login_provider", 2);
                RuiXueSdk.getRXSdkApi().login(HWOSActivity.this, map, jsonCallback);

            }
        });

        findViewById(R.id.btn_hw_pay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PayTestHelper.pay(HWOSActivity.this, "hwjos", new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
//                         AlertTipView.create(HWOSActivity.this).setContent("demo支付成功了").show();
                        ToastUtils.showLongToast(HWOSActivity.this, "demo支付成功了");

                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        AlertTipView.create(HWOSActivity.this).setContent(cause.toString()).show();

                    }
                });

            }
        });


    }
}