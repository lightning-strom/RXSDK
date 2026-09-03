package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.Map;
import java.util.Objects;

public final class XingYiSdkWrapper extends PluginSdk {

    public static final String NAME = "xingyi";
    public static final String PAY_TYPE_APP = "xy";

    private final XingYiBillingImpl billingClient = new XingYiBillingImpl();

    static class Single {
        static final XingYiSdkWrapper INSTANCE = new XingYiSdkWrapper();
    }

    public static XingYiSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        if (callback != null) {
            callback.onSuccess(null);
        }
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap,
                           @NonNull RXJSONCallback callback) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        XingYiPayUtils.normalizePayRequest(hashMap);
        if (!Objects.equals(hashMap.get(HQType.KEY), PAY_TYPE_APP)) {
            return false;
        }
        if (XingYiPayUtils.isH5Pay(hashMap, null)) {
            return false;
        }
        billingClient.pay(activity, hashMap, callback);
        return true;
    }
}
