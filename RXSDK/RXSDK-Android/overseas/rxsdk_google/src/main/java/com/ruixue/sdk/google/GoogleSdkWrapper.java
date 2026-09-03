package com.ruixue.sdk.google;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.CancellationSignal;
import android.text.TextUtils;
import android.util.Log;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.credentials.ClearCredentialStateRequest;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.PasswordCredential;
import androidx.credentials.PublicKeyCredential;
import androidx.credentials.exceptions.ClearCredentialException;
import androidx.credentials.exceptions.GetCredentialException;

import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.tasks.Task;
import com.google.android.libraries.identity.googleid.GetGoogleIdOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;
import com.google.android.play.core.review.ReviewException;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.play.core.review.model.ReviewErrorCode;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityConvertRXStringCallback;
import com.ruixue.unity.UnityRXStringCallback;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
public class GoogleSdkWrapper extends PluginSdk {

    public static final String NAME = "google";
    static String GOOGLE = "google";

    static class Single {
        final static GoogleSdkWrapper INSTANCE = new GoogleSdkWrapper();
    }

    private GoogleSdkWrapper() {
        executor = Executors.newSingleThreadExecutor();
        // Google 支付默认 ProductDetails 实现（Billing Library 8.x）
        mGoogleBilling = new GoogleBillingImpl();
    }

    public static GoogleSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

//    public static final int REQUEST_CODE = RuiXueSdk.DEFAULT_CALLBACK_REQUEST_CODE_OFFSET + 2;

//    private GoogleSignInClient mGoogleSignInClient;

    private CredentialManager credentialManager;
    private final Executor executor;
    private GetGoogleIdOption getGoogleIdOption;

    //    private RXJSONCallback mLoginCallback;
    private final GoogleBillingImpl mGoogleBilling;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    private static final SparseArray<String> ConnectionResultMsg = new SparseArray<>();

    static {
        ConnectionResultMsg.put(ConnectionResult.API_DISABLED, "The API being requested is disabled on this device for this application.");
        ConnectionResultMsg.put(ConnectionResult.API_DISABLED_FOR_CONNECTION, "The API being requested is disabled for this connection attempt, but may work for other connections.");
        ConnectionResultMsg.put(ConnectionResult.API_UNAVAILABLE, "One of the API components you attempted to connect to is not available.");
        ConnectionResultMsg.put(ConnectionResult.CANCELED, "The connection was canceled.");
        ConnectionResultMsg.put(ConnectionResult.DEVELOPER_ERROR, "The application is misconfigured ,Check the Web client ID and SHA1..");
        ConnectionResultMsg.put(ConnectionResult.DRIVE_EXTERNAL_STORAGE_REQUIRED, "This constant is deprecated. External storage is no longer required.");
        ConnectionResultMsg.put(ConnectionResult.INTERNAL_ERROR, "An internal error occurred.");
        ConnectionResultMsg.put(ConnectionResult.INTERRUPTED, "An interrupt occurred while waiting for the connection complete.");
        ConnectionResultMsg.put(ConnectionResult.INVALID_ACCOUNT, "The client attempted to connect to the service with an invalid account name specified.");
        ConnectionResultMsg.put(ConnectionResult.LICENSE_CHECK_FAILED, "The application is not licensed to the user.");
        ConnectionResultMsg.put(ConnectionResult.NETWORK_ERROR, "A network error occurred.");
        ConnectionResultMsg.put(ConnectionResult.RESOLUTION_ACTIVITY_NOT_FOUND, "There was a user-resolvable issue connecting to Google Play services, but when attempting to start the resolution, the activity was not found.");
        ConnectionResultMsg.put(ConnectionResult.RESOLUTION_REQUIRED, "Completing the connection requires some form of resolution.");
        ConnectionResultMsg.put(ConnectionResult.RESTRICTED_PROFILE, "The current user profile is restricted and cannot use authenticated features.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_DISABLED, "The installed version of Google Play services has been disabled on this device.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_INVALID, "The version of the Google Play services installed on this device is not authentic.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_MISSING, "Google Play services is missing on this device.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_MISSING_PERMISSION, "Google Play service doesn't have one or more required permissions.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_UPDATING, "Google Play service is currently being updated on this device.");
        ConnectionResultMsg.put(ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED, "The installed version of Google Play services is out of date.");
        ConnectionResultMsg.put(ConnectionResult.SIGN_IN_FAILED, "The client attempted to connect to the service but the user is not signed in.");
        ConnectionResultMsg.put(ConnectionResult.SIGN_IN_REQUIRED, "The client attempted to connect to the service but the user is not signed in.");
        ConnectionResultMsg.put(ConnectionResult.SUCCESS, "The connection was successful.");
        ConnectionResultMsg.put(ConnectionResult.TIMEOUT, "The timeout was exceeded while waiting for the connection to complete.");
    }


    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        RXLogger.i("google", "init paramsMap=" + paramsMap);
        RXLogger.i("google", "init RXGlobalData.googleClientId=" + RXGlobalData.getGoogleClientId());
        GoogleConfig googleConfig = GoogleConfig.fromMap(paramsMap);
        RXLogger.i("google", "init serverClientId=" + googleConfig.getServerClientId());
        mGoogleBilling.init(context, null);
        if (isInited.get() && getGoogleIdOption != null) {
            if (TextUtils.isEmpty(googleConfig.getServerClientId())
                    || getGoogleIdOption.getServerClientId().equals(googleConfig.getServerClientId())) {
                RXLogger.i("google", "init already inited, skip. current=" + getGoogleIdOption.getServerClientId()
                        + ", incoming=" + googleConfig.getServerClientId());
                if (callback != null)
                    callback.onSuccess(null);
                return true;
            }
        }

        if (googleConfig.checkParams()) {
            RXLogger.i("google", "init checkParams passed, creating CredentialManager");
            credentialManager = CredentialManager.create(context);
            getGoogleIdOption = new GetGoogleIdOption.Builder()
                    .setFilterByAuthorizedAccounts(false)
                    .setServerClientId(googleConfig.getServerClientId())
                    .setAutoSelectEnabled(true)
                    .build();


            isInited.set(true);
            getGaid(context);
            RXLogger.i("google", "init success");
            if (callback != null)
                callback.onSuccess(null);
        } else {
            RXLogger.e("google", "init checkParams FAILED, serverClientId=" + googleConfig.getServerClientId());
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR));
        }
        return true;
    }

    public void getGaid(Context context) {
        if (!RXGlobalData.readSensitiveInfoEnabled()
                || context == null
                || !TextUtils.isEmpty(DeviceUtils.getGAID(context))) {
            return;
        }
        Executors.newSingleThreadExecutor().execute(() -> {
            boolean classExists;
            try {
                Class.forName("com.google.android.gms.ads.identifier.AdvertisingIdClient");
                classExists = true;
            } catch (ClassNotFoundException e) {
                Log.e("rxsdk", "GAID class not found (no Google Play services)", e);
                classExists = false;
            }

            if (!classExists) {
                return;
            }

            // 4. 检查Google Play服务是否可用
            int googlePlayStatus = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
            if (googlePlayStatus != ConnectionResult.SUCCESS) {
                Log.e("rxsdk", "Google Play services unavailable, status: " + googlePlayStatus);
                return;
            }

            try {
                AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(context.getApplicationContext());
                if (!TextUtils.isEmpty(info.getId())) {
                    DeviceUtils.setGAID(context, info.getId());
                    Log.i("rxsdk", "GAID obtained: " + info.getId() + ", isLimitAdTrackingEnabled: " + info.isLimitAdTrackingEnabled());
                } else {
                    Log.w("rxsdk", "GAID is empty");
                }
            } catch (Exception e) {
                // 捕获普通异常（如IO异常、服务未就绪等）
                Log.e("rxsdk", "Exception when getting GAID: " + e.getMessage(), e);
            } catch (Error e) {
                // 捕获致命错误（如类缺失、方法不存在等，低版本系统常见）
                Log.e("rxsdk", "Fatal error when getting GAID: " + e.getMessage(), e);
            }
        });
    }


    public void alertAppReview(Activity activity, RXJSONCallback callback) {
        ReviewManager manager = ReviewManagerFactory.create(activity);
        Task<ReviewInfo> request = manager.requestReviewFlow();
        request.addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                // We can get the ReviewInfo object
                ReviewInfo reviewInfo = task.getResult();
                Task<Void> flow = manager.launchReviewFlow(activity, reviewInfo);
                flow.addOnCompleteListener(taskt -> {
                    // The flow has finished. The API does not indicate whether the user
                    // reviewed or not, or even whether the review dialog was shown. Thus, no
                    // matter the result, we continue our app flow.
                    if (callback != null)
                        callback.onSuccess(null);
                });
            } else {
                if (task.getException() != null) {
                    // There was some problem, log or handle the error code.
                    @ReviewErrorCode int reviewErrorCode = ((ReviewException) Objects.requireNonNull(task.getException())).getErrorCode();
                    String msg = task.getException().getMessage();
                    if (callback != null)
                        callback.onFailed(JSONUtil.toJSONObject(reviewErrorCode, msg));
                } else {
                    if (callback != null)
                        callback.onFailed(RXErrorCode.UNKNOWN_ERROR.toJSONObject());
                }
            }
        });
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        RXLogger.i("google", "doLogin paramsMap=" + paramsMap);
        init(activity, paramsMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                doLoginImpl(activity, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(cause);
            }
        });
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        if (code == 0)
            repayFailOrder(null, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i("repayFailOrder finish " + data);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {

                }
            });
        return false;
    }

//    private void doLoginImpl(Activity activity, @NonNull RXJSONCallback callback) {
//        if (isInited.get() && null != mGoogleSignInClient) {
//            mGoogleSignInClient.signOut();
//            Intent intent = mGoogleSignInClient.getSignInIntent();
//            activity.startActivityForResult(intent, REQUEST_CODE);
//            mLoginCallback = callback;
//        } else {
//            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
//        }
//    }

    private void doLoginImpl(Activity activity, @NonNull RXJSONCallback callback) {
        RXLogger.i("google", "doLoginImpl isInited=" + isInited.get() + " credentialManager=" + (credentialManager != null));
        if (isInited.get() && credentialManager != null) {
            doLogout(activity, null);
            // 目前只支持 google id token 形式登录，账户密码、public key 形式的由于实际使用场景和目前应用场景不太相符，暂不支持
            GetCredentialRequest request = new GetCredentialRequest.Builder()
                    .addCredentialOption(getGoogleIdOption).build();

            credentialManager.getCredentialAsync(activity, request, new CancellationSignal(), executor, new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse response) {
                    handleSignInResult(response, callback);
                }

                @SuppressLint("RestrictedApi")
                @Override
                public void onError(@NonNull GetCredentialException e) {
                    ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Logger.w("login error:"+e.getMessage());
                            if ("android.credentials.GetCredentialException.TYPE_USER_CANCELED".equals(e.getType())) {
                                callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
                            } else {
                                callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(-1, e.getMessage()));
                            }
                        }
                    });
                }
            });
        } else {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
                }
            });
        }
    }


    private void handleSignInResult(GetCredentialResponse response, RXJSONCallback callback) {
        Credential credential = response.getCredential();
        RXLogger.i("google", "handleSignInResult credentialType=" + credential.getType());
        if (credential instanceof PasswordCredential) {
            PasswordCredential passwordCredential = (PasswordCredential) credential;
            String username = passwordCredential.getId();
            String password = passwordCredential.getPassword();
            RXLogger.i("username=" + username + ",password=" + password);
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "no support password credential"));
            }
        } else if (credential instanceof PublicKeyCredential) {
            PublicKeyCredential publicKeyCredential = (PublicKeyCredential) credential;
            String responseJson = publicKeyCredential.getAuthenticationResponseJson();
            RXLogger.i("responseJson=" + responseJson);
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "no support public key credential"));
            }
        } else if (credential instanceof CustomCredential) {
            if (credential.getType().equals(GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL)) {
                GoogleIdTokenCredential googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.getData());
                String idToken = googleIdTokenCredential.getIdToken();
                Map<String, Object> extMap = new HashMap<>();
                extMap.put("idToken", idToken);
                callback.onSuccess(new JSONObject(extMap));
            } else {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "no support unknown credential"));
                }
            }
        } else {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "no support unknown credential"));
            }
        }
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        if (isInited.get()) {
            if (credentialManager != null) {
                ClearCredentialStateRequest request = new ClearCredentialStateRequest();
                credentialManager.clearCredentialStateAsync(request, new CancellationSignal(), executor, new CredentialManagerCallback<Void, ClearCredentialException>() {
                    @Override
                    public void onResult(Void unused) {
                        ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (callback != null)
                                    callback.onSuccess("");
                            }
                        });
                    }

                    @Override
                    public void onError(@NonNull ClearCredentialException e) {
                        ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (callback != null) {
                                    callback.onFailed(-1, "logout error");
                                }
                            }
                        });
                    }
                });
            }
//            mGoogleSignInClient.signOut().addOnCompleteListener(activity, new OnCompleteListener<Void>() {
//                @Override
//                public void onComplete(@NonNull Task<Void> task) {
//                    RXLogger.i("google sdk logout " + task.isSuccessful());
//                    if (callback != null) {
//                        if (task.isSuccessful()) {
//                            callback.onSuccess("");
//                        } else {
//                            callback.onFailed(-1, "logout error");
//                        }
//                    }
//                }
//            });
        } else if (callback != null) {
            callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.getValue(), "google sdk not init");
        }
        return true;
    }

    /**
     * @param skusList 商品id列表
     * @param callback 商品 json 信息
     */
    @Deprecated
    public void querySkuDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        mGoogleBilling.querySkuDetailsAsync(skusList, callback);
    }

    /**
     * @param skusList 商品id列表
     * @param callback 商品 json 信息
     */
    public void getProductsInfo(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        mGoogleBilling.queryProductDetailsAsync(skusList, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, RXStringCallback)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, RXStringCallback)}.
     */
    @Deprecated
    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }


    public ArrayList<String> getProductIdList() {
        Map<String, Object> rela = RXGlobalData.getGoodsTagRelationMap("google");
        if (rela != null) {
            ArrayList<String> result = new ArrayList<>();
            for (Object value : rela.values()) {
                if (value instanceof String) {
                    result.add((String) value);
                }
            }
            return result;
        }
        return new ArrayList<>(); // 返回空列表以避免 NullPointerException
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, UnityRXStringCallback)}.
     */
    @Deprecated
    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull UnityRXStringCallback callback) {
        getProductsInfo(skusList, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, UnityConvertRXStringCallback)}.
     */
    @Deprecated
    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull UnityConvertRXStringCallback callback) {
        getProductsInfo(skusList, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getProductsInfo(@NonNull List<String> skusList, @NonNull UnityRXStringCallback callback) {
        getProductsInfo(skusList, UnityBaseCommonFun.convertCallback(callback));
    }

    public void getProductsInfo(@NonNull List<String> skusList, @NonNull UnityConvertRXStringCallback callback) {
        getProductsInfo(skusList, UnityBaseCommonFun.convertCallback(callback));
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, UnityRXStringCallback)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> skusList, @NonNull UnityRXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, UnityConvertRXStringCallback)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> skusList, @NonNull UnityConvertRXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(HQType.KEY) || Objects.equals(hashMap.get(HQType.KEY), GOOGLE)) {
            mGoogleBilling.pay(activity, hashMap, callback);
            return true;
        } else {
            return false;
        }
    }

    public void repayFailOrder(Activity activity, RXJSONCallback callback) {
        mGoogleBilling.queryPurchasesAsync(callback);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//        if (requestCode == REQUEST_CODE && mLoginCallback != null) {
//            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
//            handleSignInResult(task, mLoginCallback);
//        }
    }

//    public void handleSignInResult(Task<GoogleSignInAccount> completedTask, RXJSONCallback callback) {
//        try {
//            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
//            RXLogger.i("GoogleSignInAccount:" + account.toString());
//            RXLogger.i(account.getIdToken() + "-" + account.getId() + "-" + account.getPhotoUrl());
//            Map<String, Object> extMap = new HashMap<>();
//            extMap.put("idToken", account.getIdToken());
////            extMap.put("photourl", account.getPhotoUrl());
////            extMap.put("zag", account.getEmail());
////            extMap.put("mId", account.getId());
////            extMap.put("zah", account.getDisplayName());
//
//            callback.onSuccess(new JSONObject(extMap));
//        } catch (ApiException e) {
//            RXLogger.w("GoogleSignInResult:failed code= " + e.getStatusCode());
//            e.printStackTrace();
//            String msg = TextUtils.isEmpty(e.getStatus().getStatusMessage()) ? "An unknown error." : e.getStatus().getStatusMessage();
//            msg = ConnectionResultMsg.get(e.getStatusCode(), msg);
//            if (e.getStatusCode() == 12501) {
//                callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
//            } else {
//                callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(e.getStatusCode(), msg));
//            }
//
//        }
//    }
}
