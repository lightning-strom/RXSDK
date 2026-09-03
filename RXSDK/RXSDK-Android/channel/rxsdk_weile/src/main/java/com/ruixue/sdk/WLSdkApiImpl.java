package com.ruixue.sdk;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;

import java.util.Map;

public class WLSdkApiImpl extends RXSdkApi {

    private static final String[] PLUGIN_NAME = new String[]{
            "RX_PLUGIN_PAY_UNIFYPAY",
            "RX_PLUGIN_HQ",
            "RX_PLUGIN_PAY_SUNING",
            "RX_PLUGIN_ALIAUTH",
            "RX_PLUGIN_TXAUTH",
            "RX_PLUGIN_WECHAT",
            "RX_PLUGIN_ALIPAY",
            "RX_PLUGIN_PAY_YEEPAY",
            "RX_PLUGIN_PAY_XINGYI",
            "RX_PLUGIN_TOPON"
    };

    static class Single {
        final static WLSdkApiImpl INSTANCE = new WLSdkApiImpl();
    }

    protected WLSdkApiImpl() {
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
    }


    @NonNull
    public static WLSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }


    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("own").setVersion(RuiXueSdk.getSdkVersion()).setPlugins(getPlugins().keySet().toString()).build();
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey("indulge_auth")) {
            hashMap.put("indulge_auth", BillingClient.PAY_LIMIT_ENABLE);
        }
        super.pay(activity, hashMap, callback);
    }
}
