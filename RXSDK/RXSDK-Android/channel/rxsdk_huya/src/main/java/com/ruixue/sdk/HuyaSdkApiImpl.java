package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.PassportManager;

import java.util.Map;

/**
 * 虎牙联运渠道接入实现（Android，Berry 1.4.5-698）。
 *
 * <p><b>瑞雪入口已对接：</b>
 * {@link #initThirdSdk}、{@link #login}/{@link #thirdLogin}、{@link #thirdLogout}、
 * {@link #pay}、{@link #setGameInfo}、
 * {@link #onActivityResult}、{@link #onRequestPermissionsResult}、
 * {@link #onResume}/{@link #onPause}。
 *
 * <p><b>Berry API 尚未包装（见 {@link HuyaSdkHelper} 类注释）：</b>
 * {@code queryLoginInfo}、{@code queryCertifical}、{@code guestBindPhone}、
 * {@code switchCount}、{@code logout(Activity,boolean)}、
 * 运行时横竖屏/登录弹窗/WebView 全屏开关、{@code PayShopData.extra}。
 */
public class HuyaSdkApiImpl extends RXSdkApi {

    private static final String CHANNEL = "huya";
    private static final String CHANNEL_VERSION = "1.4.5-698";
    private static final String TAG = "HuyaSdkApi";

    private final HuyaBillingImpl billing;
    private final HuyaSdkHelper helper;

    static class Single {
        static final HuyaSdkApiImpl INSTANCE = new HuyaSdkApiImpl();
    }

    protected HuyaSdkApiImpl() {
        this.billing = new HuyaBillingImpl();
        this.helper = HuyaSdkHelper.getInstance();
        this.helper.setHostNotifier(new HuyaSdkHelper.HostNotifier() {
            @Override
            public void onPassiveLogout(@Nullable String reason) {
                RXLogger.i(TAG + " passive logout: " + reason);
                PassportManager.getInstance().logout();
                if (ruiXueSdkCallback != null) {
                    ruiXueSdkCallback.onLogout(0, reason == null ? "" : reason);
                }
            }

            @Override
            public boolean onSwitchAccount(@Nullable String data) {
                RXLogger.i(TAG + " switch account: " + data);
                return HuyaSdkApiImpl.this.onSwitchAccount(0, data == null ? "" : data);
            }

            @Override
            public void onQuit(@Nullable String msg) {
                RXLogger.i(TAG + " quit: " + msg);
                if (antiAddictDelegate != null) {
                    antiAddictDelegate.didAddictInfoUpdate(msg == null ? "{\"event\":\"quit\"}" : msg);
                }
                PassportManager.getInstance().logout();
                if (ruiXueSdkCallback != null) {
                    ruiXueSdkCallback.onLogout(0, "quit");
                }
            }
        });
    }

    @NonNull
    public static HuyaSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder()
                .setName(CHANNEL)
                .setVersion(CHANNEL_VERSION)
                .setExt("berry")
                .build();
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, @Nullable Map<String, Object> map, RXJSONCallback callback) {
        helper.init(activity, map, callback);
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.HUYA);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        return helper.login(activity, callback);
    }

    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        // 使用 logout(Activity)；logout(Activity, boolean) 未包装
        return helper.logout(RuiXueSdk.getCurrentActivity(), callback);
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billing.pay(activity, hashMap, callback);
    }

    /**
     * 角色上报 → Berry {@code reportRegisterInfo}。
     * 虎牙侧无创角/升级分事件，任意 {@link GameInfo} 均上报当前角色快照；
     * {@code attach} 可带 career/chapter/realmId/realmName/sdkchannelId。
     */
    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e(TAG + " setGameInfo skipped: gameInfo is null");
            return;
        }
        helper.reportRole(gameInfo);
        super.setGameInfo(gameInfo);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        helper.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions,
            int[] grantResults) {
        super.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
        helper.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        helper.onAppFrontGround();
    }

    @Override
    public void onPause(Activity activity) {
        helper.onAppBackGround();
        super.onPause(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        // Berry 为进程级单例，不可在 Activity destroy 时 uninit；否则冷/热重启 Activity
        // 会触发 "init fail: mIsInit == true"，导致本地 inited=false 而无法登录。
        // 进程退出场景如需释放，再显式调 helper.uninit()。
        super.onDestroy(activity);
    }
}
