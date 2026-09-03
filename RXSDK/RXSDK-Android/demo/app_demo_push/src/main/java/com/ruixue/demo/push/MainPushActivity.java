package com.ruixue.demo.push;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AppOpsManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.utils.DemoUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.push.RxPushManager;
import com.ruixue.push.core.DeviceResultCallback;
import com.ruixue.view.AlertTipView;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class MainPushActivity extends AppCompatActivity implements View.OnClickListener {

    private final Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            String log = (String) msg.obj;
            ((TextView) findViewById(R.id.tv_log)).setText(log);

//            if(log.contains("task_id")) {
//                AlertTipView.create(MainPushActivity.this, "参数信息", log, null).setContentGravity(Gravity.START).show();
//            }
//            if (consoleView != null)
//                consoleView.showLog(log);
//            ((TextView) findViewById(R.id.content)).setText(Http.resultLogger);
        }
    };

    public void showLog(String json) {
        RXLogger.i("showLog:" + json);
        Message msg = new Message();
        msg.what = 0;
        msg.obj = json;
        handler.sendMessage(msg);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main_push);
        boolean issuccess = RxPushManager.init(this);
        registerToken();
        openAppCallback(getIntent());
        showLog("init:" + issuccess + ",bundle:" + DemoUtils.bundleToString(getIntent().getExtras()));

        Objects.requireNonNull(getSupportActionBar()).setTitle("当前推送平台：" + RxPushManager.getBrandName());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        showLog("bundle:" + DemoUtils.bundleToString(getIntent().getExtras()));
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
     * 使用瑞雪 **推送自定义透传参数（deeplink）**  的解析示例
     * @param intent 在 LAUNCHER Activity 的 onCreate 或 onNewIntent 中获取 deeplink ，并调用 openAppCallback 传 intent 统计点击
     */
    private void parseDeeplink(Intent intent) {

        String ob = intent.getStringExtra("payload");
//            JSONObject jsonObject = new JSONObject(ob);
//            Log.i("deeplink",jsonObject.toString());
//            String deeplink=jsonObject.optString("deeplink");
        //todo 解析 deeplink 值,执行相应业务逻辑
        AlertTipView.create(MainPushActivity.this, "payload", ob, null).setContentGravity(Gravity.START).show();

    }

    /**
     * In Opening a Specified Page of an App, how to Generate Intent parameters.
     */
    public static String generateIntentUri() {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        // You can add parameters in either of the following ways:
        // Define a scheme protocol, for example, pushscheme://com.huawei.codelabpush/deeplink?.
        // way 1 start: Use ampersands (&) to separate key-value pairs. The following is an example:
        intent.setData(Uri.parse("ruixue://com.ruixue.push/deeplink?name=abc&age=180"));
        // way 1 end. In this example, name=abc and age=180 are two key-value pairs separated by an ampersand (&).

        // way 2 start: Directly add parameters to the Intent.
        // intent.setData(Uri.parse("pushscheme://com.huawei.codelabpush/deeplink?"));
        // intent.putExtra("name", "abc");
        // intent.putExtra("age", 180);
        // way 2 end.

        // The following flag is mandatory. If it is not added, duplicate messages may be displayed.
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        String intentUri = intent.toUri(Intent.URI_INTENT_SCHEME);
        // The value of intentUri will be assigned to the intent parameter in the message to be sent.
        Log.d("intentUri:", intentUri);
        // You can start the deep link activity with the following code.
        //intent.setClass(this, DeeplinkActivity.class);
        //startActivity(intent);
        return intentUri;
    }

    private void showDeviceToken() {
        showLog(RxPushManager.getDeviceToken());
    }

    private void registerToken() {
        if (RuiXueSdk.isLoggedIn()) {
            RxPushManager.registerToken(new DeviceResultCallback() {
                @Override
                public void onResult(String result) {
                    showLog("" + RxPushManager.getDeviceToken());
                }
            });
        } else {

            showLog("请先登录再注册设备");
        }
    }

    public static String isNotificationEnabled(Context var0) {
        String var1 = "unknown";
        if (Build.VERSION.SDK_INT >= 24) {
            try {
                NotificationManager var2 = (NotificationManager) var0.getSystemService(Context.NOTIFICATION_SERVICE);
                boolean var3 = var2.areNotificationsEnabled();
                var1 = String.valueOf(var3);
            } catch (Throwable ignored) {
            }
        } else {
            try {
                AppOpsManager var13 = (AppOpsManager) var0.getSystemService(Context.APP_OPS_SERVICE);
                ApplicationInfo var14 = var0.getApplicationInfo();
                String var4 = var0.getApplicationContext().getPackageName();
                int var5 = var14.uid;
                Class<?> var6 = Class.forName(AppOpsManager.class.getName());
                Method var7 = var6.getMethod("checkOpNoThrow", Integer.TYPE, Integer.TYPE, String.class);
                Field var8 = var6.getDeclaredField("OP_POST_NOTIFICATION");
                int var9 = (Integer) var8.get(var13);
                int var10 = (Integer) var7.invoke(var13, var9, var5, var4);
                var1 = String.valueOf(var10 == 0);
            } catch (Exception var11) {
                Log.e("DeviceConfig", "检测通知开关是否打开异常");
            }
        }

        return var1;
    }


    @Override
    public void onClick(View v) {
        int id = v.getId();

        if (id == R.id.btn_register_push) {
            registerToken();
        } else if (id == R.id.btn_unregister_push) {
            RxPushManager.unRegisterToken();
        } else if (id == R.id.btn_get_token) {
            showDeviceToken();
        } else if (id == R.id.btn_set_tag) {
            EditText editText = findViewById(R.id.et_tag);
            String[] tags = editText.getText().toString().split(",");
            RxPushManager.addTags(tags);
        } else if (id == R.id.btn_unset_tag) {
            EditText editText = findViewById(R.id.et_tag);
            String[] tags = editText.getText().toString().split(",");
            RxPushManager.delTags(tags);
        } else if (id == R.id.btn_bind_alias) {
            EditText editText = findViewById(R.id.et_alias);
            String alias = editText.getText().toString();
            RxPushManager.bindAlias(alias);
        } else if (id == R.id.btn_unbind_alias) {
            EditText editText = findViewById(R.id.et_alias);
            String alias = editText.getText().toString();
            RxPushManager.unBindAlias(alias);
        } else if (id == R.id.btn_turn_on) {
            RxPushManager.turnOnPush();
        } else if (id == R.id.btn_turn_off) {
            RxPushManager.turnOffPush();
        } else if (id == R.id.btn_login) {

        } else if (id == R.id.btn_check) {
            String osVersion = "Android版本：" + android.os.Build.VERSION.RELEASE + "\n" +
                    "Build.BRAND：" + Build.BRAND + "\n";
            String msg = osVersion + "系统通知开关是否打开：" + isNotificationEnabled(this);
            DemoUtils.showDialog(this, msg);
        } else if (id == R.id.btn_intent_uri) {
            String uri = generateIntentUri();
            showLog(uri);
        }
    }
}