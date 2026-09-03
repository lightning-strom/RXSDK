package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import com.bsgamesdk.android.callbacklistener.BSGameSdkError;
import com.bsgamesdk.android.callbacklistener.OrderCallbackListener;
import com.gsc.pub.GSCPubCommon;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class BiliBiliBillingImpl extends BillingClient {
    public static final String BILIBILI = "bilibili";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, BILIBILI);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            BiliBiliOrderData orderData = BiliBiliOrderData.fromJson(data);
            if (orderData != null && orderData.getExt() != null) {
                BiliBiliOrderData.ExtBean biliData = orderData.getExt();
                String userName = biliData.getBili_username();
                String uid = biliData.getBili_uid();
                String nickname = biliData.getBili_role();
                String notify_url = orderData.getNotifyUrl(); //不为空的话支付后异步通知到此地址，否则异步通知到正式地址，此字段可用于沙盒支付，正式上线前请置空
                String out_trade_number = biliData.getOut_trade_no();
                /* 注意这里fee是以分为单位的，以元为单位换算时要先除以100.0 */
                int total_fee = biliData.getTotal_fee();
                int gameMoney = biliData.getGame_money();
                if (gameMoney <= 0) {
                    throw new IllegalArgumentException("game_money can't be less than 0");
                }
                if (TextUtils.isEmpty(uid)) {
                    throw new IllegalArgumentException("bili_uid can't be empty or null");
                }

                //秘钥为服务端secretKey
                String order_sign = biliData.getOrder_sign();// MD5.sign(sinData, secret_key);

                GSCPubCommon.getInstance().pay(Long.parseLong(uid), userName, nickname, biliData.getBili_server_id(), total_fee, gameMoney, out_trade_number, biliData.getSubject(), biliData.getBody(), orderData.getTransmitArgs(), notify_url, order_sign, new OrderCallbackListener() {
                    @Override
                    public void onSuccess(final String out_trade_no, final String bs_trade_no) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("bs_trade_no", bs_trade_no);
                        map.put("out_trade_no", out_trade_no);
                        map.put("code", RXErrorCode.SUCCESS.getValue());
                        callback.onSuccess(new JSONObject(map));
                    }

                    @Override
                    public void onFailed(final String out_trade_no, final BSGameSdkError bsGameSdkError) {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()+",tradeno:"+out_trade_no));
                    }

                    @Override
                    public void onError(final String out_trade_no, final BSGameSdkError bsGameSdkError) {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()+",tradeno:"+out_trade_no));
                    }
                });
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        } catch (Exception e) {
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }

    }
}
