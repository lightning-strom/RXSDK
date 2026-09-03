package com.ruixue.ad;

import android.app.Activity;
import android.os.Handler;
import android.os.Message;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.reward.RewardItem;
import com.google.android.gms.ads.reward.RewardedVideoAd;
import com.google.android.gms.ads.reward.RewardedVideoAdListener;
import com.sdk.google.admob.R;


//参考文档 https://developers.google.com/admob/android/quick-start?hl=zh-CN#import_the_mobile_ads_sdk
//激励广告 https://developers.google.com/admob/android/rewarded-ads?hl=zh-CN
public class AdsHelper {

    private static Activity activity=null;
    private static Handler handler=null;
    private static RewardedVideoAd mRewardedVideoAd;

    public static void init(Activity mactivity) {
        activity = mactivity;
        ad(activity);
    }


    public static void showAd(String sceneName, Handler mhandler) {
        handler = mhandler;
        if(activity!=null){
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    play();
                }
            });

        }
    }

    public static void onResume() {
        if(mRewardedVideoAd!=null&&activity!=null){
            mRewardedVideoAd.resume(activity);
        }
    }

    public static void onPause() {
        if(mRewardedVideoAd!=null&&activity!=null){
            mRewardedVideoAd.pause(activity);
        }
    }

    public static void onDestroy() {
        if(mRewardedVideoAd!=null&&activity!=null){
            mRewardedVideoAd.destroy(activity);
        }
    }


    public static void closeAd() {
        if(activity!=null){
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    close();
                }
            });

        }

    }





    public static void ad(Activity mactivity) {
        if(mRewardedVideoAd!=null){
            mRewardedVideoAd.destroy(activity);
            mRewardedVideoAd = null;
        }

//        if(BuildConfig.DEBUG){
//            MobileAds.initialize(mactivity, mactivity.getResources().getString(R.string.debug_admob_app_id));
//        }else{
            MobileAds.initialize(mactivity, mactivity.getResources().getString(R.string.admob_app_id));
//        }
        // Use an activity context to get the rewarded video instance.
        mRewardedVideoAd = MobileAds.getRewardedVideoAdInstance(mactivity);



        mRewardedVideoAd.setRewardedVideoAdListener(new RewardedVideoAdListener() {

            @Override
            public void onRewarded(RewardItem reward) {

                // Reward the user.
                    if(handler!=null){
//                        Toast.makeText(activity, "onRewarded! currency: " + reward.getType() + "  amount: " +
//                                reward.getAmount(), Toast.LENGTH_SHORT).show();
                        Message message = new Message();
                        message.what = 1;
                        handler.sendMessage(message);
                        handler = null;
                    }
            }

            @Override
            public void onRewardedVideoAdLeftApplication() {
//                Toast.makeText(activity, "onRewardedVideoAdLeftApplication", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onRewardedVideoAdClosed() {
                loadRewardedVideoAd();
                if(handler!=null){
//                    Toast.makeText(activity, "onRewardedVideoAdClosed", Toast.LENGTH_SHORT).show();
                    Message message = new Message();
                    message.what = 2;
                    handler.sendMessage(message);
                    handler = null;
                }

            }

            @Override
            public void onRewardedVideoAdFailedToLoad(int errorCode) {
//                Toast.makeText(activity, "onRewardedVideoAdFailedToLoad", Toast.LENGTH_SHORT).show();
//                    ad(activity);
                    if(handler!=null){
                        Message message = new Message();
                        message.what = 2;
                        handler.sendMessage(message);
                        handler = null;
                    }
            }

            @Override
            public void onRewardedVideoAdLoaded() {
//                Toast.makeText(activity, "onRewardedVideoAdLoaded", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onRewardedVideoAdOpened() {
//                Toast.makeText(activity, "onRewardedVideoAdOpened", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onRewardedVideoStarted() {
//                Toast.makeText(activity, "onRewardedVideoStarted", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onRewardedVideoCompleted() {
//                Toast.makeText(activity, "onRewardedVideoCompleted", Toast.LENGTH_SHORT).show();
            }
        });
        loadRewardedVideoAd();

    }
    private static void loadRewardedVideoAd() {
        if(mRewardedVideoAd!=null){
//            if(BuildConfig.DEBUG){
//                mRewardedVideoAd.loadAd(activity.getResources().getString(R.string.debug_jili_id),
//                        new AdRequest.Builder().build());
//            }else{
                mRewardedVideoAd.loadAd(activity.getResources().getString(R.string.jili_id),
                        new AdRequest.Builder().build());//.addTestDevice("AF68E257134446E1E518937371E7D05B")
//            }

        }
    }


    public static void play(){
        if (mRewardedVideoAd.isLoaded()) {
            mRewardedVideoAd.show();
        }else{
            Message message = new Message();
            message.what = 3;
            handler.sendMessage(message);
            handler = null;
        }
    }

    public static void close(){
    }



}
