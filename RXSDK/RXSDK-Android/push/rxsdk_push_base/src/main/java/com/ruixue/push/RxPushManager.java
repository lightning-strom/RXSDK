package com.ruixue.push;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.push.core.DeviceResultCallback;
import com.ruixue.push.core.PushWrapper;

@SuppressWarnings("unused")
public class RxPushManager {

    /**
     * @param context 应用的上下文，建议传入当前app的application context
     * @return 是否初始化成功
     */
    public static boolean init(@NonNull Context context) {
        return PushWrapper.getInstance().init(context);
    }

    /**
     * 处理打开app回调，用于统计通知点击
     * @param intent 應用 intent
     */
    public static boolean openAppCallback(Intent intent) {
        if (intent != null && intent.getExtras() != null) {
            Object tid = intent.getExtras().get("task_id");
            String taskId = (tid != null) ? String.valueOf(tid) : null;
            if (!TextUtils.isEmpty(taskId)) {
                RXGlobalData.setPushTaskId(taskId);
                RXLogger.i("handleOnOpenApp task_id:" + taskId);
            }
        }
        return PushWrapper.getInstance().handleOnOpenApp(intent);
    }

    /**
     * 注册瑞雪推送服务，在瑞雪登录成功后调用，请求生成 Push Token
     */
    public static void registerToken() {
        registerToken(null);
    }

    public static void registerToken(DeviceResultCallback callback) {
        PushWrapper.getInstance().registerToken(callback);
    }

    /**
     * 反注册瑞雪推送服务
     */
    public static void unRegisterToken() {
        PushWrapper.getInstance().unRegisterToken();
    }

    /**
     * @return 服务器生成的推送 token/regId
     */
    public static String getDeviceToken() {
        return PushWrapper.getInstance().getDeviceToken();
    }

    /**
     * @return 当前设备是否支持推送
     */
    public static boolean isSupport() {
        return PushWrapper.getInstance().isSupport();
    }

    /**
     * @return 当前推送的厂商平台 BRAND
     */
    public static String getBrandName() {
        return PushWrapper.getInstance().getBrandName();
    }

    /**
     * 开发者可以为指定用户设置别名，然后给这个别名推送消息，效果等同于给RegId推送消息。
     * @param alias 要绑定的别名
     */
    public static void bindAlias(@NonNull String alias) {
        PushWrapper.getInstance().bindAlias(alias);
    }

    /**
     * 开发者可以取消指定用户的某个别名，服务器就不会给这个别名推送消息了。
     * @param alias 要取消的别名 ，空取消所有别名
     */
    public static void unBindAlias(String alias) {
        PushWrapper.getInstance().unBindAlias(alias);
    }

    public static void turnOnPush() {
        PushWrapper.getInstance().turnOnPush();
    }

    public static void turnOffPush() {
        PushWrapper.getInstance().turnOffPush();
    }

    /**
     * 添加标签
     * @param tags
     */
    public static void addTags(String... tags) {
        PushWrapper.getInstance().addTags(tags);
    }

    /**
     * 删除标签
     * @param tags
     */
    public static void delTags(String... tags) {
        PushWrapper.getInstance().delTags(tags);
    }

}
