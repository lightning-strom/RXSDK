package com.ruixue.sdk.adjust.config;

import android.util.Log;

public enum RxLogLevel {
    VERBOSE(Log.VERBOSE),
    DEBUG(Log.DEBUG),
    INFO(Log.INFO),
    WARN(Log.WARN),
    ERROR(Log.ERROR),
    ASSERT(Log.ASSERT),
    SUPRESS(8);
    final int androidLogLevel;

    RxLogLevel(final int androidLogLevel) {
        this.androidLogLevel = androidLogLevel;
    }

    public int getAndroidLogLevel() {
        return androidLogLevel;
    }
}
