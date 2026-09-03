package com.ruixue.push.honor;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;


import com.hihonor.push.sdk.HonorPushCallback;
import com.hihonor.push.sdk.HonorPushClient;
import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.ICallbackResult;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;

import java.lang.reflect.Method;

public class HonorPushProvider implements IPushProvider {
    private static final String PUSH_BRAND = "honorpush";
    private Context mContext;
    private boolean mIsInit = false;
    private static ICallbackResult<TokenResult> smResultCallback = null;
    private static String smDeviceToken = "";


    public <T> T checkNotNull(final T obj) {
        if (obj == null) {
            throw new NullPointerException();
        }
        return obj;
    }

    public Context getContext() {
        return checkNotNull(this.mContext);
    }

    public static void callUpdateToken(Context context, String token) {
        smDeviceToken = token;
        if (null != smResultCallback) {
            smResultCallback.onResult(new TokenResult(token, PUSH_BRAND, TextUtils.isEmpty(token) ? TokenResult.ResultCode.ERROR : TokenResult.ResultCode.OK));
            smResultCallback = null;
        }
    }

    /**
     * @return 是否初始化
     */
    public boolean isInit() {
        return this.mIsInit;
    }

    @Override
    public boolean init(Context context) {
        this.mContext = context;
//        PushLog.i("push plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
        mIsInit = this.isSupport();
        if (mIsInit) {
            HonorPushClient.getInstance().init(context, true);
        }
        return mIsInit;
    }

    @Override
    public boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback) {
        String taskId = "";
        if (intent.getExtras() != null) {
            Object tid = intent.getExtras().get(KEY_TASK_ID);
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
    public void bindAlias(String alias) {

    }

    @Override
    public void unBindAlias(String alias) {

    }

    @Override
    public void registerToken(RegisterCallback callback) {
        // 获取PushToken
        HonorPushClient.getInstance().getPushToken(new HonorPushCallback<String>() {
            @Override
            public void onSuccess(String pushToken) {
                // TODO: 新Token处理
                smDeviceToken = pushToken;
                if (null != callback) {
                    callback.onResult(new TokenResult(pushToken, PUSH_BRAND, TextUtils.isEmpty(pushToken) ? TokenResult.ResultCode.ERROR : TokenResult.ResultCode.OK));
                }
            }

            @Override
            public void onFailure(int errorCode, String errorString) {
                if (null != callback) {
                    callback.onResult(new TokenResult(null, PUSH_BRAND, TokenResult.ResultCode.ERROR));
                }
            }
        });
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        //注销PushToken
        HonorPushClient.getInstance().deletePushToken(new HonorPushCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                smDeviceToken = null;
                PushLog.i("token deleted successfully");
                if (null != callback) {
                    callback.onResult(new TokenResult.Builder().token(smDeviceToken).brandName(PUSH_BRAND).build());
                }
            }

            @Override
            public void onFailure(int errorCode, String errorString) {
                PushLog.e("deleteToken failed. code:" + errorCode + ",msg:" + errorString);
                if (null != callback) {
                    callback.onResult(new TokenResult.Builder().token(smDeviceToken).brandName(PUSH_BRAND).build());
                }
            }
        });
    }

    public void getNotificationCenterStatus() {
        //查询通知栏消息状态
        HonorPushClient.getInstance().getNotificationCenterStatus(new HonorPushCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean aBoolean) {
                // TODO: 返回应用当前通知栏状态结果
            }

            @Override
            public void onFailure(int errorCode, String errorString) {
                // TODO: 查询失败
            }
        });
    }

    @Override
    public synchronized String getDeviceToken() {
        return smDeviceToken;
    }

    //   打开通知栏消息显示的开关。您如果想控制应用是否允许显示通知栏消息，可以调用此接口。本接口与透传消息无关，透传消息的开关逻辑由应用自己处理。
    @Override
    public void turnOnPush() {
        //打开通知栏消息状态
        HonorPushClient.getInstance().turnOnNotificationCenter(new HonorPushCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                PushLog.i("turnOnPush Complete");
            }

            @Override
            public void onFailure(int errorCode, String errorString) {
                PushLog.e("turnOnPush failed: code:" + errorCode + ",msg:" + errorString);
            }
        });
    }

    //关闭通知栏消息显示的开关。您如果想控制应用是否允许显示通知栏消息，可以调用此接口。本接口与透传消息无关，透传消息的开关逻辑由应用自己处理。
    @Override
    public void turnOffPush() {

        //设置通知栏消息不显示
        HonorPushClient.getInstance().turnOffNotificationCenter(new HonorPushCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                PushLog.i("turnOffPush Complete");
            }

            @Override
            public void onFailure(int errorCode, String errorString) {
                PushLog.e("turnOffPush failed: code:" + errorCode + ",msg:" + errorString);
            }
        });

    }

    @Override
    public boolean isSupport() {
        boolean isSupport = HonorPushClient.getInstance().checkSupportHonorPush(getContext());
        return isSupport;
    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

}
