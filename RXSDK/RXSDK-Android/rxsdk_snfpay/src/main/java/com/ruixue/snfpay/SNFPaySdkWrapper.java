package com.ruixue.snfpay;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.Map;
import java.util.Objects;

public final class SNFPaySdkWrapper extends PluginSdk {
    public static final String SUNING = "suning";

    static class Single {
        final static SNFPaySdkWrapper INSTANCE = new SNFPaySdkWrapper();
    }

    public static SNFPaySdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private final SNFBillingImpl mSNFPayBilling;

    public SNFPaySdkWrapper() {
        this.mSNFPayBilling = new SNFBillingImpl();
    }

    @Override
    public String getName() {
        return "suning";
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        return false;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (Objects.equals(hashMap.get(HQType.KEY), SUNING)) {
            mSNFPayBilling.pay(activity, hashMap, callback);
            return true;
        } else {
            return false;
        }
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}