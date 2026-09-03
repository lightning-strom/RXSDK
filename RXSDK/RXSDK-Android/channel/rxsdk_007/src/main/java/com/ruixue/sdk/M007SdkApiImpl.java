package com.ruixue.sdk;


import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
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
import com.sdk007.lib.SDK007Manager;
import com.sdk007.lib.cp.LogoutResult;
import com.sdk007.lib.cp.UserResult;
import com.sdk007.lib.listener.OnExitListener;
import com.sdk007.lib.listener.OnInitListener;
import com.sdk007.lib.listener.OnLogoutListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wangliang on 2024/11/12
 */
public class M007SdkApiImpl extends RXSdkApi {

    private static final String TAG = "M007Sdk";

    private final M007BillingImpl billing;

    static class Single {
        final static M007SdkApiImpl INSTANCE = new M007SdkApiImpl();
    }

    protected M007SdkApiImpl() {
        //处理 billing
        billing = new M007BillingImpl();
    }

    @NonNull
    public static M007SdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        // 1.初始化SDK
        SDK007Manager.getInstance().initSDK(activity, new OnInitListener() {
            @Override
            public void onSuccess() {
                //成功后
                if (callback != null) {
                    callback.onSuccess(null);
                }
            }

            @Override
            public void onFail(String errMsg) {
                RXLogger.d(TAG, "init third sdk failed: " + errMsg);
                if (callback != null) {
                    JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), errMsg);
                    callback.onFailed(jsonObject);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "M007";
                    RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                }
            }
        });
        // 2.账号注销监听初始化
        SDK007Manager.getInstance().setOnLogoutListener(logoutCallback);
    }

    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.M007);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        //登录接口， 因为和初始化存在并发情况， 一定要在初始化成功之后调用。 否则会导致初始化未完成时进行调用登录不成功。
        SDK007Manager.getInstance().login(result -> {
            if (result == null) {
                if (callback != null)
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject());
                return;
            }

            if (result.getResultCode() == UserResult.USER_RESULT_LOGIN_SUCC) {
                /*
                 *  下面这三个参数是去服务端做登录校验的。 具体校验规则参考服务端对接文档
                 * */
                String uid = result.getUserId();     //用户id（用户唯一标识）
                String token = result.getToken();       //token
                String auth = result.getAuth();  // 用户凭证

                Map<String, Object> ext = new HashMap<>();
                ext.put("uid", uid);
                ext.put("token", token);
                ext.put("auth", auth);
                ext.put("tm", String.valueOf(System.currentTimeMillis() / 1000));
                if (callback != null)
                    callback.onSuccess(new JSONObject(ext));
            } else {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), result.getResultMsg()));
            }
        });
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
        SDK007Manager.getInstance().logout();
        return true;
    }

    /**
     * 帐号注销回调，主动调用logout时，或防沉迷或试玩时间到时，会收到此回调。
     * 此时userId, token都将会失效，应跳到登录界面，重新对登录信息进行赋值
     */
    private final OnLogoutListener logoutCallback = new OnLogoutListener() {
        @Override
        public void onLogoutResult(LogoutResult result) {
            // mLogoutCallback 为空的时候说明是被动 logout 的，这种情况需要显示的通知业务层 ruiXueSdkCallback 回调
            if (result.getCode() == 1) {
                //注销成功，返回到游戏登录界面
                if (mLogoutCallback != null) {
                    mLogoutCallback.onSuccess("1");
                    mLogoutCallback = null;
                } else {
                    PassportManager.getInstance().logout();
                    if (ruiXueSdkCallback != null) {
                        ruiXueSdkCallback.onLogout(0, "1");
                    }
                }
            } else if (result.getCode() == 3) {
                //sdk内部切换小号，无需调用登录，直接把登录信息回调给 OnLoginListener
                if (mLogoutCallback != null) {
                    mLogoutCallback.onSuccess("3");
                    mLogoutCallback = null;
                } else {
                    PassportManager.getInstance().logout();
                    if (ruiXueSdkCallback != null) {
                        ruiXueSdkCallback.onLogout(0, "3");
                    }
                }
            } else {
                if (mLogoutCallback != null) {
                    mLogoutCallback.onFailed(-1, result.getResultMsg());
                    mLogoutCallback = null;
                } else {
                    if (ruiXueSdkCallback != null) {
                        ruiXueSdkCallback.onLogout(-1, result.getResultMsg());
                    }
                }
            }
        }
    };

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billing.pay(activity, hashMap, callback);
    }

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("007 setGameInfo skipped: gameInfo is null");
            return;
        }
        int type = gameInfo.Type();
        if (type < 1 || type > 3) {
            RXLogger.i("007 setGameInfo ignored unsupported type: " + type);
            super.setGameInfo(gameInfo);
            return;
        }

        Map<String, String> roleInfo = new HashMap<>();
        String serverId = defaultIfEmpty(gameInfo.getServerId(), "1");
        String roleId = defaultIfEmpty(gameInfo.getRoleId(), "0");
        roleInfo.put("server_id", serverId);
        roleInfo.put("server_name", defaultIfEmpty(gameInfo.getServerName(), serverId));
        roleInfo.put("role_id", roleId);
        roleInfo.put("role_name", defaultIfEmpty(gameInfo.getRoleName(), roleId));
        roleInfo.put("role_level", defaultIfEmpty(gameInfo.getGameRoleLevel(), "1"));
        roleInfo.put("combat_number", String.valueOf(gameInfo.getGameRolePower()));
        roleInfo.put("channelExt", defaultIfEmpty(gameInfo.getAttach(), ""));
        roleInfo.put("role_action", String.valueOf(type));
        SDK007Manager.getInstance().setRoleInfo(roleInfo);
        super.setGameInfo(gameInfo);
    }

    private static String defaultIfEmpty(String value, String defaultValue) {
        return value == null || value.trim().isEmpty() ? defaultValue : value;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        SDK007Manager.getInstance().exit(new OnExitListener() {
            @Override
            public void onSuccess() {
                if (callback != null) {
                    callback.onExitConfirm("");
                }
            }

            @Override
            public void onFail(String s) {
                RXLogger.d("007 exit failed: " + s);
                if (callback != null) {
                    callback.onExitCancel();
                }
            }
        });
        return true;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        SDK007Manager.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
        SDK007Manager.getInstance().onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
