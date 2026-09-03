package com.ruixue.openapi;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/8/13
 */
public interface OnViewCloseListener {
    /**
     * Called when a view has been clicked.
     * @param v The view that was clicked.
     */
    void onClosed(IRXView v);
}
