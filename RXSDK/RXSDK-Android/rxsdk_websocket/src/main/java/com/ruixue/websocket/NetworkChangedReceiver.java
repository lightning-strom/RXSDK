package com.ruixue.websocket;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;


/**
 * @author Lee
 * Created on 2022/3/29 15:31
 * desc   :
 */
public class NetworkChangedReceiver extends BroadcastReceiver {

    private boolean isFirst = true;

    public NetworkChangedReceiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ConnectivityManager.CONNECTIVITY_ACTION.equals(intent.getAction())) {
            // 屏蔽首次注册时的OnReceive
            if (isFirst) {
                isFirst = false;
                return;
            }
            if (WsManager.getInstance().isNetworkAvailable()) {
                for (WsClient ws : WsManager.getInstance().getClientMap().values()) {
                    if (ws.isReConnectWhenNetworkAvailable()) {
                        ws.runReconnectTask();
                    }
                }
            }
        }
    }
}
