package com.ruixue.yeepay;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.ruixue.wechat.WXShareObject;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/9/6
 */
public class YeePayParamsExt {
    String miniProgramOrgId;
    String code;
    String message;
    String orderId;
    String uniqueOrderNo;
    String miniProgramPath;
    String prePayTn;

    String appId;
    public void setAppId(String appId) {
        this.appId = appId;
    }

    public static YeePayParamsExt fromJSONObject(@NonNull JSONObject jsonObject) {
        return new Gson().fromJson(jsonObject.toString(), YeePayParamsExt.class);
    }

    public WXShareObject toWxObject() {

        WXShareObject.Builder builder = new WXShareObject.Builder();
        builder.setAppid(appId);
        builder.setPath(prePayTn);
        builder.setUsername(miniProgramOrgId);
        return builder.build();
    }
}
