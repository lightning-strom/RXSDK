package com.ruixue.realauth;


import android.content.Context;
import android.content.Intent;

// Created by wangliang on 2025/5/12.
public class IdCardNumberKeyboardManager {
    private static IdCardNumberKeyboardManager instanceField;

    public static IdCardNumberKeyboardManager getInstance() {
        if (instanceField == null) {
            synchronized (IdCardNumberKeyboardManager.class) {
                if (instanceField == null) {
                    instanceField = new IdCardNumberKeyboardManager();
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private KeyboardCallback callback;
    private float keyboardHeight = 0;
    public void setKeyboardHeight(float keyboardHeight) {
        this.keyboardHeight = keyboardHeight;
    }

    public float getKeyboardHeight() {
        return keyboardHeight;
    }

    public void onShowCallback(float keyboardHeight) {
        if (callback != null) {
            callback.onShow(keyboardHeight);
        }
    }

    public void onFinishCallback(String content) {
        if (callback != null) {
            callback.onFinish(content);
        }
    }

    public void onCancelCallback() {
        if (callback != null) {
            callback.onCancel();
        }
    }

    public void onHideAnimStartCallback() {
        if (callback != null) {
            callback.onHideAnimStart();
        }
    }

    public void onHideCallback() {
        if (callback != null) {
            callback.onHide();
            callback = null;
        }
    }

    /**
     * 显示自定义身份证键盘
     *
     * @param context 上下文
     * @param defaultValue 默认值
     * @param style 0:默认主题 1:浅色主题（瑞雪 UI 当前使用）
     * @param callback 回调
     */
    public void showIdCardKeyboard(Context context, String defaultValue, int style, KeyboardCallback callback) {
        this.callback = callback;
        Intent intent = new Intent(context, IdCardKeyboardActivity.class);
        intent.putExtra("defaultValue", defaultValue);
        intent.putExtra("style", style);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
        context.startActivity(intent);
    }

//    public void showIdCardKeyboard(EditText editText, String defaultValue, IdKeyboardCallback callback) {
//        IdCardNumberKeyboardView keyboardView = new IdCardNumberKeyboardView(editText.getContext());
//        keyboardView.setDefaultValue(defaultValue);
//        keyboardView.setCallback(callback);
//        AnimatedPopupWindow popupWindow = new AnimatedPopupWindow(editText.getContext(), keyboardView);
//        popupWindow.show(editText.getRootView());
//    }

//    public void showIdCardKeyboard(View rootView, String defaultValue, IdKeyboardCallback callback) {
//        IdCardNumberKeyboardViewManager.getInstance().show((ViewGroup) rootView, defaultValue, callback);
//    }

//    public void hideIdCardKeyboard() {
//        IdCardNumberKeyboardViewManager.getInstance().hide();
//    }

    public void reset() {
        this.callback = null;
    }
}
