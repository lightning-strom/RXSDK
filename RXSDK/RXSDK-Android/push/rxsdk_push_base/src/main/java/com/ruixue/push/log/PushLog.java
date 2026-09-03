package com.ruixue.push.log;

import androidx.annotation.Nullable;

import com.ruixue.logger.Logger;

public final class PushLog {
    private PushLog() {
    }

    private static boolean sDebug = true;

    private static final String TAG = "rxpush:";

    public static void i(String log, @Nullable Object... args) {
        if (sDebug) {
            Logger.i(TAG + log, args);
        }
    }

    public static void d(String log, @Nullable Object... args) {
        if (sDebug) {
            Logger.d(TAG + log, args);
        }
    }

    public static void w(String log, @Nullable Object... args) {
        if (sDebug) {
            Logger.w(TAG + log, args);
        }
    }

    public static void e(String log, @Nullable Object... args) {
        Logger.e(TAG + log, args);
    }

    public static void setDebug(boolean isDebug) {
        sDebug = isDebug;
    }

    public static boolean isDebug() {
        return sDebug;
    }
}
