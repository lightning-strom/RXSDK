package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huya.berry.client.HuyaBerry;
import com.huya.berry.client.HuyaBerryConfig;
import com.huya.berry.client.live.IFragmentsManager;
import com.huya.berry.pay.data.PayShopData;
import com.huya.berry.report.game_report.ReportInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.GameInfo;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 虎牙联运 SDK 桥接层，直接调用官方 {@link HuyaBerry} API（berry 1.4.5-698）。
 *
 * <p><b>已包装：</b>
 * {@code init}/{@code uninit}/{@code setBerryEventDelegate}、
 * {@code login}/{@code logout}/{@code pay}、
 * {@code reportRegisterInfo}（角色上报）、
 * {@code onLoginActivityResult}/{@code onRequestPermissionsResult}、
 * {@code onAppFrontGround}/{@code onAppBackGround}、
 * {@code getUnionId}（登录凭证回填）。
 *
 * <p><b>未包装（联运文档有、瑞雪暂无统一入口或未接）：</b>
 * <ul>
 *   <li>{@code queryLoginInfo} — 自定义 UI 查登录态（需 {@code CustomUICallback}）</li>
 *   <li>{@code queryCertifical} — 自定义 UI 查实名（事件 {@code QUERY_CERTIFICATION}）</li>
 *   <li>{@code guestBindPhone} — 游客绑手机</li>
 *   <li>{@code switchCount} — 主动拉起切号（浮球切号事件已接）</li>
 *   <li>{@code logout(Activity, boolean)} — 带标志位登出</li>
 *   <li>{@code changeLandscapeMode}/{@code setCanLoginDialogClose}/{@code setWebViewFullScreen}</li>
 *   <li>{@code onActivityResult}（非登录，当前只转 {@code onLoginActivityResult}）</li>
 *   <li>{@code PayShopData.extra} — 支付扩展透传</li>
 * </ul>
 */
public class HuyaSdkHelper {

    private static final String TAG = "HuyaSdkHelper";

    /**
     * 渠道侧被动事件（浮球登出/切号、防沉迷踢出等）回传宿主。
     */
    public interface HostNotifier {
        void onPassiveLogout(@Nullable String reason);

        /**
         * @return true 表示宿主已接管切号，SDK 侧应清理瑞雪本地会话
         */
        boolean onSwitchAccount(@Nullable String data);

        void onQuit(@Nullable String msg);
    }

    private static volatile HuyaSdkHelper INSTANCE;

    private final AtomicBoolean inited = new AtomicBoolean(false);
    private final AtomicBoolean eventBound = new AtomicBoolean(false);

    @Nullable
    private HostNotifier hostNotifier;
    @Nullable
    private RXJSONCallback pendingInitCallback;
    @Nullable
    private RXJSONCallback pendingLoginCallback;
    @Nullable
    private OnLogoutCallback pendingLogoutCallback;
    @Nullable
    private RXJSONCallback pendingPayCallback;

    public static HuyaSdkHelper getInstance() {
        if (INSTANCE == null) {
            synchronized (HuyaSdkHelper.class) {
                if (INSTANCE == null) {
                    INSTANCE = new HuyaSdkHelper();
                }
            }
        }
        return INSTANCE;
    }

    private HuyaSdkHelper() {
    }

    public void setHostNotifier(@Nullable HostNotifier hostNotifier) {
        this.hostNotifier = hostNotifier;
    }

    public boolean isInited() {
        return inited.get();
    }

    public void init(@NonNull Activity activity, @Nullable Map<String, Object> params,
            @Nullable RXJSONCallback callback) {
        // 进程内已初始化则直接成功，避免重复 init 触发 Berry "mIsInit == true"
        if (inited.get()) {
            if (callback != null) {
                callback.onSuccess(null);
            }
            return;
        }
        Map<String, Object> safeParams = params == null ? new HashMap<String, Object>() : params;
        try {
            pendingInitCallback = callback;
            ensureEventDelegate();
            HuyaBerryConfig config = buildConfig(safeParams);
            Application application = activity.getApplication();
            if (application == null) {
                throw new IllegalStateException("activity.getApplication() is null");
            }
            HuyaBerry.instance().init(application, config);
            // 初始化完成以 BERRYEVENT_EVENTTYPE_INIT 事件为准
        } catch (Exception e) {
            inited.set(false);
            pendingInitCallback = null;
            RXLogger.e(TAG + " init failed: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage()));
            }
        }
    }

    public boolean login(@NonNull Activity activity, @Nullable RXJSONCallback callback) {
        if (!inited.get()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(),
                        "huya sdk not initialized"));
            }
            return false;
        }
        Activity host = resolveHostActivity(activity);
        if (host == null) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                        "no valid activity for huya login"));
            }
            return false;
        }
        try {
            // Berry FragmentsManager 会缓存首次 login 的 Activity；Activity 销毁后 WeakRef
            // 仍非 null，导致复用已销毁宿主，登录弹窗无法再显示（log: activity is Destroyed）。
            resetBerryFragmentsHostIfStale(host);
            pendingLoginCallback = callback;
            HuyaBerry.instance().login(host);
            return true;
        } catch (Exception e) {
            pendingLoginCallback = null;
            RXLogger.e(TAG + " login failed: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), e.getMessage()));
            }
            return false;
        }
    }

    /**
     * 优先使用可用的 Activity：入参 → RuiXue 当前 Activity。
     */
    @Nullable
    private Activity resolveHostActivity(@Nullable Activity activity) {
        if (isActivityValid(activity)) {
            return activity;
        }
        Activity current = RuiXueSdk.getCurrentActivity();
        if (isActivityValid(current)) {
            return current;
        }
        return null;
    }

    private boolean isActivityValid(@Nullable Activity activity) {
        return activity != null && !activity.isFinishing() && !activity.isDestroyed();
    }

    /**
     * 若 Berry 内部 FragmentsManager 仍指向已销毁/旧 Activity，清空后由下次 login 重建。
     */
    private void resetBerryFragmentsHostIfStale(@NonNull Activity host) {
        try {
            HuyaBerry berry = HuyaBerry.instance();
            Field fragmentsField = findFragmentsManagerField(berry.getClass());
            if (fragmentsField == null) {
                return;
            }
            fragmentsField.setAccessible(true);
            Object fragmentsManager = fragmentsField.get(berry);
            if (!(fragmentsManager instanceof IFragmentsManager)) {
                return;
            }
            IFragmentsManager manager = (IFragmentsManager) fragmentsManager;
            Activity cached = manager.a();
            if (cached == null) {
                return;
            }
            if (cached == host && isActivityValid(cached)) {
                return;
            }
            RXLogger.i(TAG + " reset Berry FragmentsManager host, cachedValid="
                    + isActivityValid(cached) + ", sameHost=" + (cached == host));
            try {
                manager.uninit();
            } catch (Exception ignore) {
                // ignore
            }
            fragmentsField.set(berry, null);
        } catch (Exception e) {
            RXLogger.e(TAG + " reset Berry FragmentsManager failed: " + e.getMessage());
        }
    }

    @Nullable
    private static Field findFragmentsManagerField(@NonNull Class<?> berryClass) {
        Class<?> cursor = berryClass;
        while (cursor != null && cursor != Object.class) {
            for (Field field : cursor.getDeclaredFields()) {
                if (IFragmentsManager.class.isAssignableFrom(field.getType())) {
                    return field;
                }
            }
            cursor = cursor.getSuperclass();
        }
        return null;
    }

    public boolean logout(@Nullable Activity activity, @NonNull OnLogoutCallback callback) {
        if (!inited.get()) {
            callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.getValue(), "huya sdk not initialized");
            return false;
        }
        if (activity == null) {
            callback.onFailed(RXErrorCode.INIT_PARAMS_ERROR.getValue(), "current activity is null");
            return false;
        }
        try {
            pendingLogoutCallback = callback;
            HuyaBerry.instance().logout(activity);
            return true;
        } catch (Exception e) {
            pendingLogoutCallback = null;
            RXLogger.e(TAG + " logout failed: " + e.getMessage());
            callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), e.getMessage());
            return false;
        }
    }

    /**
     * 拉起虎牙支付页。成功返回 true；客户端结果以 {@link HuyaBerry.BerryEvent#BERRYEVENT_EVENTTYPE_PAY} 回调为准
     *（成功仅表示拉起支付页，发货以后端 notify 为准）。
     * <p>未传 {@link PayShopData#extra}（渠道扩展字段，当前无瑞雪映射）。
     */
    public boolean pay(@NonNull Activity activity, @NonNull HuyaOrderData orderData,
            @Nullable RXJSONCallback callback) {
        if (!inited.get()) {
            return false;
        }
        try {
            PayShopData payData = new PayShopData();
            payData.amount = orderData.resolveAmountFen();
            payData.bizOrderId = orderData.resolveBizOrderId();
            payData.bizSign = orderData.resolveBizSign();
            payData.prodName = orderData.resolveProductName();
            // payData.extra 未包装：无统一业务字段来源
            pendingPayCallback = callback;
            HuyaBerry.instance().pay(activity, payData);
            return true;
        } catch (Exception e) {
            pendingPayCallback = null;
            RXLogger.e(TAG + " pay failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * 角色信息上报 → {@link HuyaBerry#reportRegisterInfo(ReportInfo)}。
     * 事件结果见 {@code BERRYEVENT_EVENTTYPE_REPORTROLE}（当前仅打日志，无独立 CP 回调）。
     */
    public void reportRole(@NonNull GameInfo gameInfo) {
        if (!inited.get()) {
            RXLogger.w(TAG + " reportRole skipped: not inited");
            return;
        }
        try {
            int level = 1;
            try {
                String levelText = gameInfo.getGameRoleLevel();
                if (!TextUtils.isEmpty(levelText)) {
                    level = Integer.parseInt(levelText.trim());
                }
            } catch (Exception ignore) {
                level = 1;
            }
            String roleId = emptyToDefault(gameInfo.getRoleId(), "0");
            String serverId = emptyToDefault(gameInfo.getServerId(), "1");
            // attach 中可选 career/chapter/realmId/realmName/sdkchannelId
            String career = null;
            String chapter = null;
            String realmId = null;
            String realmName = null;
            String sdkChannelId = null;
            JSONObject attach = safeToJson(gameInfo.getAttach());
            if (attach != null) {
                career = attach.optString("career", null);
                chapter = attach.optString("chapter", null);
                realmId = firstNotEmpty(attach.optString("realmId", null),
                        attach.optString("realm_id", null));
                realmName = firstNotEmpty(attach.optString("realmName", null),
                        attach.optString("realm_name", null));
                sdkChannelId = firstNotEmpty(attach.optString("sdkchannelId", null),
                        attach.optString("sdk_channel_id", null));
            }
            ReportInfo.Builder builder = new ReportInfo.Builder()
                    .setRoleId(roleId)
                    .setRoleName(emptyToDefault(gameInfo.getRoleName(), roleId))
                    .setServerId(serverId)
                    .setServerName(emptyToDefault(gameInfo.getServerName(), serverId))
                    .setRoleLevel(level);
            if (!TextUtils.isEmpty(career)) {
                builder.setCareer(career);
            }
            if (!TextUtils.isEmpty(chapter)) {
                builder.setChapter(chapter);
            }
            if (!TextUtils.isEmpty(realmId)) {
                builder.setRealmId(realmId);
            }
            if (!TextUtils.isEmpty(realmName)) {
                builder.setRealmName(realmName);
            }
            if (!TextUtils.isEmpty(sdkChannelId)) {
                builder.setSdkchannelId(sdkChannelId);
            }
            HuyaBerry.instance().reportRegisterInfo(builder.build());
        } catch (Exception e) {
            RXLogger.e(TAG + " reportRole failed: " + e.getMessage());
        }
    }

    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (!inited.get()) {
            return;
        }
        try {
            // 登录相关结果；通用 onActivityResult(int,int,Intent) 未包装
            HuyaBerry.instance().onLoginActivityResult(requestCode, resultCode, data);
        } catch (Exception e) {
            RXLogger.e(TAG + " onActivityResult failed: " + e.getMessage());
        }
    }

    public void onRequestPermissionsResult(int requestCode, @Nullable String[] permissions,
            @Nullable int[] grantResults) {
        if (!inited.get() || permissions == null || grantResults == null) {
            return;
        }
        try {
            HuyaBerry.instance().onRequestPermissionsResult(requestCode, permissions, grantResults);
        } catch (Exception e) {
            RXLogger.e(TAG + " onRequestPermissionsResult failed: " + e.getMessage());
        }
    }

    /** App 回前台（联运要求转发）。 */
    public void onAppFrontGround() {
        if (!inited.get()) {
            return;
        }
        try {
            HuyaBerry.instance().onAppFrontGround();
        } catch (Exception e) {
            RXLogger.e(TAG + " onAppFrontGround failed: " + e.getMessage());
        }
    }

    /** App 进后台（联运要求转发）。 */
    public void onAppBackGround() {
        if (!inited.get()) {
            return;
        }
        try {
            HuyaBerry.instance().onAppBackGround();
        } catch (Exception e) {
            RXLogger.e(TAG + " onAppBackGround failed: " + e.getMessage());
        }
    }

    /*
     * ---- 以下 Berry API 明确未包装，需要时再接 ----
     * HuyaBerry.guestBindPhone(Activity, JsCallback)
     * HuyaBerry.queryLoginInfo(Activity, CustomUICallback)
     * HuyaBerry.queryCertifical(Activity, CustomUICallback)
     * HuyaBerry.switchCount(Activity)
     * HuyaBerry.logout(Activity, boolean)
     * HuyaBerry.changeLandscapeMode(boolean)
     * HuyaBerry.setCanLoginDialogClose(boolean)
     * HuyaBerry.setWebViewFullScreen(boolean)
     * HuyaBerry.onActivityResult(int, int, Intent)  // 非 login 专用
     */

    public void uninit() {
        if (!inited.get() && !eventBound.get()) {
            return;
        }
        try {
            HuyaBerry.instance().uninit();
        } catch (Exception e) {
            RXLogger.e(TAG + " uninit failed: " + e.getMessage());
        } finally {
            inited.set(false);
            pendingInitCallback = null;
            pendingLoginCallback = null;
            pendingLogoutCallback = null;
            pendingPayCallback = null;
        }
    }

    private void ensureEventDelegate() {
        if (!eventBound.compareAndSet(false, true)) {
            return;
        }
        HuyaBerry.instance().setBerryEventDelegate(new HuyaBerry.BerryEvent() {
            @Override
            public void onEventCallback(Map<String, String> params) {
                handleEvent(params);
            }
        });
    }

    /**
     * Berry 统一事件入口。各 eventType 语义不同，必须分流，禁止合并处理：
     * <ul>
     *   <li>INIT：初始化结果；无 resultCode 时可默认成功；{@code mIsInit == true} 视为已初始化成功</li>
     *   <li>LOGIN：主动登录结果；无 resultCode 不得默认成功；取消走 {@code LOGIN_CANCEL}</li>
     *   <li>SWITCH_ACCOUNT：浮球切号；有 pending 登录回调时按登录结果回传，否则经 HostNotifier 通知宿主</li>
     *   <li>LOGOUT：主动/浮球登出；无 pending 时被动通知宿主清理瑞雪会话</li>
     *   <li>QUIT：防沉迷/踢出等强制退出，不可当作普通登出成功</li>
     *   <li>PAY：拉起支付页结果（成功≠支付完成，发货以后端 notify 为准）</li>
     *   <li>REPORTROLE：角色上报结果（当前仅日志，无 CP 回调）</li>
     *   <li>QUERY_CERTIFICATION：实名查询结果（{@code queryCertifical} 未包装，事件仅日志）</li>
     * </ul>
     */
    private void handleEvent(@Nullable Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return;
        }
        String eventType = params.get(HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE);
        // resultMsg 可能是纯文本，也可能是 JSON（含 unionid / accessToken 等）
        String msg = firstNotEmpty(
                params.get(HuyaBerry.BerryEvent.BERRYEVENT_RESULTMSG),
                params.get("msg"));
        if (TextUtils.isEmpty(eventType)) {
            return;
        }
        // 初始化
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_INIT.equals(eventType)) {
            handleInitEvent(msg, params);
            return;
        }
        // 主动登录
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_LOGIN.equals(eventType)) {
            handleLoginEvent(msg, params);
            return;
        }
        // 浮球切号（与 LOGIN 凭证结构类似，但生命周期不同）
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_SWITCH_ACCOUNT.equals(eventType)) {
            handleSwitchAccountEvent(msg, params);
            return;
        }
        // 主动登出 / 浮球登出
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_LOGOUT.equals(eventType)) {
            handleLogoutEvent(msg, params);
            return;
        }
        // 防沉迷踢出等，与 LOGOUT 分开
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_QUIT.equals(eventType)) {
            handleQuitEvent(msg, params);
            return;
        }
        // 支付页拉起结果
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_PAY.equals(eventType)) {
            handlePayEvent(msg, params);
            return;
        }
        // 角色上报结果：无独立 pending 回调，仅记录
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_REPORTROLE.equals(eventType)) {
            RXLogger.i(TAG + " reportRole event, code=" + resolveResultCode(params, msg)
                    + ", msg=" + resolveErrorMessage(msg, ""));
            return;
        }
        // 实名查询：queryCertifical 未包装，事件先落日志便于联调
        if (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_QUERY_CERTIFICATION.equals(eventType)) {
            RXLogger.i(TAG + " queryCertification event (API 未包装), code="
                    + resolveResultCode(params, msg)
                    + ", msg=" + resolveErrorMessage(msg, ""));
            return;
        }
        RXLogger.i(TAG + " unhandled berry eventType=" + eventType
                + ", msg=" + resolveErrorMessage(msg, ""));
    }

    private void handleInitEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        RXJSONCallback callback = pendingInitCallback;
        pendingInitCallback = null;
        // Berry 已初始化时会回调 resultCode=-1 + "mIsInit == true"，应按成功处理
        // INIT 官方示例常仅带 eventType，无明确失败码时按成功处理
        if (isSuccessResult(params, msg, true) || isAlreadyInitedMessage(msg)) {
            inited.set(true);
            if (callback != null) {
                callback.onSuccess(null);
            }
            return;
        }
        inited.set(false);
        String message = resolveErrorMessage(msg, "huya init failed");
        RXLogger.e(TAG + " init event failed: " + message);
        if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), message));
        }
    }

    private boolean isAlreadyInitedMessage(@Nullable String msg) {
        if (TextUtils.isEmpty(msg)) {
            return false;
        }
        return msg.contains("mIsInit == true") || msg.contains("mIsInit=true");
    }

    private void handleLoginEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        RXJSONCallback callback = pendingLoginCallback;
        if (callback == null) {
            RXLogger.i(TAG + " login event without pending callback, ignore");
            return;
        }
        pendingLoginCallback = null;
        dispatchLoginResult(callback, msg, params);
    }

    private void handleSwitchAccountEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        // 主动登录过程中收到切号，按登录结果回传
        RXJSONCallback loginCallback = pendingLoginCallback;
        if (loginCallback != null) {
            pendingLoginCallback = null;
            dispatchLoginResult(loginCallback, msg, params);
            return;
        }
        if (isCancelResult(params, msg)) {
            RXLogger.i(TAG + " switch account canceled");
            return;
        }
        if (!isSuccessResult(params, msg, false)) {
            RXLogger.e(TAG + " switch account failed: " + resolveErrorMessage(msg, "huya switch account failed"));
            return;
        }
        JSONObject loginData = buildLoginExt(msg, params);
        String data = loginData.toString();
        HostNotifier notifier = hostNotifier;
        if (notifier == null) {
            RXLogger.w(TAG + " switch account without host notifier: " + data);
            return;
        }
        boolean handled = notifier.onSwitchAccount(data);
        if (handled) {
            notifier.onPassiveLogout("switch_account");
        }
    }

    private void dispatchLoginResult(@NonNull RXJSONCallback callback, @Nullable String msg,
            @NonNull Map<String, String> params) {
        if (isCancelResult(params, msg)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_CANCEL.getValue(),
                    resolveErrorMessage(msg, "huya login canceled")));
            return;
        }
        // LOGIN 无 resultCode 时不得默认成功
        if (!isSuccessResult(params, msg, false)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                    resolveErrorMessage(msg, "huya login failed")));
            return;
        }
        callback.onSuccess(buildLoginExt(msg, params));
    }

    @NonNull
    private JSONObject buildLoginExt(@Nullable String msg, @NonNull Map<String, String> params) {
        JSONObject json = safeToJson(msg);
        String unionid = firstNotEmpty(
                json != null ? json.optString("unionid") : null,
                json != null ? json.optString("unionId") : null,
                params.get("unionid"),
                params.get("unionId"),
                HuyaBerry.instance().getUnionId());
        String accessToken = firstNotEmpty(
                json != null ? json.optString("accessToken") : null,
                json != null ? json.optString("access_token") : null,
                json != null ? json.optString("token") : null,
                params.get("accessToken"),
                params.get("access_token"),
                params.get("token"));
        Map<String, Object> loginData = new HashMap<>();
        if (!TextUtils.isEmpty(unionid)) {
            loginData.put("unionid", unionid);
        }
        if (!TextUtils.isEmpty(accessToken)) {
            loginData.put("access_token", accessToken);
        }
        return new JSONObject(loginData);
    }

    private void handleLogoutEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        OnLogoutCallback callback = pendingLogoutCallback;
        if (callback != null) {
            pendingLogoutCallback = null;
            if (isCancelResult(params, msg)) {
                callback.onFailed(RXErrorCode.LOGIN_CANCEL.getValue(),
                        resolveErrorMessage(msg, "huya logout canceled"));
                return;
            }
            if (!isSuccessResult(params, msg, true)) {
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                        resolveErrorMessage(msg, "huya logout failed"));
                return;
            }
            callback.onSuccess(msg == null ? "" : msg);
            return;
        }
        // 浮球等被动登出
        HostNotifier notifier = hostNotifier;
        if (notifier != null) {
            notifier.onPassiveLogout(firstNotEmpty(msg, "logout"));
        } else {
            RXLogger.w(TAG + " passive logout without host notifier");
        }
    }

    private void handleQuitEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        // QUIT：防沉迷/踢出等，不得当作普通登出成功
        RXLogger.i(TAG + " quit event, code=" + resolveResultCode(params, msg)
                + ", msg=" + resolveErrorMessage(msg, ""));
        HostNotifier notifier = hostNotifier;
        if (notifier != null) {
            notifier.onQuit(firstNotEmpty(msg, "quit"));
        } else {
            RXLogger.w(TAG + " quit without host notifier");
        }
    }

    private void handlePayEvent(@Nullable String msg, @NonNull Map<String, String> params) {
        RXJSONCallback callback = pendingPayCallback;
        pendingPayCallback = null;
        if (callback == null) {
            RXLogger.i(TAG + " pay event without pending callback: "
                    + resolveErrorMessage(msg, ""));
            return;
        }
        if (isCancelResult(params, msg)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(),
                    resolveErrorMessage(msg, "huya pay canceled")));
            return;
        }
        if (isSuccessResult(params, msg, false)) {
            // 客户端成功仅表示拉起支付页；发货以后端 notify 为准
            callback.onSuccess(null);
            return;
        }
        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR.getValue(),
                resolveErrorMessage(msg, "huya pay failed")));
    }

    private boolean isCancelResult(@NonNull Map<String, String> params, @Nullable String msg) {
        String codeText = resolveResultCode(params, msg);
        if (TextUtils.isEmpty(codeText)) {
            return false;
        }
        return HuyaBerry.BerryEvent.BERRYEVENT_RESULTCODE_CANCEL.equals(codeText)
                || "-2".equals(codeText.trim());
    }

    /**
     * @param defaultWhenMissing 无 resultCode 时的默认值；LOGIN/PAY 应为 false，INIT 可为 true
     */
    private boolean isSuccessResult(@NonNull Map<String, String> params, @Nullable String msg,
            boolean defaultWhenMissing) {
        String codeText = resolveResultCode(params, msg);
        if (!TextUtils.isEmpty(codeText)) {
            return HuyaBerry.BerryEvent.BERRYEVENT_RESULTCODE_SUCCESS.equals(codeText)
                    || "0".equals(codeText.trim());
        }
        return defaultWhenMissing;
    }

    @Nullable
    private String resolveResultCode(@NonNull Map<String, String> params, @Nullable String msg) {
        String codeText = firstNotEmpty(
                params.get(HuyaBerry.BerryEvent.BERRYEVENT_RESULTCODE),
                params.get("resultCode"),
                params.get("code"));
        if (!TextUtils.isEmpty(codeText)) {
            return codeText;
        }
        JSONObject json = safeToJson(msg);
        if (json != null && json.has("resultCode")) {
            return String.valueOf(json.optInt("resultCode"));
        }
        return null;
    }

    @NonNull
    private String resolveErrorMessage(@Nullable String msg, @NonNull String defaultMsg) {
        JSONObject json = safeToJson(msg);
        if (json != null) {
            String text = json.optString("msg", json.optString("tips", ""));
            if (!TextUtils.isEmpty(text)) {
                return text;
            }
        }
        if (!TextUtils.isEmpty(msg)) {
            return msg;
        }
        return defaultMsg;
    }

    @Nullable
    private JSONObject safeToJson(@Nullable String jsonText) {
        if (TextUtils.isEmpty(jsonText)) {
            return null;
        }
        try {
            return new JSONObject(jsonText);
        } catch (Exception ignore) {
            return null;
        }
    }

    @NonNull
    private HuyaBerryConfig buildConfig(@NonNull Map<String, Object> params) {
        String gameId = mustGet(params, "gameId", "game_id", "huya_game_id");
        String loginClientId = mustGet(params, "loginClientID", "loginClientId", "login_client_id",
                "huya_login_client_id");
        String loginClientSecret = mustGet(params, "loginClientSecret", "login_client_secret",
                "huya_login_client_secret");
        String payAppId = mustGet(params, "payAppId", "pay_app_id", "huya_pay_app_id");
        boolean debugMode = getBoolean(params, false, "debugMode", "huya_debug_mode", "isDebug");
        boolean landscapeMode = getBoolean(params, true, "landscapeMode", "landscape_mode");
        // 游戏中心是否展示切号入口；运行时 changeLandscapeMode / setCanLoginDialogClose 等未包装
        boolean showSwitchInGameCenter = getBoolean(params, true,
                "isShowSwitchCountInGameCenter", "show_switch_count_in_game_center");

        return new HuyaBerryConfig.Builder()
                .gameId(gameId)
                .debugMode(debugMode)
                .landscapeMode(landscapeMode)
                .loginClientID(loginClientId)
                .loginClientSecret(loginClientSecret)
                .payAppId(payAppId)
                .isShowSwitchCountInGameCenter(showSwitchInGameCenter)
                .build();
    }

    @NonNull
    private String emptyToDefault(@Nullable String value, @NonNull String defaultValue) {
        return TextUtils.isEmpty(value) ? defaultValue : value;
    }

    private boolean getBoolean(@NonNull Map<String, Object> params, boolean defaultValue,
            @NonNull String... keys) {
        for (String key : keys) {
            Object value = params.get(key);
            if (value instanceof Boolean) {
                return (Boolean) value;
            }
            if (value instanceof Number) {
                return ((Number) value).intValue() != 0;
            }
            if (value instanceof String) {
                String text = ((String) value).trim();
                if ("1".equals(text) || "true".equalsIgnoreCase(text)) {
                    return true;
                }
                if ("0".equals(text) || "false".equalsIgnoreCase(text)) {
                    return false;
                }
            }
        }
        return defaultValue;
    }

    @NonNull
    private String mustGet(@NonNull Map<String, Object> params, @NonNull String... keys) {
        for (String key : keys) {
            Object value = params.get(key);
            if (value != null) {
                String text = String.valueOf(value).trim();
                if (!TextUtils.isEmpty(text)) {
                    return text;
                }
            }
        }
        throw new IllegalArgumentException("missing required huya init param: " + keys[0]);
    }

    @Nullable
    private String firstNotEmpty(@Nullable String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (!TextUtils.isEmpty(value)) {
                return value;
            }
        }
        return null;
    }
}
