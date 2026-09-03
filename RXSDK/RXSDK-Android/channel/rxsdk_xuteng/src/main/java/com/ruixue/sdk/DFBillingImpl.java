package com.ruixue.sdk;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.xut.sdk.channel.DFPlatformAPI;

import org.json.JSONObject;

import java.util.Map;

class DFBillingImpl extends BillingClient {

    public void onPayFinished(boolean b) {
        if (payCallback != null) {
            if (b) {
                payCallback.onSuccess(null);
            } else {
                payCallback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject());
            }
        }
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        fillDefaultHqType(hashMap);
        super.pay(activity, hashMap, callback);
    }

    static void fillDefaultHqType(Map<String, Object> params) {
        if (!params.containsKey(KEY_HQ_TYPE)) {
            params.put(KEY_HQ_TYPE, "xuteng");
        }
    }

    RXJSONCallback payCallback;

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        XTOrderData orderData = XTOrderData.fromJson(data);
        payCallback = callback;

        DFPlatformAPI.getInstance().pay(orderData.toOrderInfo(hashMap));

    }


}
