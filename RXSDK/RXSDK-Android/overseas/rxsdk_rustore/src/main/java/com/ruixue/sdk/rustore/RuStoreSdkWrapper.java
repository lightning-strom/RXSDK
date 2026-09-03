package com.ruixue.sdk.rustore;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.utils.JSONUtil;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.json.JSONArray;
import org.json.JSONObject;

import ru.rustore.sdk.core.tasks.Task;
import ru.rustore.sdk.pay.RuStorePayClient;
import ru.rustore.sdk.pay.model.PurchaseAvailabilityResult;
import ru.rustore.sdk.pay.model.Product;
import ru.rustore.sdk.pay.model.ProductId;
import ru.rustore.sdk.pay.model.SdkTheme;
import ru.rustore.sdk.pay.model.UserAuthorizationStatus;
import ru.rustore.sdk.review.RuStoreReviewManager;
import ru.rustore.sdk.review.RuStoreReviewManagerFactory;

public class RuStoreSdkWrapper extends PluginSdk {

    public static final String NAME = RuStoreBillingHelper.HQ_TYPE;
    private static final String TAG = "RuStore";

    private final RuStoreBillingImpl mBilling;

    static class Single {
        static final RuStoreSdkWrapper INSTANCE = new RuStoreSdkWrapper();
    }

    private RuStoreSdkWrapper() {
        mBilling = new RuStoreBillingImpl();
    }

    public static RuStoreSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        RXLogger.i(TAG, "init paramsMap=" + paramsMap);
        if (callback != null) callback.onSuccess(null);
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(HQType.KEY) || Objects.equals(hashMap.get(HQType.KEY), NAME)) {
            mBilling.pay(activity, hashMap, callback);
            return true;
        }
        return false;
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        // RuStore Pay 10.5.0：仅在冷启动首次 onCreate 时处理 deeplink，避免旋转屏幕重复还原支付页
        if (savedInstanceState == null) {
            proceedPayIntent(intentFrom(activity));
        }
    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        proceedPayIntent(intent);
    }

    /**
     * 透传 RuStore Pay deeplink 至 {@code IntentInteractor.proceedIntent()}，
     * 用于 SBP / SberPay 等银行 App 支付完成后回跳并还原支付页。
     * <p>
     * 宿主 Activity 须配置 {@code sdk_pay_scheme_value}、{@code launchMode="singleTop"} 及
     * VIEW intent-filter；并在 {@code onCreate}/{@code onNewIntent} 调用本 SDK 生命周期方法
     * （或通过 {@code RuiXueSdk.onCreate/onNewIntent} 自动分发）。
     */
    public void proceedPayIntent(@Nullable Intent intent) {
        if (intent == null) {
            return;
        }
        try {
            RuStorePayClient.Companion.getInstance().getIntentInteractor()
                    .proceedIntent(intent, SdkTheme.LIGHT);
        } catch (Throwable e) {
            RXLogger.e(TAG, "proceedPayIntent error: " + e.getMessage());
        }
    }

    @Nullable
    private static Intent intentFrom(@NonNull Activity activity) {
        return activity.getIntent();
    }

    /**
     * 查询支付可用性（建议在支付前调用，或在游戏启动时预热）。
     * <p>
     * 成功：{@link PurchaseAvailabilityResult.Available} → 回调 {@code onSuccess}；
     * 不可用：{@link PurchaseAvailabilityResult.Unavailable} → {@code onFailed}，
     * {@code data} 可读 {@code reason}/{@code cause} 字段。
     */
    public void getPurchaseAvailability(@Nullable RXJSONCallback callback) {
        try {
            RuStorePayClient.Companion.getInstance().getPurchaseInteractor()
                    .getPurchaseAvailability()
                    .addOnSuccessListener(result -> {
                        if (callback == null) return;
                        if (result instanceof PurchaseAvailabilityResult.Available) {
                            callback.onSuccess(null);
                        } else if (result instanceof PurchaseAvailabilityResult.Unavailable) {
                            Throwable cause = ((PurchaseAvailabilityResult.Unavailable) result).getCause();
                            JSONObject data = JSONUtil.toJSONObject(
                                    RXErrorCode.THIRD_INIT_ERROR.getValue(),
                                    RuStoreBillingHelper.resolveMsg(cause));
                            try {
                                data.put("reason", cause == null ? null : cause.getClass().getSimpleName());
                            } catch (Exception ignored) {
                            }
                            callback.onFailed(data);
                        }
                    })
                    .addOnFailureListener(throwable -> {
                        RXLogger.e(TAG, "getPurchaseAvailability failed: " + throwable.getMessage());
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(
                                    RXErrorCode.THIRD_INIT_ERROR.getValue(),
                                    RuStoreBillingHelper.resolveMsg(throwable)));
                        }
                    });
        } catch (Throwable e) {
            RXLogger.e(TAG, "getPurchaseAvailability error: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage()));
            }
        }
    }

    /**
     * 查询 RuStore 当前的用户登录态，可用于支付前引导登录。
     * <p>
     * 成功时 {@code data.status} 为 {@code AUTHORIZED} / {@code UNAUTHORIZED}。
     */
    public void getUserAuthorizationStatus(@Nullable RXJSONCallback callback) {
        try {
            RuStorePayClient.Companion.getInstance().getUserInteractor()
                    .getUserAuthorizationStatus()
                    .addOnSuccessListener(status -> {
                        if (callback == null) return;
                        JSONObject data = new JSONObject();
                        try {
                            data.put("status", status == null
                                    ? UserAuthorizationStatus.UNAUTHORIZED.name() : status.name());
                        } catch (Exception ignored) {
                        }
                        callback.onSuccess(data);
                    })
                    .addOnFailureListener(throwable -> {
                        RXLogger.e(TAG, "getUserAuthorizationStatus failed: " + throwable.getMessage());
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(
                                    RXErrorCode.THIRD_INIT_ERROR.getValue(),
                                    RuStoreBillingHelper.resolveMsg(throwable)));
                        }
                    });
        } catch (Throwable e) {
            RXLogger.e(TAG, "getUserAuthorizationStatus error: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage()));
            }
        }
    }

    /**
     * 查询商品信息。
     * <p>
     * 入参为商品 ID 列表（通常对应业务侧 SKU/third_tag），
     * 成功后回调：
     * <pre>
     * {
     *   "products": [ ... ]
     * }
     * </pre>
     * 各商品字段由 RuStore SDK 返回对象反射展开（不同 SDK 版本字段名可能略有差异）。
     */
    public void getProductsInfo(@NonNull List<String> productIds, @Nullable RXJSONCallback callback) {
        if (productIds.isEmpty()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                        "productIds is empty"));
            }
            return;
        }
        try {
            List<ProductId> ruStoreProductIds = new ArrayList<>();
            for (String id : productIds) {
                if (id != null && !id.trim().isEmpty()) {
                    ruStoreProductIds.add(new ProductId(id.trim()));
                }
            }
            if (ruStoreProductIds.isEmpty()) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(
                            RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                            "all productIds are blank"));
                }
                return;
            }

            Task<List<Product>> task = RuStorePayClient.Companion.getInstance()
                    .getProductInteractor()
                    .getProducts(ruStoreProductIds);
            task.addOnSuccessListener(result -> {
                        if (callback == null) return;
                        JSONObject data = new JSONObject();
                        try {
                            data.put("products", toJsonArray(result));
                        } catch (Exception ignored) {
                        }
                        callback.onSuccess(data);
                    })
                    .addOnFailureListener(throwable -> {
                        RXLogger.e(TAG, "getProductsInfo failed: " + resolveThrowableMessage(throwable));
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(
                                    RXErrorCode.THIRD_PAY_ERROR.getValue(),
                                    resolveThrowableMessage(throwable)));
                        }
                    });
        } catch (Throwable e) {
            RXLogger.e(TAG, "getProductsInfo error: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.THIRD_PAY_ERROR.getValue(),
                        e.getMessage()));
            }
        }
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, RXJSONCallback)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> productIds, @Nullable RXJSONCallback callback) {
        getProductsInfo(productIds, callback);
    }

    /**
     * RuStore 应用内评分。
     * 流程：requestReviewFlow → launchReviewFlow，与 Google Play Review 一致。
     */
    public void alertAppReview(Activity activity, RXJSONCallback callback) {
        try {
            RuStoreReviewManager manager = RuStoreReviewManagerFactory.INSTANCE.create(activity);
            manager.requestReviewFlow()
                    .addOnSuccessListener(reviewInfo -> {
                        manager.launchReviewFlow(reviewInfo)
                                .addOnSuccessListener(result -> {
                                    if (callback != null) callback.onSuccess(null);
                                })
                                .addOnFailureListener(throwable -> {
                                    if (callback != null) {
                                        callback.onFailed(JSONUtil.toJSONObject(
                                                RXErrorCode.UNKNOWN_ERROR.getValue(),
                                                throwable.getMessage()));
                                    }
                                });
                    })
                    .addOnFailureListener(throwable -> {
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(
                                    RXErrorCode.UNKNOWN_ERROR.getValue(),
                                    throwable.getMessage()));
                        }
                    });
        } catch (Exception e) {
            RXLogger.e(TAG, "alertAppReview error: " + e.getMessage());
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.UNKNOWN_ERROR.getValue(), e.getMessage()));
            }
        }
    }

    private static JSONArray toJsonArray(@Nullable Object result) {
        JSONArray array = new JSONArray();
        if (result == null) {
            return array;
        }
        if (result instanceof Iterable) {
            for (Object item : (Iterable<?>) result) {
                array.put(toJsonObject(item));
            }
            return array;
        }
        if (result.getClass().isArray()) {
            int len = Array.getLength(result);
            for (int i = 0; i < len; i++) {
                array.put(toJsonObject(Array.get(result, i)));
            }
            return array;
        }
        array.put(toJsonObject(result));
        return array;
    }

    private static JSONObject toJsonObject(@Nullable Object bean) {
        JSONObject obj = new JSONObject();
        if (bean == null) {
            return obj;
        }
        for (Method method : bean.getClass().getMethods()) {
            if (method.getParameterTypes().length != 0) continue;
            String name = method.getName();
            if ("getClass".equals(name)) continue;
            String key = null;
            if (name.startsWith("get") && name.length() > 3) {
                key = Character.toLowerCase(name.charAt(3)) + name.substring(4);
            } else if (name.startsWith("is") && name.length() > 2) {
                key = Character.toLowerCase(name.charAt(2)) + name.substring(3);
            }
            if (key == null || key.isEmpty()) continue;
            try {
                Object value = method.invoke(bean);
                obj.put(key, toJsonValue(value));
            } catch (Exception ignored) {
            }
        }
        return obj;
    }

    private static Object toJsonValue(@Nullable Object value) {
        if (value == null) return JSONObject.NULL;
        if (value instanceof Number || value instanceof Boolean || value instanceof String) return value;
        if (value instanceof Iterable) {
            JSONArray array = new JSONArray();
            for (Object item : (Iterable<?>) value) {
                array.put(toJsonValue(item));
            }
            return array;
        }
        if (value.getClass().isArray()) {
            JSONArray array = new JSONArray();
            int len = Array.getLength(value);
            for (int i = 0; i < len; i++) {
                array.put(toJsonValue(Array.get(value, i)));
            }
            return array;
        }
        return String.valueOf(value);
    }

    private static String resolveThrowableMessage(@Nullable Object throwable) {
        if (throwable instanceof Throwable) {
            String msg = ((Throwable) throwable).getMessage();
            return msg == null ? throwable.getClass().getSimpleName() : msg;
        }
        return String.valueOf(throwable);
    }
}
