package com.ruixue.logger;

import android.util.Log;

import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXGlobalData;

public class RXLogger {

    private static final String TAG = RuiXueSdk.TAG;

    public static void init() {
        //日志
        FormatStrategy formatStrategy = PrettyFormatStrategy.newBuilder()
                .showThreadInfo(false)
                .methodCount(0)
                .tag(TAG)
                .build();
        AndroidLogAdapter androidLogAdapter = new AndroidLogAdapter(formatStrategy) {
            @Override
            public boolean isLoggable(int priority, String tag) {
                return RXGlobalData.isDebugEnable();
            }
        };
        Logger.addLogAdapter(androidLogAdapter);

    }

    public static void i(String tag, String msg) {
        if (RXGlobalData.isDebugEnable() && msg != null) {
            Log.i(tag, msg);
        }
    }

    public static void v(String tag, String msg) {
        if (RXGlobalData.isDebugEnable()) {
            Log.v(tag, msg);
        }
    }

    public static void d(String tag, String msg) {
        if (RXGlobalData.isDebugEnable() && msg != null) {
            int chunkSize = 4096;
            for (int i = 0; i < msg.length(); i += chunkSize) {
                int end = Math.min(i + chunkSize, msg.length());
                Log.d(tag, msg.substring(i, end));
            }
        }
    }

    public static void w(String tag, String msg) {
        Log.w(tag, msg);
    }

    public static void e(String tag, String msg) {
        Log.e(tag, msg);
    }

    public static void i(String msg) {
        i(TAG, msg);
    }

    public static void v(String msg) {
        v(TAG, msg);
    }

    public static void d(String msg) {
        d(TAG, msg);
    }

    public static void w(String msg) {
        w(TAG, msg);
    }

    public static void e(String msg) {
        e(TAG, msg);
    }

}
