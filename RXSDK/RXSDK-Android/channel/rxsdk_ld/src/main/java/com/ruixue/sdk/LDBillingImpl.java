package com.ruixue.sdk;

import android.app.Activity;

import com.ld.sdk.LdPayInfo;
import com.ld.sdk.LdSdkManger;
import com.ld.sdk.account.api.PayCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LDBillingImpl extends BillingClient {
    public static final String LEIDIAN = "leidian";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, LEIDIAN);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap,
                                   JSONObject data, RXJSONCallback callback) {


        LDOrderData ldOrderData = LDOrderData.fromJson(data);

        LdPayInfo ldPayInfo = new LdPayInfo();
        ldPayInfo.orderId = ldOrderData.getExt().orderId; //游戏的支付订单号
        ldPayInfo.amount = ldOrderData.getExt().amount;//支付金额（整数单位：分）
        // 官方必填，默认值 12（v2.5.34 文档）
        String productId = ldOrderData.getExt().productid;
        ldPayInfo.productId = (productId == null || productId.isEmpty()) ? "12" : productId;
        ldPayInfo.productDesc = ldOrderData.getExt().productDesc;//商品描述
        ldPayInfo.productName = ldOrderData.getExt().productName;//商品名称
        ldPayInfo.roleId = ldOrderData.getExt().roleId;// 角色id
        ldPayInfo.roleName = ldOrderData.getExt().roleName;// 角色名字
        ldPayInfo.serverId = ldOrderData.getExt().serverId;// 服务器id
        ldPayInfo.serverName = ldOrderData.getExt().serverName;//服务器名字

        LdSdkManger.getInstance().showChargeView(activity, ldPayInfo, new PayCallback() {
            @Override
            public void paySuccess(String uid, String orderId, String time) {
                HashMap<String, Object> paySuccessMap = new HashMap<>();
                paySuccessMap.put("uid", uid);
                paySuccessMap.put("orderId", orderId);
                paySuccessMap.put("time", time);
                callback.onSuccess(JSONUtil.toJSONObject(paySuccessMap));
            }

            @Override
            public void payFail(String desc) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR.getValue(), desc));
            }

            @Override
            public void payCancel() {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "支付取消"));
            }
        });

    }
}
