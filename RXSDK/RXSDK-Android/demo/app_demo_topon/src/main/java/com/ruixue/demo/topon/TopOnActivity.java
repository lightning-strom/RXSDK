package com.ruixue.demo.topon;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.anythink.core.api.ATAdConst;
import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.interstitial.api.ATInterstitialListener;
import com.anythink.rewardvideo.api.ATRewardVideoListener;
import com.ruixue.topon.adtype.RxATInterstitial;
import com.ruixue.topon.adtype.RxATRewardVideoAd;

import java.util.HashMap;
import java.util.Map;

public class TopOnActivity extends Activity {

    public final static String TAG = "TopOnActivity";

    RxATRewardVideoAd rxATRewardVideoAd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_top_on);

        rewardLoadAd();
        interLoadAd();

        findViewById(R.id.jilishipin).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                rewardShowAsd();
            }
        });

        findViewById(R.id.auto_reward).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TopOnActivity.this, RewardAudoActivity.class);
                startActivity(intent);
            }
        });

        findViewById(R.id.mannul_inter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                InnerShowAd();
            }
        });

        findViewById(R.id.auto_inter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TopOnActivity.this, InnerAudoActivity.class);
                startActivity(intent);
            }
        });

        findViewById(R.id.splash).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TopOnActivity.this, TopOnSplashActivity.class);
                startActivity(intent);
            }
        });

        findViewById(R.id.banner).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TopOnActivity.this, BannerActivity.class);
                startActivity(intent);
            }
        });

        findViewById(R.id.native_ad).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TopOnActivity.this, NativeActivity.class);
                startActivity(intent);
            }
        });

    }

    //注意：广告对象必须要全局引用，如果广告对象是临时变量会导致广告加载过程中有可能被回收，无法接收广告事件回调

    private void rewardLoadAd() {
        if (rxATRewardVideoAd == null) {
            rxATRewardVideoAd = new RxATRewardVideoAd(this, "b62b420ba3c661");
            rxATRewardVideoAd.setAdListener(new ATRewardVideoListener() {
                @Override
                public void onRewardedVideoAdLoaded() {
                    Log.d(TAG, "onRewardedVideoAdLoaded");
                }
                @Override
                public void onRewardedVideoAdFailed(AdError adError) {
                    //注意：禁止在此回调中执行广告的加载方法进行重试，否则会引起很多无用请求且可能会导致应用卡顿
                    //AdError，请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_test?id=aderror
                    Log.e(TAG, "onRewardedVideoAdFailed:" + adError.getFullErrorInfo());
                }
                @Override
                public void onRewardedVideoAdPlayStart(ATAdInfo adInfo) {
                    //ATAdInfo可区分广告平台以及获取广告平台的广告位ID等
                    //请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_sdk_callback_access?id=callback_info

                    //建议在此回调中调用load进行广告的加载，方便下一次广告的展示（不需要调用isAdReady()）
                    rxATRewardVideoAd.load();
                    Log.d(TAG, "onRewardedVideoAdPlayStart");
                }
                @Override
                public void onRewardedVideoAdPlayEnd(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onRewardedVideoAdPlayEnd");
                }
                @Override
                public void onRewardedVideoAdPlayFailed(AdError adError, ATAdInfo atAdInfo) {
                    //AdError，请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_test?id=aderror
                    Log.d(TAG, "onRewardedVideoAdPlayFailed:" + adError.getFullErrorInfo());
                }
                @Override
                public void onRewardedVideoAdClosed(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onRewardedVideoAdClosed");
                }
                @Override
                public void onReward(ATAdInfo atAdInfo) {
                    //建议在此回调中下发奖励，一般在onRewardedVideoAdClosed之前回调
                    Log.d(TAG, "onReward");
                }
                @Override
                public void onRewardedVideoAdPlayClicked(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onRewardedVideoAdPlayClicked");
                }
            });
        }
        String userid = "test_userid_001";
        String userdata = "test_userdata_001";
        Map<String, Object> localMap = new HashMap<>();
        localMap.put(ATAdConst.KEY.USER_ID, userid);
        localMap.put(ATAdConst.KEY.USER_CUSTOM_DATA, userdata);
        //Load时传自定义参数，在广告源填充之后自定义参数会保存起来，在展示时回传。适用场景:传入会话信息做防作弊类似
        rxATRewardVideoAd.setLocalExtra(localMap);
        rxATRewardVideoAd.load();
    }

    private void rewardShowAsd() {
    /*
     为了统计场景到达率，相关信息可查阅 "https://docs.toponad.com/#/zh-cn/android/NetworkAccess/scenario/scenario"
     在满足广告触发条件时调用“进入广告场景”方法，比如：
     ** 广告场景是在清理结束后弹出广告，则在清理结束时调用；
     * 1、先调用 "entryAdScenario"
     * 2、在调用 "isAdReady" 是否可展示
     * 3、最后调用 "show" 展示
     */
        RxATRewardVideoAd.entryAdScenario("b62b420ba3c661", null);
        if (rxATRewardVideoAd.isAdReady()) {
            rxATRewardVideoAd.show(this);
        }
    }

    RxATInterstitial mInterstitialAd;
    private void interLoadAd() {
        if (mInterstitialAd == null) {
            mInterstitialAd = new RxATInterstitial(this, "b62b41f080cfc5");
            mInterstitialAd.setAdListener(new ATInterstitialListener() {
                @Override
                public void onInterstitialAdLoaded() {


                    Log.d(TAG, "onInterstitialAdLoaded : 我正在运行。。。");

                }

                @Override
                public void onInterstitialAdLoadFail(AdError adError) {
                    //注意：禁止在此回调中执行广告的加载方法进行重试，否则会引起很多无用请求且可能会导致应用卡顿
                    //AdError，请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_test?id=aderror
                    Log.e(TAG, "onInterstitialAdLoadFail:" + adError.getFullErrorInfo());
                }

                @Override
                public void onInterstitialAdClicked(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onInterstitialAdClicked : 我正在运行。。。");
                }

                @Override
                public void onInterstitialAdShow(ATAdInfo atAdInfo) {
                    //ATAdInfo可区分广告平台以及获取广告平台的广告位ID等
                    //请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_sdk_callback_access?id=callback_info
                    //建议在此回调中调用load进行广告的加载，方便下一次广告的展示（不需要调用isAdReady()）
                    mInterstitialAd.load();
                    Log.d(TAG, "onInterstitialAdShow : 我正在运行。。。");
                }

                @Override
                public void onInterstitialAdClose(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onInterstitialAdClose : 我正在运行。。。");
                }

                @Override
                public void onInterstitialAdVideoStart(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onInterstitialAdVideoStart : 我正在运行。。。");
                }

                @Override
                public void onInterstitialAdVideoEnd(ATAdInfo atAdInfo) {
                    Log.d(TAG, "onInterstitialAdVideoEnd : 我正在运行。。。");
                }

                @Override
                public void onInterstitialAdVideoError(AdError adError) {
                    //AdError，请参考 https://docs.toponad.com/#/zh-cn/android/android_doc/android_test?id=aderror
                    Log.e(TAG, "onInterstitialAdVideoError:" + adError.getFullErrorInfo());
                }
            });
            mInterstitialAd.load();
        }
    }

    private void InnerShowAd() {
   /*
     为了统计场景到达率，相关信息可查阅 "https://docs.toponad.com/#/zh-cn/android/NetworkAccess/scenario/scenario"
     在满足广告触发条件时调用“进入广告场景”方法，比如：
     ** 广告场景是在清理结束后弹出广告，则在清理结束时调用；
     * 1、先调用 "entryAdScenario"
     * 2、在调用 "isAdReady" 是否可展示
     * 3、最后调用 "show" 展示
     */
        RxATInterstitial.entryAdScenario("b62b41f080cfc5", "");
        if (mInterstitialAd.isAdReady()) {
            mInterstitialAd.show(this,"");
        }
    }



}