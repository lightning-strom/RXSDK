package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ss.android.dypay.api.DyPay;
import com.ss.android.dypay.api.IDyPayResultCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

class XingYiBillingImpl extends BillingClient {

    private static final String TAG = "XingYiPay";
    private static final String RESULT_SUCCESS = "0";
    private static final String RESULT_CANCEL = "1";
    private static final String RESULT_UNKNOWN = "3";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        XingYiPayUtils.normalizePayRequest(hashMap);
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, XingYiSdkWrapper.PAY_TYPE_APP);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data,
                                   RXJSONCallback callback) {
        if (data == null) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.HQ_DATA_ERROR.getValue(),
                        "xingyi pay order data is null"));
            }
            return;
        }
        JSONObject payInfo = resolvePayInfo(data);
        Map<String, String> payInfoMap = toPayInfoMap(payInfo);
        if (payInfoMap.isEmpty()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.HQ_DATA_ERROR.getValue(),
                        "xingyi pay data is empty"));
            }
            return;
        }
        activity.runOnUiThread(() -> {
            try {
                new DyPay(activity).pay(payInfoMap, new IDyPayResultCallback() {
                    @Override
                    public void onResult(@NonNull Map<String, String> map) {
                        handlePayResult(map, callback);
                    }
                }, true);
            } catch (Exception e) {
                RXLogger.e(TAG + " DyPay.pay error:" + e.getMessage());
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
        });
    }

    /**
     * 服务端下单数据透传：优先取 ext.appPayData，否则取 ext，最后回退 data 本身。
     * 客户端不做字段改名或补齐，由服务端按 DyPay 要求下发参数。
     */
    @NonNull
    private static JSONObject resolvePayInfo(@NonNull JSONObject data) {
        JSONObject ext = data.optJSONObject("ext");
        if (ext == null) {
            String extString = data.optString("ext");
            if (!TextUtils.isEmpty(extString)) {
                try {
                    ext = new JSONObject(extString);
                } catch (Exception e) {
                    RXLogger.e(TAG + " parse ext error:" + e.getClass());
                }
            }
        }
        if (ext != null) {
            JSONObject appPayData = ext.optJSONObject("appPayData");
            if (appPayData != null) {
                return appPayData;
            }
            return ext;
        }
        return data;
    }

    @NonNull
    private static Map<String, String> toPayInfoMap(@NonNull JSONObject payInfo) {
        Map<String, String> payInfoMap = new HashMap<>();
        Iterator<String> keys = payInfo.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            String value = payInfo.optString(key);
            if (!TextUtils.isEmpty(value)) {
                payInfoMap.put(key, value);
            }
        }
        return payInfoMap;
    }

    private static void handlePayResult(@Nullable Map<String, String> resultMap, @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        Map<String, Object> resultPayload = new HashMap<>();
        if (resultMap != null) {
            resultPayload.put("dy_pay_result", new JSONObject(resultMap));
        }
        String resultCode = resultMap == null ? "" : resultMap.get("resultCode");
        String errorMsg = resultMap == null ? "" : resultMap.get("errorMsg");
        String message = TextUtils.isEmpty(errorMsg) ? "dy pay resultCode=" + resultCode : errorMsg;
        try {
            if (RESULT_SUCCESS.equals(resultCode)) {
                callback.onSuccess(JSONUtil.toJSONObject(
                        resultPayload,
                        RXErrorCode.SUCCESS.getValue(),
                        "please query the payment result from server.",
                        ""));
                return;
            }
            if (RESULT_UNKNOWN.equals(resultCode)) {
                callback.onSuccess(JSONUtil.toJSONObject(
                        resultPayload,
                        RXErrorCode.SUCCESS.getValue(),
                        "dy pay result is unknown, please query the payment result from server.",
                        ""));
                return;
            }
            if (RESULT_CANCEL.equals(resultCode)) {
                callback.onFailed(JSONUtil.toJSONObject(
                        resultPayload,
                        RXErrorCode.PAY_CANCEL.getValue(),
                        message,
                        ""));
                return;
            }
            callback.onFailed(JSONUtil.toJSONObject(
                    resultPayload,
                    RXErrorCode.THIRD_PAY_ERROR.getValue(),
                    message,
                    ""));
        } catch (Exception e) {
            RXLogger.e(TAG + " handlePayResult error:" + e.getClass());
            callback.onError(new RXException(e));
        }
    }
}
