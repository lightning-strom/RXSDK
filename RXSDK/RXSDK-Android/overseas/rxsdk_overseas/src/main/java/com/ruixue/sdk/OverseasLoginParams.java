package com.ruixue.sdk;

import androidx.annotation.Keep;
import androidx.annotation.StringDef;

import com.ruixue.utils.EntityUtils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/5
 */
public class OverseasLoginParams {

    public static final String GOOGLE = "google";
    public static final String FACEBOOK = "facebook";
    public static final String VK = "vk";

    @StringDef({GOOGLE, FACEBOOK, VK})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LoginMethodDef {
    }

    @Keep
    private String method;
    @Keep
    public String clientId;

    public String getMethod() {
        return method;
    }


    public static OverseasLoginParams fromMap(Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, OverseasLoginParams.class);
    }
}
