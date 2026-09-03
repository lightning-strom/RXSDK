package com.ruixue.openapi;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleEventObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.ruixue.RXCallbackWrapper;
import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.ClipboardData;
import com.ruixue.base.LogHelper;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.base.SdkInfo;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.ChannelPaymentOrderCache;
import com.ruixue.billing.HQParams;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.internal.Boot;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXRequest;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.LoginParams;
import com.ruixue.passport.PassportManager;
import com.ruixue.passport.RegisterParams;
import com.ruixue.passport.UserInfoParams;
import com.ruixue.promo.PromoCodeManager;
import com.ruixue.reflect.BaseReflectClass;
import com.ruixue.reflect.OpenInstallManager;
import com.ruixue.share.ShareData;
import com.ruixue.share.ShareDataResult;
import com.ruixue.share.ShareManager;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityConvertRXStringCallback;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@SuppressWarnings({"unused"})
public abstract class RXSdkApi implements IRXSdkApi, ILifecycle, LifecycleEventObserver {

    private final String userAgreementResult = "userAgreementResult";
    private static final int IIFAA_CALLBACK_RETRY_COUNT = 3;
    protected AntiAddictDelegate antiAddictDelegate;
    private LifecycleOwner mLifecycleOwner = null;
    private final Map<String, IPluginSdk> mThirdPluginSdkMap = new HashMap<>();
    private String lastIifaaCallbackUri = "";
    @Nullable
    private RXJSONCallback iifaaAutoValidateCallback;
    // IIFAA 自动校验业务场景，deregister 表示注销场景，为空表示正常认证逻辑
    @Nullable
    private String iifaaAutoValidateSource;
    private boolean iifaaResumeCompensated = false;
    private final AtomicBoolean iifaaProcessLifecycleRegistered = new AtomicBoolean(false);
    protected RuiXueSdkCallback ruiXueSdkCallback;

    @NonNull
    public static RXSdkApi getInstance() {
        return Single.INSTANCE;
    }

    public IRXSdkUI getUI() {
        return SingleUI.INSTANCE;
    }


    static class SingleUI extends BaseReflectClass {
        static IRXSdkUI INSTANCE;

        static {
            String className = Objects.requireNonNull(IRXSdkUI.class.getPackage()).getName() + ".RXSdkUI";
            Class<?> RxSdkApiImpl = getClass(className);
            if (RxSdkApiImpl != null) {
                try {
                    Constructor<?> constructor1 = RxSdkApiImpl.getDeclaredConstructor();
//                    constructor1.setAccessible(true);
//                    INSTANCE = (IRXSdkUI) constructor1.newInstance();
                    Method method = RxSdkApiImpl.getMethod("getInstance");
                    INSTANCE = (IRXSdkUI) method.invoke(null);
                } catch (Exception e) {
                    printStackTrack(e);
                }
            }
        }
    }

    static class Single extends BaseReflectClass {
        static RXSdkApi INSTANCE;

        static {
            String className = Objects.requireNonNull(RXSdkApi.class.getPackage()).getName() + ".RXSdkApiImpl";
            Class<?> RxSdkApiImpl = getClass(className);
            if (RxSdkApiImpl != null) {
                try {
                    Constructor<?> constructor1 = RxSdkApiImpl.getDeclaredConstructor();
                    constructor1.setAccessible(true);
                    INSTANCE = (RXSdkApi) constructor1.newInstance();
                    // Method method= RxSdkApiImpl.getMethod("getInstance");
                    // INSTANCE = (RXSdkApi) method.invoke(null);
                } catch (Exception e) {
                    printStackTrack(e);
                    INSTANCE = new RXSdkApiImplDefault();
                }
            } else {
                INSTANCE = new RXSdkApiImplDefault();
            }
        }
    }

    interface PluginAction {
        void apply(IPluginSdk sdk);
    }

    void invokePlugin(PluginAction action) {
        for (IPluginSdk sdk : getPlugins().values()) {
            try {
                action.apply(sdk);
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    }

    public void loadPlugins(Context context) {
        String[] pluginNames = getSupportPluginNames();
        if (pluginNames != null && pluginNames.length > 0) {
            for (String pluginName : pluginNames) {
                String className = AppUtils.getAppMetaData(context, pluginName);
                if (!TextUtils.isEmpty(className)) {
                    registerPlugin(className);
                }
            }
        }
        RXLogger.i("rxsdk plugin loaded: " + getPlugins().keySet());
    }

    public void registerPlugin(String className) {
        try {
            Class<?> IPluginSdkImpl = Class.forName(className);
            Method methodInit = IPluginSdkImpl.getMethod("getInstance");
            IPluginSdk iPluginSdk = (IPluginSdk) Objects.requireNonNull(methodInit.invoke(null));
            registerPlugin(iPluginSdk);
        } catch (Exception e) {
//            e.printStackTrace();
            RXLogger.e("register plugin failed:" + className);
        }
    }

    @Override
    public void registerPlugin(IPluginSdk thirdSdk) {
        if (thirdSdk != null) {
            this.mThirdPluginSdkMap.put(thirdSdk.getName(), thirdSdk);
        }
    }

    @Override
    public void unregisterPlugin(IPluginSdk thirdSdk) {
        if (thirdSdk != null) {
            this.mThirdPluginSdkMap.remove(thirdSdk.getName());
        }
    }

    public void onLoginResp(int code) {
        invokePlugin(sdk -> sdk.onLoginResp(code));
    }


    protected String[] getSupportPluginNames() {
        return null;
    }

    @Override
    public Map<String, IPluginSdk> getPlugins() {
        return this.mThirdPluginSdkMap;
    }

    public boolean isTrackedLifecycle() {
        return null != mLifecycleOwner;
    }

    @Override
    public void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event) {
        if (source instanceof Activity) {
            switch (event) {
                case ON_CREATE:
                    onCreate((Activity) source, null);
                    // RXLogger.i("on_create: ");
                    break;
                case ON_START:
                    onStart((Activity) source);
                    // RXLogger.i("on_start: ");
                    break;
                case ON_RESUME:
                    onResume((Activity) source);
                    // RXLogger.i("on_resume: ");
                    break;
                case ON_PAUSE:
                    onPause((Activity) source);
                    // RXLogger.i("on_pause: ");
                    break;
                case ON_STOP:
                    onStop((Activity) source);
                    // RXLogger.i("on_stop: ");
                    break;
                case ON_DESTROY:
                    onDestroy((Activity) source);
                    // RXLogger.i("on_destroy: ");
                    break;
                case ON_ANY:
                    // RXLogger.i("on_any: ");
                    break;
            }
        }
    }

    @Override
    public void attachBaseContext(Context context) {

    }

    @Override
    public void onApplicationCreate(Application application) {
        Boot.initialize(Objects.requireNonNull(application));
        TrackDataMgr.getInstance().startTracking(application);
        UserActionTrackManager.getInstance().init(application);
        OpenInstallManager.preInit(application);
        registerIifaaProcessLifecycleObserver();
        invokePlugin(sdk -> sdk.onApplicationCreate(application));
    }

    /**
     * 进程级前后台监听：从支付宝等外部 App 返回时，Activity {@code onResume} 不一定再次触发，
     * 需在 {@link ProcessLifecycleOwner} 回到前台时补偿查询 IIFAA 结果。
     */
    private void registerIifaaProcessLifecycleObserver() {
        if (!iifaaProcessLifecycleRegistered.compareAndSet(false, true)) {
            return;
        }
        Handler mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.post(() -> ProcessLifecycleOwner.get().getLifecycle()
                .addObserver(new DefaultLifecycleObserver() {
                    @Override
                    public void onStart(@NonNull LifecycleOwner owner) {
                        RXLogger.i("IIFAA process onStart, try resume compensation");
                        tryCompensateIifaaAutoValidateOnResume("process_onStart");
                    }

                    @Override
                    public void onStop(@NonNull LifecycleOwner owner) {
                        if (iifaaAutoValidateCallback != null) {
                            RXLogger.i("IIFAA process onStop, reset resume compensation flag");
                            iifaaResumeCompensated = false;
                        }
                    }
                }));
    }

    @Override
    public void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner) {
        if (!lifecycleOwner.equals(mLifecycleOwner)) {
            mLifecycleOwner = lifecycleOwner;
            lifecycleOwner.getLifecycle().addObserver(this);
        }
    }

    protected Context getContext() {
        return RXGlobalData.getContext();
    }


    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        ActivityLifecycleTracker.onActivityCreated(activity);
        invokePlugin(sdk -> sdk.onCreate(activity, savedInstanceState));
    }

    @Override
    public void onStart(Activity activity) {

    }

    @Override
    public void onRestart(Activity activity) {
        RXGlobalData.updateLanguage(activity);
    }

    @Override
    public void onResume(Activity activity) {
        ActivityLifecycleTracker.onActivityResumed(activity);
        if (isAgreedPrivacy()) {
            ClipboardData.load(activity);
        }
        ShareManager.getInstance().onResume(activity);
        invokePlugin(sdk -> sdk.onResume(activity));
        tryCompensateIifaaAutoValidateOnResume("activity_onResume:" + activity.getClass().getSimpleName());
    }


    @Override
    public void onPause(Activity activity) {
        invokePlugin(sdk -> sdk.onPause(activity));
    }

    @Override
    public void onStop(Activity activity) {
        UserActionTrackManager.getInstance().postToServer(activity);
        TrackDataMgr.getInstance().postToServer(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        mLifecycleOwner = null;
        OpenInstallManager.onActivityDestroy();
    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        invokePlugin(sdk -> sdk.onNewIntent(activity, intent));
        handleIifaaCallbackIntent(intent);
    }

    public void setIifaaAutoValidateCallback(@Nullable RXJSONCallback callback) {
        setIifaaAutoValidateCallback(null, callback);
    }

    public void setIifaaAutoValidateCallback(@Nullable String source, @Nullable RXJSONCallback callback) {
        iifaaAutoValidateCallback = callback;
        iifaaAutoValidateSource = source;
        iifaaResumeCompensated = false;
        RXLogger.i("IIFAA set auto validate callback, source=" + source + ", hasCallback=" + (callback != null));
    }

    public void clearIifaaAutoValidateCallback() {
        if (iifaaAutoValidateCallback != null) {
            RXLogger.i("IIFAA clear auto validate callback, source=" + iifaaAutoValidateSource);
        }
        iifaaAutoValidateCallback = null;
        iifaaAutoValidateSource = null;
        iifaaResumeCompensated = false;
    }

    private void notifyIifaaAutoValidateSuccess(@Nullable JSONObject data) {
        RXJSONCallback callback = iifaaAutoValidateCallback;
        if (callback == null) {
            RXLogger.w("IIFAA notify success ignored, callback is null");
            return;
        }
        RXLogger.i("IIFAA notify success to listener");
        ThreadUtils.getInstance().runOnUiThread(() -> callback.onSuccess(data));
    }

    private void notifyIifaaAutoValidateFailed(@NonNull JSONObject cause) {
        RXJSONCallback callback = iifaaAutoValidateCallback;
        if (callback == null) {
            RXLogger.w("IIFAA notify failed ignored, callback is null, cause=" + cause);
            return;
        }
        RXLogger.e("IIFAA notify failed to listener: " + cause);
        ThreadUtils.getInstance().runOnUiThread(() -> callback.onFailed(cause));
    }

    private void notifyIifaaAutoValidateError(@Nullable RXException e) {
        RXJSONCallback callback = iifaaAutoValidateCallback;
        if (callback == null) {
            RXLogger.w("IIFAA notify error ignored, callback is null");
            return;
        }
        RXLogger.e("IIFAA notify error to listener: " + (e == null ? "" : e.getMessage()));
        ThreadUtils.getInstance().runOnUiThread(() -> callback.onError(e));
    }

    private void tryCompensateIifaaAutoValidateOnResume(@NonNull String trigger) {
        if (iifaaAutoValidateCallback == null) {
            return;
        }
        if (iifaaResumeCompensated) {
            RXLogger.i("IIFAA resume compensation skipped, already compensated, trigger=" + trigger);
            return;
        }
        iifaaResumeCompensated = true;
        RXLogger.i("IIFAA resume compensation validate start, trigger=" + trigger + ", source=" + iifaaAutoValidateSource);
        getIIFAAResultWithSource(iifaaAutoValidateSource, IIFAA_CALLBACK_RETRY_COUNT, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("IIFAA resume compensation validate success: " + String.valueOf(data));
                notifyIifaaAutoValidateSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("IIFAA resume compensation validate failed: " + cause);
                notifyIifaaAutoValidateFailed(cause);
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e("IIFAA resume compensation validate error: " + (e == null ? "" : e.getMessage()));
                notifyIifaaAutoValidateError(e);
            }
        });
    }

    private void handleIifaaCallbackIntent(@Nullable Intent intent) {
        if (intent == null) {
            return;
        }
        Uri uri = intent.getData();
        if (uri == null) {
            return;
        }
        String scheme = uri.getScheme();
        if (!isIifaaCallbackScheme(scheme)) {
            RXLogger.i("IIFAA onNewIntent scheme mismatch, scheme=" + scheme
                    + ", expected=" + RXGlobalData.getRealAuthIIFAAScheme());
            return;
        }
        String fullUri = uri.toString();
        if (TextUtils.isEmpty(fullUri) || TextUtils.equals(fullUri, lastIifaaCallbackUri)) {
            RXLogger.i("IIFAA onNewIntent duplicate or empty uri=" + fullUri);
            return;
        }
        if (iifaaAutoValidateCallback == null) {
            RXLogger.w("IIFAA onNewIntent ignored, no auto validate listener, uri=" + fullUri);
            return;
        }

        String lowerUri = fullUri.toLowerCase();
        String bizId = null;
        try {
            if (uri.isHierarchical()) {
                bizId = uri.getQueryParameter("bizid");
            }
        } catch (Exception ignore) {
            // ignore parse failures and continue with keyword fallback
        }
        boolean shouldValidate = !TextUtils.isEmpty(bizId)
                || lowerUri.contains("backfromalipay")
                || lowerUri.contains("iifaa")
                || lowerUri.contains("realauth")
                || lowerUri.contains("alipay");
        if (!shouldValidate) {
            RXLogger.i("IIFAA onNewIntent no validate keyword, uri=" + fullUri);
            return;
        }

        lastIifaaCallbackUri = fullUri;
        RXLogger.i("IIFAA callback detected, auto validate uri=" + fullUri + ", bizId=" + bizId);
        getIIFAAResultWithSource(iifaaAutoValidateSource, IIFAA_CALLBACK_RETRY_COUNT, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("IIFAA auto validate success: " + String.valueOf(data));
                notifyIifaaAutoValidateSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("IIFAA auto validate failed: " + cause);
                notifyIifaaAutoValidateFailed(cause);
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e("IIFAA auto validate error: " + (e == null ? "" : e.getMessage()));
                notifyIifaaAutoValidateError(e);
            }
        });
    }

    private boolean isIifaaCallbackScheme(@Nullable String scheme) {
        if (TextUtils.isEmpty(scheme)) {
            return false;
        }
        String configuredScheme = RXGlobalData.getRealAuthIIFAAScheme();
        if (TextUtils.isEmpty(configuredScheme)) {
            return false;
        }
        Uri configuredUri = Uri.parse(configuredScheme);
        String configuredUriScheme = configuredUri.getScheme();
        if (TextUtils.isEmpty(configuredUriScheme)) {
            configuredUriScheme = configuredScheme;
        }
        return scheme.equalsIgnoreCase(configuredUriScheme);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        ShareManager.getInstance().onActivityResult(activity, requestCode, resultCode, data);
        ActivityLifecycleTracker.onActivityResult(activity, requestCode, resultCode, data);
        // PluginPayManager.onActivityResult(activity, requestCode, resultCode, data);
        invokePlugin(sdk -> sdk.onActivityResult(activity, requestCode, resultCode, data));
    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        ShareManager.getInstance().onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {
        RXGlobalData.updateLanguage(activity);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        invokePlugin(sdk -> sdk.onWindowFocusChanged(hasFocus));
    }

    @Override
    public void onBackPressed() {
        invokePlugin(sdk -> sdk.onBackPressed());
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().build();
    }

    /**
     * @return 获取渠道名
     */
    @Override
    public String getChannel() {
        return getSdkInfo().getName();
    }

    /**
     * 初始化前调用 防沉迷 业务处理 快手，华为
     * @param antiAddictDelegate 回调
     */
    @Override
    public void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate) {
        this.antiAddictDelegate = antiAddictDelegate;
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return false;
    }

    @Override
    public IRXRequest createRequest(String api, Map<String, Object> bodyMap) {
        return RXRequest.create(api).setBody(bodyMap);
    }


    @Override
    public void initThirdSdk(@NonNull Activity activity, @Nullable Map<String, Object> map,
            RXJSONCallback callback) {
        Map<String, Object> safeParams = map != null ? map : new HashMap<>();
        Collection<IPluginSdk> values = getPlugins().values();
        if (!values.isEmpty()) {
            RXCallbackWrapper safeCallback = new RXCallbackWrapper(callback, 1, 100000);
            boolean inited = true;
            for (IPluginSdk thirdSdk : values) {
                boolean i = thirdSdk.init(activity, safeParams, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        RXLogger.i(thirdSdk.getName() + " init success");
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        RXLogger.e(thirdSdk.getName() + " init failed");
                        RxErrorReportUtil.ThirdInitError.isError = true;
                        RxErrorReportUtil.ThirdInitError.thirdName = thirdSdk.getName();
                        RxErrorReportUtil.ThirdInitError.cause = cause;
                        safeCallback.onFailed(cause);
                    }
                });
                if (!i) {
                    inited = i;
                }
            }
            if (inited) {
                safeCallback.onSuccess(null);
            }

        } else if (callback != null) {
            callback.onSuccess(null);
        }
    }

    /**
     * 默认渠道不提供额外 action，子类按需覆盖。
     */
    @Override
    public void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback) {
        notifyChannelActionFailed(action, "channel action is not supported", callback);
    }

    /**
     * 返回统一的渠道 action 成功结果。
     */
    protected final void notifyChannelActionSuccess(@NonNull String action,
            @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        Map<String, Object> result = new HashMap<>();
        result.put("code", RXErrorCode.OK);
        result.put("msg", "success");
        result.put("action", action);
        callback.onSuccess(JSONUtil.toJSONObject(result));
    }

    /**
     * 返回统一的渠道 action 失败结果。
     */
    protected final void notifyChannelActionFailed(@Nullable String action, @NonNull String msg,
            @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        Map<String, Object> result = new HashMap<>();
        result.put("code", RXErrorCode.UNKNOWN_THIRD_ERROR);
        result.put("msg", msg);
        result.put("action", action);
        callback.onFailed(JSONUtil.toJSONObject(result));
    }

    public void unityInitThirdSdk(@NonNull Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        initThirdSdk(activity, map, UnityBaseCommonFun.convertJSONCallback(callback));
    }

    public void unityInvokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable UnityRXRequestCallback callback) {
        invokeChannelAction(activity, action, params,
                UnityBaseCommonFun.convertJSONCallback(callback));
    }

    @Keep
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        LoginParams loginParams = LoginParams.fromMap(map);
        if (!TextUtils.isEmpty(loginParams.getLoginOpenid())) {
            // 二次登录
            return false;
        }
        // else if (LoginMethod.WECHAT.equals(loginParams.getMethod())) {
        // WXManager.login(activity, map, (RXJSONCallback) callback);
        // return true;
        // }
        // else if (LoginMethod.QUICKPHONE.equals(loginParams.getMethod())) {
        // AliOAuthLoginManager.doLogin(activity, map, callback);
        // return true;
        // }

        RXJSONCallback proxyRXJSONCallback = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), loginParams.getMethod(), "rxlog_error_login", cause);
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        };

        IPluginSdk thirdSdk = getPlugins().get(loginParams.getMethod());
        if (thirdSdk != null) {
            return thirdSdk.doLogin(activity, map, proxyRXJSONCallback);
        }
        return false;
    }

    @Keep
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        return false;
    }

    @Keep
    protected boolean onSwitchAccount(int code, String data) {
        if (this.ruiXueSdkCallback != null) {
            return ruiXueSdkCallback.onSwitchAccount(code, data);
        }
        return false;
    }

    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallback) {
        setPrivacyAgree(context, true, privacyCallback);
    }

    @Override
    public void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback) {
        SharedPreferences sp = context.getSharedPreferences(userAgreementResult, Context.MODE_PRIVATE);
        sp.edit().putBoolean(userAgreementResult, isAgree).apply();
        if (privacyCallback != null)
            privacyCallback.onPrivacyAgree(isAgree);
        if (isAgree && RuiXueSdk.isFullyInitialized()) {
            PassportManager.getInstance().userActivated(RXGlobalData.getActivatedMap(), null);
        }
    }

    @Override
    public boolean isAgreedPrivacy() {
        Context context = RXGlobalData.getContext();
        if (context != null) {
            SharedPreferences sp = context.getSharedPreferences(userAgreementResult, Context.MODE_PRIVATE);
            return sp.getBoolean(userAgreementResult, false);
        } else {
            RXLogger.w("privacy context is null");
            return false;
        }
    }

    public void ruixueLogin(Map<String, Object> map, RXJSONCallback callback) {
        if (!isAgreedPrivacy() && callback != null) {
            onLoginResp(RXErrorCode.DISAGREE_PRIVACY.getValue());
            callback.onFailed(RXErrorCode.DISAGREE_PRIVACY.toJSONObject());
        } else {
            RXApiHelper.Passport.login(map, new RXJSONCallback() {
                @Override
                public void onError(RXException e) {
                    onLoginResp(e.getCode());
                    if (callback != null)
                        callback.onError(e);
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    onLoginResp(0);
                    if (callback != null)
                        callback.onSuccess(data);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    onLoginResp(cause.optInt("code", -1));
                    if (callback != null)
                        callback.onFailed(cause);
                }
            });
        }
    }

    protected void ruixueLogout(OnLogoutCallback callback) {
        if (callback != null) {
            callback.onSuccess("");
        }
        if (this.ruiXueSdkCallback != null) {
            ruiXueSdkCallback.onLogout(0, "");
        }
        PassportManager.getInstance().logout();
    }


    public boolean isLogin() {
        return PassportManager.getInstance().isLoggedIn();
    }


    public LoginData getLoginData() {
        return PassportManager.getInstance().getLoginData();
    }


    public void login(Activity activity, RXJSONCallback callback) {
        login(activity, new HashMap<>(), callback);
    }

    /**
     * 登录
     * @param activity 应用 activity
     * @param map      map 参数
     *                 ts integer 必须 时间戳 单位毫秒 mock: @timestamp
     *                 option integer 非必须 位运算符
     *                 method string 必须登录方式 mock: kuaishou ext:game_id,game_token
     *                 username string 非必须用户名
     *                 password string 非必须 密码（method=username 时必传；SDK 内部会进行 MD5 并转大写后再请求）
     *                 login_openid string 非必须二次登录凭证，首次登录成功后可拿到
     *                 bind_thirdparty integer 非必须本次是否为绑定三方登录方式的登录行为
     *                 mock: @integer(0,1)
     *                 ad 被分享邀请时传递的参数对象
     *                 device 设备标识信息
     * @param callback 回调函数
     */
    @Override
    public void login(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        if (map == null) {
            map = new HashMap<>();
        }
        if (!map.containsKey("trace_id")) {
            map.put("trace_id", UUID.randomUUID().toString());
        }
        Map<String, Object> finalHashMap = map;
        String loginMethod = (String) map.get(KEY_LOGIN_METHOD);
        String loginOpenid = (String) map.get(KEY_LOGIN_OPENID);
        boolean isQuickLogin = !TextUtils.isEmpty(loginMethod) && !TextUtils.isEmpty(loginOpenid);
        boolean isThirdLogin = false;

        PresetEventHelper.loginBefore(map);
        if (!isQuickLogin && !ObjectUtils.toBoolean(map.get("ruixue_login"))) {
            isThirdLogin = LoginMethod.isChannel(loginMethod) && thirdLogin(activity, map, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    PresetEventHelper.loginAuth(loginMethod, true, null);
                    finalHashMap.put("ext", data);
                    Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("login", loginMethod, "success");
                    properties.put("third_res", data);
                    UserActionTrackManager.getInstance().reportUserAction(properties);
                    ruixueLogin(finalHashMap, callback);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    PresetEventHelper.loginAuth(loginMethod, false, cause);
                    boolean redirectLogin = cause.optBoolean("redirectLogin");
                    if (redirectLogin && cause.has("redirect")) {
                        Map<String, Object> redirectMap = JSONUtil.toMap(cause.optJSONObject("redirect"));
                        RXLogger.i("redirect login:" + cause);
                        login(activity, redirectMap, callback);
                    } else if (callback != null) {
                        callback.onFailed(cause);
                        Map<String, Object> m = JSONUtil.toMap(cause);
                        m.putAll(finalHashMap);
                        try {
                            Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("login", loginMethod, "fail");
                            UserActionTrackManager.getInstance().reportUserAction(properties);
                            properties.put("error_code", m.get("code"));
                            properties.put("error_message", m.get("msg"));
                            properties.put("error_code_tripartite", m.get("thirdcode"));
                            properties.put("error_message_tripartite", m.get("thirdmsg"));
                            UserActionTrackManager.getInstance().reportUserAction(properties);
                        } catch (Exception ignore) {
                        }
                        RxErrorReportUtil.reportError("#login_error", m);
                    }
                }

                @Override
                public void onError(RXException e) {
                    callback.onError(e);
                    PresetEventHelper.loginAuth(loginMethod, false, e.toJSONObject());
                    Map<String, Object> m = e.toMap();
                    m.putAll(finalHashMap);
                    RxErrorReportUtil.reportError("#login_error", m);
                }
            });
        }
        RXLogger.d("method:" + loginMethod + " ,isThirdLogin:" + isThirdLogin + " ,isQuickLogin:" + isQuickLogin);
        LogHelper.writeLogLoginInvoke(finalHashMap);
        if (!isThirdLogin) {
            ruixueLogin(map, callback);
        }
    }


    public void login(Activity activity, LoginParams loginParams, RXJSONCallback callback) {
        login(activity, loginParams.toMap(), callback);
    }

    public void bindAccount(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        thirdLogin(activity, map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                map.put("ext", data);
                if (!map.containsKey("scene")) {
                    map.put("scene", "authorization");
                }
                PassportManager.getInstance().bindAccount(map, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                if (callback != null)
                    callback.onError(e);
            }
        });
    }

    public void bindAccount(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        bindAccount(activity, map, UnityBaseCommonFun.convertCallback(callback));
    }

    public void syncInfo(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        thirdLogin(activity, map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                PassportManager.getInstance().syncInfo(data, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                if (callback != null)
                    callback.onError(e);
            }
        });
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        boolean isThirdLogout = thirdLogout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String res) {
                PassportManager.getInstance().logout();
                if (null != callback) {
                    callback.onSuccess(res);
                }
                if (ruiXueSdkCallback != null) {
                    ruiXueSdkCallback.onLogout(0, res);
                }
            }

            @Override
            public void onFailed(int code, String msg) {
                if (null != callback) {
                    callback.onFailed(code, msg);
                }

            }
        });
        if (!isThirdLogout) {
            ruixueLogout(callback);
        }
    }

    @Override
    public void setRuiXueSdkCallback(RuiXueSdkCallback ruiXueSdkCallback) {
        this.ruiXueSdkCallback = ruiXueSdkCallback;
    }

    public void onReportUserLog(String json) {
        JSONObject jsonObject = JSONUtil.toJSONObject(json);
        RXGlobalData.FEEDBACK_ID = jsonObject.optInt("feedback_id");
        RXGlobalData.LOG_PATH = jsonObject.optString("log_path", "");
        if (this.ruiXueSdkCallback != null) {
            this.ruiXueSdkCallback.rxPublicCallback(RuiXueSdkCallback.FEED_BACK, JSONUtil.toMap(jsonObject));
        }
    }

    /**
     * @param activity 应用上下文
     * @param callback app退出回调
     * @return 是否有退出确认。
     */
    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {

        invokePlugin(sdk -> sdk.doExitApp(activity, callback));
        if (callback != null) {
            callback.onExitConfirm("");
        }
        return false;
    }

    @Override
    public void setSubChannelId(String subChannelid) {
        RXGlobalData.setsSubChannelId(subChannelid);
    }

    /**
     * 注册
     * @param map      map 参数
     *                 username string 必须 用户名
     *                 password string 必须 密码（建议传明文；SDK 内部会进行 MD5 并转大写后再请求）
     *                 nickname string 非必须 昵称
     *                 captcha_code string 必须 验证码
     *                 avatarUrl string 非必须 头像地址
     *                 birthday string 非必须 出生年份
     *                 type integer 必须
     *                 注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）：手机号注册必须填写验证码，邮箱注册必填验证码
     *                 sex integer 非必须 性别,1:男,0:女
     *                 ad object 非必须
     *                 device object 非必须 设备标识信息
     * @param callback 回调函数
     */

    public void register(Map<String, Object> map, RXJSONCallback callback) {
        if (!isAgreedPrivacy()) {
            callback.onFailed(RXErrorCode.DISAGREE_PRIVACY.toJSONObject());
        } else {
            RXApiHelper.Passport.register(map, callback);
        }
    }


    public void register(RegisterParams registerParams, RXJSONCallback callback) {
        register(registerParams.toMap(), callback);
    }

    @Override
    public void legalTerms(String keys, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("keys", keys);
        legalTerms(hashMap, callback);
    }

    @Override
    public void legalTerms(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.legalTerms(hashMap, callback);
    }


    public boolean verifyCaptcha(Map<String, Object> hashMap, RXJSONCallback callback) {
        return RXApiHelper.Passport.verifyCaptcha(hashMap, callback);
    }

    /**
     * @param phoneOrEmail 手机号或邮箱
     * @param purpose      用途
     * @param isMail       是否邮箱
     * @param captcha_code 验证码
     * @param callback     回调
     */
    public boolean verifyCaptcha(String phoneOrEmail, String purpose, boolean isMail, String captcha_code, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (!TextUtils.isEmpty(phoneOrEmail)) {
            if (isMail) {
                hashMap.put("email", phoneOrEmail);
            } else {
                hashMap.put("phone", phoneOrEmail);
            }
        }
        hashMap.put("purpose", purpose);
        hashMap.put("captcha_code", captcha_code);
        return verifyCaptcha(hashMap, callback);
    }

    /**
     * 发送验证码
     * @param map      map 参数
     *                 email string 非必须邮箱 (和参数phone二选一 全填写默认为手机号码)；
     *                 phone string 非必须 手机号码 (和参数email二选一 全填写默认为手机号码)；
     *                 purpose 参考 {@link com.ruixue.base.CaptchaPurpose}；
     * @param callback 回调函数
     */
    public boolean sendCaptcha(Map<String, Object> map, RXJSONCallback callback) {
        return sendCaptcha(RuiXueSdk.getCurrentActivity(), map, callback);
    }

    public boolean sendCaptcha(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        return RXApiHelper.Passport.sendCaptchaWithVerify(activity, map, callback);
    }

    public boolean sendCaptcha(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return sendCaptcha(activity, map, UnityBaseCommonFun.convertCallback(callback));
    }

    public boolean sendCaptcha(String phone, String purpose, boolean isMail, RXJSONCallback callback) {
        return sendCaptcha(phone, purpose, isMail, null, null, callback);
    }

    public boolean sendCaptcha(String phone, String purpose, boolean isMail, UnityRXRequestCallback callback) {
        return sendCaptcha(phone, purpose, isMail, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public boolean sendCaptcha(CaptchaType type, String target, String purpose, RXJSONCallback callback) {
        return sendCaptcha(target, purpose, type == CaptchaType.CaptchaType_email, null, null, callback);
    }

    public boolean sendCaptcha(CaptchaType type, String target, String purpose, UnityRXRequestCallback callback) {
        return sendCaptcha(type, target, purpose, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, RXJSONCallback callback) {
        return verifyCaptcha(target, purpose, type == CaptchaType.CaptchaType_email, captcha_code, callback);
    }

    public boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, UnityRXRequestCallback callback) {
        return verifyCaptcha(type, target, purpose, captcha_code, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void register(String username, String password, String captchaCode, Map<String, Object> ext, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("username", username);
        hashMap.put("password", password);
        hashMap.put("captcha_code", captchaCode);
        if (ext != null) {
            hashMap.putAll(ext);
        }
        register(hashMap, callback);
    }

    public void register(String username, String password, String captchaCode, Map<String, Object> ext, UnityRXRequestCallback callback) {
        register(username, password, captchaCode, ext, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 发送验证码
     * @param phoneOrEmail 验证码类型
     * @param purpose      发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
     *                     ！register           // 注册
     *                     ！bindphone      // 绑定手机
     *                     ！unbindphone  // 解绑手机
     *                     ！resetpwd        // 重置密码
     *                     ！changepwd    // 修改密码
     *                     ！bindemail       // 绑定邮箱
     *                     ！unbindemail   // 解绑邮箱
     *                     ！login               // 登录
     * @param isMail       是否是邮箱
     * @param randstr      图形验证随机串，可传空
     * @param ticket       图形验证凭证，可传空
     */
    public boolean sendCaptcha(String phoneOrEmail, String purpose, boolean isMail, String randstr, String ticket, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (!TextUtils.isEmpty(phoneOrEmail)) {
            if (isMail) {
                hashMap.put("email", phoneOrEmail);
            } else {
                hashMap.put("phone", phoneOrEmail);
            }

            Map<String, Object> captcha = new HashMap<>();
            if (!TextUtils.isEmpty(randstr)) {
                captcha.put("randstr", randstr);
            }
            if (!TextUtils.isEmpty(ticket)) {
                captcha.put("ticket", ticket);
            }
            if (!captcha.isEmpty()) {
                hashMap.put("tencent_captcha", captcha);
            }
        }
        hashMap.put("purpose", purpose);
        return sendCaptcha(hashMap, callback);
    }

    public boolean sendCaptcha(String phoneOrEmail, String purpose, boolean isMail, String randstr, String ticket, UnityRXRequestCallback callback) {
        return sendCaptcha(phoneOrEmail, purpose, isMail, randstr, ticket, UnityBaseCommonFun.convertCallback(callback));
    }


    public void changePhone(Map<String, Object> hashMap, RXJSONCallback callback) {
        PassportManager.getInstance().changePhone(hashMap, callback);
    }

    @Override
    public void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("oldphone_captcha", oldPhoneCaptcha);
        hashMap.put("newphone", newPhone);
        hashMap.put("newphone_captcha", newPhoneCaptcha);
        if (migrateArgs != null) {
            hashMap.put("migrate_args", migrateArgs);
        }
        changePhone(hashMap, callback);
    }

    @Override
    public void changeEmail(String newEmail, String newEmailCaptcha, String oldEmailCaptcha, Object migrateArgs, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("old_email_captcha", oldEmailCaptcha);
        hashMap.put("new_email", newEmail);
        hashMap.put("new_email_captcha", newEmailCaptcha);
        if (migrateArgs != null) {
            hashMap.put("migrate_args", migrateArgs);
        }
        PassportManager.getInstance().changeEmail(hashMap, callback);
    }

    public void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, UnityRXRequestCallback callback) {
        changePhone(newPhone, newPhoneCaptcha, oldPhoneCaptcha, migrateArgs, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 手机绑定
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void bindPhone(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.bindPhone(map, callback);
    }

    @Override
    public void bindPhone(String phone, String password, String captcha_code, Object migrate_args, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("phone", phone);
        hashMap.put("password", password);
        hashMap.put("captcha_code", captcha_code);
        if (migrate_args != null) {
            hashMap.put("migrate_args", migrate_args);
        }
        bindPhone(hashMap, callback);
    }

    public void bindPhone(String phone, String password, String captcha_code, Object migrate_args, UnityRXRequestCallback callback) {
        bindPhone(phone, password, captcha_code, migrate_args, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 解绑手机号
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void unBindPhone(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.unbindPhone(map, callback);
    }

    @Override
    public void unBindPhone(String phone, String captcha_code, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("phone", phone);
        hashMap.put("captcha_code", captcha_code);
        unBindPhone(hashMap, callback);
    }

    public void unBindPhone(String phone, String captcha_code, UnityRXRequestCallback callback) {
        unBindPhone(phone, captcha_code, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 修改密码
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void changePassword(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.changePwd(map, callback);
    }

    @Override
    public void changePassword(String old_password, String new_password, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("old_password", old_password);
        hashMap.put("new_password", new_password);
        changePassword(hashMap, callback);
    }

    public void changePassword(String old_password, String new_password, UnityRXRequestCallback callback) {
        changePassword(old_password, new_password, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void realAuth(String realname, String idcard, RXJSONCallback callback) {
        certification(realname, idcard, false, callback);
    }

    @Override
    public void realAuth(String realname, String idcard, boolean isFastRealAuth, RXJSONCallback callback) {
        certification(realname, idcard, isFastRealAuth, callback);
    }

    public void realAuth(String realname, String idcard, UnityRXRequestCallback callback) {
        certification(realname, idcard, false, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 密码重置
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void resetPassword(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.resetPwd(map, callback);
    }

    @Override
    public void resetPassword(String username, String password, String captcha_code, Object migrate_args, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("username", username);
        hashMap.put("password", password);
        hashMap.put("captcha_code", captcha_code);
        if (migrate_args != null) {
            hashMap.put("migrate_args", migrate_args);
        }
        resetPassword(hashMap, callback);
    }

    public void resetPassword(String username, String password, String captcha_code, Object migrate_args, UnityRXRequestCallback callback) {
        resetPassword(username, password, captcha_code, migrate_args, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void searchHasAccounts(String method, String devicecode, int states, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("method", method);
        hashMap.put("devicecode", devicecode);
        hashMap.put("states", states);
        searchHasAccounts(hashMap, callback);
    }

    @SuppressWarnings("unchecked")
    @Override
    public void login(Activity activity, String loginType, String username, String password, String captchaCode, String loginOpenId, Map<String, Object> ext, String[] signFields, Object migrateArgs, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("method", loginType);
        if (null != (ext)) {
            hashMap.putAll(ext);
        }
        Map<String, Object> extm = hashMap.containsKey("ext") ? (Map<String, Object>) hashMap.get("ext") : new HashMap<>();
        if (!TextUtils.isEmpty(username))
            hashMap.put("username", username);
        if (!TextUtils.isEmpty(password))
            hashMap.put("password", password);
        if (!TextUtils.isEmpty(captchaCode)) {
            extm.put("captcha_code", captchaCode);
            hashMap.put("ext", extm);
        }
        if (!TextUtils.isEmpty(loginOpenId))
            hashMap.put("login_openid", loginOpenId);
        if (null != (migrateArgs))
            hashMap.put("migrate_args", migrateArgs);
        if (null != (signFields))
            hashMap.put("sign_fields", signFields);

        login(activity, hashMap, callback);
    }

    public void login(Activity activity, String loginType, String username, String password, String captchaCode, String loginOpenId, Map<String, Object> ext, String[] signFields, Object migrateArgs, UnityRXRequestCallback callback) {
        login(activity, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 注销账号
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void deregister(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.deregister(map, callback);
    }


    @Override
    public void deregister(RXDeregisterConfig deregisterConfig, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (deregisterConfig.thirdParams != null) {
            hashMap.putAll(deregisterConfig.thirdParams);
        }
        if (!TextUtils.isEmpty(deregisterConfig.idcard))
            hashMap.put("idcard", deregisterConfig.idcard);
        if (!TextUtils.isEmpty(deregisterConfig.realname))
            hashMap.put("realname", deregisterConfig.realname);
        if (!TextUtils.isEmpty(deregisterConfig.cpdata)) {
            hashMap.put("cpdata", deregisterConfig.cpdata);
        }
        deregister(hashMap, callback);
    }

/*    public void deregister(String idcard, String realname, String cpdata, UnityRXRequestCallback callback) {
        deregister(idcard, realname, cpdata, UnityBaseCommonFun.convertCallback(callback));
    }*/

    public void deregister(RXDeregisterConfig deregisterConfig, UnityRXRequestCallback callback) {
        deregister(deregisterConfig, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 撤销账号注销申请
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void deregisterCancel(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.deregisterCancel(map, callback);
    }

    public void deregisterCancel(Map<String, Object> map, UnityRXRequestCallback callback) {
        deregisterCancel(new HashMap<>(), UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void deregisterCancel(RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        deregisterCancel(hashMap, callback);
    }

    /**
     * 实名认证
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void certification(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.certification(map, callback);
    }

    public void certification(Map<String, Object> map, UnityRXRequestCallback callback) {
        RXApiHelper.Passport.certification(map, UnityBaseCommonFun.convertCallback(callback));
    }

    public void certification(String realname, String idcard, boolean isFastAuth, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("realname", realname);
        map.put("idcard", idcard);
        map.put("is_fast_auth", isFastAuth ? 1 : 0);
        certification(map, callback);
    }

    @Override
    public void getIIFAAResultWithRetryCount(int retryCount, RXJSONCallback callback) {
        RXApiHelper.Passport.getIIFAAResultWithRetryCount(retryCount, callback);
    }

    @Override
    public void getIIFAAResultWithSource(@Nullable String source, int retryCount, RXJSONCallback callback) {
        RXApiHelper.Passport.getIIFAAResultWithSource(source, retryCount, callback);
    }

    @Override
    public void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, RXJSONCallback callback) {
        RXApiHelper.Passport.getIIFAARedirectURL(appName, thirdPartSchema, callback);
    }

    public void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, UnityRXRequestCallback callback) {
        getIIFAARedirectURL(appName, thirdPartSchema, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getIIFAAResultWithRetryCount(int retryCount, UnityRXRequestCallback callback) {
        getIIFAAResultWithRetryCount(retryCount, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getIIFAAResultWithSource(@Nullable String source, int retryCount, UnityRXRequestCallback callback) {
        getIIFAAResultWithSource(source, retryCount, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 邮箱绑定
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void bindEmail(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.bindEmail(map, callback);
    }

    public void searchBindingAccounts(UnityRXRequestCallback callback) {
        searchBindingAccounts(UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void bindEmail(String email, String password, String captcha_code, Object migrate_args, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("email", email);
        hashMap.put("password", password);
        hashMap.put("captcha_code", captcha_code);
        if (migrate_args != null) {
            hashMap.put("migrate_args", migrate_args);
        }
        bindEmail(hashMap, callback);
    }

    public void bindEmail(String email, String password, String captcha_code, Object migrate_args, UnityRXRequestCallback callback) {
        bindEmail(email, password, captcha_code, migrate_args, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 解绑邮箱
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void unBindEmail(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.unbindEmail(map, callback);
    }

    @Override
    public void unBindEmail(String email, String captcha_code, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("email", email);
        hashMap.put("captcha_code", captcha_code);
        unBindEmail(hashMap, callback);
    }

    public void unBindEmail(String email, String captcha_code, UnityRXRequestCallback callback) {
        unBindEmail(email, captcha_code, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 修改用户信息
     * @param map      map 参数
     * @param callback 回调函数
     */

    public void updateUserInfo(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.updateUserInfo(map, callback);
    }

    public void updateUserInfo(@NonNull UserInfoParams userInfoParams, RXJSONCallback callback) {
        updateUserInfo(userInfoParams.toMap(), callback);
    }

    /**
     * 获取用户信息
     * @param callback 回调函数
     */
    @Override
    public void getUserInfo(RXJSONCallback callback) {
        RXApiHelper.Passport.getUserInfo(callback);
    }

    /**
     * 获取指定用户信息
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void getUserInfoByField(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.getUserInfoByField(map, callback);
    }

    @Override
    public void updateUserInfo(String nickname, String avatarUrl, String region, int sex, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (!TextUtils.isEmpty(nickname))
            hashMap.put("nickname", nickname);
        if (!TextUtils.isEmpty(avatarUrl))
            hashMap.put("avatarUrl", avatarUrl);
        if (!TextUtils.isEmpty(region))
            hashMap.put("region", region);
        if (sex != -1) {
            hashMap.put("sex", sex);
        }
        updateUserInfo(hashMap, callback);
    }

    @Override
    public void updateUserInfo(String nickname, String avatarUrl, String region, int sex, Map<String, Object> ext, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (!TextUtils.isEmpty(nickname))
            hashMap.put("nickname", nickname);
        if (!TextUtils.isEmpty(avatarUrl))
            hashMap.put("avatarUrl", avatarUrl);
        if (!TextUtils.isEmpty(region))
            hashMap.put("region", region);
        if (sex != -1) {
            hashMap.put("sex", sex);
        }
        if (ext != null) {
            hashMap.put("ext", ext);
        }
        updateUserInfo(hashMap, callback);
    }

    public void updateUserInfo(String nickname, String avatarUrl, String region, int sex, UnityRXRequestCallback callback) {
        updateUserInfo(nickname, avatarUrl, region, sex, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getUserInfo(UnityRXRequestCallback callback) {
        getUserInfo(UnityBaseCommonFun.convertCallback(callback));
    }

    public void getUserInfoByField(Map<String, Object> map, UnityRXRequestCallback callback) {
        getUserInfoByField(map, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void searchBindingAccounts(RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.ACCOUNT_BOUND_QUERY).setRestfulData(false).postAsync(callback);
    }


    public void searchHasAccounts(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.ACCOUNT_QUERY).setBody(hashMap).setRestfulData(false).postAsync(callback);
    }

    /**
     * @param activity 应用 activity
     * @param map      map 参数
     *                 transmitArgs string 非必须 客户透传信息
     *                 clientType string 非必须 客户端类型APP/H5
     *                 is_debug number 非必须 是否测试订单
     *                 goodsTag string 非必须 商品标识
     *                 tradeNo string 非必须 商户订单号
     *                 goodsName string 非必须 商品名称
     *                 type string 非必须 支付方式
     *                 type string 非必须 支付方式
     *                 ext object 非必须 三方支付额外传递
     * @param callback 回调函数
     */
    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> map, RXJSONCallback callback) {
        boolean handle = false;
        RXJSONCallback ProxyRXJSONCallback = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), map.get(HQType.KEY) + "", "rxlog_error_pay", cause);
            }
        };

        if (ObjectUtils.toBoolean(map.get("exchange"))) {
            map.remove("exchange");
            RXApiHelper.exchange(map, ProxyRXJSONCallback);
            return;
        }

        for (IPluginSdk thirdSdk : getPlugins().values()) {
            try {
                handle = thirdSdk.doPay(activity, map, ProxyRXJSONCallback);
                if (handle) {
                    break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (!handle && callback != null) {
            RXLogger.e("nonsupport pay type error params", map.toString());
            JSONObject errorJsonObject = JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "不支持的HQ方式 " + map.get(HQType.KEY));
            RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), map.get(HQType.KEY) + "", "rxlog_error_pay", errorJsonObject);
            callback.onFailed(errorJsonObject);
        }
    }

    public void test(List<Object> list) {
        Map<String, String> hashMap = new HashMap<>();
        hashMap.put("", "");

        for (int i = 0; i < list.size(); i++) {
            Log.d("EventManager", "List结果：" + list.get(i));
        }
    }


    public void pay(Activity activity, @NonNull Map<String, Object> map, UnityRXRequestCallback callback) {
        pay(activity, map, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 查询是否支持免密支付
     * @param callback {
     *                 "data": {
     *                 "agreement_no_encrypt": "string",
     *                 "quick_text": "string"
     *                 },
     *                 "code": 0
     *                 }
     */
    @Override
    public void checkQuickAp(RXJSONCallback callback) {
        RXRequest.create(RXApiPath.QUICK_AP_CHECK).setMethod(HttpMethod.GET).setCallback(callback).execRequestAsync();
    }

    public void checkQuickAp(UnityRXRequestCallback callback) {
        checkQuickAp(UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void pay(Activity activity, HQParams payParams, RXJSONCallback callback) {
        pay(activity, payParams.toMap(), callback);
    }

    @Override
    public final void submitChannelPayment(int amountFen, @Nullable RXJSONCallback callback) {
        submitChannelPayment(amountFen, null, callback);
    }

    @Override
    public final void submitChannelPayment(int amountFen, @Nullable Map<String, Object> override,
                                           @Nullable RXJSONCallback callback) {
        if (amountFen <= 0) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                        "amount must be greater than 0, unit is fen"));
            }
            return;
        }
        Map<String, Object> reportContext = ChannelPaymentOrderCache.resolveForReport(amountFen, override);
        onSubmitChannelPayment(amountFen, reportContext,
                wrapChannelPaymentTrackCallback(amountFen, reportContext, callback));
    }

    /**
     * 渠道实现：向三方合规系统上报充值金额。大数据上报由 {@link #submitChannelPayment(int, Map, RXJSONCallback)} 统一封装。
     */
    protected void onSubmitChannelPayment(int amountFen, @NonNull Map<String, Object> reportContext,
                                          @Nullable RXJSONCallback callback) {
        if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR.getValue(),
                    "Current channel does not support submitChannelPayment"));
        }
    }

    @NonNull
    private RXJSONCallback wrapChannelPaymentTrackCallback(int amountFen, @NonNull Map<String, Object> reportContext,
                                                           @Nullable RXJSONCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                BillingClient.trackChannelPaymentResult("success", amountFen, reportContext, data);
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                BillingClient.trackChannelPaymentResult("failed", amountFen, reportContext, cause);
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                BillingClient.trackChannelPaymentResult("failed", amountFen, reportContext, e.toJSONObject());
                if (callback != null) {
                    callback.onError(e);
                }
            }
        };
    }

    @Override
    public void checkChannelPaymentLimit(@Nullable Activity activity, int amountFen,
                                         @Nullable RXJSONCallback callback) {
        if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR.getValue(),
                    "Current channel does not support checkChannelPaymentLimit"));
        }
    }

    public void unitySubmitChannelPayment(int amountFen, UnityRXRequestCallback callback) {
        submitChannelPayment(amountFen, UnityBaseCommonFun.convertCallback(callback));
    }

    public void unitySubmitChannelPayment(int amountFen, @Nullable Map<String, Object> override,
                                          UnityRXRequestCallback callback) {
        submitChannelPayment(amountFen, override, UnityBaseCommonFun.convertCallback(callback));
    }

    public void unityCheckChannelPaymentLimit(@Nullable Activity activity, int amountFen,
                                              UnityRXRequestCallback callback) {
        checkChannelPaymentLimit(activity, amountFen, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * @param activity 应用 activity
     * @param map      "auto_share": "根据埋点自动获取数据并拉起app分享",
     *                 "auto_report": "autoShare为 true 时，分享后是否自动上报",
     *                 "title": "链接标题1",
     *                 "url": "https://domain-open.com/youdao?identity=rdp6uNmVg",
     *                 "material_type": "link",
     *                 "image":
     *                 "https://rxfile.weilekuiming.com/operation_app/operation/20220601012849_weileshare.png",
     *                 "content": "链接文案1"
     * @param callback 回调函数
     */
    public void share(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        boolean autoShare = !map.containsKey("auto_share") ? map.containsKey("func") : ObjectUtils.toBoolean(map.get("auto_share"));
        boolean autoReport = map.containsKey("auto_report") && ObjectUtils.toBoolean(map.get("auto_report"));
        share(activity, autoShare, autoReport, map, callback);
    }

    @Override
    public void getShareInfo(RXShareConfig shareConfig, RXJSONCallback callback) {
        getShareData(shareConfig.toMap(), callback);
    }

    public void getShareInfo(RXShareConfig shareConfig, UnityRXRequestCallback callback) {

        RXShareConfig rxShareConfig = JSONUtil.fromJson("", RXShareConfig.class);

        getShareInfo(shareConfig, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void shareCustom(Activity activity, RXCustomShareConfig config, RXJSONCallback callback) {
        doShareByPlatform(activity, config.getPlatform(), config.toMap(), callback);
    }

    public void shareCustom(Activity activity, RXCustomShareConfig config, UnityRXRequestCallback callback) {
        shareCustom(activity, config, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void share(Activity activity, RXShareConfig shareConfig, RXJSONCallback callback) {
        share(activity, true, shareConfig.isAutoReport(), shareConfig.toMap(), callback);
    }

    public void share(Activity activity, RXShareConfig shareConfig, UnityRXRequestCallback callback) {
        share(activity, shareConfig, UnityBaseCommonFun.convertCallback(callback));
    }

    public void share(Activity activity, String func, String platform, String region, boolean report, String transmits, Map<String, Object> ext, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("func", func);
        map.put("platform", platform);
        map.put("transmits", transmits);
        map.put("region", region);
        if (ext != null) {
            map.putAll(ext);
        }
        boolean autoShare = !map.containsKey("auto_share") ? map.containsKey("func") : ObjectUtils.toBoolean(map.get("auto_share"));
        boolean autoReport = map.containsKey("auto_report") && ObjectUtils.toBoolean(map.get("auto_report"));
        share(activity, autoShare, autoReport, map, callback);
    }

    public void share(Activity activity, String func, String platform, String region, boolean report, String transmits, Map<String, Object> ext, UnityRXRequestCallback callback) {
        share(activity, func, platform, region, report, transmits, ext, UnityBaseCommonFun.convertCallback(callback));
    }


    /**
     * @param activity   activity
     * @param autoShare  根据埋点自动获取数据并拉起app分享
     * @param autoReport autoShare为 true 时，分享后是否自动上报
     * @param map        埋点数据表 或 分享数据表。
     * @param callback   回调 分享埋点数据 autoShare true 额外带分享结果
     */
    public void share(Activity activity, boolean autoShare, boolean autoReport, Map<String, Object> map, RXJSONCallback callback) {
        RXJSONCallback proxyRXJSONCallback = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), map.get("platform") + "", "rxlog_error_share", cause);
            }
        };
        ShareManager.getInstance().doShare(activity, autoShare, autoReport, map, proxyRXJSONCallback);
    }


    public void doShareByPlatform(Activity activity, String platform, Map<String, Object> hashMap, RXJSONCallback callback) {
        RXJSONCallback proxyRXJSONCallback = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), platform, "rxlog_error_share", cause);
            }
        };
        ShareManager.getInstance().doShareByPlatform(activity, platform, hashMap, proxyRXJSONCallback);
    }

    /**
     * @param hashMap  scheduling_use_type	String	固定值   ad_done
     *                 scheduling_strategy_id	String	调度策略id， 获取分享数据接口为广告时下发
     *                 open_id	String	用户的OpenID
     * @param callback
     */
    public void ADSchedulingReport(Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap == null) {
            hashMap = new HashMap<>();
        }
        if (!hashMap.containsKey("scheduling_use_type"))
            hashMap.put("scheduling_use_type", "ad_done");

        if (!hashMap.containsKey("open_id"))
            hashMap.put("open_id", RuiXueSdk.getOpenid());
        RXApiHelper.Share.ADSchedulingReport(hashMap, callback);
    }

    @Deprecated
    @Override
    public void shareReport(String distinctId, Map<String, Object> properties) {
        ShareManager.getInstance().shareReport(properties);
    }

    @Deprecated
    @Override
    public void shareReport(ShareDataResult shareDataResult) {
        ShareManager.getInstance().shareReport(shareDataResult);
    }

    @Override
    public void getShortUrl(@NonNull String url, RXJSONCallback callback) {
        Map<String, Object> m = new HashMap<>();
        m.put("url", url);
        getShortUrl(m, callback);
    }

    public void getShortUrl(@NonNull String url, UnityRXRequestCallback callback) {
        getShortUrl(url, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getShortUrl(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        ShareManager.getInstance().getShortUrl(hashMap, callback);
    }

    public void getShortUrl(@NonNull Map<String, Object> hashMap, UnityRXRequestCallback callback) {
        ShareManager.getInstance().getShortUrl(hashMap, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void shareSchedulingInit(String[] funcs, RXJSONCallback callback) {
        Map<String, Object> m = new HashMap<>();
        m.put("funcs", funcs);
        ShareManager.getInstance().shareSchedulingInit(m, callback);
    }

    public void shareSchedulingInit(String[] funcs, UnityRXRequestCallback callback) {
        shareSchedulingInit(funcs, UnityBaseCommonFun.convertCallback(callback));
    }

    public void shareSchedulingInit(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        ShareManager.getInstance().shareSchedulingInit(hashMap, callback);
    }

    @Override
    public Map<String, Object> getShareScheduling(String... func) {
        return ShareManager.getInstance().getShareScheduling(func);
    }

    public String unityGetShareScheduling(String[] funcs, String ext) {
        Map<String, Object> data = getShareScheduling(funcs);
        return JSONUtil.toJSONString(data);
    }

    @Override
    public void shareSchedulingReport(String func, String platform, String region, boolean scheduling_event, String scheduling_type, String transmits, @NonNull Map<String, Object> properties, RXJSONCallback callback) {
        Map<String, Object> m = new HashMap<>();
        m.put("func", Objects.requireNonNull(func, "func params mast be not null"));
        m.put("platform", platform);
        m.put("region", region);
        m.put("transmits", transmits);
        m.put("scheduling_event", scheduling_event ? "done" : "fail");
        m.put("scheduling_type", scheduling_type);
        m.put("properties", properties);
        shareSchedulingReport(m, callback);
    }


    public void shareSchedulingReport(String func, String platform, String region, boolean scheduling_event, String scheduling_type, String transmits, @NonNull Map<String, Object> properties, UnityRXRequestCallback callback) {
        shareSchedulingReport(func, platform, region, scheduling_event, scheduling_type, transmits, properties, UnityBaseCommonFun.convertCallback(callback));
    }

    public void shareSchedulingReport(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        ShareManager.getInstance().shareSchedulingReport(hashMap, callback);
    }

    public void getSharePlatforms(RXJSONCallback callback) {
        ShareManager.getInstance().getPlatforms(callback);
    }

    /**
     * 获取分享埋点数据
     * @param map      map 参数
     *                 appType string 非必须 小游戏需要传minigame\n
     *                 func string 必须 埋点标识
     *                 transmitargs string 非必须 透传参数，原样返回
     *                 custom string 非必须 自定义参数，URLENCODE
     *                 method string 非必须 分享方式1广告，2好友列表 4朋友圈 (2+4正常分享)，8指定分享
     *                 share_from string 非必须 分享人瑞雪openid
     *                 share_first string 非必须 首次分享人瑞雪openid
     *                 region string 必须 地区码 取不到传空字符串
     * @param callback 回调函数
     */
    @Override
    public void getShareData(Map<String, Object> map, RXJSONCallback callback) {
        boolean readCache = ObjectUtils.toBoolean(map.get("read_cache"));
        map.remove("read_cache");
        ShareManager.getInstance().shareGetData(readCache, map, callback);
    }

    public void getShareData(Map<String, Object> map, RXCallback<ShareDataResult> callback) {
        boolean readCache = ObjectUtils.toBoolean(map.get("read_cache"));
        map.remove("read_cache");
        ShareManager.getInstance().shareGetData(readCache, map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ShareDataResult shareResult = new ShareDataResult();
                if (data != null) {

                    shareResult.setCode(RXErrorCode.SUCCESS.getValue());
                    shareResult.setData(ShareData.fromJson(data.toString()));
                    callback.onSuccess(shareResult);
                } else {
                    shareResult.setCode(RXErrorCode.SHARE_PARAMS_ERROR.getValue());
                    shareResult.setMsg("无法获取分享数据");
                    callback.onFailed(shareResult);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(ShareDataResult.fromJson(cause.toString()));
            }
        });
    }


    /**
     * 法务接口
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void legal(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.legal(map, callback);
    }

    public void legal(Map<String, Object> map, UnityRXRequestCallback callback) {
        legal(map, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void legal(RXJSONCallback callback) {
        legal(new HashMap<>(), callback);
    }

    /**
     * 上报/更新经纬度坐标
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsUpdate(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsUpdate(map, callback);
    }

    @Override
    public void lbsUpdate(String[] types, float lon, float lat, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsUpdate(types, lon, lat, callback);
    }

    public void lbsUpdate(String[] types, float lon, float lat, UnityRXRequestCallback callback) {
        lbsUpdate(types, lon, lat, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 获取指定半径内的其他用户信息
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsRadius(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsRadius(map, callback);
    }

    @Override
    public void lbsRadius(String types, float lon, float lat, float radius, int count, int page, int page_size, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsRadius(types, lon, lat, radius, count, page, page_size, callback);
    }

    public void lbsRadius(String types, float lon, float lat, float radius, int count, int page, int page_size, UnityRXRequestCallback callback) {
        lbsRadius(types, lon, lat, radius, count, page, page_size, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 给用户设置CP的自定义信息
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void userSetCustom(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().userSetCustom(map, callback);
    }

    @Override
    public void userSetCustom(String custom, RXJSONCallback callback) {
        SocialApiImpl.getInstance().userSetCustom(custom, callback);
    }

    public void userSetCustom(String custom, UnityRXRequestCallback callback) {
        userSetCustom(custom, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 删除经纬度坐标
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsDelete(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsDelete(map, callback);
    }

    @Override
    public void lbsDelete(String[] types, RXJSONCallback callback) {
        SocialApiImpl.getInstance().lbsDelete(types, callback);
    }

    public void lbsDelete(String[] types, UnityRXRequestCallback callback) {
        lbsDelete(types, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 添加自定关系
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationAdd(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationAdd(map, callback);
    }

    @Override
    public void relationAdd(String target, Map<String, Object> types, String target_remarks, String user_remarks, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationAdd(target, types, target_remarks, user_remarks, callback);
    }

    public void relationAdd(String target, Map<String, Object> types, String target_remarks, String user_remarks, UnityRXRequestCallback callback) {
        relationAdd(target, types, target_remarks, user_remarks, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 删除自定关系
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationDelete(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationDelete(map, callback);
    }

    @Override
    public void relationDelete(String target, Map<String, Object> types, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationDelete(target, types, callback);
    }

    public void relationDelete(String target, Map<String, Object> types, UnityRXRequestCallback callback) {
        relationDelete(target, types, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void updateRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().updateRemarks(hashMap, callback);
    }

    @Override
    public void updateRemarks(String target, String type, String target_remarks, RXJSONCallback callback) {
        SocialApiImpl.getInstance().updateRemarks(target, type, target_remarks, callback);
    }

    public void updateRemarks(String target, String type, String target_remarks, UnityRXRequestCallback callback) {
        updateRemarks(target, type, target_remarks, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void hasRelation(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().hasRelation(hashMap, callback);
    }

    @Override
    public void hasRelation(String target, String type, RXJSONCallback callback) {
        SocialApiImpl.getInstance().hasRelation(target, type, callback);
    }

    public void hasRelation(String target, String type, UnityRXRequestCallback callback) {
        hasRelation(target, type, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 获取自定关系列表
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationList(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationList(map, callback);
    }

    @Override
    public void relationList(String type, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationList(type, callback);
    }

    public void relationList(String type, UnityRXRequestCallback callback) {
        relationList(type, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 添加好友列表
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void addFriends(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().addFriends(map, callback);
    }

    @Override
    public void addFriends(String target, String target_remarks, String user_remarks, RXJSONCallback callback) {
        SocialApiImpl.getInstance().addFriends(target, target_remarks, user_remarks, callback);
    }

    public void addFriends(String target, String target_remarks, String user_remarks, UnityRXRequestCallback callback) {
        addFriends(target, target_remarks, user_remarks, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 删除好友列表
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void removeFriends(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().removeFriends(map, callback);
    }

    @Override
    public void removeFriends(String target, RXJSONCallback callback) {
        SocialApiImpl.getInstance().removeFriends(target, callback);
    }

    public void removeFriends(String target, UnityRXRequestCallback callback) {
        removeFriends(target, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void updateFriendRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().updateFriendRemarks(hashMap, callback);
    }

    @Override
    public void updateFriendRemarks(String target, String target_remarks, RXJSONCallback callback) {
        SocialApiImpl.getInstance().updateFriendRemarks(target, target_remarks, callback);
    }

    public void updateFriendRemarks(String target, String target_remarks, UnityRXRequestCallback callback) {
        updateFriendRemarks(target, target_remarks, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void isFriend(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().isFriend(hashMap, callback);
    }

    @Override
    public void isFriend(String target, RXJSONCallback callback) {
        SocialApiImpl.getInstance().isFriend(target, callback);
    }

    public void isFriend(String target, UnityRXRequestCallback callback) {
        isFriend(target, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 获取好友列表
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationFriends(Map<String, Object> map, RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationFriends(map, callback);
    }

    @Override
    public void addScore(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().addScore(hashMap, callback);
    }

    @Override
    public void addScore(String rank_id, int score, RXJSONCallback callback) {
        SocialApiImpl.getInstance().addScore(rank_id, score, callback);
    }

    public void addScore(String rank_id, int score, UnityRXRequestCallback callback) {
        addScore(rank_id, score, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void setScore(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().setScore(hashMap, callback);
    }

    @Override
    public void setScore(String rank_id, int score, RXJSONCallback callback) {
        SocialApiImpl.getInstance().setScore(rank_id, score, callback);
    }

    public void setScore(String rank_id, int score, UnityRXRequestCallback callback) {
        setScore(rank_id, score, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void queryUserRank(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().queryUserRank(hashMap, callback);
    }

    @Override
    public void queryUserRank(String rank_id, String open_id, RXJSONCallback callback) {
        SocialApiImpl.getInstance().queryUserRank(rank_id, open_id, callback);
    }

    public void queryUserRank(String rank_id, String open_id, UnityRXRequestCallback callback) {
        queryUserRank(rank_id, open_id, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void getRankList(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().getRankList(hashMap, callback);
    }

    @Override
    public void getRankList(String rank_id, int start_rank, int end_rank, RXJSONCallback callback) {
        SocialApiImpl.getInstance().getRankList(rank_id, start_rank, end_rank, callback);
    }

    public void getRankList(String rank_id, int start_rank, int end_rank, UnityRXRequestCallback callback) {
        getRankList(rank_id, start_rank, end_rank, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void friendsRank(Map<String, Object> hashMap, RXJSONCallback callback) {
        SocialApiImpl.getInstance().friendsRank(hashMap, callback);
    }

    @Override
    public void friendsRank(String rank_id, RXJSONCallback callback) {
        SocialApiImpl.getInstance().friendsRank(rank_id, callback);

    }

    public void friendsRank(String rank_id, UnityRXRequestCallback callback) {
        friendsRank(rank_id, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void relationFriends(RXJSONCallback callback) {
        SocialApiImpl.getInstance().relationFriends(callback);
    }

    public void relationFriends(UnityRXRequestCallback callback) {
        relationFriends(UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 大厅更新检查
     * @param callback 回调函数
     */
    @Override
    public void updateApp(String version, String region, Map<String, Object> queryMap, RXStringCallback callback) {
        RXApiHelper.VersionCheck.checkAppUpdate(version, region, queryMap, callback);
    }

    public void updateApp(String version, String region, Map<String, Object> queryMap, UnityConvertRXStringCallback callback) {
        updateApp(version, region, queryMap, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void updateGameVersion(Map<String, Object> body, RXRequestCallback callback) {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            RXRequest.create("v1/vcapi/update_module_version?local_country=" + RXGlobalData.COUNTRY).setNeedLoggedIn(false).setBody(body).post(callback);
        });
    }

    public void updateGameVersion(Map<String, Object> body, UnityRXRequestCallback callback) {
        updateGameVersion(body, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void setGameInfo(String roleId, String regionTag) {
        setGameInfo(new GameInfo(roleId, regionTag));
    }

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        RXGlobalData.setGameRoleId(gameInfo.getRoleId());
        RXGlobalData.setGameRegionTag(gameInfo.getServerId());

    }

    @Override
    public void searchGameAccount(RXRequestCallback callback) {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            RXRequest.create("/v1/report/sdk/cp_role").get(callback);
        });
    }

    @Override
    public void getServiceChatUnreadCount(RXRequestCallback callback) {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            RXRequest.create("v1/servicechat/queue/get_global_unread").setNeedLoggedIn(true).get(callback);
        });
    }

    @Override
    public void clearServiceChatUnreadCount(RXRequestCallback callback) {
        RXRequest.create("v1/servicechat/queue/clear_global_unread").setNeedLoggedIn(true).postAsync(callback);
    }

    //临时维护公告
    public void getTempNotice(RXRequestCallback callback) {
        RXRequest.create("v1/vcapi/maintain/" + RXGlobalData.getProductId() + "/" + RXGlobalData.getChannelId()).getAsync(callback);
    }

    public void tradeQuery(String orderNo, RXRequestCallback callback) {
        Map<String, Object> body = new HashMap<>();
        body.put("order_no", orderNo);
        RXRequest.create("v1/ke/sdk/trade_query").setNeedLoggedIn(true).setBody(body).setCallback(callback).execRequestAsync();
    }

    /**
     * @param version  客户端版本号， 3段或4段
     * @param region   地区码， 默认0
     * @param type     脚本类型 默认js， 可选lua， u3d
     * @param queryMap games {"games:{"游戏id": 客户端游戏版本}"}
     *                 activities {"activities":{"活动别名": 客户端活动版本}}
     * @param callback 回调函数
     */
    @Override
    public void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback) {
        RXApiHelper.VersionCheck.checkAppUpdate(HttpMethod.POST, version, region, type, queryMap, callback);
    }

    public void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, UnityConvertRXStringCallback callback) {
        checkUpdateApp(version, region, type, queryMap, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 活动更新检查
     * @param callback 回调函数
     */
    @Override
    public void updateActivity(String activityShortname, String activityVersion, String activityCheckVersion, Map<String, Object> queryMap, RXStringCallback callback) {
        RXApiHelper.VersionCheck.checkActivityUpdate(activityShortname, activityVersion, activityCheckVersion, queryMap, callback);
    }

    public void updateActivity(String activityShortname, String activityVersion, String activityCheckVersion, Map<String, Object> queryMap, UnityConvertRXStringCallback callback) {
        updateActivity(activityShortname, activityVersion, activityCheckVersion, queryMap, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 游戏更新检查
     * @param callback 回调函数
     */
    @Override
    public void updateGame(String gameId, String gameVersion, String gameCheckVersion, Map<String, Object> queryMap, RXStringCallback callback) {
        RXApiHelper.VersionCheck.checkGameUpdate(gameId, gameVersion, gameCheckVersion, queryMap, callback);
    }

    public void updateGame(String gameId, String gameVersion, String gameCheckVersion, Map<String, Object> queryMap, UnityConvertRXStringCallback callback) {
        updateGame(gameId, gameVersion, gameCheckVersion, queryMap, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void getFeedbackKindList(RXJSONCallback callback) {
        RXRequest.create(RXApiPath.FEEDBACKAPI_KIND_LIST).getAsync(callback);
    }

    public void getFeedbackKindList(UnityRXRequestCallback callback) {
        getFeedbackKindList(UnityBaseCommonFun.convertCallback(callback));
    }

    @Deprecated
    @Override
    public void createFeedback(Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey("channel_id")) {
            hashMap.put("channel_id", RXGlobalData.getChannelId());
        }
        if (!hashMap.containsKey("product_id")) {
            hashMap.put("product_id", RXGlobalData.getProductId());
        }
        RXRequest.create(RXApiPath.FEEDBACKAPI_PLAYER_CREATE).setBody(hashMap).postAsync(callback);
    }

    @Deprecated
    public void createFeedback(Map<String, Object> hashMap, UnityRXRequestCallback callback) {
        createFeedback(hashMap, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void satisfactionEvaluation(Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey("channel_id")) {
            hashMap.put("channel_id", RXGlobalData.getChannelId());
        }
        if (!hashMap.containsKey("product_id")) {
            hashMap.put("product_id", RXGlobalData.getProductId());
        }
        RXRequest.create(RXApiPath.FEEDBACKAPI_PLEASED_UPDATE).setBody(hashMap).postAsync(callback);
    }

    public void satisfactionEvaluation(Map<String, Object> hashMap, UnityRXRequestCallback callback) {
        satisfactionEvaluation(hashMap, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void getPromoDisplayKEY(boolean authRefresh, RXJSONCallback callback) {
        PromoCodeManager.getInstance().getCode(authRefresh, callback);
    }

    public void getPromoDisplayKEY(boolean authRefresh, UnityRXRequestCallback callback) {
        getPromoDisplayKEY(authRefresh, UnityBaseCommonFun.convertCallback(callback));
    }

    @Override
    public void exchangePromoCDKEY(String cdKey, RXRequestCallback callback) {
        PromoCodeManager.getInstance().exchangeCDKey(cdKey, callback);
    }

    public void exchangePromoCDKEY(String cdKey, UnityRXRequestCallback callback) {
        exchangePromoCDKEY(cdKey, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 埋点数据上报
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识，一般为 OpenID
     * @param properties CP 自定义属性（由CP调用时传入）
     */
    @Override
    public boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties) {
        return RXApiHelper.Data.track(eventName, distinctId, properties, -1, -1);
    }

    public void trackAsync(String eventName, String distinctId, Map<String, Object> properties) {
        TrackDataMgr.getInstance().trackAsync(eventName, distinctId, properties);
    }

    public void dataTrackAsync(String eventName, Map<String, Object> properties) {
        TrackDataMgr.getInstance().trackAsync(eventName, properties);
    }

    @Deprecated
    @Override
    public boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount) {
        setDataTrackFlushInterval(flushInterval);
        setDataTrackMaxCacheCount(maxCacheCount);
        return dataTrack(eventName, distinctId, properties);
    }

    @Override
    public void setDataTrackFlushInterval(int flushInterval) {
        RXApiHelper.Data.setFlushInterval(flushInterval);
    }

    @Override
    public void setDataTrackMaxCacheCount(int maxCacheCount) {
        RXApiHelper.Data.setMaxCacheCount(maxCacheCount);
    }

    /**
     * 获取公告列表
     * @param limit    获取条数
     * @param callback 回调
     */
    public void getAnnouncement(int limit, RXRequestCallback callback) {
        HashMap<String, Object> query = new HashMap<>();
        query.put("limit", limit);
        query.put("product_id", RuiXueSdk.getProductId());
        query.put("channel_id", RuiXueSdk.getChannelId());
        RXRequest.create("v1/operationtoolsapi/maintain/get").setRestfulData(false).setBody(query).getAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onResponse(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onResponse(cause);
                }
            }
        });
    }

    public void getAnnouncement(int limit, UnityRXRequestCallback callback) {
        getAnnouncement(limit, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 获取邮件列表
     * @param userId   userId
     * @param callback 回调
     */
    public void getEmailList(String userId, RXRequestCallback callback) {
        HashMap<String, Object> mailListQuery = new HashMap<>();
        mailListQuery.put("cp_user_id", userId);
        RXRequest.create("v1/operationtoolsapi/rxmail/cpuser/list").setNeedLoggedIn(true).setBody(mailListQuery).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });
    }

    public void getEmailList(String userId, UnityRXRequestCallback callback) {
        getEmailList(userId, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 删除邮件
     * @param userId   userId
     * @param type     1-删除单封邮件 2-一键删除
     * @param mailId   邮件id
     * @param callback 回调
     */
    public void deleteEmail(String userId, int type, int mailId, RXRequestCallback callback) {
        HashMap<String, Object> awardQuery = new HashMap<>();
        awardQuery.put("cp_user_id", userId);
        awardQuery.put("type", type);
        if (type == 1) {
            awardQuery.put("rx_mail_id", mailId);
        }
        RXRequest.create("v1/operationtoolsapi/rxmail/cpuser/delete").setNeedLoggedIn(true).setBody(awardQuery).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });
    }

    public void deleteEmail(String userId, int type, int mailId, UnityRXRequestCallback callback) {
        deleteEmail(userId, type, mailId, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * @param userId   userId
     * @param mailId   邮件id
     * @param callback 回调
     */
    public void getEmailDetail(String userId, int mailId, RXRequestCallback callback) {
        HashMap<String, Object> mailDetailQuery = new HashMap<>();
        mailDetailQuery.put("cp_user_id", userId);
        mailDetailQuery.put("rx_mail_id", mailId);
        RXRequest.create("v1/operationtoolsapi/rxmail/cpuser/detail").setBody(mailDetailQuery).setNeedLoggedIn(true).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });
    }

    public void getEmailDetail(String userId, int mailId, UnityRXRequestCallback callback) {
        getEmailDetail(userId, mailId, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 领取附近
     * @param userId   userId
     * @param type     1-领取单封邮件 2-一键领取
     * @param mailId   邮件id
     * @param callback 回调
     */
    public void getEmailAward(String userId, int type, int mailId, RXRequestCallback callback) {
        HashMap<String, Object> awardQuery = new HashMap<>();
        awardQuery.put("cp_user_id", userId);
        awardQuery.put("type", type);
        if (type == 1) {
            awardQuery.put("rx_mail_id", mailId);
        }
        awardQuery.put("product_id", RXGlobalData.getProductId());
        RXRequest.create("v1/operationtoolsapi/rxmail/cpuser/receive").setNeedLoggedIn(true).setBody(awardQuery).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });

    }

    /**
     * 创建意见反馈
     * @param content     返回内容
     * @param attachments 上传附件
     * @param phone       电话号
     * @param tags        标签标识， 游戏透传
     * @param callback    回调
     */
    public void feedbackCreate(String content, String[] attachments, String phone, String[] tags, RXRequestCallback callback) {
        HashMap<String, Object> feedbackQuery = new HashMap<>();
        feedbackQuery.put("content", content);
        if (attachments != null) {
            feedbackQuery.put("attachments", attachments);
        }
        feedbackQuery.put("phone", phone);
        if (tags != null) {
            feedbackQuery.put("tags", tags);
        }
        RXRequest.create("v1/feedbackapi/player_feedback/create").setNeedLoggedIn(true).setBody(feedbackQuery).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });
    }

    public void feedbackCreate(String content, String[] attachments, String phone, String[] tags, UnityRXRequestCallback callback) {
        feedbackCreate(content, attachments, phone, tags, UnityBaseCommonFun.convertCallback(callback));
    }


    /**
     * 获取列表
     * @param page     页数， 从1开始
     * @param size     每页大小
     * @param status   1 未处理 2已处理
     * @param callback 回调
     */
    public void getFeedbackList(int page, int size, int status, RXRequestCallback callback) {
        HashMap<String, Object> feedbackQuery = new HashMap<>();
        feedbackQuery.put("page", page);
        feedbackQuery.put("size", size);
        if (status != 0) {
            feedbackQuery.put("status", status);
        }
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                RXRequest.create("v1/feedbackapi/player_feedback/list").setNeedLoggedIn(true).setBody(feedbackQuery).get(new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        if (callback != null) {
                            callback.onResponse(jsonObject);
                        }
                    }
                });

            }
        });
    }

    public void getFeedbackList(int page, int size, int status, UnityRXRequestCallback callback) {
        getFeedbackList(page, size, status, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 获取反馈详情
     * @param id       反馈id
     * @param callback 回调
     */
    public void getFeedbackDetail(int id, RXRequestCallback callback) {
        HashMap<String, Object> feedbackQuery = new HashMap<>();
        feedbackQuery.put("id", id);
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                RXRequest.create("v1/feedbackapi/player_feedback/detail").setNeedLoggedIn(true).setBody(feedbackQuery).get(new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        if (callback != null) {
                            callback.onResponse(jsonObject);
                        }
                    }
                });
            }
        });
    }

    public void getFeedbackDetail(int id, UnityRXRequestCallback callback) {
        getFeedbackDetail(id, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * 领取道具
     * @param id       反馈id
     * @param callback 回调
     */
    public void feedbackGetprop(int id, RXRequestCallback callback) {
        HashMap<String, Object> feedbackQuery = new HashMap<>();
        feedbackQuery.put("id", id);
        RXRequest.create("v1/feedbackapi/player_feedback/getprop").setNeedLoggedIn(true).setBody(feedbackQuery).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callback != null) {
                    callback.onResponse(jsonObject);
                }
            }
        });
    }

    public void feedbackGetprop(int id, UnityRXRequestCallback callback) {
        feedbackGetprop(id, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getEmailAward(String userId, int type, int mailId, UnityRXRequestCallback callback) {
        getEmailAward(userId, type, mailId, UnityBaseCommonFun.convertCallback(callback));
    }

//    @Override
//    public void dataUser(String eventName, String distinctId, Map<String, Object> properties) {
//        RXApiHelper.Data.report("user", eventName, distinctId, properties, -1, -1);
//    }

    //    @Override
//    public boolean dataReport(String type, String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount) {
//        return RXApiHelper.Data.report(type, eventName, distinctId, properties, flushInterval, maxCacheCount);
//    }
    @Deprecated
    @Override
    public void reportWindowExposure(Map<String, Object> properties) {
        TrackDataMgr.getInstance().trackAtTimeAsync("#window_exposure", properties);
    }

    @Override
    public void trackUserAction(String distinctId, Map<String, Object> properties) {
        UserActionTrackManager.getInstance().reportUserAction(distinctId, properties);
    }

    @Override
    public void stopTrackUserAction() {
        UserActionTrackManager.getInstance().stopTrackUserAction();
    }

    @Deprecated
    @Override
    public void getOperationScene(RXJSONCallback callback) {
        HashMap<String, Object> body = new HashMap<>();
        RXRequest.create(RXApiPath.DATA_OPERATION_SCENE).setNeedLoggedIn(true).setBody(body).postAsync(callback);
    }

    @Override
    public void searchGameAreaInfo(String areaId, RXJSONCallback callback) {
        GameAreaApi.getInstance().searchGameAreaInfo(areaId, callback);
    }

    @Override
    public void searchGameAreaListInfo(RXRequestCallback callback) {
        GameAreaApi.getInstance().searchGameAreaListInfo(callback);
    }

    @Override
    public void updateGameAreaInfo(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback) {
        GameAreaApi.getInstance().updateGameAreaInfo(areaId, areaName, areaStatus, areaType, extension, callback);
    }

    @Override
    public void createGameArea(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback) {
        GameAreaApi.getInstance().createGameArea(areaId, areaName, areaStatus, areaType, extension, callback);
    }

    @Override
    public void deleteGameArea(String areaId, RXJSONCallback callback) {
        GameAreaApi.getInstance().deleteGameArea(areaId, callback);
    }

    @Override
    public void createGameCharacter(String areaId, String characterName, String characterLevel, String characterFaction, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXJSONCallback callback) {
        GameAreaApi.getInstance().createGameCharacter(areaId, characterName, characterLevel, characterFaction, characterProfession, characterStatus, characterType, characterVipLevel, cpUserId, extension, callback);
    }

    @Override
    public void updateGameCharacterInfo(String characterId, String areaId, String characterFaction, String characterLevel, String characterName, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXJSONCallback callback) {
        GameAreaApi.getInstance().updateGameCharacterInfo(characterId, areaId, characterFaction, characterLevel, characterName, characterProfession, characterStatus, characterType, characterVipLevel, cpUserId, extension, callback);
    }

    @Override
    public void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXJSONCallback callback) {
        GameAreaApi.getInstance().deleteGameCharacter(areaId, characterId, cpUserId, callback);
    }

    @Override
    public void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback) {
        GameAreaApi.getInstance().searchGameCharacterListInfo(cpUserId, callback);
    }

    @Override
    public void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback) {
        GameAreaApi.getInstance().searchGameCharacterListInArea(cpUserId, areaId, callback);
    }

    @Override
    public void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXJSONCallback callback) {
        GameAreaApi.getInstance().searchGameCharacterInfo(cpUserId, areaId, characterId, callback);
    }
}
