package com.ruixue.demo.oppo;


import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.infinix.InfinixSdkHelper;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.transsion.gamead.GameAdBannerListener;
import com.transsion.gamead.GameAdLoadListener;
import com.transsion.gamead.GameAdRewardShowListener;
import com.transsion.gamead.GameAdShowListener;
import com.transsion.gamead.GameRewardItem;
import com.transsion.gamead.OnOpenAppLoadListener;
import com.transsion.gamead.OnOpenAppShowListener;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/13
 */
public class DemoActivity extends AppCompatActivity {
    private static final String TAG = "Infinix";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);

        TextView tvTitle = findViewById(R.id.tvTitle);
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) tvTitle.getLayoutParams();
        layoutParams.topMargin = AppUtils.getStatusBarHeight();
        tvTitle.setLayoutParams(layoutParams);

        // 注册生命周期监听
        RuiXueSdk.trackingLifecycle(this);

        // 同意隐私协议
        RuiXueSdk.setPrivacyAgree(new PrivacyCallback() {
            @Override
            public void onPrivacyAgree(boolean b) {

            }
        });

        String cpid = "119";
        String productId = "SDKOS";
        String channelId = "AndroidOS";
        List<String> hostUrls = new ArrayList<>();
        hostUrls.add("https://os-api-test.ruixueyun.com");

        RuiXueSdk.initialize(cpid, productId, channelId, hostUrls, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RuiXueSdk.setDebugEnabled(true);
                RXLogger.d("RXSDK 初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d("RXSDK 初始化失败 - " + jsonObject);
            }
        });

        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                RXLogger.d(TAG, "onLogout code = " + code + " msg = " + msg);
            }
        });

        findViewById(R.id.btn_init).setOnClickListener(v -> init());

        findViewById(R.id.btn_login).setOnClickListener(v -> login());

        findViewById(R.id.btn_pay).setOnClickListener(v -> pay());

        findViewById(R.id.btn_logout).setOnClickListener(v -> logout());

        findViewById(R.id.btn_exit).setOnClickListener(v -> exit());

        findViewById(R.id.btn_interstitial).setOnClickListener(v -> showInterstitial());
        findViewById(R.id.btn_reward).setOnClickListener(v -> showReward());
        findViewById(R.id.btn_open_app).setOnClickListener(v -> showOpenAppAd());
        findViewById(R.id.btn_open_banner).setOnClickListener(v -> showBanner());
        findViewById(R.id.btn_close_banner).setOnClickListener(v -> closeBanner());
    }

    private void init() {
        Map<String, Object> ext = new HashMap<>();
        ext.put("infinix_debuggable", true);
        ext.put("infinix_env", "test");
        RuiXueSdk.getApi().initThirdSdk(this, ext, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject jsonObject) {
                RXLogger.d("init third sdk success");
                ToastUtils.showToast(DemoActivity.this, "初始化成功");
                loadAd();
            }

            @Override
            public void onFailed(@NonNull JSONObject jsonObject) {
                RXLogger.d("init third sdk failed " + jsonObject);
                ToastUtils.showToast(DemoActivity.this, "初始化失败" + jsonObject);
            }
        });
    }

    private void loadAd() {
        InfinixSdkHelper.loadInterstitial(this, new GameAdLoadListener() {
            @Override
            public void onAdLoaded() {
                RXLogger.d(TAG, "load interstitial success");
            }

            @Override
            public void onAdFailedToLoad(int i, String s) {
                RXLogger.d(TAG, "load interstitial failed " + i + " " + s);
            }
        });

        InfinixSdkHelper.loadReward(this, new GameAdLoadListener() {
            @Override
            public void onAdLoaded() {
                RXLogger.d(TAG, "load reward success");
            }

            @Override
            public void onAdFailedToLoad(int i, String s) {
                RXLogger.d(TAG, "load reward failed " + i + " " + s);
            }
        });

        InfinixSdkHelper.loadOpenAppAd(this, new OnOpenAppLoadListener() {
            @Override
            public void onAdLoaded() {
                RXLogger.d(TAG, "load open app ad success");
            }

            @Override
            public void onAdError(int i, String s) {
                RXLogger.d(TAG, "load open app ad failed " + i + " " + s);
            }
        });
    }

    private void login() {
        String username = null;
        String loginType = LoginMethod.GUEST;
        String password = null;
        String captchaCode = null;
        String loginOpenId = null;
        Map<String, Object> ext = null;
        String[] signFields = null;
        Object migrateArgs = null;
        RuiXueSdk.getApi().login(DemoActivity.this, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(DemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Toast.makeText(DemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showBanner() {

        InfinixSdkHelper.showBanner(this, new GameAdBannerListener() {
            @Override
            public void onAdOpened() {
                RXLogger.d(TAG, "banner onAdOpened");
            }

            @Override
            public void onAdClosed() {
                RXLogger.d(TAG, "banner onAdClosed");
            }

            @Override
            public void onAdImpression() {
                RXLogger.d(TAG, "banner onAdImpression");
            }

            @Override
            public void onAdLoaded() {
                RXLogger.d(TAG, "banner onAdLoaded");
            }

            @Override
            public void onAdFailedToLoad(int i, String s) {
                RXLogger.d(TAG, "banner onAdFailedToLoad " + i + " " + s);
            }
        });
    }

    private void closeBanner() {
        InfinixSdkHelper.closeBanner(this);
    }

    private void showInterstitial() {
        InfinixSdkHelper.showInterstitial(this, new GameAdShowListener() {
            @Override
            public void onShow() {
                Log.d(TAG, "展示插屏广告");
            }

            @Override
            public void onShowFailed(int i, String s) {
                Log.d(TAG, "展示插屏广告失败，错误码="+i+"，错误信息="+s);
            }

            @Override
            public void onClose() {
                Log.d(TAG, "插屏广告关闭");
            }

            @Override
            public void onClick() {
                Log.d(TAG, "点击插屏广告");
            }

            @Override
            public void onAdImpression() {
                Log.d(TAG, "插屏广告曝光");
            }
        });
    }

    private void showReward() {
        InfinixSdkHelper.showReward(this, new GameAdRewardShowListener() {
            @Override
            public void onUserEarnedReward(GameRewardItem rewardItem) {
                //可以再次发放奖励
                Log.i(TAG, "Reward onUserEarnedReward " + rewardItem.getType() + " " + rewardItem.getAmount());
//                addAndShow("用户获得奖励");
            }

            @Override
            public void onShow() {
                Log.i(TAG, "Reward show");
//                addAndShow("展示激励广告");
            }

            @Override
            public void onShowFailed(int code, String message) {
//                addAndShow("激励广告展示失败，错误码="+code+",错误信息="+message);
                Log.i(TAG, "Reward show fail " + code + " " + message);
            }

            @Override
            public void onClose() {
                Log.i(TAG, "Reward close");
//                addAndShow("关闭激励广告");
            }

            @Override
            public void onClick() {
                Log.i(TAG, "Reward onClick");
//                addAndShow("点击了激励广告");
            }

            @Override
            public void onAdImpression() {
                Log.i(TAG, "Reward onAdImpression");
//                addAndShow("激励广告曝光");
            }
        });
    }

    private void showOpenAppAd() {
        InfinixSdkHelper.showOpenAppAd(this, new OnOpenAppShowListener() {
            @Override
            public void onAdError(int errorCode, String errorMsg) {
                Log.d(TAG, "开屏广告展示错误：错误码= "+errorCode+"，错误信息="+errorMsg);
//                addAndShow("开屏广告展示错误：错误码= "+errorCode+"，错误信息="+errorMsg);
            }

            @Override
            public void onAdShowed() {
                Log.d(TAG,"开屏广告展示成功");
//                addAndShow("开屏广告展示成功");
            }

            @Override
            public void onAdDismissed() {
                Log.d(TAG,"开屏广告关闭");
//                addAndShow("开屏广告关闭");
            }

            @Override
            public void onAdClicked() {
                Log.d(TAG,"开屏广告点击");
//                addAndShow("开屏广告点击");
            }
        });
    }

    private void logout() {
        RuiXueSdk.getApi().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                Toast.makeText(DemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(int code, String msg) {
                RXLogger.d("logout failed code = " + code + " msg = " + msg);
                Toast.makeText(DemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void pay() {
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", "client_007");
        pay.put("goods_tag", "007_test");
        pay.put("env", 1);
        pay.put("age", 18);
        RuiXueSdk.getApi().pay(DemoActivity.this, pay, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Toast.makeText(DemoActivity.this, "支付完成", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "pay failed " + cause);
                Toast.makeText(DemoActivity.this, "支付失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void exit() {
        RuiXueSdk.exitApp(this, new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                Toast.makeText(DemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onExitCancel() {
                Toast.makeText(DemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        RuiXueSdk.onConfigurationChanged(this, newConfig);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }
}
