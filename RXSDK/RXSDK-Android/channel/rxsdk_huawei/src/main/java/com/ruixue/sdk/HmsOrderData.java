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
public class HmsOrderData extends OrderData {

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

    public static HmsOrderData fromJson(String json) {
        return new Gson().fromJson(json, HmsOrderData.class);
    }

    public static HmsOrderData fromDeveloperPayload(String str) {
        HmsOrderData hmsOrderData = new HmsOrderData();
        hmsOrderData.ext = new ExtBean();
        try {
            if (!TextUtils.isEmpty(str)) {
                String[] dataArr = str.split(",");
                if (dataArr.length >= 3) {
                    hmsOrderData.orderNo = dataArr[0];
                    hmsOrderData.price = Integer.parseInt(dataArr[1]);
                    hmsOrderData.notify_url = dataArr[2];
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            hmsOrderData.parseState = -1;
        }
        return hmsOrderData;
    }

    public static HmsOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    @Override
    public String getNotifyUrl() {
        String url = super.getNotifyUrl();
        return url;
    }

    public static class ExtBean {
        @Keep
        protected String third_tag;


        public String getHw_tag() {
            return third_tag;
        }
    }
}
