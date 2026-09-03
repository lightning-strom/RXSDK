package com.ruixue.sdk.rustore;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;

import org.json.JSONObject;

import ru.rustore.sdk.core.exception.RuStoreApplicationBannedException;
import ru.rustore.sdk.core.exception.RuStoreConnectionTimeout;
import ru.rustore.sdk.core.exception.RuStoreException;
import ru.rustore.sdk.core.exception.RuStoreNotInstalledException;
import ru.rustore.sdk.core.exception.RuStoreOutdatedException;
import ru.rustore.sdk.core.exception.RuStoreServiceUnavailableException;
import ru.rustore.sdk.core.exception.RuStoreUserBannedException;
import ru.rustore.sdk.core.exception.RuStoreUserUnauthorizedException;
import ru.rustore.sdk.pay.model.RuStorePaymentException;

/**
 * RuStore Pay SDK 10.x 错误与回调的公共工具。
 * <p>
 * 错误映射策略：
 * <ul>
 *     <li>用户关闭支付弹窗 → {@link RXErrorCode#PAY_CANCEL}</li>
 *     <li>RuStore 未安装 / 版本过低 / 未登录 / 被封禁 → {@link RXErrorCode#THIRD_INIT_ERROR}</li>
 *     <li>网络 / 其他支付异常 → {@link RXErrorCode#THIRD_PAY_ERROR}</li>
 * </ul>
 */
final class RuStoreBillingHelper {

    private RuStoreBillingHelper() {}

    static final String HQ_TYPE = "rustore";

    /**
     * 服务端回调模式：支付成功后由 RuStore 的 webhook 通知我方服务端对账发货，
     * 客户端侧仅回调"支付成功"事件、不携带 purchaseId/invoiceId 等敏感字段。
     * <p>
     * 与 {@link com.ruixue.billing.HQParams#CALLBACK_FROM_CLIENT CALLBACK_FROM_CLIENT=1}
     * 区分；当前基类里 0 值常量被注释掉，这里本地声明避免魔法数字。
     */
    static final int CALLBACK_FROM_SERVER = 0;

    /**
     * 用户关闭支付弹窗（未收到明确结果，状态不确定，建议后续调
     * {@code PurchaseInteractor.getPurchase} 补查状态）。
     */
    static boolean isUserCanceled(@Nullable Throwable t) {
        return t instanceof RuStorePaymentException.ProductPurchaseCancelled;
    }

    /**
     * 识别属于"初始化/环境"类错误，宿主应引导用户解决（安装、升级、登录）。
     */
    static boolean isInitError(@Nullable Throwable t) {
        return t instanceof RuStoreNotInstalledException
                || t instanceof RuStoreOutdatedException
                || t instanceof RuStoreUserUnauthorizedException
                || t instanceof RuStoreApplicationBannedException
                || t instanceof RuStoreUserBannedException
                || t instanceof RuStorePaymentException.RuStorePayClientNotCreated
                || t instanceof RuStorePaymentException.RuStorePayInvalidConsoleAppId
                || t instanceof RuStorePaymentException.ApplicationSchemeWasNotProvided;
    }

    /**
     * 映射为业务侧错误码。
     */
    static int resolveBusinessCode(@Nullable Throwable t) {
        if (isUserCanceled(t)) {
            return RXErrorCode.PAY_CANCEL.getValue();
        }
        if (isInitError(t)) {
            return RXErrorCode.THIRD_INIT_ERROR.getValue();
        }
        return RXErrorCode.THIRD_PAY_ERROR.getValue();
    }

    /**
     * 统一描述文案：优先使用 SDK 的 message，缺失时回落到类名，便于日志定位。
     */
    static String resolveMsg(@Nullable Throwable t) {
        if (t == null) {
            return "RuStore unknown error";
        }
        String msg = t.getMessage();
        if (!TextUtils.isEmpty(msg)) {
            return msg;
        }
        Throwable cause = t.getCause();
        if (cause != null && !TextUtils.isEmpty(cause.getMessage())) {
            return cause.getMessage();
        }
        return t.getClass().getSimpleName();
    }

    /**
     * 读取 SDK 自身错误码（网络异常会带 code）；其余类型暂无数值码，统一返回 0。
     */
    static int resolveSdkCode(@Nullable Throwable t) {
        if (t instanceof RuStorePaymentException.RuStorePaymentNetworkException) {
            String code = ((RuStorePaymentException.RuStorePaymentNetworkException) t).getCode();
            try {
                return TextUtils.isEmpty(code) ? 0 : Integer.parseInt(code);
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }
        if (t instanceof RuStoreConnectionTimeout) {
            return -1;
        }
        if (t instanceof RuStoreServiceUnavailableException) {
            return -2;
        }
        if (t instanceof RuStoreException) {
            return -3;
        }
        return 0;
    }

    /**
     * 构造带 {@code setPaying(false)} 的支付回调包装（对齐 Google Billing 风格）。
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
}
