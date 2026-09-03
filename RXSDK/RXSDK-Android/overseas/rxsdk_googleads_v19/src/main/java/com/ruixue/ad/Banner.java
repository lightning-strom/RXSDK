//package com.ruixue.ad;
//
//import android.content.Context;
//import android.view.View;
//
//import com.google.android.gms.ads.AdListener;
//import com.google.android.gms.ads.AdRequest;
//import com.google.android.gms.ads.AdSize;
//import com.google.android.gms.ads.AdView;
//import com.google.android.gms.ads.MobileAds;
//import com.sdk.google.admob.R;
//
//public class Banner {
//
//    /**
//     *   Add adView to your view hierarchy.
//     * @param context
//     * @return
//     */
//    public static View addView(Context context,int width,int height, AdmobListener adListener){
//        // Initialize the Mobile Ads SDK.
//        if(BuildConfig.DEBUG){
//            MobileAds.initialize(context, context.getResources().getString(R.string.debug_admob_app_id));
//        }else{
//            MobileAds.initialize(context, context.getResources().getString(R.string.admob_app_id));
//        }
//        AdView adView = new AdView(context);
//        AdSize adSize = new AdSize(width, height);
//        adView.setAdSize(adSize);
//        if(BuildConfig.DEBUG){
//            adView.setAdUnitId(context.getResources().getString(R.string.debug_ads_adunitid));
//        }else{
//            adView.setAdUnitId(context.getResources().getString(R.string.ads_adunitid));
//        }
//        AdRequest adRequest = new AdRequest.Builder().build();
//        adView.loadAd(adRequest);
//        adView.setAdListener(new AdListener(){
//
//            @Override
//            public void onAdClosed() {
//                adListener.onAdClosed();
//            }
//            @Override
//            public void onAdFailedToLoad(int var1) {
//                adListener.onAdFailedToLoad(var1);
//            }
//            @Override
//            public void onAdLeftApplication() {
//                adListener.onAdLeftApplication();
//            }
//            @Override
//            public void onAdOpened() {
//                adListener.onAdOpened();
//            }
//            @Override
//            public void onAdLoaded() {
//                adListener.onAdLoaded();
//            }
//            @Override
//            public void onAdClicked() {
//                adListener.onAdClicked();
//            }
//            @Override
//            public void onAdImpression() {
//                adListener.onAdImpression();
//            }
//        });
//        return adView;
//    }
//}
