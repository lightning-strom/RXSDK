package com.ruixue.push.core;

import android.content.Context;
import android.content.Intent;

public interface IPushProvider {
    /**
     * 订阅主题用于全局广播使用
     */
    String TOPIC_GLOBAL = "rx-topic-global";

    String KEY_TASK_ID = "task_id";

    boolean init( Context context);

    /**
     * 处理打开app 回调 用于统计通知点击
     *
     * @param intent intent
     */
    boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback);

    void registerToken(RegisterCallback callback);

    void unRegisterToken(UnRegisterCallback callback);

    String getDeviceToken();

    void turnOnPush();

    void turnOffPush();

    boolean isSupport();

    String getPushBrandName();

    void bindAlias(String alias);

    void unBindAlias(String alias);

}
