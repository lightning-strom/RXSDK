package com.ruixue.sdk.apkpure;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

@Keep
public class ApkpureOrderData extends OrderData {

    @Keep
    private ExtBean ext;

    @Keep
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    public static class ExtBean {
        /**
         * 与 VGamePop 控制台 SKU 一致。
         * <p>
         * 服务端下单 JSON 主力字段名为 {@code third_tag}；若仅有 {@code product_id}，
         * Gson 会通过 {@link com.google.gson.annotations.SerializedName#alternate()} 写入本字段。
         */
        @Keep
        @SerializedName(value = "third_tag", alternate = {"product_id"})
        protected String third_tag;
        @Keep
        protected int foreign_price;

        /**
         * 等同于 RuStore/apkpure 收银台所需的商品 ID（来自 {@code third_tag} 或 {@code product_id}）。
         */
        @Keep
        public String getProductId() {
            return third_tag;
        }

        @Keep
        public int getForeignPrice() {
            return foreign_price;
        }
    }

    @Keep
    public static ApkpureOrderData fromJson(String json) {
        return new Gson().fromJson(json, ApkpureOrderData.class);
    }

    @Keep
    public static ApkpureOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }
}
