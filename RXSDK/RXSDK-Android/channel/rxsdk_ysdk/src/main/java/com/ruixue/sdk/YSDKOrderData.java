package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/22
 */
public class YSDKOrderData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }
    @Keep
    private ExtBean ext;

    public static YSDKOrderData fromJson(String json) {
        return new Gson().fromJson(json, YSDKOrderData.class);
    }

    public static YSDKOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    //{"productNum":1,"balance":0,"orderId":"22071447852689","zoneId":1,"productName":"bytest","productDesc":"bytest","amount":0}}
    public static class ExtBean {
        /**
         * ysdk 金额（单位角）
         */
        @Keep
        private int amount;
        @Keep
        private int balance;
        @Keep
        private String orderId;
        @Keep
        private String productDesc;
        @Keep
        private String productName;
        @Keep
        private int productNum;
        @Keep
        private int zoneId;
        @Keep
        private String goodsTokenUrl;

        public String getGoodsTokenUrl() {
            return goodsTokenUrl;
        }
        /**
         * @return 充值游戏币数量 （单位角）
         */

        @Keep
        public int getAmount() {
            return amount;
        }

        @Keep
        public int getBalance() {
            return balance;
        }


        @Keep
        public String getOrderId() {
            return orderId;
        }

        @Keep
        public String getProductDesc() {
            return productDesc;
        }

        @Keep
        public String getProductName() {
            return productName;
        }

        @Keep
        public int getProductNum() {
            return productNum;
        }

        /**
         * @return ⼤区id
         */
        @Keep
        public int getZoneId() {
            return zoneId;
        }
    }
}
