package com.ruixue.sdk;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import cn.gundam.sdk.shell.even.SDKEventKey;
import cn.gundam.sdk.shell.even.SDKEventReceiver;
import cn.gundam.sdk.shell.even.Subscribe;
import cn.gundam.sdk.shell.exception.AliLackActivityException;
import cn.gundam.sdk.shell.open.OrderInfo;
import cn.gundam.sdk.shell.open.ParamInfo;
import cn.gundam.sdk.shell.open.UCOrientation;
import cn.gundam.sdk.shell.param.SDKParamKey;
import cn.gundam.sdk.shell.param.SDKParams;
import cn.uc.gamesdk.UCGameSdk;

// Created by wangliang on 2024/4/28.
public class M9GameSdkApiImpl extends RXSdkApi {

    private static final String TAG = "M9GameSdk";

    private final M9GameBillingImpl billing;

    static class Single {
        final static M9GameSdkApiImpl INSTANCE = new M9GameSdkApiImpl();
    }

    protected M9GameSdkApiImpl() {
        //处理 billing
        billing = new M9GameBillingImpl();
    }

    @NonNull
    public static M9GameSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    private RXJSONCallback mInitCallback;
    private OnAppExitCallback mAppExitCallback;
    private RXJSONCallback mLoginCallback;
    private OnLogoutCallback mLogoutCallback;

    private final UCGameSDKEventReceiver receiver = new UCGameSDKEventReceiver();

    private class UCGameSDKEventReceiver extends SDKEventReceiver {

        @Subscribe(event = SDKEventKey.ON_INIT_SUCC)
        private void onInitSucc() {
            //初始化成功
            RXLogger.i(TAG, "9game sdk init succ");
            ThreadUtils.getMainLooperHandler().post(new Runnable() {
                @Override
                public void run() {
                    if (mInitCallback != null) {
                        mInitCallback.onSuccess(null);
                        mInitCallback = null;
                    }
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_INIT_FAILED)
        private void onInitFailed(String data) {
            //初始化失败
            RXLogger.i("9Game sdk init failed");
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mInitCallback != null) {
                    mInitCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), data));
                    mInitCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_LOGIN_SUCC)
        private void onLoginSucc(String sid) {
            RXLogger.i(TAG, "9game sdk login succ sid:" + sid);
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mLoginCallback != null) {
                    Map<String, Object> ext = new HashMap<>();
                    ext.put("sid", sid);
                    mLoginCallback.onSuccess(new JSONObject(ext));
                    mLoginCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_LOGIN_FAILED)
        private void onLoginFailed(String desc) {
            RXLogger.i(TAG, "9game sdk login failed desc:" + desc);
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mLoginCallback != null) {
                    mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), desc));
                    mLoginCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_LOGOUT_SUCC)
        private void onLogoutSucc() {
            RXLogger.i(TAG, "9game sdk logout succ");
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mLogoutCallback != null) {
                    mLogoutCallback.onSuccess(null);
                    mLogoutCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_LOGOUT_FAILED)
        private void onLogoutFailed() {
            RXLogger.i(TAG, "9game sdk logout failed");

            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mLogoutCallback != null) {
                    mLogoutCallback.onFailed(-1, "登出失败");
                    mLogoutCallback = null;
                }
            });
        }

        // MOCK：点击版本号 5 次，点击游戏名称 6 次
        @Subscribe(event = SDKEventKey.ON_ACCOUNT_SWITCH_REQUEST)
        private void onAccountSwitchRequest(final String sid) {
            RXLogger.i(TAG, "9game sdk switch account");
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (onSwitchAccount(0, "")) {
                    logout(null);
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_EXIT_SUCC)
        private void onExitSucc() {
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mAppExitCallback != null) {
                    mAppExitCallback.onExitConfirm("");
                    mAppExitCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_EXIT_CANCELED)
        private void onExitCanceled() {
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (mAppExitCallback != null) {
                    mAppExitCallback.onExitCancel();
                    mAppExitCallback = null;
                }
            });
        }

        @Subscribe(event = SDKEventKey.ON_CREATE_ORDER_SUCC)
        private void onCreateOrderSucc(OrderInfo orderInfo) {
            ThreadUtils.getMainLooperHandler().post(() -> {
                billing.onPaySucc(orderInfo);
            });
        }

        @Subscribe(event = SDKEventKey.ON_PAY_USER_EXIT)
        private void onPayUserExit(OrderInfo orderInfo) {
            ThreadUtils.getMainLooperHandler().post(() -> {
                billing.onPayUserExit(orderInfo);
            });
        }

    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        int gameId;
        try {
            String gameIdStr = AppUtils.getAppMetaData(activity, "uc_game_id");
            gameId = Integer.parseInt(gameIdStr);
        } catch (Exception e) {
            if (callback != null) {
                JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage());
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "M9Game";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
            return;
        }
        if (gameId == 0) {
            RXLogger.e("init 9game error, please check game id");
            if (callback != null) {
                JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR);
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "M9Game";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
            return;
        }

        RXLogger.i("9game sdk init gameId:" + gameId);

        // 参考 4399 可以支持横竖屏设置，默认横屏
        int screen_orientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        if (map.containsKey("screen_orientation")) {
            screen_orientation = ObjectUtils.toInt(map.get("screen_orientation"));
        }

        UCOrientation orientation = UCOrientation.LANDSCAPE;
        if (screen_orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
            orientation = UCOrientation.PORTRAIT;
        }

        mInitCallback = callback;

        ParamInfo gpi = new ParamInfo();
        gpi.setGameId(gameId);
        gpi.setOrientation(orientation);

        SDKParams sdkParams = new SDKParams();
        sdkParams.put(SDKParamKey.GAME_PARAMS, gpi);

        boolean hadRequestPermission = false;
        if (map.containsKey("had_req_permission")) {
            hadRequestPermission = ObjectUtils.toBoolean(map.get("had_req_permission"));
        }

        // 如果游戏已经申请了权限，不想sdk主动请求权限，要通过SDKParamKey.GAME_HAD_REQUEST_PERMISSION参数告知九游sdk
        // true 游戏已经弹了，SDK不需要弹出权限申请窗
        // false 游戏没有弹，SDK可以按需弹出权限申请窗
        sdkParams.put(SDKParamKey.GAME_HAD_REQUEST_PERMISSION, hadRequestPermission);

        try {
            UCGameSdk.defaultSdk().initSdk(activity, sdkParams);
        } catch (AliLackActivityException e) {
            RXLogger.e(TAG, "init failed " + e.getMessage());
            if (callback != null) {
                JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR);
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "M9Game";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
            mInitCallback = null;
        }
    }

    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.M9GAME);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        try {
            mLoginCallback = callback;
            UCGameSdk.defaultSdk().login(activity, null);
        } catch (Exception e) {
            RXLogger.e("login failed " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR));
            }
            mLoginCallback = null;
        }
        return true;
    }

    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        try {
            mLogoutCallback = callback;
            UCGameSdk.defaultSdk().logout(RuiXueSdk.getCurrentActivity(), null);
        } catch (Exception e) {
            callback.onFailed(-1, "登出失败");
            mLogoutCallback = null;
        }
        return true;
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> map, RXJSONCallback callback) {
        billing.pay(activity, map, callback);
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        try {
            mAppExitCallback = callback;
            UCGameSdk.defaultSdk().exit(activity, null);
        } catch (Exception e) {
            RXLogger.i("uc game exit failed " + e.getMessage());
            if (callback != null) {
                callback.onExitCancel();
            }
            mAppExitCallback = null;
        }
        return true;
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
        UCGameSdk.defaultSdk().registerSDKEventReceiver(receiver);
    }

    @Override
    public void onDestroy(Activity activity) {
        super.onDestroy(activity);
        UCGameSdk.defaultSdk().unregisterSDKEventReceiver(receiver);
        clearCallback();
    }

    private void clearCallback() {
        mInitCallback = null;
        mLoginCallback = null;
        mLogoutCallback = null;
        mAppExitCallback = null;
    }
}
