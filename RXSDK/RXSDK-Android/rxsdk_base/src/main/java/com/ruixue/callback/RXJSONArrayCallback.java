package com.ruixue.callback;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public abstract class RXJSONArrayCallback extends RXJSONCallback {
    @Override
    public void onSuccess(@Nullable JSONObject data) {
        onSuccess(data == null ? null : data.optJSONArray("data"));
    }

    @Override
    public void onFailed(@NonNull JSONObject cause) {
        onFailed(cause.optInt("code", -1), cause.optString("msg"), cause.optString("trace_id"));
    }

    public abstract void onSuccess(@Nullable JSONArray data);

    public abstract void onFailed(int code, String msg, @Nullable String traceId);


}
