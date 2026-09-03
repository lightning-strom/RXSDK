package com.ruixue.topon.adtype;

import android.app.Activity;
import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATShowConfig;
import com.anythink.rewardvideo.a.c;
import com.anythink.rewardvideo.api.ATRewardVideoAutoAd;
import com.anythink.rewardvideo.api.ATRewardVideoAutoEventListener;
import com.anythink.rewardvideo.api.ATRewardVideoAutoLoadListener;
import com.ruixue.topon.listener.InnerATRewardVideoAutoEventUtil;
import com.ruixue.topon.listener.InnerRxATRewardVideoAutoLoadUtil;

import java.util.List;
import java.util.Map;

public class RxATRewardVideoAutoAd extends ATRewardVideoAutoAd {

    public static void rxInit(Context context, String[] placementIds, ATRewardVideoAutoLoadListener loadListener) {
        init(context, placementIds, InnerRxATRewardVideoAutoLoadUtil.convert(loadListener));
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

    public static void rxShow(Activity activity, String placementId, ATRewardVideoAutoEventListener eventListener) {
        show(activity, placementId, InnerATRewardVideoAutoEventUtil.convert(eventListener));
    }

    public static void rxShow(Activity activity, String placementId, String scenario,
                            ATRewardVideoAutoEventListener eventListener) {
        show(activity, placementId, scenario, InnerATRewardVideoAutoEventUtil.convert(eventListener));
    }

    public static void rxsShow(Activity activity, String placementId, ATShowConfig showConfig,
                            ATRewardVideoAutoEventListener eventListener) {
       show(activity, placementId, showConfig, InnerATRewardVideoAutoEventUtil.convert(eventListener));
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

    public static void rxEntryAdScenario(String placementId, String scenarioId, Map<String, Object> tkExtraMap) {
        entryAdScenario(placementId, scenarioId, tkExtraMap);
    }


}
