package com.ruixue.topon.adtype;

import android.app.Activity;
import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATEventInterface;
import com.anythink.core.api.ATNativeAdCustomRender;
import com.anythink.core.api.ATShowConfig;
import com.anythink.core.api.AdError;
import com.anythink.interstitial.api.ATInterstitial;
import com.anythink.interstitial.api.ATInterstitialListener;
import com.ruixue.topon.listener.InnerATAdSourceStatusUtil;

import java.util.List;
import java.util.Map;

public class RxATInterstitial extends ATInterstitial {

    public final static int INTER_TYPE = 2000;

    public RxATInterstitial(Context context, String placementId) {
        super(context, placementId);
    }

    @Override
    public void setAdListener(ATInterstitialListener listener) {
        ATInterstitialListener innerListener = new ATInterstitialListener() {
            @Override
            public void onInterstitialAdLoaded() {
                if (listener != null) {
                    listener.onInterstitialAdLoaded();
                }
            }

            @Override
            public void onInterstitialAdLoadFail(AdError adError) {
                if (listener != null) {
                    listener.onInterstitialAdLoadFail(adError);
                }
            }

            @Override
            public void onInterstitialAdClicked(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onInterstitialAdClicked(atAdInfo);
                }
            }

            @Override
            public void onInterstitialAdShow(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onInterstitialAdShow(atAdInfo);
                }
            }

            @Override
            public void onInterstitialAdClose(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onInterstitialAdClose(atAdInfo);
                }
            }

            @Override
            public void onInterstitialAdVideoStart(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onInterstitialAdVideoStart(atAdInfo);
                }
            }

            @Override
            public void onInterstitialAdVideoEnd(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onInterstitialAdVideoEnd(atAdInfo);
                }
            }

            @Override
            public void onInterstitialAdVideoError(AdError adError) {
                if (listener != null) {
                    listener.onInterstitialAdVideoError(adError);
                }
            }
        };
        super.setAdListener(innerListener);
    }

    @Override
    public void setLocalExtra(Map<String, Object> map) {
        super.setLocalExtra(map);
    }

    @Override
    public void load() {
        super.load();
    }

    @Override
    public void load(Context context) {
        super.load(context);
    }

    @Override
    public boolean isAdReady() {
        return super.isAdReady();
    }

    @Override
    public void show(Activity activity) {
        super.show(activity);
    }

    @Override
    public void show(Activity activity, String scenario) {
        super.show(activity, scenario);
    }

    @Override
    public void show(Activity activity, ATShowConfig showConfig) {
        super.show(activity, showConfig);
    }

    @Override
    public ATAdStatusInfo checkAdStatus() {
        return super.checkAdStatus();
    }

    @Override
    public List<ATAdInfo> checkValidAdCaches() {
        return super.checkValidAdCaches();
    }

    @Override
    public void setAdDownloadListener(ATEventInterface eventListener) {
        super.setAdDownloadListener(eventListener);
    }

    public static void rxEntryAdScenario(String placementId, String scenarioId) {
        entryAdScenario(placementId, scenarioId);
    }

    @Override
    public void setAdSourceStatusListener(ATAdSourceStatusListener listener) {
        super.setAdSourceStatusListener(InnerATAdSourceStatusUtil.convertListener(INTER_TYPE, listener));
    }

    @Override
    public void setNativeAdCustomRender(ATNativeAdCustomRender mixNativeAdListener) {
        super.setNativeAdCustomRender(mixNativeAdListener);
    }

}
