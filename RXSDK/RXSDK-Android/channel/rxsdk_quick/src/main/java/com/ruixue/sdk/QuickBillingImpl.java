package com.ruixue.sdk;


import android.app.Activity;

import com.quicksdk.Payment;
import com.quicksdk.QuickSDK;
import com.quicksdk.entity.GameRoleInfo;
import com.quicksdk.entity.OrderInfo;
import com.quicksdk.notifier.PayNotifier;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

/**
 * Created by wangliang on 2024/11/21
 */
public class QuickBillingImpl extends BillingClient {

    public static final String QUICK = "quick";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
//        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, QUICK);
//        }
        super.pay(activity, hashMap, callback);
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            QuickSDK.getInstance()// 设置支付通知(必接)
                    .setPayNotifier(new PayNotifier() {

                        @Override
                        public void onSuccess(String sdkOrderID, String cpOrderID, String extrasParams) {
                            RXLogger.d("quick pay success");
                            if (callback != null)
                                callback.onSuccess(null);
                        }

                        @Override
                        public void onCancel(String cpOrderID) {
                            RXLogger.d("quick pay cancel");
                            if (callback != null)
                                callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                        }

                        @Override
                        public void onFailed(String cpOrderID, String message, String trace) {
                            RXLogger.d("quick pay cpOrderID:" + cpOrderID + ", message:" + message + ", trace:" + trace);
                            if (callback != null)
                                callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(-1, message));
                        }
                    });

            GameRoleInfo gameRoleInfo = new GameRoleInfo();
            Map<String, Object> roleInfo = (Map<String, Object>) hashMap.get("game_role_info");
            if (roleInfo != null) {
                gameRoleInfo.setServerID((String) roleInfo.get("serverId"));
                gameRoleInfo.setServerName((String) roleInfo.get("serverName"));
                gameRoleInfo.setGameRoleName((String) roleInfo.get("gameRoleName"));
                gameRoleInfo.setGameRoleID((String) roleInfo.get("gameRoleId"));
                gameRoleInfo.setGameUserLevel((String) roleInfo.get("gameUserLevel"));
                gameRoleInfo.setVipLevel((String) roleInfo.get("vipLevel"));
                gameRoleInfo.setGameBalance((String) roleInfo.get("gameBalance"));
                gameRoleInfo.setPartyName((String) roleInfo.get("partyName"));
                gameRoleInfo.setRoleCreateTime((String) roleInfo.get("roleCreateTime"));
            }
            OrderInfo orderInfo = QuickOrderData.fromJson(data).toOrderInfo();
            Payment.getInstance().pay(activity, orderInfo, gameRoleInfo);
        } catch (Exception e) {
            RXLogger.e(e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR));
            }
        }
    }
}
