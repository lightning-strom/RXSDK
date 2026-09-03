package com.ruixue.sdk.catappult;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/4/18
 */
public class CatappultOrderData extends OrderData {

    public int getParseState() {
        return parseState;
    }

    private int parseState = 0;
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    protected ExtBean ext;

    public static class ExtBean {
        public String getSku() {
            return third_tag;
        }
        public String getOrigin() {
            return origin;
        }

        @Keep
        protected String third_tag;
        protected String origin="BDS";

    }  public String toDeveloperPayload() {
        StringBuilder sb = new StringBuilder();
        sb.append(getOrderNo()).append(",").append(getPrice()).append(",").append(getNotifyUrl());
        return sb.toString();
    }

    public static CatappultOrderData fromDeveloperPayload(String str) {
        CatappultOrderData orderData = new CatappultOrderData();
        orderData.ext = new ExtBean();
        try {
            if (!TextUtils.isEmpty(str)) {
                String[] dataArr = str.split(",");
                if (dataArr.length >= 3) {
                    orderData.orderNo = dataArr[0];
                    orderData.price = Integer.parseInt(dataArr[1]);
                    orderData.notify_url = dataArr[2];
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            orderData.parseState = -1;
        }
        return orderData;
    }

    public static CatappultOrderData fromJson(String json) {
        return new Gson().fromJson(json, CatappultOrderData.class);
    }

    public static CatappultOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }
}
