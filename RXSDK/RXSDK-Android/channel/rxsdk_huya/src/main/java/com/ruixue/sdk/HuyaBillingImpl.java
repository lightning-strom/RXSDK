package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

public class HuyaBillingImpl extends BillingClient {

    public static final String HUYA = "huya";
    private static final String TAG = "HuyaBilling";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, HUYA);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data,
            RXJSONCallback callback) {
        try {
            HuyaOrderData orderData = HuyaOrderData.fromJson(data);
            if (orderData == null) {
                fail(callback, RXErrorCode.HQ_DATA_ERROR.getValue(), "huya order data is null");
                return;
            }
            String bizOrderId = orderData.resolveBizOrderId();
            String bizSign = orderData.resolveBizSign();
            int amountFen = orderData.resolveAmountFen();
            if (amountFen <= 0 || TextUtils.isEmpty(bizOrderId) || TextUtils.isEmpty(bizSign)) {
                fail(callback, RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                        "huya pay requires amount/bizOrderId/bizSign");
                return;
            }
            boolean invoked = HuyaSdkHelper.getInstance().pay(activity, orderData, callback);
            if (!invoked) {
                fail(callback, RXErrorCode.THIRD_PAY_ERROR.getValue(), "huya sdk not ready");
                return;
            }
            // 客户端结果等待 Berry PAY 事件；成功仅表示拉起支付页，发货以后端 notify 为准
        } catch (Exception e) {
            RXLogger.e(TAG + " onOrderResponse error: " + e.getMessage());
            fail(callback, RXErrorCode.THIRD_PAY_ERROR.getValue(), e.getMessage());
        }
    }

    private void fail(RXJSONCallback callback, int code, String msg) {
        if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(code, msg));
        }
    }
}
