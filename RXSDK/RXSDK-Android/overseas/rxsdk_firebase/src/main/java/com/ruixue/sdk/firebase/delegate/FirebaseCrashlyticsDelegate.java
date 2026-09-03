package com.ruixue.sdk.firebase.delegate;

import com.google.firebase.crashlytics.FirebaseCrashlytics;
import com.ruixue.sdk.firebase.data.RxCustomKeysAndValues;

public class FirebaseCrashlyticsDelegate {

    public void setCustomKey(String key, boolean value) {
        FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }

    public void setCustomKey(String key, float value) {
        FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }

    public void setCustomKey(String key, int value) {
        FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }

    public void setCustomKey(String key, long value) {
        FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }

    /**
     * 添加自定义键
     * @param key key
     * @param value value
     */
    public void setCustomKey(String key, String value) {
        FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }

    /**
     * 批量添加键值对
     * @param keysAndValues 键值集合
     */
    public void setCustomKeys(RxCustomKeysAndValues keysAndValues) {
        FirebaseCrashlytics.getInstance().setCustomKeys(RxCustomKeysAndValues.copy(keysAndValues));
    }
    /**
     * 添加自定义消息
     * @param message 消息体
     */
    public void log(String message) {
        FirebaseCrashlytics.getInstance().log(message);
    }

    /**
     * 设置用户标识
     * @param identifier 用户标识
     */
    public void setCrashUserId(String identifier) {
        FirebaseCrashlytics.getInstance().setUserId(identifier);
    }

    /**
     * 报告非常严重的错误
     * @param throwable 错误
     */
    public void recordException(Throwable throwable) {
        FirebaseCrashlytics.getInstance().recordException(throwable);
    }

    /**
     * 是否开启崩溃自动收集
     * @param enabled 是否开启
     */
    public void setCrashlyticsCollectionEnabled(boolean enabled) {
        FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(enabled);
    }
}
