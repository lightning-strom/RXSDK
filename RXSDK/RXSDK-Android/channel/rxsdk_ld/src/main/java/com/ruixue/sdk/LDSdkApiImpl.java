package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ld.sdk.LdGameInfo;
import com.ld.sdk.LdSdkManger;
import com.ld.sdk.account.api.EntryCallback;
import com.ld.sdk.account.api.ExitCallBack;
import com.ld.sdk.account.api.InitCallBack;
import com.ld.sdk.account.api.LoginCallBack;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LDSdkApiImpl extends RXSdkApi {

    String url = "";
    String appId = "";

    private final LDBillingImpl mLDBillingImpl;

    public LDSdkApiImpl() {
        mLDBillingImpl = new LDBillingImpl();
    }

    static class Single {
        final static LDSdkApiImpl INSTANCE = new LDSdkApiImpl();
    }

    @NonNull
    public static LDSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName(LoginMethod.LEIDIAN).setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {

        Object appIdObj = null;
        if (map != null) {
            appIdObj = map.get("ld_app_key") != null ? map.get("ld_app_key") : map.get("app_key");
        }
        if (appIdObj != null) {
            appId = String.valueOf(appIdObj);
        }
        if (TextUtils.isEmpty(appId)) {
            reportInitError(callback, "ld_app_key is empty, check init_configs or rx_leidian_app_key meta-data");
            return;
        }

        // 雷电 init 内部依赖 UI 线程，引擎线程直接调用不回调
        activity.runOnUiThread(() -> LdSdkManger.getInstance().init(activity, appId, new InitCallBack() {

            @Override
            public void onSuccess() {
                if (callback != null) {
                    callback.onSuccess(null);
                }
            }

            @Override
            public void onFail(String desc) {
                reportInitError(callback, desc);
            }
        }));
    }

    private void reportInitError(RXJSONCallback callback, String desc) {
        RXLogger.e("LdSdkManger onFail ld_app_key:" + appId + ",error:" + desc);
        if (callback == null) {
            return;
        }
        JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), desc);
        callback.onFailed(jsonObject);
        RxErrorReportUtil.ThirdInitError.isError = true;
        RxErrorReportUtil.ThirdInitError.thirdName = LoginMethod.LEIDIAN;
        RxErrorReportUtil.ThirdInitError.cause = jsonObject;
    }

    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.LEIDIAN);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        LdSdkManger.getInstance().showLoginView(activity, new LoginCallBack() {

            @Override
            public void loginSuccess(String uid, String timestamp, String sign) {
                // Toast.makeText(activity, "登录成功", Toast.LENGTH_SHORT).show();
                Log.d("LDSdkApiImpl", "uid: " + uid + "--" + "timestamp: " + timestamp + "---" + "sign:" + sign);

                Map<String, String> hashMap = new HashMap<>();
                hashMap.put("uid", uid);
                hashMap.put("timestamp", timestamp);
                hashMap.put("sign", sign);

                callback.onSuccess(new JSONObject(hashMap));

            }

            @Override
            public void loginFail(String desc) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), desc));
            }

            @Override
            public void loginLogout() {
                if (ruiXueSdkCallback != null) {
                    ruiXueSdkCallback.onLogout(0, "");
                }
            }

            @Override
            public void accountCancellation() {
                logout(null);
            }

            @Override
            public void exitGame() {
                if (ruiXueSdkCallback != null) {
                    ruiXueSdkCallback.exitApp();
                }
            }
        });
        return true;
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> map, RXJSONCallback callback) {

        mLDBillingImpl.pay(activity, map, callback);

    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        LdSdkManger.getInstance().showExitView(activity, new ExitCallBack() {
            @Override
            public void onFinish(int code, String desc) {
                if (code == 0) {
                    Log.d("LDSdkApiImpl", "确定退出");
                    callback.onExitConfirm(desc);
                } else {
                    Log.d("LDSdkApiImpl", "取消退出");
                    callback.onExitCancel();
                }
            }
        });
        return true;
    }

    /**
     * 角色创建与每次登录时上报雷电 {@code enterGame}。
     * 文档：https://docs.ldmnq.com/docs/3iyTEo
     */
    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("leidian setGameInfo skipped: gameInfo is null");
            return;
        }
        // type=4 退出游戏不调用；无角色时也不上报
        if (gameInfo.Type() == 4 || TextUtils.isEmpty(gameInfo.getRoleId())) {
            super.setGameInfo(gameInfo);
            return;
        }
        Context context = RuiXueSdk.getCurrentActivity();
        if (context == null) {
            context = RuiXueSdk.getContext();
        }
        if (context == null) {
            RXLogger.e("leidian setGameInfo skipped: context is null");
            super.setGameInfo(gameInfo);
            return;
        }

        LdGameInfo ldGameInfo = new LdGameInfo();
        ldGameInfo.serverId = defaultIfEmpty(gameInfo.getServerId(), "1");
        ldGameInfo.serverName = defaultIfEmpty(gameInfo.getServerName(), ldGameInfo.serverId);
        ldGameInfo.roleId = gameInfo.getRoleId();
        ldGameInfo.roleName = defaultIfEmpty(gameInfo.getRoleName(), ldGameInfo.roleId);
        ldGameInfo.roleType = defaultIfEmpty(
                resolveAttachString(gameInfo.getAttach(), "roleType", "career", "profession"),
                "default");
        ldGameInfo.level = defaultIfEmpty(gameInfo.getGameRoleLevel(), "1");
        ldGameInfo.money = defaultIfEmpty(gameInfo.getBalance(), "0");
        ldGameInfo.partyName = defaultIfEmpty(gameInfo.getPartyName(), "default");
        ldGameInfo.vipLevel = gameInfo.getVipLevel();
        ldGameInfo.powerNum = gameInfo.getGameRolePower();

        LdSdkManger.getInstance().enterGame(context, ldGameInfo, new EntryCallback() {
            @Override
            public void callback(int code, String desc) {
                if (code != 0) {
                    RXLogger.e("leidian enterGame failed code=" + code + ", desc=" + desc);
                }
            }
        });
        super.setGameInfo(gameInfo);
    }

    private static String defaultIfEmpty(@Nullable String value, @NonNull String defaultValue) {
        return TextUtils.isEmpty(value) ? defaultValue : value;
    }

    @Nullable
    private static String resolveAttachString(@Nullable String attach, @NonNull String... keys) {
        if (TextUtils.isEmpty(attach) || keys.length == 0) {
            return null;
        }
        try {
            JSONObject json = new JSONObject(attach);
            for (String key : keys) {
                String value = json.optString(key, null);
                if (!TextUtils.isEmpty(value)) {
                    return value;
                }
            }
        } catch (JSONException ignore) {
            // attach 非 JSON 时忽略
        }
        return null;
    }
}
