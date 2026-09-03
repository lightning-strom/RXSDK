package com.ruixue.plugin.unifypay;

import android.app.Activity;
import android.content.Intent;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.PluginPayManager;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.OrderData;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

class AUMSBillingImpl extends BillingClient {

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.pay(activity, hashMap, callback);
    }

    public void handleIntent(Intent intent) {
        UPPayWrapper.handleIntent(intent);
    }

    //requestCode 10
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        UPPayWrapper.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            OrderData orderData = OrderData.fromJson(data);
            @SuppressWarnings("unchecked") Map<String, Object> reqExtMap = (Map<String, Object>) hashMap.get("ext");
            if (null != reqExtMap && orderData != null) {
                if (hashMap.containsKey("plugin_name")) {
                    //银联插件支付
                    PluginPayManager.doPay(activity, hashMap, data, callback);
                } else {
//                    UPPayWrapper.pay(activity, (String) reqExtMap.get("hq_type"), Objects.requireNonNull(data.optJSONObject("ext"), "order ext null error!").toString(), callback);
                    UPPayWrapper.doPay(activity, hashMap , data, callback);
                }
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        } catch (Exception e) {
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }
}
