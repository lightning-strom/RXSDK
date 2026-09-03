package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.baidu.gamesdk.BDGameSDK;
import com.baidu.gamesdk.IResponse;
import com.baidu.gamesdk.OnGameExitListener;
import com.baidu.gamesdk.ResultCode;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.ILoginStatusChangeListener;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.BDSdkHelper;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class BDSdkApiImpl extends RXSdkApi {

    private final BillingClient billingClient;

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        BDGameSDK.initApplication(application);
    }


    static class Single {
        final static BDSdkApiImpl INSTANCE = new BDSdkApiImpl();
    }

    protected BDSdkApiImpl() {
        billingClient = new BDBillingImpl();
    }

    @NonNull
    public static BDSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        BDGameSDK.onResume(activity);
    }

    @Override
    public void onPause(Activity activity) {
        BDGameSDK.onPause(activity);
        super.onPause(activity);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("baidunet").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity,activity.getPackageName(),"com.baidu.appsearch");

    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        BDConfig bdConfig = BDConfig.fromMap(hashMap);
        if (bdConfig != null && bdConfig.checkParams()) {

            IResponse<Void> response=new IResponse<Void>() {
                @Override
                public void onResponse(int resultCode, String resultDesc, Void extraData) {
                    switch (resultCode) {
                        case ResultCode.INIT_SUCCESS:
//                             notifyLoginStatusChange(ILoginStatusChangeListener.STATE_LOGOUT);
                            callback.onSuccess(null);
                            break;
                        case ResultCode.INIT_FAIL:
                        default:
                            JSONObject jsonObject = RXErrorCode.THIRD_INIT_ERROR.toJSONObject(resultCode, resultDesc);
                            callback.onFailed(jsonObject);
                            RxErrorReportUtil.ThirdInitError.isError = true;
                            RxErrorReportUtil.ThirdInitError.thirdName = "baidunet";
                            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                    }
                }
            };

            BDGameSDK.init(activity, bdConfig.toBDGameSDKSetting(), response);
            BDSdkHelper.queryGameUpdateInfo(activity, null);  //必接】游戏更新提示
            //设置切换账号事件监听（个人中心界面切换账号）
            BDSdkHelper.setSuspendWindowChangeAccountListener(activity, response);
            BDSdkHelper.setSessionInvalidListener(response);
            BDSdkHelper.setAntiAddictionListener(activity);

        } else {
            RXLogger.e("params error " + (hashMap == null ? "null" : hashMap.toString()));
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR);
            callback.onFailed(jsonObject);
            RxErrorReportUtil.ThirdInitError.isError = true;
            RxErrorReportUtil.ThirdInitError.thirdName = "baidunet";
            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
        }
    }

    @Override
    public void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback) {
        if (!isSupportedChannelAction(action)) {
            super.invokeChannelAction(activity, action, params, callback);
            return;
        }
        switch (action) {
            case RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH:
                BDSdkHelper.showSplash(activity, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        notifyChannelActionSuccess(action, callback);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        notifyChannelActionFailed(action,
                                cause.optString("msg", "showSplash failed"), callback);
                    }
                });
                break;
            case RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW:
                BDSdkHelper.showFloatView(activity);
                notifyChannelActionSuccess(action, callback);
                break;
            case RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW:
                BDSdkHelper.closeFloatView(activity);
                notifyChannelActionSuccess(action, callback);
                break;
            default:
                break;
        }
    }

    static boolean isSupportedChannelAction(String action) {
        return RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH.equals(action)
                || RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW.equals(action)
                || RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW.equals(action);
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.BAIDUNET);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        BDGameSDK.login(new IResponse<Void>() {
            @Override
            public void onResponse(int resultCode, String resultDesc, Void extraData) {
//                Log.d("login", "this resultCode is " + resultCode);
                if (resultCode == ResultCode.LOGIN_SUCCESS) {
                    String uid = BDGameSDK.getLoginUid();//获取账号 uid
                    //获取 AccessToken
                    String token = BDGameSDK.getLoginAccessToken();
                    BDSdkHelper.showFloatView(activity);
                    // 根据国家规定登录成功后需要立刻调用实名查询，回调可以为null
                    BDGameSDK.queryLoginUserAuthenticateState(activity, null);

                    Map<String, String> extMap = new HashMap<>();
                    extMap.put("uid", uid);
                    extMap.put("accessToken", token);
                    callback.onSuccess(new JSONObject(extMap));

                } else if (resultCode == ResultCode.LOGIN_CANCEL) {
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(resultCode, resultDesc));
                }else if (callback != null) {
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(resultCode, resultDesc));
                }
            }
        });
        return true;
    }

    @Override
    public boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        BDGameSDK.logout();
        callback.onSuccess("");
        return true;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        BDGameSDK.gameExit(activity, new OnGameExitListener() {
            public void onGameExit() {
                //   在此处执行您的游戏退出逻辑
                callback.onExitConfirm("");
            }
        });
        return true;
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }

    /**
     * 统一角色上报入口 → {@link BDGameSDK#reportUserData(String)}（网游必接）。
     * <p>官方 Demo JSON：nick/role/region/server/level/power。百度侧无创角/升级分事件，
     * 任意 {@code type} 均按当前角色快照上报。
     */
    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("baidu setGameInfo skipped: gameInfo is null");
            return;
        }
        try {
            String roleId = defaultIfEmpty(gameInfo.getRoleId(), "0");
            String roleName = defaultIfEmpty(gameInfo.getRoleName(), roleId);
            String serverId = defaultIfEmpty(gameInfo.getServerId(), "1");
            String serverName = defaultIfEmpty(gameInfo.getServerName(), serverId);
            String profession = resolveAttachString(gameInfo.getAttach(), "career", "profession", "role");
            String region = resolveAttachString(gameInfo.getAttach(), "realm_name", "realmName", "region");
            if (TextUtils.isEmpty(region)) {
                region = serverName;
            }

            JSONObject data = new JSONObject();
            data.put("nick", roleName);
            data.put("role", TextUtils.isEmpty(profession) ? roleName : profession);
            data.put("region", region);
            data.put("server", serverId);
            data.put("level", parseLevel(gameInfo.getGameRoleLevel(), 1));
            data.put("power", gameInfo.getGameRolePower());
            BDSdkHelper.reportUserData(data.toString());
        } catch (Exception e) {
            RXLogger.e("baidu setGameInfo reportUserData failed: " + e.getMessage());
        }
        super.setGameInfo(gameInfo);
    }

    private static String defaultIfEmpty(@Nullable String value, @NonNull String defaultValue) {
        return TextUtils.isEmpty(value) ? defaultValue : value;
    }

    private static int parseLevel(@Nullable String levelText, int defaultValue) {
        if (TextUtils.isEmpty(levelText)) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(levelText.trim());
        } catch (NumberFormatException ignore) {
            return defaultValue;
        }
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
            // attach 非 JSON 时忽略扩展字段
        }
        return null;
    }

}
