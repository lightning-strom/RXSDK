package com.ruixue.push.mi;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Process;
import android.text.TextUtils;


import com.ruixue.push.core.ClickNotifyCallback;
import com.ruixue.push.core.IPushProvider;
import com.ruixue.push.core.RegisterCallback;
import com.ruixue.push.core.TokenResult;
import com.ruixue.push.core.UnRegisterCallback;
import com.ruixue.push.log.PushLog;
import com.ruixue.push.utils.MetaDataUtils;
import com.xiaomi.mipush.sdk.MiPushClient;
import com.xiaomi.mipush.sdk.MiPushMessage;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

/**
 * 小米厂商推送
 */
public class MiPushProvider implements IPushProvider {

    private String mAppId;
    private String mAppKey;
    private static final String PUSH_BRAND = "xiaomipush";


    private Context mContext;

    public <T> T checkNotNull(final T obj) {
        if (obj == null) {
            throw new NullPointerException();
        }
        return obj;
    }

    public Context getContext() {
        return checkNotNull(this.mContext);
    }

    private boolean shouldInit() {
        ActivityManager am = ((ActivityManager) this.getContext().getSystemService(Context.ACTIVITY_SERVICE));
        List<ActivityManager.RunningAppProcessInfo> processInfos = am.getRunningAppProcesses();
        String mainProcessName = this.getContext().getPackageName();
        int myPid = Process.myPid();
        for (ActivityManager.RunningAppProcessInfo info : processInfos) {
            if (info.pid == myPid && mainProcessName.equals(info.processName)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean init(Context context) {
        this.mContext = context;
        this.mAppId = MetaDataUtils.getString(context, "RX_MI_APP_ID").replace("RX_", "");
        this.mAppKey = MetaDataUtils.getString(context, "RX_MI_APP_KEY").replace("RX_", "");
        PushLog.i("plugin info:" + PUSH_BRAND + "_" + BuildConfig.BUILD_TIME + "_" + BuildConfig.COMMIT_ID + "_" + BuildConfig.BUILD_TYPE);
        return true;
    }


    public boolean getJSONType(String str) {
        boolean result = false;
        if (!TextUtils.isEmpty(str)) {
            str = str.trim();
            if (str.startsWith("{") && str.endsWith("}")) {
                result = true;
            } else if (str.startsWith("[") && str.endsWith("]")) {
                result = true;
            }
        }
        return result;
    }

    @Override
    public boolean handleOnOpenApp(Intent intent, ClickNotifyCallback callback) {
        MiPushMessage mpMsg = (MiPushMessage) intent.getSerializableExtra("key_message");
        if (null != mpMsg) {
            if (getJSONType(mpMsg.getContent())) {
                try {
                    JSONObject obj = new JSONObject(mpMsg.getContent());
                    if ((obj.has(KEY_TASK_ID) || obj.has("taskid")) && null != callback) {
                        TokenResult result = new TokenResult.Builder()
                                .brandName(PUSH_BRAND)
                                .token(this.getDeviceToken())
                                .taskId(obj.optString(KEY_TASK_ID, obj.optString("taskid")))
                                .resultCode(TokenResult.ResultCode.OK).build();
                        callback.onResult(result);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    return false;
                }
            } else {
                return true;
            }
        }
        return true;
    }

    /**
     * 由开发者决定是否注册推送。
     */
    @Override
    public void registerToken(RegisterCallback callback) {
        if (this.shouldInit()) {
//            MiPushClient.registerPush(this.getContext(), mAppId, mAppKey);
            MiPushClient.registerToken(this.getContext(), mAppId, mAppKey, null, new MiPushClient.UPSRegisterCallBack() {
                @Override
                public void onResult(MiPushClient.TokenResult tokenResult) {
                    MiPushClient.subscribe(getContext(), TOPIC_GLOBAL, null);
                    if (null != callback) {
                        PushLog.i("mi push token:" + tokenResult.getToken() + "code:" + tokenResult.getResultCode());
                        callback.onResult(new TokenResult(tokenResult.getToken(), PUSH_BRAND, TokenResult.ResultCode.OK));
                    }
                }
            });

        } else {
            PushLog.e("rx mi push register failed");
        }
    }

    @Override
    public void unRegisterToken(UnRegisterCallback callback) {
        if (null != callback) {
            callback.onResult(new TokenResult.Builder().token(this.getDeviceToken()).brandName(PUSH_BRAND).build());
        }
        MiPushClient.unregisterPush(this.getContext());
    }

    /**
     * 获取客户端的RegId。
     * @return 客户端的RegId。
     */
    @Override
    public String getDeviceToken() {
        return MiPushClient.getRegId(this.getContext());
    }

    /**
     * @param alias 开发者可以为指定用户设置别名，然后给这个别名推送消息，效果等同于给RegId推送消息。
     */
    @Override
    public void bindAlias(String alias) {
        MiPushClient.setAlias(this.getContext(), alias, null);

    }

    /**
     * @param alias 开发者可以取消指定用户的某个别名，服务器就不会给这个别名推送消息了。
     */
    @Override
    public void unBindAlias(String alias) {
        MiPushClient.unsetAlias(this.getContext(), alias, null);

    }

    /**
     * @param account 开发者可以为指定用户设置userAccount。
     */
    public void setUserAccount(String account) {
        MiPushClient.setUserAccount(this.getContext(), account, null);
    }

    /**
     * @param account 开发者可以取消指定用户的某个userAccount，服务器就不会给这个userAccount推送消息了。
     */
    public void unsetUserAccount(String account) {
        MiPushClient.unsetUserAccount(this.getContext(), account, null);
    }

    @Override
    public void turnOnPush() {
        MiPushClient.resumePush(this.getContext(), null);
    }

    @Override
    public void turnOffPush() {
        MiPushClient.pausePush(this.getContext(), null);
    }

    @Override
    public boolean isSupport() {
        return MiPushClient.shouldUseMIUIPush(this.getContext());
    }

    @Override
    public String getPushBrandName() {
        return PUSH_BRAND;
    }

    /**
     * @param topic 订阅topic
     *              每个App单台设备可设置的Topic个数为30个，如果超过了对应上限数，则新设置的Topic会覆盖最早设置的Topic。。
     */
    public void subscribe(String topic) {
        MiPushClient.subscribe(this.getContext(), topic, null);
    }

    /**
     * @param topic 某个用户取消订阅的主题
     *              category	扩展参数，暂时没有用途，直接填null
     */
    public void unsubscribe(String topic) {
        MiPushClient.subscribe(this.getContext(), topic, null);
    }

    /**
     * 清除小米推送弹出的所有通知。
     */
    public void clearNotification() {
        MiPushClient.clearNotification(this.getContext());
    }

}
