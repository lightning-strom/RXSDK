package com.ruixue.realauth;


import android.view.ViewGroup;

// Created by wangliang on 2025/5/22.
public class IdCardNumberKeyboardViewManager {
    private static IdCardNumberKeyboardViewManager instanceField;

    public static IdCardNumberKeyboardViewManager getInstance() {
        if (instanceField == null) {
            synchronized (IdCardNumberKeyboardViewManager.class) {
                if (instanceField == null) {
                    instanceField = new IdCardNumberKeyboardViewManager();
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private boolean isShowing = false;
    public void setShowing(boolean isShowing) {
        this.isShowing = isShowing;
    }
    private IdCardNumberKeyboardView keyboardView;
    public void show(ViewGroup root, String defaultValue, IdKeyboardCallback callback) {
        if (isShowing || root == null) {
            return;
        }
        isShowing = true;

        keyboardView = new IdCardNumberKeyboardView(root.getContext());
        keyboardView.setCallback(new IdKeyboardCallback() {
            @Override
            public void onShow(float keyboardHeight) {
                if (callback != null) {
                    callback.onShow(keyboardHeight);
                }
            }

            @Override
            public void onInputContent(String content) {
                if (callback != null)
                    callback.onInputContent(content);
            }

            @Override
            public void onDelete() {
                if (callback != null)
                    callback.onDelete();
            }

            @Override
            public void onHide() {
                isShowing = false;
                if (callback != null)
                    callback.onHide();
            }
        });
        keyboardView.setDefaultValue(defaultValue);
        keyboardView.show(root);
    }

    public void hide() {
        if (keyboardView != null) {
            keyboardView.hide();
        }
    }
}
