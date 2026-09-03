package com.ruixue.sdk;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.openapi.RXSdkApiPlugin;

import java.util.Map;

/**
 * Google Play 海外渠道宿主。
 * <p>
 * 公共海外逻辑（thirdLogin/thirdLogout/jumpToAppStore/getProductInfo）
 * 已下沉到 {@link RXSdkApiPlugin}。
 */
public class OverseasSdkApiImpl extends RXSdkApiPlugin {

    private final String[] PLUGIN_NAME = new String[]{
            "RX_PLUGIN_FACEBOOK",
            "RX_PLUGIN_GOOGLE",
            "RX_PLUGIN_FIREBASE",
            "RX_PLUGIN_LINE",
            "RX_PLUGIN_ADJUST",
            "RX_PLUGIN_ZALO",
            "RX_PLUGIN_TIKTOK",
            "RX_PLUGIN_SNAPCHAT",
            "RX_PLUGIN_INSTAGRAM",
            "RX_PLUGIN_REDDIT",
            "RX_PLUGIN_TOPON",
            "RX_PLUGIN_JUEFENG",
            "RX_PLUGIN_VK",
            "RX_PLUGIN_RUSTORE"
    };

    static class Single {
        static final OverseasSdkApiImpl INSTANCE = new OverseasSdkApiImpl();
    }

    protected OverseasSdkApiImpl() {
    }

    @NonNull
    public static OverseasSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return buildOverseasSdkInfo("google", getPlugins().keySet().toString());
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(BillingClient.KEY_HQ_TYPE)) {
            hashMap.put(BillingClient.KEY_HQ_TYPE, "google");
        }
        super.pay(activity, hashMap, callback);
    }
}
