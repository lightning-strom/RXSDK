package com.ruixue.sdk.reddit;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import cz.msebera.android.httpclient.Header;

public class RedditSdkWrapper extends ShareApi implements IPluginSdk {

    private final static String TAG = "RedditSdkWrapper";

    private final static String OAUTH_URL ="https://www.reddit.com/api/v1/authorize.compact";
    private final static String ACCESS_TOKEN = "https://www.reddit.com/api/v1/access_token";
    private final static String SHARE = "https://oauth.reddit.com/api/submit";
    private final static String OAUTH_SCOPE="identity, submit";
    private String mRedditClientId = "";
    private String mRedditRedirectUri = "";
    private RXJSONCallback mLoginCallback;
    private RXJSONCallback mShareCallback;


    static class Single {
        final static RedditSdkWrapper INSTANCE = new RedditSdkWrapper();
    }

    private RedditSdkWrapper() {
    }

    public static RedditSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        mRedditClientId = (String) paramsMap.get("reddit_clientid");
        mRedditRedirectUri = (String) paramsMap.get("reddit_redirecturi");
        return  true;
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        this.mLoginCallback = callback;
        if (TextUtils.isEmpty(mRedditClientId) || TextUtils.isEmpty(mRedditRedirectUri)) {
            Log.d(TAG, "没有初始化");
            if (mLoginCallback != null) {
                mLoginCallback.onFailed(
                        JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                                "没有初始化")
                );
            }
            return false;
        }
        UUID deviceUuid = UUID.randomUUID();
        String url = OAUTH_URL + "?client_id=" + mRedditClientId +
                "&response_type=token&state="+ deviceUuid +"&redirect_uri=" +
                mRedditRedirectUri + "&scope=" + OAUTH_SCOPE;


        Intent intent = new Intent(activity, RedditLoginWebviewActivity.class);
        intent.putExtra("url", url);
        activity.startActivityForResult(intent, 3000);
        return true;

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        if (requestCode == 3000 && resultCode == RXErrorCode.SHARE_CANCEL.getValue()) {

            String access_token = data.getStringExtra("access_token");
            String expires_in = data.getStringExtra("expires_in");

            if (!TextUtils.isEmpty(access_token) && !TextUtils.isEmpty(expires_in)) {

                Log.d(TAG, "当前线程: " + Thread.currentThread().getName());
                long currenttime = System.currentTimeMillis()/1000;


                Log.d(TAG, "access token value:" + access_token);
                Log.d(TAG, "expires in value:" + expires_in);

                SharedPreferences mSharedpref = activity.getSharedPreferences(
                        "reddit_token",
                        Context.MODE_PRIVATE
                );
                SharedPreferences.Editor edit = mSharedpref.edit();
                edit.putString("access_token", access_token);
                edit.putString("expires_in", expires_in);
                edit.putLong("timestamp", currenttime);
                edit.commit();

                if (mLoginCallback != null) {
                    Map<String, String> hashMap = new HashMap<>();
                    hashMap.put("access_token", access_token);
                    hashMap.put("redirect_uri", mRedditRedirectUri);
                    mLoginCallback.onSuccess(new JSONObject(hashMap));
                }

            }else {
                if (mLoginCallback != null) {
                    mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR));
                }
            }
        }else if (requestCode == 3000 && resultCode == 6000) {
            if (mLoginCallback != null) {
                mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_CANCEL));
            }
        }
    }

    private void getAccessToken(Activity activity, String authCode) {
        if (TextUtils.isEmpty(mRedditClientId) || TextUtils.isEmpty(mRedditRedirectUri)
                || TextUtils.isEmpty(authCode)) {
            if (mLoginCallback != null) {
                mLoginCallback.onFailed(
                        JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                                "没有初始化")
                );
            }
            return;
        }
        AsyncHttpClient asyncHttpClient = new AsyncHttpClient();
        asyncHttpClient.addHeader("User-Agent", "ruixue");
        asyncHttpClient.setBasicAuth(mRedditClientId, "");
        RequestParams requestParams = new RequestParams();
        requestParams.put("code", authCode);
        requestParams.put("grant_type","authorization_code");
        requestParams.put("redirect_uri", mRedditRedirectUri);
        requestParams.put("duration", "permanent");
        asyncHttpClient.post(ACCESS_TOKEN, requestParams, new JsonHttpResponseHandler(){

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {

                Log.d(TAG, "当前线程: " + Thread.currentThread().getName());

                Log.d(TAG, "get token: " + response.toString());

                String access_token = response.optString("access_token");
                String expires_in = response.optString("expires_in");
                long currenttime = System.currentTimeMillis()/1000;


                Log.d(TAG, "access token value:" + access_token);
                Log.d(TAG, "expires in value:" + expires_in);

                SharedPreferences mSharedpref = activity.getSharedPreferences(
                        "reddit_token",
                        Context.MODE_PRIVATE
                );
                SharedPreferences.Editor edit = mSharedpref.edit();
                edit.putString("access_token", access_token);
                edit.putString("expires_in", expires_in);
                edit.putLong("timestamp", currenttime);
                edit.commit();

                if (mLoginCallback != null) {
                    Map<String, String> hashMap = new HashMap<>();
                    hashMap.put("access_token", access_token);
                    hashMap.put("redirect_uri", mRedditRedirectUri);
                    mLoginCallback.onSuccess(new JSONObject(hashMap));
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject jsonObject) {
                Log.d(TAG, "throwable: " + throwable.getMessage() + ", jsonObject: " + jsonObject.toString());
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                if (mLoginCallback != null) {
                    mLoginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR));
                }
            }
        });
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        this.mShareCallback = callback;
        SharedPreferences mSharedpref = activity.getSharedPreferences("reddit_token", Context.MODE_PRIVATE);
        String token = mSharedpref.getString("access_token", "");
        String expires_in = mSharedpref.getString("expires_in", "");
        long lastLoginTime = mSharedpref.getLong("timestamp", 0L);
        if (!getTokenStatus(token, expires_in, lastLoginTime)) {
            doLogin(activity, null, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    submitLink(activity, token, paramsMap);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (mShareCallback != null) {
                        mShareCallback.onFailed(
                                JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                                        "用户验证失败")
                        );
                    }
                }
            });

        }else {
            submitLink(activity, token, paramsMap);
        }
        return true;
    }

    /**
     *
     * @param token
     * @param expires
     * @return true 未失效，false 失效
     */
    public boolean getTokenStatus(String token, String expires, long timestamp) {
        if (TextUtils.isEmpty(token) || TextUtils.isEmpty(expires) || timestamp <= 0) {
            return false;
        }
        try {
            long currentTime = System.currentTimeMillis() / 1000;
            return timestamp + Long.parseLong(expires) >= currentTime;
        }catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private void submitLink(Activity activity, String token, Map<String, Object> paramsMap) {
        AsyncHttpClient asyncHttpClient = new AsyncHttpClient();
        asyncHttpClient.addHeader("User-Agent", "ruixue");
        asyncHttpClient.addHeader("Authorization", "bearer " + token);

        asyncHttpClient.setEnableRedirects(true);

        RequestParams requestParams = new RequestParams();

        String type = "";
        try {
            type = paramsMap.get("material_type").toString();
        }catch (Exception e) {
            e.printStackTrace();
        }

        if (ShareMediaType.WEBPAGE.equals(type)) {
            requestParams.put("kind", "link");
            requestParams.put("url", "https://media.w3.org/2010/05/sintel/trailer.mp4");
        }else if (ShareMediaType.TEXT.equals(type)) {
            requestParams.put("kind", "self");
            requestParams.put("text", "发表一个文本分享");
        }

        requestParams.put("title", "Look at video!");
        requestParams.put("sr", "programming");

        asyncHttpClient.post(activity, SHARE, requestParams, new JsonHttpResponseHandler(){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {

                Log.d(TAG, "submit success: " + response.toString());
                if (mShareCallback != null) {
                    mShareCallback.onSuccess(response);
                }

            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString,
                                  Throwable throwable) {
                if (mShareCallback != null) {
                    mShareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR));
                }
            }
        });
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.REDDIT;
    }

    @Override
    public void onShareActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onShareActivityResult(activity, requestCode, resultCode, data);
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
        return "reddit";
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
}
