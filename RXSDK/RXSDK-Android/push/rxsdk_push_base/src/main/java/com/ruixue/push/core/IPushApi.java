package com.ruixue.push.core;

import androidx.annotation.IntDef;
import androidx.annotation.IntegerRes;

import com.ruixue.RXJSONCallback;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/3
 */
public interface IPushApi {
    /**
     * 到达上报
     */
    int REPORT_TYPE_ARRIVED = 2;

    /**
     * 点击上报
     */
    int REPORT_TYPE_CLICK = 3;

    @IntDef({REPORT_TYPE_ARRIVED, REPORT_TYPE_CLICK})
    @Retention(RetentionPolicy.SOURCE)
    @interface ReportType {
    }

    void reportNotifyStatus(String brandName, String deviceToken, String taskId, @ReportType int reportType);

    void reportNotificationClicked(String brandName, String deviceToken, String taskId, RXJSONCallback callback);

    void addTags(String[] alias);

    void delTags(String[] alias);

    void bindAlias(String alias);

    void unbindDevice(String brandName, String deviceToken, DeviceResultCallback callback);

    void bindDevice(String brandName, String deviceToken, DeviceResultCallback callback);
}
