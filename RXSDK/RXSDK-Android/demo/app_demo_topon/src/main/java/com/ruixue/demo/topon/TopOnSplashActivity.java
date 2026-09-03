package com.ruixue.demo.topon;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.splashad.api.ATSplashSkipAdListener;
import com.ruixue.topon.adtype.RxATSplashAd;
import com.ruixue.topon.bean.RxATSplashAdExtraInfo;
import com.ruixue.topon.bean.RxATSplashSkipInfo;
import com.ruixue.topon.listener.RxATSplashAdListener;

public class TopOnSplashActivity extends Activity {

    public final static String TAG = "TopOnSplashActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_top_on_splash);

        FrameLayout container = findViewById(R.id.splash_ad_container);

        load(container);

    }

    public void load(FrameLayout container) {
        RxATSplashAdListener listener = new RxATSplashAdListener() {
            @Override
            public void onAdLoaded(boolean isTimeout) {
                Log.d(TAG, "onAdLoaded");
            }

            @Override
            public void onAdLoadTimeout() {
                Log.d(TAG, "onAdLoadTimeout");
            }

            @Override
            public void onNoAdError(AdError var1) {
                Log.d(TAG, "onNoAdError");
            }

            @Override
            public void onAdShow(ATAdInfo var1) {
                Log.d(TAG, "onAdShow");
            }

            @Override
            public void onAdClick(ATAdInfo var1) {
                Log.d(TAG, "onAdClick");
            }

            @Override
            public void onAdDismiss(ATAdInfo var1, RxATSplashAdExtraInfo rxATSplashAdExtraInfo) {
                SplashEyeAdHolder.splashEyeAd = rxATSplashAdExtraInfo.getAtSplashEyeAd();
                jumpToMainActivity(container);
                Log.d(TAG, "onAdDismiss");
            }
        };

        String defaultConfig = "";

        //设置首次开屏广告广告源，请从TopOn后台兜底开屏广告源导出配置
        // defaultConfig = "{\"unit_id\":1442678,\"nw_firm_id\":15,\"adapter_class\":\"com.anythink.network.toutiao.TTATSplashAdapter\",\"content\":\"{\\\"button_type\\\":\\\"0\\\",\\\"dl_type\\\":\\\"0\\\",\\\"slot_id\\\":\\\"100011\\\",\\\"personalized_template\\\":\\\"0\\\",\\\"zoomoutad_sw\\\":\\\"1\\\",\\\"app_id\\\":\\\"5001121\\\"}\"}";

        defaultConfig = "{\"unit_id\":1333176,\"nw_firm_id\":8,\"adapter_class\":\"com.anythink.network.gdt.GDTATSplashAdapter\",\"content\":\"{\\\"unit_id\\\":\\\"8863364436303842593\\\",\\\"zoomoutad_sw\\\":\\\"1\\\",\\\"app_id\\\":\\\"1101152570\\\"}\"}";

        RxATSplashAd splashAd = new RxATSplashAd(this, "b62b41521d52d1", listener,
                5000, defaultConfig);

        RxATSplashSkipInfo rxATSplashSkipInfo = new RxATSplashSkipInfo(container, new ATSplashSkipAdListener() {
            @Override
            public void onAdTick(long l, long l1) {
                Log.d(TAG, "onAdTick");
            }

            @Override
            public void isSupportCustomSkipView(boolean b) {
                Log.d(TAG, "isSupportCustomSkipView");
            }
        });

        if (splashAd.isAdReady()) {
            //container大小至少占屏幕75%
            splashAd.rxShow(this, container);
        }else{
            Log.d(TAG, "没有 ready");
            splashAd.loadAd();
        }


    }

    public void jumpToMainActivity(FrameLayout container) {

        if (SplashEyeAdHolder.splashEyeAd != null) {
            try {
                SplashZoomOutManager zoomOutManager = SplashZoomOutManager.getInstance(getApplicationContext());
                zoomOutManager.setSplashInfo(container.getChildAt(0),
                        getWindow().getDecorView());
            } catch (Throwable e) {
                Log.e(TAG, "jumpToMainActivity: ------------------------------------------ error");
                e.printStackTrace();
            }

            Intent intent = new Intent(this, SplashMainActivity.class);
            startActivity(intent);

            overridePendingTransition(0, 0);
        }
        Toast.makeText(this.getApplicationContext(), "start your MainActivity.", Toast.LENGTH_SHORT).show();
        finish();

    }


}