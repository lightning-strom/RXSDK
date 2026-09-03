package com.ruixue.push.core;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXRequest;
import com.ruixue.net.RequestManager;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public final class PushApiImpl implements IPushApi {

    public void reportNotificationArrived(String taskid, String brandName, String token) {
        reportStatusToServer(taskid, brandName, token, REPORT_TYPE_ARRIVED,null);
    }


    public static class PusherAPI {
        static String BIND_DEVICE = "v1/pusher/device/bind_device";
        static String BIND_ALIAS = "v1/pusher/device/bind_alias";
        static String ADD_TAGS = "v1/pusher/device/add_tags";
        static String DEL_TAGS = "v1/pusher/device/del_tags";
        static String UNBIND_DEVICE = "v1/pusher/device/unbind_device";
        static String NOTIFY_REPORT = "v1/pusher/notify/device";
    }


    @Override
    public void reportNotifyStatus(String brandName, String deviceToken, String taskId, int reportType) {
        reportStatusToServer(taskId, brandName, deviceToken, REPORT_TYPE_CLICK,null);
    }

     @Override
    public void reportNotificationClicked(String brandName, String deviceToken, String taskId, RXJSONCallback callback) {
        reportStatusToServer(taskId, brandName, deviceToken, REPORT_TYPE_CLICK,callback);
    }

    public void addTags(String[] alias) {
        Map<String, Object> arg = new HashMap<>();
        arg.put("tags", alias);

        RXRequest request = RXRequest.create(PusherAPI.ADD_TAGS).setMethod(HttpMethod.POST).setBody(arg);
        RequestManager.getInstance().execRequest(request);
    }

    public void delTags(String[] alias) {
        Map<String, Object> arg = new HashMap<>();
        arg.put("tags", alias);
        RXRequest request = RXRequest.create(PusherAPI.DEL_TAGS).setMethod(HttpMethod.POST).setBody(arg);
        RequestManager.getInstance().execRequest(request);
    }


    public void bindAlias(String alias) {
        Map<String, Object> arg = new HashMap<>();
        arg.put("alias", alias);

        RXRequest request = RXRequest.create(PusherAPI.BIND_ALIAS).setMethod(HttpMethod.POST).setBody(arg);
        RequestManager.getInstance().execRequest(request);
    }

    @Override
    public void unbindDevice(String brandName, String deviceToken, DeviceResultCallback result) {
        Map<String, Object> arg = new HashMap<>();
        arg.put("device_code", deviceToken);
        arg.put("type", brandName);

        RXRequest request = RXRequest.create(PusherAPI.UNBIND_DEVICE).setMethod(HttpMethod.POST).setBody(arg);
        RequestManager.getInstance().execRequest(request);
    }

    @Override
    public void bindDevice(String brandName, String deviceToken, DeviceResultCallback callback) {
        Map<String, Object> arg = new HashMap<>();
        arg.put("device_code", deviceToken);
        arg.put("type", brandName);
        RXRequest request = RXRequest.create(PusherAPI.BIND_DEVICE).setMethod(HttpMethod.POST).setBody(arg).setCallback(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null)
                    callback.onResult(data != null ? data.toString() : "");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null)
                    callback.onResult(cause.toString());
            }
        });
        RequestManager.getInstance().execRequest(request);
    }

    /**
     * @param taskId    推送消息的taskid
     * @param brandName 推送渠道类型
     * @param token     推送渠道SDK返回的ID/Token/设备码
     * @param type      状态 1 消息已接收 2 消息已到达展示 3 消息已点击
     */
    private static void reportStatusToServer(String taskId, String brandName, String token, int type, RXJSONCallback callback) {
        Map<String, Object> args = new HashMap<>();
        args.put("task_id", taskId);
        args.put("device_code", PushWrapper.getInstance().getDeviceToken());
        String openid = RuiXueSdk.getOpenid();
        if (!TextUtils.isEmpty(openid)) {
            args.put("openid", openid);
        }
        args.put("type", brandName);
        args.put("status", type);

        RXRequest request = RXRequest.create(PusherAPI.NOTIFY_REPORT).setMethod(HttpMethod.POST).setNeedLoggedIn(false).setBody(args).setCallback(callback);
        RequestManager.getInstance().execRequest(request);
    }
}
