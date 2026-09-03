package com.ruixue.sdk.facebook;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.activity.result.ActivityResultRegistryOwner;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.facebook.AccessToken;
import com.facebook.AccessTokenTracker;
import com.facebook.AuthenticationToken;
import com.facebook.FacebookAuthorizationException;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.model.ShareContent;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.utils.JSONUtil;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
//https://developers.facebook.com/docs/facebook-login/android
public class FacebookSdkWrapper extends ShareApi implements IPluginSdk, IFacebookShare {
    public static final String NAME = "facebook";

    static class Single {
        final static FacebookSdkWrapper INSTANCE = new FacebookSdkWrapper();
    }

    private Map<String, IFacebookShare> mShareImpl = new HashMap<>();

    private FacebookSdkWrapper() {
        mShareImpl.put(PlatformType.FACEBOOK.getKeyword(), FacebookShareImpl.getInstance());
        mShareImpl.put(PlatformType.MESSENGER.getKeyword(), MessengerShareImpl.getInstance());
        mShareImpl.put(PlatformType.INSTAGRAM.getKeyword(), InstagramShareImpl.getInstance());
    }

    private IFacebookShare getShareInstance(String platform) {
        return mShareImpl.get(platform);
    }

    private IFacebookShare getShareInstance() {
        return mShareImpl.get(NAME);
    }

    public static FacebookSdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {

        if (paramsMap != null && paramsMap.containsKey("appid")) {
            String appid = (String) paramsMap.get("appid");
            if (!TextUtils.isEmpty(appid)) {
                FacebookSdk.setApplicationId(appid);
            }
            FacebookSdk.setClientToken((String) paramsMap.get("clientToken"));
//            FacebookSdk.sdkInitialize(context);
        }


//        AppLinkData.fetchDeferredAppLinkData(context, new AppLinkData.CompletionHandler() {
//            @Override
//            public void onDeferredAppLinkDataFetched(@Nullable AppLinkData appLinkData) {
//
//            }
//        });
//         AppEventsLogger.activateApp(context);
//        FacebookSdk.fullyInitialize();
//        Uri targetUrl =AppLinks.getTargetUrlFromInboundIntent(this, getIntent());
        //初始化Facebook SDK
//        if (BuildConfig.DEBUG) {
//            FacebookSdk.setIsDebugEnabled(true);
//            FacebookSdk.addLoggingBehavior(LoggingBehavior.INCLUDE_ACCESS_TOKENS);
////            FacebookSdk.addLoggingBehavior(LoggingBehavior.APP_EVENTS);
//        }

        AccessTokenTracker accessTokenTracker = new AccessTokenTracker() {
            @Override
            protected void onCurrentAccessTokenChanged(AccessToken oldAccessToken, AccessToken currentAccessToken) {
                RXLogger.i("facebook onCurrentAccessTokenChanged old:" + oldAccessToken + " new :" + currentAccessToken);
            }
        };
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
        FacebookSdkHelper.doLogOut();
        if (FacebookSdkHelper.isLoggedIn()) {
            if (hashMap.containsKey("client_get_info"))
                getUserInfo(callback);
            else {
                invokeCallback(extMap, AccessToken.getCurrentAccessToken(),
                        AuthenticationToken.getCurrentAuthenticationToken(), callback);
            }
        } else {
            String[] permissions = null;
            if (hashMap.get("permission") instanceof String[]) {
                permissions = (String[]) hashMap.get("permission");
            }
            if (permissions == null || permissions.length == 0) {
                permissions = new String[]{"public_profile", "email"};
            }
            LoginManager.getInstance().registerCallback(sCallbackManager, new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    RXLogger.d("登录成功: " + loginResult.getAccessToken().getToken());
//                        loginResult.getAccessToken().getApplicationId();
//                        loginResult.getAccessToken().getUserId();
                    if (hashMap.containsKey("client_get_info")) {
                        getUserInfo(callback);
                    } else {
                        invokeCallback(extMap, loginResult.getAccessToken(),
                                loginResult.getAuthenticationToken(), callback);
                    }
                }

                @Override
                public void onCancel() {
                    RXLogger.d("登录取消");
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_CANCEL));
                }

                @Override
                public void onError(@NonNull FacebookException error) {
                    RXLogger.e("onError：" + error.toString());  //CONNECTION_FAILURE
                    if (error instanceof FacebookAuthorizationException) {
                        if (AccessToken.getCurrentAccessToken() != null) {
                            LoginManager.getInstance().logOut();
                        }
                    }
                    callback.onError(new RXException(error));
                }
            });

            // 发起登录, 第二个参数表示登录需要获取哪些facebook权限
            if (activity instanceof ActivityResultRegistryOwner) {
                LoginManager.getInstance().logInWithReadPermissions((ActivityResultRegistryOwner) activity, sCallbackManager, Arrays.asList(permissions));
            } else {
                LoginManager.getInstance().logInWithReadPermissions(activity, Arrays.asList(permissions));
            }
        }
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    private void invokeCallback(Map<String, Object> extMap, AccessToken accessToken,
                                AuthenticationToken authenticationToken, @NonNull RXJSONCallback callback) {
        Map<String, Object> map = extMap == null ? new HashMap<>() : extMap;
        if (authenticationToken != null) {
            map.put("authentication_token", authenticationToken.getToken());
        }
        if (accessToken != null) {
            map.put("access_token", accessToken.getToken());
            map.put("app_id", accessToken.getApplicationId());
            map.put("user_id", accessToken.getUserId());
            map.put("access_expires", accessToken.getExpires().getTime());
            map.put("permissions", accessToken.getPermissions());
            callback.onSuccess(JSONUtil.toJSONObject(map));
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "error facebook accessToken is null"));
        }
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        RXLogger.i("facebook sdk logout.");
        FacebookSdkHelper.doLogOut();
        if (callback != null)
            callback.onSuccess(null);

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

        if (FacebookSdk.isFacebookRequestCode(requestCode)||(requestCode & 0xFFFF0000) == 0xFACE0000) {
            RXLogger.i("isFacebookRequestCode:" + requestCode);
            sCallbackManager.onActivityResult(requestCode, resultCode, data);
        } else if (iFacebookShare != null) {
            iFacebookShare.onActivityResult(activity, requestCode, resultCode, data);
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

    IFacebookShare iFacebookShare;

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        try {
            iFacebookShare = getShareInstance((String) paramsMap.get("platform"));
            Objects.requireNonNull(iFacebookShare, "error facebook share instance is null ").doShare(activity, paramsMap, callback);
        } catch (Exception e) {
            e.printStackTrace();
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }
        return true;
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.FACEBOOK;
    }

    //登录后调用 需要 accessToken
    //请求个人基本资料
    //请求个人数据，包括，facebookID，昵称，性别，头像。需要相关权限"user_status","user_gender"
    public void getUserInfo(@NonNull RXJSONCallback callback) {
        Bundle param = new Bundle();
//        param.putString("fields", "id,name,email,age_range,first_name,last_name,link,gender,locale,picture");
        param.putString("fields", "id,name,email,picture,link,gender,age_range");
        /*
         * The method that will be called when the request completes.
         *
         * @param obj the GraphObject representing the returned object, or null
         * @param response the Response of this request, which may include error information if the
         * request was unsuccessful
         */
        GraphRequest graphRequest = GraphRequest.newMeRequest(AccessToken.getCurrentAccessToken(), (object, response) -> {
            try {
                if (null == object) {
                    throw new IllegalStateException("the GraphObject representing the returned null object");
                }

                object.put("authentication_token", AuthenticationToken.getCurrentAuthenticationToken().getToken());
                object.put("url", Objects.requireNonNull(Objects.requireNonNull(object.optJSONObject("picture")).optJSONObject("data")).optString("url"));
                object.put("access_token", Objects.requireNonNull(AccessToken.getCurrentAccessToken()).getToken());
                object.remove("picture");
                object.remove("__debug__");
                RXLogger.i(object.toString());
                callback.onSuccess(object);
            } catch (Exception e) {
                e.printStackTrace();
                FacebookSdkHelper.doLogOut();
                callback.onError(new RXException(e));
            }
        });
        graphRequest.setParameters(param);
        graphRequest.executeAsync();
    }


    /**
     * 分享链接
     * @param activity 应用上下文
     * @param url      链接
     * @param callback 分享回调
     */
    @Override
    public void shareLink(Activity activity, @NonNull String url, RXJSONCallback callback) {
        getShareInstance().shareLink(activity, url, null, null, callback);
    }

    /**
     * 分享链接
     * @param activity activity
     * @param url      链接
     * @param hashTag  话题标签
     * @param callback 分享回调
     */
    @Override
    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, RXJSONCallback callback) {
        getShareInstance().shareLink(activity, url, hashTag, null, callback);
    }

    /**
     * 分享链接
     * @param url      链接
     * @param hashTag  话题标签
     * @param quote    引文分享
     * @param callback 分享回调
     */
    @Override
    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, @Nullable String quote, RXJSONCallback callback) {
        getShareInstance().shareLink(activity, url, hashTag, quote, callback);
    }

    @Override
    public void shareImage(Activity activity, FBShareObject shareObject, RXJSONCallback callback) {
        getShareInstance().shareImage(activity, shareObject, callback);
    }

    @Override
    public void shareImage(Activity activity, Bitmap bitmap, RXJSONCallback callback) {
        getShareInstance().shareImage(activity, bitmap, callback);
    }

    @Override
    public void share(Activity activity, ShareContent content) {
        getShareInstance().share(activity, content);
    }

    /**
     * 分享图片
     * @param activity activity
     * @param imgPath  imgPath
     * @param callback callback
     */
    @Override
    public void shareImage(Activity activity, String imgPath, RXJSONCallback callback) {
        getShareInstance().shareImage(activity, imgPath, callback);
    }

    @Override
    public void shareVideo(Activity activity, String videoUrl, RXJSONCallback callback) {
        getShareInstance().shareVideo(activity, videoUrl, callback);
    }

    /**
     * 用户每次可以分享最多包含 6 个照片和视频元素的内容。
     * @param activity 应用上下文
     * @param photos   分享照片列表
     * @param videos   视频 地址 列表
     * @param callback callback
     */
    @Override
    public void shareMedia(Activity activity, List<String> photos, List<String> videos, RXJSONCallback callback) {
        getShareInstance().shareMedia(activity, photos, videos, callback);
    }
}
