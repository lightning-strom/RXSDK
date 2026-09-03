package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

public class YofunData extends OrderData {

    @Keep
    public ExtBean getExt() {
        return ext;
    }
    @Keep
    private ExtBean ext;

    @Keep
    public static class ExtBean {
        protected String GoodsId;
        protected String GoodsName;
        protected int GoodsCount;
        protected int ActualPrice;
        protected String Currency;
        protected String NotifyUrl;
        protected String GameOrderId;
        protected int GoodsPrice;
        protected int OrderPrice;

        public String getGoodsId() {
            return GoodsId;
        }

        public void setGoodsId(String goodsId) {
            GoodsId = goodsId;
        }

        public String getGoodsName() {
            return GoodsName;
        }

        public void setGoodsName(String goodsName) {
            GoodsName = goodsName;
        }

        public int getGoodsCount() {
            return GoodsCount;
        }

        public void setGoodsCount(int goodsCount) {
            GoodsCount = goodsCount;
        }

        public int getActualPrice() {
            return ActualPrice;
        }

        public void setActualPrice(int actualPrice) {
            ActualPrice = actualPrice;
        }

        public String getCurrency() {
            return Currency;
        }

        public void setCurrency(String currency) {
            Currency = currency;
        }

        public String getNotifyUrl() {
            return NotifyUrl;
        }

        public void setNotifyUrl(String notifyUrl) {
            NotifyUrl = notifyUrl;
        }

        public String getGameOrderId() {
            return GameOrderId;
        }

        public void setGameOrderId(String gameOrderId) {
            GameOrderId = gameOrderId;
        }

        public int getGoodsPrice() {
            return GoodsPrice;
        }

        public void setGoodsPrice(int goodsPrice) {
            GoodsPrice = goodsPrice;
        }

        public int getOrderPrice() {
            return OrderPrice;
        }

        public void setOrderPrice(int orderPrice) {
            OrderPrice = orderPrice;
        }
    }

    public static YofunData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return new Gson().fromJson(jsonObj.toString(), YofunData.class);
        } else {
            return null;
        }
    }

}
