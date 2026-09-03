package com.ruixue.sdk.facebook;

import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.AccessToken;
import com.facebook.LoginStatusCallback;
import com.facebook.login.LoginManager;
import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
public class FacebookSdkHelper {

    public static AccessToken getCurrentAccessToken() {
        return AccessToken.getCurrentAccessToken();
    }

    /**
     * 检查登录状态
     */
    public static boolean isLoggedIn() {
        AccessToken accessToken = getCurrentAccessToken();
        return accessToken != null && !accessToken.isExpired();
    }

    public static void doLogOut() {
        if (isLoggedIn()) {
            LoginManager.getInstance().logOut();
        }
    }

    //获取已拒绝的权限列表
    public static Set<String> getDeclinedPermissions() {
        if (isLoggedIn()) {
            return getCurrentAccessToken().getDeclinedPermissions();
        } else {
            return null;
        }
    }

    //获取与当前访问口令相关联的权限列表
    public static Set<String> getPermissions() {
        if (isLoggedIn()) {
            return getCurrentAccessToken().getPermissions();
        } else {
            return null;
        }
    }

    public static void retrieveLoginStatus(Context context, RXStringCallback callback) {
        LoginManager.getInstance().retrieveLoginStatus(context, new LoginStatusCallback() {

            @Override
            public void onCompleted(@NonNull AccessToken accessToken) {
                // User was previously logged in, can log them in directly here.
                // If this callback is called, a popup notification appears that says
                // "Logged in as <User Name>"
                RXLogger.e("onCompleted");
                 callback.onSuccess(new Gson().toJson(accessToken));
            }
            @Override
            public void onFailure() {
                // No access token could be retrieved for the user
                RXLogger.e("onFailure");
                callback.onFailed(-1,"No access token could be retrieved for the user","");
            }

            @Override
            public void onError(@NonNull Exception exception) {
                exception.printStackTrace();
                callback.onError(new RXException(exception));
                // An error occurred
            }
        });
    }
}
