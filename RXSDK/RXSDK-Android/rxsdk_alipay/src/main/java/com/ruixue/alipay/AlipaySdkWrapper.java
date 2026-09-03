package com.ruixue.alipay;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/12/16
 */
public class AlipaySdkWrapper extends PluginSdk {

    public static final String ALIPAY = "alipay";

    static class Single {
        final static AlipaySdkWrapper INSTANCE = new AlipaySdkWrapper();
    }

    private final AlipayBillingImpl billing;

    protected AlipaySdkWrapper() {
        this.billing = new AlipayBillingImpl();
    }

    @NonNull
    public static AlipaySdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public String getName() {
        return ALIPAY;
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
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }


    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (getName().equals(hashMap.get(HQType.KEY)) || "ap".equals(hashMap.get(HQType.KEY))) {
            billing.pay(activity, hashMap, callback);
            return true;
        } else {
            return false;
        }
    }
}
