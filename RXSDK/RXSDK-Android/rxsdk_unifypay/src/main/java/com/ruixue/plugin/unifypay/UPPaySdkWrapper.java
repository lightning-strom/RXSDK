package com.ruixue.plugin.unifypay;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;
import com.tencent.mm.opensdk.modelbase.BaseResp;

import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/9/24
 */
public class UPPaySdkWrapper extends PluginSdk {
    public static final String AUMS = "aums";

    static class Single {
        final static UPPaySdkWrapper INSTANCE = new UPPaySdkWrapper();
    }

    public static UPPaySdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private final AUMSBillingImpl mAUMSPayBilling;

    public UPPaySdkWrapper() {
        this.mAUMSPayBilling = new AUMSBillingImpl();
    }

    @Override
    public String getName() {
        return AUMS;
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
        if (Objects.equals(hashMap.get(HQType.KEY), AUMS)) {
            mAUMSPayBilling.pay(activity, hashMap, callback);
            return true;
        } else {
            return false;
        }
    }



    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        mAUMSPayBilling.handleIntent(intent);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        mAUMSPayBilling.onActivityResult(resultCode, requestCode, data);
    }

    /**
     * 微信 WXEntryActivity onResp 中回调此方法
     * @param context  context
     * @param baseResp baseResp
     */
    public static void onWXResp(Context context, BaseResp baseResp) {
        UPPayWrapper.onResp(context, baseResp);
    }
}
