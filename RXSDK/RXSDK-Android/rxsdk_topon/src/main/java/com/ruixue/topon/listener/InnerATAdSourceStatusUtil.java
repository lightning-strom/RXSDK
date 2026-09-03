package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATAdSourceStatusListener;
import com.anythink.core.api.AdError;

public class InnerATAdSourceStatusUtil {

    public static ATAdSourceStatusListener convertListener(int type, ATAdSourceStatusListener listener) {
        return new ATAdSourceStatusListener() {
            @Override
            public void onAdSourceBiddingAttempt(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdSourceBiddingAttempt(atAdInfo);
                }
            }

            @Override
            public void onAdSourceBiddingFilled(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdSourceBiddingFilled(atAdInfo);
                }
            }

            @Override
            public void onAdSourceBiddingFail(ATAdInfo atAdInfo, AdError adError) {
                if (listener != null) {
                    listener.onAdSourceBiddingFail(atAdInfo, adError);
                }
            }

            @Override
            public void onAdSourceAttempt(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdSourceAttempt(atAdInfo);
                }
            }

            @Override
            public void onAdSourceLoadFilled(ATAdInfo atAdInfo) {
                if (listener != null) {
                    listener.onAdSourceLoadFilled(atAdInfo);
                }
            }

            @Override
            public void onAdSourceLoadFail(ATAdInfo atAdInfo, AdError adError) {
                if (listener != null) {
                    listener.onAdSourceLoadFail(atAdInfo, adError);
                }
            }
        };
    }

}
