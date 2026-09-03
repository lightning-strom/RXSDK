package com.ruixue.sdk.adjust.config;

import android.content.Context;

import com.ruixue.sdk.adjust.callback.OnRxAttributionChangedListener;
import com.ruixue.sdk.adjust.callback.OnRxDeeplinkResponseListener;
import com.ruixue.sdk.adjust.callback.OnRxEventTrackingFailedListener;
import com.ruixue.sdk.adjust.callback.OnRxEventTrackingSucceededListener;
import com.ruixue.sdk.adjust.callback.OnRxSessionTrackingFailedListener;
import com.ruixue.sdk.adjust.callback.OnRxSessionTrackingSucceededListener;

public class RxAdjustConfig {
    Context context;
    public String appToken;
    public String environment;
    public boolean eventBufferingEnabled;
    public OnRxAttributionChangedListener onRxAttributionChangedListener;
    public OnRxEventTrackingSucceededListener onRxEventTrackingSucceededListener;
    public OnRxEventTrackingFailedListener onRxEventTrackingFailedListener;
    public OnRxSessionTrackingSucceededListener onRxSessionTrackingSucceededListener;
    public OnRxSessionTrackingFailedListener onRxSessionTrackingFailedListener;
    public OnRxDeeplinkResponseListener onRxDeeplinkResponseListener;
    public boolean sendInBackground;
    public Double delayStart;
    public String externalDeviceId;
    public boolean preinstallTrackingEnabled;
    public Boolean needsCost;
    public String urlStrategy;

    public RxLogLevel getLogLevel() {
        return logLevel;
    }

    /**
     * 设置显示日志级别
     * @param logLevel 日志级别
     */
    public void setLogLevel(RxLogLevel logLevel) {
        this.logLevel = logLevel;
    }

    RxLogLevel logLevel;

    public static final String ENVIRONMENT_SANDBOX = "sandbox";
    public static final String ENVIRONMENT_PRODUCTION = "production";

    public static final String URL_STRATEGY_INDIA = "url_strategy_india";
    public static final String URL_STRATEGY_CHINA = "url_strategy_china";
    public static final String URL_STRATEGY_CN = "url_strategy_cn";
    public static final String DATA_RESIDENCY_EU = "data_residency_eu";
    public static final String DATA_RESIDENCY_TR = "data_residency_tr";
    public static final String DATA_RESIDENCY_US = "data_residency_us";

    public static final String AD_REVENUE_APPLOVIN_MAX = "applovin_max_sdk";
    public static final String AD_REVENUE_MOPUB = "mopub";
    public static final String AD_REVENUE_ADMOB = "admob_sdk";
    public static final String AD_REVENUE_IRONSOURCE = "ironsource_sdk";
    public static final String AD_REVENUE_ADMOST = "admost_sdk";
    public static final String AD_REVENUE_UNITY = "unity_sdk";
    public static final String AD_REVENUE_HELIUM_CHARTBOOST = "helium_chartboost_sdk";
    public static final String AD_REVENUE_SOURCE_PUBLISHER = "publisher_sdk";

    /**
     * 实例化配置
     * @param context Context上下文
     * @param appToken appToken
     * @param environment 当前环境
     */
    public RxAdjustConfig(Context context, String appToken, String environment) {
        init(context, appToken, environment, false);
    }

    public RxAdjustConfig(Context context, String appToken, String environment, boolean allowSuppressLogLevel) {
        init(context, appToken, environment, allowSuppressLogLevel);
    }

    private void init(Context context, String appToken, String environment, boolean allowSuppressLogLevel) {
        if (context != null) {
            context = context.getApplicationContext();
        }

        this.context = context;
        this.appToken = appToken;
        this.environment = environment;

        // default values
        this.eventBufferingEnabled = false;
        this.sendInBackground = false;
        this.preinstallTrackingEnabled = false;
    }

    /**
     * 设置深度链接反馈
     * @param onRxDeeplinkResponseListener 深度链接回调
     */
    public void setOnRxDeeplinkResponseListener(OnRxDeeplinkResponseListener onRxDeeplinkResponseListener) {
        this.onRxDeeplinkResponseListener = onRxDeeplinkResponseListener;
    }

    /**
     * 会话失败回传
     * @param onRxSessionTrackingFailedListener 失败回调
     */
    public void setOnRxSessionTrackingFailedListener(OnRxSessionTrackingFailedListener onRxSessionTrackingFailedListener) {
        this.onRxSessionTrackingFailedListener = onRxSessionTrackingFailedListener;
    }

    /**
     * 会话成功回传
     * @param onRxSessionTrackingSucceededListener 成功回调
     */
    public void setOnRxSessionTrackingSucceededListener(OnRxSessionTrackingSucceededListener onRxSessionTrackingSucceededListener) {
        this.onRxSessionTrackingSucceededListener = onRxSessionTrackingSucceededListener;
    }

    /**
     * 事件失败回传
     * @param onRxEventTrackingFailedListener 失败回调
     */
    public void setOnRxEventTrackingFailedListener(OnRxEventTrackingFailedListener onRxEventTrackingFailedListener) {
        this.onRxEventTrackingFailedListener = onRxEventTrackingFailedListener;
    }

    /**
     * 设置归因回传监听
     * @param onRxAttributionChangedListener 监听回调
     */
    public void setOnRxAttributionChangedListener(OnRxAttributionChangedListener onRxAttributionChangedListener) {
        this.onRxAttributionChangedListener = onRxAttributionChangedListener;
    }

    public void setEventBufferingEnabled(boolean eventBufferingEnabled) {
//        if (eventBufferingEnabled == null) {
//            this.eventBufferingEnabled = false;
//            return;
//        }
        this.eventBufferingEnabled = eventBufferingEnabled;
    }

    public void setSendInBackground(boolean sendInBackground) {
        this.sendInBackground = sendInBackground;
    }

    /**
     * 事件成功回传
     * @param onRxEventTrackingSucceededListener 成功回调
     */
    public void setOnRxEventTrackingSucceededListener(OnRxEventTrackingSucceededListener onRxEventTrackingSucceededListener) {
        this.onRxEventTrackingSucceededListener = onRxEventTrackingSucceededListener;
    }

    /**
     * 设置延迟启动
     * @param delayStart 延迟事件 秒数
     */
    public void setDelayStart(double delayStart) {
        this.delayStart = delayStart;
    }

    /**
     * 请求同时发送归因和成本数据
     * @param needsCost 是否允许
     */
    public void setNeedsCost(boolean needsCost) {
        this.needsCost = needsCost;
    }

    public void setExternalDeviceId(String externalDeviceId) {
        this.externalDeviceId = externalDeviceId;
    }

    public void setPreinstallTrackingEnabled(boolean preinstallTrackingEnabled) {
        this.preinstallTrackingEnabled = preinstallTrackingEnabled;
    }

    public void setUrlStrategy(String urlStrategy) {
        this.urlStrategy = urlStrategy;
    }
}
