package com.ruixue.sdk;

import android.text.TextUtils;

import com.google.gson.Gson;
import com.nearme.game.sdk.common.model.biz.PayInfo;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class OppoOrderData extends OrderData {

    public static OppoOrderData fromJson(String json) {
        return new Gson().fromJson(json, OppoOrderData.class);
    }

    public static OppoOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public PayInfo toPayInfo() {
        // CP 支付参数
        int amount = 1; // 支付金额，单位分
        PayInfo payInfo = new PayInfo(
                getOrderNo(),
                getTransmitArgs(),
                getPrice()
        );
        payInfo.setProductDesc("");
        String productName = TextUtils.isEmpty(getGoodsName()) ? "购买商品" : getGoodsName();
        payInfo.setProductName(productName);
//		payInfo.setType(PayInfo.TYPE_AUTO_ORDER_ALIPAY);

        payInfo.setCallbackUrl(getNotifyUrl());
        return payInfo;
    }


}
