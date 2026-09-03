package com.ruixue.openapi;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;

import java.util.Map;

public interface IPluginSdk extends ILifecycle {

    String getName();

    boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback);

    boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback);

    boolean onLoginResp(int code);

    boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback);

    boolean doExitApp(Activity activity, @Nullable OnAppExitCallback callback);

    boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback);
}

