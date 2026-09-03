package com.ruixue.reflect;

import android.app.Activity;
import android.content.Context;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.error.RXException;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/21
 */
public class WebSocketManager extends BaseReflectClass {

    public static boolean connect(Activity activity) {
        try {
            JSONObject channelConfig = TrackDataMgr.getInstance().getChannelConfig();
            JSONObject websocket = TrackDataMgr.getInstance().getWebsocket();
            List<String> wsList = null;
            String method = "";
            if (websocket != null) {
                JSONArray ws_list = websocket.optJSONArray("ws_list");
                if (ws_list != null) {
                    wsList = JSONUtil.toStringList(ws_list);
                }
                method = websocket.optString("method", "");
            }

            if (channelConfig != null && wsList != null && method.equalsIgnoreCase("sdk")) {
                return connect(activity, channelConfig, wsList, null);
            } else {
                if (channelConfig == null) {
                    RXLogger.i(method + " init advertise_channel is null");
                }
                if (websocket == null) {
                    RXLogger.i(method + " init websocket is null");
                }
                return false;
            }
        } catch (Exception ignore) {
            return false;
        }
    }

    public static String getChannel(Context activity) {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.sdk.bytedancelog.BytedanceLogWrapper");
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = adshelpeHelperClass.getMethod("getChannel", Context.class);
                return (String) method.invoke(clsObj, activity);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ignore) {
            }
        }
        return null;
    }

    public static boolean connect(Activity activity, JSONObject config, List<String> urls, RXJSONCallback callback) {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.websocket.RXWebsocketMgr");
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("connect", Activity.class, JSONObject.class, List.class, RXJSONCallback.class);
                methodShowUI.invoke(clsObj, activity, config, urls, callback);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
        }
        return false;
    }

    public static boolean send(String msg) {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.websocket.RXWebsocketMgr");
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("send", String.class);
                methodShowUI.invoke(clsObj, msg);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

}
