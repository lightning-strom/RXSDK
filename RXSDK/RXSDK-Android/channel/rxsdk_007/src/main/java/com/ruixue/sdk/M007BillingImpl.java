package com.ruixue.sdk;


import android.app.Activity;
import android.os.Bundle;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.sdk007.R;
import com.ruixue.utils.JSONUtil;
import com.sdk007.lib.SDK007Manager;
import com.sdk007.lib.listener.PayCallback;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/12
 */
public class M007BillingImpl extends BillingClient {

    public static final String M007 = "client_007";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, M007);
        }

        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            M007OrderData orderData = M007OrderData.fromJson(data);
            if (orderData == null || orderData.getExt() == null) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR));
                }
                return;
            }

            Map<String, String> payInfos = new HashMap<>();
            payInfos.put("cpOrderId", orderData.getExt().getCpOrderId()); //订单号
            payInfos.put("productId", orderData.getExt().getProductId()); //商品编号
            payInfos.put("productName", orderData.getExt().getProductName()); //商品名字
            payInfos.put("money", orderData.getExt().getMoney()); // 商品金额 单位分 1元为 100

            SDK007Manager.getInstance().pay(payInfos, new PayCallback() {
                @Override
                public void onSuccess(Bundle bundle) {
                    if (callback != null)
                        callback.onSuccess(null);
                }

                @Override
                public void onFailure(int code, String message) {
                    if (callback != null)
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(code, message));
                }
            });
        } catch (Exception e) {
            RXLogger.e(e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR));
            }
        }

    }
}
