package com.ruixue.sdk.adjust;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustAttribution;
import com.adjust.sdk.AdjustConfig;
import com.adjust.sdk.AdjustEvent;
import com.adjust.sdk.AdjustEventFailure;
import com.adjust.sdk.AdjustEventSuccess;
import com.adjust.sdk.AdjustLinkResolution;
import com.adjust.sdk.AdjustSessionFailure;
import com.adjust.sdk.AdjustSessionSuccess;
import com.adjust.sdk.AdjustThirdPartySharing;
import com.adjust.sdk.OnAttributionChangedListener;
import com.adjust.sdk.OnDeeplinkResponseListener;
import com.adjust.sdk.OnEventTrackingFailedListener;
import com.adjust.sdk.OnEventTrackingSucceededListener;
import com.adjust.sdk.OnSessionTrackingFailedListener;
import com.adjust.sdk.OnSessionTrackingSucceededListener;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.LoginData;
import com.ruixue.reflect.AdjustManager;
import com.ruixue.sdk.adjust.callback.OnRxDeviceIdsRead;
import com.ruixue.sdk.adjust.config.RxAdjustConfig;
import com.ruixue.sdk.adjust.config.RxAdjustEvent;
import com.ruixue.sdk.adjust.data.RxAdjustAdRevenue;
import com.ruixue.sdk.adjust.data.RxAdjustAttribution;
import com.ruixue.sdk.adjust.data.RxAdjustEventFailure;
import com.ruixue.sdk.adjust.data.RxAdjustEventSuccess;
import com.ruixue.sdk.adjust.data.RxAdjustPlayStoreSubscription;
import com.ruixue.sdk.adjust.data.RxAdjustSessionFailure;
import com.ruixue.sdk.adjust.data.RxAdjustSessionSuccess;
import com.ruixue.sdk.adjust.data.RxAdjustThirdPartySharing;
import com.ruixue.sdk.adjust.util.RxAdjustLogLevelTranslate;
import com.ruixue.storage.RXPreference;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ResUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
public class AdjustSdkWrapper extends PluginSdk {
    public static final String NAME = "adjust";
    RXPreference rxPreference;
    boolean isInited;
    int switch_tag = 1;
    int timestamp = 0;

    int delayStart = 0; // 大于0 时, 现在设置10秒延迟,激活绑定同步延迟+1


    static class Single {
        final static AdjustSdkWrapper INSTANCE = new AdjustSdkWrapper();
    }

    protected AdjustSdkWrapper() {
    }

    public static AdjustSdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public String getName() {
        return NAME;
    }

    boolean isBound;
    boolean isActivated;
    String mDistinctId;

    //invoke after rx activate
    public void activate(String distinctId) {
        int delay = (int) (delayStart - (System.currentTimeMillis() - timestamp));
        delay = Math.max(delay, 0);
        this.activate(distinctId, delay);
    }

    public void activate(String distinctId, int delay) {
        if (isActivated || TextUtils.isEmpty(distinctId)) {
            RXLogger.i("activate return isActivated:" + isActivated + ", DistinctId :" + distinctId);
            return;
        }
        RXLogger.i("adjust is inited " + isInited + ", activate start delay:" + delay);
        ThreadUtils.getInstance().runOnBgThreadDelay(new Runnable() {
            @Override
            public void run() {
                String adid = getAdid();
                if (!TextUtils.isEmpty(distinctId))
                    mDistinctId = distinctId;

                if (!TextUtils.isEmpty(adid) && !TextUtils.isEmpty(distinctId)) {
                    Map<String, Object> m = new HashMap<>();
                    m.put("adjust_adid", adid);
                    m.put("client_distinct_id", distinctId);
                    isActivated = true;
                    RXRequest.create("v1/attribution/user/adjust_jihuo").setNeedLoggedIn(false).setBody(m).postAsync(new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            isActivated = true;
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            isActivated = false;
                        }
                    });
                } else {
                    isActivated = false;
                    RXLogger.w("activate failed adjust adid is null ,adjust is inited " + isInited + ", DistinctId :" + distinctId);
                }
            }
        }, delay);
    }

    String mEventName;
    String mActivateName;

    public void setEventName(Context context, String eventName) {
        this.mEventName = eventName;
    }

    public void setActivateName(Context context, String activateName) {
        this.mActivateName = activateName;
        if (adjustActivateFailed) {
            adjustActivate(context);
        }
    }

    /** adid 轮询间隔，默认 5s；由 {@link #setRcTime} 覆盖。 */
    int mRcTime = 5000;
    /** adid 为空时最大轮询次数，避免无限重试。默认 12 次 ≈ 1 分钟（间隔 5s）。 */
    private static final int ADID_POLL_MAX_ATTEMPTS = 36;
    private volatile int adidPollAttempt;
    private volatile boolean adidPollInProgress;

    public void setRcTime(Context context, Integer rcTime) {
        Log.d("AdjustSdkWrapper", "adid 轮训间隔时间  = " + rcTime + "秒");
        this.mRcTime = rcTime * 1000;
    }

    String firebaseAppInstanceId = null;

    public String getAppInstanceId() {
        if (TextUtils.isEmpty(firebaseAppInstanceId) && RXGlobalData.getContext() != null) {
            firebaseAppInstanceId = AdjustManager.getAppInstanceId(RXGlobalData.getContext());
        }
        return firebaseAppInstanceId;
    }

    //invoke login success or adjust attribution success
    public void bindAdid(int delay) {
        if (!isLoggedIn || isBound) {
            RXLogger.i("adjust adid is bound ");
            return;
        }
        LoginData loginData = RuiXueSdk.getLoginData();
        if (loginData == null) {
            RXLogger.i("adjust login data null ");
            return;
        }
        if (adidPollInProgress) {
            RXLogger.i("bindAdid poll already in progress");
            return;
        }
        adidPollInProgress = true;
        adidPollAttempt = 0;
        String openid = loginData.getOpenid();
        boolean isNewUser = loginData.isNewUser();
        // delay==0 时保持历史默认首延时 5s；delay>0 时使用调用方传入值
        long firstDelayMs = delay > 0 ? delay : 5_000L;
        ThreadUtils.getInstance().runOnBgThreadDelayUseExecutor(() -> {
            Context context = RXGlobalData.getContext();
            if (isNewUser && !TextUtils.isEmpty(mEventName)) {
                trackNewUser(context, loginData.getOpenid());
            }
            pollAndBindAdid(openid);
        }, firstDelayMs);
    }

    private void pollAndBindAdid(String openid) {
        if (!isLoggedIn || isBound) {
            adidPollInProgress = false;
            return;
        }
        String adid = getAdid();
        Log.d("AdjustSdkWrapper", "pollAndBindAdid attempt=" + adidPollAttempt
                + " thread=" + Thread.currentThread().getName());
        if (TextUtils.isEmpty(adid)) {
            adidPollAttempt++;
            if (adidPollAttempt > ADID_POLL_MAX_ATTEMPTS) {
                adidPollInProgress = false;
                RXLogger.w("bindAdid give up, adid still null after " + ADID_POLL_MAX_ATTEMPTS
                        + " attempts, adjust is inited " + isInited);
                return;
            }
            long intervalMs = mRcTime > 0 ? mRcTime : 5000L;
            Log.d("AdjustSdkWrapper", "轮训获取 adid, next in " + intervalMs + "ms, attempt=" + adidPollAttempt);
            ThreadUtils.getInstance().runOnBgThreadDelayUseExecutor(
                    () -> pollAndBindAdid(openid), intervalMs);
            return;
        }

        adidPollInProgress = false;
        Context context = RXGlobalData.getContext();
        String key = "adjust_adid" + openid;
        if (rxPreference != null && !adid.equals(rxPreference.getString(key))) {
            String appInstanceId = getAppInstanceId();
            Map<String, Object> m = new HashMap<>();
            m.put("adjust_adid", adid);
            m.put("gps_adid", gpsAdid);
            m.put("firebase_instanceid", appInstanceId);
            m.put("client_distinct_id", DeviceUtils.getDistinctIdPer(context));
            if (context != null) {
                m.put("fire_adid", Adjust.getAmazonAdId(context));
                m.put("android_id", DeviceUtils.getAndroidId(context));
            }
            isBound = true;

            String finalAdid = adid;
            RXRequest.create(RXApiPath.BIND_ADID).setBody(m).postAsync(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    rxPreference.putString(key, finalAdid);
                    if (!TextUtils.isEmpty(appInstanceId))
                        rxPreference.putString("firebase_instanceid", appInstanceId);
                    isBound = true;
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    isBound = false;
                }
            });
        } else {
            RXLogger.i("bindAdid adjust adid is already bound ");
        }
    }

    // invoke new user login or register
    public void trackNewUser(Context context, String openid) {
        AdjustEvent adjustEvent = new AdjustEvent(mEventName);
        adjustEvent.addCallbackParameter("openid", openid);
        RXLogger.i("trackNewUser: event:" + mEventName + ",openid:" + openid);
        trackEvent(context, adjustEvent);
    }


    boolean adjustActivateFailed = false;

    // adjust activate after onAttributionChanged or setActivateName
    public void adjustActivate(Context context) {
        if (!TextUtils.isEmpty(mActivateName)) {
            AdjustEvent adjustEvent = new AdjustEvent(mActivateName);
            trackEvent(context, adjustEvent);
            adjustActivateFailed = false;
        } else {
            RXLogger.w("at is null error");
            adjustActivateFailed = true;
        }
    }

    private void trackEvent(Context context, AdjustEvent adjustEvent) {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            if (context != null) {
                adjustEvent.addCallbackParameter("client_distinct_id", DeviceUtils.getDistinctIdPer(context));
            }
            adjustEvent.addCallbackParameter("gps_adid", gpsAdid);
            adjustEvent.addCallbackParameter("firebase_instanceid", getAppInstanceId());
            adjustEvent.addCallbackParameter("product_id", RXGlobalData.getProductId());
            adjustEvent.addCallbackParameter("channel_id", RXGlobalData.getChannelId());
            RXLogger.i("trackEvent:" + adjustEvent.getEventToken());
            Adjust.trackEvent(adjustEvent);
        });

    }

    //invoke after adjust attribution success
    private void bindBigData(AdjustAttribution attribution) {
        RXLogger.i("bind_bigdata start");
        Map<String, Object> m = new HashMap<>();
        Map<String, Object> am = new HashMap<>();
        am.put("trackerToken", attribution.trackerToken);
        am.put("trackerName", attribution.trackerName);
        am.put("network", attribution.network);
        am.put("campaign", attribution.campaign);
        am.put("adgroup", attribution.adgroup);
        am.put("creative", attribution.creative);
        am.put("clickLabel", attribution.clickLabel);
        am.put("adid", attribution.adid);
        am.put("costType", attribution.costType);
        if (attribution.costAmount != null && !Double.isNaN(attribution.costAmount)) {
            am.put("costAmount", attribution.costAmount);
        }
        am.put("costCurrency", attribution.costCurrency);
        am.put("fbInstallReferrer", attribution.fbInstallReferrer);
        m.put("adjust", am);
        m.put("client_distinct_id", mDistinctId);
        activate(this.mDistinctId, 0);
        bindAdid(0);
        RuiXueSdk.getRXSdkApi().dataTrack("#rxsdk_bind_bigdata", null, m);
        if (switch_tag == 1) {
            RXRequest.create("v1/attribution/user/bind_bigdata").setNeedLoggedIn(false).setBody(m).postAsync(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i("bind_bigdata success");
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                }
            });
        }
    }

    public void init(Context context, String app_token, int switch_of, String distinctId) {
        if (!TextUtils.isEmpty(distinctId)) {
            mDistinctId = distinctId;
        }
        if (!TextUtils.isEmpty(app_token)) {
            switch_tag = switch_of;
            init(context, new RxAdjustConfig(context, app_token, RxAdjustConfig.ENVIRONMENT_PRODUCTION));
        }
    }

    public void init(Context context, String app_token, int switch_of) {
        if (!TextUtils.isEmpty(app_token)) {
            switch_tag = switch_of;
            init(context, new RxAdjustConfig(context, app_token, RxAdjustConfig.ENVIRONMENT_PRODUCTION));
        }
    }

    /**
     * 初始化 Adjust
     * @param context        Context上下文
     * @param rxAdjustConfig 相关配置参数
     */
    public void init(Context context, RxAdjustConfig rxAdjustConfig) {
        if (isInited) {
            RXLogger.w("adjust is already inited");
            return;
        }
        rxPreference = new RXPreference(context);
        if (TextUtils.isEmpty(mDistinctId)) {
            mDistinctId = DeviceUtils.getDistinctIdPer(context);
        }
        Adjust.addSessionCallbackParameter("client_distinct_id", mDistinctId);
        Adjust.addSessionCallbackParameter("product_id", RXGlobalData.getProductId());
        Adjust.addSessionCallbackParameter("channel_id", RXGlobalData.getChannelId());
        Adjust.addSessionCallbackParameter("sdk_version", BuildConfig.BUILD);
        RXLogger.w("adjust init ts " + timestamp + ",client_distinct_id:" + mDistinctId);
        getGoogleAdId(context, null);
        AdjustConfig config = new AdjustConfig(context, rxAdjustConfig.appToken, rxAdjustConfig.environment);
        if (rxAdjustConfig.getLogLevel() != null) {
            config.setLogLevel(RxAdjustLogLevelTranslate.transLateLogLevel(rxAdjustConfig.getLogLevel()));
        }
        if (delayStart > 0) {
            config.setDelayStart(delayStart / 1000D);
        }
        if (rxAdjustConfig.delayStart != null && rxAdjustConfig.delayStart > 0) {
            config.setDelayStart(rxAdjustConfig.delayStart);
        }
        if (rxAdjustConfig.needsCost != config.getNeedsCost()) {
            config.setNeedsCost(rxAdjustConfig.needsCost);
        }
        if (rxAdjustConfig.eventBufferingEnabled != config.isEventBufferingEnabled()) {
            config.setEventBufferingEnabled(rxAdjustConfig.eventBufferingEnabled);
        }
        if (!TextUtils.isEmpty(rxAdjustConfig.urlStrategy)) {
            config.setUrlStrategy(rxAdjustConfig.urlStrategy);
        }
        if (rxAdjustConfig.preinstallTrackingEnabled != config.isPreinstallTrackingEnabled()) {
            config.setPreinstallTrackingEnabled(true);
        }
        if (rxAdjustConfig.sendInBackground != config.isSendInBackground()) {
            config.setSendInBackground(true);
        }
        if (!TextUtils.isEmpty(rxAdjustConfig.externalDeviceId)) {
            config.setExternalDeviceId(rxAdjustConfig.externalDeviceId);
        }
        String fbappid = ResUtils.getInstance().getString("facebook_app_id");
        config.setFbAppId(fbappid);
        initListener(rxAdjustConfig, config);
        timestamp = (int) (System.currentTimeMillis());
        Adjust.onCreate(config);
        isInited = true;

    }

    /**
     * Adjust 设备标识符
     * @return
     */
    public String getAdid() {
        return Adjust.getAdid();
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        if (paramsMap != null && paramsMap.containsKey("app_token")) {
            init(context, (String) paramsMap.get("app_token"), ObjectUtils.toInt(paramsMap.get("switch_of"), 1));
        }
        return true;
    }

    /**
     * 获取深度链接
     * @param intent intent
     * @return uri
     */
    public Uri getData(Intent intent) {
        if (intent == null) {
            return null;
        }
        return intent.getData();
    }

    /**
     * 深度链接再归因
     * @param data    uri
     * @param context context上下文
     */
    public void appWillOpenUrl(Uri data, Context context) {
        Adjust.appWillOpenUrl(data, context);
    }

    /**
     * 链接解析
     * @param url     url
     * @param arr     设置推广活动自定义域
     * @param context context上下文
     */
    public void resolveLink(String url, String[] arr, Context context) {
        AdjustLinkResolution.resolveLink(url, arr, resolvedLink -> Adjust.appWillOpenUrl(resolvedLink, context));
    }

    /**
     * 事件跟踪
     * @param rxAdjustEvent 事件
     */
    public void trackEvent(RxAdjustEvent rxAdjustEvent) {
        if (rxAdjustEvent != null) {
            Adjust.trackEvent(RxAdjustEvent.copy(rxAdjustEvent));
        }
    }

    /**
     * 会话回传参数
     * @param key 会话key
     * @param val 会话value
     */
    public void addSessionCallbackParameter(String key, String val) {
        Adjust.addSessionCallbackParameter(key, val);
    }

    /**
     * 移除特定的会话回传参数
     * @param key 会话key
     */
    public void removeSessionCallbackParameter(String key) {
        Adjust.removeSessionCallbackParameter(key);
    }

    /**
     * 清除所有的会话回传参数
     */
    public void resetSessionCallbackParameters() {
        Adjust.resetSessionCallbackParameters();
    }

    /**
     * 新增会话合作伙伴参数
     * @param key 会话key
     * @param val 会话value
     */
    public void addSessionPartnerParameter(String key, String val) {
        Adjust.addSessionPartnerParameter(key, val);
    }

    /**
     * 移除会话合作伙伴参数
     * @param key 会话key
     */
    public void removeSessionPartnerParameter(String key) {
        Adjust.removeSessionPartnerParameter(key);
    }

    /**
     * 清除会话合作伙伴参数
     */
    public void resetSessionPartnerParameters() {
        Adjust.resetSessionPartnerParameters();
    }

    /**
     * 启动延迟前，向后端发送消息
     */
    public void sendFirstPackages() {
        Adjust.sendFirstPackages();
    }



    /**
     * 通知Adjust页面处于可见
     * @param activity
     */
    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        if (isInited)
            Adjust.onResume();
    }

    /**
     * 通知Adjust页面不可见
     * @param activity
     */
    @Override
    public void onPause(Activity activity) {
        super.onPause(activity);
        if (isInited)
            Adjust.onPause();
    }

    /**
     * 直接获取用户归因
     * @return 返回用户归因属性
     */
    public RxAdjustAttribution getAttribution() {
        if (Adjust.getAttribution() == null) {
            return null;
        }
        return RxAdjustAttribution.copy(Adjust.getAttribution());
    }

    /**
     * 是否开启离线模式
     * @param isOpen
     */
    public void setOfflineMode(boolean isOpen) {
        Adjust.setOfflineMode(isOpen);
    }

    /**
     * 用户行使被遗忘权
     * @param context
     */
    public void gdprForgetMe(Context context) {
        Adjust.gdprForgetMe(context);
    }

    /**
     * 隐私相关
     * @param rxAdjustThirdPartySharing
     */
    public void trackThirdPartySharing(RxAdjustThirdPartySharing rxAdjustThirdPartySharing) {
        if (rxAdjustThirdPartySharing != null) {
            AdjustThirdPartySharing adjustThirdPartySharing = RxAdjustThirdPartySharing.copy(rxAdjustThirdPartySharing);
            Adjust.trackThirdPartySharing(adjustThirdPartySharing);
        }
    }

    /**
     * 针对特定用户的许可监测
     * @param isOpen
     */
    public void trackMeasurementConsent(boolean isOpen) {
        Adjust.trackMeasurementConsent(isOpen);
    }

    /**
     * 跟踪广告收入
     * @param rxAdjustAdRevenue
     */
    public void trackAdRevenue(RxAdjustAdRevenue rxAdjustAdRevenue) {
        if (rxAdjustAdRevenue != null) {
            Adjust.trackAdRevenue(RxAdjustAdRevenue.copy(rxAdjustAdRevenue));
        }
    }

    String gpsAdid;

    /**
     * Google Play 服务广告标识符
     * @param context
     * @param onRxDeviceIdsRead
     */
    public void getGoogleAdId(Context context, OnRxDeviceIdsRead onRxDeviceIdsRead) {
        Adjust.getGoogleAdId(context, googleAdId -> {
            RXLogger.i("googleadid:" + googleAdId);
            gpsAdid = googleAdId;
            if (onRxDeviceIdsRead != null) {
                onRxDeviceIdsRead.onGoogleAdIdRead(googleAdId);
            }
        });
    }

    /**
     * Amazon 广告标识符
     * @param context
     * @return
     */
    public String getAmazonAdId(Context context) {
        return Adjust.getAmazonAdId(context);
    }

    /**
     * 跟踪订阅
     * @param rxAdjustPlayStoreSubscription
     */
    public void trackPlayStoreSubscription(RxAdjustPlayStoreSubscription rxAdjustPlayStoreSubscription) {
        if (rxAdjustPlayStoreSubscription != null) {
            Adjust.trackPlayStoreSubscription(RxAdjustPlayStoreSubscription.copy(rxAdjustPlayStoreSubscription));
        }
    }

    /**
     * 推送标签
     * @param token
     * @param context
     */
    public void setPushToken(String token, Context context) {
        if (isInited)
            Adjust.setPushToken(token, context);
    }

    /**
     * 停用 Adjust SDK
     * @param isOpen
     */
    public void setEnabled(boolean isOpen) {
        Adjust.setEnabled(isOpen);
    }

    private void initListener(RxAdjustConfig rxAdjustConfig, AdjustConfig config) {
        if (rxAdjustConfig.onRxEventTrackingSucceededListener != null) {
            config.setOnEventTrackingSucceededListener(new OnEventTrackingSucceededListener() {
                @Override
                public void onFinishedEventTrackingSucceeded(AdjustEventSuccess adjustEventSuccess) {
                    RxAdjustEventSuccess rxAdjustEventSuccess = null;
                    if (adjustEventSuccess != null) {
                        rxAdjustEventSuccess = RxAdjustEventSuccess.copy(adjustEventSuccess);
                    }
                    rxAdjustConfig.onRxEventTrackingSucceededListener.onFinishedEventTrackingSucceeded(rxAdjustEventSuccess);
                }
            });
        }
        if (rxAdjustConfig.onRxEventTrackingFailedListener != null) {
            config.setOnEventTrackingFailedListener(new OnEventTrackingFailedListener() {
                @Override
                public void onFinishedEventTrackingFailed(AdjustEventFailure eventFailureResponseData) {
                    RxAdjustEventFailure rxAdjustEventFailure = null;
                    if (eventFailureResponseData != null) {
                        rxAdjustEventFailure = RxAdjustEventFailure.copy(eventFailureResponseData);
                    }
                    rxAdjustConfig.onRxEventTrackingFailedListener.onFinishedEventTrackingFailed(rxAdjustEventFailure);
                }
            });
        }
        if (rxAdjustConfig.onRxSessionTrackingSucceededListener != null) {
            config.setOnSessionTrackingSucceededListener(new OnSessionTrackingSucceededListener() {
                @Override
                public void onFinishedSessionTrackingSucceeded(AdjustSessionSuccess sessionSuccessResponseData) {
                    RxAdjustSessionSuccess rxAdjustSessionSuccess = null;
                    if (sessionSuccessResponseData != null) {
                        rxAdjustSessionSuccess = RxAdjustSessionSuccess.copy(sessionSuccessResponseData);
                    }
                    rxAdjustConfig.onRxSessionTrackingSucceededListener.onFinishedSessionTrackingSucceeded(rxAdjustSessionSuccess);
                }
            });
        }
        if (rxAdjustConfig.onRxSessionTrackingFailedListener != null) {
            config.setOnSessionTrackingFailedListener(new OnSessionTrackingFailedListener() {
                @Override
                public void onFinishedSessionTrackingFailed(AdjustSessionFailure sessionFailureResponseData) {
                    RxAdjustSessionFailure rxAdjustSessionFailure = null;
                    if (sessionFailureResponseData != null) {
                        rxAdjustSessionFailure = RxAdjustSessionFailure.copy(sessionFailureResponseData);
                    }
                    rxAdjustConfig.onRxSessionTrackingFailedListener.onFinishedSessionTrackingFailed(rxAdjustSessionFailure);
                }
            });
        }
        if (rxAdjustConfig.onRxDeeplinkResponseListener != null) {
            config.setOnDeeplinkResponseListener(new OnDeeplinkResponseListener() {
                @Override
                public boolean launchReceivedDeeplink(Uri deeplink) {
                    return rxAdjustConfig.onRxDeeplinkResponseListener.launchReceivedDeeplink(deeplink);
                }
            });
        }
        // trackerToken	字符串	设备当前归因跟踪链接的跟踪码
        //trackerName	字符串	设备当前归因跟踪链接的名称
        //network	字符串	设备当前归因渠道的名称
        //campaign	字符串	设备当前归因推广活动的名称
        //adgroup	字符串	设备当前归因广告组的名称
        //creative	字符串	设备当前归因素材的名称
        //clickLabel	字符串	安装被标记的 点击标签
        //adid	字符串	设备的唯一 Adjust ID
        //costType	字符串	推广活动定价模型 (如 cpi)
        //costAmount	数字	安装成本
        //costCurrency	字符串	成本相关的货币代码。应符合 ISO 4217 标准且包含 3 个字符。
        //fbInstallReferrer	字符串	Facebook Install Referrer 信息。如果安装来自 Facebook 广告，则此处会被填充。

        config.setOnAttributionChangedListener(new OnAttributionChangedListener() {
            @Override
            public void onAttributionChanged(AdjustAttribution attribution) {
                RXLogger.i("onAttributionChanged:" + attribution.toString());
                bindBigData(attribution);
                adjustActivate(config.getContext());
                if (rxAdjustConfig.onRxAttributionChangedListener != null) {
                    RxAdjustAttribution rxAdjustAttribution = RxAdjustAttribution.copy(attribution);
                    rxAdjustConfig.onRxAttributionChangedListener.onAttributionChanged(rxAdjustAttribution);
                }
            }
        });

    }


    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        return false;
    }

    boolean isLoggedIn;

    @Override
    public boolean onLoginResp(int code) {
        if (code == 0) {
            isLoggedIn = true;
            isBound = false;
            adidPollInProgress = false;
            adidPollAttempt = 0;
            int delay = (int) (delayStart - (System.currentTimeMillis() - timestamp));
            bindAdid(Math.max(delay, 0));


        }
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }


    /**
     * @param skusList 商品id列表
     * @param callback 商品 json 信息
     */
    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {

    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        String appToken = AppUtils.getAppMetaData(application, "adjust_app_token");
        if (!TextUtils.isEmpty(appToken)) {
            RxAdjustConfig rxAdjustConfig = new RxAdjustConfig(application, appToken, RxAdjustConfig.ENVIRONMENT_PRODUCTION);
            init(application, rxAdjustConfig);
        }
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

}
