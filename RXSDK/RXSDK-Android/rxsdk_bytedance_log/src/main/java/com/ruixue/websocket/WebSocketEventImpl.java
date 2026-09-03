package com.ruixue.websocket;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXException;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.sdk.bytedancelog.BytedanceLogWrapper;
import com.ruixue.sdk.bytedancelog.RxInitConfig;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/21
 */
public class WebSocketEventImpl implements ISocketListener {

//    event
//    | activated | 激活 |
//| --- | --- |
//| register | 注册 |
//| login | 登录 |
//| pay | 支付 |
//| play_session | 心跳开关，统计游戏时长，默认开启 |
//| custom | 自定义事件 |
//| on_event_v3 | 关键行为 |
//| create_game_role | 创建角色 |

    public String uuid = "";
    public JSONObject mConfig;
    public AtomicBoolean isInited = new AtomicBoolean(false);
    boolean play_session_switch = true;
    boolean auto_track_enable = true;
    //    boolean init_delay = true;
    private Activity mContext;

    public boolean isClientReport() {
        if (mConfig != null) {
            String r = mConfig.optString("method", "");
            return r.equalsIgnoreCase("client");
        }
        return true;
    }

    private static class Single {
        @SuppressLint("StaticFieldLeak")
        static WebSocketEventImpl sInstance = new WebSocketEventImpl();
    }

    public static WebSocketEventImpl getInstance() {
        return Single.sInstance;
    }

    public WebSocketEventImpl() {
        RXLogger.i("rxsdk_bytedance_log plugin is loaded success");
    }

    @Override
    public void setConfig(Activity activity, JSONObject config) {
        mContext = activity;
        if (config != null) {
            this.mConfig = config.optJSONObject("oceanengine");
        }
    }

    public boolean init() {
        if (mConfig != null && isInited.compareAndSet(false, true)) {
//            RxInitConfig rxInitConfig = new RxInitConfig(mConfig.optString("appid"), mConfig.optString("channel_id"));
//            rxInitConfig.setAutoTrackEnabled(auto_track_enable);
//            rxInitConfig.setEnablePlay(play_session_switch);
            BytedanceLogWrapper.getInstance().init(mContext);
//            if (init_delay) {
//                BytedanceLogWrapper.getInstance().init(mContext, rxInitConfig, mContext);
//            } else {
//                BytedanceLogWrapper.getInstance().init(mContext, rxInitConfig);
//            }
            return true;
        }
        return false;
    }

    @Override
    public void onMessage(RXWebSocketClient client, DataBean message) {
        try {
            Map<String, Object> ext = new HashMap<>();
            if (message.msgType == 1) {
                DataBean.BodyBean bodyBean = message.getBody();
                if (bodyBean == null || (!TextUtils.isEmpty(uuid) && uuid.equals(message.getUUID()))) {
                    client.sendAck("repeat:" + uuid);
                    RXLogger.i("WebSocketEventImpl is contains uuid:" + message.getUUID());
                    return;
                }
                String event = bodyBean.getEvent();
                BytedanceLogWrapper.getInstance().setSubEvent(event);
//                if (event.equals("activated")) {
//                    if (message.getBody() != null && message.getBody().getInfo() != null) {
//                        play_session_switch = ObjectUtils.toBoolean(message.getBody().getInfo().get("play_session_switch"));
//                        auto_track_enable = ObjectUtils.toBoolean(message.getBody().getInfo().get("auto_track_enable"));
//                        if (message.getBody().getInfo().containsKey("init_delay")) {
//                            init_delay = ObjectUtils.toBoolean(message.getBody().getInfo().get("init_delay"));
//                        }
//                    }
//                }
                init();
                if (event.equals("register")) {
                    BytedanceLogWrapper.getInstance().onEventRegister(RuiXueSdk.getLoginMethod(), true);

                } else if (event.equals("login")) {
                    BytedanceLogWrapper.getInstance().onEventLogin(RuiXueSdk.getLoginMethod(), true);

                }
//                else if (event.equals("start")) {
//                    BytedanceLogWrapper.getInstance().start();
//                }
                else if (event.equals("pay")) {
                    if (message.getBody() != null && message.getBody().getInfo() != null) {
                        String goods_type = ObjectUtils.toString(message.getBody().getInfo().get("goods_type"));
                        String goods_name = ObjectUtils.toString(message.getBody().getInfo().get("goods_name"));
                        String goods_id = ObjectUtils.toString(message.getBody().getInfo().get("goods_id"));
                        int goods_num = ObjectUtils.toInt(message.getBody().getInfo().get("goods_num"));
                        String goods_channel = ObjectUtils.toString(message.getBody().getInfo().get("goods_channel"));
                        String currency = ObjectUtils.toString(message.getBody().getInfo().get("currency"));
                        boolean success = ObjectUtils.toBoolean(message.getBody().getInfo().get("success"));
                        int amount = ObjectUtils.toInt(message.getBody().getInfo().get("amount"));
                        BytedanceLogWrapper.getInstance().onEventPurchase(goods_type, goods_name, goods_id, goods_num, goods_channel, currency, success, amount);

                    }
                } else if (event.equals("on_event_v3")) {
                    if (message.getBody() != null && message.getBody().getInfo() != null) {
                        String key = ObjectUtils.toString(message.getBody().getInfo().get("key"));
                        JSONObject value = new JSONObject((Map) Objects.requireNonNull(message.getBody().getInfo().get("value")));
                        BytedanceLogWrapper.getInstance().onEventV3(key, value);
                    } else {
                        RXLogger.i("on_event_v3 body is null");
                    }

                } else if (!TextUtils.isEmpty(event)) {
                    if (message.getBody() != null && message.getBody().getInfo() != null) {
                        BytedanceLogWrapper.getInstance().onEventV3(event, message.getBody().getInfo());
                    } else {
                        RXLogger.i(event + " event body is null.");
                    }
                }

                uuid = message.getUUID();
                ext.put("init", isInited.get());
                message.setExt(ext);
                String str = new Gson().toJson(message);
                RXLogger.i("sendAck:" + str);
                client.sendAck(str);
            }
        } catch (Exception e) {
            e.printStackTrace();
            RXLogger.i(e.getMessage());
            client.sendAck(new RXException(e).getJSONString());
        }
    }
}
