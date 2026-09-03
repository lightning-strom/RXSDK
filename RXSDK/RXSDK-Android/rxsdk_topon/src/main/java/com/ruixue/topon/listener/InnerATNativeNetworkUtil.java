package com.ruixue.topon.listener;

import com.anythink.core.api.AdError;
import com.anythink.nativead.api.ATNativeNetworkListener;

public class InnerATNativeNetworkUtil {

    public static ATNativeNetworkListener convert(ATNativeNetworkListener listener) {
        return new ATNativeNetworkListener() {
            @Override
            public void onNativeAdLoaded() {
                if (listener != null) {
                    listener.onNativeAdLoaded();
                }
            }

            @Override
            public void onNativeAdLoadFail(AdError adError) {
                if (listener != null) {
                    listener.onNativeAdLoadFail(adError);
                }
            }
        };
    }

}
