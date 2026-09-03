package com.ruixue.topon.listener;

import com.anythink.core.api.AdError;
import com.anythink.rewardvideo.api.ATRewardVideoAutoLoadListener;

public class InnerRxATRewardVideoAutoLoadUtil {

    public static ATRewardVideoAutoLoadListener convert(ATRewardVideoAutoLoadListener listener) {
        return new ATRewardVideoAutoLoadListener() {
            @Override
            public void onRewardVideoAutoLoaded(String s) {
                if (listener != null) {
                    listener.onRewardVideoAutoLoaded(s);
                }
            }

            @Override
            public void onRewardVideoAutoLoadFail(String s, AdError adError) {
                if (listener != null) {
                    listener.onRewardVideoAutoLoadFail(s, adError);
                }
            }
        };
    }

}
