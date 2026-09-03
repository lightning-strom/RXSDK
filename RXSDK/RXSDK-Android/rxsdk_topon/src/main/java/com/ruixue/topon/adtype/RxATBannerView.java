package com.ruixue.topon.adtype;

import android.content.Context;
import android.util.AttributeSet;

import com.anythink.banner.api.ATBannerListener;
import com.anythink.banner.api.ATBannerView;
import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATEventInterface;
import com.anythink.core.api.ATNativeAdCustomRender;
import com.anythink.core.api.ATShowConfig;
import com.anythink.core.api.AdError;
import com.ruixue.topon.listener.InnerATAdSourceStatusUtil;

import java.util.List;
import java.util.Map;

public class RxATBannerView extends ATBannerView {

    public final static int BANNER_TYPE = 1000;

    public RxATBannerView(Context context) {
        super(context);
    }

    public RxATBannerView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public RxATBannerView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public void setPlacementId(String placementId) {
        super.setPlacementId(placementId);
    }

    @Override
    public void setLocalExtra(Map<String, Object> map) {
        super.setLocalExtra(map);
    }

    @Override
    public void setBannerAdListener(ATBannerListener listener) {

        ATBannerListener innerListener = new ATBannerListener() {
            @Override
            public void onBannerLoaded() {
                if (listener != null) {
                    listener.onBannerLoaded();
                }
            }

            @Override
            public void onBannerFailed(AdError adError) {
                if (listener != null) {
                    listener.onBannerFailed(adError);
                }
            }

            @Override
            public void onBannerClicked(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onBannerClicked(atAdInfo);
                }
            }

            @Override
            public void onBannerShow(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onBannerShow(atAdInfo);
                }
            }

            @Override
            public void onBannerClose(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onBannerClose(atAdInfo);
                }
            }

            @Override
            public void onBannerAutoRefreshed(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onBannerAutoRefreshed(atAdInfo);
                }
            }

            @Override
            public void onBannerAutoRefreshFail(AdError adError) {
                if (listener != null) {
                    listener.onBannerAutoRefreshFail(adError);
                }
            }
        };

        super.setBannerAdListener(innerListener);
    }


    @Override
    public void loadAd() {
        super.loadAd();
    }

    @Override
    public void destroy() {
        super.destroy();
    }

    @Override
    public void setScenario(String scenario) {
        super.setScenario(scenario);
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
    public void setShowConfig(ATShowConfig showConfig) {
        super.setShowConfig(showConfig);
    }

    @Override
    public void setAdDownloadListener(ATEventInterface eventListener) {
        super.setAdDownloadListener(eventListener);
    }

    @Override
    public void setAdSourceStatusListener(ATAdSourceStatusListener listener) {
        super.setAdSourceStatusListener(InnerATAdSourceStatusUtil.convertListener(BANNER_TYPE, listener));
    }

    @Override
    public void setNativeAdCustomRender(ATNativeAdCustomRender mixNativeAdListener) {
        super.setNativeAdCustomRender(mixNativeAdListener);
    }
}
