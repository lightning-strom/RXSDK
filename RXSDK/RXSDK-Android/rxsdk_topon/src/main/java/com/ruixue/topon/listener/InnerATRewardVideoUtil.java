package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.rewardvideo.api.ATRewardVideoListener;

public class InnerATRewardVideoUtil {

    public static ATRewardVideoListener convert(ATRewardVideoListener listener) {
        return new ATRewardVideoListener() {

            @Override
            public void onRewardedVideoAdLoaded() {
                if (listener != null) {
                    listener.onRewardedVideoAdLoaded();
                }
            }

            @Override
            public void onRewardedVideoAdFailed(AdError adError) {
                if (listener != null) {
                    listener.onRewardedVideoAdFailed(adError);
                }
            }

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
