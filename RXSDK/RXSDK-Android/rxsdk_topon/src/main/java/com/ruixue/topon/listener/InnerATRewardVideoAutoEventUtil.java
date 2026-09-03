package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.rewardvideo.api.ATRewardVideoAutoEventListener;

public class InnerATRewardVideoAutoEventUtil {

    public static ATRewardVideoAutoEventListener convert(ATRewardVideoAutoEventListener listener) {
        return new ATRewardVideoAutoEventListener() {
            @Override
            public void onRewardedVideoAdPlayStart(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onRewardedVideoAdPlayStart(atAdInfo);
                }
            }

            @Override
            public void onRewardedVideoAdPlayEnd(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onRewardedVideoAdPlayEnd(atAdInfo);
                }
            }

            @Override
            public void onRewardedVideoAdPlayFailed(AdError adError, ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onRewardedVideoAdPlayFailed(adError, atAdInfo);
                }
            }

            @Override
            public void onRewardedVideoAdClosed(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onRewardedVideoAdClosed(atAdInfo);
                }
            }

            @Override
            public void onRewardedVideoAdPlayClicked(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onRewardedVideoAdPlayClicked(atAdInfo);
                }
            }

            @Override
            public void onReward(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onReward(atAdInfo);
                }
            }
        };
    }

}
