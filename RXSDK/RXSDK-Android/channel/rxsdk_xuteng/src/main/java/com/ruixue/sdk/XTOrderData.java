package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.xut.sdk.channel.entity.OrderInfo;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2026/1/5
 */
public class XTOrderData extends OrderData {


    public static XTOrderData fromJson(String json) {
        return new Gson().fromJson(json, XTOrderData.class);
    }

    public static XTOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    @Keep
    private ExtBean ext;

    public ExtBean getExt() {
        return ext;
    }

    //"amount":100,"extension":"2601163735121228v1","orderId":"2601163735121228v1","productId":"bytest","productName":"bytest"
    public static class ExtBean {

        @Keep
        private String productId;
        @Keep
        private String productName;
        private long amount;
        private String extension;


    }

    public OrderInfo toOrderInfo(Map<String, Object> hashMap) {
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.orderId = orderNo;
        orderInfo.productId = getExt() != null && getExt().productId != null ? getExt().productId : goodsTag;
        orderInfo.productName = getExt() != null && getExt().productName != null ? getExt().productName : goodsName;
        orderInfo.amount = getExt() != null && getExt().amount > 0 ? getExt().amount : price;
        orderInfo.serverId = TextUtils.isEmpty(RXGlobalData.getGameRegionTag()) ? "1" : RXGlobalData.getGameRegionTag();
        orderInfo.serverName = hashMap.get("server_name") == null ? "1" : (String) hashMap.get("server_name");
        orderInfo.roleId = TextUtils.isEmpty(RXGlobalData.getGameRoleId()) ? "1" : RXGlobalData.getGameRoleId();
        orderInfo.roleName =hashMap.get("role_name") == null ? "1" : (String) hashMap.get("role_name");
        orderInfo.extension = getExt() != null && getExt().extension != null ? getExt().extension : transmit_args;
        orderInfo.playerId = (String) hashMap.get("openid");
        RXLogger.d("orderInfo:" + new Gson().toJson(orderInfo));
        return orderInfo;


    }

}
