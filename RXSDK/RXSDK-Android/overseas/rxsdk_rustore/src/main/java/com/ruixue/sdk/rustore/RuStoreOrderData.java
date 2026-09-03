package com.ruixue.sdk.rustore;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

@Keep
public class RuStoreOrderData extends OrderData {

    @Keep
    private ExtBean ext;

    @Keep
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    public static class ExtBean {
        protected String third_tag;

        @Keep
        public String getThird_tag() {
            return third_tag;
        }
    }

    @Keep
    public static RuStoreOrderData fromJson(String json) {
        return new Gson().fromJson(json, RuStoreOrderData.class);
    }

    @Keep
    public static RuStoreOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        }
        return null;
    }
}
