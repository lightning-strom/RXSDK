package com.ruixue.sdk.snapchat;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
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
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.JSONUtil;
import com.snap.corekit.SnapKit;
import com.snap.corekit.utils.SnapConstants;
import com.snap.corekit.utils.SnapUtils;
import com.snap.creativekit.SnapCreative;
import com.snap.creativekit.api.SnapCreativeKitApi;
import com.snap.creativekit.api.SnapCreativeKitCompletionCallback;
import com.snap.creativekit.api.SnapCreativeKitSendError;
import com.snap.creativekit.media.SnapMediaFactory;
import com.snap.creativekit.media.SnapPhotoFile;
import com.snap.creativekit.media.SnapVideoFile;
import com.snap.creativekit.models.SnapPhotoContent;
import com.snap.creativekit.models.SnapVideoContent;
import com.snap.loginkit.LoginResultCallback;
import com.snap.loginkit.SnapLogin;
import com.snap.loginkit.SnapLoginProvider;
import com.snap.loginkit.exceptions.LoginException;

import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2024/4/1.
public class SnapchatSdkWrapper extends ShareApi implements IPluginSdk {

    public static final String NAME = "snapchat";


    static class Single {
        final static SnapchatSdkWrapper INSTANCE = new SnapchatSdkWrapper();
    }

    private SnapchatSdkWrapper() {
    }

    public static SnapchatSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void onApplicationCreate(Application application) {

    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        SnapLogin snapLogin = SnapLoginProvider.get(activity);
        snapLogin.startTokenGrant(new LoginResultCallback() {
            @Override
            public void onStart() {
            }

            @Override
            public void onSuccess(@NonNull String accessToken) {
                if (TextUtils.isEmpty(accessToken)) {
                    // login error unknown
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
                    return;
                }

                RXLogger.d(" snapchat login success:" + accessToken);
                Map<String, String> extMap = new HashMap<>();
                extMap.put("access_token", accessToken);
                callback.onSuccess(new JSONObject(extMap));
            }

            @Override
            public void onFailure(@NonNull LoginException e) {
                RXLogger.i("snapchat login failed errorCode:" + e.getStatusCode() + ", message:" + e.getMessage());
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            }
        });
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        SnapLoginProvider.get(activity).clearToken();
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
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        if (!SnapUtils.isSnapchatInstalled(activity.getPackageManager(), SnapConstants.SNAPCHAT_APP_PACKAGE_NAME)) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL));
            }
            return true;
        }
        ShareObject shareObject = ShareObject.fromMap(paramsMap);
        if (ShareMediaType.IMAGE.equals(shareObject.getType())) {
            doShareImage(activity, shareObject, callback);
        } else {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            RXLogger.i("this is unsupport type :" + shareObject.getType());
        }
        return true;
    }

    private void doShareImage(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        if (TextUtils.isEmpty(shareObject.getImage())) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }

        if (shareObject.getImage().startsWith("http")) {
            ImageUtils.getNetBitmap(activity,
                    shareObject.getImage(),
                    shareObject.getUrl(),
                    shareObject.getWidth(),
                    shareObject.getHeight(),
                    shareObject.getX(),
                    shareObject.getY(),
                    new Handler(Looper.getMainLooper()) {
                        @Override
                        public void handleMessage(@NonNull Message msg) {
                            super.handleMessage(msg);
                            if (msg.obj == null) {
                                RXLogger.e("share file not exist " + shareObject.getImage());
                                if (callback != null)
                                    callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                                return;
                            }
                            String fileUri = (String) msg.obj;
                            File file = new File(fileUri);
                            if (!file.exists()) {
                                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                                return;
                            }
                            doShareImage(activity, file, callback);
                        }
                    });
        } else if (shareObject.getImage().startsWith("content")) {
            File file = MediaUtils.saveContentLocally(activity, shareObject.getImage());
            if (file == null || !file.exists()) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                return;
            }
            doShareImage(activity, file, callback);
        } else {
            File file = new File(shareObject.getImage());
            if (!file.exists()) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                return;
            }
            doShareImage(activity, file, callback);
        }
    }

    private void doShareImage(Activity activity, File file, RXJSONCallback callback) {
        SnapMediaFactory snapMediaFactory = SnapCreative.getMediaFactory(activity);
        SnapPhotoFile photoFile = snapMediaFactory.getSnapPhotoFromFile(file);
        SnapPhotoContent photoContent = new SnapPhotoContent(photoFile);
        SnapCreativeKitApi creativeKitApi = SnapCreative.getApi(activity);
        creativeKitApi.sendWithCompletionHandler(photoContent, new MySnapCreativeKitCompletionCallback(callback));
    }

    private void doShareVideo(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        String videoUri = (String) paramsMap.get("video");
        if (TextUtils.isEmpty(videoUri)) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            }
            return;
        }

        asyncGetFile(activity, videoUri, new GetFileCallback() {
            @Override
            public void onLoadSuccess(@NonNull File file) {
                doShareVideo(activity, file, callback);
            }

            @Override
            public void onFailed(JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    private void doShareVideo(Activity activity, File file, RXJSONCallback callback) {
        SnapMediaFactory snapMediaFactory = SnapCreative.getMediaFactory(activity);
        SnapVideoFile videoFile = snapMediaFactory.getSnapVideoFromFile(file);
        SnapVideoContent videoContent = new SnapVideoContent(videoFile);
        SnapCreativeKitApi creativeKitApi = SnapCreative.getApi(activity);
        creativeKitApi.sendWithCompletionHandler(videoContent, new MySnapCreativeKitCompletionCallback(callback));
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

    private static class MySnapCreativeKitCompletionCallback implements SnapCreativeKitCompletionCallback {

        private final RXJSONCallback callback;

        public MySnapCreativeKitCompletionCallback(RXJSONCallback callback) {
            this.callback = callback;
        }

        @Override
        public void onSendSuccess() {
            if (callback != null) {
                callback.onSuccess(null);
            }
        }

        @Override
        public void onSendFailed(SnapCreativeKitSendError snapCreativeKitSendError) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), snapCreativeKitSendError.name()));
            }
        }
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.SNAPCHAT;
    }

    // unused override methods

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
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        SnapKit.initSDK(context.getApplicationContext());
        return true;
    }

}
