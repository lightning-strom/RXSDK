package com.ruixue.base;

import android.content.Context;
import android.util.Log;

import com.ruixue.logger.Logger;

import java.lang.reflect.Method;

public class TrackDeviceInfoMgr {

    private static final String DEVICE_TRACK_CONFIG_CLASS = "com.haiqi.rxsdk_deviceinfo.DeviceInfoConfig";

    private static final String DEVICE_TRACK_NETTYPE_CLASS = "com.haiqi.rxsdk_deviceinfo.NetWorkTypeUtil";


    private static final String DEVICE_TRACK_DEVICENAME_CLASS = "com.haiqi.rxsdk_deviceinfo.DeviceNameUtil";

    public static String getNetWorkType(Context context) {
        try {
            Class<?> TrackAppListClass = Class.forName(DEVICE_TRACK_NETTYPE_CLASS);
            Method method = TrackAppListClass.getMethod("getNetworkType", Context.class);
            Object type = method.invoke(null, context);

            if (type == null) {
                return null;
            }

            return (String) type;

        } catch (Exception e) {
//            e.printStackTrace();
            Logger.w("getNetworkType:" + e.getMessage());
        }

        return null;

    }

    public static String getDeviceName() {
        try {
            Class<?> TrackAppListClass = Class.forName(DEVICE_TRACK_DEVICENAME_CLASS);
            Method method = TrackAppListClass.getMethod("getDeviceName");
            Object name = method.invoke(null);

            if (name == null) {
                return null;
            }

            return (String) name;

        } catch (Exception e) {
//            e.printStackTrace();
            Logger.w("getDeviceName:" + e.getMessage());
        }
        return null;
    }


}
