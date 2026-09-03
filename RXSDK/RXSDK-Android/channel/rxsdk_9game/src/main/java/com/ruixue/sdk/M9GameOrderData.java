package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

// Created by wangliang on 2024/5/25.
public class M9GameOrderData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    private ExtBean ext;

    public static M9GameOrderData fromJson(String json) {
        return new Gson().fromJson(json, M9GameOrderData.class);
    }

    public static M9GameOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public static class ExtBean {
        String callbackInfo;
        String amount;
        String notifyUrl;
        String cpOrderId;
        String accountId;
        String signType;
        String sign;

        public String getCallbackInfo() {
            return callbackInfo;
        }

        public String getAmount() {
            return amount;
        }

        public String getNotifyUrl() {
            return notifyUrl;
        }

        public String getCpOrderId() {
            return cpOrderId;
        }

        public String getAccountId() {
            return accountId;
        }

        public String getSignType() {
            return signType;
        }

        public String getSign() {
            return sign;
        }
    }
}
