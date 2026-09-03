package com.ruixue.reflect;


import android.content.Context;
import android.content.Intent;

import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

// Created by wangliang on 2025/11/17.
public class OpenInstallManager extends BaseReflectClass {

    private static final String OPEN_INSTALL_SDK_CLASS = "com.ruixue.openinstall.OpenInstallSdkWrapper";

    private static final String OPEN_INSTALL_OS_SDK_CLASS = "com.ruixue.openinstall.os.OpenInstallOverseasSdkWrapper";

    private static String channelCode;
    private static String appData;

    public static void setAppData(String channelCode, String appData) {
        OpenInstallManager.channelCode = channelCode;
        OpenInstallManager.appData = appData;
    }

    public static String getChannelCode() {
        return channelCode;
    }

    public static Map<String, Object> getAppData() {
        if (appData == null || appData.isEmpty()) {
            return null;
        }
        try {
            JSONObject json = new JSONObject(appData);
            return JSONUtil.toMap(json);
        } catch (Exception e) {
            RXLogger.d("OpenInstall getAppData error");
            e.printStackTrace();
        }

        return null;
    }

    public static void clearAppData() {
        channelCode = null;
        appData = null;
    }

    public static void checkInit(Context context, JSONObject oi) {
        if (oi == null) {
            return;
        }
        String appKey = oi.optString("appid");
        if (appKey.isEmpty()) {
            RXLogger.d("OpenInstall init appKey: null");
            return;
        }
        String domain = oi.optString("domain");
        if (domain.isEmpty()) {
            RXLogger.d("OpenInstall init domain: null");
            return;
        }
        initClipData(context);
        setServerDomain(domain);
        init(context);
        getWakeUp(RuiXueSdk.getCurrentActivity().getIntent());
        getInstall();
    }

    public static boolean initClipData(Context context) {
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("initClipData", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("initClipData", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean setServerDomain(String domain) {
        RXLogger.d("setServerDomain:" + domain);
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("setServerDomain", String.class);
                method.invoke(clsObj, domain);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("setServerDomain", String.class);
                method.invoke(clsObj, domain);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean preInit(Context context) {
        RXLogger.d("OpenInstall preInit");
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("preInit", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }

        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("preInit", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }

        return false;
    }

    public static boolean init(Context context) {
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("init", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("init", Context.class);
                method.invoke(clsObj, context);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean getWakeUp(Intent intent) {
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("getWakeUp", Intent.class);
                method.invoke(clsObj, intent);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("getWakeUp", Intent.class);
                method.invoke(clsObj, intent);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean getInstall() {
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("getInstall");
                method.invoke(clsObj);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("getInstall");
                method.invoke(clsObj);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean onActivityDestroy() {
        Class<?> openInstallSdkClass = getClass(OPEN_INSTALL_SDK_CLASS);
        if (openInstallSdkClass != null) {
            try {
                Method msd = openInstallSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallSdkClass.getMethod("onActivityDestroy");
                method.invoke(clsObj);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        Class<?> openInstallOsSdkClass = getClass(OPEN_INSTALL_OS_SDK_CLASS);
        if (openInstallOsSdkClass != null) {
            try {
                Method msd = openInstallOsSdkClass.getMethod("getInstance");
                Object clsObj = msd.invoke(null);
                Method method = openInstallOsSdkClass.getMethod("onActivityDestroy");
                method.invoke(clsObj);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                printStackTrack(e);
            }
        }
        return false;
    }
}
