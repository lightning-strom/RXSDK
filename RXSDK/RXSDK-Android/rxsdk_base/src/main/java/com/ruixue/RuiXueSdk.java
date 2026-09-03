package com.ruixue;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.WindowManager;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.base.ClipboardData;
import com.ruixue.base.LogHelper;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.core.apktool.ChannelReaderUtil;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.IRXSdkApi;
import com.ruixue.openapi.PasswordStrength;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.oss.OSSSdkWrapper;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.PassportManager;
import com.ruixue.reflect.OpenInstallManager;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityOnAppExitCallback;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityRuiXueSdkCallback;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings({"unused"})
public final class RuiXueSdk {
    public static final String TAG = "rxsdk";
    @Keep
    public static final String SCHEME = "ruixue";
    /**
     * 平台标识（0-未知，1-android，2-ios）
     */
    @Keep
    public static final int PLATFORM_ID = 1;

    /** 显示渠道闪屏。 */
    public static final String CHANNEL_ACTION_SHOW_SPLASH = "showSplash";
    /** 显示渠道悬浮窗。 */
    public static final String CHANNEL_ACTION_SHOW_FLOAT_VIEW = "showFloatView";
    /** 隐藏渠道悬浮窗。 */
    public static final String CHANNEL_ACTION_HIDE_FLOAT_VIEW = "hideFloatView";
    /** 闪屏类型参数；未传时默认为 0。 */
    public static final String CHANNEL_ACTION_PARAM_SPLASH_TYPE = "splashType";
    /** 渠道调试模式初始化参数。 */
    public static final String CHANNEL_INIT_PARAM_DEBUG_MODE = "debugMode";

    public static final long START_TIME = System.currentTimeMillis();

    private static AccessTokenCallback accessTokenChangeCallback;
    public static final int DEFAULT_CALLBACK_REQUEST_CODE_OFFSET = 9000;

    public static Context getContext() {
        return RXGlobalData.requireContext();
    }

    public static Activity getCurrentActivity() {
        return ActivityLifecycleTracker.getCurrentActivity();
    }

    /**
     * @return 瑞雪productid
     */
    public static String getProductId() {
        return RXGlobalData.getProductId();
    }

    /**
     * @return 瑞雪channelid
     */
    public static String getChannelId() {
        return RXGlobalData.getChannelId();
    }

    public static void setChannelId(String channelId) {
        RXGlobalData.setChannelId(channelId);
    }

    public static void setSubChannelId(String subChannelid) {
        RXGlobalData.setsSubChannelId(subChannelid);
    }

    public static String getSubChannelId() {
        String sub_channel_id = null;
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            sub_channel_id = ChannelReaderUtil.getChannel(RuiXueSdk.getContext());
            if (TextUtils.isEmpty(sub_channel_id)) {
                sub_channel_id = PassportManager.getInstance().getSubChannelId();
            }
        }
        return sub_channel_id == null ? RXGlobalData.getsSubChannelId() : sub_channel_id;
    }

    /**
     * @return 瑞雪平台CPID（商户ID）
     */
    public static String getCpId() {
        return RXGlobalData.getCpId();
    }

    public static String getSdkVersion() {
        return RuiXueSdkVersion.BUILD;
    }

    public static String getSdkVersionCode() {
        return RuiXueSdkVersion.BUILD_CODE;
    }

    public static boolean isOasVersion() {
        return getRXSdkApi().getSdkInfo().getState() == 1;
    }

    /**
     * 设置自定义错误码信息
     * @param customErrorMsg 设置自定义错误码的字典
     */
    public static void setErrorMsg(Map<String, Map<String, String>> customErrorMsg) {
        RXGlobalData.setCustomErrorMsg(customErrorMsg);
    }


    /**
     * 设置初始化参数
     * @param cpid      客户端id
     * @param productid 产品id
     * @param channelid 渠道id
     * @param baseUrls  请求域名队列
     */
    public static void setInitParams(String cpid, String productid, String channelid, List<String> baseUrls) {
        if (TextUtils.isEmpty(productid) || TextUtils.isEmpty(cpid) || TextUtils.isEmpty(channelid) || baseUrls == null) {
            throw new IllegalArgumentException("please check ruixue productid 、cpid 、channelid baseUrls params not null");
        }
        RXGlobalData.init(cpid, productid, channelid, baseUrls);
    }

    public static void initialize(Activity activity, RXSdkInitConfig config) {
        config.setActivity(activity);
        initialize(config);
    }

    /**
     * 使用配置初始化sdk
     * @param config {@link RXSdkInitConfig}
     */
    public static void initialize(RXSdkInitConfig config) {
        RXSdkInitializer.getInstance().initialize(config);
    }


    @Deprecated
    public static void init(String productid, String channelid, String cpid, List<String> urls, @NonNull RXJSONCallback callback) {
        RXSdkInitializer.getInstance().initialize(cpid, productid, channelid, urls, callback);
    }

    @Deprecated
    public static void initialize(String cpid, String productid, String channelid, List<String> urls, @NonNull RXJSONCallback callback) {
        RXSdkInitializer.getInstance().initialize(cpid, productid, channelid, urls, callback);
    }

    @Deprecated
    public static void initialize(String cpid, String productid, String channelid, List<String> urls, @NonNull UnityRXRequestCallback callback) {
        RXSdkInitializer.getInstance().initialize(cpid, productid, channelid, urls, UnityBaseCommonFun.convertCallback(callback));
    }


    public static void setLogEnable(boolean logEnabled) {
        RXGlobalData.setDebugEnabled(logEnabled);
    }

    public static List<Map<String, Object>> getLoginConfig() {
        return RXGlobalData.getLoginConfigs();
    }

    public static void trackConfig(int reportTime, int maxCount) {
        TrackDataMgr.getInstance().trackConfig(reportTime, maxCount);
    }


    public static void setPasswordStrength(PasswordStrength passwordStrength) {
        RXGlobalData.setPasswordStrength(passwordStrength);
    }

    public static void setPasswordStrength(int passwordStrength) {
        RXGlobalData.setPasswordStrength(PasswordStrength.fromValue(passwordStrength));
    }

    public static void setPwdPattern(String pwdPattern) {
        RXGlobalData.setPwdPattern(pwdPattern);
    }

    public static boolean jumpToAppStore(Activity activity) {
        return getRXSdkApi().jumpToAppStore(activity);
    }

    public static void setActivatedMap(Map<String, Object> activatedMap) {
        RXGlobalData.setActivatedMap(activatedMap);
    }

    public static void setPublicProperties(Map<String, Object> publicProperties) {
        TrackDataMgr.getInstance().setPropertiesMap(publicProperties);
    }

    public static void updatePublicProperties(String key, Object value) {
        TrackDataMgr.getInstance().putPropertiesMap(key, value);
    }

    public static void deletePublicProperties(String key) {
        TrackDataMgr.getInstance().delPropertiesMap(key);
    }

    /**
     * @param urls sdk api域名地址
     */
    public static void sdkBaseUrls(List<String> urls) {
        RXGlobalData.setBaseUrls(urls);
    }

    public static List<String> getBaseUrls() {
        return RXGlobalData.getBaseUrls();
    }

    public static String getFirstBaseUrl() {
        return RXGlobalData.getFirstBaseUrl();
    }

    @Deprecated
    public static void setIsDebugEnabled(boolean isDebugEnabled) {
        RXGlobalData.setDebugEnabled(isDebugEnabled);
    }

    public static void setDebugEnabled(boolean isDebugEnabled) {

        RXGlobalData.setDebugEnabled(isDebugEnabled);
    }

    public static void setTrackEnv(boolean env) {
        RXGlobalData.setTrackEnv(env);
    }

    public static String getJSONConfig() {
        Map<String, Object> config = RXGlobalData.getConfig();
        config.put("sdkinfo", RXSdkApi.getInstance().getSdkInfo().toMap());
        return new JSONObject(config).toString();
    }

    public static void setLanguage(Activity activity, String language) {
        RXGlobalData.setLanguage(activity, language, true);
    }

    public static void setArea(String area) {
        RXGlobalData.setArea(area);
    }

    public static void setUnityLanguage(Activity activity, String language) {
        UnityBaseCommonFun.runOnUI(activity, () -> setLanguage(activity, language));
    }

    public static String getLanguage() {
        return RXGlobalData.getLanguage();
    }


    public static void setRuiXueSdkCallback(RuiXueSdkCallback ruiXueSdkCallback) {
        getRXSdkApi().setRuiXueSdkCallback(ruiXueSdkCallback);
    }

    public static String getFeedbackObjectKey() {
        String openid = TextUtils.isEmpty(RuiXueSdk.getOpenid()) ? "default" : RuiXueSdk.getOpenid();
        return RXGlobalData.getLogPath() + "/" + openid + "_" + RXGlobalData.FEEDBACK_ID;
    }


    public static void reportFeedbackLog(Context context, byte[] data, RXJSONCallback callback) {
        if (data.length > RXGlobalData.LOG_LIMIT) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(7001, "File size" + data.length + "File size exceed limit" + RXGlobalData.LOG_LIMIT));
            }
            return;
        }
        OSSSdkWrapper.getInstance().uploadFile(context, getFeedbackObjectKey(), data, new FeedbackRXJSONCallback(callback));
    }

    public static void setRuiXueSdkCallback(UnityRuiXueSdkCallback ruiXueSdkCallback) {
        setRuiXueSdkCallback(UnityBaseCommonFun.convertCallback(ruiXueSdkCallback));
    }

    public static void reportFeedbackLog(Context context, byte[] data, UnityRXRequestCallback callback) {
        reportFeedbackLog(context, data, UnityBaseCommonFun.convertCallback(callback));
    }

    public static void reportFeedbackLog(Context context, String path, RXJSONCallback callback) {
        OSSSdkWrapper.getInstance().uploadFile(context, getFeedbackObjectKey(), path, new FeedbackRXJSONCallback(callback));
    }

    private static class FeedbackRXJSONCallback extends RXJSONCallback {
        private final RXJSONCallback callback;

        FeedbackRXJSONCallback(RXJSONCallback callback) {
            this.callback = callback;
        }

        @Override
        public void onSuccess(@Nullable JSONObject data) {
            if (data == null) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "upload data is null"));
                }
                return;
            }

            String url = data.optString("url");
            if (TextUtils.isEmpty(url)) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "upload data url is null"));
                }
                return;
            }

            RXLogger.d("upload to oss success, url:" + url);
            Map<String, Object> map = new HashMap<>();
            map.put("id", RXGlobalData.FEEDBACK_ID);
            map.put("log_url", url);
            RXRequest.create(RXApiPath.REPORT_USERLOG).setBody(map).postAsync(callback);
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            if (callback != null) {
                callback.onFailed(cause);
            }
        }
    }

    /**
     * 当前登录AccessToken 变更通知
     * @param accessTokenChangeCallback accessTokenChangeCallback
     */
    public static void setAccessTokenChangeCallback(AccessTokenCallback accessTokenChangeCallback) {
        RuiXueSdk.accessTokenChangeCallback = accessTokenChangeCallback;
    }

    public static void notifyAccessTokenChanged(AccessToken oldAccessToken, AccessToken newAccessToken) {
        if (accessTokenChangeCallback != null) {
            accessTokenChangeCallback.onAccessTokenChanged(oldAccessToken, newAccessToken);
        }
    }

    public static List<String> getSDKLog() {
        return LogHelper.getSDKLog();
    }

    public static void setLogConfig(boolean enable, int maxCount) {
        LogHelper.setLogConfig(enable, maxCount);
    }


    /**
     * @return sdk 是否初始化完成
     */
    public static boolean isFullyInitialized() {
        return RXSdkInitializer.getInstance().isFullyInitialized();
    }

    /**
     * @return 当前登录AccessToken
     */
    public static AccessToken getCurrentAccessToken() {
        return PassportManager.getInstance().getCurrentAccessToken();
    }

    /**
     * @return 是否已同意隐私协议
     */
    public static boolean isAgreedPrivacy() {
        return getRXSdkApi().isAgreedPrivacy();
    }

    /**
     * 同意用户隐私协议
     * @param privacyCallBack privacyCallBack
     */
    public static void setPrivacyAgree(PrivacyCallback privacyCallBack) {
        getRXSdkApi().setPrivacyAgree(getContext(), privacyCallBack);
    }

    /**
     * @return 是否已登录
     */
    public static boolean isLoggedIn() {
        return PassportManager.getInstance().isLoggedIn();
    }


    @Deprecated
    public static void login(Activity activity, Map<String, Object> loginMap, RXJSONCallback loginCallback) {
        RXSdkApi.getInstance().login(activity, loginMap, loginCallback);
    }

    /**
     * 调用当前 Android 渠道库提供的通用能力。
     *
     * <p>稳定 action 包括 {@link #CHANNEL_ACTION_SHOW_SPLASH}、
     * {@link #CHANNEL_ACTION_SHOW_FLOAT_VIEW} 和 {@link #CHANNEL_ACTION_HIDE_FLOAT_VIEW}。
     * {@code showSplash} 可通过 {@link #CHANNEL_ACTION_PARAM_SPLASH_TYPE} 指定闪屏类型，
     * 未传时默认为 0；具体支持范围由所引入的渠道库决定。</p>
     *
     * @param activity 当前 Activity
     * @param action   渠道 action
     * @param params   action 参数，可为空
     * @param callback 结果回调，可为空
     */
    public static void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback) {
        RXSdkApi.getInstance().invokeChannelAction(activity, action, params, callback);
    }

    public static void logout(OnLogoutCallback callback) {
        getRXSdkApi().logout(callback);
    }

    public static void exitApp(Activity activity, OnAppExitCallback callback) {
        getRXSdkApi().exitApp(activity, callback);
    }

    public static void exitApp(Activity activity, UnityOnAppExitCallback callback) {
        getRXSdkApi().exitApp(activity, UnityBaseCommonFun.convertCallback(callback));
    }

    public static String getWebViewUA() {
        return RXGlobalData.getWebViewUA();
    }

    public static String getDeviceCode() {
        return DeviceUtils.getDeviceId(getContext());
    }

    /**
     * 自定义设备码在瑞雪 sdk 初始化前调用，否则瑞雪会自动生成设备码
     * @param context  context
     * @param deviceId 设备码，建议使用 32 为 hash 字符串
     * @param replace  如果设备码已生成是否强制替换
     * @return 最终生效设备码
     */
    public static String setDeviceCode(Context context, String deviceId, boolean replace) {
        return DeviceUtils.setDeviceId(context, deviceId, replace);
    }


    public static void setScreenCaptureDisable(Activity activity, boolean disable) {
        if (disable) {
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        } else {
            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        }
    }

    public static void setUnityScreenCaptureDisable(Activity activity, boolean disable) {
        UnityBaseCommonFun.runOnUI(activity, () -> setScreenCaptureDisable(activity, disable));
    }

    public static void setOAID(String oaid) {
        DeviceUtils.setOAID(getContext(), oaid);

    }

    public static String getClipboardData() {
        return ClipboardData.getLast(getContext());
    }

    public static void clearClipboardData() {
        ClipboardData.clear(getContext());
        ClipboardData.clearLast();
    }

    @Deprecated
    public static void syncAccounts(List<Map<String, String>> accounts) {
        AccountHelper.syncAccounts(accounts);
    }

    /**
     * 获取设备 oaid
     */
    public static String getDeviceOAID() {
        return DeviceUtils.getOAID(getContext());
    }

    /**
     * @param disabled 是否可不可读取敏感信息 imei mac 地址等
     */
    public static void disableReadSensitiveInfo(boolean disabled) {
        RXGlobalData.setDisableReadSensitiveInfo(disabled);
    }

    /**
     * 禁用 SDK 多语言切换（禁用后 SDK 不会修改应用的 Locale）
     *
     * @param disabled true=禁用多语言，false=启用多语言（默认）
     */
    public static void disableMultiLanguage(boolean disabled) {
        RXGlobalData.setDisableLanguage(disabled);
    }

    /**
     * 获取设备 androidID
     */
    public static String getAndroidID() {
        return DeviceUtils.getAndroidId(getContext());
    }

    /**
     * @return 客户端随机生成的 ID
     */
    public static String getDistinctId() {

        return DeviceUtils.getDistinctIdPer(getContext());
    }

    /**
     * @return 登录方式
     */
    public static String getLoginMethod() {
        return PassportManager.getInstance().getLoginMethod();
    }

    /**
     * @return 加密后的瑞雪openid 二次登录时使用
     */
    public static String getLoginOpenid() {
        return PassportManager.getInstance().getLoginOpenid();
    }

    /**
     * RuiXueSdk.loginOpenidExpireInvalid()  判断 login_openid 是否失效
     * @return login_openid true 失效， false 有效
     */
    public static boolean loginOpenidExpireInvalid() {
        return PassportManager.getInstance().loginOpenidExpireInvalid();
    }

    /**
     * @return 瑞雪openid
     */
    public static String getOpenid() {
        return PassportManager.getInstance().getOpenid();
    }

    /**
     * @return 当前登录数据
     */
    public static @Nullable LoginData getLoginData() {
        return PassportManager.getInstance().getLoginData();
    }

    /**
     * @param delayMillis 延迟启动毫秒数
     */
    @Deprecated
    public static void restartApp(long delayMillis) {
        if (delayMillis > 0) {
            AppUtils.restartApp(getCurrentActivity(), delayMillis);
        } else {
            AppUtils.restartApp(getCurrentActivity());
        }
    }

    public static boolean openURL(String url) {
        return AppUtils.startApp(getCurrentActivity(), url);
    }

    @Deprecated
    public static RXSdkApi getRXSdkApi() {
        return RXSdkApi.getInstance();
    }

    public static IRXSdkApi getApi() {
        return RXSdkApi.getInstance();
    }

    @Deprecated
    public final void runOnUiThread(Runnable action) {
        ThreadUtils.getInstance().runOnUiThread(action);
    }

    @Deprecated
    public final void runOnUiThreadDelay(Runnable action, long timeDelay) {
        ThreadUtils.getInstance().runOnUiThreadDelay(action, timeDelay);
    }


    @Deprecated
    public static Map<String, Object> jsonToMap(String json) {
        return JSONUtil.toMap(json);
    }

    public interface AccessTokenCallback {
        void onAccessTokenChanged(AccessToken oldAccessToken, AccessToken newAccessToken);
    }

    public static void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner) {
        RXSdkApi.getInstance().trackingLifecycle(lifecycleOwner);
    }

    //生命周期函数----------------
    //application attachBaseContext 在 onCreate 之前执行
    public static void attachBaseContext(Context context) {
        RXSdkApi.getInstance().attachBaseContext(context);
    }

    public static void onApplicationCreate(Application application) {

        RXSdkApi.getInstance().onApplicationCreate(application);
    }

    //activity
    public static void onCreate(Activity activity) {
        onCreate(activity, null);
    }

    public static void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onCreate(activity, savedInstanceState);
    }

    public static void onNewIntent(Activity activity, Intent intent) {
        RXSdkApi.getInstance().onNewIntent(activity, intent);
        OpenInstallManager.getWakeUp(intent);
    }

    public static void onRestart(Activity activity) {
        RXSdkApi.getInstance().onRestart(activity);
    }

    public static void onStart(Activity activity) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onStart(activity);
    }


    public static void onResume(Activity activity) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onResume(activity);
    }

    public static void onPause(Activity activity) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onPause(activity);
    }

    public static void onStop(Activity activity) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onStop(activity);
    }

    public static void onDestroy(Activity activity) {
        if (!RXSdkApi.getInstance().isTrackedLifecycle())
            RXSdkApi.getInstance().onDestroy(activity);
    }

    public static void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.d("BaseRXUICallback", "onActivityResult:requestCode :" + requestCode + ",resultCode :" + resultCode + ", data :" + ((data != null && data.getExtras() != null) ? data.getExtras().toString() : ""));

        RXSdkApi.getInstance().onActivityResult(activity, requestCode, resultCode, data);
    }

    public static void onWindowFocusChanged(boolean hasFocus) {
        RXSdkApi.getInstance().onWindowFocusChanged(hasFocus);
    }

    public static void onBackPressed() {
        RXSdkApi.getInstance().onBackPressed();
    }

    public static void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        RXSdkApi.getInstance().onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
    }

    public static void onConfigurationChanged(Activity activity, Configuration newConfig) {
        RXSdkApi.getInstance().onConfigurationChanged(activity, newConfig);
    }

}
