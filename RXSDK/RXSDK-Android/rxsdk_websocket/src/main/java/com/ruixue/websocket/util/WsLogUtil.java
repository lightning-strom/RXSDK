package com.ruixue.websocket.util;

import android.util.Log;

/**
 * @author Lee
 * Created on 2022/3/29 16:11
 * desc   :
 */
public class WsLogUtil {

    private static final String TAG = "rxsdk";

    private static boolean isClose = true;

    public static void closeLog(boolean print) {
        isClose = print;
    }

    public static void d(String msg) {
        if (!isClose) {
            return;
        }
        Log.d(TAG, "d: " + msg);
    }

    public static void e(String msg) {
        if (!isClose) {
            return;
        }
        Log.e(TAG, "e: " + msg);
    }

    public static void w(String msg) {
        if (!isClose) {
            return;
        }
        Log.w(TAG, "w: " + msg);
    }
}
