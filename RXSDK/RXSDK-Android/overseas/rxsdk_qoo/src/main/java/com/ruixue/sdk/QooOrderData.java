package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

public class QooOrderData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }
    @Keep
    private ExtBean ext;

    @Keep
    public static class ExtBean {
        protected String third_tag;

        @Keep
        public String getThird_tag() {
            return third_tag;
        }

    }

    @Keep
    public static QooOrderData fromJson(String json) {
        return new Gson().fromJson(json, QooOrderData.class);
    }

    @Keep
    public static QooOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

}
