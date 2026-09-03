package com.ruixue.sdk;

import android.app.Activity;

import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.nearme.game.sdk.pay.PayResponse;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class OppoBillingImpl extends BillingClient {
    public static final String OPPO = "oppo";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, OPPO);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        OppoOrderData orderData = OppoOrderData.fromJson(data);
        if (orderData != null) {
            GameCenterSDK.getInstance().doPay(activity, orderData.toPayInfo(), new ApiCallback() {

                @Override
                public void onSuccess(String resultMsg) {
                    callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), resultMsg));
                }

                @Override
                public void onFailure(String resultMsg, int resultCode) {
                    if (PayResponse.CODE_CANCEL == resultCode) {
                        callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(resultCode, resultMsg));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(resultCode, resultMsg));
                    }
                }
            });

        } else if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }
}
