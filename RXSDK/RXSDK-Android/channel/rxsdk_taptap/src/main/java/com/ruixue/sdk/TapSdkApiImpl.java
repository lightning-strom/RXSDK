package com.ruixue.sdk;

import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;
import com.taptap.sdk.compliance.TapTapCompliance;
import com.taptap.sdk.compliance.TapTapComplianceCallback;
import com.taptap.sdk.compliance.bean.CheckPaymentResult;
import com.taptap.sdk.compliance.constants.ComplianceMessage;
import com.taptap.sdk.compliance.option.TapTapComplianceOptions;
import com.taptap.sdk.core.TapTapRegion;
import com.taptap.sdk.core.TapTapSdk;
import com.taptap.sdk.core.TapTapSdkOptions;
import com.taptap.sdk.kit.internal.callback.TapTapCallback;
import com.taptap.sdk.kit.internal.exception.TapTapException;
import com.taptap.sdk.login.AccessToken;
import com.taptap.sdk.login.TapTapAccount;
import com.taptap.sdk.login.TapTapLogin;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import kotlinx.serialization.json.JsonElement;

public class TapSdkApiImpl extends RXSdkApi {

    private static final String SCOPE_PUBLIC_PROFILE = "public_profile";

    private final String[] PLUGIN_NAME = new String[]{"RX_PLUGIN_PAY_UNIFYPAY", "RX_PLUGIN_HQ", "RX_PLUGIN_PAY_SUNING", "RX_PLUGIN_ALIAUTH", "RX_PLUGIN_WECHAT"};
    private final AtomicBoolean isInited = new AtomicBoolean(false);
    private final AtomicBoolean complianceCallbackRegistered = new AtomicBoolean(false);

    @Nullable
    private volatile RXJSONCallback pendingComplianceLoginCallback;
    @Nullable
    private volatile TapTapAccount pendingComplianceAccount;

    private final TapTapComplianceCallback complianceCallback = new TapTapComplianceCallback() {
        @Override
        public void onComplianceResult(int code, @Nullable Map<String, ?> extra) {
            handleComplianceResult(code, extra);
        }
    };

    static class Single {
        final static TapSdkApiImpl INSTANCE = new TapSdkApiImpl();
    }

    protected TapSdkApiImpl() {
    }

    @NonNull
    public static TapSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity, savedInstanceState);
        for (String pluginName : PLUGIN_NAME) {
            String className = AppUtils.getAppMetaData(activity, pluginName);
            if (!TextUtils.isEmpty(className)) {
                registerPlugin(className);
            }
        }
        RXLogger.i("rxsdk plugin loaded: " + getPlugins().keySet());
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("taptap").setVersion(RuiXueSdk.getSdkVersion()).setPlugins(getPlugins().keySet().toString()).build();
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        String clientId = map == null ? null : (String) map.get("client_id");
        String clientToken = map == null ? null : (String) map.get("client_token");
        if (TextUtils.isEmpty(clientId) || TextUtils.isEmpty(clientToken)) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), "TapTap v4 requires client_id and client_token"));
            }
            return;
        }

        int region = resolveRegion(map);
        TapTapSdkOptions options = new TapTapSdkOptions(clientId, clientToken, region);
        options.setEnableLog(RXGlobalData.isDebugEnable());
        boolean showSwitchAccount = ObjectUtils.toBoolean(map.get("compliance_show_switch_account"), true);
        boolean useAgeRange = ObjectUtils.toBoolean(map.get("compliance_use_age_range"), true);
        TapTapComplianceOptions complianceOptions = new TapTapComplianceOptions(showSwitchAccount, useAgeRange);

        ThreadUtils.getInstance().runOnUiThread(() -> {
            try {
                TapTapSdk.init(activity.getApplicationContext(), options, complianceOptions);
                isInited.set(true);
                registerComplianceCallbackIfNeeded();
                super.initThirdSdk(activity, map, callback);
            } catch (Exception e) {
                isInited.set(false);
                if (callback != null) {
                    callback.onError(new RXException(RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage(), e));
                }
            }
        });
    }

    private void registerComplianceCallbackIfNeeded() {
        if (complianceCallbackRegistered.get()) {
            return;
        }
        TapTapCompliance.registerComplianceCallback(complianceCallback);
        complianceCallbackRegistered.set(true);
        RXLogger.i("TapTap compliance callback registered");
    }

    private void handleComplianceResult(int code, @Nullable Map<String, ?> extra) {
        RXLogger.i("TapTap compliance callback code=" + code + ", extra=" + extra);
        RXJSONCallback loginCallback = pendingComplianceLoginCallback;
        TapTapAccount account = pendingComplianceAccount;

        if (code == ComplianceMessage.LOGIN_SUCCESS) {
            if (loginCallback != null && account != null) {
                clearPendingComplianceLogin();
                loginCallback.onSuccess(buildLoginResult(account));
            }
            return;
        }

        if (loginCallback != null) {
            clearPendingComplianceLogin();
            if (code == ComplianceMessage.EXITED || code == ComplianceMessage.SWITCH_ACCOUNT || code == ComplianceMessage.REAL_NAME_STOP) {
                loginCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
            } else {
                String message = "TapTap compliance blocked login, code=" + code;
                loginCallback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), message));
            }
            return;
        }

        if (code == ComplianceMessage.EXITED || code == ComplianceMessage.SWITCH_ACCOUNT) {
            TapTapLogin.logout();
        }
        if (antiAddictDelegate != null && isComplianceRestrictCode(code)) {
            antiAddictDelegate.didAddictInfoUpdate(String.valueOf(code));
        }
    }

    private static boolean isComplianceRestrictCode(int code) {
        return code == ComplianceMessage.PERIOD_RESTRICT || code == ComplianceMessage.DURATION_LIMIT || code == ComplianceMessage.AGE_LIMIT || code == ComplianceMessage.EXITED || code == ComplianceMessage.SWITCH_ACCOUNT;
    }

    private void clearPendingComplianceLogin() {
        pendingComplianceLoginCallback = null;
        pendingComplianceAccount = null;
    }

    private static int resolveRegion(@Nullable Map<String, Object> map) {
        if (map == null || !map.containsKey("region")) {
            return TapTapRegion.CN;
        }
        String region = String.valueOf(map.get("region")).trim().toLowerCase();
        if ("global".equals(region) || "io".equals(region) || "overseas".equals(region)) {
            return TapTapRegion.GLOBAL;
        }
        return TapTapRegion.CN;
    }

    @Override
    public boolean isLogin() {
        try {
            return TapTapLogin.getCurrentTapAccount() != null;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void login(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        if (!map.containsKey(KEY_LOGIN_METHOD)) {
            map.put(KEY_LOGIN_METHOD, LoginMethod.TAPTAP);
        }
        super.login(activity, map, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        if (!Objects.equals(map.get("method"), LoginMethod.TAPTAP)) {
            return super.thirdLogin(activity, map, callback);
        }
        if (!isInited.get()) {
            if (callback != null) {
                callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject());
            }
            return true;
        }

        String scopes = (String) map.get("scopes");
        String[] scopeArray = scopes != null && scopes.length() > 0 ? scopes.split(",") : new String[]{SCOPE_PUBLIC_PROFILE};

        TapTapLogin.loginWithScopes(activity, scopeArray, new TapTapCallback<TapTapAccount>() {
            @Override
            public void onSuccess(TapTapAccount account) {
                RXLogger.d("TapTap authorization succeed");
                startComplianceAfterLogin(activity, account, callback);
            }

            @Override
            public void onCancel() {
                RXLogger.d("TapTap authorization cancelled");
                if (callback != null) {
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
                }
            }

            @Override
            public void onFail(TapTapException exception) {
                String message = exception == null ? "TapTap login failed" : exception.getMessage();
                RXLogger.d("TapTap authorization failed. cause: " + message);
                if (callback != null) {
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), message));
                }
            }
        });
        return true;
    }

    private void startComplianceAfterLogin(@NonNull Activity activity, @Nullable TapTapAccount account, @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        if (account == null || TextUtils.isEmpty(account.getOpenId())) {
            callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), "TapTap openId is empty"));
            return;
        }
        pendingComplianceAccount = account;
        pendingComplianceLoginCallback = callback;
        ThreadUtils.getInstance().runOnUiThread(() -> TapTapCompliance.startup(activity, account.getOpenId()));
    }

    @NonNull
    private static JSONObject buildLoginResult(@Nullable TapTapAccount account) {
        Map<String, Object> extMap = new HashMap<>();
        if (account != null) {
            AccessToken token = account.getAccessToken();
            if (token != null) {
                extMap.put("access_token", token.getKid());
                extMap.put("mac_key", token.getMacKey());
                extMap.put("mac_algorithm", token.getMacAlgorithm());
                extMap.put("token_type", token.getTokenType());
                Set<String> scopeSet = token.getScopes();
                if (scopeSet != null && !scopeSet.isEmpty()) {
                    StringBuilder scopesBuilder = new StringBuilder();
                    for (String scope : scopeSet) {
                        if (scopesBuilder.length() > 0) {
                            scopesBuilder.append(',');
                        }
                        scopesBuilder.append(scope);
                    }
                    extMap.put("scopes", scopesBuilder.toString());
                }
            }
            extMap.put("open_id", account.getOpenId());
            extMap.put("union_id", account.getUnionId());
            extMap.put("nickname", account.getName());
            int ageRange = TapTapCompliance.getAgeRange();
            extMap.put("age_range", ageRange);
            extMap.put("avatar", account.getAvatar());
        }
        return new JSONObject(extMap);
    }

    @Override
    public void ruixueLogin(Map<String, Object> map, RXJSONCallback callback) {
        super.ruixueLogin(map, wrapLoginCallback(callback));
    }

    @Nullable
    private RXJSONCallback wrapLoginCallback(@Nullable RXJSONCallback callback) {
        if (callback == null) {
            return null;
        }
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                applyTapRemainingTimeToLoginResult(data);
                callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(cause);
            }

            @Override
            public void onError(RXException e) {
                callback.onError(e);
            }
        };
    }

    private void applyTapRemainingTimeToLoginResult(@Nullable JSONObject data) {
        if (!isInited.get() || data == null) {
            return;
        }
        int remainingTime = TapTapCompliance.getRemainingTime();
        try {
            data.put("aas", remainingTime);
        } catch (Exception e) {
            RXLogger.w("TapTap apply remaining time to login result failed: " + e.getMessage());
        }
        LoginData loginData = getLoginData();
        if (loginData != null) {
            loginData.setAas(remainingTime);
        }
    }

    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        clearPendingComplianceLogin();
        TapTapCompliance.exit();
        TapTapLogin.logout();
        return super.thirdLogout(callback);
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!shouldEnforcePaymentLimit(hashMap)) {
            super.pay(activity, hashMap, callback);
            return;
        }
        int amountFen = resolveAmountFen(hashMap, null);
        if (amountFen > 0) {
            checkPaymentLimitAndPay(activity, hashMap, amountFen, callback, null, 0);
            return;
        }
        placeOrderThenCheckAndPay(activity, hashMap, callback);
    }

    @Override
    protected void onSubmitChannelPayment(int amountFen, @NonNull Map<String, Object> reportContext, @Nullable RXJSONCallback callback) {
        if (!isInited.get()) {
            notifyChannelPaymentFailed(callback, RXErrorCode.THIRD_INIT_ERROR, "TapTap SDK not initialized");
            return;
        }
        doSubmitChannelPayment(amountFen, callback);
    }

    @Override
    public void checkChannelPaymentLimit(@Nullable Activity activity, int amountFen, @Nullable RXJSONCallback callback) {
        if (!isInited.get()) {
            notifyChannelPaymentFailed(callback, RXErrorCode.THIRD_INIT_ERROR, "TapTap SDK not initialized");
            return;
        }
        if (activity == null) {
            notifyChannelPaymentFailed(callback, RXErrorCode.ORDER_PARAMS_ERROR, "activity is null");
            return;
        }
        if (amountFen <= 0) {
            notifyChannelPaymentFailed(callback, RXErrorCode.ORDER_PARAMS_ERROR, "amount must be greater than 0, unit is fen");
            return;
        }
        checkChannelPaymentLimitInternal(activity, amountFen, callback, 0);
    }

    private boolean shouldEnforcePaymentLimit(@Nullable Map<String, Object> hashMap) {
        if (!isInited.get()) {
            return false;
        }
        int indulgeAuth = hashMap == null ? BillingClient.PAY_LIMIT_ENABLE : ObjectUtils.toInt(hashMap.get(BillingClient.KEY_PAY_LIMIT_ENABLE), BillingClient.PAY_LIMIT_ENABLE);
        return indulgeAuth != BillingClient.PAY_LIMIT_DISABLE;
    }

    private void placeOrderThenCheckAndPay(@NonNull Activity activity, @NonNull Map<String, Object> hashMap, @Nullable RXJSONCallback callback) {
        Map<String, Object> orderMap = new HashMap<>(hashMap);
        orderMap.put("only_order", true);
        super.pay(activity, orderMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject orderData) {
                int amountFen = resolveAmountFen(orderMap, orderData);
                if (amountFen <= 0) {
                    RXLogger.w("TapTap payment limit skipped: amount unknown after order");
                    proceedPay(activity, hashMap, callback, orderData);
                    return;
                }
                checkPaymentLimitAndPay(activity, hashMap, amountFen, callback, orderData, 0);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                if (callback != null) {
                    callback.onError(e);
                }
            }
        });
    }

    private void checkPaymentLimitAndPay(@NonNull Activity activity, @NonNull Map<String, Object> hashMap, int amountFen, @Nullable RXJSONCallback callback, @Nullable JSONObject orderData, int retryCount) {
        ThreadUtils.getInstance().runOnUiThread(() -> TapTapCompliance.checkPaymentLimit(activity, amountFen, new TapTapCallback<CheckPaymentResult>() {
            @Override
            public void onSuccess(CheckPaymentResult result) {
                if (result != null && result.getStatus()) {
                    proceedPay(activity, hashMap, callback, orderData);
                } else if (callback != null) {
                    callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "TapTap payment limited"));
                }
            }

            @Override
            public void onFail(TapTapException exception) {
                if (retryCount < 3) {
                    checkPaymentLimitAndPay(activity, hashMap, amountFen, callback, orderData, retryCount + 1);
                    return;
                }
                String message = exception == null ? "TapTap check payment limit failed" : exception.getMessage();
                RXLogger.w("TapTap checkPaymentLimit failed: " + message);
                if (callback != null) {
                    callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(RXErrorCode.THIRD_PAY_ERROR.getValue(), message));
                }
            }

            @Override
            public void onCancel() {
                if (callback != null) {
                    callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                }
            }
        }));
    }

    private void proceedPay(@NonNull Activity activity, @NonNull Map<String, Object> hashMap, @Nullable RXJSONCallback callback, @Nullable JSONObject orderData) {
        Map<String, Object> payMap = new HashMap<>(hashMap);
        if (orderData != null) {
            payMap.put("only_pay", true);
            payMap.put("data", orderData);
        }
        super.pay(activity, payMap, callback);
    }

    private void checkChannelPaymentLimitInternal(@NonNull Activity activity, int amountFen, @Nullable RXJSONCallback callback, int retryCount) {
        ThreadUtils.getInstance().runOnUiThread(() -> TapTapCompliance.checkPaymentLimit(activity, amountFen, new TapTapCallback<CheckPaymentResult>() {
            @Override
            public void onSuccess(CheckPaymentResult result) {
                boolean allowed = result != null && result.getStatus();
                JSONObject data = new JSONObject();
                try {
                    data.put("allowed", allowed);
                    data.put("amount", amountFen);
                } catch (Exception e) {
                    RXLogger.w("TapTap checkChannelPaymentLimit build result failed: " + e.getMessage());
                }
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFail(TapTapException exception) {
                if (retryCount < 3) {
                    checkChannelPaymentLimitInternal(activity, amountFen, callback, retryCount + 1);
                    return;
                }
                String message = exception == null ? "TapTap check payment limit failed" : exception.getMessage();
                RXLogger.w("TapTap checkChannelPaymentLimit failed: " + message);
                notifyChannelPaymentFailed(callback, RXErrorCode.THIRD_PAY_ERROR, message);
            }

            @Override
            public void onCancel() {
                notifyChannelPaymentFailed(callback, RXErrorCode.PAY_CANCEL, "TapTap check payment limit cancelled");
            }
        }));
    }

    private void doSubmitChannelPayment(int amountFen, @Nullable RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnUiThread(() -> TapTapCompliance.submitPayment(amountFen, new TapTapCallback<JsonElement>() {
            @Override
            public void onSuccess(JsonElement result) {
                RXLogger.d("TapTap submitChannelPayment succeed, amountFen=" + amountFen);
                if (callback != null) {
                    JSONObject data = new JSONObject();
                    try {
                        data.put("amount", amountFen);
                    } catch (Exception ignored) {
                    }
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFail(TapTapException exception) {
                String message = exception == null ? "TapTap submit payment failed" : exception.getMessage();
                RXLogger.w("TapTap submitChannelPayment failed: " + message);
                notifyChannelPaymentFailed(callback, RXErrorCode.THIRD_PAY_ERROR, message);
            }

            @Override
            public void onCancel() {
                RXLogger.w("TapTap submitChannelPayment cancelled");
                notifyChannelPaymentFailed(callback, RXErrorCode.PAY_CANCEL, "TapTap submit payment cancelled");
            }
        }));
    }

    private static void notifyChannelPaymentFailed(@Nullable RXJSONCallback callback, @NonNull RXErrorCode errorCode, @NonNull String message) {
        if (callback != null) {
            callback.onFailed(errorCode.toJSONObject(errorCode.getValue(), message));
        }
    }

    private static int resolveAmountFen(@Nullable Map<String, Object> map, @Nullable JSONObject orderData) {
        if (orderData != null) {
            int amount = extractAmountFenFromJson(orderData);
            if (amount > 0) {
                return amount;
            }
        }
        if (map == null) {
            return 0;
        }
        Object dataObj = map.get("data");
        if (dataObj instanceof JSONObject) {
            int amount = extractAmountFenFromJson((JSONObject) dataObj);
            if (amount > 0) {
                return amount;
            }
        }
        for (String key : new String[]{"amount", "price", "total_fee"}) {
            int value = ObjectUtils.toInt(map.get(key), 0);
            if (value > 0) {
                return value;
            }
        }
        return 0;
    }

    private static int extractAmountFenFromJson(@NonNull JSONObject json) {
        int amount = json.optInt("amount", json.optInt("price", 0));
        if (amount > 0) {
            return amount;
        }
        JSONObject data = json.optJSONObject("data");
        if (data != null) {
            amount = data.optInt("amount", data.optInt("price", 0));
            if (amount > 0) {
                return amount;
            }
        }
        return 0;
    }
}
