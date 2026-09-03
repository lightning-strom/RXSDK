package com.ruixue.topon.listener;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.AdError;
import com.anythink.splashad.api.ATSplashAdExtraInfo;
import com.ruixue.topon.bean.RxATSplashAdExtraInfo;

public interface RxATSplashAdListener {

    void onAdLoaded(boolean var1);

    void onAdLoadTimeout();

    void onNoAdError(AdError var1);

    void onAdShow(ATAdInfo var1);

    void onAdClick(ATAdInfo var1);

    void onAdDismiss(ATAdInfo var1, RxATSplashAdExtraInfo var2);

}
