package com.ruixue.topon.adtype;

import android.app.Activity;
import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATShowConfig;
import com.anythink.interstitial.api.ATInterstitialAutoAd;
import com.anythink.interstitial.api.ATInterstitialAutoEventListener;
import com.anythink.interstitial.api.ATInterstitialAutoLoadListener;
import com.ruixue.topon.listener.InnerATInterstitialAutoEventUtil;
import com.ruixue.topon.listener.InnerATInterstitialAutoLoadUtil;

import java.util.List;
import java.util.Map;

public class RxATInterstitialAutoAd extends ATInterstitialAutoAd {

    public static void rxInit(Context context, String[] placementIds,
                              ATInterstitialAutoLoadListener loadListener) {
        init(context, placementIds, InnerATInterstitialAutoLoadUtil.convert(loadListener));
    }

    public static void rxAddPlacementId(String... placementIds) {
        addPlacementId(placementIds);
    }

    public static void rxRemovePlacementId(String... placementIds) {
        removePlacementId(placementIds);
    }

    public static void rxSetLocalExtra(String placementId, Map<String, Object> localExtra) {
        setLocalExtra(placementId, localExtra);
    }

    public static void rxShow(Activity activity, String placementId,
                            ATInterstitialAutoEventListener eventListener) {
        show(activity, placementId, InnerATInterstitialAutoEventUtil.convert(eventListener));
    }

    public static void rxShow(Activity activity, String placementId, String scenario,
                            ATInterstitialAutoEventListener eventListener) {
        show(activity, placementId, scenario, InnerATInterstitialAutoEventUtil.convert(eventListener));
    }

    public static void rxShow(Activity activity, String placementId, ATShowConfig showConfig,
                              ATInterstitialAutoEventListener eventListener) {
        show(activity, placementId, showConfig, InnerATInterstitialAutoEventUtil.convert(eventListener));
    }

    public static boolean rxIsAdReady(String placementId) {
        return isAdReady(placementId);
    }

    public static ATAdStatusInfo rxCheckAdStatus(String placementId) {
        return checkAdStatus(placementId);
    }

    public static List<ATAdInfo> rxCheckValidAdCaches(String placementId) {
        return checkValidAdCaches(placementId);
    }

    public static void rxEntryAdScenario(String placementId, String scenarioId) {
        entryAdScenario(placementId, scenarioId);
    }

    public static void rxEntryAdScenario(String placementId, String scenarioId,
                                         Map<String, Object> tkExtraNao) {
        entryAdScenario(placementId, scenarioId, tkExtraNao);
    }

}
