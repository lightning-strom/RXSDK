package com.ruixue.topon.adtype;

import android.app.Activity;
import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATEventInterface;
import com.anythink.core.api.ATShowConfig;
import com.anythink.rewardvideo.api.ATRewardVideoAd;
import com.anythink.rewardvideo.api.ATRewardVideoListener;
import com.ruixue.topon.listener.InnerATAdSourceStatusUtil;
import com.ruixue.topon.listener.InnerATRewardVideoUtil;

import java.util.List;
import java.util.Map;

public class RxATRewardVideoAd extends ATRewardVideoAd {

    public final static int REWARD_TYPE = 4000;

    public RxATRewardVideoAd(Context context, String placementId) {
        super(context, placementId);
    }

    @Override
    public void setAdListener(ATRewardVideoListener listener) {
        super.setAdListener(InnerATRewardVideoUtil.convert(listener));
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
        super.setAdSourceStatusListener(InnerATAdSourceStatusUtil.convertListener(REWARD_TYPE, listener));
    }
}
