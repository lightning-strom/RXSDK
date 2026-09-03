package com.ruixue.sdk.firebase.delegate;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FirebaseAnalyticsDelegate {

    public static final String NAME = "FirebaseAnalytics";

    private final FirebaseAnalytics mFirebaseAnalytics;

    public FirebaseAnalyticsDelegate(Context context) {
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);

    }


    /**
     * 记录事件
     * @param name   事件类型
     * @param params 事件数据
     */
    public void logEvent(String name, @Nullable Bundle params) {
        if (!checkFirebaseAnalytics()) {
            Log.e(NAME, "FireBase 没有进行初始化");
            return;
        }
        mFirebaseAnalytics.logEvent(name, params);
    }

    /**
     * 设置默认事件参数
     * @param params 事件bundle
     */
    public void setDefaultEventParameters(@Nullable Bundle params) {
        if (!checkFirebaseAnalytics()) {
            Log.e(NAME, "FireBase 没有进行初始化");
            return;
        }
        mFirebaseAnalytics.setDefaultEventParameters(params);
    }

    /**
     * 设置用户属性
     * @param name  属性名
     * @param value 属性值
     */
    public void setUserProperty(String name, String value) {
        if (!checkFirebaseAnalytics()) {
            Log.e(NAME, "FireBase 没有进行初始化");
            return;
        }
        mFirebaseAnalytics.setUserProperty(name, value);
    }

    /**
     * 设置用户ID
     * @param id 用户ID
     */
    public void setAnalyticsUserId(String id) {
        if (!checkFirebaseAnalytics()) {
            Log.e(NAME, "FireBase 没有进行初始化");
            return;
        }
        mFirebaseAnalytics.setUserId(id);
    }

    /**
     * 是否开启数据收集
     * @param enabled 是否开启
     */
    public void setAnalyticsCollectionEnabled(boolean enabled) {
        if (!checkFirebaseAnalytics()) {
            Log.e(NAME, "FireBase 没有进行初始化");
            return;
        }
        mFirebaseAnalytics.setAnalyticsCollectionEnabled(enabled);
    }

    private boolean checkFirebaseAnalytics() {
        return mFirebaseAnalytics != null;
    }
}
