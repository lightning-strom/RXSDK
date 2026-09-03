package com.ruixue.internal;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.hardware.display.DisplayManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.ruixue.RuiXueSdk;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.ObjectUtils;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;

public class ActivityLifecycleTracker {

    private static final AtomicBoolean tracking = new AtomicBoolean(false);
    private static int activityReferences = 0;
    private static WeakReference<Activity> currActivity;
    private static Application mApplication;

    public interface ActivityResultObserver {
        void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data);
    }

    private static final Map<Object, ActivityResultObserver> msActivityResultObserver = new HashMap<>();

    public static void registerActivityResultObserver(Object key, ActivityResultObserver o) {
        if (key != null) {
            msActivityResultObserver.put(key, o);
        }
    }

    public static void removeActivityResultObserver(Object key) {
        if (key != null)
            msActivityResultObserver.remove(key);
    }

    public static void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        try {
            for (Map.Entry<Object, ActivityResultObserver> entry : msActivityResultObserver.entrySet()) {
                entry.getValue().onActivityResult(activity, requestCode, resultCode, data);
                removeActivityResultObserver(entry.getKey());
            }
        } catch (Exception ignore) {
        }
    }


    public static void startTracking(Application application) {
        if (!tracking.compareAndSet(false, true)) {
            return;
        }
        mApplication = application;
        application.registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {
                ActivityLifecycleTracker.onActivityCreated(activity);
                if (activity.getIntent().getExtras() != null) {
                    boolean d = ObjectUtils.toBoolean(activity.getIntent().getExtras().get("debug_enable"));
                    if (d) {
                        RXGlobalData.setCmdDebug(d);
                        RXLogger.i("debug is enabled");
                    }
                }
                Log.i("rxsdk", "onActivityCreated:"+activity.getPackageName()+"/"+ activity);
            }

            @Override
            public void onActivityStarted(@NonNull Activity activity) {
                ActivityLifecycleTracker.onActivityStarted(activity);
                activityReferences++;
                RXLogger.i("onActivityStarted:" + activity);
            }

            @Override
            public void onActivityResumed(@NonNull Activity activity) {
                ActivityLifecycleTracker.onActivityResumed(activity);
                RXLogger.i("onActivityResumed:" + activity);
            }

            @Override
            public void onActivityPaused(@NonNull Activity activity) {
                ActivityLifecycleTracker.onActivityPaused(activity);
                RXLogger.i("onActivityPaused:" + activity);
            }

            @Override
            public void onActivityStopped(@NonNull Activity activity) {
                ActivityLifecycleTracker.onActivityStopped(activity);
                activityReferences--;
                RXLogger.i("onActivityStopped:" + activity);
            }

            @Override
            public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {
                ActivityLifecycleTracker.onActivitySaveInstanceState(activity);
                RXLogger.i("onActivitySaveInstanceState");
            }

            @Override
            public void onActivityDestroyed(@NonNull Activity activity) {
                ActivityLifecycleTracker.onActivityDestroyed(activity);
                RXLogger.i("onActivityDestroyed");
            }
        });

        registerProcessLifecycleObserver();
    }

    /**
     * 以 {@link ProcessLifecycleOwner} 粒度监听整个进程的前/后台切换，内部用 700ms 延迟合并
     * Activity 跳转和 configChange（如屏幕旋转）产生的抖动，仅在真正的前后台切换时回调。
     * <p>
     * initConfig 成功后，每次进程回到前台都会请求 {@code v1/sdkconfig/detection} 刷新 {@code st_offset}。
     */
    private static void registerProcessLifecycleObserver() {
        Handler mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.post(() -> ProcessLifecycleOwner.get().getLifecycle()
                .addObserver(new DefaultLifecycleObserver() {
                    @Override
                    public void onStart(@NonNull LifecycleOwner owner) {
                        if (TrackDataMgr.getInstance().isInitConfigSucceeded()) {
                            TrackDataMgr.getInstance().detectServerTime();
                        }
                    }
                }));
    }

    public static boolean isTracking() {
        return tracking.get();
    }

    public static boolean isMainThread() {
        return Looper.myLooper() == Looper.getMainLooper();
    }

    public static Application getApplication() {
        return mApplication;
    }

    public static Activity getCurrentActivity() {
        if (currActivity != null)
            return currActivity.get();
        else
            return null;
    }

    public static void setCurrentActivity(Activity activity) {
        currActivity = new WeakReference<>(activity);
    }

    public static boolean isInBackground() {
        return 0 == activityReferences;
    }

    public static void onActivityCreated(Activity activity) {
        setCurrentActivity(activity);
        DisplayManager displayManager = (DisplayManager) activity.getSystemService(Context.DISPLAY_SERVICE);
        displayManager.registerDisplayListener(new DisplayManager.DisplayListener() {
            @Override
            public void onDisplayAdded(int displayId) {
            }

            @Override
            public void onDisplayRemoved(int displayId) {
            }

            @Override
            public void onDisplayChanged(int displayId) {
                RXGlobalData.updateLanguage(RuiXueSdk.getCurrentActivity());
            }
        }, new Handler(Looper.getMainLooper()));
    }

    public static void onActivityStarted(Activity activity) {

    }

    public static void onActivityResumed(Activity activity) {
        setCurrentActivity(activity);
    }

    public static void onActivityPaused(Activity activity) {

    }

    public static void onActivityStopped(Activity activity) {

    }

    public static void onActivitySaveInstanceState(Activity activity) {

    }

    public static void onActivityDestroyed(Activity activity) {

    }

}
