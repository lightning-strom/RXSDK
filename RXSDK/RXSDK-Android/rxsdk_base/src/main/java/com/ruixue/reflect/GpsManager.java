package com.ruixue.reflect;

import android.app.Activity;

import com.ruixue.callback.RXStringCallback;

import java.lang.reflect.Method;

public class GpsManager extends BaseReflectClass {

    public static final String PACKAGECLASS = "com.ruixue.gaoede.GpsUtil";
    public static Activity activity;

    /**
     * 初始化
     * @param mactivity
     */
    public static void initLocation(Activity mactivity) {
        activity = mactivity;
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("initLocation", Activity.class);
                method.invoke(null, mactivity);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }




   /* *//**
     * 获取GPS状态的字符串
     *
     * @param statusCode GPS状态码
     * @return
     *//*
    public String getGPSStatusString(int statusCode) {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("getGPSStatusString", int.class);
                return (String) method.invoke(null, statusCode);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return "";
    }

    *//**
     * @param cbAddress      设置是否需要显示地址信息
     * @param cbGpsFirst     设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效
     * @param cbCacheAble    设置是否开启缓存
     * @param cbOnceLocation 设置是否单次定位
     * @param cbOnceLastest  设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用
     * @param cbSensorAble   设置是否使用传感器
     * @param strInterval    设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算
     * @param strTimeout     设置网络请求超时时间
     *//*
    public void resetOption(boolean cbAddress, boolean cbGpsFirst, boolean cbCacheAble, boolean cbOnceLocation, boolean cbOnceLastest,
                            boolean cbSensorAble, long strInterval, long strTimeout) {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("resetOption", boolean.class, boolean.class, boolean.class, boolean.class, boolean.class,
                boolean.class, long.class, long.class);
                method.invoke(null,  cbAddress,  cbGpsFirst,  cbCacheAble,  cbOnceLocation,  cbOnceLastest,
                 cbSensorAble,  strInterval,  strTimeout);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }*/

    /**
     * 开始定位
     *
     * @param activity
     * @param cbAddress      设置是否需要显示地址信息
     * @param cbGpsFirst     设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效
     * @param cbCacheAble    设置是否开启缓存
     * @param cbOnceLocation 设置是否单次定位
     * @param cbOnceLastest  设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用
     * @param cbSensorAble   设置是否使用传感器
     * @param strInterval    设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算
     * @param strTimeout     设置网络请求超时时间
     * @param channelCallback
     *//*
    public void startLocation(Activity activity, boolean cbAddress, boolean cbGpsFirst, boolean cbCacheAble, boolean cbOnceLocation, boolean cbOnceLastest,
                              boolean cbSensorAble, long strInterval, long strTimeout, ChannelCallback channelCallback) {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("startLocation",Activity.class, boolean.class, boolean.class, boolean.class, boolean.class, boolean.class,
                        boolean.class, long.class, long.class,ChannelCallback.class);
                method.invoke(null,  activity,cbAddress,  cbGpsFirst,  cbCacheAble,  cbOnceLocation,  cbOnceLastest,
                        cbSensorAble,  strInterval,  strTimeout,channelCallback);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }

    }*/

    /**
     * 开始定位
     * 默认配置定位
     * @param activity
     * @param channelCallback
     */
    public static void startLocation(Activity activity, String[] types, int duration, RXStringCallback channelCallback) {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("startLocation", Activity.class,String[].class,int.class, RXStringCallback.class);
                method.invoke(null,  activity,types,duration,channelCallback);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }

    /**
     * 停止定位
     *
     * @author hongming.wang
     * @since 2.8.0
     */
    public static void stopLocation() {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("stopLocation");
                method.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }

  /*  *//**
     * 销毁定位
     *
     * @author hongming.wang
     * @since 2.8.0
     *//*
    public static void destroyLocation() {
        Class<?> packageclass = getClass(activity, PACKAGECLASS);
        if (packageclass != null) {
            try {
                Method method = packageclass.getMethod("destroyLocation");
                method.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }*/

}
