package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.splashad.api.ATSplashAdExtraInfo;
import com.anythink.splashad.api.ATSplashAdListener;
import com.ruixue.topon.bean.RxATSplashAdExtraInfo;

public class InnerATSplashAdUtil {

    public static ATSplashAdListener convert(RxATSplashAdListener listener) {
        return new ATSplashAdListener() {
            @Override
            public void onAdLoaded(boolean b) {
                if (listener != null) {
                    listener.onAdLoaded(b);
                }
            }

            @Override
            public void onAdLoadTimeout() {
                if (listener != null) {
                    listener.onAdLoadTimeout();
                }
            }

            @Override
            public void onNoAdError(AdError adError) {
                if (listener != null) {
                    listener.onNoAdError(adError);
                }
            }

            @Override
            public void onAdShow(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdShow(atAdInfo);
                }
            }

            @Override
            public void onAdClick(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdClick(atAdInfo);
                }
            }

            @Override
            public void onAdDismiss(ATAdInfo atAdInfo, ATSplashAdExtraInfo atSplashAdExtraInfo) {
                if (listener != null) {
                    listener.onAdDismiss(atAdInfo, new RxATSplashAdExtraInfo(atSplashAdExtraInfo));
                }
            }
        };
    }

}
