package com.ruixue.websocket;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.passport.PassportManager;


import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/18
 */
public class RXWebsocketMgr {
    private static RXWebsocketMgr instanceField;

    public static RXWebsocketMgr getInstance() {
        RXWebsocketMgr instance = instanceField;
        if (instance == null) {
            synchronized (RXWebsocketMgr.class) {
                if (instanceField == null) {
                    instanceField = new RXWebsocketMgr();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    Map<String, RXWebSocketClient> clientMap = new HashMap<>();

    private ISocketListener getListener(Activity activity,JSONObject config) {
        String className = Objects.requireNonNull(ISocketListener.class.getPackage()).getName() + ".WebSocketEventImpl";
        try {
            Class<?> WebSocketEventImpl = Class.forName(className);
            Constructor<?> constructor1 = WebSocketEventImpl.getDeclaredConstructor();
            constructor1.setAccessible(true);
            ISocketListener instance = (ISocketListener) constructor1.newInstance();
            instance.setConfig(activity,config);
            return instance;
//                 Method method= ISocketListener.getMethod("getInstance");
//                return (ISocketListener) method.invoke(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    public void connect(Activity activity,JSONObject config, List<String> urls, RXJSONCallback callback) {
        try {
            if(urls!=null &&urls.size()>0) {
                String url = urls.get(0);
                Map<String, String> header = PassportManager.getInstance().getDefaultHeaders();
                // 创建WebSocket客户端
                RXWebSocketClient myClient = new RXWebSocketClient(url, header);
                myClient.setMsgListener(getListener(activity, config));
                myClient.connect();
                RXLogger.i("url:" + url);
                if (clientMap.containsKey("url")) {
                    Objects.requireNonNull(clientMap.get("url")).close();
                }
                clientMap.put(url, myClient);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void send(String msg) {
        if (clientMap != null) {
            for (Map.Entry<String, RXWebSocketClient> entry : clientMap.entrySet()) {
                entry.getValue().send(msg);
                RXLogger.i(entry.getKey() + " send:" + msg);
            }
        }
    }

//    public static void connection(String urls[], int cusor) {
//        if (cusor < urls.length) {
//            // 构造一个默认WebSocket客户端
//            WsClient wsClient = new WsClient.Builder().setServerUrl(urls[cusor]).setListener(new IWsListener() {
//                @Override
//                public void onConnected(WsClient client) {
//                    // 连接成功
//                    RXLogger.i("onConnected:" + client.getServerUrl());
//                    client.setReConnectCount(3);
////                    Map<String,Object> msg=new HashMap<>();
////                    msg.put("msg_type",1000);
////                    client.send(new JSONObject(msg).toString());
//                }
//
//                @Override
//                public void onDisconnect(WsClient client, DisConnectReason reason) {
//                    // 连接断开
//                    RXLogger.i("onDisconnect:" + reason.toString());
////                    connection(urls, cusor + 1);
//                }
//
//                @Override
//                public void onError(WsClient client, Exception ex) {
//                    connection(urls, cusor + 1);
//                    ex.printStackTrace();
//                    RXLogger.i("onError:" + cusor);
//                }
//
//                @Override
//                public void onMessage(WsClient client, String message) {
//                    // 接收到消息
//                    RXLogger.i("onMessage:" + message);
//                }
//
//                @Override
//                public void onPing(WsClient wsClient, Framedata frameData) {
//                    // ping frame
//                    RXLogger.i("onPing:" + wsClient.getServerUrl() + ":" + frameData.toString());
//                }
//
//                @Override
//                public void onPong(WsClient client, Framedata frameData) {
//                    // pong frame
//                    RXLogger.i("onPong:" + client.getServerUrl() + ":" + frameData.toString());
//                }
//
//                @Override
//                public void onSendMessage(WsClient client, String message) {
//                    // 发送数据
//                    RXLogger.i("onSendMessage:" + message.toString());
//                }
//            }).setHttpHeaders(PassportManager.getInstance().getDefaultHeaders()).setReConnectCount(0).setPingInterval(0).build();
//            // 初始化并启动连接
//            WsManager.getInstance().init(wsClient).start();
//            RXLogger.i("start connect:" + wsClient.getServerUrl());
//
//
//        }
//    }
}
