package com.ruixue.topon;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.anythink.core.api.ATSDK;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXException;
import com.ruixue.openapi.PluginSdk;

import java.util.Map;

public class TopOnSDkWrapper extends PluginSdk {

    public final static String TAG = "TopOnSDkWrapper";

    static class Single {
        final static TopOnSDkWrapper INSTANCE = new TopOnSDkWrapper();
    }

    private TopOnSDkWrapper() {
    }

    public static TopOnSDkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        try {
            String appId = (String) (paramsMap.containsKey("topon_app_id") ? paramsMap.get("topon_app_id") : paramsMap.get("app_id"));
            String appKey = (String) (paramsMap.containsKey("topon_app_key") ? paramsMap.get("topon_app_key") : paramsMap.get("app_key"));
            Log.d(TAG, "topOn 初始化。。。");
            ATSDK.init(context, appId, appKey);//初始化SDK
        } catch (Exception e) {
            e.printStackTrace();
            if (callback != null)
                callback.onError(new RXException(e));
        }
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public String getName() {
        return "topon";
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
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
}
