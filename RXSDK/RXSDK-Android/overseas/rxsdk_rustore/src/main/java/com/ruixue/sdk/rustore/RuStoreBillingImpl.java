package com.ruixue.sdk.rustore;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQParams;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import ru.rustore.sdk.pay.RuStorePayClient;
import ru.rustore.sdk.pay.callback.PurchaseEventListener;
import ru.rustore.sdk.pay.model.DeveloperPayload;
import ru.rustore.sdk.pay.model.InvoiceId;
import ru.rustore.sdk.pay.model.OrderId;
import ru.rustore.sdk.pay.model.PreferredPurchaseType;
import ru.rustore.sdk.pay.model.ProductId;
import ru.rustore.sdk.pay.model.ProductPurchaseParams;
import ru.rustore.sdk.pay.model.ProductPurchaseResult;
import ru.rustore.sdk.pay.model.PurchaseAvailabilityResult;
import ru.rustore.sdk.pay.model.PurchaseId;
import ru.rustore.sdk.pay.model.SdkTheme;

/**
 * RuStore 支付实现（对接 Pay SDK 10.5.0）。
 * <p>
 * 接入步骤：
 * <ol>
 *     <li>支付前通过 {@link #getPurchaseAvailability} 校验渠道是否可用，将 SDK 级别错误提前暴露。</li>
 *     <li>下单成功后拿 {@code third_tag} 作为 RuStore 的 {@code productId}；
 *         {@code orderNo} 同时填到 {@link OrderId} 与 {@link DeveloperPayload}，
 *         便于服务端对账与掉单补单。</li>
 *     <li>一次性商品与订阅均走 {@link PreferredPurchaseType#ONE_STEP}（订阅当前仅支持 ONE_STEP）。</li>
 *     <li>过程埋点通过 {@link PurchaseEventListener} 上报 {@code #rxsdk_notify} 各阶段状态。</li>
 *     <li>用户关闭支付弹窗 → {@link RXErrorCode#PAY_CANCEL}，其他失败按异常类型映射。</li>
 * </ol>
 */
public class RuStoreBillingImpl extends BillingClient {

    private static final String TAG = "RuStore";

    /**
     * 默认走服务端回调（RuStore 通过 webhook 通知游戏服务端对账发货），
     * 客户端仅负责拉起支付 UI 与结果告知；如需客户端校验走 {@link HQParams#CALLBACK_FROM_CLIENT}，
     * 由业务层在参数中显式设置 {@code callback_from=1} 覆盖。
     */
    private int callFrom = RuStoreBillingHelper.CALLBACK_FROM_SERVER;

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null) {
            if (!hashMap.containsKey(KEY_HQ_TYPE)) {
                hashMap.put(KEY_HQ_TYPE, RuStoreBillingHelper.HQ_TYPE);
            }
            callFrom = ObjectUtils.toInt(hashMap.get("callback_from"), callFrom);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap,
                                   JSONObject data, RXJSONCallback callback) {
        RuStoreOrderData order = RuStoreOrderData.fromJson(data);
        if (order == null || order.getExt() == null) {
            callback.onFailed(JSONUtil.toJSONObject(
                    RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                    "RuStore order data or ext is null"));
            return;
        }

        String productId = order.getExt().getThird_tag();
        if (TextUtils.isEmpty(productId)) {
            callback.onFailed(JSONUtil.toJSONObject(
                    RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                    "RuStore product id (third_tag) is null"));
            return;
        }

        final boolean isSubscribe = order.isSubscribe();
        final String orderNo = order.getOrderNo();

        RuStorePayClient.Companion.getInstance().getPurchaseInteractor()
                .getPurchaseAvailability()
                .addOnSuccessListener(result -> {
                    if (result instanceof PurchaseAvailabilityResult.Available) {
                        launchPurchase(productId, orderNo, isSubscribe, callback);
                    } else if (result instanceof PurchaseAvailabilityResult.Unavailable) {
                        Throwable cause = ((PurchaseAvailabilityResult.Unavailable) result).getCause();
                        RXLogger.e(TAG, "purchase unavailable: " + RuStoreBillingHelper.resolveMsg(cause));
                        ThreadUtils.getInstance().runOnUiThread(() -> callback.onFailed(
                                RXErrorCode.THIRD_INIT_ERROR.toJSONObject(
                                        RuStoreBillingHelper.resolveSdkCode(cause),
                                        RuStoreBillingHelper.resolveMsg(cause))));
                    }
                })
                .addOnFailureListener(throwable -> {
                    RXLogger.e(TAG, "getPurchaseAvailability failed: " + throwable.getMessage());
                    ThreadUtils.getInstance().runOnUiThread(() -> callback.onFailed(
                            RXErrorCode.THIRD_INIT_ERROR.toJSONObject(
                                    RuStoreBillingHelper.resolveSdkCode(throwable),
                                    RuStoreBillingHelper.resolveMsg(throwable))));
                });
    }

    private void launchPurchase(@NonNull String productId, @Nullable String orderNo,
                                boolean isSubscribe, @NonNull RXJSONCallback rawCallback) {
        ProductPurchaseParams params = new ProductPurchaseParams(
                new ProductId(productId),
                null,
                TextUtils.isEmpty(orderNo) ? null : new OrderId(orderNo),
                TextUtils.isEmpty(orderNo) ? null : new DeveloperPayload(orderNo),
                null,
                null
        );

        RXLogger.i(TAG, "launchPurchase productId=" + productId
                + ", orderNo=" + orderNo + ", subscribe=" + isSubscribe);

        setPaying(true);
        RXJSONCallback callback = RuStoreBillingHelper.wrapPayCallback(
                () -> setPaying(false),
                new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        ThreadUtils.getInstance().runOnUiThread(() -> rawCallback.onSuccess(data));
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        ThreadUtils.getInstance().runOnUiThread(() -> rawCallback.onFailed(cause));
                    }

                    @Override
                    public void onError(RXException e) {
                        ThreadUtils.getInstance().runOnUiThread(() -> rawCallback.onError(e));
                    }
                });

        RuStorePayClient.Companion.getInstance().getPurchaseInteractor()
                .purchase(params, PreferredPurchaseType.ONE_STEP, SdkTheme.LIGHT,
                        new TrackingPurchaseEventListener(orderNo, isSubscribe))
                .addOnSuccessListener(result -> onPurchaseSuccess(result, isSubscribe, callback))
                .addOnFailureListener(throwable -> onPurchaseFailure(throwable, callback));
    }

    private void onPurchaseSuccess(@NonNull ProductPurchaseResult result, boolean isSubscribe,
                                   @NonNull RXJSONCallback callback) {
        RXLogger.i(TAG, "purchase success: purchaseId=" + result.getPurchaseId().getValue()
                + ", invoiceId=" + result.getInvoiceId().getValue()
                + ", subscribe=" + isSubscribe);
        JSONObject successData = buildSuccessData(result, isSubscribe);
        if (callFrom == HQParams.CALLBACK_FROM_CLIENT) {
            callback.onSuccess(successData);
        } else {
            // 服务端回调模式：服务端会通过 RuStore webhook 对账，客户端仅告知成功
            callback.onSuccess(null);
        }
    }

    private void onPurchaseFailure(@NonNull Throwable throwable, @NonNull RXJSONCallback callback) {
        int bizCode = RuStoreBillingHelper.resolveBusinessCode(throwable);
        int sdkCode = RuStoreBillingHelper.resolveSdkCode(throwable);
        String msg = RuStoreBillingHelper.resolveMsg(throwable);
        RXLogger.e(TAG, "purchase failed: bizCode=" + bizCode + ", sdkCode=" + sdkCode + ", msg=" + msg);
        if (bizCode == RXErrorCode.PAY_CANCEL.getValue()) {
            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(sdkCode, msg));
        } else if (bizCode == RXErrorCode.THIRD_INIT_ERROR.getValue()) {
            callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject(sdkCode, msg));
        } else {
            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(sdkCode, msg));
        }
    }

    @Nullable
    private JSONObject buildSuccessData(@NonNull ProductPurchaseResult result, boolean isSubscribe) {
        try {
            JSONObject json = new JSONObject();
            json.put("purchaseId", result.getPurchaseId().getValue());
            json.put("invoiceId", result.getInvoiceId().getValue());
            json.put("productId", result.getProductId().getValue());
            if (result.getOrderId() != null) {
                json.put("orderId", result.getOrderId().getValue());
            }
            json.put("sandbox", result.getSandbox());
            json.put("subscribe", isSubscribe);
            return json;
        } catch (Exception e) {
            RXLogger.e(TAG, "buildSuccessData error: " + e.getMessage());
            return null;
        }
    }

    /**
     * 在购买各阶段上报 {@code #rxsdk_notify} 埋点，和 Google Billing 的 verify 流程字段对齐，
     * 便于跨渠道核对。
     */
    private static final class TrackingPurchaseEventListener implements PurchaseEventListener {

        @Nullable
        private final String orderNo;
        private final boolean isSubscribe;

        TrackingPurchaseEventListener(@Nullable String orderNo, boolean isSubscribe) {
            this.orderNo = orderNo;
            this.isSubscribe = isSubscribe;
        }

        @Override
        public void onPurchaseCreated(@NonNull PurchaseId purchaseId, @NonNull InvoiceId invoiceId) {
            track("purchase_created", purchaseId, invoiceId);
        }

        @Override
        public void onPaymentStarted(@NonNull PurchaseId purchaseId, @NonNull InvoiceId invoiceId) {
            track("payment_started", purchaseId, invoiceId);
        }

        @Override
        public void onPaymentCompleted(@NonNull PurchaseId purchaseId, @NonNull InvoiceId invoiceId) {
            track("payment_completed", purchaseId, invoiceId);
        }

        @Override
        public void onPaymentFailed(@Nullable PurchaseId purchaseId, @Nullable InvoiceId invoiceId) {
            track("payment_failed", purchaseId, invoiceId);
        }

        @Override
        public void onPurchaseCancelled(@Nullable PurchaseId purchaseId, @Nullable InvoiceId invoiceId) {
            track("purchase_cancelled", purchaseId, invoiceId);
        }

        private void track(@NonNull String state, @Nullable PurchaseId purchaseId,
                           @Nullable InvoiceId invoiceId) {
            Map<String, Object> pro = new HashMap<>();
            pro.put("state", state);
            pro.put("hq_type", RuStoreBillingHelper.HQ_TYPE);
            pro.put("subscribe", isSubscribe);
            if (orderNo != null) pro.put("order_no", orderNo);
            if (purchaseId != null) pro.put("purchaseId", purchaseId.getValue());
            if (invoiceId != null) pro.put("invoiceId", invoiceId.getValue());
            RXApiHelper.Data.track("#rxsdk_notify", null, pro, -1, -1);
        }
    }
}
