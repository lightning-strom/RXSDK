package com.ruixue.openapi;

import com.ruixue.reflect.BaseReflectClass;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/3/10
 */
public class RXSdkAnalytics extends BaseReflectClass {
    static class Single {
        final static RXSdkAnalytics INSTANCE = new RXSdkAnalytics();
    }

    public static RXSdkAnalytics getInstance() {
        return Single.INSTANCE;
    }

    private String method = "client";
    private ISdkEvent sdkEvent;
    //"advertise_channel" : {
    //        "oceanengine" : {
    //            "appid" : "appid",
    //            "channel_id" : "channel_id",
    //        }
    //    }
    private JSONObject advertiseChannel;

    RXSdkAnalytics() {
        this.sdkEvent = getEventImpl();
    }


    private ISdkEvent getEventImpl() {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.sdk.bytedancelog.BytedanceLogWrapper");
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                return (ISdkEvent) msd.invoke(null);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ignore) {
            }
        }
        return null;
    }


    public String getMethod() {
        return method;
    }

    public boolean isClientReport() {
        return "client".equalsIgnoreCase(getMethod()) && needReport();
    }

    public void onInit(JSONObject advertiseChannel, JSONObject websocketConfig) {
        this.advertiseChannel = advertiseChannel;
        if (websocketConfig != null) {
            this.method = websocketConfig.optString("method");
        }
        this.trackEvent(ISdkEvent.Event.ACTIVATED, getConfig());
    }

    public boolean needReport() {
        if (null == this.advertiseChannel)
            return false;
        JSONObject jsonObject = this.advertiseChannel.optJSONObject(sdkEvent.getADChannel());
        if (jsonObject != null) {
            return jsonObject.optInt("tm") == 1;
        } else {
            return false;
        }
    }

    public Map<String, Object> getConfig() {
        if (advertiseChannel != null && sdkEvent != null) {
            return JSONUtil.toMap(this.advertiseChannel.optJSONObject(sdkEvent.getADChannel()));
        } else {
            return null;
        }
    }

    public void setSdkEvent(ISdkEvent sdkEvent) {
        this.sdkEvent = sdkEvent;
    }

    public void trackEvent(String event, JSONObject params) {
        trackEvent(event, JSONUtil.toMap(params));
    }

    public void trackEvent(String event, Map<String, Object> params) {
        try {
            if (sdkEvent != null && isClientReport()) {
                sdkEvent.onEvent(event, params);
            }
        } catch (Exception e) {

        }
    }

}
