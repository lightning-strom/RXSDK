package com.ruixue.topon.bean;

import android.content.Context;
import android.view.View;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATCustomVideo;
import com.anythink.core.api.ATEventInterface;
import com.anythink.core.api.ATNetworkConfirmInfo;
import com.anythink.nativead.api.ATNativeAdView;
import com.anythink.nativead.api.ATNativeDislikeListener;
import com.anythink.nativead.api.ATNativeEventListener;
import com.anythink.nativead.api.ATNativeMaterial;
import com.anythink.nativead.api.ATNativePrepareInfo;
import com.anythink.nativead.api.NativeAd;

import java.util.Map;

public class RxNativeAd {

    NativeAd mNativeAd;

    public RxNativeAd(NativeAd nativeAd) {
        this.mNativeAd = nativeAd;
    }

    public ATNativeMaterial getAdMaterial() {
        return mNativeAd.getAdMaterial();
    }

    public synchronized void renderAdContainer(ATNativeAdView view, View selfRenderView) {
        mNativeAd.renderAdContainer(view, selfRenderView);
    }

    public int getAdInteractionType() {
        return mNativeAd.getAdInteractionType();
    }

    public synchronized void prepare(ATNativeAdView view, ATNativePrepareInfo nativePrepareInfo) {
        mNativeAd.prepare(view, nativePrepareInfo);
    }

    public void setNativeEventListener(ATNativeEventListener listener) {
        ATNativeEventListener innerATNativeEventListener = new ATNativeEventListener() {
            @Override
            public void onAdImpressed(ATNativeAdView atNativeAdView, ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdImpressed(atNativeAdView, atAdInfo);
                }
            }

            @Override
            public void onAdClicked(ATNativeAdView atNativeAdView, ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdClicked(atNativeAdView, atAdInfo);
                }
            }

            @Override
            public void onAdVideoStart(ATNativeAdView atNativeAdView) {
                if (listener != null) {
                    listener.onAdVideoStart(atNativeAdView);
                }
            }

            @Override
            public void onAdVideoEnd(ATNativeAdView atNativeAdView) {
                if (listener != null) {
                    listener.onAdVideoEnd(atNativeAdView);
                }
            }

            @Override
            public void onAdVideoProgress(ATNativeAdView atNativeAdView, int i) {
                if (listener != null) {
                    listener.onAdVideoProgress(atNativeAdView, i);
                }
            }
        };
        mNativeAd.setNativeEventListener(innerATNativeEventListener);
    }

    public void setDislikeCallbackListener(ATNativeDislikeListener listener) {
        ATNativeDislikeListener innerATNativeDislikeListener = new ATNativeDislikeListener() {
            @Override
            public void onAdCloseButtonClick(ATNativeAdView atNativeAdView, ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdCloseButtonClick(atNativeAdView, atAdInfo);
                }
            }
        };
        mNativeAd.setDislikeCallbackListener(innerATNativeDislikeListener);
    }

    public void setDownloadConfirmListener(NativeAd.DownloadConfirmListener downloadConfirmListener) {
        NativeAd.DownloadConfirmListener innerDownloadConfirmListener = new NativeAd.DownloadConfirmListener() {
            @Override
            public void onDownloadConfirm(Context context, ATAdInfo atAdInfo, View view,
                                          ATNetworkConfirmInfo atNetworkConfirmInfo) {
                if (downloadConfirmListener != null) {
                    downloadConfirmListener.onDownloadConfirm(context, atAdInfo, view, atNetworkConfirmInfo);
                }
            }
        };
        mNativeAd.setDownloadConfirmListener(innerDownloadConfirmListener);
    }

    public synchronized void clear(ATNativeAdView view) {
        mNativeAd.clear(view);
    }

    public synchronized void destory() {
        mNativeAd.destory();
    }

    public void setManualImpressionTrack(boolean isManual) {
        mNativeAd.setManualImpressionTrack(isManual);
    }

    public void manualImpressionTrack() {
        mNativeAd.manualImpressionTrack();
    }

    public void setAdDownloadListener(ATEventInterface eventListener) {
        mNativeAd.setAdDownloadListener(eventListener);
    }

    public void onPause() {
        mNativeAd.onPause();
    }

    public void onResume() {
        mNativeAd.onResume();
    }

    public void resumeVideo() {
        mNativeAd.resumeVideo();
    }

    public void pauseVideo() {
        mNativeAd.pauseVideo();
    }

    public void setVideoMute(boolean isMute) {
        mNativeAd.setVideoMute(isMute);
    }

    public double getVideoDuration() {
        return mNativeAd.getVideoDuration();
    }

    public double getVideoProgress() {
        return mNativeAd.getVideoProgress();
    }

    public boolean isNativeExpress() {
        return mNativeAd.isNativeExpress();
    }

    public int getNativeType() {
        return mNativeAd.getNativeType();
    }

    /** @deprecated */
    @Deprecated
    public ATCustomVideo getCustomVideo() {
        return mNativeAd.getCustomVideo();
    }

    public ATAdInfo getAdInfo() {
        return mNativeAd.getAdInfo();
    }

    public int getDownloadStatus() {
        return mNativeAd.getDownloadStatus();
    }

    public int getDownloadProgress() {
        return mNativeAd.getDownloadProgress();
    }

    public void setDevParams(Map<String, Object> devParamsMap) {
        mNativeAd.setDevParams(devParamsMap);
    }

    public boolean isValid() {
        return mNativeAd.isValid();
    }

}
