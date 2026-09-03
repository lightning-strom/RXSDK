package com.ruixue.reflect;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;

import java.lang.reflect.InvocationTargetException;

public class BaseReflectClass {

    public static Class<?> getClass(String package_class_name) {
        Class<?> currentClass = null;
        if (!TextUtils.isEmpty(package_class_name)) {
            try {
                currentClass = Class.forName(package_class_name);
            } catch (Exception e) {
                RXLogger.w("Not find class name " + e.getMessage());
            }
        }
        return currentClass;
    }

    public static Class<?> getClass(Context context, String package_class_name) {
        return getClass(package_class_name);
    }

    protected static Throwable getTargetException(Exception e) {
        if (e instanceof InvocationTargetException) {
            return ((InvocationTargetException) e).getTargetException();// 获取目标异常
        }
        return e;
    }

    protected static void printStackTrack(Exception e) {
        getTargetException(e).printStackTrace();
    }

    public static String getMetaDataVal(Context context, String metaName) {
        String value = "";
        try {
            Bundle metaData = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA).metaData;
            if (metaData != null) {
                value = (String) metaData.get(metaName);
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return value;
    }
}