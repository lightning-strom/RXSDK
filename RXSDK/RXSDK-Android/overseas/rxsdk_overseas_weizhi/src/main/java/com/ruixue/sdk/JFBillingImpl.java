package com.ruixue.sdk;

import android.app.Activity;

import com.juefeng.sdk.juefengsdk.JFSDK;
import com.juefeng.sdk.juefengsdk.services.bean.JfOrderInfo;
import com.juefeng.sdk.juefengsdk.services.bean.JfRoleInfo;
import com.juefeng.sdk.juefengsdk.services.bean.PayFaildInfo;
import com.juefeng.sdk.juefengsdk.services.bean.PaySuccessInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/8/7
 */
public class JFBillingImpl extends BillingClient {
    RXJSONCallback callback;
    JfRoleInfo jfRoleInfo;

    public void setJfRoleInfo(JfRoleInfo jfRoleInfo) {
        this.jfRoleInfo = jfRoleInfo;
    }


    public void onPaySuccessCallback(PaySuccessInfo paySuccessInfo) {
        if (null != callback) {
            callback.onSuccess(new JSONObject());
        }
    }


    public void onPayFaildCallback(PayFaildInfo payFaildInfo) {
        if (null != callback) {
            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(payFaildInfo.getCode(), payFaildInfo.getMsg()));
        }
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        this.callback = callback;
        JFOrderData od = JFOrderData.fromJson(data.toString());
        JfOrderInfo orderInfo = new JfOrderInfo();
        orderInfo.setCpOrderId(od.getOrderNo());
        orderInfo.setGoodsDes(od.getGoodsName());
        orderInfo.setGoodsName(od.getGoodsName());
        orderInfo.setGoodsId(od.getGoodsTag());
        orderInfo.setRemark(od.getTransmitArgs());
        orderInfo.setPrice(String.valueOf(od.getPrice()));
        if (jfRoleInfo != null) {
            orderInfo.setLevel(jfRoleInfo.getGameRoleLevel());
            orderInfo.setRoleId(jfRoleInfo.getRoleId());
            orderInfo.setRoleName(jfRoleInfo.getRoleName());
            orderInfo.setServerId(jfRoleInfo.getServerId());
            orderInfo.setServerName(jfRoleInfo.getServerName());
            orderInfo.setVip(String.valueOf(jfRoleInfo.getVipLevel()));
        }
        JFSDK.getInstance().showPay(activity, orderInfo);
    }
}
