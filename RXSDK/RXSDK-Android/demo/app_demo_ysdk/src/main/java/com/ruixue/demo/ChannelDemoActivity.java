package com.ruixue.demo;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.demo.ysdk.R;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.sdk.RXYsdkLoginConfig;
import com.tencent.ysdk.framework.common.ePlatform;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ChannelDemoActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ysdkdemo);
        Map<String, Object> map = new HashMap<>();
        RXSdkApi.getInstance().initThirdSdk(this, map, null);
    }

    RXJSONCallback callback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            if (data != null) {
                RXLogger.i("应用宝登录成功结果: " + data.toString());
                Toast.makeText(ChannelDemoActivity.this, "登录成功", Toast.LENGTH_LONG).show();
            }
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            RXLogger.i("应用宝登录失败结果:" + cause.toString());
            Toast.makeText(ChannelDemoActivity.this, "登录失败:" + cause.toString(), Toast.LENGTH_LONG).show();

        }
    };

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

//        RXLogger.i("应用宝登录 onActivityResult:" +  data.toString());
//
//        YSDKApi.onActivityResult(requestCode, resultCode, data);

        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);

    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        Map<String, Object> hashMap = new HashMap<>();

        if (id == R.id.pay_midas) {
            hashMap.put("goods_tag", "bytest");
            hashMap.put("hq_type", "midas");
            hashMap.put("type", "midas");
            hashMap.put("trade_no", String.valueOf(System.currentTimeMillis()));
            RXSdkApi.getInstance().pay(this, hashMap, new RXRequestCallback() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    Log.d("ChannelDemoActivity", "米大师支付：" + jsonObject.toString());
                }
            });
        } else if (id == R.id.pay_ysdk) {
//            hashMap.put("goods_tag", "bytest");
            hashMap.put("goods_tag", "goods_forever_1_10");//ddz
            hashMap.put("env", 1);
            hashMap.put("hq_type", "ysdk");
            hashMap.put("trade_no", String.valueOf(System.currentTimeMillis()));
            RXSdkApi.getInstance().pay(this, hashMap, new RXRequestCallback() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    Log.d("ChannelDemoActivity", "米大师支付：" + jsonObject.toString());
                }
            });
        } else if (id == R.id.login_qq) {
            login(ePlatform.PLATFORM_ID_QQ);
        } else if (id == R.id.login_wx) {
            login(ePlatform.PLATFORM_ID_WX);
        } else if (id == R.id.login_guest) {
            login(ePlatform.PLATFORM_ID_GUEST);
        } else if (id == R.id.login_ui) {
            loginWithUI();
        } else if (id == R.id.logout) {
            logout();
        }
    }

    public void login(int platform_type) {
        Map<String, Object> map = new HashMap<>();
        map.put("method", "ysdk");
        map.put("platform_type", platform_type);
        RuiXueSdk.getRXSdkApi().login(this, map, callback);
    }

    private void loginWithUI() {
        Map<String, Object> map = new HashMap<>();
        map.put("method", "ysdk");
        map.put("ysdk_login_type", "ysdk_login_ui");
        Map<String, String> privacyInfo = new HashMap<>();
        privacyInfo.put("《用户协议》", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001");
        privacyInfo.put("《隐私协议》", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh");
        RXYsdkLoginConfig config = new RXYsdkLoginConfig.Builder()
                .configPrivacyInfo(privacyInfo)
                .configLoginUiOrientation(RXYsdkLoginConfig.RXYsdkLoginUiOrientation.DEFAULT)
                .configShowCloseButton(true)
                .configPhoneLoginPlatform(true)
                .configSkipYsdkAntiAddiction(false)
                .configShowLoginFailToast(true)
                .configYsdkAutoLogin(true)
                .configYsdkAntiAddictionDialog(true)
                .create();
        map.put("ysdk_login_ui_config", config.toMap());
        RuiXueSdk.getRXSdkApi().login(this, map, callback);
    }

    private void logout() {
        RuiXueSdk.getRXSdkApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                RXLogger.d("应用宝登出成功");
            }
        });
    }

}