package com.ruixue.sdk.line;

import android.app.Activity;
import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.linecorp.linesdk.LineApiResponse;
import com.linecorp.linesdk.LineCredential;
import com.linecorp.linesdk.LineProfile;
import com.linecorp.linesdk.Scope;
import com.linecorp.linesdk.api.LineApiClient;
import com.linecorp.linesdk.api.LineApiClientBuilder;
import com.linecorp.linesdk.auth.LineAuthenticationParams;
import com.linecorp.linesdk.auth.LineLoginApi;
import com.linecorp.linesdk.auth.LineLoginResult;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.URLHelper;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;


//https://developers.line.biz/en/docs/android-sdk/integrate-line-login/#starting-login-activity
public class LineSdkWrapper extends ShareApi implements IPluginSdk {
    public static final String NAME = "line";
    static final int REQUEST_CODE_LINE = RuiXueSdk.DEFAULT_CALLBACK_REQUEST_CODE_OFFSET + 10;
    private static LineApiClient lineApiClient;
    RXJSONCallback mCallback;
    String channel_id;

    @Override
    public void attachBaseContext(Context context) {

    }

    @Override
    public void onApplicationCreate(Application application) {

    }

    @Override
    public void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner) {

    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {

    }



    @Override
    public void onStart(Activity activity) {

    }

    @Override
    public void onRestart(Activity activity) {

    }

    @Override
    public void onResume(Activity activity) {

    }

    @Override
    public void onPause(Activity activity) {

    }

    @Override
    public void onStop(Activity activity) {

    }

    @Override
    public void onDestroy(Activity activity) {

    }

    @Override
    public void onBackPressed() {

    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {

    }

    public void shareToLine(Activity activity, String uriString, String title, String text) {
        String linePackageName = "jp.naver.line.android";
        String lineClassName = "jp.naver.line.android.activity.selectchat.SelectChatActivityLaunchActivity";
        ComponentName componentName = new ComponentName(linePackageName, lineClassName);
        Intent shareIntent = new Intent();
        shareIntent.setAction(Intent.ACTION_SEND);
        Uri uri = Uri.parse(uriString);
        shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
        // shareIntent.setType("image/*"); //图片分享
        shareIntent.setType("text/plain"); // 纯文本
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);//分享的标题
        shareIntent.putExtra(Intent.EXTRA_TEXT, text);//分享内容
        shareIntent.setComponent(componentName);//跳到指定APP的Activity
        activity.startActivity(Intent.createChooser(shareIntent, ""));
    }

    public void shareTextToLine(Activity activity, String content) {
        String scheme = "line://msg/text/" + content;
        Uri uri = Uri.parse(scheme);
        activity.startActivity(new Intent(Intent.ACTION_VIEW, uri));
    }

    private static final String SCHEME = "line://msg/";
    private static final String linePackageName = "jp.naver.line.android";

    private String getType(String material_type) {
        if (material_type != null && material_type.equals("image")) {
            return material_type;
        } else {
            return "text";
        }
    }

    private String getContent(String material_type, Map<String, Object> paramsMap) {
        if (material_type != null && material_type.equals("image")) {
            return (String) paramsMap.get("image");
        } else if (material_type != null && (material_type.equals("link") || material_type.equals("landing"))) {
            String content = (String) paramsMap.get("content");
            String url = (String) paramsMap.get("url");
            return URLHelper.urlEncode((TextUtils.isEmpty(content) ? "" : content + "\n") + url);
        } else {
            return (String) paramsMap.get("title");
        }
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
//        String lineClassName = "com.linecorp.line.share.common.view.FullPickerLaunchActivity";
//        paramsMap.put("package_name", linePackageName);
//        paramsMap.put("class_name", lineClassName);
//        paramsMap.put("force_user_system_chooser", false);
        if (AppUtils.isAppInstalled(activity, linePackageName)) {
            String material_type = (String) paramsMap.get("material_type");
            Uri uri = Uri.parse(SCHEME + getType(material_type) + "/" + getContent(material_type, paramsMap));
            activity.startActivity(new Intent(Intent.ACTION_VIEW, uri));
            callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject());
        } else {
            callback.onFailed(RXErrorCode.UNKNOWN_ERROR.toJSONObject(-1, "please install line app"));
        }
        return true;
    }


    @Override
    public PlatformType getPlatformType() {
        return PlatformType.LINE;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_LINE && mCallback != null) {
            try {
                LineLoginResult result = LineLoginApi.getLoginResultFromIntent(data);
                //                LineIdToken lineIdToken = result.getLineIdToken();

                switch (result.getResponseCode()) {
                    case SUCCESS:
                        // Login successful
                        invokeLoginSuccess(Objects.requireNonNull(result.getLineCredential()), result.getLineProfile(), mCallback);
                        break;
                    case CANCEL:
                        // Login canceled by user
                        mCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
                        break;
                    default:
                        String error = result.getErrorData().getMessage();
                        JSONObject errJson = new JSONObject(Objects.requireNonNull(error, "line login error msg is null"));
                        RXLogger.e(error);
                        // Login canceled due to other error
                        mCallback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(result.getErrorData().getHttpResponseCode(), errJson.optString("error") + " ," + errJson.optString("error_description")));
                }

            } catch (Exception e) {
                mCallback.onError(new RXException(e));
            } finally {
                mCallback = null;
            }
        }
    }


    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {

    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {

    }

    static class Single {
        final static LineSdkWrapper INSTANCE = new LineSdkWrapper();
    }

    private LineSdkWrapper() {
    }

    public static LineSdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public String getName() {
        return NAME;
    }


    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        channel_id = Objects.requireNonNull((String) paramsMap.get("line_channel_id"), "line_channel_id is empty");
        LineApiClientBuilder apiClientBuilder = new LineApiClientBuilder(context.getApplicationContext(), channel_id);
        lineApiClient = apiClientBuilder.build();
        return true;
    }

    private void invokeLoginSuccess(LineCredential lineCredential, LineProfile lineProfile, RXJSONCallback callback) {
        Map<String, Object> extMap = new HashMap<>();
        extMap.put("access_token", lineCredential.getAccessToken().getTokenString());

        if (lineProfile != null) {
            extMap.put("display_name", lineProfile.getDisplayName());
            extMap.put("user_id", lineProfile.getUserId());
            extMap.put("picture_url", lineProfile.getPictureUrl());
        }
        callback.onSuccess(new JSONObject(extMap));
    }

    interface LineCredentialListener {
        void onLineCredential(boolean isSuccess, LineCredential lineCredential, LineProfile lineProfile);
    }

    AtomicBoolean isLoggingIn = new AtomicBoolean(false);

    private void getLineLoginResultAsync(@NonNull LineCredentialListener lineCredentialListener) {
        Objects.requireNonNull(lineApiClient, "please call initThirdSdk func, init lineApiClient first ");
        ThreadUtils.getInstance().runOnBgThread(() -> {
            RXLogger.i("line invoke lineApiClient.verifyToken");
            isLoggingIn.set(true);
            LineApiResponse<LineCredential> lineApiResponse = Objects.requireNonNull(lineApiClient, "please call initThirdSdk func, init lineApiClient first ").verifyToken();
            LineApiResponse<LineProfile> lineProfileLineApiResponse = lineApiClient.getProfile();
            isLoggingIn.set(false);
            ThreadUtils.getInstance().runOnUiThread(() -> lineCredentialListener.onLineCredential(lineApiResponse.isSuccess(), lineApiResponse.isSuccess() ? lineApiResponse.getResponseData() : null, lineProfileLineApiResponse.isSuccess() ? lineProfileLineApiResponse.getResponseData() : null));
        });
    }

    private void invokeLineLoginAuth(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        RXLogger.i("line invokeLineLoginAuth");
        String[] permissions = null;
        if (paramsMap.get("permission") instanceof String[]) {
            permissions = (String[]) paramsMap.get("permission");
        }
        if (permissions == null || permissions.length == 0) {
            permissions = new String[]{Scope.PROFILE.getCode()};
        }
        if (!TextUtils.isEmpty(channel_id) && channel_id != null) {
            // App-to-app login
            //https://developers.line.biz/en/docs/line-login/integrate-line-login/

            Intent loginIntent = LineLoginApi.getLoginIntent(activity, channel_id, new LineAuthenticationParams.Builder().scopes(Scope.convertToScopeList(Arrays.asList(permissions)))
                    // .nonce("<a randomly-generated string>") // nonce can be used to improve security
                    .build());
            activity.startActivityForResult(loginIntent, REQUEST_CODE_LINE);
            mCallback = callback;

        } else {
            throw new IllegalArgumentException("error line_channel_id is empty.please init");
        }
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        try {
            if (!ObjectUtils.toBoolean(paramsMap.containsKey("force_auth")) && lineApiClient != null && !isLoggingIn.get()) {
                getLineLoginResultAsync(new LineCredentialListener() {
                    @Override
                    public void onLineCredential(boolean isSuccess, LineCredential lineCredential, LineProfile lineProfile) {
                        if (isSuccess) {
                            invokeLoginSuccess(lineCredential, lineProfile, callback);
                        } else {
                            invokeLineLoginAuth(activity, paramsMap, callback);
                        }
                    }
                });
            } else {
                invokeLineLoginAuth(activity, paramsMap, callback);
            }
        } catch (Exception e) {
            e.printStackTrace();
            ThreadUtils.getInstance().runOnUiThread(() -> callback.onError(new RXException(e)));
        }
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        if (lineApiClient != null) {
            lineApiClient.logout();
        }
        if (callback != null) {
            callback.onSuccess("");
        }
        return true;
    }

    @Override
    public boolean doExitApp(Activity activity, @Nullable OnAppExitCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }

}
