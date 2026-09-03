package com.ruixue.sdk.instagram;

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
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.RXFileProvider;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2024/4/7.
public class InstagramSdkWrapper extends ShareApi implements IPluginSdk {

    private static final String TAG = InstagramSdkWrapper.class.getSimpleName();
    public static final String NAME = "instagram";

    private static final String TYPE_IMAGE = "image/*";
    private static final String TYPE_VIDEO = "video/*";

    private static final int AUTH_REQUEST_CODE = RuiXueSdk.DEFAULT_CALLBACK_REQUEST_CODE_OFFSET + 30;

    static class Single {
        final static InstagramSdkWrapper INSTANCE = new InstagramSdkWrapper();
    }

    private InstagramSdkWrapper() {
    }

    public static InstagramSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private String clientId;
    private String redirectUrl;

    @Override
    public void onApplicationCreate(Application application) {
        try {
            ApplicationInfo appInfo = application.getPackageManager().getApplicationInfo(application.getPackageName(), PackageManager.GET_META_DATA);
            Bundle metaData = appInfo.metaData;
            clientId = metaData.getString("com.ruixue.sdk.instagram.clientId");
            redirectUrl = metaData.getString("com.ruixue.sdk.instagram.redirectUrl");
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {

        return true;
    }

    private RXJSONCallback loginCallback;

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        this.loginCallback = callback;
        Bundle bundle = AuthenticationActivity.generateExtra(clientId, redirectUrl);
        Intent intent = new Intent(activity, AuthenticationActivity.class);
        intent.putExtras(bundle);
        activity.startActivityForResult(intent, AUTH_REQUEST_CODE);
        return true;
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == AUTH_REQUEST_CODE) {
            handleLoginResult(resultCode, data);
        }
    }

    private void handleLoginResult(int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_CANCELED) {
            RXLogger.e("instagram login cancel");
            if (loginCallback != null) {
                loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_CANCEL));
                loginCallback = null;
            }
            return;
        }

        if (data == null) {
            RXLogger.e("instagram login data null");
            if (loginCallback != null) {
                loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
                loginCallback = null;
            }
            return;
        }

        String dataStr = data.getStringExtra("data");
        if (TextUtils.isEmpty(dataStr)) {
            RXLogger.e("instagram login error callback data is null");
            if (loginCallback != null) {
                loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
                loginCallback = null;
            }
            return;
        }

        JSONObject json = JSONUtil.toJSONObject(dataStr);
        int code = json.optInt("code");

        if (code != 0) {
            RXLogger.e("instagram login error " + json);
            if (loginCallback != null) {
                loginCallback.onFailed(json);
                loginCallback = null;
            }
            return;
        }

        String authCode = json.optString("authCode");
        if (TextUtils.isEmpty(authCode)) {
            RXLogger.e("instagram login error auth code is null");
            if (loginCallback != null) {
                loginCallback.onFailed(json);
                loginCallback = null;
            }
            return;
        }

        RXLogger.d(TAG, "instagram login success code:" + authCode);
        Map<String, String> extMap = new HashMap<>();
        extMap.put("code", authCode);
        if (loginCallback != null) {
            loginCallback.onSuccess(new JSONObject(extMap));
            loginCallback = null;
        }
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
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
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        if (!isInstagramInstalled(activity)) {
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL));
            return true;
        }
        ShareObject shareObject = ShareObject.fromMap(paramsMap);
        if (shareObject.getType().equals(ShareMediaType.IMAGE)) {
            // 分享图片
            shareImageOrVideo(activity, shareObject.getImage(), true, callback);
        } else if (shareObject.getType().equals(ShareMediaType.VIDEO)) {
            // 分享视频 有问题待调研
            String videoUri = (String) paramsMap.get("video");
            // 这里做一下兼容，如果没有 video 字段，还和老逻辑一样取 url 字段
            if (TextUtils.isEmpty(videoUri)) {
                videoUri = shareObject.getUrl();
            }
            shareImageOrVideo(activity, videoUri, false, callback);
        } else {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            RXLogger.i("this is unsupport type :" + shareObject.getType());
        }
        return true;
    }

    private void shareImageOrVideo(Activity activity, String uri, boolean isImage, RXJSONCallback callback) {
        String mediaName = (isImage ? "image" : "video");
        if (TextUtils.isEmpty(uri)) {
            RXLogger.e("share " + mediaName + " is null");
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            return;
        }

        asyncGetFile(activity, uri, new GetFileCallback() {
            @Override
            public void onLoadSuccess(@NonNull File file) {
                Uri uri = RXFileProvider.grantUri(activity, file, "com.instagram.android");
                shareImageOrVideo(activity, uri, isImage, callback);
            }

            @Override
            public void onFailed(JSONObject cause) {
                RXLogger.e("instagram share " + mediaName + " error " + cause);
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
        });
    }

    private void shareImageOrVideo(Activity activity, Uri uri, boolean isImage, RXJSONCallback callback) {
        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setPackage("com.instagram.android");
            shareIntent.setDataAndType(uri, isImage ? TYPE_IMAGE : TYPE_VIDEO);
            shareIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
            activity.startActivity(shareIntent);

            // 由于 instagram 分享没有任何回调，所以这里直接回调成功，下边 video 一样处理
            if (callback != null) {
                callback.onSuccess(null);
            }
        } catch (Exception e) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            RXLogger.e("share image failed");
        }
    }

    private void asyncGetFile(Activity activity, String uri, @NonNull GetFileCallback callback) {
        if (uri.startsWith("http")) {
            MediaUtils.getNetSource(activity, uri, new Handler(Looper.getMainLooper()) {
                @Override
                public void handleMessage(@NonNull Message msg) {
                    super.handleMessage(msg);
                    File file = (File) msg.obj;
                    callback.onLoadSuccess(file);
                }
            });
        } else if (uri.startsWith("content")) {
            File file = MediaUtils.saveContentLocally(activity, uri);
            if (file == null || !file.exists()) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                return;
            }
            callback.onLoadSuccess(file);
        } else {
            File file = new File(uri);
            if (!file.exists()) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                return;
            }
            callback.onLoadSuccess(file);
        }
    }

    private interface GetFileCallback {

        void onLoadSuccess(@NonNull File file);

        void onFailed(JSONObject cause);
    }

    private boolean isInstagramInstalled(Activity activity) {
        PackageManager pm = activity.getPackageManager();
        try {
            pm.getPackageInfo("com.instagram.android", PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.INSTAGRAM;
    }

    @Override
    public void attachBaseContext(Context context) {

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

}
