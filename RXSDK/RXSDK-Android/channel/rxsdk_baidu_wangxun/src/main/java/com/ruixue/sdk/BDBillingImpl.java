package com.ruixue.sdk;

import android.app.Activity;

import com.baidu.gamesdk.BDGameSDK;
import com.baidu.gamesdk.ResultCode;
import com.baidu.platformsdk.PayOrderInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

public class BDBillingImpl extends BillingClient {
public static final String BAIDUNET = "baidunet";
    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE,BAIDUNET);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            BDOrderData orderData = BDOrderData.fromJson(data);
            if (orderData != null) {
                PayOrderInfo payOrderInfo = null;
                payOrderInfo = orderData.toPayOrderInfo();

                BDGameSDK.pay(activity, payOrderInfo, null, (resultCode, resultDesc, extraData) -> {
                    if (resultCode == ResultCode.PAY_SUCCESS) {
                        callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS));
                    } else if (resultCode == ResultCode.PAY_CANCEL) {
                        callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(resultCode, resultDesc));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(resultCode, resultDesc));
                    }
                });
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        } catch (RXException e) {
            e.printStackTrace();
            callback.onError(e);
        }
    }
}
