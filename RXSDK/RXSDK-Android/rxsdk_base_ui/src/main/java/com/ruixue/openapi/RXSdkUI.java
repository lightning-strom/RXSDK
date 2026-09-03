package com.ruixue.openapi;

import android.app.Activity;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityUICommonFun;
import com.ruixue.view.LoginViewManager;

import java.util.Map;

/**
 * 瑞雪 SDK UI 接口类
 */
public class RXSdkUI extends BaseRXSdkUI {

    public RXSdkUI() {
    }

    private static class Single {
        static RXSdkUI sInstance = new RXSdkUI();
    }

    public static RXSdkUI getInstance() {
        return Single.sInstance;
    }


    @Deprecated(since = "Use showLoginView method instead")
    public IRXView loginUI(Activity activity, RXUICallback loginCallback) {
        return loginUI(activity, null, null, loginCallback);
    }

    /**
     * @param activity      页面上下文
     * @param map           登录自定义携带参数
     * @param loginCallback 登录回调
     * @return IRXView 界面控制接口
     */
    @Deprecated(since = "Use showLoginView method instead")
    public IRXView loginUI(Activity activity, Map<String, Object> map, RXUICallback loginCallback) {
        return loginUI(activity, null, map, loginCallback);
    }

    public IRXView unityLoginUI(Activity activity, Map<String, Object> map, RXUICallback loginCallback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> loginUI(activity, null, map, loginCallback));
    }

    @Deprecated(since = "Use showLoginView method instead")
    public IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback) {
        return LoginViewManager.getInstance().createLoginView(activity, config, loginCallback);
    }

    public IRXView unityLoginUI(Activity activity, LoginUIConfig config, UnityRXRequestCallback loginCallback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> loginUI(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
    }

    @Deprecated(since = "Use showLoginView method instead")
    public IRXView loginUI(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback) {
        return LoginViewManager.getInstance().createLoginView(activity, config, map, loginCallback);
    }

    public IRXView unityLoginUI(Activity activity, LoginUIConfig config, Map<String, Object> map, UnityRXRequestCallback loginCallback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> loginUI(activity, config, map, UnityUICommonFun.convertRXUICallback(loginCallback)));
    }

    /**
     * 调用登录弹窗
     * @param activity      应用Activity
     * @param config        登录页基础配置，默认读取后台配置，优先读取代码配置
     * @param loginCallback 登录结果
     * @return login_openid 是否失效，true 失效，false 有效， config 需要和 showLoginView 配置相同 返回 true 时会拉起登录 ui 重新登录，返回 false 表示登录未过期 不会拉起登录 ui，不需要重新登录
     */
    public boolean loginOpenidExpireInvalid(Activity activity, RXLoginUIModel config, RXRequestCallback loginCallback) {
        boolean isExpired = RuiXueSdk.loginOpenidExpireInvalid();
        if (isExpired) {
            showLoginUI(activity, config, loginCallback);
        }
        return isExpired;
    }

    public boolean unityLoginOpenidExpireInvalid(Activity activity, RXLoginUIModel config, UnityRXRequestCallback loginCallback) {
        Boolean ret = UnityUICommonFun.runOnUIHasTurn(activity, () -> loginOpenidExpireInvalid(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
        return ret != null && ret;
    }

    /**
     * 登录界面 传入自定义配置。
     * @param activity      activity
     * @param config        自定义配置，@RXLoginUIModel 结构注释参照下方参数说明
     * @param loginCallback 登录回调
     */
    public void showLoginUI(Activity activity, RXLoginUIModel config, RXUICallback loginCallback) {
        // 这里根据新需求不再接收外部传递的是否显示验证码的配置，由于内部逻辑复杂，这里 hack 一下，强制设置成 false
        if (config != null && config.isCaptchaLogin)
            config.setCaptchaLogin(false);
        LoginViewManager.getInstance().showLoginView(activity, config, loginCallback);
    }

    public void unityShowLoginUI(Activity activity, RXLoginUIModel config, UnityRXRequestCallback loginCallback) {
        // 这里根据新需求不再接收外部传递的是否显示验证码的配置，由于内部逻辑复杂，这里 hack 一下，强制设置成 false
        if (config != null && config.isCaptchaLogin)
            config.setCaptchaLogin(false);
        UnityUICommonFun.runOnUINoTurn(activity, () -> showLoginUI(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
    }


    @Deprecated(since = "Use showLoginView method instead")
    public void showOAuthLoginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback) {
        // 这里根据新需求不再接收外部传递的是否显示验证码的配置，由于内部逻辑复杂，这里 hack 一下，强制设置成 false
        if (config != null && config.isCaptchaLogin)
            config.setCaptchaLogin(false);
        LoginViewManager.getInstance().showOAuthLoginView(activity, config, loginCallback);
    }

    public void unityShowOAuthLoginUI(Activity activity, LoginUIConfig config, UnityRXRequestCallback loginCallback) {
        // 这里根据新需求不再接收外部传递的是否显示验证码的配置，由于内部逻辑复杂，这里 hack 一下，强制设置成 false
        if (config != null && config.isCaptchaLogin)
            config.setCaptchaLogin(false);
        UnityUICommonFun.runOnUINoTurn(activity, () -> LoginViewManager.getInstance().showOAuthLoginView(activity, config, UnityUICommonFun.convertRXUICallback(loginCallback)));
    }
}
