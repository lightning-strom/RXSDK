package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;
import org.json.JSONObject;

public class VivoOrderData extends OrderData {

    @Keep
    private ExtBean ext;

    public ExtBean getExt() {
        return ext;
    }

    public static class ExtBean {
        @Keep
        private String appId;
        @Keep
        private String cpOrderNumber;
        @Keep
        private String notifyUrl;
        @Keep
        private String orderAmount;
        @Keep
        private String productDesc;
        @Keep
        private String productName;
        @Keep
        private String sign;
        @Keep
        private String extInfo = "";

        public String getAppId() {
            return appId;
        }

        /**
         *  游戏生成订单号
         * @return
         */
        public String getCpOrderNumber() {
            return cpOrderNumber;
        }

        /**
         * 需修改 商户透传参数 可以通过vivo服务器发给游戏服务器
         * @return
         */
        public String getExtInfo() {
            return extInfo;
        }

        /**
         * 回调地址 商户指定的回调url，支付成功后vivo会向此url通知支付结果。建议传，以保证支付结果准确。
         */
        public String getNotifyUrl() {
            return notifyUrl;
        }

        public String getOrderAmount() {
            return orderAmount;
        }

        public String getProductDesc() {
            return productDesc;
        }

        public String getProductName() {
            return productName;
        }

        public String getSign() {
            return sign;
        }
    }

    public static VivoOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return new Gson().fromJson(jsonObj.toString(), VivoOrderData.class);
        } else {
            return null;
        }
    }
}
