package com.ruixue.share;

public interface OnShareCallback {

    void onStart();

    void onCancel();

    void onResult();

    void onError(Throwable var2);

}
