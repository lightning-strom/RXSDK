package com.ruixue.infinix;


import android.app.Activity;
import android.util.Log;

import com.transsion.game.analytics.GameAnalytics;
import com.transsion.gamead.AdHelper;
import com.transsion.gamead.AdInitializer;
import com.transsion.gamead.GameAdBannerListener;
import com.transsion.gamead.GameAdLoadListener;
import com.transsion.gamead.GameAdRewardShowListener;
import com.transsion.gamead.GameAdShowListener;
import com.transsion.gamead.OnOpenAppLoadListener;
import com.transsion.gamead.OnOpenAppShowListener;
import com.transsion.gamead.impl.TGBannerView;

// Created by wangliang on 2025/6/12.
public class InfinixSdkHelper {
    private static final String TAG = "InfinixSdkHelper";

    /**
     * 展示插屏广告
     *
     * @param activity activity
     * @param listener listener
     */
    public static void showInterstitial(Activity activity, GameAdShowListener listener) {
        //调用展示之前判断广告是否已经准备好，如果没准备好，则进行加载，否则直接进行展示
        //通常只需要成功加载一次对应的广告，SDK内部会在关闭广告展示时自动加载，方便进行下次展示
        if (AdHelper.isInterstitialReady()) {
            AdHelper.showInterstitial(activity, listener);
        } else {
            if (listener != null)
                listener.onShowFailed(-1, "interstitial ad not ready");
        }
    }

    /**
     * 加载插屏广告
     * <p>
     * SDK内部有自动加载的机制，当一个广告展示关闭的时候，内部会自动发起加载
     * 您可以在日志中看到自动加载打印的信息。
     * 通常您只需要在SDK加载完成后，调用一次加载成功，后续只需要判断广告ready,就可以直接show，而无需每次都调用load方法。
     *
     * @param activity activity
     * @param listener listener
     */
    public static void loadInterstitial(Activity activity, GameAdLoadListener listener) {
        if (AdInitializer.isInitialized()) {
            AdHelper.loadInterstitial(activity, listener);
        } else {
            if (listener != null)
                listener.onAdFailedToLoad(-1, "SDK not initialized, please check it.");
        }
    }

    private static TGBannerView mTGBannerView;


    /**
     * 展示广告
     * <p>
     * Banner广告没有预加载，需要实时请求
     * Banner广告加载成功后，内部会进行自刷新，因此一般情况下，不用再次加载。内部会自行进行加载和展示。
     *
     * @param activity activity
     * @param listener listener
     */
    public static void showBanner(Activity activity, GameAdBannerListener listener) {
        if (!AdInitializer.isInitialized()) {
            if (listener != null)
                listener.onAdFailedToLoad(-1, "SDK not initialized, please check it.");
            return;
        }
        Log.d(TAG, "showBanner: 发起Banner请求");

        //mTGBannerView只需要创建一次即可，后面可以服用该对象进行调用。直到游戏或页面退出不再使用时，调用destroy.并置为null.
        if (mTGBannerView == null) {
            mTGBannerView = AdHelper.newInstanceTGBannerView(activity);
        }

        //默认情况下，Banner会在应用最下方铺满宽度的方式进行展示。
        //如果对横幅广告的位置及大小有需求，可以进行定制。
        //configBannerSize();

        //Banner内部有有限的重试机制。
        //一般Banner展示成功后，内部会自动进行自刷新，无需特别处理。
        //如果展示失败，开发者可以在失败回调里进行有限次数的重试。切勿无限重试。
        mTGBannerView.setListener(listener);
        mTGBannerView.load(activity);

        //不需要展示的时候，可以调用close来关闭Banner
        //mTGBannerView.close(this);

        //当页面不再需要展示Banner、退出游戏等场景时，进行Banner的销毁。
        //销毁除了执行关闭广告的操作，还会移除监听回调和部分重试逻辑，避免内存泄露。
        //mTGBannerView.destroy(this);
        //mTGBannerView = null;
    }

    public static void closeBanner(Activity activity) {
        if (mTGBannerView != null) {
            mTGBannerView.close(activity);
        }
    }

    /**
     * 展示激励广告
     *
     * @param activity activity
     * @param listener listener
     */
    public static void showReward(Activity activity, GameAdRewardShowListener listener) {
        //调用展示之前判断广告是否已经准备好，如果没准备好，则进行加载，否则直接进行展示
        //通常只需要成功加载一次对应的广告，SDK内部会在关闭广告展示时自动加载，方便进行下次展示
        if (AdHelper.isRewardReady()) {
            AdHelper.showReward(activity, listener);
        } else {
            if (listener != null)
                listener.onShowFailed(-1, "reward ad not ready");
        }
    }

    /**
     * 加载激励广告
     *
     * @param activity activity
     * @param listener listener
     */
    public static void loadReward(Activity activity, GameAdLoadListener listener) {
        if (AdInitializer.isInitialized()) {
            AdHelper.loadReward(activity, listener);
        } else {
            if (listener != null)
                listener.onAdFailedToLoad(-1, "SDK not initialized, please check it.");
        }
    }

    /**
     * 加载开屏广告
     *
     * @param activity activity
     * @param listener listener
     */
    public static void loadOpenAppAd(Activity activity, OnOpenAppLoadListener listener) {
        Log.d(TAG, "loadOpenAppAd: 发起加载开屏广告");
        AdHelper.loadAppOpenAd(activity, listener);
    }

    /**
     * 展示开屏广告
     *
     * @param activity activity
     * @param listener listener
     */
    public static void showOpenAppAd(Activity activity, OnOpenAppShowListener listener) {
        Log.d(TAG, "展示开屏广告");
        if (AdHelper.isOpenAppAdReady()) {
            AdHelper.showAppOpenAd(activity, listener);
        } else {
            if (listener != null)
                listener.onAdError(-1, "open app ad not ready");
        }
    }

    /**
     * 自定义埋点事件上报
     *
     * @param action action表示需要埋点上报的场景名称，建议优先选择SDK内部预设字段的场景名称，如登录的场景。
     * @param param1 根据场景需要，传入该场景关注的值。如登录结果的值。该字段可为空。
     * @param param2 根据场景需要，传入该场景关注的值。如登录成功后的ID。该字段可为空。
     */
    public static void tracker(String action, String param1, String param2) {
        GameAnalytics.tracker(action, param1, param2);
    }

    public static void onDestroy(Activity activity) {
        mTGBannerView.destroy(activity);
        mTGBannerView = null;
    }

}
