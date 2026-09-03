package com.ruixue.demo.topon;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.interstitial.api.ATInterstitialAutoEventListener;
import com.anythink.interstitial.api.ATInterstitialAutoLoadListener;
import com.ruixue.topon.adtype.RxATInterstitial;
import com.ruixue.topon.adtype.RxATInterstitialAutoAd;

public class InnerAudoActivity extends Activity {

    public static final String TAG = "InnerAudoActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inner_audo);
        RxATInterstitialAutoAd.rxInit(InnerAudoActivity.this,
                new String[]{"b62b41f080cfc5"},
                new ATInterstitialAutoLoadListener() {
                    @Override
                    public void onInterstitialAutoLoaded(String s) {
                        Log.d(TAG, "onInterstitialAutoLoaded");
                    }

                    @Override
                    public void onInterstitialAutoLoadFail(String s, AdError adError) {
                        Log.d(TAG, "onInterstitialAutoLoadFail");
                    }
                });

        findViewById(R.id.show).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxATInterstitial.rxEntryAdScenario("b62b41f080cfc5", "");
                //需判断广告位是否准备好
                if(RxATInterstitialAutoAd.rxIsAdReady("b62b41f080cfc5")){
                    RxATInterstitialAutoAd.show(
                            InnerAudoActivity.this,
                            "b62b41f080cfc5",
                            "",
                            new ATInterstitialAutoEventListener() {
                                @Override
                                public void onInterstitialAdClicked(ATAdInfo atAdInfo) {
                                    Log.d(TAG, "onInterstitialAdClicked");
                                }

                                @Override
                                public void onInterstitialAdShow(ATAdInfo atAdInfo) {
                                    Log.d(TAG, "onInterstitialAdShow");
                                }

                                @Override
                                public void onInterstitialAdClose(ATAdInfo atAdInfo) {
                                    Log.d(TAG, "onInterstitialAdClose");
                                }

                                @Override
                                public void onInterstitialAdVideoStart(ATAdInfo atAdInfo) {
                                    Log.d(TAG, "onInterstitialAdVideoStart");
                                }

                                @Override
                                public void onInterstitialAdVideoEnd(ATAdInfo atAdInfo) {
                                    Log.d(TAG, "onInterstitialAdVideoEnd");
                                }

                                @Override
                                public void onInterstitialAdVideoError(AdError adError) {
                                    Log.d(TAG, "onInterstitialAdVideoError");
                                }
                            }
                    );
                }
            }
        });

    }
}