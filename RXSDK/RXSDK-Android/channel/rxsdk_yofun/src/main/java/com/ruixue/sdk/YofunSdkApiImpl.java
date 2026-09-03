package com.ruixue.sdk;


import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.netease.yofun.external.Api;
import com.netease.yofun.external.GameEventInfo;
import com.netease.yofun.external.GameEventType;
import com.netease.yofun.external.HubCode;
import com.netease.yofun.external.data.PayInfo;
import com.netease.yofun.external.data.UserInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.HubActionAdapter;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class YofunSdkApiImpl extends RXSdkApi {

    public final String TAG = "YofunSdkApiImpl";

    //To handle action result
    private final HubActionAdapter mAction = new HubActionAdapter() {

        @Override
        public void onInit(int code, String msg) {
            super.onInit(code, msg);
            RXJSONCallback callback = mInitCallback;
            mInitCallback = null;
            if (callback == null)
                return;
            if (code == HubCode.OK) {
                callback.onSuccess(null);
            } else {
                callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject(code, msg));
            }
        }

        @Override
        public void onLogin(int code, String msg, UserInfo info) {
            // 请处理登录事件
            Log.d("onLogin", (code == HubCode.OK ? info.toString() : "fail:" + code));
            RXJSONCallback callback = mLoginCallBack;
            mLoginCallBack = null;
            if (callback != null) {
                if (code == HubCode.OK) {
                    Map<String, Object> loginData = new HashMap<>();

                    loginData.put("user_id", info.getUid());
                    loginData.put("channel_token", info.getToken());
                    loginData.put("nickname", info.getNickName());
                    loginData.put("avatar", info.getAvatarUrl());

                    try {
                        loginData.put("sex", (int) info.getGender());
                    }catch (Exception e) {
                        e.printStackTrace();
                    }

                    callback.onSuccess(JSONUtil.toJSONObject(loginData));
                } else {
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(code, msg));
                }
            }
        }

        @Override
        public void onPay(int code, String msg, PayInfo info) {
            // 请处理支付的结果
            Log.d("onPay", (code == HubCode.OK ? info.toString() : "fail:" + code));

            if (mPayRXJSONCallback != null) {
                if (code == HubCode.OK) {
                    mPayRXJSONCallback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    info.toString())
                    );
                }else {
                    mPayRXJSONCallback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR.getValue(),
                                    msg)
                    );
                }
            }
        }

        @Override
        public void onLogout(int code) {
            // 请处理账户登出事件
            Log.d("onLogout", "called code:" + code);
            if (ruiXueSdkCallback != null) {
                ruiXueSdkCallback.onLogout(0, "");
            }
            if (mOnLogoutCallback != null) {
                mOnLogoutCallback.onSuccess("");
            }
        }

        @Override
        public void onQuit(boolean realQuit) {
            Log.d("onQuit", "called");
            if (mAppExitCallback != null) {
                if (realQuit) {
                    mAppExitCallback.onExitConfirm("");
                }else {
                    mAppExitCallback.onExitCancel();
                }
            }
            if (ruiXueSdkCallback != null && realQuit) {
                ruiXueSdkCallback.exitApp();
            }
        }

        @Override
        public void onIsShowingSdkUi(boolean isShowing) {
            if (ruiXueSdkCallback != null) {
                if (isShowing) {
                    // 请在收到该回调时，主动恢复游戏内容的暂停操作
                    Log.d("onIsShowingSdkUi", "sdk UI 正在展示");
                    ruiXueSdkCallback.rxPublicCallback(1, null);
                } else {
                    Log.d("onIsShowingSdkUi", "sdk UI 已经隐藏");
                    ruiXueSdkCallback.rxPublicCallback(2, null);
                }
            }
        }
    };

    private RXJSONCallback mInitCallback;
    private RXJSONCallback mLoginCallBack;
    private OnAppExitCallback mAppExitCallback;

    private OnLogoutCallback mOnLogoutCallback;

    private RXJSONCallback mPayRXJSONCallback;

    private YofunBillingImpl billingClient;

    static class Single {
        final static YofunSdkApiImpl INSTANCE = new YofunSdkApiImpl();
    }

    protected YofunSdkApiImpl() {
        billingClient = new YofunBillingImpl();
    }

    public static YofunSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void attachBaseContext(Context context) {
        super.attachBaseContext(context);
        YofunSdkHelper.install(context);
        if (context instanceof Application) {
            YofunSdkHelper.applicationAttach((Application) context);
        } else {
            RXLogger.e("yofun applicationAttach skipped: context is not Application");
        }
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        YofunSdkHelper.applicationCreate(application);
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        Boolean debugMode = parseDebugMode(map);
        if (debugMode != null) {
            YofunSdkHelper.setDebugMode(debugMode);
        }
        mInitCallback = callback;
        Api.getInstance().register(mAction);
        Api.getInstance().init(activity);
    }

    @Override
    public void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback) {
        if (RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH.equals(action)) {
            int splashType = parseSplashType(params);
            if (splashType < 0) {
                notifyChannelActionFailed(action, "splashType must be 0, 1, or 2", callback);
                return;
            }
            AtomicBoolean completed = new AtomicBoolean(false);
            try {
                YofunSdkHelper.displayChannelLogo(activity, splashType, () -> {
                    if (completed.compareAndSet(false, true)) {
                        notifyChannelActionSuccess(action, callback);
                    }
                });
            } catch (RuntimeException e) {
                if (completed.compareAndSet(false, true)) {
                    notifyChannelActionFailed(action, "showSplash failed: " + e.getMessage(), callback);
                }
            }
            return;
        }
        if (RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW.equals(action)
                || RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW.equals(action)) {
            notifyChannelActionFailed(action, "MuMu channel does not support " + action, callback);
            return;
        }
        super.invokeChannelAction(activity, action, params, callback);
    }

    static int parseSplashType(@Nullable Map<String, Object> params) {
        if (params == null || !params.containsKey(RuiXueSdk.CHANNEL_ACTION_PARAM_SPLASH_TYPE)) {
            return 0;
        }
        Object value = params.get(RuiXueSdk.CHANNEL_ACTION_PARAM_SPLASH_TYPE);
        int type;
        if (value instanceof Number) {
            double number = ((Number) value).doubleValue();
            type = ((Number) value).intValue();
            if (number != type) {
                return -1;
            }
        } else if (value instanceof String) {
            try {
                type = Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return -1;
            }
        } else {
            return -1;
        }
        return type >= 0 && type <= 2 ? type : -1;
    }

    static boolean isSupportedChannelAction(String action) {
        return RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH.equals(action);
    }

    @Nullable
    private static Boolean parseDebugMode(@Nullable Map<String, Object> params) {
        if (params == null || !params.containsKey(RuiXueSdk.CHANNEL_INIT_PARAM_DEBUG_MODE)) {
            return null;
        }
        Object value = params.get(RuiXueSdk.CHANNEL_INIT_PARAM_DEBUG_MODE);
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue() != 0;
        }
        if (value instanceof String) {
            return Boolean.parseBoolean((String) value);
        }
        return null;
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        this.mLoginCallBack = callback;
        Log.d(TAG, "执行登录。。。。");
        Api.getInstance().login(activity);
        return true;

    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.MUMU);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        super.logout(callback);
        this.mOnLogoutCallback = callback;
        if (RuiXueSdk.getCurrentActivity() != null) {
            Api.getInstance().logout(RuiXueSdk.getCurrentActivity());
        }
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        this.mAppExitCallback = callback;
        Api.getInstance().quit(activity);
        return true;

    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> map, RXJSONCallback callback) {
//        super.pay(activity, map, callback);
        this.mPayRXJSONCallback = callback;
        billingClient.pay(activity, map, callback);
    }

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("yofun setGameInfo skipped: gameInfo is null");
            return;
        }
        Activity activity = RuiXueSdk.getCurrentActivity();
        if (activity == null) {
            RXLogger.e("yofun setGameInfo skipped: current activity is null");
            super.setGameInfo(gameInfo);
            return;
        }

        GameEventType eventType = mapGameEventType(gameInfo.Type());
        if (eventType == null) {
            RXLogger.i("yofun setGameInfo ignored unsupported type: " + gameInfo.Type());
            super.setGameInfo(gameInfo);
            return;
        }

        String roleId = defaultIfEmpty(gameInfo.getRoleId(), "0");
        String serverId = defaultIfEmpty(gameInfo.getServerId(), "1");
        GameEventInfo eventInfo = new GameEventInfo.GameEventInfoBuilder()
                .eventType(eventType)
                .roleId(roleId)
                .roleName(defaultIfEmpty(gameInfo.getRoleName(), roleId))
                .serverId(serverId)
                .serverName(defaultIfEmpty(gameInfo.getServerName(), serverId))
                .roleLevel(parseLong(gameInfo.getGameRoleLevel(), 1L))
                .roleType(resolveRoleType(gameInfo))
                .partyName(defaultIfEmpty(gameInfo.getPartyName(), ""))
                .powerNum(gameInfo.getGameRolePower())
                .gameVipLevel(gameInfo.getVipLevel())
                .gameMoney(parseLong(gameInfo.getBalance(), 0L))
                .build();
        Api.getInstance().uploadGameEventInfo(activity, eventInfo);
        super.setGameInfo(gameInfo);
    }

    @Override
    public void unregisterPlugin(IPluginSdk thirdSdk) {
        super.unregisterPlugin(thirdSdk);
        Api.getInstance().unregister(mAction);
    }

    private GameEventType mapGameEventType(int type) {
        if (type == 1) {
            return GameEventType.ROLE_CREATE_SUCCESS;
        }
        if (type == 2) {
            return GameEventType.LOGIN_SUCCESS;
        }
        if (type == 3) {
            return GameEventType.ROLE_UPGRADE;
        }
        return null;
    }

    private long parseLong(String value, long defaultVal) {
        if (TextUtils.isEmpty(value)) {
            return defaultVal;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ignore) {
            return defaultVal;
        }
    }

    private String defaultIfEmpty(String value, String defaultVal) {
        return TextUtils.isEmpty(value) ? defaultVal : value;
    }

    private String resolveRoleType(GameInfo gameInfo) {
        String attach = gameInfo.getAttach();
        if (TextUtils.isEmpty(attach)) {
            return "";
        }
        try {
            JSONObject ext = new JSONObject(attach);
            String roleType = ext.optString("roleType");
            if (!TextUtils.isEmpty(roleType)) {
                return roleType;
            }
            return ext.optString("profession", "");
        } catch (JSONException ignore) {
            return "";
        }
    }


}
