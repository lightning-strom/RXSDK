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
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.xut.sdk.channel.DFPlatformAPI;
import com.xut.sdk.channel.entity.GamePlayerInfo;
import com.xut.sdk.channel.entity.LoginCallbackData;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class DFSdkApiImpl extends RXSdkApi implements DFPlatformAPI.ISDKResultListener {

    private final DFBillingImpl billingClient;
    private final AtomicBoolean isInited = new AtomicBoolean(false);
    RXJSONCallback loginCallback;
    RXCallbackWrapper initCallback;

    @Override
    public void onInitResult(boolean b) {

        if (null != initCallback) {
            if (b) {
                initCallback.invokeSuccess(null);
            } else {
                initCallback.onFailed(RXErrorCode.INIT_ERROR.toJSONObject());
            }
        }
        if (!b) {
            isInited.set(false);
            RXLogger.e("rx init " + getChannel() + " sdk params error. detail see console log");
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "false");
            RxErrorReportUtil.ThirdInitError.isError = true;
            RxErrorReportUtil.ThirdInitError.thirdName = LoginMethod.XUTENG;
            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
        }
    }

    @Override
    public void onLoginResult(boolean b, LoginCallbackData loginCallbackData) {
        if (null != loginCallback) {
            if (b) {
                Map<String, Object> map = new HashMap<>();
                map.put("uid", loginCallbackData.uid);
                map.put("uname", loginCallbackData.uname);
                map.put("sign", loginCallbackData.sign);
                map.put("ts", loginCallbackData.ts);
                map.put("token", loginCallbackData.token);
                RXLogger.d("onLoginResult:" + map.toString());
                loginCallback.onSuccess(new JSONObject(map));
            } else {
                RXLogger.e("onLoginResult failed : code:" + loginCallbackData.errCode + " msg:" + loginCallbackData.errMsg);
                loginCallback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(loginCallbackData.errCode, loginCallbackData.errMsg));
            }
        }

    }

    @Override
    public void onLogoutResult(boolean b) {
        if (b)
            ruixueLogout(null);

    }

    @Override
    public void onExitResult(boolean b) {

    }

    @Override
    public void onPayResult(boolean b) {
        billingClient.onPayFinished(b);
    }

    @Override
    public void onUploadPlayerInfoResult(boolean b) {

    }


    static class Single {
        final static DFSdkApiImpl INSTANCE = new DFSdkApiImpl();
    }

    protected DFSdkApiImpl() {
        billingClient = new DFBillingImpl();
    }

    public static DFSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
    }

    @Override
    public void attachBaseContext(Context context) {
        super.attachBaseContext(context);
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        DFPlatformAPI.getInstance().onActivityCreate(activity);
        super.onCreate(activity, savedInstanceState);

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
        DFPlatformAPI.getInstance().onActivitySaveInstanceState(activity, outState);

        super.onActivitySaveInstanceState(activity, outState);
    }

    @Override
    public void onStart(Activity activity) {
        DFPlatformAPI.getInstance().onActivityStart(activity);

        super.onStart(activity);
    }

    @Override
    public void onResume(Activity activity) {
        DFPlatformAPI.getInstance().onActivityResume(activity);

        super.onResume(activity);
    }

    @Override
    public void onRestart(Activity activity) {
        DFPlatformAPI.getInstance().onActivityRestart(activity);

        super.onRestart(activity);
    }

    @Override
    public void onPause(Activity activity) {
        DFPlatformAPI.getInstance().onActivityPause(activity);

        super.onPause(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        DFPlatformAPI.getInstance().onActivityDestroy(activity);
        super.onDestroy(activity);
    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        DFPlatformAPI.getInstance().onActivityNewIntent(activity, intent);
        super.onNewIntent(activity, intent);
    }

    @Override
    public void onStop(Activity activity) {
        DFPlatformAPI.getInstance().onActivityStop(activity);

        super.onStop(activity);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        DFPlatformAPI.getInstance().onActivityResult(activity, requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
        DFPlatformAPI.getInstance().onActivityRequestPermissionsResult(activity, requestCode, permissions, grantResults);
    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {
        super.onConfigurationChanged(activity, newConfig);
        DFPlatformAPI.getInstance().onActivityConfigurationChanged(activity, newConfig);
    }

    @Override
    public void onBackPressed() {

    }


    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isInited.get()) {
            Log.e("rxsdk", "please initThirdSdk first");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "error not initialized"));
        } else {
            loginCallback = callback;
            DFPlatformAPI.getInstance().login();
        }
        return true;
    }


    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack) {

        super.setPrivacyAgree(context, privacyCallBack);
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (isInited.compareAndSet(false, true)) {
            initCallback = new RXCallbackWrapper(callback, 1, 10000);
            DFPlatformAPI.getInstance().init(activity, this);
        } else {
            callback.onSuccess(null);
        }

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
        DFPlatformAPI.getInstance().logout();
        super.logout(callback);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("xuteng").setVersion(AppUtils.getAppMetaData(RuiXueSdk.getContext(), "CHANNELSDK_GAME_VERSION")).build();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName() + "&th_name=need_comment", "com.bbk.appstore");
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        DFPlatformAPI.getInstance().exit();
        return super.exitApp(activity, callback);

    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {

        billingClient.pay(activity, hashMap, callback);
    }

    GamePlayerInfo gamePlayerInfo;

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("xuteng setGameInfo skipped: gameInfo is null");
            return;
        }
        RXLogger.i("xuteng setGameInfo input: roleId=" + gameInfo.getRoleId()
                + ", roleName=" + gameInfo.getRoleName()
                + ", serverId=" + gameInfo.getServerId()
                + ", serverName=" + gameInfo.getServerName()
                + ", roleCreateTime=" + gameInfo.getRoleCreateTime()
                + ", roleLevel=" + gameInfo.getGameRoleLevel()
                + ", type=" + gameInfo.Type());
        gamePlayerInfo = new GamePlayerInfo();
        gamePlayerInfo.serverId = normalizeServerId(gameInfo.getServerId());
        gamePlayerInfo.serverName = gameInfo.getServerName();
        gamePlayerInfo.roleId = gameInfo.getRoleId();
        gamePlayerInfo.roleName = gameInfo.getRoleName();
        gamePlayerInfo.roleCreateTime = gameInfo.getRoleCreateTime();
        gamePlayerInfo.roleLevel = normalizeRoleLevel(gameInfo.getGameRoleLevel());
        gamePlayerInfo.eventType = normalizeEventType(gameInfo.Type());

//        /操作类型（1-4）1：⻆⾊创建2：进⼊游戏3：⻆⾊升级4：⻆⾊退出
        RXLogger.i("xuteng setGameInfo upload: eventType=" + gamePlayerInfo.eventType
                + ", roleId=" + gamePlayerInfo.roleId
                + ", roleName=" + gamePlayerInfo.roleName
                + ", serverId=" + gamePlayerInfo.serverId
                + ", serverName=" + gamePlayerInfo.serverName
                + ", roleLevel=" + gamePlayerInfo.roleLevel
                + ", roleCreateTime=" + gamePlayerInfo.roleCreateTime);
        DFPlatformAPI.getInstance().uploadGamePlayerInfo(gamePlayerInfo.eventType, gamePlayerInfo);
        RXLogger.i("xuteng setGameInfo uploadGamePlayerInfo invoked");
        super.setGameInfo(gameInfo);
        RXLogger.i("xuteng setGameInfo finished");
    }

    private int normalizeEventType(int type) {
        if (type >= 1 && type <= 4) {
            return type;
        }
        RXLogger.w("xuteng setGameInfo unknown event type: " + type + ", fallback to 1");
        return 1;
    }

    static int normalizeRoleLevel(String roleLevel) {
        int level = ObjectUtils.toInt(roleLevel, 1);
        return level > 0 ? level : 1;
    }

    private String normalizeServerId(String serverId) {
        if (serverId == null || serverId.trim().isEmpty() || "default".equals(serverId)) {
            RXLogger.w("xuteng setGameInfo invalid serverId: " + serverId + ", fallback to 1");
            return "1";
        }
        return serverId;
    }
}
