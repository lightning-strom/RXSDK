package com.ruixue.wechat;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.IntDef;

import com.ruixue.logger.RXLogger;
import com.tencent.mm.opensdk.modelbase.BaseResp;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WXCallbackManager {

    @IntDef({CallbackType.UNKNOWN, CallbackType.SENDAUTH, CallbackType.SENDMESSAGE_TO_WX, CallbackType.PAY_BY_WX, CallbackType.LAUNCH_WX_MINIPROGRAM, CallbackType.OPEN_CUSTOMER_SERVICE_CHAT})
    @Retention(RetentionPolicy.SOURCE)
    public @interface CallbackType {

        int UNKNOWN = WXConstantsAPI.COMMAND_UNKNOWN;
        /**
         * 登录授权
         */
        int SENDAUTH = WXConstantsAPI.COMMAND_SENDAUTH;
        /**
         * 分享
         */
        int SENDMESSAGE_TO_WX = WXConstantsAPI.COMMAND_SENDMESSAGE_TO_WX;
        /**
         * 支付
         */
        int PAY_BY_WX = WXConstantsAPI.COMMAND_PAY_BY_WX;

        int SUBSCRIBE_MESSAGE = WXConstantsAPI.COMMAND_SUBSCRIBE_MESSAGE;
        /**
         * 打开小程序
         */
        int LAUNCH_WX_MINIPROGRAM = WXConstantsAPI.COMMAND_LAUNCH_WX_MINIPROGRAM;

        int OPEN_CUSTOMER_SERVICE_CHAT = WXConstantsAPI.COMMAND_OPEN_CUSTOMER_SERVICE_CHAT;
        int COMMAND_OPEN_BUSINESS_VIEW = WXConstantsAPI.COMMAND_OPEN_BUSINESS_VIEW;
    }

    public interface WXConstantsAPI extends com.tencent.mm.opensdk.constants.ConstantsAPI {

    }


    public static class MockResp extends BaseResp {
        private int type;

        public MockResp(int type) {
            this.type = type;
            this.errCode = WXErrCode.ERR_RESUME;
        }

        public MockResp(int errCode, String errStr) {
            this.errCode = errCode;
            this.errStr = errStr;
        }

        @Override
        public int getType() {
            return type;
        }

        @Override
        public boolean checkArgs() {
            return false;
        }
    }

    private static final Map<Integer, WXCallback> staticCallbacks = new ConcurrentHashMap<>();
    private static WXCallback sWXCallback = null;

    public static void registerWXCallback(WXCallback callback) {
        sWXCallback = callback;
    }

    public static void registerWXCallback(int callbackType, WXCallback callback) {
        staticCallbacks.put(callbackType, callback);
    }

    public static void unregisterAllWXCallback() {
        sWXCallback = null;
        staticCallbacks.clear();
    }

    public static void unregisterWXCallback(int callbackType) {
        staticCallbacks.remove(callbackType);
    }

    public static WXCallback getWXCallback(int callbackType) {
        return staticCallbacks.get(callbackType);
    }

    public static void onResume(Context context) {
        if (staticCallbacks.size() > 0 || sWXCallback != null) {
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                if (staticCallbacks.size() > 0) {
                    for (Map.Entry<Integer, WXCallback> entry : staticCallbacks.entrySet()) {
                        RXLogger.i("onResume mock wx callback type:" + entry.getKey());
                        entry.getValue().onResp(new MockResp(entry.getKey()));
                    }
                    staticCallbacks.clear();
                }
                if (sWXCallback != null) {
                    sWXCallback.onResp(new MockResp(CallbackType.UNKNOWN));
                    sWXCallback = null;
                }
            }, 1000);
        }
    }

    public static void invokeWXCallback(BaseResp baseResp) {
        WXCallback callback = getWXCallback(baseResp.getType());
        if (null != callback) {
            callback.onResp(baseResp);
            unregisterWXCallback(baseResp.getType());
        }
        if (sWXCallback != null) {
            sWXCallback.onResp(baseResp);
            sWXCallback = null;
        }
    }
}
