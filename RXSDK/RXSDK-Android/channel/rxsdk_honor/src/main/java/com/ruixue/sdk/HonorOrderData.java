package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/25
 */
public class HonorOrderData extends OrderData {
    public HonorOrderData() {
        ext = new ExtBean();
    }

    public HonorOrderData(String str) {
        ext = new ExtBean();
        try {
            if (!TextUtils.isEmpty(str)) {
                String[] dataArr = str.split(",");
                if (dataArr.length >= 3) {
                    this.orderNo = dataArr[0];
                    this.price = Integer.parseInt(dataArr[1]);
                    this.notify_url = dataArr[2];
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            this.parseState = -1;
        }
    }

    public int getParseState() {
        return parseState;
    }

    public int getPriceType() {
        return priceType;
    }

    public int parseState = 0;
    /**
     * 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
     */
    @Keep
    protected int priceType = 0;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    protected String currency;

    public int getEnv() {
        return env > 0 ? env : getExt().env;
    }

    //0 正式 1 沙盒
    protected int env = 0;

    public ExtBean getExt() {
        return ext;
    }

    @Keep
    protected ExtBean ext;

    public String toJson() {
        return new Gson().toJson(this);
    }

    public String toDeveloperPayload() {
        StringBuilder sb = new StringBuilder();
        sb.append(getOrderNo()).append(",").append(getPrice()).append(",").append(getNotifyUrl());
        return sb.toString();
    }

    public static HonorOrderData fromJson(String json) {
        return new Gson().fromJson(json, HonorOrderData.class);
    }

    public static HonorOrderData fromDeveloperPayload(String str) {
        return new HonorOrderData(str);
    }

    public static HonorOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    @Override
    public String getNotifyUrl() {
        return super.getNotifyUrl();
    }

    @Keep
    public class ExtBean {
        @Keep
        protected String third_tag;
        protected Long amount;
        protected int env = 0;

        protected String productName;

        public String getCurrency() {
            return currency;
        }

        protected String currency;

        public Long getPrice() {
            return amount > 0 ? amount : price;
        }

        public boolean isPrice() {
            return is_price;
        }

        @Keep
        protected boolean is_price;

        public String getTag() {
            return third_tag;
        }
    }
}
