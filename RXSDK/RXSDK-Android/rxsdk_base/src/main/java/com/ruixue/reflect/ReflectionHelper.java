package com.ruixue.reflect;

import android.util.Log;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/25
 */
public class ReflectionHelper {
    public ReflectionHelper() {
    }

    @SuppressWarnings("unchecked")
    public static <T> T getConstantValue(Class<?> aClass, String constantName) {
        try {
            return (T) aClass.getDeclaredField(constantName).get(null);
        } catch (NoSuchFieldException var3) {
            Log.e("error", "can not find " + constantName + " in " + aClass.getName());
        } catch (IllegalAccessException var4) {
            Log.e("error", constantName + " is not accessible");
        } catch (IllegalArgumentException var5) {
            Log.e("error", "arguments error when get " + constantName);
        } catch (Exception var6) {
            Log.e("error", "can not get constant" + constantName);
        }

        return null;
    }

    @SuppressWarnings("unchecked")
    public static <T> T invokeInstanceMethod(Object instance, String methodName, Class<?>[] parameterTypes, Object[] parameters) {
        Class<?> aClass = instance.getClass();

        try {
            Method method = aClass.getMethod(methodName, parameterTypes);
            return (T) method.invoke(instance, parameters);
        } catch (NoSuchMethodException var6) {
            Log.e("error", "can not find " + methodName + " in " + aClass.getName());
        } catch (IllegalAccessException var7) {
            Log.e("error", methodName + " is not accessible");
        } catch (IllegalArgumentException var8) {
            Log.e("error", "arguments are error when invoking " + methodName);
        } catch (InvocationTargetException var9) {
            Log.e("error", "an exception was thrown by the invoked method when invoking " + methodName);
        }

        return null;
    }
}
