package com.ruixue.demo.activity;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.GlobalConfig;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.Logger;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;
import com.ruixue.view.AlertTipView;

import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.Map;

public class HWCNActivity extends BaseSdkLifecycleActivity {

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
                ToastUtils.showLongToast(HWCNActivity.this, "demo登录成功了");

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
        setContentView(R.layout.activity_hwcn);
        RxSdkHelper.onCreate(this);

        findViewById(R.id.btn_replay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ActivityUtils.startActivityByClass(HWCNActivity.this, "com.ruixue.demo.huawei.HuaweiReplayDemoActivity", GlobalConfig.getExt());
            }
        });

        findViewById(R.id.btn_moment).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ActivityUtils.startActivityByClass(HWCNActivity.this, "com.ruixue.demo.huawei.HuaweiMomentDemoActivity", GlobalConfig.getExt());
            }
        });

        findViewById(R.id.btn_xiaoyi).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                    try {
                        Class<?> hmsHelperClass = Class.forName("com.ruixue.sdk.HmsSdkHelper");
                        Method bindDeviceForXiaoYi = hmsHelperClass.getMethod("bindDeviceForXiaoYi", RXJSONCallback.class);
                        bindDeviceForXiaoYi.invoke(null, new RXJSONCallback() {
                            @Override
                            public void onSuccess(@Nullable JSONObject data) {
                                ToastUtils.showToast(HWCNActivity.this, "绑定成功");
                                TextView textView = findViewById(R.id.bindDeviceInfo);
                                textView.setText("绑定成功:" + data.toString());
                            }

                            @Override
                            public void onFailed(@NonNull JSONObject cause) {
                                ToastUtils.showToast(HWCNActivity.this, "绑定失败 " + cause);
                            }
                        });
                    } catch (Exception e) {
                       e.printStackTrace();
                    }
                }

//                HmsSdkHelper.bindDeviceForXiaoYi(new RXJSONCallback() {
//                    @Override
//                    public void onSuccess(@Nullable JSONObject data) {
//                        ToastUtils.showToast(HWCNActivity.this, "绑定成功");
//                        TextView textView = findViewById(R.id.bindDeviceInfo);
//                        textView.setText("绑定成功:" + data.toString());
//                    }
//
//                    @Override
//                    public void onFailed(@NonNull JSONObject cause) {
//                        ToastUtils.showToast(HWCNActivity.this, "绑定失败 " + cause);
//                    }
//                });
        });

    }
}