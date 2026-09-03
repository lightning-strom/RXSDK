package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.huawei.hms.jos.AppUpdateClient;
import com.huawei.hms.jos.JosApps;
import com.huawei.updatesdk.service.appmgr.bean.ApkUpgradeInfo;
import com.huawei.updatesdk.service.otaupdate.CheckUpdateCallBack;
import com.huawei.updatesdk.service.otaupdate.UpdateKey;
import com.ruixue.RuiXueSdk;

import java.io.Serializable;

/**
 * @author JZ
 * @time 23/12/2020
 */
public class HmsUpdateCallBack implements CheckUpdateCallBack {
    private static final String TAG = RuiXueSdk.TAG;
    private Activity activity;
    private boolean force;

    public HmsUpdateCallBack(Activity activity, boolean force) {
        this.activity = activity;
        this.force = force;
    }

    /**
     * Get update info from appmarket
     * *
     * 从应用市场获取的更新状态信息
     * @param intent see detail:
     *               https://developer.huawei.com/consumer/cn/doc/development/HMS-References/appupdateclient#intent
     */
    @Override
    public void onUpdateInfo(Intent intent) {
        if (intent != null) {
            // 更新状态信息
            int status = intent.getIntExtra(UpdateKey.STATUS, -99);
            Log.i(TAG, "check update status is:" + status);
            // 返回错误码
            int rtnCode = intent.getIntExtra(UpdateKey.FAIL_CODE, -99);
            // 返回失败信息
            String rtnMessage = intent.getStringExtra(UpdateKey.FAIL_REASON);
            // 强制更新应用时，弹出对话框后用户是否点击“退出应用”按钮
            boolean isExit = intent.getBooleanExtra(UpdateKey.MUST_UPDATE, false);
            if (isExit) {
                System.exit(0);
            }
            Serializable info = intent.getSerializableExtra(UpdateKey.INFO);
            if (info instanceof ApkUpgradeInfo) {
                Log.e(TAG, "rx hms check update success");
                AppUpdateClient client = JosApps.getAppUpdateClient(activity);
                /**
                 * show update dialog
                 * *
                 * 弹出升级提示框
                 */
                client.showUpdateDialog(activity, (ApkUpgradeInfo) info, force);
            } else {
                Log.i(TAG, "rx hms check update no need to update");
            }
        }
    }

    @Override
    public void onMarketInstallInfo(Intent intent) {

    }

    @Override
    public void onMarketStoreError(int i) {

    }

    @Override
    public void onUpdateStoreError(int i) {

    }
}
