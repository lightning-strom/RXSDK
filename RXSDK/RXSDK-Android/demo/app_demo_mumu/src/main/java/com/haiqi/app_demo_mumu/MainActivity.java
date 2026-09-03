package com.haiqi.app_demo_mumu;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.demo.mumu.R;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.passport.LoginMethod;
import com.ruixue.sdk.YofunSdkHelper;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 全屏（隐藏状态栏）
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }
        setContentView(R.layout.activity_main);



        List<String> list = new ArrayList<>();
        list.add("https://yh9gc7be1n.hitoffapp.com");
        RuiXueSdk.init("264", "223", "1000038", list, new RXJSONCallback() {

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Log.d("mumuMainActivity", "init success: " + data.toString());
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.d("mumuMainActivity", "init fial: " + cause.toString());
            }
        });

        Log.d("mumuMainActivity","main page init initThirdSdk");
        RuiXueSdk.getApi().initThirdSdk(this, new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Log.d("mumuMainActivity", "init third success");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.d("mumuMainActivity", "init third failed: " + cause);
            }
        });

        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                Log.d("mumu", "退出登录");
            }

            @Override
            public void rxPublicCallback(int type, Map<String, Object> map) {
                super.rxPublicCallback(type, map);
                if (type == 1) {
                    Log.d("mumu", "UI 展示");
                } else {
                    Log.d("mumu", "UI 隐藏");
                }
            }

        });

        int type = 0;
        YofunSdkHelper.displayChannelLogo(this, type, new Runnable() {
            @Override
            public void run() {
                RXLogger.d("闪屏已显示"); // 闪屏结束回调。
            }
        });

        findViewById(R.id.login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                HashMap<String, Object> map = new HashMap<>();

                map.put("method", LoginMethod.MUMU);
                RuiXueSdk.login(MainActivity.this, new HashMap<>(), new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.d("mumuMainActivity", "login success: " + data.toString());
                        TextView textView = findViewById(R.id.pay_test);
                        textView.setText("login success: " + data.toString());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.d("mumuMainActivity", "login fail: " + cause.toString());
                        TextView textView = findViewById(R.id.pay_test);
                        textView.setText("login fail: " + cause.toString());
                    }
                });
            }
        });

        findViewById(R.id.pay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> pay = new HashMap<>();
                pay.put("hq_type", "mumu");
                pay.put("goods_tag", "830060001");
                pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
                pay.put("notify_url", "http://game.pay.result.callback");
                RuiXueSdk.getApi().pay(MainActivity.this, pay, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        Log.d("mumuMainActivity", "pay success: " + data.toString());
                        TextView textView = findViewById(R.id.pay_test);
                        textView.setText("pay success: " + data.toString());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        Log.d("mumuMainActivity", "pay fail: " + cause.toString());
                        TextView textView = findViewById(R.id.pay_test);
                        textView.setText("pay fail: " + cause.toString());
                    }
                });
            }
        });

        findViewById(R.id.exit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RuiXueSdk.exitApp(MainActivity.this, new OnAppExitCallback() {
                    @Override
                    public void onExitConfirm(@Nullable String res) {
                        // 退出app
                    }

                    @Override
                    public void onExitCancel() {
                        super.onExitCancel();
                        // 用户点取消，不处理
                    }

                });
            }
        });

    }
}