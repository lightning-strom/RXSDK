package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.nearme.game.sdk.common.model.biz.ChannelSkuInfo;
import com.nearme.game.sdk.common.model.biz.PayInfo;

import org.json.JSONObject;

import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class OppoOverseasOrderData {
    @Keep
    protected String order;
    @Keep
    protected String attach; // 非必填,自定义回调字段
    @Keep
    protected int amount; // 消费总金额
    @Keep
    protected String productName; // 商品名
    @Keep
    protected String productDesc; // 商品描述
    @Keep
    protected String callbackUrl; // 回调地址
    @Keep
    protected int type; // 支付类型（目前只支持TYPE_NOARMAL_PAY）
    @Keep
    protected String currency; // 非必填：统一用美元定价时必须填，而且只能填USD，如果不是请不要填。
    @Keep
    protected List<ChannelSkuInfo> channelSkuInfos;

    public static OppoOverseasOrderData fromJson(String json) {
        return new Gson().fromJson(json, OppoOverseasOrderData.class);
    }

    public static OppoOverseasOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public PayInfo toPayInfo() {
        // CP 支付参数
        PayInfo payInfo = new PayInfo(order, attach, amount);
        payInfo.setProductName(productName);
        payInfo.setProductDesc(productDesc);
        payInfo.setCallbackUrl(callbackUrl);
        payInfo.setType(PayInfo.TYPE_NOARMAL_PAY);
        payInfo.setCurrency(currency);
        payInfo.setChannelSkuInfos(channelSkuInfos);
        return payInfo;
    }


}
