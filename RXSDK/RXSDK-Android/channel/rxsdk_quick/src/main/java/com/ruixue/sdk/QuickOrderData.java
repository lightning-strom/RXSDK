package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.quicksdk.entity.OrderInfo;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

// Created by wangliang on 2024/11/22.
public class QuickOrderData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    private ExtBean ext;

    public static QuickOrderData fromJson(String json) {
        return new Gson().fromJson(json, QuickOrderData.class);
    }

    public static QuickOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public OrderInfo toOrderInfo() {
        OrderInfo info = new OrderInfo();
        if (ext != null) {
            info.setCpOrderID(ext.cpOrderNo);
            info.setGoodsID(ext.goodsId);
            info.setGoodsName(ext.subject);
            info.setGoodsDesc(ext.desc);
            info.setAmount(ext.amount);
            info.setGoodsDesc(ext.desc);
            info.setCount(1);
        }
        return info;
    }

    public static class ExtBean {
        String productCode;
        String cpOrderNo;
        String goodsId;
        String subject;
        double amount;
        String desc;

        public String getProductCode() {
            return productCode;
        }

        public String getCpOrderNo() {
            return cpOrderNo;
        }


        public double getAmount() {
            return amount;
        }

        public String getGoodsId() {
            return goodsId;
        }

        public String getSubject() {
            return subject;
        }

        public String getDesc() {
            return desc;
        }
    }
}
