package com.ruixue.callback;

import androidx.annotation.Nullable;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
public interface SwitchCallback<T> {

    void onSuccess(@Nullable T data);

    void onFailed(@Nullable T data);

    void onLogout(@Nullable T data);
}
