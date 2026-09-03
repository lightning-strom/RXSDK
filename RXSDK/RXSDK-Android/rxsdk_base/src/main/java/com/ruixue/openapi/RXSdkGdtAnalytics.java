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
public class RXSdkGdtAnalytics extends BaseReflectClass {
    final static String GDT_SDK_CLASS = "com.ruixue.sdk.gdt.GDTSdkWrapper";

    static class Single {
        final static RXSdkGdtAnalytics INSTANCE = new RXSdkGdtAnalytics();

    }

    public static RXSdkGdtAnalytics getInstance() {
        return Single.INSTANCE;
    }

    private ISdkEvent sdkEvent;

    private JSONObject advertiseChannel;

    RXSdkGdtAnalytics() {
        this.sdkEvent = getEventImpl();
    }


    private ISdkEvent getEventImpl() {
        Class<?> adshelpeHelperClass = getClass(GDT_SDK_CLASS);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                return (ISdkEvent) msd.invoke(null);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ignore) {
            }
        }
        return null;
    }

    public void onInit(JSONObject advertiseChannel) {
        this.advertiseChannel = advertiseChannel;
        this.trackEvent(ISdkEvent.Event.ACTIVATED, getConfig());
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
            if (sdkEvent != null) {
                sdkEvent.onEvent(event, params);
            }
        } catch (Exception e) {

        }
    }
}
