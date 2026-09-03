package com.ruixue.topon.bean;

import android.content.Context;
import android.graphics.Rect;
import android.view.ViewGroup;

import com.anythink.splashad.api.ATSplashEyeAdListener;
import com.anythink.splashad.api.IATSplashEyeAd;

public class RxIATSplashEyeAd implements IATSplashEyeAd {

    public IATSplashEyeAd mIatSplashEyeAd;

    public RxIATSplashEyeAd(IATSplashEyeAd iatSplashEyeAd) {
        this.mIatSplashEyeAd = iatSplashEyeAd;
    }

    @Override
    public void show(Context context, Rect rect, ATSplashEyeAdListener atSplashEyeAdListener) {
        if (mIatSplashEyeAd != null) {
            mIatSplashEyeAd.show(context, rect, atSplashEyeAdListener);
        }
    }

    @Override
    public void setEyeAdContainer(ViewGroup viewGroup) {
        if (mIatSplashEyeAd != null) {
            mIatSplashEyeAd.setEyeAdContainer(viewGroup);
        }
    }

    @Override
    public int[] getSuggestedSize(Context context) {
        if (mIatSplashEyeAd != null) {
            mIatSplashEyeAd.getSuggestedSize(context);
        }
        return new int[0];
    }

    @Override
    public void onFinished() {
        if (mIatSplashEyeAd != null) {
            mIatSplashEyeAd.onFinished();
        }
    }

    @Override
    public void destroy() {
        if (mIatSplashEyeAd != null) {
            mIatSplashEyeAd.destroy();
        }
    }
}
