package com.ruixue.sdk.adjust.util;

import com.adjust.sdk.LogLevel;
import com.ruixue.sdk.adjust.config.RxLogLevel;

public class RxAdjustLogLevelTranslate {

    public static LogLevel transLateLogLevel(RxLogLevel rxLogLevel) {
        switch (rxLogLevel) {
            case VERBOSE:
                return LogLevel.VERBOSE;
            case DEBUG:
                return LogLevel.DEBUG;
            case INFO:
                return LogLevel.INFO;
            case WARN:
                return LogLevel.WARN;
            case ERROR:
                return LogLevel.ERROR;
            case ASSERT:
                return LogLevel.ASSERT;
            case SUPRESS:
                return LogLevel.SUPRESS;
        }
        return LogLevel.WARN;
    }

}
