package com.ruixue.push.core;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.push.log.PushLog;
import com.ruixue.push.utils.MetaDataUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class PushWrapper {

    //the meta-data header
    private static final String META_DATA_NAME_HEADER = "RX_PUSH_";
    public static final int INIT_ERROR = 2002;
    private IPushProvider mPushProvider = null;
    private String mPushBrandName;
    private boolean mIsInit = false;
    private SharedPreferences mspDeviceToken;
    private final String KEY_SP_DEVICE_TOKEN = "device_token";
    private final String KEY_SP_EXPIRE_TIME = "device_token_expire_time";

    private final IPushApi mPushApi;
    private Intent mIntent = null;


    private static class Single {
        static PushWrapper sInstance = new PushWrapper();
    }

    //单例禁止外部构造
    private PushWrapper() {
        this.mPushApi = new PushApiImpl();
    }

    /**
     * Using the simple instance
     * @return PushWrapper
     */
    public static PushWrapper getInstance() {
        return Single.sInstance;
    }

    public boolean init(Context context) {
        this.mPushProvider = loadPushProvider(Objects.requireNonNull(context));
        this.mspDeviceToken = Objects.requireNonNull(context).getSharedPreferences("rx_device_token", Context.MODE_PRIVATE);
        if (null != this.mPushProvider) {
            this.mPushBrandName = this.mPushProvider.getPushBrandName();
            this.mIsInit = true;
        } else {
            PushLog.e("ruixue push plugin init failed, no push channel plugin support.");
        }
        return mIsInit;
    }


    /**
     * @param context 应用上下文
     * @return pushProvider 插件类对象
     */
    private IPushProvider loadPushProvider(Context context) {
        IPushProvider pushProvider = null;
        //all support push platform
        List<String> pushClsNameList = new ArrayList<>();
        //find all support push platform
        Bundle metaData = MetaDataUtils.getBundle(context);
        if (metaData != null) {
            Set<String> allKeys = metaData.keySet();
            if (allKeys != null && !allKeys.isEmpty()) {
                for (String key : allKeys) {
                    if (key.startsWith(META_DATA_NAME_HEADER)) {
                        pushClsNameList.add(metaData.getString(key));
                    }
                }
            }
        }
        if (pushClsNameList.isEmpty()) {
            throw new IllegalArgumentException("have none push support,check build.gradle dependencies is have implementation rxsdk_push_xxx added");
        }
        for (String clsName : pushClsNameList) {
            try {
                Class<?> currentClz = Class.forName(clsName);
                Class<?>[] interfaces = currentClz.getInterfaces();
                List<Class<?>> allInterfaces = Arrays.asList(interfaces);
                if (allInterfaces.contains(IPushProvider.class)) {
                    IPushProvider ipp = (IPushProvider) currentClz.newInstance();
                    if (ipp.init(context) && ipp.isSupport()) {
                        pushProvider = ipp;
                        break;
                    }
                }
            } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
                e.printStackTrace();
            }
        }

        return pushProvider;
    }

    private boolean checkInit() {
        if (mIsInit && null != mPushProvider) {
            return true;
        } else {
            PushLog.e("push is not init success ,please call init or check args config");
            return false;
        }
    }

    public boolean handleOnOpenApp(Intent intent) {
        if (intent != null && intent.getExtras() != null && intent.getExtras().containsKey("task_id")) {
            mIntent = intent;
        }
        if (checkInit()) {
            return mPushProvider.handleOnOpenApp(intent, result -> {
                if (result.getResultCode() == TokenResult.ResultCode.OK) {
//                    mPushApi.reportNotificationClicked(result.getTaskId(), result.getBrandName(), result.getToken());
//                    mPushApi.reportNotifyStatus(result.getBrandName(), result.getToken(), result.getTaskId(), IPushApi.REPORT_TYPE_CLICK);
                    this.reportClick(result.getBrandName(), result.getToken());
                } else {
                    PushLog.i("handleOnOpenApp failed:" + result.getResultCode());
                }
            });
        } else {
            return false;
        }
    }

    public String getTaskId() {
        if (mIntent != null && mIntent.getExtras() != null) {
            Object tid = mIntent.getExtras().get("task_id");
            String taskId = (tid != null) ? String.valueOf(tid) : null;
            if (!TextUtils.isEmpty(taskId)) {
                RXLogger.i("getTaskId task_id:" + taskId);
                return taskId;
            }
        }
        return null;
    }

    private void reportClick(String brandName, String deviceToken) {
        String taskId = getTaskId();
        if (!TextUtils.isEmpty(taskId)) {
            mPushApi.reportNotificationClicked(brandName, deviceToken, getTaskId(), new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    mIntent = null;
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                }
            });
        }
    }

    private void updateToken(String token, int expireTime) {
        if (null != mspDeviceToken) {
            if (TextUtils.isEmpty(token)) {
                mspDeviceToken.edit().remove(KEY_SP_DEVICE_TOKEN).apply();
                mspDeviceToken.edit().remove(KEY_SP_EXPIRE_TIME).apply();
            } else if (!this.mspDeviceToken.getString(KEY_SP_DEVICE_TOKEN, "").equals(token)) {
                mspDeviceToken.edit().putString(KEY_SP_DEVICE_TOKEN, token).apply();
                mspDeviceToken.edit().putInt(KEY_SP_EXPIRE_TIME, expireTime).apply();
            }
        }
    }


    public void registerToken(DeviceResultCallback callback) {
        if (checkInit()) {
            mPushProvider.registerToken(result -> {
                if (result.getResultCode() == TokenResult.ResultCode.OK) {
                    updateToken(result.getToken(), result.getExpireTime());
//                    mPushApi.reportTokenToServer(result.getBrandName(), result.getToken(), callback);
                    mPushApi.bindDevice(result.getBrandName(), result.getToken(), callback);
                } else if (callback != null) {
                    //JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "注册推送失败 " + result.getBrandName())
                    callback.onResult(getJsonStr(INIT_ERROR, "注册推送失败 " + result.getBrandName()));
                }
                Log.i(RuiXueSdk.TAG, "registerToken token:" + result.getToken());
                this.reportClick(result.getBrandName(), result.getToken());
            });
        } else {
            if (callback != null) {
                callback.onResult(getJsonStr(INIT_ERROR, "请先初始化推送sdk "));
            }
            if (!TextUtils.isEmpty(getBrandName()) && !TextUtils.isEmpty(getDeviceToken())) {
                this.reportClick(getBrandName(), getDeviceToken());
            }
        }
    }

    @NonNull
    private String getJsonStr(int code, String msg) {
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("code", code);
        jsonMap.put("msg", msg);
        return new JSONObject(jsonMap).toString();
    }

    public void unRegisterToken() {
        if (checkInit()) {
            mPushProvider.unRegisterToken(result -> {
                if (!TextUtils.isEmpty(result.getToken())) {
//                    mPushApi.reportUnregister(result.getBrandName(), result.getToken());
                    mPushApi.unbindDevice(result.getBrandName(), result.getToken(), null);
                }
                updateToken(null, 0);
            });
        }
    }

    public void bindAlias(String alias) {
        if (checkInit()) {
            mPushProvider.bindAlias(alias);
            mPushApi.bindAlias(alias);
        }
    }

    public void unBindAlias(String alias) {
        if (checkInit()) {
            mPushProvider.unBindAlias(alias);
            mPushApi.bindAlias(null);
        }
    }

    public String getDeviceToken() {
        if (checkInit()) {
            String device_token = mPushProvider.getDeviceToken();
            if (!TextUtils.isEmpty(device_token)) {
                return device_token;
            }
        }
        return this.mspDeviceToken != null ? this.mspDeviceToken.getString(KEY_SP_DEVICE_TOKEN, null) : null;
    }

    public String getBrandName() {
        return mPushBrandName;
    }

    public boolean isSupport() {
        return !TextUtils.isEmpty(mPushBrandName);
    }

    public void turnOnPush() {
        if (checkInit())
            mPushProvider.turnOnPush();
    }

    public void turnOffPush() {
        if (checkInit())
            mPushProvider.turnOffPush();
    }

    public void addTags(String... tags) {
        if (checkInit()) {
            mPushApi.addTags(tags);
        }
    }

    public void delTags(String... tags) {
        if (checkInit()) {
            mPushApi.delTags(tags);
        }
    }
}
