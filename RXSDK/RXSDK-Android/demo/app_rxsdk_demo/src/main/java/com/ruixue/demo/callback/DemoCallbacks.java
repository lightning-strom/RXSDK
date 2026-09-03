package com.ruixue.demo.callback;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.demo.v2.DemoManager;

import org.json.JSONObject;

/**
 * 为 Demo 测试按钮统一包装 SDK 回调，保证成功与失败分支都能输出到日志，
 * 避免各 Module 里手写匿名实现时漏掉 onError/onFailed 导致错误被吞掉。
 */
public final class DemoCallbacks {

    private DemoCallbacks() {}

    public static RXRequestCallback request(@NonNull DemoManager.ResultCallback ui, @NonNull String tag) {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                ui.onResult(tag + ": " + response);
            }

            @Override
            public void onError(RXException e) {
                ui.onResult(tag + " 失败: " + e.getJSONString());
            }
        };
    }

    public static RXJSONCallback json(@NonNull DemoManager.ResultCallback ui, @NonNull String tag) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ui.onResult(tag + " 成功: " + (data == null ? "null" : data.toString()));
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ui.onResult(tag + " 失败: " + cause.toString());
            }
        };
    }

    public static RXStringCallback string(@NonNull DemoManager.ResultCallback ui, @NonNull String tag) {
        return new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                ui.onResult(tag + " 成功:\n" + data);
            }

            @Override
            public void onFailed(int code, String msg, String traceId) {
                ui.onResult(tag + " 失败: " + code + " - " + msg);
            }

            @Override
            public void onError(RXException e) {
                ui.onResult(tag + " 错误: " + e.getJSONString());
            }
        };
    }
}
