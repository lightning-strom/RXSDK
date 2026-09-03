package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

public class LDOrderData extends OrderData {

    @Keep
    private ExtBean ext;

    public ExtBean getExt() {
        return ext;
    }

    public static class ExtBean {
        public String orderId;
        public String amount;
        public String productid;
        public String productDesc;
        public String productName;
        public String roleId;
        public String roleName;
        public String serverId;
        public String serverName;
    }

    public static LDOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return new Gson().fromJson(jsonObj.toString(), LDOrderData.class);
        } else {
            return null;
        }
    }

}
