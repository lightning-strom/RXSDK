package com.ruixue.ossdk;

import android.app.Activity;

import com.ruixue.callback.RXUICallback;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.RXLoginUIModel;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityUICommonFun;
import com.ruixue.view.LoginViewMgr2;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/29
 */
public class OverseasSdkUI extends RXSdkUI {
    public OverseasSdkUI() {
    }

    private static class Single {
        static OverseasSdkUI sInstance = new OverseasSdkUI();
    }

    public static OverseasSdkUI getInstance() {
        return Single.sInstance;
    }

    @Override
    public IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback) {
        return LoginViewMgr2.getInstance().createLoginView(activity, config, loginCallback);
    }

    public IRXView unityLoginUI(Activity activity, LoginUIConfig config, UnityRXRequestCallback loginCallback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () ->
                LoginViewMgr2.getInstance().createLoginView(activity, config,
                        UnityUICommonFun.convertRXUICallback(loginCallback))
        );
    }

    /**
     * @param activity         应用上下文
     * @param config           登录配置
     * @param loginCallback    登录回调
     * @param registerCallback 注册回调
     */
    public IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback, RXUICallback registerCallback) {
        return loginUIOS(activity, config, config.getCustomParams(), loginCallback, registerCallback);
    }

    @Override
    public IRXView loginUI(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback) {
        return loginUIOS(activity, config, map, loginCallback);
    }

    @Override
    public void showLoginUI(Activity activity, RXLoginUIModel config, RXUICallback loginCallback) {
        loginUIOS(activity, config, config.getCustomParams(), loginCallback).show();
    }
}
