package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.quicksdk.Extend;
import com.quicksdk.QuickSDK;
import com.quicksdk.Sdk;
import com.quicksdk.User;
import com.quicksdk.entity.UserInfo;
import com.quicksdk.notifier.ExitNotifier;
import com.quicksdk.notifier.InitNotifier;
import com.quicksdk.notifier.LoginNotifier;
import com.quicksdk.notifier.LogoutNotifier;
import com.quicksdk.notifier.SwitchAccountNotifier;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/21
 */
public class QuickSdkApiImpl extends RXSdkApi {

    private static final String TAG = "QuickSdk";

    private final QuickBillingImpl billing;

    static class Single {
        final static QuickSdkApiImpl INSTANCE = new QuickSdkApiImpl();
    }

    protected QuickSdkApiImpl() {
        //处理 billing
        billing = new QuickBillingImpl();
    }

    @NonNull
    public static QuickSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    private RXJSONCallback mInitCallback;
    private RXJSONCallback mLoginCallback;
    private OnAppExitCallback mAppExitCallback;

    /**
     * 设置通知，用于监听初始化，登录，注销，支付及退出功能的返回值
     */
    private void initQkNotifiers() {
        QuickSDK.getInstance()
                // 1.设置初始化通知(必接)
                .setInitNotifier(new InitNotifier() {

                    @Override
                    public void onSuccess() {
                        RXLogger.d("quick init success");
                        if (mInitCallback != null) {
                            mInitCallback.onSuccess(null);
                            mInitCallback = null;
                        }
                    }

                    @Override
                    public void onFailed(String message, String trace) {
                        RXLogger.d("quick init failed " + message + ", trace:" + trace);
                        if (mInitCallback != null) {
                            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), message);
                            mInitCallback.onFailed(jsonObject);
                            mInitCallback = null;
                            RxErrorReportUtil.ThirdInitError.isError = true;
                            RxErrorReportUtil.ThirdInitError.thirdName = "quick";
                            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                        }
                    }
                })
                // 2.设置登录通知(必接)
                .setLoginNotifier(new LoginNotifier() {

                    @Override
                    public void onSuccess(UserInfo userInfo) {
                        if (userInfo != null) {
                            RXLogger.d("WLTest", "uid:" + userInfo.getUID() + ", token:" + userInfo.getToken() + ", username:" + userInfo.getUserName());
                            Map<String, Object> ext = new HashMap<>();
                            ext.put("uid", userInfo.getUID());
                            ext.put("parent_channel_type", Extend.getInstance().getParentChannelType());
                            ext.put("token", userInfo.getToken());
                            if (mLoginCallback != null) {
                                mLoginCallback.onSuccess(new JSONObject(ext));
                            }
                        } else {
                            RXLogger.d("quick login params null");
                            if (mLoginCallback != null) {
                                mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), "user info is null"));
                            }
                        }
                    }

                    @Override
                    public void onCancel() {
                        RXLogger.d("quick login cancel");
                        if (mLoginCallback != null) {
                            mLoginCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
                        }
                    }

                    @Override
                    public void onFailed(final String message, String trace) {
                        RXLogger.d("quick login failed " + message + ", trace:" + trace);
                        if (mLoginCallback != null) {
                            mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), message));
                        }
                    }

                })
                // 3.设置注销通知(必接)
                .setLogoutNotifier(new LogoutNotifier() {

                    @Override
                    public void onSuccess() {
                        RXLogger.d("quick logout success");
                        if (mLogoutCallback != null) {
                            mLogoutCallback.onSuccess("");
                            mLogoutCallback = null;
                        } else {
                            PassportManager.getInstance().logout();
                            if (ruiXueSdkCallback != null) {
                                ruiXueSdkCallback.onLogout(0, "");
                            }
                        }
                    }

                    @Override
                    public void onFailed(String message, String trace) {
                        RXLogger.d("quick logout failed " + message + ", trace:" + trace);
                        if (mLogoutCallback != null) {
                            mLogoutCallback.onFailed(-1, message);
                            mLogoutCallback = null;
                        } else {
                            if (ruiXueSdkCallback != null) {
                                ruiXueSdkCallback.onLogout(-1, message);
                            }
                        }
                    }

                })
                // 4.设置切换账号通知(必接)
                .setSwitchAccountNotifier(new SwitchAccountNotifier() {

                    @Override
                    public void onSuccess(UserInfo userInfo) {
                        if (onSwitchAccount(0, "")) {
                            logout(null);
                        }
                        if (userInfo != null) {
                            RXLogger.d("quick switch account success");
                            RXLogger.d("WLTest", "");
                            Map<String, Object> ext = new HashMap<>();
                            ext.put("uid", userInfo.getUID());
                            ext.put("username", userInfo.getUserName());
                            ext.put("token", userInfo.getToken());
                            if (mLoginCallback != null) {
                                mLoginCallback.onSuccess(new JSONObject(ext));
                            }
                        }
                    }

                    @Override
                    public void onFailed(String message, String trace) {
                        RXLogger.d("quick switch account failed " + message + ", trace:" + trace);
                    }

                    @Override
                    public void onCancel() {
                        RXLogger.d("quick switch account cancel");
                    }
                })
                // 5.设置退出通知(必接)
                .setExitNotifier(new ExitNotifier() {

                    @Override
                    public void onSuccess() {
                        RXLogger.d("quick exit success");
                        if (mAppExitCallback != null) {
                            mAppExitCallback.onExitConfirm("");
                            mAppExitCallback = null;
                        }
                    }

                    @Override
                    public void onFailed(String message, String trace) {
                        RXLogger.d("quick exit failed, message:" + message + ", trace:" + trace);
                        if (mAppExitCallback != null) {
                            mAppExitCallback.onExitCancel();
                            mAppExitCallback = null;
                        }
                    }
                });
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        if (map == null) {
            if (callback != null) {
                JSONObject jsonObject = RXErrorCode.INIT_PARAMS_ERROR.toJSONObject();
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "quick";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
            return;
        }
        String productCode =map.containsKey("quick_product_code")? (String) map.get("quick_product_code"):(String) map.get("product_code");
        String productKey =map.containsKey("quick_product_key")?  (String) map.get("quick_product_key"):(String) map.get("product_key");
        if (TextUtils.isEmpty(productCode) || TextUtils.isEmpty(productKey)) {
            if (callback != null) {
                JSONObject jsonObject = RXErrorCode.INIT_PARAMS_ERROR.toJSONObject();
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "quick";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
            return;
        }
        initQkNotifiers();
        mInitCallback = callback;

        Sdk.getInstance().init(activity, productCode, productKey);
    }


    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.QUICK);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        mLoginCallback = callback;
        User.getInstance().login(activity);
        return true;
    }

    private OnLogoutCallback mLogoutCallback;

    @Override
    public void logout(OnLogoutCallback callback) {
        super.logout(callback);
    }

    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        mLogoutCallback = callback;
        User.getInstance().logout(RuiXueSdk.getCurrentActivity());
        return true;
    }


    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billing.pay(activity, hashMap, callback);
    }

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("quick setGameInfo skipped: gameInfo is null");
            return;
        }
        Activity activity = RuiXueSdk.getCurrentActivity();
        if (activity == null) {
            RXLogger.e("quick setGameInfo skipped: current activity is null");
            super.setGameInfo(gameInfo);
            return;
        }

        RXGameRoleInfo roleInfo = new RXGameRoleInfo();
        String serverId = defaultIfEmpty(gameInfo.getServerId(), "1");
        String roleId = defaultIfEmpty(gameInfo.getRoleId(), "0");
        roleInfo.setServerID(serverId);
        roleInfo.setServerName(defaultIfEmpty(gameInfo.getServerName(), serverId));
        roleInfo.setGameRoleID(roleId);
        roleInfo.setGameRoleName(defaultIfEmpty(gameInfo.getRoleName(), roleId));
        roleInfo.setGameUserLevel(defaultIfEmpty(gameInfo.getGameRoleLevel(), "1"));
        roleInfo.setVipLevel(String.valueOf(gameInfo.getVipLevel()));
        roleInfo.setGameBalance(defaultIfEmpty(gameInfo.getBalance(), "0"));
        roleInfo.setPartyName(defaultIfEmpty(gameInfo.getPartyName(), ""));
        roleInfo.setPartyId(defaultIfEmpty(gameInfo.getPartyId(), ""));
        roleInfo.setGameRolePower(String.valueOf(gameInfo.getGameRolePower()));
        roleInfo.setRoleCreateTime(toUnixSecondsString(gameInfo.getRoleCreateTime()));
        applyAttachExt(roleInfo, gameInfo.getAttach());

        boolean createRole = gameInfo.Type() == 1;
        User.getInstance().setGameRoleInfo(activity, roleInfo, createRole);
        super.setGameInfo(gameInfo);
    }

    private static String defaultIfEmpty(String value, String defaultValue) {
        return TextUtils.isEmpty(value) ? defaultValue : value;
    }

    private static String toUnixSecondsString(long timestamp) {
        long raw = timestamp > 0 ? timestamp : System.currentTimeMillis();
        long seconds = raw >= 100000000000L ? raw / 1000L : raw;
        return String.valueOf(seconds);
    }

    private void applyAttachExt(RXGameRoleInfo roleInfo, String attach) {
        if (TextUtils.isEmpty(attach)) {
            return;
        }
        try {
            JSONObject ext = new JSONObject(attach);
            roleInfo.setGameRoleGender(ext.optString("gameRoleGender", ""));
            roleInfo.setPartyRoleId(ext.optString("partyRoleId", ""));
            roleInfo.setPartyRoleName(ext.optString("partyRoleName", ""));
            roleInfo.setProfessionId(ext.optString("professionId", ""));
            roleInfo.setProfession(ext.optString("profession", ""));
            roleInfo.setFriendlist(ext.optString("friendlist", ""));
        } catch (Exception e) {
            RXLogger.w("quick setGameInfo attach parse failed: " + e.getMessage());
        }
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        mAppExitCallback = callback;
        Sdk.getInstance().exit(activity);
        return true;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        Sdk.getInstance().onActivityResult(activity, requestCode, resultCode, data);
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
        Sdk.getInstance().onCreate(activity);
    }

    @Override
    public void onStart(Activity activity) {
        super.onStart(activity);
        Sdk.getInstance().onStart(activity);
    }

    @Override
    public void onRestart(Activity activity) {
        super.onRestart(activity);
        Sdk.getInstance().onRestart(activity);
    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        Sdk.getInstance().onResume(activity);
    }

    @Override
    public void onPause(Activity activity) {
        super.onPause(activity);
        Sdk.getInstance().onPause(activity);
    }

    @Override
    public void onStop(Activity activity) {
        super.onStop(activity);
        Sdk.getInstance().onStop(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        super.onDestroy(activity);
        Sdk.getInstance().onDestroy(activity);
    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        super.onNewIntent(activity, intent);
        Sdk.getInstance().onNewIntent(intent);
    }
}
