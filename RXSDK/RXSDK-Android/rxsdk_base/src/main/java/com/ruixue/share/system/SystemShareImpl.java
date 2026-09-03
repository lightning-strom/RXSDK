package com.ruixue.share.system;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.permission.OnPermissionCallback;
import com.ruixue.permission.RXPermissions;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/23
 */
public class SystemShareImpl extends ShareApi {
    static class Single {
        final static SystemShareImpl INSTANCE = new SystemShareImpl();
    }

    private SystemShareImpl() {
    }

    public static SystemShareImpl getInstance() {
        return Single.INSTANCE;
    }

    private final AtomicBoolean isSystemShare = new AtomicBoolean(false);

    private RXJSONCallback systemShareCallback;

    public void setSystemShareCallback(RXJSONCallback callback) {
        this.systemShareCallback = callback;
        this.isSystemShare.set(callback != null);
    }

    public void doShareBySystemImpl(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        setSystemShareCallback(callback);
        SystemShare.share(activity, shareObject, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (systemShareCallback != null)
                    systemShareCallback.onSuccess(data);
                setSystemShareCallback(null);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (systemShareCallback != null)
                    systemShareCallback.onFailed(cause);
                setSystemShareCallback(null);
            }
        });
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        try {
            ShareObject shareObject = ShareObject.fromMap(map);
            if (Objects.requireNonNull(shareObject.getType(), "error material_type is null.").equals(ShareMediaType.TEXT)) {
                doShareBySystemImpl(activity, shareObject, callback);
            } else {
                doShareBySystemImpl(activity, shareObject, callback);
            }
        } catch (Exception e) {
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }
        return true;
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.SYSTEM;
    }

    @Override
    public void onResume(Context context) {
        if (isSystemShare.compareAndSet(true, false)) {
            if (systemShareCallback != null)
                systemShareCallback.onSuccess(JSONUtil.toJSONObject(0, ""));
            setSystemShareCallback(null);
        }
    }

    @Override
    public void onShareActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == SystemShare.REQUEST_CODE_SYSTEM_SHARE) {
            onResume(activity);
        }
    }
}
