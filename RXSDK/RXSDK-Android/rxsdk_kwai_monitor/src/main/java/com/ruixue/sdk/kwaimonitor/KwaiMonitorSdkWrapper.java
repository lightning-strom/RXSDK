package com.ruixue.sdk.kwaimonitor;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.kwai.monitor.log.ServerType;
import com.kwai.monitor.log.TurboAgent;
import com.kwai.monitor.log.TurboConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.ISdkEvent;
import com.ruixue.utils.ObjectUtils;

import java.util.Map;

/**
 * 快手监测 SDK（MonitorSDK / TurboAgent）封装。
 * <p>
 * 由后台 {@code advertise_channel.ks} 驱动初始化。
 * 关键字段：{@code appid}、{@code app_name}（与快手平台申请时一致）；可选 {@code channel}。
 * <p>自动上报默认开启，可通过 {@link #setAutoTrack(boolean)} 手动关闭。
 */
public class KwaiMonitorSdkWrapper implements ISdkEvent {

    static class Single {
        static final KwaiMonitorSdkWrapper INSTANCE = new KwaiMonitorSdkWrapper();
    }

    public static KwaiMonitorSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private volatile boolean needAutoReport = true;
    private volatile boolean inited = false;

    @Override
    public String getADChannel() {
        return "ks";
    }

    @Override
    public void onEvent(String eventName, Map<String, Object> params) {
        switch (eventName) {
            case Event.ACTIVATED:
                init(RuiXueSdk.getContext(), params);
                break;
            case Event.REGISTER:
                if (needAutoReport) {
                    reportRegister();
                } else {
                    RXLogger.d("KwaiMonitorSdkWrapper register not need auto report");
                }
                break;
            case Event.LOGIN:
                if (needAutoReport) {
                    if (RuiXueSdk.getLoginData() != null && RuiXueSdk.getLoginData().isNewUser()) {
                        reportRegister();
                    }
                } else {
                    RXLogger.d("KwaiMonitorSdkWrapper login not need auto report");
                }
                break;
            case Event.PAY:
                if (needAutoReport) {
                    double amountYuan = resolvePayAmountYuan(params);
                    if (amountYuan > 0) {
                        reportPay(amountYuan);
                    } else {
                        RXLogger.d("KwaiMonitorSdkWrapper pay amount invalid: " + params);
                    }
                } else {
                    RXLogger.d("KwaiMonitorSdkWrapper pay not need auto report");
                }
                break;
            case Event.CREATE_GAME_ROLE:
                if (needAutoReport) {
                    String role = ObjectUtils.toString(params != null ? params.get("role") : null);
                    if (TextUtils.isEmpty(role)) {
                        role = ObjectUtils.toString(params != null ? params.get("cp_game_character_name") : null);
                    }
                    if (!TextUtils.isEmpty(role)) {
                        reportCreateRole(role);
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     * 金额优先取元（amount / price）；若传分（amount_fen / value）则 /100。
     */
    private double resolvePayAmountYuan(Map<String, Object> params) {
        if (params == null) {
            return 0;
        }
        if (params.containsKey("amount")) {
            return toDouble(params.get("amount"));
        }
        if (params.containsKey("price")) {
            return toDouble(params.get("price"));
        }
        if (params.containsKey("amount_fen")) {
            return toDouble(params.get("amount_fen")) / 100d;
        }
        if (params.containsKey("value")) {
            return toDouble(params.get("value")) / 100d;
        }
        return 0;
    }

    private static double toDouble(Object obj) {
        if (obj == null) {
            return 0;
        }
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            return Double.parseDouble(String.valueOf(obj));
        } catch (Exception e) {
            return 0;
        }
    }

    private void init(Context context, Map<String, Object> params) {
        RXLogger.d("KwaiMonitorSdkWrapper init");
        try {
            if (context == null || params == null) {
                return;
            }
            // ks 规范无 tm 字段：下发 ks 配置即视为启用；若显式下发 tm 则以 tm==1 为准
            if (params.containsKey("tm") && ObjectUtils.toInt(params.get("tm")) != 1) {
                RXLogger.d("KwaiMonitorSdkWrapper tm!=1, skip init");
                return;
            }
            String appId = firstNonEmpty(
                    ObjectUtils.toString(params.get("appid")),
                    ObjectUtils.toString(params.get("app_id")),
                    ObjectUtils.toString(params.get("appId")));
            String appName = firstNonEmpty(
                    ObjectUtils.toString(params.get("app_name")),
                    ObjectUtils.toString(params.get("appName")));
            if (TextUtils.isEmpty(appId) || TextUtils.isEmpty(appName)) {
                RXLogger.e("KwaiMonitorSdkWrapper init failed: appid/app_name empty");
                return;
            }
            String appChannel = firstNonEmpty(
                    ObjectUtils.toString(params.get("channel")),
                    ObjectUtils.toString(params.get("app_channel")),
                    ObjectUtils.toString(params.get("appChannel")));
            boolean debug = ObjectUtils.toBoolean(params.get("debug"))
                    || ObjectUtils.toInt(params.get("debug")) == 1;

            init(context, appId, appName, appChannel, debug);
            // 激活事件：SDK 初始化后立即上报活跃（受自动上报开关控制）
            if (needAutoReport) {
                reportActive();
            }
        } catch (Exception e) {
            inited = false;
            RXLogger.e("KwaiMonitorSdkWrapper init error: " + e.getMessage());
        }
    }

    private static String firstNonEmpty(String... values) {
        if (values != null) {
            for (String v : values) {
                if (!TextUtils.isEmpty(v)) {
                    return v;
                }
            }
        }
        return null;
    }

    /**
     * 手动初始化（Demo / 非 advertise_channel 场景）。
     */
    public void init(Context context, String appId, String appName) {
        init(context, appId, appName, null, false);
    }

    public void init(Context context, String appId, String appName, String appChannel, boolean enableDebug) {
        if (context == null) {
            throw new IllegalArgumentException("context is null");
        }
        if (TextUtils.isEmpty(appId) || TextUtils.isEmpty(appName)) {
            throw new IllegalArgumentException("appId/appName is empty");
        }
        Context appCtx = context.getApplicationContext();
        TurboConfig.TurboConfigBuilder builder = TurboConfig.TurboConfigBuilder.create(appCtx)
                .setAppId(appId)
                .setAppName(appName)
                .setEnableDebug(enableDebug);
        if (!TextUtils.isEmpty(appChannel)) {
            builder.setAppChannel(appChannel);
        }
        TurboAgent.init(builder.build());
        inited = true;
        RXLogger.d("KwaiMonitorSdkWrapper TurboAgent.init ok, appId=" + appId);
    }

    public boolean isInited() {
        return inited;
    }

    /**
     * 自动上报开关，默认开启（{@code true}）。
     * <p>关闭后 激活/注册/登录/付费/创角 等自动事件不再上报；手动 {@code reportXxx} 不受影响。
     * 需在触发对应事件前设置（如初始化前）。
     */
    public void setAutoTrack(boolean enabled) {
        this.needAutoReport = enabled;
        RXLogger.d("KwaiMonitorSdkWrapper setAutoTrack=" + enabled);
    }

    public boolean isAutoTrack() {
        return needAutoReport;
    }

    /** 活跃 / 进入首页 */
    public void reportActive() {
        if (!ensureInited("onAppActive")) {
            return;
        }
        TurboAgent.onAppActive();
    }

    public void reportRegister() {
        if (!ensureInited("onRegister")) {
            return;
        }
        TurboAgent.onRegister();
    }

    /** 付费成功，单位：元 */
    public void reportPay(double amountYuan) {
        if (!ensureInited("onPay")) {
            return;
        }
        TurboAgent.onPay(amountYuan);
    }

    public void reportCreateRole(String roleName) {
        if (!ensureInited("onGameCreateRole")) {
            return;
        }
        TurboAgent.onGameCreateRole(roleName);
    }

    public void reportUpgradeRole(int level) {
        if (!ensureInited("onGameUpgradeRole")) {
            return;
        }
        TurboAgent.onGameUpgradeRole(level);
    }

    public void reportWatchRewardVideo() {
        if (!ensureInited("onGameWatchRewardVideo")) {
            return;
        }
        TurboAgent.onGameWatchRewardVideo();
    }

    public void reportNextDayStay() {
        if (!ensureInited("onNextDayStay")) {
            return;
        }
        TurboAgent.onNextDayStay();
    }

    public void reportWeekStay() {
        if (!ensureInited("onWeekStay")) {
            return;
        }
        TurboAgent.onWeekStay();
    }

    public void reportPageResume(Activity activity) {
        if (!ensureInited("onPageResume")) {
            return;
        }
        if (activity != null) {
            TurboAgent.onPageResume(activity);
        } else {
            TurboAgent.onPageResume();
        }
    }

    public void reportPagePause(Activity activity) {
        if (!ensureInited("onPagePause")) {
            return;
        }
        if (activity != null) {
            TurboAgent.onPagePause(activity);
        } else {
            TurboAgent.onPagePause();
        }
    }

    public void reportGameServer(boolean dedicated) {
        if (!ensureInited("reportGameServer")) {
            return;
        }
        TurboAgent.reportGameServer(dedicated ? ServerType.DedicatedServer : ServerType.MixtureServer);
    }

    public void reportKeyPath(String path) {
        if (!ensureInited("reportKeyPathOptimization")) {
            return;
        }
        TurboAgent.reportKeyPathOptimization(path);
    }

    private boolean ensureInited(String api) {
        if (!inited) {
            RXLogger.d("KwaiMonitorSdkWrapper skip " + api + ": not inited");
            return false;
        }
        return true;
    }
}
