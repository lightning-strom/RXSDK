package com.ruixue.demo.topon;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;


import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.nativead.api.ATNativeAdView;
import com.anythink.nativead.api.ATNativeEventListener;
import com.anythink.nativead.api.ATNativeNetworkListener;
import com.ruixue.topon.adtype.RxATNative;
import com.ruixue.topon.bean.RxNativeAd;

public class NativeActivity extends Activity {

    public final static String TAG = "NativeActivity";

    RxATNative atNative;
    RxNativeAd mNativeAd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_native);

        loadNativeAd();

        findViewById(R.id.get_id).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxNativeAd rxNativeAd = atNative.rxGetNativeAd();
                rxNativeAd.setNativeEventListener(new ATNativeEventListener() {
                    @Override
                    public void onAdImpressed(ATNativeAdView atNativeAdView, ATAdInfo atAdInfo) {

                    }

                    @Override
                    public void onAdClicked(ATNativeAdView atNativeAdView, ATAdInfo atAdInfo) {

                    }

                    @Override
                    public void onAdVideoStart(ATNativeAdView atNativeAdView) {

                    }

                    @Override
                    public void onAdVideoEnd(ATNativeAdView atNativeAdView) {

                    }

                    @Override
                    public void onAdVideoProgress(ATNativeAdView atNativeAdView, int i) {

                    }
                });
                Log.d(TAG, "getAdInfo: " + rxNativeAd.getAdInfo().getCountry());
                Log.d(TAG, "getNativeType: " + rxNativeAd.getNativeType());
                Log.d(TAG, "getAdInfo: " + rxNativeAd.getAdInfo().toString());
            }
        });

    }

    public void loadNativeAd() {
        if (atNative == null) {
            //初始化广告加载对象
            atNative = new RxATNative(this, "b62b420bf038e3", new ATNativeNetworkListener() {
                @Override
                public void onNativeAdLoaded() {
                    Log.i(TAG, "onNativeAdLoaded");
                }

                @Override
                public void onNativeAdLoadFail(AdError adError) {
                    //注意：禁止在此回调中执行广告的加载方法进行重试，否则会引起很多无用请求且可能会导致应用卡顿
                    //AdError，请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_test?id=aderror
                    Log.i(TAG, "onNativeAdLoadFail:" + adError.getFullErrorInfo());
                }
            });
        }

        //发起广告请求
        atNative.makeAdRequest();




    }

}