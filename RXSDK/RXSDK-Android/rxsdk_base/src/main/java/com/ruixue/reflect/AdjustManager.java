package com.ruixue.reflect;


import android.content.Context;

import com.ruixue.RuiXueSdk;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class AdjustManager extends BaseReflectClass {

    public static void setEventName(Context context, String event) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("setEventName", Context.class, String.class);
                methodShowUI.invoke(clsObj, context, event);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
    }

    public static void setActivateName(Context context, String event) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("setActivateName", Context.class, String.class);
                methodShowUI.invoke(clsObj, context, event);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
    }

    public static void trackNewUser(Context context, String openid) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("trackNewUser", Context.class, String.class);
                methodShowUI.invoke(clsObj, context, openid);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
    }

    public static void setRcTime(Context context, int event) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("setRcTime", Context.class, Integer.class);
                methodShowUI.invoke(clsObj, context, event);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
    }

    public static boolean init(Context context, String app_token, int switch_of, String distinctId) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("init", Context.class, String.class, int.class, String.class);
                methodShowUI.invoke(clsObj, context, app_token, switch_of, distinctId);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean activate(String distinctId) {
        Context context = RuiXueSdk.getContext();
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("activate", String.class);
                methodShowUI.invoke(clsObj, distinctId);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean setPushToken(String token, Context context) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ADJUST");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("setPushToken", String.class, Context.class);
                methodShowUI.invoke(clsObj, token, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * 会阻塞线程 不要在主线程调用
     * @param context
     * @return
     */
    public static String getAppInstanceId(Context context) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_FIREBASE");
        Class<?> adshelpeHelperClass = getClass(className);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("getAppInstanceId", Context.class);
                String id = (String) methodShowUI.invoke(clsObj, context);
                return id;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return null;
    }
}
