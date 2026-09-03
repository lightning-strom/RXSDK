package com.ruixue.sdk.apkpure;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;
import com.vgamepop.android.asdk.base.PublicPurchaseListener;
import com.vgamepop.android.asdk.core.ASDKManager;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ApkpureBillingImpl extends BillingClient {

    private static final String TAG = "ApkpureBilling";
    private static final String HQ_TYPE = "apkpure";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        hashMap.put(KEY_HQ_TYPE, HQ_TYPE);
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap,
                                   JSONObject data, RXJSONCallback callback) {
        ApkpureOrderData orderData = ApkpureOrderData.fromJson(data);
        if (orderData == null || orderData.getExt() == null) {
            RXLogger.e(TAG, "onOrderResponse: order data or ext is null, data=" + data);
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(),
                    "pay order or ext data is null"));
            return;
        }

        String productId = orderData.getExt().getProductId();
        String orderId = orderData.getOrderNo();

        if (TextUtils.isEmpty(productId)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                    "ext.third_tag / product_id is empty"));
            return;
        }
        if (TextUtils.isEmpty(orderId)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                    "orderNo is null"));
            return;
        }

        Map<String, String> extInfo = new HashMap<>();
        String transmitArgs = orderData.getTransmitArgs();
        if (!TextUtils.isEmpty(transmitArgs)) {
            extInfo.put("transmit_args", transmitArgs);
        }

        RXLogger.i(TAG, "purchaseProduct orderId=" + orderId + ", productId=" + productId);

        try {
            if (!ASDKManager.INSTANCE.hasInit()) {
                String msg = "VGamePop ASDK not initialized (hasInit=false). Often Incorrect signature: "
                        + "register package name + signing cert SHA1 for this apkpure_appid in VGamePop console.";
                RXLogger.e(TAG, msg);
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR.getValue(), msg));
                return;
            }
        } catch (Throwable t) {
            RXLogger.e(TAG, "ASDK hasInit check failed: " + t.getMessage());
        }

        ASDKManager.purchaseProduct(
                activity,
                orderId,
                productId,
                extInfo,
                new PublicPurchaseListener() {
                    @Override
                    public void onSucceed(@NonNull String resultOrderId) {
                        RXLogger.i(TAG, "purchaseProduct success, orderId=" + resultOrderId);
                        bringHostActivityToFront(activity);
                        JSONObject result = new JSONObject();
                        try {
                            result.put("orderId", resultOrderId);
                        } catch (Exception ignored) {
                        }
                        callback.onSuccess(result);
                    }

                    @Override
                    public void onFailed(@NonNull Throwable error) {
                        String errMsg = error.getMessage() != null ? error.getMessage() : "Unknown error";
                        String errClass = error.getClass().getSimpleName();
                        RXLogger.e(TAG, "purchaseProduct failed: " + errClass + " - " + errMsg);
                        bringHostActivityToFront(activity);

                        if (errClass.contains("Cancel")) {
                            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(-1, errMsg));
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(-1, errMsg));
                        }
                    }
                }
        );
    }

    private static void bringHostActivityToFront(Activity activity) {
        if (activity == null || activity.isFinishing()) {
            return;
        }
        try {
            Intent intent = new Intent(activity, activity.getClass());
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            activity.startActivity(intent);
        } catch (Throwable t) {
            RXLogger.e(TAG, "bring host activity to front failed: " + t.getMessage());
        }
    }
}
