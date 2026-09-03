package com.ruixue.websocket;

import android.app.Activity;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/21
 */
public interface ISocketListener {

    void setConfig(Activity activity,JSONObject mConfig);

    /**
     * 接收到消息
     * @param client  客户端
     * @param message 消息
     */
    void onMessage(RXWebSocketClient client, DataBean message);
}
