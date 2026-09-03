package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.bytedance.ttgame.tob.optional.union.api.pay.PayInfo;
import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class GBOrderData extends OrderData {

    @Keep
    private String productName;
    @Keep
    private String productDesc;


    public void setGoodsTag(String goodsTag) {
        this.goodsTag = goodsTag;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProductDesc(String productDesc) {
        this.productDesc = productDesc;
    }

    public String getProductName() {
        return TextUtils.isEmpty(productName) ? goodsName : productName;
    }

    public String getProductDesc() {
        return TextUtils.isEmpty(productDesc) ? getProductName() : productDesc;
    }



    public static GBOrderData fromJson(String json) {
        return new Gson().fromJson(json, GBOrderData.class);
    }

    public static GBOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    //sdkOpenId;// 登录成功之后的sdkOpenId，可以在登录验证接口获取
//    public String cpOrderId;// 订单id，长度限制为80字节；
//    public String sdkOpenId;// 登录成功之后的sdkOpenId，可以在登录验证接口获取
//    public int amountInCent; // 金额，单位分
//    public String productId; // 商品id，长度限制为80字节
//    public String productName; // 商品名称，长度限制为100字节，注：需体现所购买商品名称和数量
//    public String productDesc; // 商品描述，长度限制为20字节
//    public String callbackUrl; // 回调地址   CP上送即可，不需要另外单独配置（必填）
//    public String extraInfo; // 游戏自定义信息，长度限制为255字节
    public PayInfo toPayInfo(@NonNull String sdkOpenId) {
        PayInfo payInfo = new PayInfo();
        payInfo.setAmountInCent(price);
        payInfo.setCallbackUrl(getNotifyUrl());
        payInfo.setCpOrderId(orderNo);
        payInfo.setExtraInfo(getTransmitArgs());
        payInfo.setProductDesc(getProductDesc());
        payInfo.setProductId(goodsTag);
        payInfo.setProductName(getProductName());
        payInfo.setSdkOpenId(sdkOpenId);
        return payInfo;
    }
}
