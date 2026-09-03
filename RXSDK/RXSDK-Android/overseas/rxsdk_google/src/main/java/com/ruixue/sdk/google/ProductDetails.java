package com.ruixue.sdk.google;

import androidx.annotation.Keep;

import com.google.gson.Gson;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/9
 */
public final class ProductDetails {
    // {
    //  "productId": "com.weile.bombchicken.1001",
    //  "type": "inapp",
    //  "title": "Diamonds * 10 (Bomb Chick)",
    //  "name": "Diamonds * 10",
    //  "description": "Spend $0.99 to get 10 diamonds",
    //  "price": "US$0.99",
    //  "price_amount_micros": 990000,
    //  "price_currency_code": "USD",
    //  "skuDetailsToken": "AEuhp4LA_ipgsu2acrjmJ8e3a3pPEXVnXLp_PH3woy4k-woeTkMjR2xEO0Rpaer3sKtR"
    //}
    @Keep
    private String productId;
    @Keep
    private String goods_tag;
    @Keep
    private String type;
    @Keep
    private String name;
    @Keep
    private String description;
    @Keep
    private String price;
    @Keep
    private long price_amount_micros;
    @Keep
    private String price_currency_code;
    @Keep
    private String skuDetailsToken;

    public String getGoods_tag() {
        return goods_tag;
    }

    public String getProductId() {
        return productId;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getPrice() {
        return price;
    }

    public long getPrice_amount_micros() {
        return price_amount_micros;
    }

    public String getPrice_currency_code() {
        return price_currency_code;
    }

    public String getSkuDetailsToken() {
        return skuDetailsToken;
    }

    public static ProductDetails fromJson(String jsonObj) {
        try {
            if (null != jsonObj) {
                return new Gson().fromJson(jsonObj, ProductDetails.class);
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
