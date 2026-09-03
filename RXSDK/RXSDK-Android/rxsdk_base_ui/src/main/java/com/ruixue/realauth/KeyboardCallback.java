package com.ruixue.realauth;


// Created by wangliang on 2025/5/14.
public interface KeyboardCallback {

    void onShow(float keyboardHeight);

    void onHideAnimStart();
    void onHide();
    void onFinish(String content);
    void onCancel();
}
