package com.ruixue.sdk.google.unity;

import com.google.firebase.messaging.RemoteMessage;

public interface MessageServiceCallback {

    public void onMessageReceived(RemoteMessage message);

    public void onNewToken(String token);

}
