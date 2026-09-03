package com.ruixue.push.oppo;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.heytap.msp.push.HeytapPushManager;
import com.heytap.msp.push.callback.ICallBackResultService;
import com.heytap.msp.push.callback.ISetAppNotificationCallBackService;
import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;
import com.ruixue.push.utils.MetaDataUtils;


public class OppoPushProvider implements IPushProvider {
    private final static String TAG = OppoPushProvider.class.getSimpleName();
    private final static String PUSH_BRAND = "oppopush";

    private String mAppKey;
    private String mAppSecret;
    private Context mContext;

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

    @Override
    public boolean init(@NonNull Context context) {
        this.mContext = context;
        this.mAppSecret = MetaDataUtils.getString(context, "RX_OPPO_APP_SECRET").replace("RX_", "");
        this.mAppKey = MetaDataUtils.getString(context, "RX_OPPO_APP_KEY").replace("RX_", "");
        try {
            HeytapPushManager.init(this.getContext(), true);
            PushLog.i("plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
            return true;
        } catch (NoClassDefFoundError | Exception e) {
            e.printStackTrace();
            PushLog.e("oppo push init failed!");
            return false;
        }
    }

    @Override
    public boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback) {
        String taskId = "";
        if (intent.getExtras() != null) {
            Object tid = intent.getExtras().get(KEY_TASK_ID);
            taskId = (tid != null) ? String.valueOf(tid) : null;
        }
        if (!TextUtils.isEmpty(taskId)) {
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

    public class PushStatus {
        public static final int PUSH_STATUS_START = 0;
        public static final int PUSH_STATUS_PAUSE = 1;
        public static final int PUSH_STATUS_STOP = 2;
    }

    public class NotificatoinStatus {
        public static final int STATUS_OPEN = 0;
        public static final int STATUS_CLOSE = 1;
    }

    @Override
    public void registerToken(RegisterCallback callback) {

        HeytapPushManager.register(this.getContext(), this.mAppKey, this.mAppSecret, new ICallBackResultService() {
            /**
             * 注册的结果,如果注册成功,registerID就是客户端的唯一身份标识
             *
             * @param code 接口执行结果码，0表示接口执行成功
             * @param registerID   注册id/token
             * @param packageName 如果当前执行注册的应用是常规应用，则通过packageName返回当前应用对应的包名
             * @param miniPackageName  如果当前是快应用进行push registerID的注册，则通过miniPackageName进行标识快应用包名
             */
            @Override
            public void onRegister(int code, String registerID, String packageName, String miniPackageName) {
                if (null != callback) {
                    callback.onResult(new TokenResult(registerID, PUSH_BRAND, code != 0 ? TokenResult.ResultCode.ERROR : TokenResult.ResultCode.OK));
                }
                PushLog.i("注册成功 registerId:" + registerID + " " + packageName + " " + miniPackageName);
            }

            /**
             * 应用注销结果回调接口，将应用请求服务端的注销接口进行结果传达
             * @param responseCode 接口执行结果码，0标识接口执行成功
             * @param packageName  当前注销的应用的包名
             * @param miniProgramPkg  如果是快应用注销，则会将快应用的包名一起返回给业务方(一般是快应用中心，由快应用中心进行分发)
             */
            @Override
            public void onUnRegister(int responseCode, String packageName, String miniProgramPkg) {

            }

            @Override
            public void onSetPushTime(int i, String s) {

            }

            @Override
            public void onGetPushStatus(int responseCode, int status) {

            }

            @Override
            public void onGetNotificationStatus(int i, int i1) {

            }

            /** 异常处理的回调
             * @param errorCode   错误码
             * @param message     错误信息
             * @param packageName 当前注册失败的应用包名，如果是应用注册，则返回应用注册包名，如果是为快应用做接口请求，则这里返回的是快应用中心的包名
             * @param miniProgramPkg 当前注册失败的快应用包名
             */
            @Override
            public void onError(int errorCode, String message, String packageName, String miniProgramPkg) {

            }
        });
//        HeytapPushManager.register(this.getContext(), this.mAppKey, this.mAppSecret, new ICallBackResultService() {
//            @Override
//            public void onRegister(int code, String s) {
//                if (null != callback) {
//                    callback.onResult(new TokenResult(s, PUSH_BRAND, code != 0 ? TokenResult.ResultCode.ERROR : TokenResult.ResultCode.OK));
//                }
//
//                if (code == 0) {
////                    PushLog.i("注册成功 registerId:" + s);
//                } else {
//                    PushLog.e("注册失败 code=" + code + ",msg=" + s);
//                }
//            }
//
//            @Override
//            public void onUnRegister(int code) {
//                if (code == 0) {
////                showResult("注销成功", "code=" + code);
//                } else {
//                    PushLog.e("注销失败 code=" + code);
//                }
//            }
//
//            @Override
//            public void onGetPushStatus(final int code, int status) {
//                if (code == 0 && status == 0) {
////                showResult("Push状态正常", "code=" + code + ",status=" + status);
//                } else {
//                    PushLog.e("Push状态错误 code=" + code + ",status=" + status);
//                }
//            }
//
//            @Override
//            public void onGetNotificationStatus(final int code, final int status) {
//                if (code == 0 && status == 0) {
////                showResult("通知状态正常", "code=" + code + ",status=" + status);
//                } else {
//                    PushLog.e("通知状态错误 code=" + code + ",status=" + status);
//                }
//            }
//
//            @Override
//            public void onError(int i, String s) {
//                PushLog.e("HeytapPush onError code : " + i + "   message : " + s);
//            }
//
//            @Override
//            public void onSetPushTime(final int code, final String s) {
////            showResult("SetPushTime", "code=" + code + ",result:" + s);
//            }
//        });
        HeytapPushManager.requestNotificationPermission();
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(this.getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        HeytapPushManager.unRegister();
    }

    @Override
    public String getDeviceToken() {
        return HeytapPushManager.getRegisterID();
    }


    @Override
    public void turnOnPush() {
        HeytapPushManager.enableAppNotificationSwitch(new ISetAppNotificationCallBackService() {
            @Override
            public void onSetAppNotificationSwitch(int i) {

            }
        });
    }

    @Override
    public void turnOffPush() {
        HeytapPushManager.disableAppNotificationSwitch(i -> {

        });
    }

    public boolean isSupport() {
        return HeytapPushManager.isSupportPush(this.getContext());
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
