package com.ruixue.sdk.firebase;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.FirebaseApp;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.sdk.firebase.delegate.FirebaseAnalyticsDelegate;
import com.ruixue.sdk.firebase.delegate.FirebaseCrashlyticsDelegate;
import com.ruixue.sdk.firebase.delegate.FirebaseMessagingDelegate;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
public class FirebaseSdkWrapper extends PluginSdk {

    public static final String NAME = "firebase";

    static class Single {
        final static FirebaseSdkWrapper INSTANCE = new FirebaseSdkWrapper();
    }

    private FirebaseSdkWrapper() {
    }

    public static FirebaseSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private FirebaseAnalyticsDelegate mFirebaseAnalyticsDelegate;
    private final FirebaseCrashlyticsDelegate mFirebaseCrashlyticsDelegate = new FirebaseCrashlyticsDelegate();
    private final FirebaseMessagingDelegate mFirebaseMessagingDelegate = new FirebaseMessagingDelegate();

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    public String getAppInstanceId(Context context) {
        // 使用Callable封装获取appInstanceId的逻辑
        Callable<String> callable = () -> {
            Task<String> stringTask = FirebaseAnalytics.getInstance(context).getAppInstanceId();
            // Tasks.await()会阻塞直到Task完成
            return Tasks.await(stringTask);
        };

        ExecutorService exec = Executors.newSingleThreadExecutor();
        Future<String> future = exec.submit(callable);
        exec.shutdown();

        // 获取结果，这里也会阻塞，直到Future完成
        try {
            return future.get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 初始化fireBase
     * @param context Context上下文
     */
    public void initFirebaseAnalytics(Context context) {
        mFirebaseAnalyticsDelegate = new FirebaseAnalyticsDelegate(context);
    }

    /**
     * 获取 FirebaseAnalytics 实例
     * @return
     */
    public FirebaseAnalyticsDelegate getFirebaseAnalytics() {
        if (mFirebaseAnalyticsDelegate == null) {
            Log.d(NAME, "请先调用 initFirebase(Context context) 进行初始化");
            return null;
        }
        return mFirebaseAnalyticsDelegate;
    }

    /**
     * 获取 FirebaseCrashlytics 实例
     * @return
     */
    public FirebaseCrashlyticsDelegate getFirebaseCrashlytics() {
        return mFirebaseCrashlyticsDelegate;
    }

    /**
     * 获取 FirebaseMessaging 实例
     * @return
     */
    public FirebaseMessagingDelegate getFirebaseMessaging() {
        return mFirebaseMessagingDelegate;
    }


    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        return false;
    }

    @Override
    public boolean onLoginResp(int code) {
//        bindAdid(0);
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }

    @Override
    public void onApplicationCreate(Application application) {
        FirebaseApp.initializeApp(application);
        super.onApplicationCreate(application);
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity, savedInstanceState);
        initFirebaseAnalytics(activity);
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}
