package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.interstitial.api.ATInterstitialAutoEventListener;

public class InnerATInterstitialAutoEventUtil {

    public static ATInterstitialAutoEventListener convert(ATInterstitialAutoEventListener listener) {
        return new ATInterstitialAutoEventListener() {

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
    }

}
