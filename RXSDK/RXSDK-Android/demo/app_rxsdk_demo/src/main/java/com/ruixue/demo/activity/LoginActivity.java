package com.ruixue.demo.activity;
import com.ruixue.demo.helper.LoginV2DemoHelper;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.GlobalConfig;


import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.StringRes;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class LoginActivity extends BaseSdkLifecycleActivity implements View.OnClickListener {

    private static final String TAG = LoginActivity.class.getSimpleName();

    EditText et_appid, et_channelid, et_cpid;
    private final Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            ((TextView) findViewById(R.id.txv_log)).setText((String) msg.obj);
//            ((TextView) findViewById(R.id.content)).setText(Http.resultLogger);
        }
    };

    public void showLog(String json) {
        RXLogger.i("showLog:" + json);
        if (handler != null) {
            Message msg = new Message();
            msg.what = 0;
            msg.obj = json;
            handler.sendMessage(msg);
        } else {
            Toast.makeText(this, json, Toast.LENGTH_SHORT).show();
        }
    }

    RXJSONCallback callback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            showLog(data != null ? data.toString() : "success");
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            showLog(cause.toString());

        }
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_login);
        LoginV2DemoHelper.setContext(this);
        LoginV2DemoHelper.setHandler(handler);
        et_appid = (EditText) findViewById(R.id.et_appid);
        et_channelid = (EditText) findViewById(R.id.et_channelid);
        et_cpid = (EditText) findViewById(R.id.et_cpid);
        Spinner sp_base_url = findViewById(R.id.sp_base_url);
        EditText et_domain = findViewById(R.id.et_domain);

        et_appid.setText(RuiXueSdk.getProductId());
        et_channelid.setText(RuiXueSdk.getChannelId());
        et_cpid.setText(RuiXueSdk.getCpId());
        et_domain.setText(RuiXueSdk.getFirstBaseUrl());

//        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, GlobalConfig.getBaseUrls());
//        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//        sp_base_url.setAdapter(adapter);
//
//        int select = -1;
//        sp_base_url.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
//            @Override
//            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
//                RXLogger.i("you clicked item " + position + "" + id);
//                String baseUrl = GlobalConfig.getBaseUrls()[position];
////                GlobalConfig.getConfig().setBaseUrl(Collections.singletonList(baseUrl));
//            }
//
//            @Override
//            public void onNothingSelected(AdapterView<?> parent) {
//
//            }
//        });

        ((Button) findViewById(R.id.btn_save_config)).setOnClickListener(view -> {
            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());

            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(et_domain.getWindowToken(), 0);

            RxSdkHelper.init(et_cpid.getText().toString(), et_appid.getText().toString(), et_channelid.getText().toString(), et_domain.getText().toString());
            RxSdkHelper.onCreate(this,callback);
        });

        ((Button) findViewById(R.id.btn_open_next)).setOnClickListener(view -> {
            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("ignore_check_login", true);
            ActivityUtils.startActivityByClass(LoginActivity.this, GlobalConfig.getMainActivity(), hashMap);
        });
//        if (GlobalConfig.getConfig() != null) {
//            et_appid.setText(GlobalConfig.getConfig().getProductid());
//            et_channelid.setText(GlobalConfig.getConfig().getChannelid());
//            et_cpid.setText(GlobalConfig.getConfig().getCpid());
//            String[] urls = GlobalConfig.getBaseUrls();
//            for (int i = 0; i < urls.length; ++i) {
//                if (urls[i].equals(GlobalConfig.getConfig().getBaseUrl().get(0))) {
//                    select = i;
//                    break;
//                }
//            }
//            if (select >= 0)
//                sp_base_url.setSelection(select);
//        }

        RxSdkHelper.onCreate(this,callback);
    }

    private void showLoginFailed(@StringRes Integer errorString) {
        Toast.makeText(getApplicationContext(), errorString, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onClick(View view) {
        int resid = view.getId();
        HashMap<String, String> hashMap = new HashMap<>();
        if (resid == R.id.login_guest) {
            LoginV2DemoHelper.loginByGuest(this, true);
        } else if (resid == R.id.regist_account) {//注册账号
            EditText username = (EditText) findViewById(R.id.username);
            EditText password = (EditText) findViewById(R.id.password);
            LoginV2DemoHelper.registerAccount(this, username.getText().toString(), password.getText().toString());

        } else if (resid == R.id.login_account) {
            EditText username = (EditText) findViewById(R.id.username);
            EditText password = (EditText) findViewById(R.id.password);
            LoginV2DemoHelper.loginByAccount(this, username.getText().toString(), password.getText().toString(), true);

        } else if (resid == R.id.login_alimobile) {
            LoginV2DemoHelper.loginQuickMode(this);
        }
//        else if (resid == R.id.login_virtual) {
//            LoginV2DemoHelper.login(this, "virtual", null, true);
//        } else if (resid == R.id.login_wechat) {
//            LoginV2DemoHelper.login(this, "wechat", null, true);
//        } else if (resid == R.id.login_google) {
//            LoginV2DemoHelper.login(this, "google", null, true);
//        } else if (resid == R.id.login_facebook) {
//            LoginV2DemoHelper.login(this, "facebook", null, true);
//        } else if (resid == R.id.login_token) {
//
//        } else if (resid == R.id.login_ysdkqq) {
//            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
//
//            Map<String, Object> map = new HashMap<>();
//            map.put("platform_type", "1");
//            LoginV2DemoHelper.login(this, LoginMethod.YSDK, map, true);
//        } else if (resid == R.id.login_ysdkwx) {
//            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
//
//            Map<String, Object> map = new HashMap<>();
//            map.put("platform_type", "2");
//            LoginV2DemoHelper.login(this, LoginMethod.YSDK, map, true);
//        }
        else if (resid == R.id.login_third) {
            LoginV2DemoHelper.login(this, null, null, true);
        }
    }
}