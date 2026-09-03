package com.ruixue.hq;

import static com.ruixue.hq.HQT5.KEY;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXRequestCallback;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;


public final class HQSdkWrapper extends PluginSdk {

//ht ruixue_h5_trade
//pm payermax
//jh jdjh（京东支付）
//aph alipayh5（支付宝h5）
//up unipin
//a aums（银联）
//wch wechath5（微信 h5）
//ap realipay（支付宝原生）
//xsa xsolla_inapp（xsolla 应用内支付）
//co checkout
//owch overseash5(海外微信 h5)
//xy 星驿 H5 支付（ext.is_h5=1）

    static class Single {
        final static HQSdkWrapper INSTANCE = new HQSdkWrapper();
    }

    public static HQSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private final HQBillingImpl h5Billing;

    private final List<String> SUPPORT_HQ_TYPES = Arrays.asList(HQT5.RUIXUE_H5_TRADE, HQT5.PAYERMAX, HQT5.JDJH, HQT5.ALIPAYH5, HQT5.UNIPIN, HQT5.AUMS, HQT5.WECHATH5, HQT5.REALIPAY, HQT5.XSOLLA_INAPP, HQT5.CHECKOUT, HQT5.OVERSEAS_WECHATH5, HQT5.My_CARD, HQT5.UTG, HQT5.WAFFO, HQT5.OGOOD);


    public void addSupportPayType(String payType) {
        SUPPORT_HQ_TYPES.add(payType);
    }

    public boolean isSupportPayType(String payType) {
        return SUPPORT_HQ_TYPES.contains(payType);
    }

    public HQSdkWrapper() {
        this.h5Billing = new HQBillingImpl();
    }

    @Override
    public String getName() {
        return "hq_plugin";
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

    public boolean doPay(Activity activity, @NonNull Map<String, Object> map, UnityRXRequestCallback callback) {
        return doPay(activity, map, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        XingYiH5Helper.normalizePayRequest(hashMap);
        String payType = (String) hashMap.get(KEY);
        if (HQT5.XINGYI.equals(payType)) {
            if (!XingYiH5Helper.isH5Pay(hashMap, null)) {
                return false;
            }
            h5Billing.pay(activity, hashMap, callback);
            return true;
        }
        if (this.isSupportPayType(payType)) {
            if (Objects.equals(hashMap.get(KEY), HQT5.AUMS)) {
                if (hashMap.containsKey("plugin_name")) {
                    h5Billing.pay(activity, hashMap, callback);
                    return true;
                } else {
                    return false;
                }
            } else {
                h5Billing.pay(activity, hashMap, callback);
                return true;
            }
        } else {
            return false;
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}