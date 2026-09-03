package com.ruixue.alipay;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXException;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class AlipayBillingImpl extends BillingClient {

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            AliPayHelper.pay(activity, data, callback);
        } catch (JSONException e) {
            callback.onError(new RXException(e));
        }
    }
}
