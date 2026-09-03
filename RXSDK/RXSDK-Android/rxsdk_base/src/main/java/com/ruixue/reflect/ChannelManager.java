package com.ruixue.reflect;

import android.content.Context;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/7/17
 */
public class ChannelManager extends BaseReflectClass {
    static Map<String, String> map = new HashMap<>();

    static {
        map.put("xingtu", "com.bytedance.hume.readapk.HumeSDK");
        map.put("juxing", "com.kwai.monitor.payload.TurboHelper");
    }

    static String channel;
    static String platform;
    static AtomicBoolean inited = new AtomicBoolean(false);

    public static void load(Context context) {
        if (inited.compareAndSet(false, true)) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                try {
                    Class<?> className = Class.forName(entry.getValue());
                    Method sMethod = className.getMethod("getChannel", Context.class);
                    channel = (String) sMethod.invoke(null, context);
                    platform = entry.getKey();
                    RXLogger.i("channelsdk inited  " + platform + " channel  " + channel);
                    if (!TextUtils.isEmpty(channel)) {
                        break;
                    }
                } catch (ClassNotFoundException e) {
                    RXLogger.i("channelsdk load failed:" + e.getMessage());
                } catch (InvocationTargetException | IllegalAccessException | NoSuchMethodException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static String getType(Context context) {
        load(context);
        return platform;
    }

    public static String getChannel(Context context) {
        load(context);
        return channel;
    }

}
