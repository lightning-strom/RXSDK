package com.ruixue.sdk.firebase.push;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.ruixue.push.log.PushLog;
import com.ruixue.sdk.google.unity.MessageServiceCallback;

public class FcmPushReceiver extends FirebaseMessagingService {
    private static final String TAG = FcmPushProvider.class.getSimpleName();
    private static MessageServiceCallback messageServiceCallback;

    public static void setFCMCallBack(MessageServiceCallback callback) {
        messageServiceCallback = callback;
    }

    public static void clearFCMCallBack() {
        messageServiceCallback = null;
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        FcmPushProvider.callUpdateToken(token);
        if (messageServiceCallback != null) {
            messageServiceCallback.onNewToken(token);
        }
    }

    @Override
    public void onDeletedMessages() {
        super.onDeletedMessages();
    }

    //通过重写 FirebaseMessagingService.onMessageReceived 方法，您可以根据收到的 RemoteMessage 对象执行操作并获取消息数据：
    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        if (messageServiceCallback != null) {
            messageServiceCallback.onMessageReceived(remoteMessage);
        }

        // (developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        PushLog.d("From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (!remoteMessage.getData().isEmpty()) {
            PushLog.d( "Message data payload: " + remoteMessage.getData());

            if (/* Check if data needs to be processed by long running job */ true) {
                // For long-running tasks (10 seconds or more) use WorkManager.
//                scheduleJob();
            } else {
                // Handle message within 10 seconds
//                handleNow();
            }
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            PushLog.d( "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
}
