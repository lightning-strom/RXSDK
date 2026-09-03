package com.ruixue.callback;

import androidx.annotation.Nullable;

import com.ruixue.error.RXException;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public abstract class RXStringCallback implements RXApiCallback {

    @Override
    public void onResponse(String response, boolean restfulData) {
        onSuccess(response);
    }

    @Override
    public void onError(RXException e) {
        onFailed(e.getCode(), e.getMessage(), e.getTraceId());
    }

    public abstract void onSuccess(@Nullable String data);

    public abstract void onFailed(int code, String msg, @Nullable String traceId);


}
