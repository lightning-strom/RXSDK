package com.ruixue.topon.bean;

import android.view.View;
import android.view.ViewGroup;

import com.anythink.splashad.api.ATSplashSkipAdListener;
import com.anythink.splashad.api.ATSplashSkipInfo;
import com.ruixue.topon.listener.InnerATSplashSkipAdUtil;

public class RxATSplashSkipInfo extends ATSplashSkipInfo {
    public RxATSplashSkipInfo(View skipView, long countDownDuration, long callbackInterval,
                              ATSplashSkipAdListener atSplashSkipAdListener) {
        super(skipView, countDownDuration, callbackInterval,
                InnerATSplashSkipAdUtil.convert(atSplashSkipAdListener));
    }

    public RxATSplashSkipInfo(View skipView, ATSplashSkipAdListener atSplashSkipAdListener) {
        super(skipView, InnerATSplashSkipAdUtil.convert(atSplashSkipAdListener));
    }

    public void setContainer(ViewGroup viewGroup) {
        super.setContainer(viewGroup);
    }

    public ViewGroup getContainer() {
        return super.getContainer();
    }

    public View getSkipView() {
        return super.getSkipView();
    }

    public long getCountDownDuration() {
        return super.getCountDownDuration();
    }

    public long getCallbackInterval() {
        return super.getCallbackInterval();
    }

    public ATSplashSkipAdListener getATSplashSkipAdListener() {
        return super.getATSplashSkipAdListener();
    }

    public void destroy() {
        super.destroy();
    }

    public boolean canUseCustomSkipView() {
        return super.canUseCustomSkipView();
    }
}
