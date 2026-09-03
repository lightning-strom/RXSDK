package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.ruixue.utils.EntityUtils;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/5
 */
public class OppoConfig {

    @Keep
    public String appSecret;
    @Keep
    public String app_secret;

    public OppoConfig() {
    }

    public OppoConfig(@NonNull String appSecret) {
        this.appSecret = appSecret;
    }

    public static OppoConfig fromMap(Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, OppoConfig.class);
    }

    public boolean checkParams() {
        return  !TextUtils.isEmpty(appSecret) || !TextUtils.isEmpty(app_secret);
    }

    public String getAppSecret() {
        if (TextUtils.isEmpty(appSecret)) {
            return app_secret;
        } else {
            return appSecret;
        }
    }
}
