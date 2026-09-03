package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.brsdk.android.bean.BRSdkPay;
import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.billing.OrderData;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.LoginData;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2026/1/5
 */
public class XTOrderData extends OrderData {


    public static XTOrderData fromJson(String json) {
        return new Gson().fromJson(json, XTOrderData.class);
    }

    public static XTOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    @Keep
    private ExtBean ext;

    public ExtBean getExt() {
        return ext;
    }

    public static class ExtBean {
        @Keep
        private String third_tag;
        private String currency_name;
        private String exchange_rate = "1";

    }

    public BRSdkPay toBRSdkPay(Map<String, Object> hashMap) {
        LoginData loginData = RuiXueSdk.getLoginData();

        return new BRSdkPay()
                // 支付数据
                .setExtInfo(transmit_args) // 透传参数
                .setProductId(getExt().third_tag) // 商品ID
                .setProductName(getGoodsName()) // 商品名
                .setProductDesc("") // 商品描述
                .setProductCount("1") // 商品数量
                .setProductPrice(price) // 商品总金额(分)
                .setCurrencyName(getExt().currency_name) // 货币名称
                .setExchangeRate(getExt().exchange_rate) // 充值转换(1元=N元宝/金币等)
                // 角色信息
                .setRoleName(RXGlobalData.getGameRoleId()) // 角色名
                .setServerId(RXGlobalData.getGameRegionTag()) // 服务器ID
                .setServerName("default"); // 服务器名
    }

}
