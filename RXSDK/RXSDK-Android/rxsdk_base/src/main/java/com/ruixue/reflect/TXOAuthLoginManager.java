package com.ruixue.reflect;


import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXException;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

public class TXOAuthLoginManager extends BaseReflectClass {

    public static final String PLUGIN_NAME = "RX_PLUGIN_TXAUTH";

    public static boolean isSupport(Context context) {
        String className = AppUtils.getAppMetaData(context, PLUGIN_NAME);
        return !TextUtils.isEmpty(className);
    }

    public static void init(Context context, Map<String, Object> paramsMap, RXJSONCallback callback) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        Class<?> adshelpeHelperClass = getClass(packageClassName);
        if (adshelpeHelperClass != null) {
            try {
                Method objMethod = adshelpeHelperClass.getMethod("getInstance");
                Method funcMethod = adshelpeHelperClass.getMethod("init", Context.class, Map.class, RXJSONCallback.class);
                funcMethod.invoke(objMethod.invoke(null), context, paramsMap, callback);
            } catch (Exception e) {
                printStackTrack(e);
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
        }
    }

    public static boolean checkEnvAvailable(Activity context, RXJSONCallback callback) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        Class<?> adshelpeHelperClass = getClass(packageClassName);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("checkEnvAvailable", Activity.class, RXJSONCallback.class);
                methodShowUI.invoke(clsObj, context, callback);
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

    public static boolean showLoginUI(Activity context, Map<String, Object> map, RXUICallback callback) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        Class<?> adshelpeHelperClass = getClass(packageClassName);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("showLoginUI", Activity.class, Map.class, RXUICallback.class);
                methodShowUI.invoke(clsObj, context, map, callback);
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

    public static boolean showLoginUI(Activity context, LoginUIConfig loginUIConfig, RXUICallback callback) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        Class<?> adshelpeHelperClass = getClass(packageClassName);
        if (adshelpeHelperClass != null) {
            try {
                Method msd = adshelpeHelperClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method methodShowUI = adshelpeHelperClass.getMethod("showLoginUI", Activity.class, LoginUIConfig.class, RXUICallback.class);
                methodShowUI.invoke(clsObj, context, loginUIConfig, callback);
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

    /**
     * 一键登录
     * @param context  context
     * @param map      必传字段
     *                 privacyTwoUrl 用户协议链接
     *                 privacyOneUrl 隐私政策链接
     *                 alikey  阿里一键登录SDK密钥
     * @param callback callback
     * @return 是否调用成功
     */
    public static boolean doLogin(Activity context, Map<String, Object> map, RXJSONCallback callback) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        Class<?> adshelpeHelperClass = getClass(packageClassName);
        if (adshelpeHelperClass != null) {
            try {
                Method objMethod = adshelpeHelperClass.getMethod("getInstance");
                Method funcMethod = adshelpeHelperClass.getMethod("doLogin", Activity.class, Map.class, RXJSONCallback.class);
                funcMethod.invoke(objMethod.invoke(null), context, map, callback);
                return true;
            } catch (Exception e) {
                printStackTrack(e);
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
        }
        return false;
    }


}
