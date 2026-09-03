package com.ruixue.topon.adtype;

import android.app.Activity;
import android.content.Context;
import android.view.ViewGroup;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATNativeAdCustomRender;
import com.anythink.core.api.ATShowConfig;
import com.anythink.splashad.api.ATSplashAd;
import com.ruixue.topon.bean.RxATSplashSkipInfo;
import com.ruixue.topon.listener.InnerATSplashAdUtil;
import com.ruixue.topon.listener.InnerATAdSourceStatusUtil;
import com.ruixue.topon.listener.RxATSplashAdListener;

import java.util.List;
import java.util.Map;

public class RxATSplashAd extends ATSplashAd {

    public final static int SPLASH_TYPE = 5000;

    public RxATSplashAd(Context context, String placementId, RxATSplashAdListener listener) {
        super(context, placementId, InnerATSplashAdUtil.convert(listener));
    }

    public RxATSplashAd(Context context, String placementId, RxATSplashAdListener listener,
                        int fetchAdTimeout, String defaultAdSourceConfig) {
        super(context, placementId, InnerATSplashAdUtil.convert(listener), fetchAdTimeout, defaultAdSourceConfig);
    }

    public RxATSplashAd(Context context, String placementId, RxATSplashAdListener listener,
                        int fetchAdTimeout) {
        super(context, placementId, InnerATSplashAdUtil.convert(listener), fetchAdTimeout);
    }

    @Override
    public void setLocalExtra(Map<String, Object> map) {
        super.setLocalExtra(map);
    }

    @Override
    public boolean isAdReady() {
        return super.isAdReady();
    }

    @Override
    public ATAdStatusInfo checkAdStatus() {
        return super.checkAdStatus();
    }

    @Override
    public void loadAd() {
        super.loadAd();
    }

    public void rxShow(Activity activity, ViewGroup container) {
        super.show(activity, container);
    }

    public void rxShow(Activity activity, ViewGroup container, RxATSplashSkipInfo atSplashSkipInfo) {
        super.show(activity, container, atSplashSkipInfo);
    }

    public void rxShow(Activity activity, ViewGroup container, String scenario) {
        super.show(activity, container, scenario);
    }

    public void rxShow(Activity activity, ViewGroup container,
                       RxATSplashSkipInfo atSplashSkipInfo, String scenario) {
        super.show(activity, container, atSplashSkipInfo, scenario);
    }

    public void rxShow(Activity activity, ViewGroup container, RxATSplashSkipInfo atSplashSkipInfo,
                     ATShowConfig showConfig) {
        super.show(activity, container, atSplashSkipInfo, showConfig);
    }

    @Override
    public List<ATAdInfo> checkValidAdCaches() {
        return super.checkValidAdCaches();
    }

    public static void rxEntryAdScenario(String placementId, String scenarioId) {
        entryAdScenario(placementId, scenarioId);
    }

    @Override
    public void setAdSourceStatusListener(ATAdSourceStatusListener listener) {
        super.setAdSourceStatusListener(InnerATAdSourceStatusUtil.convertListener(SPLASH_TYPE, listener));
    }

    @Override
    public void setNativeAdCustomRender(ATNativeAdCustomRender nativeAdCustomRender) {
        super.setNativeAdCustomRender(nativeAdCustomRender);
    }
}
