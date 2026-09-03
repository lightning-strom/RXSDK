package com.ruixue.topon.adtype;

import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdStatusInfo;
import com.anythink.core.api.ATShowConfig;
import com.anythink.core.api.AdError;
import com.anythink.core.basead.adx.api.ATAdxBidFloorInfo;
import com.anythink.mediavideo.api.ATMediaVideo;
import com.anythink.mediavideo.api.ATMediaVideoConfig;
import com.anythink.mediavideo.api.ATMediaVideoEventListener;
import com.anythink.mediavideo.api.MediaVideoAd;
import com.anythink.mediavideo.api.OnIMAEventListener;
import com.anythink.mediavideo.api.videoadplayer.ATVideoAdPlayer;

import java.util.List;

public class RxATMediaVideo extends ATMediaVideo {
    public RxATMediaVideo(Context context, String placementId, ATVideoAdPlayer atVideoAdPlayer) {
        super(context, placementId, atVideoAdPlayer);
    }

    public RxATMediaVideo(Context context, String placementId, ATVideoAdPlayer atVideoAdPlayer,
                          ATMediaVideoConfig mediaVideoConfig) {
        super(context, placementId, atVideoAdPlayer, mediaVideoConfig);
    }

    @Override
    public void loadAd() {
        super.loadAd();
    }

    @Override
    public void loadAd(ATAdxBidFloorInfo adxBidFloorInfo) {
        super.loadAd(adxBidFloorInfo);
    }

    @Override
    public void loadAd(int loadType, ATAdxBidFloorInfo adxBidFloorInfo) {
        super.loadAd(loadType, adxBidFloorInfo);
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
    public List<ATAdInfo> checkValidAdCaches() {
        return super.checkValidAdCaches();
    }

    @Override
    public MediaVideoAd getMediaVideoAd() {
        return super.getMediaVideoAd();
    }

    @Override
    public MediaVideoAd getMediaVideoAd(ATShowConfig showConfig) {
        return super.getMediaVideoAd(showConfig);
    }

    @Override
    public void setAdListener(ATMediaVideoEventListener listener) {
        ATMediaVideoEventListener innerListener = new ATMediaVideoEventListener() {
            @Override
            public void onMediaVideoAdLoaded() {
                if (listener != null) {
                    listener.onMediaVideoAdLoaded();
                }
            }

            @Override
            public void onMediaVideoAdLoadFailed(AdError adError) {
                if (listener != null) {
                    listener.onMediaVideoAdLoadFailed(adError);
                }
            }

            @Override
            public void onMediaVideoAdClick(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdClick(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdResume(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdResume(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdPause(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdPause(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdStart(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdStart(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdEnd(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdEnd(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdPlayError(AdError adError, ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdPlayError(adError, atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdSkiped(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdSkiped(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdTapped(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onMediaVideoAdTapped(atAdInfo);
                }
            }

            @Override
            public void onMediaVideoAdProgress(float v, double v1) {
                if (listener != null) {
                    listener.onMediaVideoAdProgress(v, v1);
                }
            }
        };

        super.setAdListener(innerListener);
    }

    @Override
    public void setIMAEventListener(OnIMAEventListener onIMAEventListener) {
        OnIMAEventListener innerListener = new OnIMAEventListener() {
            @Override
            public void onEvent(Object o) {
                if (onIMAEventListener != null) {
                    onIMAEventListener.onEvent(o);
                }
            }
        };

        super.setIMAEventListener(innerListener);
    }

    
}