package com.ruixue.demo.adjust;

import android.app.Activity;
import android.app.Application;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.sdk.adjust.AdjustSdkWrapper;
import com.ruixue.sdk.adjust.callback.OnRxAttributionChangedListener;
import com.ruixue.sdk.adjust.callback.OnRxDeeplinkResponseListener;
import com.ruixue.sdk.adjust.callback.OnRxEventTrackingFailedListener;
import com.ruixue.sdk.adjust.callback.OnRxEventTrackingSucceededListener;
import com.ruixue.sdk.adjust.callback.OnRxSessionTrackingFailedListener;
import com.ruixue.sdk.adjust.callback.OnRxSessionTrackingSucceededListener;
import com.ruixue.sdk.adjust.config.RxAdjustConfig;
import com.ruixue.sdk.adjust.config.RxLogLevel;
import com.ruixue.sdk.adjust.data.RxAdjustAttribution;
import com.ruixue.sdk.adjust.data.RxAdjustEventFailure;
import com.ruixue.sdk.adjust.data.RxAdjustEventSuccess;
import com.ruixue.sdk.adjust.data.RxAdjustSessionFailure;
import com.ruixue.sdk.adjust.data.RxAdjustSessionSuccess;

public class GlobalApplication extends Application {
    private final String TAG = GlobalApplication.class.getSimpleName();
    @Override
    public void onCreate() {
        super.onCreate();

        String environment = RxAdjustConfig.ENVIRONMENT_SANDBOX;
        RxAdjustConfig config = new RxAdjustConfig(this, "21lpq03nrw8w", environment);

        config.setLogLevel(RxLogLevel.WARN);
//        config.setDelayStart(5.5);
//        config.setNeedsCost(true);
//        config.setEventBufferingEnabled(true);
//        config.setUrlStrategy(RxAdjustConfig.DATA_RESIDENCY_EU);
//        config.setPreinstallTrackingEnabled(true);
//        config.setSendInBackground(true);
//        config.setExternalDeviceId("test");
        config.setOnRxEventTrackingSucceededListener(new OnRxEventTrackingSucceededListener() {
            @Override
            public void onFinishedEventTrackingSucceeded(RxAdjustEventSuccess eventSuccessResponseData) {
                Log.d(TAG, "RxAdjustEventSuccess:" + eventSuccessResponseData.toString());
            }
        });

        config.setOnRxEventTrackingFailedListener(new OnRxEventTrackingFailedListener() {
            @Override
            public void onFinishedEventTrackingFailed(RxAdjustEventFailure rxAdjustEventFailure) {
                Log.d(TAG, "RxAdjustEventFailure:" + rxAdjustEventFailure.toString());
            }
        });

        config.setOnRxSessionTrackingSucceededListener(new OnRxSessionTrackingSucceededListener() {
            @Override
            public void onFinishedSessionTrackingSucceeded(RxAdjustSessionSuccess rxAdjustSessionSuccess) {
                Log.d(TAG, "RxAdjustSessionSuccess:" + rxAdjustSessionSuccess.toString());
            }
        });

        config.setOnRxSessionTrackingFailedListener(new OnRxSessionTrackingFailedListener() {
            @Override
            public void onFinishedSessionTrackingFailed(RxAdjustSessionFailure rxAdjustSessionFailure) {
                Log.d(TAG, "RxAdjustSessionFailure:" + rxAdjustSessionFailure.toString());
            }
        });

        config.setOnRxDeeplinkResponseListener(new OnRxDeeplinkResponseListener() {
            @Override
            public boolean launchReceivedDeeplink(Uri deeplink) {
                Log.d(TAG, "Deferred deep link callback called!");
                Log.d(TAG, "Deep link URL: " + deeplink);
                return true;
            }
        });

        config.setOnRxAttributionChangedListener(new OnRxAttributionChangedListener() {
            @Override
            public void onAttributionChanged(RxAdjustAttribution attribution) {
                Log.d(TAG, "RxAdjustAttribution:" + attribution.toString());
            }
        });

        AdjustSdkWrapper.getInstance().init(this, config);

        registerActivityLifecycleCallbacks(new AdjustLifecycleCallbacks());

    }

    private static final class AdjustLifecycleCallbacks implements ActivityLifecycleCallbacks {

        @Override
        public void onActivityResumed(@NonNull Activity activity) {
            AdjustSdkWrapper.getInstance().onResume(activity);
        }

        @Override
        public void onActivityPaused(@NonNull Activity activity) {
            AdjustSdkWrapper.getInstance().onPause(activity);
        }

        @Override
        public void onActivityStopped(@NonNull Activity activity) {

        }

        @Override
        public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {

        }

        @Override
        public void onActivityDestroyed(@NonNull Activity activity) {

        }

        @Override
        public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {

        }

        @Override
        public void onActivityStarted(@NonNull Activity activity) {

        }

    }

}
