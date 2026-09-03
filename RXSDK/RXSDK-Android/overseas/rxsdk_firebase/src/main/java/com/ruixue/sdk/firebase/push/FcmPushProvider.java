package com.ruixue.sdk.firebase.push;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.ruixue.logger.RXLogger;
import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.ICallbackResult;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;

public class FcmPushProvider implements IPushProvider {
    private static final String TAG = FcmPushProvider.class.getSimpleName();
    private static final String PUSH_BRAND = "fcmpush";
    private Context mContext;

    private static ICallbackResult<TokenResult> smResultCallback = null;
    private static String smDeviceToken = "";

    @NonNull
    public <T> T checkNotNull(final T obj) {
        if (obj == null) {
            throw new NullPointerException();
        }
        return obj;
    }

    public Context getContext() {
        return checkNotNull(this.mContext);
    }

    public static void callUpdateToken(String token) {
        smDeviceToken = token;
        RXLogger.i("callUpdateToken " + token + "smResultCallback " + (smResultCallback == null));
        if (null != smResultCallback) {
            smResultCallback.onResult(new TokenResult(token, PUSH_BRAND, TextUtils.isEmpty(token) ? TokenResult.ResultCode.ERROR : TokenResult.ResultCode.OK));
            smResultCallback = null;
        }
    }

    @Override
    public boolean init(@NonNull Context context) {
        this.mContext = context;
        return true;
    }

    @Override
    public boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback) {
        String taskId = "";
        if (intent.getExtras() != null) {
            Object tid= intent.getExtras().get(KEY_TASK_ID);
            taskId = (tid != null) ? String.valueOf(tid) : null;
        }

        if (!TextUtils.isEmpty(taskId)) {
            if (null != callback) {
                TokenResult result = new TokenResult.Builder().brandName(PUSH_BRAND).token(this.getDeviceToken()).taskId(taskId).resultCode(TokenResult.ResultCode.OK).build();
                callback.onResult(result);
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void registerToken(RegisterCallback callback) {
        smResultCallback = callback;
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
            @Override
            public void onComplete(@NonNull Task<String> task) {
                if (!task.isSuccessful()) {
                    PushLog.w("Fetching FCM registration token failed", task.getException());
                    if (null != callback) {
                        callback.onResult(new TokenResult(null, PUSH_BRAND, TokenResult.ResultCode.ERROR));
                    }
                    smResultCallback = null;
                    return;
                }
                // Get new FCM registration token
                String token = task.getResult();
                callUpdateToken(token);
                PushLog.d("deviceToken:" + token);
            }
        });
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        smDeviceToken = null;
        FirebaseMessaging.getInstance().deleteToken();
    }

    @Override
    public String getDeviceToken() {
        return smDeviceToken;
    }

    @Override
    public void turnOnPush() {
        this.registerToken(null);
    }

    @Override
    public void turnOffPush() {
        this.unRegisterToken(null);
    }

    /**
     * 判断当前设备是否支持 FCM 推送。
     *
     * <p>依次检查两个前置条件，<b>必须全部满足</b>才返回 {@code true}：
     * <ol>
     *     <li>{@link GoogleApiAvailability} 认为 Google Play services 可用
     *     （国内无 GMS 的设备会在这一步返回 false）；</li>
     *     <li>默认 {@link com.google.firebase.FirebaseApp} 已初始化，即业务方 app 模块提供了
     *     {@code google-services.json} 且 apply 了 {@code com.google.gms.google-services}
     *     插件；缺失时 {@link FirebaseMessaging#getInstance()} 会抛
     *     {@link IllegalStateException}。</li>
     * </ol>
     *
     * <p>任一失败都通过 {@link PushLog#e(String, Object...)} 打 error 级日志，
     * 覆盖 release 场景，便于业务方从日志定位根因。
     *
     * <p>历史实现使用 {@link FirebaseMessaging#isNotificationDelegationEnabled()}，
     * 该 API 只代表"是否允许其它 app 代为展示通知"，与 FCM 本身是否可用无关，
     * 存在语义误判；此处替换为 GMS + FirebaseApp 双重判断。
     */
    @Override
    public boolean isSupport() {
        if (mContext == null) {
            PushLog.e("FCM unsupported: context is null, init(context) not called");
            return false;
        }
        try {
            int availability = GoogleApiAvailability.getInstance()
                    .isGooglePlayServicesAvailable(mContext);
            if (availability != ConnectionResult.SUCCESS) {
                PushLog.e("FCM unsupported: Google Play services unavailable, code=" + availability
                        + " (" + GoogleApiAvailability.getInstance().getErrorString(availability) + ")");
                return false;
            }
        } catch (Throwable t) {
            PushLog.e("FCM unsupported: failed to query Google Play services availability, " + t);
            return false;
        }
        try {
            FirebaseMessaging.getInstance();
            return true;
        } catch (IllegalStateException e) {
            PushLog.e("FCM unsupported: Default FirebaseApp is not initialized. "
                    + "Check google-services.json and apply plugin 'com.google.gms.google-services' "
                    + "in the app module. " + e.getMessage());
            return false;
        } catch (Throwable t) {
            PushLog.e("FCM unsupported: FirebaseMessaging.getInstance() failed, " + t);
            return false;
        }
    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

    @Override
    public void bindAlias(@NonNull String alias) {

    }

    @Override
    public void unBindAlias(@NonNull String alias) {

    }
}
