package com.ruixue.sdk;

import android.app.Activity;

import com.brsdk.android.bean.BRSdkPay;
import com.brsdk.android.bean.BRSdkState;
import com.brsdk.android.core.BRSdkApi;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;

import org.json.JSONObject;

import java.util.Map;

public class XTBillingImpl extends BillingClient {


    public void onPayFinished(BRSdkState brSdkState, BRSdkPay brSdkPay) {
        if (payCallback != null) {
            if (brSdkState.isSuccess()) {
                payCallback.onSuccess(null);
            } else if (brSdkState.isCancel()) {
                payCallback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
            } else {
                payCallback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject());

            }
        }
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, "xt");
        }
        super.pay(activity, hashMap, callback);
    }

    RXJSONCallback payCallback;

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        XTOrderData orderData = XTOrderData.fromJson(data);
        payCallback = callback;

        BRSdkApi.getInstance().onPay(orderData.toBRSdkPay(hashMap));

    }


}
