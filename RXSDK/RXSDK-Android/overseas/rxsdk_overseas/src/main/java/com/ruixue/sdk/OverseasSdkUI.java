package com.ruixue.sdk;

import android.app.Activity;

import com.ruixue.callback.RXUICallback;
import com.ruixue.openapi.BaseRXSdkUI;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityUICommonFun;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/29
 */
public class OverseasSdkUI extends BaseRXSdkUI {
    public OverseasSdkUI() {
    }

    private static class Single {
        static OverseasSdkUI sInstance = new OverseasSdkUI();
    }

    public static OverseasSdkUI getInstance() {
        return Single.sInstance;
    }

//    @Deprecated(since = "Use setLoginView method instead")
//
//    public IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback) {
//        return LoginViewMgr2.getInstance().createLoginView(activity, config, loginCallback);
//    }
//
//    public IRXView unityLoginUI(Activity activity, LoginUIConfig config, UnityRXRequestCallback loginCallback) {
//        return UnityUICommonFun.runOnUIHasTurn(activity, () -> LoginViewMgr2.getInstance().createLoginView(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
//    }
//
//    @Deprecated(since = "Use setLoginView method instead")
//    /**
//     * @param activity         应用上下文
//     * @param config           登录配置
//     * @param loginCallback    登录回调
//     * @param registerCallback 注册回调
//     */ public IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback, RXUICallback registerCallback) {
//        return loginUI2(activity, config, config.getCustomParams(), loginCallback, registerCallback);
//    }
//
//    @Deprecated(since = "Use setLoginView method instead")
//
//    public IRXView loginUI(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback) {
//        return loginUI2(activity, config, map, loginCallback);
//    }
//
//    @Deprecated(since = "Use setLoginView method instead")
//
//    public void showLoginUI(Activity activity, RXLoginUIModel config, RXUICallback loginCallback) {
//        loginUI2(activity, config, config.getCustomParams(), loginCallback).show();
//    }

    public void showLoginView(Activity activity, RXOSUILoginConfig config, RXUICallback loginCallback) {
        loginUIOS(activity, config, config.getCustomParams(), loginCallback).show();
    }

    public void setUnityLoginView(Activity activity, RXOSUILoginConfig config, UnityRXRequestCallback loginCallback) {
        UnityUICommonFun.runOnUINoTurn(activity, () -> showLoginView(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
    }
}
