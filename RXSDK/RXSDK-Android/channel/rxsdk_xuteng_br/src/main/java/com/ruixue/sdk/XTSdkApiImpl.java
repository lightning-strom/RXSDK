package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.brsdk.android.bean.BRSdkPay;
import com.brsdk.android.bean.BRSdkRole;
import com.brsdk.android.bean.BRSdkState;
import com.brsdk.android.bean.BRSdkUser;
import com.brsdk.android.core.BRSdkApi;
import com.brsdk.android.event.BREventListener;
import com.brsdk.android.utils.BRCrash;
import com.ruixue.RXCallbackWrapper;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public class XTSdkApiImpl extends RXSdkApi implements BREventListener {

    private XTBillingImpl billingClient;
    private AtomicBoolean isInited = new AtomicBoolean(false);
    private AtomicBoolean event = new AtomicBoolean(false);
    RXJSONCallback loginCallback;
    RXCallbackWrapper initCallback;

    @Override
    public void onProtocolEnd(BRSdkState brSdkState) {
        RXLogger.d("onProtocolEnd " + brSdkState.toString());
        setPrivacyAgree(Objects.requireNonNull(RXGlobalData.getContext()), brSdkState.isSuccess(), null);
    }

    @Override
    public void onInitFinished(BRSdkState brSdkState) {
        RXLogger.d("onInitFinished" + brSdkState.toString());
        if (initCallback != null) {
            if (brSdkState.isSuccess()) {
                initCallback.onSuccess(null);
            } else {

                initCallback.onFailed(RXErrorCode.INIT_PARAMS_ERROR.toJSONObject());
            }
        }
    }

    @Override
    public void onLoginFinished(BRSdkState brSdkState, BRSdkUser brSdkUser) {
        RXLogger.d("onLoginFinished" + brSdkState.toString());
        if (loginCallback != null) {
            if (brSdkState.isSuccess()) {
                Map<String, Object> map = new HashMap<>();
                map.put("openId", brSdkUser.getUid());
                map.put("token", brSdkUser.getToken());

                loginCallback.onSuccess(new JSONObject(map));
            } else if (brSdkState.isCancel()) {
                loginCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
            } else {
                loginCallback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject());
            }
            loginCallback = null;
        }
    }

    @Override
    public void onPayFinished(BRSdkState brSdkState, BRSdkPay brSdkPay) {
        RXLogger.d("onPayFinished" + brSdkState.toString());
        billingClient.onPayFinished(brSdkState, brSdkPay);
    }

    @Override
    public void onUpRoleFinished(BRSdkState brSdkState, BRSdkRole brSdkRole) {
        RXLogger.d("onUpRoleFinished" + brSdkState.toString());

    }

    @Override
    public void onLogoutFinished(BRSdkState brSdkState) {
        RXLogger.d("onLogoutFinished" + brSdkState.toString());
        if (brSdkState.isSuccess()) {
            ruixueLogout(null);
        }
    }

    @Override
    public void onExitFinished(BRSdkState brSdkState) {
        RXLogger.d("onExitFinished" + brSdkState.toString());
    }


    static class Single {
        final static XTSdkApiImpl INSTANCE = new XTSdkApiImpl();
    }

    protected XTSdkApiImpl() {
        billingClient = new XTBillingImpl();
    }

    public static XTSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        BRSdkApi.getInstance().onAppCreate(application);

    }

    @Override
    public void attachBaseContext(Context context) {
        BRCrash.getInstance().install(context);
        super.attachBaseContext(BRSdkApi.getInstance().onAttach(context));
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity, savedInstanceState);
        if (event.compareAndSet(false, true)) {
            BRSdkApi.getInstance().setEventListener(this);
        }

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        BRSdkApi.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
        BRSdkApi.getInstance().onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {
        super.onConfigurationChanged(activity, newConfig);
        BRSdkApi.getInstance().onConfiguration(newConfig);
    }

    @Override
    public void onBackPressed() {
        BRSdkApi.getInstance().onExit();
    }


    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isInited.get()) {
            Log.e("rxsdk", "please initThirdSdk first");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "error not initialized"));
        } else {
            loginCallback = callback;
            BRSdkApi.getInstance().onLogin();
        }
        return true;
    }


    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack) {

        super.setPrivacyAgree(context, privacyCallBack);
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (event.compareAndSet(false, true)) {
            BRSdkApi.getInstance().setEventListener(this);
        }

        activity.runOnUiThread(() -> {
            try {
                if (isInited.compareAndSet(false, true)) {
                    BRSdkApi.getInstance().onInit();
                    initCallback = new RXCallbackWrapper(callback, 1, 10000);
//                        BRSdkApi.getInstance().showProtocol();
                } else {

                    callback.onSuccess(null);
                }
            } catch (Exception | NoClassDefFoundError e) {
                e.printStackTrace();
                RXLogger.e("rx init xuteng sdk params error. detail see console log");
                RX
                if (callback != null) {
                    JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), e.getMessage());
                    callback.onFailed(jsonObject);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = LoginMethod.XUTENG;
                    RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                }
            }
        });
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.XUTENG);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        BRSdkApi.getInstance().onLogout();
        super.logout(callback);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("xuteng").setVersion(AppUtils.getAppMetaData(RuiXueSdk.getContext(), "vivo_union_sdk")).build();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName() + "&th_name=need_comment", "com.bbk.appstore");
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        BRSdkApi.getInstance().onExit();
        return super.exitApp(activity, callback);

    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {

        billingClient.pay(activity, hashMap, callback);
    }

    BRSdkRole brSdkRole;

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        brSdkRole = new BRSdkRole().setRoleId(gameInfo.getRoleId()).setRoleName(gameInfo.getRoleName()).setRoleLevel(gameInfo.getGameRoleLevel()).setServerId(gameInfo.getServerId()).setServerName(gameInfo.getServerName()).setBalance(gameInfo.getBalance()).setCreateTime(gameInfo.getRoleCreateTimeString()).setPartyId(gameInfo.getPartyId()).setPartyName(gameInfo.getPartyName()).setVipLevel(String.valueOf(gameInfo.getVipLevel())).setRolePower(String.valueOf(gameInfo.getGameRolePower()));
        BRSdkRole.Event event = BRSdkRole.Event.unknown; // 默认进入游戏
//        /操作类型（1-4）1：⻆⾊创建2：进⼊游戏3：⻆⾊升级4：⻆⾊退出
        if (gameInfo.Type() == 1) {
            event = BRSdkRole.Event.create;
        } else if (gameInfo.Type() == 2) {
            event = BRSdkRole.Event.online;
        } else if (gameInfo.Type() == 3) {
            event = BRSdkRole.Event.levelUp;
        } else if (gameInfo.Type() == 4) {
            event = BRSdkRole.Event.offline;
        }
        brSdkRole.setRoleEvent(event);
        BRSdkApi.getInstance().onUpRole(brSdkRole);
        super.setGameInfo(gameInfo);
    }
}
