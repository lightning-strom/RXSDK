package com.ruixue.ad;

import android.app.Activity;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;

import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import java.util.concurrent.atomic.AtomicBoolean;


//参考文档 https://developers.google.com/admob/android/quick-start?hl=zh-CN#import_the_mobile_ads_sdk
//激励广告 https://developers.google.com/admob/android/migration?hl=zh-cn
public class AdMobSdkHelper {
    private static final String TAG = AdMobSdkHelper.class.getSimpleName();
    private static RewardedAd smRewardedAd;
    private static String AD_UNIT_ID;
    private static AdMobCallback adMobCallback;

    private static final AtomicBoolean isLoading = new AtomicBoolean(false);

    public static void init(Activity activity, String ad_unit_id, AdMobCallback callback) {
        AD_UNIT_ID = ad_unit_id;
        MobileAds.initialize(activity, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(@NonNull InitializationStatus initializationStatus) {

            }
        });
        adMobCallback=callback;
        loadRewardedAd(activity);
    }

    public static void loadRewardedAd(Activity activity) {
        if (smRewardedAd == null && !TextUtils.isEmpty(AD_UNIT_ID)) {
            isLoading.set(true);
            AdRequest adRequest = new AdRequest.Builder().build();
            RewardedAd.load(
                    activity,
                    AD_UNIT_ID,
                    adRequest,
                    new RewardedAdLoadCallback() {
                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            // Handle the error.
                            Log.d(TAG, loadAdError.getMessage());
                            smRewardedAd = null;
                            isLoading.set(false);
                            adMobCallback.onAdFailedToLoad(loadAdError.getCode(), loadAdError.getMessage());
                        }

                        @Override
                        public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                            AdMobSdkHelper.smRewardedAd = rewardedAd;
                            Log.d(TAG, "onAdLoaded");
                            isLoading.set(false);
                            adMobCallback.onAdLoaded(rewardedAd.getAdUnitId(), rewardedAd.getAdMetadata());
                        }
                    });
        }
    }


    public static void showRewardedVideo(Activity activity) {
        if (smRewardedAd == null) {
            Log.d("TAG", "The rewarded ad wasn't ready yet.");
            return;
        }
        smRewardedAd.setFullScreenContentCallback(
                new FullScreenContentCallback() {
                    @Override
                    public void onAdShowedFullScreenContent() {
                        // Called when ad is shown.
                        Log.d(TAG, "onAdShowedFullScreenContent");
                    }

                    @Override
                    public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                        // Called when ad fails to show.
                        Log.d(TAG, "onAdFailedToShowFullScreenContent");
                        // Don't forget to set the ad reference to null so you
                        // don't show the ad a second time.
                        smRewardedAd = null;
                    }

                    @Override
                    public void onAdDismissedFullScreenContent() {
                        // Called when ad is dismissed.
                        // Don't forget to set the ad reference to null so you
                        // don't show the ad a second time.
                        smRewardedAd = null;
                        Log.d(TAG, "onAdDismissedFullScreenContent");
                        // Preload the next rewarded ad.
                        loadRewardedAd(activity);
                    }
                });
        smRewardedAd.show(activity, new OnUserEarnedRewardListener() {
            @Override
            public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                // Handle the reward.
                Log.d("TAG", "The user earned the reward.");
                int rewardAmount = rewardItem.getAmount();
                String rewardType = rewardItem.getType();
            }
        });
    }
}
