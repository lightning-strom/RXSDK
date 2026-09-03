package com.ruixue.demo.topon;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.rewardvideo.api.ATRewardVideoAutoEventListener;
import com.anythink.rewardvideo.api.ATRewardVideoAutoLoadListener;
import com.ruixue.topon.adtype.RxATRewardVideoAd;
import com.ruixue.topon.adtype.RxATRewardVideoAutoAd;

public class RewardAudoActivity extends Activity {

    public final static String TAG = "RewardAudoActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reward_audo);

        RxATRewardVideoAutoAd.rxInit(
                RewardAudoActivity.this,
                new String[]{"b62b420ba3c661"},
                new ATRewardVideoAutoLoadListener() {
                    @Override
                    public void onRewardVideoAutoLoaded(String s) {
                        Log.d(TAG, "onRewardVideoAutoLoaded:" + s);
                    }

                    @Override
                    public void onRewardVideoAutoLoadFail(String s, AdError adError) {
                        Log.d(TAG, "onRewardVideoAutoLoadFail: " + s);
                    }
                }
        );

        findViewById(R.id.show).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                RxATRewardVideoAd.rxEntryAdScenario("b62b420ba3c661", null);
                //需判断广告位是否准备好
                if(RxATRewardVideoAutoAd.rxIsAdReady("b62b420ba3c661")){
                    RxATRewardVideoAutoAd.rxShow(RewardAudoActivity.this, "b62b420ba3c661",
                            "", new ATRewardVideoAutoEventListener() {
                        @Override
                        public void onRewardedVideoAdPlayStart(ATAdInfo atAdInfo) {
                            Log.d(TAG, "onRewardedVideoAdPlayStart");
                        }

                        @Override
                        public void onRewardedVideoAdPlayEnd(ATAdInfo atAdInfo) {
                            Log.d(TAG, "onRewardedVideoAdPlayEnd");
                        }

                        @Override
                        public void onRewardedVideoAdPlayFailed(AdError adError, ATAdInfo atAdInfo) {
                            Log.d(TAG, "onRewardedVideoAdPlayFailed");
                        }

                        @Override
                        public void onRewardedVideoAdClosed(ATAdInfo atAdInfo) {
                            Log.d(TAG, "onRewardedVideoAdClosed");
                        }

                        @Override
                        public void onRewardedVideoAdPlayClicked(ATAdInfo atAdInfo) {
                            Log.d(TAG, "onRewardedVideoAdPlayClicked");
                        }

                        @Override
                        public void onReward(ATAdInfo atAdInfo) {
                            Log.d(TAG, "onReward");
                        }
                    });
                }
            }
        });

    }
}