package com.ruixue.openapi;

import com.ruixue.reflect.BaseReflectClass;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * 快手监测（{@code advertise_channel.ks}）反射入口。
 * 实现类：{@code com.ruixue.sdk.kwaimonitor.KwaiMonitorSdkWrapper}
 */
public class RXSdkKwaiAnalytics extends BaseReflectClass {
    static final String KWAI_MONITOR_SDK_CLASS = "com.ruixue.sdk.kwaimonitor.KwaiMonitorSdkWrapper";

    static class Single {
        static final RXSdkKwaiAnalytics INSTANCE = new RXSdkKwaiAnalytics();
    }

    public static RXSdkKwaiAnalytics getInstance() {
        return Single.INSTANCE;
    }

    private ISdkEvent sdkEvent;
    private JSONObject advertiseChannel;

    RXSdkKwaiAnalytics() {
        this.sdkEvent = getEventImpl();
    }

    private ISdkEvent getEventImpl() {
        Class<?> clazz = getClass(KWAI_MONITOR_SDK_CLASS);
        if (clazz != null) {
            try {
                Method msd = clazz.getMethod("getInstance");
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
        }
        return null;
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
        } catch (Exception ignore) {
        }
    }
}
