package com.ruixue.reflect;

import android.content.Context;

import com.ruixue.openapi.RXGlobalData;

import java.lang.reflect.Method;

@Deprecated
public class OaidManager extends BaseReflectClass {
    //    public static final String PACKAGECLASS = "com.ruixue.mdid.OaidSdkWrapper";
    private static boolean isInitSuccess = false;
    private static final String PLUGIN_NAME = "RX_PLUGIN_OAID";
    private static Class<?> pluginClass = null;

    public static boolean initOaidSdk(Context ctx, String certString) {
        final String packageClassName = getMetaDataVal(ctx, PLUGIN_NAME);
        pluginClass = getClass(packageClassName);
        if (pluginClass != null) {
            try {
                Method getVersion = pluginClass.getMethod("getVersion");
                Integer v = (Integer) getVersion.invoke(null);
                Object ret;
                if (v != null && v > 1) {
                    Method method = pluginClass.getMethod("initOaidSdkV2", Context.class, String.class);
                    ret = method.invoke(null, ctx, certString);
                } else {
                    Method method = pluginClass.getMethod("initOaidSdk", Context.class, boolean.class);
                    ret = method.invoke(null, ctx, RXGlobalData.isDebugEnable());
                }
                if (null == ret) {
                    return false;
                }
                int nret = (int) ret;
                isInitSuccess = 1008610 == nret || 1008614 == nret;
                return isInitSuccess;
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    public static boolean isSupport() {
        if (isInitSuccess && pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("isSupport");
                Object ret = method.invoke(null);
                return ret != null && (boolean) ret;
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return false;
    }


    public static String getOAID() {
        if (isInitSuccess && pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("getOAID");
                return (String) method.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return "";
    }

    public static String getVAID() {
        if (isInitSuccess && pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("getVAID");
                return (String) method.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return "";
    }

    public static String getAAID() {
        if (isInitSuccess && pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("getAAID");
                return (String) method.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return "";
    }
}