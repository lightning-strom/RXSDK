package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/10/23
 */
public class HmsSdkWrapper extends PluginSdk {

    @Override
    public String getName() {
        return "hwjos";
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        HmsSdkApiImpl.getInstance().initThirdSdk((Activity) context, paramsMap, callback);
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        HmsSdkApiImpl.getInstance().login(activity, paramsMap, callback);
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        HmsSdkApiImpl.getInstance().logout(callback);
        return true;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        HmsSdkApiImpl.getInstance().pay(activity, hashMap, callback);
        return true;
    }
}
