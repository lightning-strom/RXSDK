package com.ruixue.callback;

import androidx.annotation.Nullable;

public interface OnLogoutCallback {
    void onSuccess(@Nullable String data);

    default void onFailed(int code, String msg) {
    }

    OnLogoutCallback EMPTY = data -> {

    };
}
