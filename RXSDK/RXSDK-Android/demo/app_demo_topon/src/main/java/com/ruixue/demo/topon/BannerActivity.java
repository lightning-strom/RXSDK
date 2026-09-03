package com.ruixue.demo.topon;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;


import com.anythink.banner.api.ATBannerExListener;
import com.anythink.core.api.ATAdConst;
import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATNativeAdCustomRender;
import com.anythink.core.api.ATNativeAdInfo;
import com.anythink.core.api.ATNetworkConfirmInfo;
import com.anythink.core.api.AdError;

import com.ruixue.topon.adtype.RxATBannerView;

import java.util.HashMap;
import java.util.Map;

public class BannerActivity extends Activity {

    private static final String TAG = "BannerActivity";

    RxATBannerView mBannerView;

    FrameLayout mBannerViewContainer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_banner);

        mBannerViewContainer = findViewById(R.id.adview_container);

        initBannerView();
        addBannerViewToContainer();

        findViewById(R.id.load).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadAd();
            }
        });

    }

    private void initBannerView() {
        mBannerView = new RxATBannerView(this);
        mBannerView.setPlacementId("b62b420ae05bb4");
        //Loading and displaying ads should keep the container and BannerView visible all the time
        mBannerView.setVisibility(View.VISIBLE);
        mBannerView.setBannerAdListener(new ATBannerExListener() {

            @Override
            public void onDeeplinkCallback(boolean isRefresh, ATAdInfo adInfo, boolean isSuccess) {
                Log.d(TAG, "onDeeplinkCallback:" + adInfo.toString() + "--status:" + isSuccess);
            }

            @Override
            public void onDownloadConfirm(Context context, ATAdInfo adInfo, ATNetworkConfirmInfo networkConfirmInfo) {
                Log.d(TAG, "onDownloadConfirm:" + adInfo.toString() + " networkConfirmInfo:" + networkConfirmInfo);
            }

            @Override
            public void onBannerLoaded() {
                Log.d(TAG, "onBannerLoaded");

            }

            @Override
            public void onBannerFailed(AdError adError) {
                Log.d(TAG, "onBannerFailed: " + adError.getFullErrorInfo());
            }

            @Override
            public void onBannerClicked(ATAdInfo entity) {
                Log.d(TAG, "onBannerClicked:" + entity.toString());
            }

            @Override
            public void onBannerShow(ATAdInfo entity) {
                Log.d(TAG, "onBannerShow:" + entity.toString());
            }

            @Override
            public void onBannerClose(ATAdInfo entity) {
                mBannerView.setVisibility(View.GONE);
                Log.d(TAG, "onBannerClose:" + entity.toString());
            }

            @Override
            public void onBannerAutoRefreshed(ATAdInfo entity) {
                Log.d(TAG, "onBannerAutoRefreshed:" + entity.toString());
            }

            @Override
            public void onBannerAutoRefreshFail(AdError adError) {
                Log.d(TAG, "onBannerAutoRefreshFail: " + adError.getFullErrorInfo());
            }
        });

    }

    private void addBannerViewToContainer() {
        if (mBannerViewContainer != null && mBannerView != null) {
            mBannerViewContainer.addView(mBannerView, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, mBannerViewContainer.getLayoutParams().height));
        }
    }

    private void loadAd() {
        //Loading and displaying ads should keep the container and BannerView visible all the time
        mBannerView.setVisibility(View.VISIBLE);
        mBannerViewContainer.setVisibility(View.VISIBLE);

        mBannerView.loadAd();
    }

}