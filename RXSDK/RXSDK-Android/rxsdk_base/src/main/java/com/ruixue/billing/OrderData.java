package com.ruixue.billing;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import org.json.JSONObject;

import java.io.Serializable;

/*  {
 "code": 0,
 "data": {
   "amount": 600,
   "goodsTag": "com.mzone.test.1001",
   "google_tag": "com.mzone.test.1001",
   "notify_url": "https://rxapi.weilestar.com/Ke/Callback/ClientBack/1002/googleplay",
   "orderNo": "22030253849643",
   "hq_type": "google",
   "tradeNo": "1646202818572",
   "usd_amount": 99
 }
}*/
public class OrderData implements Serializable {
    /**
     * 金额 （单位分）
     */
    @SerializedName(value = "amount", alternate = { "price" })
    @Keep
    protected int price;

    // 出现任意一个时均可以得到正确的结果。
    // 注：当多种情况同时出时，以最后一个出现的值为准。
    @SerializedName(value = "goods_tag", alternate = { "goodsTag" })
    @Keep
    protected String goodsTag;

    @SerializedName(value = "goods_name", alternate = { "goodsName" })
    @Keep
    protected String goodsName;

    /**
     * 订单号
     */
    @SerializedName(value = "orderNo", alternate = { "order_no" })
    @Keep
    protected String orderNo;

    /**
     * 商户订单号
     */
    @SerializedName(value = "tradeNo", alternate = { "trade_no" })
    @Keep
    protected String tradeNo;

    @SerializedName(value = "hq_type")
    @Keep
    protected String hq_type;

    @SerializedName(value = "notify_url", alternate = { "notifyUrl" })
    @Keep
    protected String notify_url;

    /**
     * 订单类型；订阅支付为 {@code subscribe}，与 iOS / 服务端约定一致
     */
    @SerializedName("order_type")
    @Keep
    protected String order_type;

    /**
     * cp 透传参数
     */
    @Keep
    protected String transmit_args;

    public String getGoodsName() {
        return goodsName;
    }

    public String getGoodsTag() {
        return goodsTag;
    }

    public String getNotifyUrl() {
        return notify_url;
    }

    /**
     * @return 客户端透传参数 (不超过500个字符)
     */
    public String getTransmitArgs() {
        return transmit_args;
    }

    /**
     * @return 金额 （单位分）
     */
    public int getPrice() {
        return price;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public String getHQType() {
        return hq_type;
    }

    public String getTradeNo() {
        return tradeNo;
    }

    /**
     * 是否为订阅类订单（服务端下单返回 order_type = subscribe）
     */
    @Keep
    public boolean isSubscribe() {
        return order_type != null && "subscribe".equalsIgnoreCase(order_type.trim());
    }

    public void setOrderType(String orderType) {
        this.order_type = orderType;
    }

    public static OrderData fromJson(String json) {
        return new Gson().fromJson(json, OrderData.class);
    }

    public static OrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

}
