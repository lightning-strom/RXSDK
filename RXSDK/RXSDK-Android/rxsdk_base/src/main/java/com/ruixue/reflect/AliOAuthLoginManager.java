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

public class AliOAuthLoginManager extends BaseReflectClass {

    public static final String ALI_AUTH_UI_ACKAGECLASS = "com.ruixue.aliqin.AliAuthUI";

    public static boolean isSupport(Context context) {
        String className = AppUtils.getAppMetaData(context, "RX_PLUGIN_ALIAUTH");
        return !TextUtils.isEmpty(className);
    }


    public static boolean showLoginUI(Activity context, LoginUIConfig loginUIConfig, RXUICallback callback) {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.aliqin.AliAuthSdkWrapper");
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

    public static boolean checkEnvAvailable(Activity context, RXJSONCallback callback) {
        Class<?> adshelpeHelperClass = getClass("com.ruixue.aliqin.AliAuthSdkWrapper");
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
        Class<?> adshelpeHelperClass = getClass("com.ruixue.aliqin.AliAuthSdkWrapper");
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

    public static boolean isShowing(Context context) {
        Class<?> adshelpeHelperClass = getClass(ALI_AUTH_UI_ACKAGECLASS);
        if (isSupport(context) && adshelpeHelperClass != null) {
            try {
                Method getInstanceMethod = adshelpeHelperClass.getMethod("getInstance");
                Object instance = getInstanceMethod.invoke(null);
                // 调用 isShowing 方法并返回结果
                if (instance != null) {
                    Method isShowingMethod = adshelpeHelperClass.getMethod("isShowing");
                    return (boolean) isShowingMethod.invoke(instance);
                }
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean closeUI(Context context) {
        Class<?> adshelpeHelperClass = getClass(ALI_AUTH_UI_ACKAGECLASS);
        if (isSupport(context) && adshelpeHelperClass != null) {
            try {
                Method methodInit = null;
                methodInit = adshelpeHelperClass.getMethod("closeUI");
                methodInit.invoke(null);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * 阿里一键登录
     * @param context  context
     * @param map      必传字段
     *                 privacyTwoUrl 用户协议链接
     *                 privacyOneUrl 隐私政策链接
     *                 alikey  阿里一键登录SDK密钥
     * @param callback callback
     * @return 是否调用成功
     */
    public static boolean doLogin(Context context, Map<String, Object> map, RXJSONCallback callback) {
        Class<?> adshelpeHelperClass = getClass(ALI_AUTH_UI_ACKAGECLASS);
        if (adshelpeHelperClass != null) {
            try {
                Method methodInit = null;
                methodInit = adshelpeHelperClass.getMethod("doLogin", Context.class, Map.class, RXJSONCallback.class);
                methodInit.invoke(null, context, map, callback);
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
     * 获取设备当前的运营商名称
     * @return
     */
    public static String getDeviceCurrentCarrierName(Context contex) {
        Class<?> adshelpeHelperClass = getClass(ALI_AUTH_UI_ACKAGECLASS);
        if (adshelpeHelperClass != null) {
            try {
                Method methodInit = adshelpeHelperClass.getMethod("getDeviceCurrentCarrierName", Context.class);
                return (String) methodInit.invoke(null, contex);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return "";
    }


}
