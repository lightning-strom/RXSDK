package com.ruixue.sdk.twitter;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.IPluginSdk;

import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;



public class TwitterSdkWrapper  implements IPluginSdk {
    public static final String NAME = "twitter";


    RXJSONCallback mCallback;
    String channel_id;

    @Override
    public void attachBaseContext(Context context) {

    }

    @Override
    public void onApplicationCreate(Application application) {

    }

    @Override
    public void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner) {

    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {

    }


    @Override
    public void onStart(Activity activity) {

    }

    @Override
    public void onRestart(Activity activity) {

    }

    @Override
    public void onResume(Activity activity) {

    }

    @Override
    public void onPause(Activity activity) {

    }

    @Override
    public void onStop(Activity activity) {

    }

    @Override
    public void onDestroy(Activity activity) {

    }

    @Override
    public void onBackPressed() {

    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }


    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {

    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {

    }

    static class Single {
        final static TwitterSdkWrapper INSTANCE = new TwitterSdkWrapper();
    }

    private TwitterSdkWrapper() {
    }

    public static TwitterSdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public String getName() {
        return NAME;
    }


    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    AtomicBoolean isLoggingIn = new AtomicBoolean(false);




    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {

        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {

        return true;
    }

    @Override
    public boolean doExitApp(Activity activity, @Nullable OnAppExitCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }

}
