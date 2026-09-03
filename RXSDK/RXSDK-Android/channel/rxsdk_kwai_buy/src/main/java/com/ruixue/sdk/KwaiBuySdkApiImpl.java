package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.kwai.sdk.KwaiSdk;
import com.kwai.sdk.KwaiSdkInitConfig;
import com.kwai.sdk.OnExitListener;
import com.kwai.sdk.OnLoginResultListener;
import com.kwai.sdk.callback.KwaiSdkCallback;
import com.kwai.sdk.combus.init.KwaiInitListener;
import com.kwai.sdk.subbus.account.login.bean.AccountModel;
import com.kwai.sdk.subbus.antiaddiction.AddictionInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.KwaiSdkHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

//https://open.oppomobile.com/wiki/doc#id=10470
public class KwaiBuySdkApiImpl extends RXSdkApi {

    private final BillingClient billingClient;


    private final AtomicBoolean aInited = new AtomicBoolean(false);

    public static final int LOGIN_CANCEL = -10004;
    private SparseArray<String> ErrorMsg = new SparseArray<String>() {
        {
            put(-10000, "重复操作");
            put(LOGIN_CANCEL, "取消登录");
            put(-10007, "请检查 sdk 是否初始化");
            put(-10008, "重复登录");
            put(-10009, "重复登出");
            put(100200101, "非法的app");
            put(6001, "登录失败，请重试");
            put(6002, "登录失败，请重试");
        }
    };

    static class Single {
        final static KwaiBuySdkApiImpl INSTANCE = new KwaiBuySdkApiImpl();
    }

    protected KwaiBuySdkApiImpl() {
        billingClient = new KwaiBillingImpl();
    }

    public static KwaiBuySdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    public boolean isInited() {
        return aInited.get();
    }

    public String initErrMsg = "sdk 还未初始化，请先调用 onApplicationCreate";

    public boolean isAgreedPrivacy = false;
    PrivacyCallback mPrivacyCallback;

    private boolean isCustomPrivacy;


    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        KwaiSdk.initBase(application);

    }

    private void initKwai(Application application, Map<String, Object> hashMap, RXJSONCallback callback) {
        String appid = AppUtils.getAppMetaData(application, "kwai_app_id");
        String appName = AppUtils.getAppMetaData(application, "kwai_app_name");
        String splash_activity = AppUtils.getAppMetaData(application, "kwai_splash_activity");
        boolean allowtourist = Boolean.parseBoolean(AppUtils.getAppMetaData(application, "kwai_allow_tourist"));
        boolean disableFloatSwitch = Boolean.parseBoolean(AppUtils.getAppMetaData(application, "kwai_disable_float_switch"));
        isCustomPrivacy = Boolean.parseBoolean(AppUtils.getAppMetaData(application, "kwai_custom_privacy"));

        KwaiConfig kwaiConfig = new KwaiConfig(appid, appName);
        kwaiConfig.setAllowtourist(allowtourist);
        kwaiConfig.setSplashActivityName(splash_activity);
        kwaiConfig.setFloatSwitch(!disableFloatSwitch);
        KwaiSdkInitConfig config = kwaiConfig.toKwaiSdkInitConfig(application, new KwaiInitListener() {
            @Override
            public void onSuccess(String channel) {
                RXLogger.i("rx kwai init success:" + channel);
                aInited.set(true);
                if (null != callback) {
                    callback.onSuccess(null);
                }
            }

            @Override
            public void onError(String msg) {
                aInited.set(false);
                initErrMsg = msg;
                RXLogger.e("rx kwai init error:" + msg);
                if (null != callback) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), msg));
                }
            }
        });
        KwaiSdk.init(config);

        // 最好设置，如果不是单独的activity 可以不设置，闪屏界面不申请权限或者做其他操作
        if (!TextUtils.isEmpty(kwaiConfig.getSplashActivityName())) {
            KwaiSdk.setSplashActivityName(kwaiConfig.getSplashActivityName());
        }
        KwaiSdk.setCallback(new KwaiSdkCallback() {
            /**
             * @param userclick 第一次为true, 后续都为false,如果使用sdk的隐私，需要在此后在进入游戏
             */
            @Override
            public void onPrivacyAgree(boolean userclick) {
                RXLogger.i("rx kwai onPrivacyAgree " + userclick);
                isAgreedPrivacy = true;
                if (userclick) {
                    setPrivacyAgree(application, true, mPrivacyCallback);
                }
            }

            @Override
            public void forceLogout() {
                RXLogger.i("rx kwai forceLogout ");
                logout(null);
            }

            @Override
            public void switchAccount() {
                RXLogger.i("rx kwai switchAccount ");
                if (onSwitchAccount(0, ""))
                    logout(null);
            }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        KwaiSdk.onActivityResult(activity, requestCode, resultCode, data);
    }


    @Override
    public void onNewIntent(Activity activity, Intent newIntent) {
        super.onNewIntent(activity, newIntent);
        KwaiSdk.onNewIntent(activity, newIntent);
    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {
        super.onConfigurationChanged(activity, newConfig);
        KwaiSdk.onConfigurationChanged(activity, newConfig);
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
        KwaiSdk.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
    }


    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("kuaishou").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    @Override
    public void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate) {
        // 必须设置， 当正在游戏中的时候不会弹出防沉迷弹窗，游戏根据自己的需要
        KwaiSdk.setupAddictDelegate(new com.kwai.sdk.subbus.antiaddiction.AntiAddictDelegate() {
            /**
             * @return 是否正在游戏中
             */
            @Override
            public boolean isGaming() {
                return antiAddictDelegate.isGaming();
            }

            @Override
            public void didAddictInfoUpdate(AddictionInfo addictionInfo) {
                if (antiAddictDelegate.enableCustomUI()) {
                    antiAddictDelegate.didAddictInfoUpdate(new Gson().toJson(addictionInfo));
                }
            }

            /**
             * @return 是否需要自定义防沉迷ui
             */
            @Override
            public boolean enableCustomUI() {
                return antiAddictDelegate.enableCustomUI();
            }

        });
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        initKwai(activity.getApplication(), hashMap, callback);
        if (callback != null) {
            if (aInited.get()) {
                callback.onSuccess(null);
            } else {
                JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), initErrMsg);
                callback.onFailed(jsonObject);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "kuaishou";
                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            }
        }
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.KUAISHOU);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        super.logout(callback);
    }


    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (KwaiSdk.isLoginSuccess()) {
            Map<String, String> map = new HashMap<>();
            map.put("game_id", KwaiSdk.getGameId());
            map.put("game_token", KwaiSdk.getGameToken());
            callback.onSuccess(new JSONObject(map));
        } else {
            KwaiSdk.login(new OnLoginResultListener() {
                @Override
                public void onSuccess(AccountModel accountModel) {
                    Map<String, String> map = new HashMap<>();
                    map.put("game_id", accountModel.getSdkUserId());
                    map.put("game_token", KwaiSdk.getGameToken());

                    callback.onSuccess(new JSONObject(map));
                }

                @Override
                public void onFail(int errorCode) {
                    if (callback != null) {
                        if (errorCode == LOGIN_CANCEL) {
                            callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(errorCode, ErrorMsg.get(errorCode, "登录取消")));
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(errorCode, ErrorMsg.get(errorCode, "登录失败")));
                        }
                    }
                }
            });
        }
        return true;
    }

    @Override
    public boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        KwaiSdkHelper.logoff(callback);
        return true;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        KwaiSdk.exitApp(new OnExitListener() {
            @Override
            public void onExit() {
                callback.onExitConfirm("");
            }

            @Override
            public void onCancel() {
                callback.onExitCancel();
            }
        });
        return true;
    }

    @Override
    public boolean isAgreedPrivacy() {
        return super.isAgreedPrivacy() || (isInited() && KwaiSdk.isSdkPrivacyAgree());
    }

    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack) {
        if (isCustomPrivacy) {
            KwaiSdk.setPrivacyAgree();
            super.setPrivacyAgree(context, privacyCallBack);
        } else if (isAgreedPrivacy) {
            setPrivacyAgree(context, true, privacyCallBack);
        } else {
            mPrivacyCallback = privacyCallBack;
        }
    }

    @Override
    public boolean isLogin() {
        return super.isLogin() && KwaiSdk.isLoginSuccess();
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
