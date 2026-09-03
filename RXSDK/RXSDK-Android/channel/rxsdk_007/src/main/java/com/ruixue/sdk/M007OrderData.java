package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

// Created by wangliang on 2024/5/25.
public class M007OrderData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    private ExtBean ext;

    public static M007OrderData fromJson(String json) {
        return new Gson().fromJson(json, M007OrderData.class);
    }

    public static M007OrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public static class ExtBean {
        String cpOrderId;
        String productId;
        String productName;
        String money;

        public String getCpOrderId() {
            return cpOrderId;
        }

        public String getProductId() {
            return productId;
        }

        public String getProductName() {
            return productName;
        }

        public String getMoney() {
            return money;
        }
    }
}
