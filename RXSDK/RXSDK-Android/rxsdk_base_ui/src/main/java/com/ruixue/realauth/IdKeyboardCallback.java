package com.ruixue.realauth;

// Created by wangliang on 2025/5/22.
public interface IdKeyboardCallback {
    void onShow(float keyboardHeight);
    void onHide();
    void onInputContent(String content);
    void onDelete();
}
