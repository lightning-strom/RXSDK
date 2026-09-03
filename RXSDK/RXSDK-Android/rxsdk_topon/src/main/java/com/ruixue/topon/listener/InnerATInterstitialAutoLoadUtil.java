package com.ruixue.topon.listener;

import com.anythink.core.api.AdError;
import com.anythink.interstitial.api.ATInterstitialAutoLoadListener;

public class InnerATInterstitialAutoLoadUtil {

    public static ATInterstitialAutoLoadListener convert(ATInterstitialAutoLoadListener listener) {
        return new ATInterstitialAutoLoadListener() {
            @Override
            public void onInterstitialAutoLoaded(String s) {
                if (listener != null) {
                    listener.onInterstitialAutoLoaded(s);
                }
            }

            @Override
            public void onInterstitialAutoLoadFail(String s, AdError adError) {
                if (listener != null) {
                    listener.onInterstitialAutoLoadFail(s, adError);
                }
            }
        };
    }

}
