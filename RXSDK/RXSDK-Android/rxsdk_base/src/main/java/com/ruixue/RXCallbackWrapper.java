package com.ruixue;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/6/17
 */
public class RXCallbackWrapper extends RXJSONCallback {
    private final RXJSONCallback delegate;
    final AtomicInteger completed = new AtomicInteger(0);
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable timeoutRunnable;
    private final AtomicBoolean called = new AtomicBoolean(false);
    int TOTAL_TASKS;
    JSONObject tmpData;
    int defaultCode = 9000;

    public void setDefaultCode(int defaultCode) {
        this.defaultCode = defaultCode;
    }

    public boolean isCalled() {
        return called.get();
    }

    public RXCallbackWrapper(RXJSONCallback delegate, int tasks, long timeoutMs) {
        this.delegate = delegate;
        TOTAL_TASKS = tasks;
        if (timeoutMs > 0) {
            startTimeout(timeoutMs);
        }
    }

    private void startTimeout(long timeoutMs) {
        timeoutRunnable = () -> {
            if (called.compareAndSet(false, true) && delegate != null) {
                JSONObject err = new JSONObject();
                try {
                    err.put("code", defaultCode);
                    err.put("message", "Error: timeout after " + timeoutMs + " ms");
                } catch (Exception ignore) {
                }
                RXLogger.e("RXCallbackWrapper timeout triggered " + timeoutMs);
                delegate.onFailed(err);
            }
        };
        handler.postDelayed(timeoutRunnable, timeoutMs);
    }

    private void cancelTimeout() {
        if (timeoutRunnable != null) {
            handler.removeCallbacks(timeoutRunnable);
        }
    }

    public void invokeSuccess(JSONObject data) {
        if (data != null) {
            tmpData = data;
        }
        onSuccess(this.tmpData);
    }

    @Override
    public void onSuccess(@Nullable JSONObject data) {
        if (called.get())
            return;
        if (completed.incrementAndGet() >= TOTAL_TASKS) {
            if (called.compareAndSet(false, true) && delegate != null) {
                cancelTimeout();
                delegate.onSuccess(data);
//                RXLogger.i(this.toString() + " onSuccess completed:" + completed.get() + ",total:" + TOTAL_TASKS);
            } else {
                RXLogger.w("onSuccess: already called, ignored.");
            }
        } else {
//            RXLogger.i(this.toString() + " onSuccess completed:" + completed.get() + ",total:" + TOTAL_TASKS);
        }
    }

    @Override
    public void onFailed(@NonNull JSONObject cause) {
        if (called.compareAndSet(false, true) && delegate != null) {
            cancelTimeout();
            delegate.onFailed(cause);
        } else {
            RXLogger.w("onFailed: already called, ignored.");
        }
    }

    public void onError(RXException ex) {
        if (called.compareAndSet(false, true) && delegate != null) {
            cancelTimeout();
            delegate.onError(ex);
        } else {
            RXLogger.w("onError: already called, ignored.");
        }
    }
}
