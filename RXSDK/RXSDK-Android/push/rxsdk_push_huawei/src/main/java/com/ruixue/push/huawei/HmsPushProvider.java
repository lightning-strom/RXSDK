package com.ruixue.push.huawei;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import com.huawei.agconnect.AGConnectOptionsBuilder;
import com.huawei.hmf.tasks.OnCompleteListener;
import com.huawei.hmf.tasks.OnFailureListener;
import com.huawei.hmf.tasks.OnSuccessListener;
import com.huawei.hmf.tasks.Task;
import com.huawei.hms.aaid.HmsInstanceId;
import com.huawei.hms.aaid.entity.AAIDResult;
import com.huawei.hms.common.ApiException;
import com.huawei.hms.push.HmsMessaging;
import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.ICallbackResult;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;

import java.lang.reflect.Method;
import java.util.logging.Logger;

public class HmsPushProvider implements IPushProvider {
    private static final String PUSH_BRAND = "huaweipush";
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
        if (!TextUtils.isEmpty(token)) {
            HmsMessaging.getInstance(context).subscribe(TOPIC_GLOBAL);
        } else {
            HmsMessaging.getInstance(context).unsubscribe(TOPIC_GLOBAL);
        }

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
        PushLog.i("push plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
        mIsInit = this.isSupport();
        return mIsInit;
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
    public void bindAlias(String alias) {

    }

    @Override
    public void unBindAlias(String alias) {

    }

    @Override
    public void registerToken(RegisterCallback callback) {
        smResultCallback = callback;
        if (!TextUtils.isEmpty(smDeviceToken)) {
            callUpdateToken(getContext(), smDeviceToken);
        } else {
            new Thread(() -> {
                try {
                    // read from agconnect-services.json
                    String appid = new AGConnectOptionsBuilder().build(HmsPushProvider.this.getContext()).getString("client/app_id");
                    String token = HmsInstanceId.getInstance(HmsPushProvider.this.getContext()).getToken(appid, "HCM");
//                        PushLog.i("get token:" + token);
                    if (!TextUtils.isEmpty(token)) {
                        callUpdateToken(getContext(), token);
                    }
                } catch (ApiException | NullPointerException e) {
                    e.printStackTrace();
                    PushLog.e("registerToken get token failed msg : " + e.getMessage());
                    PushLog.e("注意：请检查推送配置参数，不支持的huawei推送的包请不要添加'rxsdk_push_huawei'组件的依赖！！！");
                    if (null != smResultCallback) {
                        smResultCallback.onResult(new TokenResult(null, PUSH_BRAND, TokenResult.ResultCode.ERROR));
                        smResultCallback = null;
                    }
                }
            }).start();
        }
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(this.getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        callUpdateToken(HmsPushProvider.this.getContext(), null);
        new Thread(() -> {
            try {
                String appid = new AGConnectOptionsBuilder().build(HmsPushProvider.this.getContext()).getString("client/app_id");
                // 输入token标识"HCM"
                String tokenScope = "HCM";
                // 注销Token
                HmsInstanceId.getInstance(HmsPushProvider.this.getContext()).deleteToken(appid, tokenScope);
                PushLog.i("token deleted successfully");
            } catch (ApiException | NullPointerException e) {
                PushLog.e("deleteToken failed." + e);
                PushLog.e("注意：请检查推送配置参数，不支持的huawei推送的包请不要添加'rxsdk_push_huawei'组件的依赖！！！");
            }

        }).start();
    }

    @Override
    public synchronized String getDeviceToken() {
        return smDeviceToken;
    }

    //   打开通知栏消息显示的开关。您如果想控制应用是否允许显示通知栏消息，可以调用此接口。本接口与透传消息无关，透传消息的开关逻辑由应用自己处理。
    @Override
    public void turnOnPush() {
        // 设置显示通知栏消息
        HmsMessaging.getInstance(this.getContext()).turnOnPush().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(Task<Void> task) {
                // 获取结果
                if (task.isSuccessful()) {
                    PushLog.i("turnOnPush Complete");
                } else {
                    PushLog.e("turnOnPush failed: ret=" + task.getException().getMessage());
                }
            }
        });
    }

    //关闭通知栏消息显示的开关。您如果想控制应用是否允许显示通知栏消息，可以调用此接口。本接口与透传消息无关，透传消息的开关逻辑由应用自己处理。
    @Override
    public void turnOffPush() {
        // 关闭显示通知栏消息
        HmsMessaging.getInstance(this.getContext()).turnOffPush().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(Task<Void> task) {
                // 获取结果
                if (task.isSuccessful()) {
                    PushLog.i("turnOffPush Complete");
                } else {
                    PushLog.e("turnOffPush failed: ret=" + task.getException().getMessage());
                }
            }
        });
    }

    @Override
    public boolean isSupport() {
        int emuiApiLevel = 0;
        try {
            Class<?> cls = Class.forName("android.os.SystemProperties");
            Method method = cls.getDeclaredMethod("get", new Class[]{String.class});
            emuiApiLevel = Integer.parseInt((String) method.invoke(cls, new Object[]{"ro.build.hw_emui_api_level"}));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return emuiApiLevel > 5.0;

    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

    /**
     * 主题消息传递不限制每个主题的订阅数。但是，推送服务有如下限制：
     * 一个应用订阅的主题数量不能超过2000个。
     * 单次消息中携带主题数量最大不超过100个。
     * 在EMUI 10.0以上的华为设备要求HMS Core（APK）的版本不低于3.0.0。低于EMUI 10.0的华为设备上要求HMS Core（APK）的版本不低于4.0.3，高版本的HMS Core（APK）补齐了低版本EMUI缺失的功能。
     * @param topic
     */
    public void subscribe(String topic) {
        try {
            // 主题订阅
            HmsMessaging.getInstance(this.getContext()).subscribe(topic).addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(Task<Void> task) {
                    // 获取主题订阅的结果
                    if (task.isSuccessful()) {
                        PushLog.i("subscribe topic successfully");
                    } else {
                        PushLog.e("subscribe topic failed, return value is " + task.getException().getMessage());
                    }
                }
            });
        } catch (Exception e) {
            PushLog.e("subscribe failed, catch exception : " + e.getMessage());
        }
    }

    public void unsubscribe(String topic) {
        try {
            // 取消主题订阅
            HmsMessaging.getInstance(this.getContext()).unsubscribe(topic).addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(Task<Void> task) {
                    // 获取取消主题订阅的结果
                    if (task.isSuccessful()) {
                        PushLog.i("unsubscribe topic successfully");
                    } else {
                        PushLog.e("unsubscribe topic failed, return value is " + task.getException().getMessage());
                    }
                }
            });
        } catch (Exception e) {
            PushLog.e("unsubscribe failed, catch exception : " + e.getMessage());
        }
    }

    private void syncGetToken() {
        new Thread() {
            @Override
            public void run() {
                String regId = getDeviceToken();
                if (!TextUtils.isEmpty(regId)) {

                }
            }
        }.start();
    }

    public boolean isAutoInitEnabled() {
        return HmsMessaging.getInstance(this.getContext()).isAutoInitEnabled();
    }

    public void setAutoInitEnabled(boolean auto) {
        HmsMessaging.getInstance(this.getContext()).setAutoInitEnabled(auto);
    }

    public void getAAIDASync() {

        Task<AAIDResult> idResult = HmsInstanceId.getInstance(mContext).getAAID();
        idResult.addOnSuccessListener(new OnSuccessListener<AAIDResult>() {
            @Override
            public void onSuccess(AAIDResult aaidResult) {
                // 获取AAID方法成功
                String aaid = aaidResult.getId();
                PushLog.d("getAAID success:" + aaid);

            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // 获取AAID失败
                PushLog.d("getAAID failure:" + e);

            }
        });
    }
}
