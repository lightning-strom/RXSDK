package com.ruixue.openapi;

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

import java.util.Map;

public abstract class PluginSdk implements IPluginSdk {

    public abstract String getName();

    public abstract boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback);

    public abstract boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback);

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    public abstract boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback);

    @Override
    public boolean doExitApp(Activity activity, @Nullable OnAppExitCallback callback) {
        return false;
    }

    public abstract boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback);

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
}

