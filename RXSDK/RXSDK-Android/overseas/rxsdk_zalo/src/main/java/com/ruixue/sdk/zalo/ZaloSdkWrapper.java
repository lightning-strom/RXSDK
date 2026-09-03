package com.ruixue.sdk.zalo;

import android.app.Activity;
import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.share.ShareScene;
import com.ruixue.utils.JSONUtil;
import com.zing.zalo.zalosdk.oauth.FeedData;
import com.zing.zalo.zalosdk.oauth.LoginVia;
import com.zing.zalo.zalosdk.oauth.OAuthCompleteListener;
import com.zing.zalo.zalosdk.oauth.OauthResponse;
import com.zing.zalo.zalosdk.oauth.OpenAPIService;
import com.zing.zalo.zalosdk.oauth.ZaloPluginCallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.oauth.ZaloSDKApplication;
import com.zing.zalo.zalosdk.oauth.model.ErrorResponse;

import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// Created by wangliang on 2024/3/19.
public class ZaloSdkWrapper extends ShareApi implements IPluginSdk {

    public static final String NAME = "zalo";

    static class Single {
        final static ZaloSdkWrapper INSTANCE = new ZaloSdkWrapper();
    }

    private ZaloSdkWrapper() {
    }

    public static ZaloSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    public void init(Application application) {
        ZaloSDKApplication.wrap(application);
    }

    /**
     * 此方法用来根据包名和证书生成 key，给配置方配置即可
     * @param ctx
     * @return
     * @throws Exception
     */
    private static String getApplicationHashKey(Context ctx) throws Exception {
        PackageInfo info = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), PackageManager.GET_SIGNATURES);
        for (Signature signature : info.signatures) {
            MessageDigest md = MessageDigest.getInstance("SHA");
            md.update(signature.toByteArray());
            String sig = Base64.encodeToString(md.digest(), Base64.DEFAULT).trim();
            if (sig.trim().length() > 0) {
                return sig;
            }
        }
        return null;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        if (isZaloUnInstalled(activity)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL));
            return true;
        }

        final String codeVerifier = genCodeVerifier();
        final String codeChallenge = genCodeChallenge(codeVerifier);
        ZaloSDK.Instance.authenticateZaloWithAuthenType(activity, LoginVia.APP_OR_WEB, codeChallenge, null, new OAuthCompleteListener() {
            @Override
            public void onGetOAuthComplete(OauthResponse response) {
                if (response == null || TextUtils.isEmpty(response.getOauthCode())) {
                    // login error unknown
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
                    return;
                }

                RXLogger.i("zalo get oauth code:" + response.getOauthCode());
                Map<String, String> extMap = new HashMap<>();
                extMap.put("oauth_code", response.getOauthCode());
                extMap.put("code_verifier", codeVerifier);
                callback.onSuccess(new JSONObject(extMap));
            }

            @Override
            public void onAuthenError(ErrorResponse response) {
                RXLogger.i("zalo login failed errorCode:" + response.getErrorCode() + ", message:" + response.getErrorMsg());
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            }
        });
        return true;
    }

    private String genCodeVerifier() {
        SecureRandom sr = new SecureRandom();
        byte[] code = new byte[32];
        sr.nextBytes(code);
        return Base64.encodeToString(code, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }

    private String genCodeChallenge(String codeVerifier) {
        String result = null;
        try {
            byte[] bytes = codeVerifier.getBytes("US-ASCII");
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(bytes, 0, bytes.length);
            byte[] digest = md.digest();
            result = Base64.encodeToString(digest, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result;
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        if (isZaloUnInstalled(activity)) {
            RXLogger.i("do share uninstall zalo");
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL));
            return true;
        }
        ShareObject shareObject = ShareObject.fromMap(paramsMap);
        if (Objects.requireNonNull(shareObject.getType(), "error material_type is null.").equals(ShareMediaType.WEBPAGE)) {
            if (shareObject.getShareScene() == ShareScene.SESSION) {
                doShareToFriend(activity, shareObject, callback);
            } else if (shareObject.getShareScene() == ShareScene.TIMELINE) {
                doShareToFeed(activity, shareObject, callback);
            } else {
                doShareSelect(activity, shareObject, callback);
            }
        } else {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            RXLogger.i("this is unsupport type :" + shareObject.getType());
        }

        return true;
    }

    private void doShareSelect(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        FeedData data = new FeedData();
        data.setLink(shareObject.getUrl());
        data.setLinkTitle(shareObject.getTitle());
        data.setLinkDesc(shareObject.getDescription());
        OpenAPIService.getInstance().share(activity, data, new MyShareCallback(callback));
    }

    private void doShareToFriend(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        FeedData data = new FeedData();
        data.setLink(shareObject.getUrl());
        data.setLinkTitle(shareObject.getTitle());
        data.setLinkDesc(shareObject.getDescription());
        OpenAPIService.getInstance().shareMessage(activity, data, new MyShareCallback(callback));
    }

    private void doShareToFeed(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        FeedData data = new FeedData();
        data.setLink(shareObject.getUrl());
        data.setLinkTitle(shareObject.getTitle());
        data.setLinkDesc(shareObject.getDescription());
        OpenAPIService.getInstance().shareFeed(activity, data, new MyShareCallback(callback));
    }

    private static boolean isZaloUnInstalled(Context context) {
        Intent intent;
        (intent = new Intent("android.intent.action.SEND")).setComponent(new ComponentName("com.zing.zalo", "com.zing.zalo.ui.TempShareViaActivity"));
        return intent.resolveActivityInfo(context.getPackageManager(), 0) == null;
    }

    private static class MyShareCallback implements ZaloPluginCallback {

        private final RXJSONCallback callback;

        public MyShareCallback(RXJSONCallback callback) {
            this.callback = callback;
        }

        @Override
        public void onResult(boolean res, int i, String s, String s1) {
            if (callback == null) {
                RXLogger.i("share zalo finish, but callback is null.");
                return;
            }
            if (res) {
                callback.onSuccess(null);
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed"));
            }
        }
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.ZALO;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        ZaloSDK.Instance.onActivityResult(activity, requestCode, resultCode, data);
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

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        ZaloSDK.Instance.unauthenticate();
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

    @Override
    public void attachBaseContext(Context context) {

    }

    @Override
    public void onApplicationCreate(Application application) {
        ZaloSDKApplication.wrap(application);
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
}
