package com.ruixue.sdk;


import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.GameExitCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

// Created by wangliang on 2025/5/28.
public class OverseasOppoSdkApiImpl extends RXSdkApi {

    private final String[] PLUGIN_NAME = new String[]
            {
                    "RX_PLUGIN_FACEBOOK",
                    "RX_PLUGIN_GOOGLE",
                    "RX_PLUGIN_FIREBASE",
                    "RX_PLUGIN_LINE",
                    "RX_PLUGIN_ADJUST",
                    "RX_PLUGIN_ZALO",
                    "RX_PLUGIN_TIKTOK",
                    "RX_PLUGIN_SNAPCHAT",
                    "RX_PLUGIN_INSTAGRAM",
                    "RX_PLUGIN_REDDIT",
                    "RX_PLUGIN_TOPON"
            };


    static class Single {
        final static OverseasOppoSdkApiImpl INSTANCE = new OverseasOppoSdkApiImpl();
    }
    @NonNull
    public static OverseasOppoSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder()
                .setName("gl_oppo")
                .setState(1)
                .setVersion(RuiXueSdk.getSdkVersion())
                .build();
    }

    private BillingClient billingClient;

    public OverseasOppoSdkApiImpl() {
        billingClient = new OppoOverseasBillingImpl();
    }

    private AtomicBoolean isInited = new AtomicBoolean(false);

    public boolean IsInited() {
        return isInited.get();
    }


    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        String appSecret = null;
        if (map != null && map.containsKey("appSecret")) {
            appSecret = (String) map.get("appSecret");
        }
        if (!TextUtils.isEmpty(appSecret)) {
            GameCenterSDK.init(appSecret, activity);
            isInited.set(true);
            if (callback != null) {
                callback.onSuccess(null);
            }
        } else if (callback != null) {
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR);
            callback.onFailed(jsonObject);
            RxErrorReportUtil.ThirdInitError.isError = true;
            RxErrorReportUtil.ThirdInitError.thirdName = "gl_oppo";
            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
        }
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        super.login(activity, hashMap, callback);
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        if (isInited.get()) {
            GameCenterSDK.getInstance().onExit(activity, new GameExitCallback() {
                @Override
                public void exitGame() {
                    if (callback != null) {
                        callback.onExitConfirm("");
                    }
                }
            });
        }
        return isInited.get();
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
