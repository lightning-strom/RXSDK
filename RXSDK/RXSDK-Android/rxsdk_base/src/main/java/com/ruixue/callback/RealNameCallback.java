package com.ruixue.callback;

import androidx.annotation.Nullable;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public interface RealNameCallback {
    void onResult(@Nullable JSONObject data);
}
