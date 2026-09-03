package com.ruixue.sdk.tiktok;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.RXFileProvider;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareImageObject;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.tiktok.open.sdk.auth.AuthApi;
import com.tiktok.open.sdk.auth.AuthRequest;
import com.tiktok.open.sdk.auth.AuthResponse;
import com.tiktok.open.sdk.auth.utils.PKCEUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;


public class TiktokSdkWrapper extends ShareApi implements IPluginSdk {
    public static final String NAME = "tiktok";

    private String clientKey = null;
    private String redirectUrl = null;
    private AuthApi authApi = null;


    static class Single {
        final static TiktokSdkWrapper INSTANCE = new TiktokSdkWrapper();
    }

    private TiktokSdkWrapper() {
    }

    public static TiktokSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void attachBaseContext(Context context) {

    }

    @Override
    public void onApplicationCreate(Application application) {
        try {
            ApplicationInfo appInfo = application.getPackageManager().getApplicationInfo(application.getPackageName(), PackageManager.GET_META_DATA);
            Bundle metaData = appInfo.metaData;
            clientKey = metaData.getString("com.ruixue.sdk.tiktok.clientKey");
            redirectUrl = metaData.getString("com.ruixue.sdk.tiktok.auth.scheme");
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
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

    RXJSONCallback shareCallback;

    public void onShareResp(Activity activity, boolean isSuccess, Map<String, Object> data) {
        if (shareCallback != null) {
            if (isSuccess) {
                shareCallback.onSuccess(new JSONObject(data));
            } else {
                shareCallback.onFailed(new JSONObject(data));
            }
        }
        shareCallback = null;
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        boolean isInstalled = TiktokSdkHelper.isInstalled(activity);
        if (!isInstalled) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL));
            }
            return true;
        }
        String type = (String) paramsMap.get("material_type");
        if (type != null && type.equals(ShareMediaType.IMAGE)) {
            shareSingleImage(activity, paramsMap, callback);
        } else if (type != null && type.equals(ShareMediaType.ATLAS)) {
            shareMultiImages(activity, paramsMap, callback);
        }
        return true;
    }

    private void shareSingleImage(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        ShareObject shareObject = ShareObject.fromMap(paramsMap);
        String imageUrl = shareObject.getImage();
        if (TextUtils.isEmpty(imageUrl)) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }
        List<ShareImageObject> shareImageObjects = new ArrayList<>();
        ShareImageObject shareImageObject = new ShareImageObject();
        shareImageObject.setImage_url(shareObject.getImage());
        shareImageObject.setLanding_url(shareObject.getUrl());
        shareImageObject.setWidth(shareObject.getWidth());
        shareImageObject.setHeight(shareObject.getHeight());
        shareImageObject.setX(shareObject.getX());
        shareImageObject.setY(shareObject.getY());
        shareImageObjects.add(shareImageObject);
        shareImages(activity, paramsMap, shareImageObjects, callback);
    }

    @SuppressWarnings("unchecked")
    private void shareMultiImages(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        List<HashMap<String, Object>> atlasList;
        // 这里由于 ShareObject 目前仅支持一维解析，所以这里直接取原数据
        try {
            atlasList = (List<HashMap<String, Object>>) paramsMap.get("atlas");
        } catch (Exception e) {
            // 防止传递数据类型错误，导致崩溃
            RXLogger.e("atlas type cast error");
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }

        if (atlasList == null) {
            RXLogger.e("atlas data null");
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }
        List<ShareImageObject> shareImageObjects = new ArrayList<>();
        for (int i = 0; i < atlasList.size(); i++) {
            ShareImageObject shareImageObject = ShareImageObject.fromMap(atlasList.get(i));
            if (!TextUtils.isEmpty(shareImageObject.getImage_url())) {
                shareImageObjects.add(shareImageObject);
            }
        }

        if (shareImageObjects.isEmpty()) {
            RXLogger.e("share atlas params error");
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }
        shareImages(activity, paramsMap, shareImageObjects, callback);
    }

    private void shareImages(Activity activity, Map<String, Object> paramsMap, List<ShareImageObject> shareImageObjects, RXJSONCallback callback) {
        ArrayList<String> localUri = new ArrayList<>();
        AtomicInteger atomicInteger = new AtomicInteger(0);
        for (int i = 0; i < shareImageObjects.size(); ++i) {
            ShareImageObject shareImageObject = shareImageObjects.get(i);
            if (shareImageObject.getImage_url().startsWith("http")) {
                ImageUtils.getNetBitmap(activity,
                        shareImageObject.getImage_url(),
                        shareImageObject.getLanding_url(),
                        shareImageObject.getWidth(),
                        shareImageObject.getHeight(),
                        shareImageObject.getX(),
                        shareImageObject.getY(),
                        new Handler(Looper.getMainLooper()) {
                            @Override
                            public void handleMessage(@NonNull Message msg) {
                                super.handleMessage(msg);
                                if (msg.obj == null) {
                                    RXLogger.e("share file not exist " + shareImageObject.getImage_url());
                                    if (callback != null)
                                        callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                                    return;
                                }
                                String fileUri = (String) msg.obj;
                                File file = new File(fileUri);
                                if (file.exists()) {
                                    Uri uf = RXFileProvider.grantUri(activity, file, "com.zhiliaoapp.musically", "com.ss.android.ugc.trill");
                                    localUri.add(uf.toString());
                                }
                                if (atomicInteger.addAndGet(1) >= (shareImageObjects.size())) {
                                    invokeCallback(paramsMap, activity, localUri, callback);
                                }
                            }
                        });
            } else if (shareImageObject.getImage_url().startsWith("content")) {
                // 这里如果 uri 形如 content://com.miui.gallery.open/raw/aaa.jpg 用 RXFileProvider.grantUri 获取的 uri，分享后 tiktok 解析 resource failed
                // 经测试，这种情况，直接就用原本的 uri 解析即可分享，无需 RXFileProvider
                File file = MediaUtils.saveContentLocally(activity, shareImageObject.getImage_url());
                if (file == null || !file.exists()) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                    return;
                }
                Uri uf = RXFileProvider.grantUri(activity, file, "com.zhiliaoapp.musically", "com.ss.android.ugc.trill");
                localUri.add(uf.toString());
                if (atomicInteger.addAndGet(1) >= (shareImageObjects.size())) {
                    invokeCallback(paramsMap, activity, localUri, callback);
                    break;
                }
            } else {
                Uri uf = RXFileProvider.grantUri(activity, new File(shareImageObject.getImage_url()), "com.zhiliaoapp.musically", "com.ss.android.ugc.trill");
                localUri.add(uf.toString());
                if (atomicInteger.addAndGet(1) >= (shareImageObjects.size())) {
                    invokeCallback(paramsMap, activity, localUri, callback);
                    break;
                }
            }
        }
    }

    private void invokeCallback(Map<String, Object> paramsMap, Activity activity, ArrayList<String> localUri, RXJSONCallback callback) {
        String type = (String) paramsMap.get("material_type");
        String clientKey = (String) paramsMap.get("clientKey");
        // 这里保持原有逻辑，但如果参数中没有 clientKey，这里用项目配置的 clientKey
        if (clientKey == null) {
            clientKey = this.clientKey;
        }
        if (TiktokSdkHelper.isSupport(type) && TiktokSdkHelper.share(activity, clientKey, Objects.requireNonNull(type), localUri, ObjectUtils.toInt(paramsMap.get("format")))) {
            shareCallback = callback;
//            callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject());
        } else {
            RXLogger.e("nonsupport share type " + type);
            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
        }
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.TIKTOK;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

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
    public String getName() {
        return NAME;
    }


    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    private RXJSONCallback loginCallback = null;
    private String codeVerifier = null;

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        boolean isInstalled = TiktokSdkHelper.isInstalled(activity);
        authApi = new AuthApi(activity);
        String scope = "user.info.basic";
        codeVerifier = PKCEUtils.INSTANCE.generateCodeVerifier();
        loginCallback = callback;
        AuthRequest request = new AuthRequest(clientKey, scope, redirectUrl, codeVerifier, false, null, null);
        authApi.authorize(request, isInstalled ? AuthApi.AuthMethod.TikTokApp : AuthApi.AuthMethod.ChromeTab);
        return true;
    }

    public void onLoginResp(Intent intent) {
        if (intent == null || authApi == null) {
            RXLogger.e("tiktok onLoginResp intent or authApi is null, please check it.");
            resetOnLoginRespParams();
            return;
        }

        AuthResponse resp = authApi.getAuthResponseFromIntent(intent, redirectUrl);
        if (resp == null) {
            RXLogger.e("tiktok login error resp is null");
            if (loginCallback != null) {
                loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            }
            resetOnLoginRespParams();
            return;
        }

        if (TextUtils.isEmpty(resp.getAuthCode())) {
            RXLogger.e("tiktok login error code:" + resp.getErrorCode() + ", message:" + resp.getErrorMsg());
            if (loginCallback != null) {
                loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            }
            resetOnLoginRespParams();
        }

        RXLogger.i("tiktok get oauth code:" + resp.getAuthCode());
        Map<String, String> extMap = new HashMap<>();
        extMap.put("code", resp.getAuthCode());
        extMap.put("code_verifier", codeVerifier);
        if (loginCallback != null) {
            loginCallback.onSuccess(new JSONObject(extMap));
        }
        resetOnLoginRespParams();
    }

    private void resetOnLoginRespParams() {
        loginCallback = null;
        codeVerifier = null;
        authApi = null;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
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
