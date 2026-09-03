package com.ruixue.websocket;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/21
 */
public class RXWebSocketClient {

    OkHttpClient mOkHttpClient;

    WebSocket mWebSocket;

    ISocketListener mMsgListener;

    boolean reconnectAble;
    AtomicBoolean isConnecting = new AtomicBoolean(false);
    Request mRequest;
    long reConnectInterval = 5000;

    /**
     * 服务端地址
     */
    private final String serverUrl;

    public void setMsgListener(ISocketListener mMsgListener) {
        this.mMsgListener = mMsgListener;
    }

    public RXWebSocketClient(String serverUrl, Map<String, String> headers) {
        this.serverUrl = serverUrl;
        mOkHttpClient = new OkHttpClient.Builder().connectTimeout(30, TimeUnit.SECONDS).build();
        Request.Builder reqBuilder = new Request.Builder();
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            reqBuilder.addHeader(entry.getKey(), entry.getValue());
        }
        mRequest = reqBuilder.url(serverUrl).build();
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void connect() {
        if (isConnecting.compareAndSet(false, true))
            mWebSocket = mOkHttpClient.newWebSocket(mRequest, new RXWebSocketListener());
    }

    public void reconnect() {
        RXLogger.i(serverUrl + " will reconnect after:" + reConnectInterval);
        ThreadUtils.getInstance().runOnBgThreadDelayUseExecutor(this::connect, reConnectInterval);
    }

    public void send(String msg) {
        if (mWebSocket != null) {
            mWebSocket.send(msg);
        }
    }

    public void sendAck(String msgstr) {
        if (mWebSocket != null) {
            Map<String, Object> msg = new HashMap<>();
            msg.put("msg_type", 99);
            msg.put("msg", msgstr);
            mWebSocket.send(new JSONObject(msg).toString());
        }
    }

    public void close() {
        reconnectAble = false;
        try {
            if (mWebSocket != null) {
                mWebSocket.close(-1, "client closed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public class RXWebSocketListener extends WebSocketListener {
        @Override
        public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
            RXLogger.i(serverUrl + " onOpen");
            isConnecting.set(false);
            reconnectAble = true;
        }

        @Override
        public void onMessage(@NonNull WebSocket webSocket, @NonNull String text) {
            isConnecting.set(false);
            RXLogger.i(serverUrl + " onMessage:" + text);
            if (mMsgListener != null) {
                DataBean dataBean = DataBean.objectFromData(text);
                if (dataBean != null) {
                    if (dataBean.msgType == -1) {
                        close();
                    } else {
                        mMsgListener.onMessage(RXWebSocketClient.this, dataBean);
                    }
                } else {
                    RXLogger.e(serverUrl + " onMessage:" + text);
                }
            }
        }

        @Override
        public void onMessage(@NonNull WebSocket webSocket, @NonNull ByteString bytes) {
            String str = new String(bytes.toByteArray(), StandardCharsets.UTF_8);
            onMessage(webSocket, str);
        }

        @Override
        public void onClosing(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
            RXLogger.e(serverUrl + " onClosing:" + code + "  reason:" + reason);
            if (reconnectAble && code != 1000) {
                reconnect();
            }
        }

        @Override
        public void onClosed(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
            super.onClosed(webSocket, code, reason);
            isConnecting.set(false);
            RXLogger.e("onClosed:" + code + "  reason:" + reason);
            if (reconnectAble && code != 1000) {
                reconnect();
            }
        }

        @Override
        public void onFailure(@NonNull WebSocket webSocket, Throwable t, Response response) {
            super.onFailure(webSocket, t, response);
            isConnecting.set(false);
            RXLogger.e(serverUrl + " onFailure:" + t.getMessage() + " reconnectAble:" + reconnectAble);
//        t.printStackTrace();
            if (reconnectAble) {
                reconnect();
            } else {
                Map<String, Object> msg = new HashMap<>();
                msg.put("msg", t.getMessage());
                msg.put("result", response.toString());
                RXSdkApi.getInstance().dataTrack("#rxsdk_wssFail", "", msg);
            }
        }
    }
}
