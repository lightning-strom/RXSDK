package com.ruixue.openapi;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/24
 */
public abstract class RuiXueSdkCallback {
    //    public abstract void onPrivacyAgree(boolean var1);
    public static  final int FEED_BACK = 10001;

    public void rxPublicCallback(int type, Map<String,Object> map) {


    }

    public void exitApp() {

    }

    public abstract void onLogout(int code, String msg);

    public boolean onSwitchAccount(int code, String data) {
        return true;
    }

}
