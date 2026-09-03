package com.ruixue.openapi;


import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import androidx.annotation.NonNull;

import com.sdk007.lib.SDK007Manager;
import com.sdk007.lib.application.SDKProxyApplication;

import java.util.Map;

/**
 * Created by wangliang on 2024/11/12
 */
public class M007SdkHelper {

    static class Single {
        final static M007SdkHelper INSTANCE = new M007SdkHelper();
    }

    protected M007SdkHelper() {
    }

    @NonNull
    public static M007SdkHelper getInstance() {
        return Single.INSTANCE;
    }

    private SDKProxyApplication proxyApplication;

    public void applicationAttachBaseContext(Context context, Application application) {
        this.proxyApplication = new SDKProxyApplication(application);
        proxyApplication.attachBaseContext(context);
    }

    public void applicationCreate(Application application) {
        if (proxyApplication != null)
            proxyApplication.onCreate();
    }

    public void applicationConfigurationChanged(Configuration newConfig) {
        if (proxyApplication != null)
            proxyApplication.onConfigurationChanged(newConfig);
    }


    public void setRoleInfo(Map<String, String> map) {
        SDK007Manager.getInstance().setRoleInfo(map);
    }
}
