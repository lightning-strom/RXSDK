package com.ruixue.internal;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/11
 */
public class Boot {

    static AtomicBoolean isBooted = new AtomicBoolean(false);

    /**
     * 禁止 cp 调用此重载函数初始化
     */
    public static void initialize(Context applicationContext) {
        if (applicationContext == null) {
            Log.e("rxsdk", "initialize application Context is null error");
            return;
        }
        if (isBooted.compareAndSet(false, true)) {
            Log.i("rxsdk", "initialize "+applicationContext);
            RXGlobalData.init(applicationContext);
            RXSdkApi.getInstance().loadPlugins(applicationContext);
            if (applicationContext instanceof Application) {
                ActivityLifecycleTracker.startTracking((Application) applicationContext);
            }
        }
    }
}
