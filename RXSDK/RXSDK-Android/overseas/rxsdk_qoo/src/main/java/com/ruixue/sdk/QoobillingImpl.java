package com.ruixue.sdk;

import android.app.Activity;
import android.util.Log;

import com.qooapp.opensdk.QooAppOpenSDK;
import com.qooapp.opensdk.common.PaymentCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

public class QoobillingImpl extends BillingClient {

    public final static String TAG = "QoobillingImpl";
    public static final String QOO = "qoo";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, QOO);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data,
                                   RXJSONCallback callback) {

        QooOrderData orderData = QooOrderData.fromJson(data);

        if (orderData == null || orderData.getExt() == null || orderData.getOrderNo() == null) {
            return;
        }
        QooAppOpenSDK.getInstance().purchase(new PaymentCallback() {

            @Override
            public void onComplete(String json) {
                Log.d(TAG, "qoo pay onComplete: " + json);
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), json)
                    );
                }
            }


            @Override
            public void onError(String error) {
                Log.d(TAG, "qoo pay onError: " + error);
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR.getValue(),
                                    error)
                    );
                }
            }


            @Override
            public void onCancel() {
                Log.d(TAG, "qoo pay onCancel");
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(),
                                    "pay cancel")
                    );
                }
            }

        }, activity, orderData.getExt().third_tag, orderData.getOrderNo(), orderData.getTransmitArgs());

    }
}
