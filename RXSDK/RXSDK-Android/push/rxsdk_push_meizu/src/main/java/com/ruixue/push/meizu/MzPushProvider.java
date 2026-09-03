package com.ruixue.push.meizu;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.text.TextUtils;



import com.meizu.cloud.pushsdk.PushManager;
import com.meizu.cloud.pushsdk.platform.message.RegisterStatus;
import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.ICallbackResult;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;
import com.ruixue.push.utils.MetaDataUtils;

import java.lang.ref.WeakReference;
import java.lang.reflect.Method;

/**
 * appId： Push 平台申请的应用 id。
 * appKey： Push 平台申请的应用 key。
 * pushId： 在订阅接口的回调方法 onRegisterStatus 中，通过：registerStatus.getPushId();获取。
 * tags： 标签名称，多个逗号隔离，每个标签不能超过 20 个字符，限 100 个。
 * alias： 别名名称，长度不能超过 20 个字符，每一个应用用户仅能设置一个别名。
 * pushType： 消息类型，0：通知栏消息 1：透传消息。 透传功能已停用 只有 0
 * switcher： 开关状态
 * notifyId： 由服务端生成的通知 Id，在通知展示的回调方法 onNotificationArrived 中，通过：
 * mzPushMessage.getNotifyId();获取。
 * http://open.res.flyme.cn/fileserver/upload/file/202109/7bf101e2843642709c7a11f4b57861cd.pdf
 */
public class MzPushProvider implements IPushProvider {
    private String mAppId;
    private String mAppKey;
    private static final String PUSH_BRAND = "flymepush";

    private Context mContext;
    private static WeakReference<ICallbackResult<TokenResult>> mResultCallback = null;


    public <T> T checkNotNull(final T obj) {
        if (obj == null) {
            throw new NullPointerException();
        }
        return obj;
    }

    public Context getContext() {
        return checkNotNull(this.mContext);
    }

    public synchronized static void callUpdateToken(Context context, RegisterStatus status) {
        if (null != mResultCallback && null != mResultCallback.get()) {
            mResultCallback.get().onResult(new TokenResult.Builder().brandName(PUSH_BRAND).token(status.getPushId()).expireTime(status.getExpireTime()).resultCode(TokenResult.ResultCode.OK).build());
            mResultCallback.clear();
        }
    }

    @Override
    public boolean init(Context context) {
        this.mContext = context;
        this.mAppId = MetaDataUtils.getString(context, "RX_MZ_APP_ID").replace("RX_", "");
        this.mAppKey = MetaDataUtils.getString(context, "RX_MZ_APP_KEY").replace("RX_", "");
        PushLog.d("plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
        return true;
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
                TokenResult result = new TokenResult.Builder()
                        .brandName(PUSH_BRAND)
                        .token(this.getDeviceToken())
                        .taskId(taskId)
                        .resultCode(TokenResult.ResultCode.OK).build();
                callback.onResult(result);
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     */
    @Override
    public void registerToken(RegisterCallback callback) {
        mResultCallback = new WeakReference<>(callback);
        PushManager.register(this.getContext(), mAppId, mAppKey);
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(this.getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        PushManager.unRegister(this.getContext(), mAppId, mAppKey);

    }

    /**
     * @return
     */
    @Override
    public String getDeviceToken() {
        String pushId = PushManager.getPushId(this.getContext());
        if (!TextUtils.isEmpty(pushId)) {
            return pushId;
        } else {
            //pushId过期 或未注册成功
        }
        return null;
    }

    /**
     * 标签名称，多个逗号隔离，每个标签不能超过 20 个字符，限 100 个。
     * @param alias
     */
    @Override
    public void bindAlias( String alias) {
        PushManager.subScribeAlias(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), alias);
    }

    @Override
    public void unBindAlias(String alias) {
        PushManager.unSubScribeAlias(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), alias);
    }

    @Override
    public void turnOnPush() {
        PushManager.switchPush(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), true);
    }

    @Override
    public void turnOffPush() {
        PushManager.switchPush(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), false);
    }

    @Override
    public boolean isSupport() {
        String meizuFlymeOSFlag = Build.BRAND;
        try {
            Class<?> cls = Class.forName("android.os.SystemProperties");
            Method method = cls.getDeclaredMethod("get", new Class[]{String.class});
            meizuFlymeOSFlag = (String) method.invoke(cls, new Object[]{"ro.build.display.id"});
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (TextUtils.isEmpty(meizuFlymeOSFlag)) {
                return false;
            } else if (meizuFlymeOSFlag.contains("flyme") || meizuFlymeOSFlag.toLowerCase().contains("flyme")) {
                return true;
            } else {
                return false;
            }
        }
    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

    /**
     * subScribeTags(Context
     * context,String appId,String
     * appKey,String pushId,String
     * tags)
     * @param topic
     */
    public void subscribe(String topic) {
        PushManager.subScribeTags(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), topic);
    }

    public void unsubscribe(String topic) {
        PushManager.unSubScribeTags(this.getContext(), mAppId, mAppKey, this.getDeviceToken(), topic);
    }

}
