package com.ruixue.sdk.google;

import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;

import org.json.JSONObject;

/**
 * Google Billing（{@link GoogleBillingImpl} / Billing Library 8.x）的
 * 公共常量与工具方法。
 */
final class GoogleBillingHelper {

    private GoogleBillingHelper() {}

    static final String HQ_TYPE_GOOGLE = "google";
    static final int RX_REPEAT_ERR_CODE = 302408;
    static final int RX_USED_ERR_CODE   = 302424;
    static final int RX_ERR_CODE        = 302409;
    static final int SKU_NOT_FOUND_CODE = -4;

    private static final SparseArray<String> BILLING_RESP_MSG = new SparseArray<>();

    static {
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.USER_CANCELED,
                "The user presses the up or cancel dialog box");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE,
                "Network connection disconnected");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.BILLING_UNAVAILABLE,
                "The requested type does not support the AIDL version of the Google Play settlement service");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.ITEM_UNAVAILABLE,
                "The requested item is no longer for sale");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.DEVELOPER_ERROR,
                "Invalid parameter supplied to API. This error may also indicate that the application "
                        + "has not signed or set up properly for the Google Play settlement service, "
                        + "or that it lacks the necessary permissions in its manifest");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.ERROR,
                "A serious error occurred during the API operation");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.NETWORK_ERROR,
                "Network connection error");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED,
                "Unable to purchase because you already own the item");
        BILLING_RESP_MSG.put(BillingClient.BillingResponseCode.ITEM_NOT_OWNED,
                "Fail to consume because you do not already own the good");
    }

    static String resolveMsg(int code, @Nullable String debugMsg) {
        String mapped = BILLING_RESP_MSG.get(code);
        if (!TextUtils.isEmpty(mapped)) {
            return mapped;
        }
        return TextUtils.isEmpty(debugMsg) ? "Google Billing error" : debugMsg;
    }

    static boolean isUserCanceled(int code) {
        return code == BillingClient.BillingResponseCode.USER_CANCELED;
    }

    /**
     * 构造带 {@code setPaying(false)} 的支付回调包装。
     */
    static RXJSONCallback wrapPayCallback(@NonNull Runnable clearPaying, @NonNull RXJSONCallback delegate) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                clearPaying.run();
                delegate.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                clearPaying.run();
                delegate.onFailed(cause);
            }

            @Override
            public void onError(RXException e) {
                clearPaying.run();
                delegate.onError(e);
            }
        };
    }

    interface OnBillingConnectionCallback {
        void onSuccess();
        void onFailed(int code, String msg);
    }
}
