package com.ruixue.openapi;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.callback.RXCallback;
import com.ruixue.error.RXException;

import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/30
 */
public abstract class BusinessDataCallback implements RXCallback<List<BusinessWindowData>> {
    public abstract void onResponse(@Nullable List<BusinessWindowData> data);

    @Override
    public void onSuccess(@Nullable List<BusinessWindowData> data) {
        onResponse(data);
    }

    @Override
    public void onFailed(@NonNull List<BusinessWindowData> cause) {
        onResponse(cause);
    }

    @Override
    public void onError(RXException e) {
    }
}