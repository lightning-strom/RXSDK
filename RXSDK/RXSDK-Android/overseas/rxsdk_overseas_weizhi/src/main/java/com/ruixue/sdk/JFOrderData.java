package com.ruixue.sdk;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/8/7
 */
public class JFOrderData extends OrderData {
    public static JFOrderData fromJson(String json) {
        return new Gson().fromJson(json, JFOrderData.class);
    }

}
