package com.ruixue.openapi;

import android.content.DialogInterface;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/23
 */
public interface IRXView extends DialogInterface {

    /**
     *
     * @param flag 是否可取消
     */
    IRXView setCancelable(boolean flag);

    /**
     * @param cancel 空白处点击关闭窗口
     */
    IRXView setCanceledOnTouchOutside(boolean cancel);

    /**
     *
     * @return 是否可取消
     */
    boolean isCancelable();

    /**
     *
     * @return 是否已显示
     */
    boolean isShowing();


    /**
     * 显示窗口
     */
    void show();
}
