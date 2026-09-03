package com.ruixue.sdk;

import android.app.Activity;
import android.util.Log;

import com.google.gson.Gson;
import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.nearme.game.sdk.common.model.PayResponse;
import com.nearme.game.sdk.common.model.biz.PayInfo;
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
public class OppoOverseasBillingImpl extends BillingClient {
    private static final String OPPO = "gl_oppo";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        hashMap.put(KEY_HQ_TYPE, OPPO);
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        String callbackUrl = data.optString("notify_url");
        JSONObject extData = data.optJSONObject("ext");
        if (extData == null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            return;
        }
        OppoOverseasOrderData orderData = OppoOverseasOrderData.fromJson(extData);
        if (orderData != null) {
            PayInfo payInfo = orderData.toPayInfo();
            payInfo.setCallbackUrl(callbackUrl);
            Log.d("payInfo", new Gson().toJson(payInfo));
            GameCenterSDK.getInstance().doPay(activity, payInfo, new ApiCallback() {

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
