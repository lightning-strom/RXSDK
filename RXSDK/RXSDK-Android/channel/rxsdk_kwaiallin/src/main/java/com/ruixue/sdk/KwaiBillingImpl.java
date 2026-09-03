package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.kwai.sdk.KwaiPayResultListener;
import com.kwai.sdk.KwaiSdk;
import com.kwai.sdk.subbus.pay.model.KwaiPayInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class KwaiBillingImpl extends BillingClient {

    public static final String KSLY = "ksly";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null) {
            if (!hashMap.containsKey(KEY_HQ_TYPE)) {
                hashMap.put(KEY_HQ_TYPE, KSLY);
            }
            @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
            if (extMap == null) {
                extMap = new HashMap<>();
            }
//        if (hashMap.containsKey("ext")) {
//            extMap.putAll((Map<? extends String, ?>) hashMap.get("ext"));
//        }
            String channelId = KwaiSdk.getChannel();
            String gameId = KwaiSdk.getGameId();
            if (!TextUtils.isEmpty(channelId)) {
                extMap.put("channel_id", channelId);
            }
            if (!TextUtils.isEmpty(gameId)) {
                extMap.put("game_id", gameId);
            }
            if (hashMap.containsKey("role_id")) {
                extMap.put("role_id", hashMap.get("role_id"));
                hashMap.remove("role_id");
            }
            if (hashMap.containsKey("role_name")) {
                extMap.put("role_name", hashMap.get("role_name"));
                hashMap.remove("role_name");
            }
            if (hashMap.containsKey("role_level")) {
                extMap.put("role_level", hashMap.get("role_level"));
                hashMap.remove("role_level");
            }
            if (hashMap.containsKey("server_id")) {
                extMap.put("server_id", hashMap.get("server_id"));
                hashMap.remove("server_id");
            }
            if (hashMap.containsKey("server_name")) {
                extMap.put("server_name", hashMap.get("server_name"));
                hashMap.remove("server_name");
            }
            extMap.put("currency_type", hashMap.containsKey("currency_type") ? hashMap.get("currency_type") : "CNY");

            hashMap.put("ext", extMap);
        }
        super.pay(activity, hashMap, callback);
    }


    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        KwaiOrderData orderData = KwaiOrderData.fromJson(data);
        if (orderData != null) {
            KwaiPayInfo info = orderData.toKwaiPayInfo();
            KwaiSdk.pay(info, new KwaiPayResultListener() {
                @Override
                public void onPayFailed(DataFailed dataFailed) {
                    if (callback != null) {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(dataFailed.errcode, dataFailed.msg));
                    }
                }

                @Override
                public void onPaySucceed(DataSucceed dataSucceed) {
                    callback.onSuccess(JSONUtil.toJSONObject(0, new Gson().toJson(dataSucceed)));
                }
            });
        } else if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }


}
