package com.ruixue.sdk.apkpure;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.JSONUtil;
import com.vgamepop.android.asdk.base.LoginListener;
import com.vgamepop.android.asdk.base.LoginUserInfo;
import com.vgamepop.android.asdk.base.ValueGetListener;
import com.vgamepop.android.asdk.core.ASDKManager;
import com.vgamepop.android.asdk.core.SDKInitConfig;
import com.vgamepop.android.asdk.core.net.entity.Product;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
/**
 * VGamePop (Apkpure) 插件 。
 * <p>
 * 通过 AndroidManifest meta-data {@code RX_PLUGIN_APKPURE} 注册。
 * 职责：ASDK 初始化、登录、支付（转发 BillingClient）、商品查询。
 */
public class ApkpureSdkWrapper extends PluginSdk {

    public static final String NAME = "apkpure";
    static final String APKPURE = "apkpure";
    private static final String KEY_APKPURE_APPID = "apkpure_appid";

    static class Single {
        static final ApkpureSdkWrapper INSTANCE = new ApkpureSdkWrapper();
    }

    public static ApkpureSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private final ApkpureBillingImpl mBilling = new ApkpureBillingImpl();
    private String cachedAppId;
    private Context appContext;

    /** 与 VGamePop ASDK 内部状态一致；签名/包名未在控制台登记时 {@link ASDKManager#init} 后仍为 false。 */
    private static boolean isAsdkReady() {
        try {
            return ASDKManager.INSTANCE.hasInit();
        } catch (Throwable t) {
            return false;
        }
    }

    @Nullable
    private static String readAppId(@Nullable Map<String, Object> paramsMap) {
        if (paramsMap == null) return null;
        Object o = paramsMap.get(KEY_APKPURE_APPID);
        if (o == null) return null;
        String s = String.valueOf(o).trim();
        return TextUtils.isEmpty(s) ? null : s;
    }

    private void applyAsdkLogCallback(@NonNull SDKInitConfig.Builder builder) {
        builder.setDebug(RXGlobalData.isDebugEnable())
                .setLogCallback((level, tag, msg) -> {
                    if (msg != null) {
                        RXLogger.i("ASDK " + tag + ": " + msg);
                    }
                });
    }

    /**
     * 兜底初始化：在业务侧直接调用登录/支付/商品查询且 ASDK 还未 ready 时触发一次。
     */
    private boolean ensureAsdkReady(@Nullable Context context, @Nullable Map<String, Object> paramsMap,
                                    @NonNull String scene) {
        if (isAsdkReady()) {
            return true;
        }
        String appId = readAppId(paramsMap);
        if (!TextUtils.isEmpty(appId)) {
            cachedAppId = appId;
        }
        if (context != null) {
            appContext = context.getApplicationContext();
        }
        if (TextUtils.isEmpty(cachedAppId) || appContext == null) {
            RXLogger.e("ASDK fallback init skipped, scene=" + scene + ", cachedAppId=" + cachedAppId
                    + ", appContext=" + (appContext != null));
            return false;
        }

        RXLogger.w("ASDK fallback init start, scene=" + scene + ", appId=" + cachedAppId);
        SDKInitConfig.Builder builder = new SDKInitConfig.Builder(cachedAppId);
        applyAsdkLogCallback(builder);
        ASDKManager.init(appContext, builder.build());
        boolean ready = isAsdkReady();
        RXLogger.i("ASDK fallback init result, scene=" + scene + ", ready=" + ready);
        return ready;
    }

    // ==================== PluginSdk 必须实现 ====================

    @Override
    public String getName() {
        return NAME;
    }

    /**
     * 初始化 VGamePop ASDK。
     * <p>
     * ext 参数：{@code apkpure_appid}（必须）。
     */
    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        RXLogger.i("init paramsMap=" + paramsMap);
        String appId = readAppId(paramsMap);
        if (context != null) {
            appContext = context.getApplicationContext();
        }
        if (TextUtils.isEmpty(appId)) {
            RXLogger.e("init failed: apkpure_appid is empty");
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR));
            return false;
        }
        cachedAppId = appId;

        if (isAsdkReady()) {
            RXLogger.i("init already done (ASDK hasInit), skip");
            if (callback != null)
                callback.onSuccess(null);
            return true;
        }

        Context initContext = appContext != null ? appContext : context;
        SDKInitConfig.Builder builder = new SDKInitConfig.Builder(appId);
        applyAsdkLogCallback(builder);
        SDKInitConfig config = builder.build();

        ASDKManager.init(initContext, config);
        if (isAsdkReady()) {
            RXLogger.i("apkpure init success, appId=" + appId);
            if (callback != null)
                callback.onSuccess(null);
            return true;
        }

        String hint = "VGamePop ASDK 未完成初始化。常见原因：控制台登记的包名+签名(SHA1)与当前 APK 不一致（Incorrect signature）；"
                + "Debug 包需登记 debug keystore；请确认 apkpure_appid 与当前 applicationId 为控制台同一应用。";
        RXLogger.e(hint + " appId=" + appId);
        if (callback != null)
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), hint));
        return false;
    }

    // ==================== 登录 ====================

    /**
     * ASDK 登录。成功后将 {@code accessToken} 放入 ext 返回给瑞雪服务端校验（对标 Google 返回
     * {@code idToken}）。
     */
    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        RXLogger.i("doLogin asdkReady=" + isAsdkReady());
        if (!ensureAsdkReady(activity, paramsMap, "doLogin")) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(),
                    "ASDK not initialized (hasInit=false). Check apkpure_appid and VGamePop console package+SHA1 signature."));
            return true;
        }
        doLoginImpl(activity, callback);
        return true;
    }

    private void doLoginImpl(Activity activity, @NonNull RXJSONCallback callback) {
        if (!isAsdkReady()) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "ASDK not initialized"));
            return;
        }

        ASDKManager.login(activity, new LoginListener() {
            @Override
            public void onSucceed(@NonNull String loginId, @NonNull LoginUserInfo userInfo) {
                RXLogger.i("login success, openId=" + userInfo.getOpenId());

                Map<String, Object> extMap = new HashMap<>();
                extMap.put("access_token", userInfo.getAccessToken());
                extMap.put("open_id", userInfo.getOpenId());
                extMap.put("union_id", userInfo.getUnionId());
                extMap.put("name", userInfo.getName());
                callback.onSuccess(new JSONObject(extMap));
            }

            @Override
            public void onFailed(@NonNull String loginId, @NonNull Throwable error) {
                String errMsg = error.getMessage() != null ? error.getMessage() : "Unknown error";
                String errClass = error.getClass().getSimpleName();
                RXLogger.e("login failed: " + errClass + " - " + errMsg);

                if (errClass.contains("Cancel")) {
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(-1, errMsg));
                } else {
                    callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(-1, errMsg));
                }
            }
        });
    }

    /**
     * 瑞雪服务端登录完成回调；code==0 时将瑞雪 openid 同步给 ASDK。
     */
    @Override
    public boolean onLoginResp(int code) {
        if (code == 0) {
            String openid = PassportManager.getInstance().getOpenid();
            if (!TextUtils.isEmpty(openid)) {
                ASDKManager.setUserid(openid);
                RXLogger.i("setUserid openid=" + openid);
            }
        }
        return true;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        RXLogger.i("doLogout");
        if (callback != null)
            callback.onSuccess("");
        return true;
    }

    // ==================== 支付 ====================

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(HQType.KEY) || Objects.equals(hashMap.get(HQType.KEY), APKPURE)) {
            if (!ensureAsdkReady(activity, hashMap, "doPay")) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(),
                        "ASDK not initialized before pay. Check apkpure_appid and VGamePop console package+SHA1 signature."));
                return true;
            }
            mBilling.pay(activity, hashMap, callback);
            return true;
        }
        return false;
    }

    // ==================== 商品查询 ====================

    /**
     * 向 VGamePop ASDK 拉取当前应用下全量可购商品信息。
     * <p>
     * 需先完成 {@link #init(Context, Map, RXJSONCallback)} 且 ext 中提供
     * {@code apkpure_appid}，否则 ASDK
     * 可能返回失败。
     * <p>
     * <b>返回实体 {@link Product}</b>（位于
     * {@code com.vgamepop.android.asdk.core.net.entity}，由 ASDK
     * 定义；字段以官方 AAR 版本为准，常用 getter 如下，便于对账与展示）：
     * <ul>
     * <li>{@code getId()} — 商品/Sku ID，与瑞雪订单 ext 中 {@code third_tag}/{@code product_id} 对应，用于
     * {@link ASDKManager#purchaseProduct}。</li>
     * <li>{@code getName()} — 商品显示名称（本地化以 ASDK 为准）。</li>
     * <li>{@code getPrice()} — 价格数值字符串或格式串（以 ASDK 实现为准）。</li>
     * <li>{@code getUnit()} — 价格货币单位/符号，与 getPrice 组合用于 UI 展示。</li>
     * </ul>
     * <p>
     * <b>回调 {@link ValueGetListener}</b>（{@code com.vgamepop.android.asdk.base}）：
     * <ul>
     * <li>{@code onSucceed(List<Product> value)} — 成功；可能为空列表，表示无配置商品。</li>
     * <li>{@code onFailed(Throwable throwable)} — 失败；网络/未初始化等，勿为空时可取
     * {@link Throwable#getMessage()}。</li>
     * </ul>
     * 注意：是否回调在 UI 线程以 ASDK 行为为准，更新 Activity UI 时建议
     * {@code activity.runOnUiThread(...)}。
     *
     * @param listener 非空；接收商品列表或失败信息
     * @see ASDKManager#getProducts(ValueGetListener)
     * @see com.vgamepop.android.asdk.core.net.entity.Product
     */
    public void getProductsInfo(@NonNull ValueGetListener<List<Product>> listener) {
        if (!ensureAsdkReady(appContext, null, "getProductsInfo(all)")) {
            listener.onFailed(new IllegalStateException(
                    "ASDK not initialized before getProductsInfo(all). Check apkpure_appid and VGamePop console package+SHA1 signature."));
            return;
        }
        ASDKManager.getProducts(listener);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(ValueGetListener)}.
     */
    @Deprecated
    public void getProducts(@NonNull ValueGetListener<List<Product>> listener) {
        getProductsInfo(listener);
    }

    /**
     * 按商品 ID 列表向 VGamePop ASDK 拉取指定 Sku 的商品信息（如后台已配置、仅需校验部分
     * product_id）。
     * <p>
     * {@code productIds} 中每一项应与瑞雪支付下单时 ext 的 {@code third_tag}/{@code product_id} 及
     * {@link Product#getId()} 使用同一套 ID 体系。
     * <p>
     * {@link Product} 与 {@link ValueGetListener} 的字段/回调说明同
     * {@link #getProductsInfo(ValueGetListener)}。
     *
     * @param productIds 非空、非空列表；每一项为单个商品 Sku/商品 ID
     * @param listener   同 {@link #getProductsInfo(ValueGetListener)}
     * @see ASDKManager#getProducts(java.util.List, ValueGetListener)
     */
    public void getProductsInfo(@NonNull List<String> productIds, @NonNull ValueGetListener<List<Product>> listener) {
        if (!ensureAsdkReady(appContext, null, "getProductsInfo(partial)")) {
            listener.onFailed(new IllegalStateException(
                    "ASDK not initialized before getProductsInfo(partial). Check apkpure_appid and VGamePop console package+SHA1 signature."));
            return;
        }
        ASDKManager.getProducts(productIds, listener);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, ValueGetListener)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> productIds, @NonNull ValueGetListener<List<Product>> listener) {
        getProductsInfo(productIds, listener);
    }
}
