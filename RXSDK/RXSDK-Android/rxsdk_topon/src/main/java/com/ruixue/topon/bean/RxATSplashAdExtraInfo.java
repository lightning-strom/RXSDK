package com.ruixue.topon.bean;

import com.anythink.splashad.api.ATSplashAdExtraInfo;
import com.anythink.splashad.api.IATSplashEyeAd;

public class RxATSplashAdExtraInfo {

    ATSplashAdExtraInfo mAtSplashAdExtraInfo;

    public RxATSplashAdExtraInfo(ATSplashAdExtraInfo atSplashAdExtraInfo) {
        this.mAtSplashAdExtraInfo = atSplashAdExtraInfo;
    }

    public int getDismissType() {
        return mAtSplashAdExtraInfo.getDismissType();
    }

    public RxIATSplashEyeAd getAtSplashEyeAd() {
        IATSplashEyeAd iatSplashEyeAd = mAtSplashAdExtraInfo.getAtSplashEyeAd();
        return new RxIATSplashEyeAd(iatSplashEyeAd);
    }


}
