package com.ruixue.push.vivo;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;

import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;
import com.vivo.push.IPushActionListener;
import com.vivo.push.PushClient;

import com.vivo.push.PushConfig;
import com.vivo.push.listener.IPushQueryActionListener;
import com.vivo.push.util.VivoPushException;

/**
 * vivo push plugin
 */
public class VivoPushProvider implements IPushProvider {

//    private final static String TAG = VivoPushProvider.class.getSimpleName();

    public static final String PUSH_BRAND = "vivopush";

    private Context mContext;
    private   String mDeviceToken = "";


    public <T> T checkNotNull(final T obj) {
        if (obj == null) {
            throw new NullPointerException();
        }
        return obj;
    }

    public Context getContext() {
        return checkNotNull(this.mContext);
    }

    @Override
    public boolean init(Context context) {
        this.mContext = context;
        PushLog.i("plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
        try {

            PushConfig config = new PushConfig.Builder().agreePrivacyStatement(true).build();
            PushClient.getInstance(context).initialize(config);
        } catch (VivoPushException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback) {
        long vivo_push_messageId = intent.getLongExtra("vivo_push_messageId", 0);
        String taskId = "";
        if (intent.getExtras() != null) {
            Object tid = intent.getExtras().get(KEY_TASK_ID);
            taskId = (tid != null) ? String.valueOf(tid) : null;
        }
        if (vivo_push_messageId != 0 && !TextUtils.isEmpty(taskId)) {
//            PushMsgRepeter.callNotificationClick(PUSH_BRAND, this.getDeviceToken(), taskid);
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
        // 打开push开关, 关闭为turnOffPush，详见api接入文档
        PushClient.getInstance(this.getContext().getApplicationContext()).turnOnPush(new IPushActionListener() {
            @Override
            public void onStateChanged(int state) {
                // : 开关状态处理， 0代表成功
                PushLog.d("onStateChanged " + " state= " + state);
                String regId = null;
                if (state == 0) {
                    PushClient.getInstance(VivoPushProvider.this.getContext()).getRegId(new IPushQueryActionListener() {
                        @Override
                        public void onSuccess(String regId) {
                            mDeviceToken=regId;
                            if (null != callback) {
                                callback.onResult(new com.ruixue.push.core.TokenResult(regId, PUSH_BRAND, TokenResult.ResultCode.OK));
                            }
                        }

                        @Override
                        public void onFail(Integer integer) {
                            String errorCode = " 查询regid失败code= " + state;
                            Log.d("rxsdk", " getRegId errorCode= " + errorCode);
                            if (null != callback) {
                                callback.onResult(new com.ruixue.push.core.TokenResult(regId, PUSH_BRAND, TokenResult.ResultCode.ERROR));
                            }
                        }
                    });
//                    PushLog.d("PushApplication", " regId= " + regId);
                } else if (null != callback) {
                    callback.onResult(new com.ruixue.push.core.TokenResult(regId, PUSH_BRAND, TokenResult.ResultCode.ERROR));
                }
            }
        });
//        VUpsManager.getInstance().registerToken(this.getContext(), null, null, null, new UPSRegisterCallback() {
//            @Override
//            public void onResult(TokenResult tokenResult) {
////                PushLog.d(TAG, " issupport  = " + tokenResult.getReturnCode());
//                if (tokenResult.getReturnCode() == 0) {
//                    PushLog.d( "注册成功 regID = " + tokenResult.getToken());
//                } else {
//                    PushLog.d( "注册失败 code:" + tokenResult.getReturnCode());
//                }
//            }
//        });
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(this.getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        // 打开push开关, 关闭为turnOffPush，详见api接入文档
        PushClient.getInstance(this.getContext().getApplicationContext()).turnOffPush(new IPushActionListener() {
            @Override
            public void onStateChanged(int state) {
                // : 开关状态处理， 0代表成功
                PushLog.d("unRegisterToken state= " + state);
            }
        });
//         VUpsManager.getInstance().unRegisterToken(this.getContext(), new UPSRegisterCallback() {
//                    @Override
//                    public void onResult(TokenResult tokenResult) {
//                        PushLog.d( " issupport  = " + tokenResult.getReturnCode());
//                        String log = "";
//
//                        if (tokenResult.getReturnCode() == 0) {
//                            PushLog.d( "解注册成功 regID = " + tokenResult.getToken());
//                            log = "解注册成功 regID = " + tokenResult.getToken();
//                        } else {
//                            PushLog.d( "解注册成功");
//                            log = "解注册成功";
//                        }
////                        updateDisplay(log);
//                    }
//                });

    }

    @Override
    public String getDeviceToken() {
        return mDeviceToken;
    }

    @Override
    public void bindAlias(String alias) {
        PushClient.getInstance(this.getContext()).bindAlias(alias, i -> {
            PushLog.d(" bindAlias code= " + i + " alias = " + alias);
        });
    }

    @Override
    public void unBindAlias(String alias) {
        PushClient.getInstance(this.getContext()).unBindAlias(alias, i -> {
            PushLog.d(" unbindAlias code= " + i + " alias = " + alias);
        });
    }

    /**
     * @return alias
     */
    public String getAlias() {
        String alias = PushClient.getInstance(this.getContext()).getAlias();
        PushLog.d(" getAlias= " + alias);
        return alias;
    }

    @Override
    public boolean isSupport() {
        boolean issupport = PushClient.getInstance(this.getContext()).isSupport();
        return issupport;
    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

    @Override
    public void turnOnPush() {
        this.registerToken(null);
    }

    @Override
    public void turnOffPush() {
        this.unRegisterToken(null);
    }
}
