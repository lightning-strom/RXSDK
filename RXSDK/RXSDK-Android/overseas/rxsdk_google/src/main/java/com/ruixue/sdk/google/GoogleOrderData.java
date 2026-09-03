package com.ruixue.sdk.google;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
@Keep
public class GoogleOrderData extends OrderData {
    @Keep
    public ExtBean getExt() {
        return ext;
    }
    @Keep
    private ExtBean ext;

    @Keep
    public static class ExtBean {
        protected String third_tag;
        protected int foreign_price;
        @SerializedName(value = "order_type", alternate = {"orderType"})
        protected String order_type;

        @Keep
        public String getThird_tag() {
            return third_tag;
        }

        @Keep
        public int getForeign_price() {
            return foreign_price;
        }

        @Keep
        public String getOrderType() {
            return order_type;
        }
    }

    /**
     * 服务端顶层 order_type 优先，其次兼容 ext.order_type=subscribe 的场景。
     */
    @Override
    @Keep
    public boolean isSubscribe() {
        if (super.isSubscribe()) {
            return true;
        }
        return ext != null
                && ext.getOrderType() != null
                && "subscribe".equalsIgnoreCase(ext.getOrderType().trim());
    }

    @Keep
    public boolean hasServerOrderType() {
        if (order_type != null && !order_type.trim().isEmpty()) {
            return true;
        }
        if (ext != null) {
            String extType = ext.getOrderType();
            return extType != null && !extType.trim().isEmpty();
        }
        return false;
    }

    @Keep
    public static GoogleOrderData fromJson(String json) {
        return new Gson().fromJson(json, GoogleOrderData.class);
    }

    @Keep
    public static GoogleOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }
}
