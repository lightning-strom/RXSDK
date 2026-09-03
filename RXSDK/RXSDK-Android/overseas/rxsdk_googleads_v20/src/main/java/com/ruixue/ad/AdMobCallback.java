package com.ruixue.ad;

import android.os.Bundle;

public interface AdMobCallback {

    public void onAdClosed();

    public void onAdFailedToLoad(int code ,String msg);

    public void onAdLeftApplication();

    public void onAdOpened();

    public void onAdLoaded(String adUnitID, Bundle meatData);

    public void onAdClicked();

    public void onAdImpression();
}
