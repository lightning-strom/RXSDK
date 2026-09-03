package com.ruixue.share;

import com.ruixue.share.PlatformType;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

public interface ShareListener {
    void onStart(PlatformType var1);

    void onResult(PlatformType var1);

    void onError(PlatformType var1, Throwable var2);

    void onCancel(PlatformType var1);
}
