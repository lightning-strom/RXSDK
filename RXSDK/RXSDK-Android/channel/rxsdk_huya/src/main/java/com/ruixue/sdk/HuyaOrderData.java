package com.ruixue.sdk;

import androidx.annotation.Keep;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * 虎牙联运支付参数，优先读取 ext 中的渠道字段。
 */
public class HuyaOrderData extends OrderData {

    @Keep
    @SerializedName("ext")
    private ExtBean ext;

    @Nullable
    public ExtBean getExt() {
        return ext;
    }

    public String resolveBizOrderId() {
        if (ext != null && notEmpty(ext.cpOrderId)) {
            return ext.cpOrderId;
        }
        if (notEmpty(getTradeNo())) {
            return getTradeNo();
        }
        return getOrderNo();
    }

    public String resolveProductId() {
        if (ext != null && notEmpty(ext.productId)) {
            return ext.productId;
        }
        return getGoodsTag();
    }

    public String resolveProductName() {
        if (ext != null && notEmpty(ext.productName)) {
            return ext.productName;
        }
        return getGoodsName();
    }

    public int resolveAmountFen() {
        if (ext != null && notEmpty(ext.money)) {
            try {
                return Integer.parseInt(ext.money);
            } catch (Exception ignore) {
                // fallback to parent order price
            }
        }
        return getPrice();
    }

    public String resolveBizSign() {
        if (ext != null && notEmpty(ext.bizSign)) {
            return ext.bizSign;
        }
        return "";
    }

    private static boolean notEmpty(String value) {
        return value != null && value.trim().length() > 0;
    }

    public static HuyaOrderData fromJson(String json) {
        return new Gson().fromJson(json, HuyaOrderData.class);
    }

    public static HuyaOrderData fromJson(JSONObject jsonObj) {
        if (jsonObj != null) {
            return fromJson(jsonObj.toString());
        }
        return null;
    }

    public static class ExtBean {
        @SerializedName(value = "cpOrderId", alternate = {"bizOrderId", "cp_order_id", "order_no", "trade_no"})
        String cpOrderId;
        @SerializedName(value = "productId", alternate = {"goodsTag", "goods_tag"})
        String productId;
        @SerializedName(value = "productName", alternate = {"goodsName", "goods_name"})
        String productName;
        @SerializedName(value = "money", alternate = {"amount", "price"})
        String money;
        @SerializedName(value = "bizSign", alternate = {"pay_sign", "paySign", "sign"})
        String bizSign;
    }
}
