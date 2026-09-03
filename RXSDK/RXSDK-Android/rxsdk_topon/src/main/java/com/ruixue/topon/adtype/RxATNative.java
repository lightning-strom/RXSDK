package com.ruixue.topon.adtype;

import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATShowConfig;
import com.anythink.nativead.api.ATNative;
import com.anythink.nativead.api.ATNativeNetworkListener;
import com.anythink.nativead.api.NativeAd;
import com.ruixue.topon.bean.RxNativeAd;
import com.ruixue.topon.listener.InnerATAdSourceStatusUtil;
import com.ruixue.topon.listener.InnerATNativeNetworkUtil;

import java.util.List;
import java.util.Map;

public class RxATNative extends ATNative {

    public final static int NATIVE_TYPE = 3000;

    public RxATNative(Context context, String placementId, ATNativeNetworkListener listener) {
        super(context, placementId, InnerATNativeNetworkUtil.convert(listener));
    }

    @Override
    public void setLocalExtra(Map<String, Object> map) {
        super.setLocalExtra(map);
    }

    @Override
    public void makeAdRequest() {
        super.makeAdRequest();
    }

    public RxNativeAd rxGetNativeAd() {
        NativeAd mNativeAd = super.getNativeAd();
        if (mNativeAd != null) {
            return new RxNativeAd(mNativeAd);
        }
        return null;
    }

    public RxNativeAd rxGetNativeAd(String scenario) {
        NativeAd mNativeAd = super.getNativeAd(scenario);
        if (mNativeAd != null) {
            return new RxNativeAd(mNativeAd);
        }
        return null;
    }

    public RxNativeAd rxGetNativeAd(ATShowConfig showConfig) {
        NativeAd mNativeAd = super.getNativeAd(showConfig);
        if (mNativeAd != null) {
            return new RxNativeAd(mNativeAd);
        }
        return null;
    }

    public static void rxEntryAdScenario(String placementId, String scenarioId) {
        entryAdScenario(placementId, scenarioId);
    }

    @Override
    public List<ATAdInfo> checkValidAdCaches() {
        return super.checkValidAdCaches();
    }

    @Override
    public ATAdStatusInfo checkAdStatus() {
        return super.checkAdStatus();
    }

    @Override
    public void setAdSourceStatusListener(ATAdSourceStatusListener listener) {
        super.setAdSourceStatusListener(InnerATAdSourceStatusUtil.convertListener(NATIVE_TYPE, listener));
    }
}
