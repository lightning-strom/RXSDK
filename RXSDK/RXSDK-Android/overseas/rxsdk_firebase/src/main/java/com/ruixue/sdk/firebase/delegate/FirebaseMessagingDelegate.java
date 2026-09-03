package com.ruixue.sdk.firebase.delegate;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.RemoteMessage;

public class FirebaseMessagingDelegate {

    /**
     * 检索当前注册令牌
     * @param onCompleteListener 回调
     */
    public void getToken(OnCompleteListener<String> onCompleteListener) {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (onCompleteListener != null) {
                            onCompleteListener.onComplete(task);
                        }
                    }
                });
    }

    /**
     * 重新启用 FCM 自动初始化功能
     * @param enable 是否开启
     */
    public void setAutoInitEnabled(boolean enable) {
        FirebaseMessaging.getInstance().setAutoInitEnabled(enable);
    }

    /**
     * 为客户端应用订阅主题
     * @param onCompleteListener 监听回调
     */
    public void subscribeToTopic(String topic, OnCompleteListener<Void> onCompleteListener) {
        FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (onCompleteListener != null) {
                            onCompleteListener.onComplete(task);
                        }
                    }
                });
    }

    /**
     * 向服务端发送上行消息
     * @param message 消息
     */
    public void send(RemoteMessage message) {
        FirebaseMessaging.getInstance().send(message);
    }

}
