package com.ruixue.ossdk;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
public class GoogleLoginWrapper extends PluginSdk {

    public static final String NAME = "google";

    static class Single {
        final static GoogleLoginWrapper INSTANCE = new GoogleLoginWrapper();
    }

    private GoogleLoginWrapper() {
    }

    public static GoogleLoginWrapper getInstance() {
        return Single.INSTANCE;
    }

    public static final int REQUEST_CODE = RuiXueSdk.DEFAULT_CALLBACK_REQUEST_CODE_OFFSET + 2;

    private GoogleSignInClient mGoogleSignInClient;

    private RXJSONCallback mLoginCallback;
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
        if (isInited.get()) {
            if (callback != null)
                callback.onSuccess(null);
            return true;
        }
        String google_clientid = (String) paramsMap.get("google_clientid");
        if (TextUtils.isEmpty(google_clientid)) {
            google_clientid = (String) paramsMap.get("clientId");
        }
        if (google_clientid != null) {
            // For sample only: make sure there is a valid server client ID.
            // Request only the user's ID token, which can be used to identify the
            // user securely to your backend. This will contain the user's basic
            // profile (name, profile picture URL, etc) so you should not need to
            // make an additional call to personalize your application.
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestScopes(new Scope(Scopes.DRIVE_APPFOLDER))
//                .requestScopes(new Scope(GENDER_SCOPE))
                    .requestIdToken(google_clientid).requestServerAuthCode(google_clientid).requestEmail().build();
            mGoogleSignInClient = GoogleSignIn.getClient(context, gso);
            isInited.set(true);
        }
        if (callback != null)
            callback.onSuccess(null);
        return true;
    }


    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        if (Objects.equals(NAME, paramsMap.get("method"))) {
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
        } else {
            return false;
        }
    }

    @Override
    public boolean onLoginResp(int code) {

        return false;
    }

    private void doLoginImpl(Activity activity, @NonNull RXJSONCallback callback) {
        if (isInited.get() && null != mGoogleSignInClient) {
            mGoogleSignInClient.signOut();
            Intent intent = mGoogleSignInClient.getSignInIntent();
            activity.startActivityForResult(intent, REQUEST_CODE);
            mLoginCallback = callback;
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
        }
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        if (isInited.get()) {
            mGoogleSignInClient.signOut().addOnCompleteListener(activity, new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    RXLogger.i("google sdk logout " + task.isSuccessful());
                    if (callback != null) {
                        if (task.isSuccessful()) {
                            callback.onSuccess("");
                        } else {
                            callback.onFailed(-1, "logout error");
                        }
                    }
                }
            });
        } else if (callback != null) {
            callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.getValue(), "google sdk not init");
        }
        return true;
    }


    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {

        return false;

    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE && mLoginCallback != null) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task, mLoginCallback);
        }
    }

    public void handleSignInResult(Task<GoogleSignInAccount> completedTask, RXJSONCallback callback) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            RXLogger.i("GoogleSignInAccount:" + account.toString());
            RXLogger.i(account.getIdToken() + "-" + account.getId() + "-" + account.getPhotoUrl());
            Map<String, Object> extMap = new HashMap<>();
            extMap.put("idToken", account.getIdToken());
//            extMap.put("photourl", account.getPhotoUrl());
//            extMap.put("zag", account.getEmail());
//            extMap.put("mId", account.getId());
//            extMap.put("zah", account.getDisplayName());

            callback.onSuccess(new JSONObject(extMap));
        } catch (ApiException e) {
            RXLogger.w("GoogleSignInResult:failed code= " + e.getStatusCode());
            e.printStackTrace();
            String msg = TextUtils.isEmpty(e.getStatus().getStatusMessage()) ? "An unknown error." : e.getStatus().getStatusMessage();
            msg = ConnectionResultMsg.get(e.getStatusCode(), msg);
            if (e.getStatusCode() == 12501) {
                callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
            } else {
                callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(e.getStatusCode(), msg));
            }

        }
    }
}
