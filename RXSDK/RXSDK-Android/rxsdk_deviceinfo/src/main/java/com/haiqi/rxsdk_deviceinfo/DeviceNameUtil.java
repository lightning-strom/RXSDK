package com.haiqi.rxsdk_deviceinfo;

import android.os.Build;

public class DeviceNameUtil {

    public static String getDeviceName() {
        return Build.MODEL;
    }

}
