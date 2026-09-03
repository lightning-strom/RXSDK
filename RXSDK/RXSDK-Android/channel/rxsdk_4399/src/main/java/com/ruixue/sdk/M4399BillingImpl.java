package com.ruixue.sdk;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

import java.util.Map;

import cn.m4399.operate.OperateCenter;
import cn.m4399.operate.Order;

public class M4399BillingImpl extends BillingClient {
    public static final String M4399 = "4399_mobilegame";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, M4399);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            M4399OrderData m4399OrderData = M4399OrderData.fromJson(data);
            OperateCenter mOpeCenter = OperateCenter.getInstance();
            mOpeCenter.recharge(activity,
                    // 充值金额，整数，单位元
                    new Order(m4399OrderData.getPrice() / 100, m4399OrderData.getOrderNo())
                            // 是否支持超出金额，默认不支持
                            .supportExcess(m4399OrderData.isSupport_excess())
                            // 商品名，可选，不传时认为商品名是游戏币
                            .commodity(m4399OrderData.getGoodsName()), new OperateCenter.OnRechargeFinishedListener() {
                        @Override
                        public void onRechargeFinished(boolean success, int resultCode, String msg) {
                            RXLogger.i("onRechargeFinished :"+resultCode);
                            if (success) {
                                callback.onSuccess(null);
                            } else if (resultCode == 1 || resultCode == 6001) {
                                callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(resultCode, msg));
                            } else {
                                callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(resultCode, msg));
                            }
                        }
                    });
        } catch (Exception e) {
            e.printStackTrace();
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }

    }
}
