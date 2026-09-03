package com.ruixue.base;

import androidx.annotation.NonNull;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.GsonBuilder;
import com.ruixue.RuiXueSdk;
import com.ruixue.utils.DateUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/2/5
 */
public class LogHelper {

    private static final List<String> logCache = new ArrayList<>();

    public static class GrailsDomainExclusionStrategy implements ExclusionStrategy {
        @Override
        public boolean shouldSkipClass(Class<?> clazz) {
            return false;
        }

        @Override
        public boolean shouldSkipField(FieldAttributes f) {
            return f.getName().equals("errors");
        }

    }

    public static boolean isEnable() {
        return isEnable;
    }

    public static void setLogConfig(boolean enable, int maxCount) {
        isEnable = enable;
        LogHelper.maxCount = maxCount;
    }

    public static void setEnable(boolean enable) {
        isEnable = enable;
    }

    public static void setMaxCount(int maxCount) {
        LogHelper.maxCount = maxCount;
    }

    static boolean isEnable = false;

    static int maxCount = 100;

    public static List<String> getSDKLog() {
        return logCache;
    }

    public static class LogBean {
        public String time;
        public String event;
        public String url;
        public String openid;
        public String header;
        public String body;
        public String result;

        public LogBean() {
            time = DateUtils.getMsTime();
            url = RuiXueSdk.getFirstBaseUrl();
            openid = RuiXueSdk.getOpenid();
        }

        @NonNull
        @Override
        public String toString() {
            return "{" + "time='" + time + '\'' + ", event='" + event + '\'' + ", url='" + url + '\'' + ", openid='" + openid + '\'' + ", header='" + header + '\'' + ", body='" + body + '\'' + ", result='" + result + '\'' + '}';
        }
    }


    public static void writeLogLoginInvoke(Map<String, Object> map) {
        if (!isEnable()) {
            return;
        }
        try {
            LogBean logBean = new LogBean();
            logBean.event = "rxsdk_login_invoke";
            if (map != null) {
                logBean.body = map.toString();
            }
            writeLog(logBean);
        } catch (Throwable e) {
            e.printStackTrace();
            logCache.clear();
        }
    }

    public static void writeLogLoginRequest(Map<String, Object> objectMap, Map<String, String> header) {
        if (!isEnable()) {
            return;
        }
        try {
            LogBean logBean = new LogBean();
            logBean.event = "rxsdk_login_request";
            if (objectMap != null) {
                Map<String, Object> map = new HashMap<>(objectMap);
                logBean.body = map.toString();
            }
            if (header != null) {
                logBean.header = new HashMap<>(header).toString();
            }
            writeLog(logBean);
        } catch (Throwable e) {
            e.printStackTrace();
            logCache.clear();
        }
    }

    public static void writeLogLoginResult(Map<String, Object> map, Map<String, String> header, JSONObject data) {
        if (!isEnable()) {
            return;
        }
        try {
            LogBean logBean = new LogBean();
            logBean.event = "rxsdk_login_result";
            if (map != null) {
                logBean.body = new HashMap<>(map).toString();
            }
            if (header != null)
                logBean.header = new HashMap<>(header).toString();
            if (data != null) {
                logBean.result = data.toString();
            }
            writeLog(logBean);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public static void writeLogLoginCallback(Map<String, Object> map, Map<String, String> header, JSONObject data) {
        if (!isEnable()) {
            return;
        }
        try {
            LogBean logBean = new LogBean();
            logBean.event = "rxsdk_login_callback";
            if (map != null)
                logBean.body = new HashMap<>(map).toString();
            if (header != null)
                logBean.header = new HashMap<>(header).toString();
            if (data != null) {
                logBean.result = data.toString();
            }
            writeLog(logBean);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public static void writeLog(LogBean logBean) {
        if (!isEnable()) {
            return;
        }
        try {
            writeLog(logBean.toString());
        } catch (Throwable e) {
            e.printStackTrace();
            logCache.clear();
        }
    }

    public static void writeLog(String log) {
        if (!isEnable()) {
            return;
        }

//        RXLogger.i(log);
        if (logCache.size() > maxCount) {
            logCache.clear();
        }
        logCache.add(log);
    }
}
