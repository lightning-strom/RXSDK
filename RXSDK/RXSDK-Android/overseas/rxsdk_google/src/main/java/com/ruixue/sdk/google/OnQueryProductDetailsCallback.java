package com.ruixue.sdk.google;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/6
 */
public interface OnQueryProductDetailsCallback<T> {
    void onSuccess(T details);

    void onFailed(int respCode, String errMsg);
}