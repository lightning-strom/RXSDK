package com.ruixue.sdk;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

import cn.gundam.sdk.shell.open.OrderInfo;
import cn.gundam.sdk.shell.param.SDKParamKey;
import cn.gundam.sdk.shell.param.SDKParams;
import cn.uc.gamesdk.UCGameSdk;

// Created by wangliang on 2024/4/30.
public class M9GameBillingImpl extends BillingClient {
public static final String M9GAME = "jiuyou";
    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE,  M9GAME);
        }
        super.pay(activity, hashMap, callback);
    }

    private RXJSONCallback mPayCallback;

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            M9GameOrderData orderData = M9GameOrderData.fromJson(data);
            if (orderData == null || orderData.getExt() == null) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR));
                }
                return;
            }

            M9GameOrderData.ExtBean ext = orderData.getExt();
            SDKParams params = new SDKParams();
            params.put(SDKParamKey.CALLBACK_INFO, ext.getCallbackInfo());
            params.put(SDKParamKey.NOTIFY_URL, ext.getNotifyUrl());
            params.put(SDKParamKey.AMOUNT, ext.getAmount());
            params.put(SDKParamKey.CP_ORDER_ID, ext.getCpOrderId());
            params.put(SDKParamKey.ACCOUNT_ID, ext.getAccountId());
            params.put(SDKParamKey.SIGN_TYPE, ext.getSignType());
            params.put(SDKParamKey.SIGN, ext.getSign());

            mPayCallback = callback;
            UCGameSdk.defaultSdk().pay(activity, params);
        } catch (Exception e) {
            RXLogger.e(e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR));
            }
            mPayCallback = null;
        }
    }

    public void onPaySucc(OrderInfo orderInfo) {
        if (mPayCallback != null) {
            try {
                RXLogger.i("此处为订单生成回调，客户端无支付成功回调，订单是否成功已服务端回调为准");
                JSONObject json = new JSONObject();
                json.put("orderId", orderInfo.getOrderId());
                json.put("orderAmount", orderInfo.getOrderAmount());
                json.put("payWay", orderInfo.getPayWay());
                json.put("payWayName", orderInfo.getPayWayName());
                mPayCallback.onSuccess(json);
            } catch (Exception e) {
                e.printStackTrace();
            }
            mPayCallback = null;
        }
    }

    public void onPayUserExit(OrderInfo orderInfo) {
        if (mPayCallback != null) {
            mPayCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL));
            mPayCallback = null;
        }
    }
}
