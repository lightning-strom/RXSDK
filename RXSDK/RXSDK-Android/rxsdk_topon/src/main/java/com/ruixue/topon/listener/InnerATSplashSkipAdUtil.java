package com.ruixue.topon.listener;

import com.anythink.splashad.api.ATSplashSkipAdListener;

public class InnerATSplashSkipAdUtil {

    public static ATSplashSkipAdListener convert(ATSplashSkipAdListener listener) {
        return new ATSplashSkipAdListener() {
            @Override
            public void onAdTick(long l, long l1) {
                if (listener != null) {
                    listener.onAdTick(l, l1);
                }
            }

            @Override
            public void isSupportCustomSkipView(boolean b) {
                if (listener != null) {
                    listener.isSupportCustomSkipView(b);
                }
            }
        };
    }

}
