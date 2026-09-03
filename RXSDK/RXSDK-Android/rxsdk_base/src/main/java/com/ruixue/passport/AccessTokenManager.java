package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

class AccessTokenManager {

    private static AccessTokenManager instanceField;

    public static AccessTokenManager getInstance() {
        AccessTokenManager instance = instanceField;
        if (instance == null) {
            synchronized (AccessTokenManager.class) {
                if (instanceField == null) {
                    instanceField = new AccessTokenManager();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    private final AtomicBoolean tokenRefreshInProgress = new AtomicBoolean(false);


    public JSONObject refreshCurrentAccessToken(@NonNull String refreshToken, RXJSONCallback callback) {
        if (!tokenRefreshInProgress.compareAndSet(false, true)) {
            return JSONUtil.toJSONObject(RXErrorCode.TOKEN_ERROR.getValue(), "Refresh token already in progress");
        } else if (TextUtils.isEmpty(refreshToken)) {
            return JSONUtil.toJSONObject(RXErrorCode.TOKEN_ERROR.getValue(), "Refresh Token null error");
        }
        tokenRefreshInProgress.set(true);
        RXRequest request = RXRequest.create(RXApiPath.Passport.REFRESH_TOKEN).addHeaders("ruixue-refreshtoken", refreshToken);
        tokenRefreshInProgress.set(false);
        return request.post(callback);
    }

    public void refreshCurrentAccessTokenAsync(@NonNull String refreshToken, RXJSONCallback callback) {
        if (!tokenRefreshInProgress.compareAndSet(false, true)) {
            if (null != callback) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.TOKEN_ERROR.getValue(), "Refresh token already in progress!"));
            }
            return;
        }
        tokenRefreshInProgress.set(true);
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                refreshCurrentAccessToken(refreshToken, callback);
                tokenRefreshInProgress.set(false);
            }
        });
    }

    public void currentAccessTokenChanged(AccessToken oldAccessToken, AccessToken currentAccessToken) {
        if (!Objects.equals(oldAccessToken, currentAccessToken)) {
            notifyCurrentAccessTokenChanged(oldAccessToken, currentAccessToken);
            setTokenExpirationBroadcastAlarm();
        }
    }

    //token 过期报警
    public void setTokenExpirationBroadcastAlarm() {

    }

    private void notifyCurrentAccessTokenChanged(AccessToken oldAccessToken, AccessToken currentAccessToken) {
        RuiXueSdk.notifyAccessTokenChanged(oldAccessToken, currentAccessToken);
    }
}
