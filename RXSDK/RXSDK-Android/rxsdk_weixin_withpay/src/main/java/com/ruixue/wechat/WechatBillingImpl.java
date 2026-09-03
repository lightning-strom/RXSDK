package com.ruixue.wechat;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;

import org.json.JSONObject;

import java.util.Map;

public class WechatBillingImpl extends BillingClient {

    static class Single {
        final static WechatBillingImpl INSTANCE = new WechatBillingImpl();
    }

    @NonNull
    public static WechatBillingImpl getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        WXPayImpl.getInstance().sendPayReq(activity, data, callback);
    }

}
