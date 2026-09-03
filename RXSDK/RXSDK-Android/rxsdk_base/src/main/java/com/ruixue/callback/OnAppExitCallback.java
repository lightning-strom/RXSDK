package com.ruixue.callback;

import androidx.annotation.Nullable;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
public abstract class OnAppExitCallback {

    public abstract void onExitConfirm(@Nullable String res);

    public void onExitCancel() {
    }
}

