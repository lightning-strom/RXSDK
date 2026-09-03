package com.ruixue.openapi;

import java.util.LinkedHashMap;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/12/18
 */
public class RXLoginUIModel extends LoginUIConfig {

    public RXLoginUIModel() {
        super();
        privacyOneStr = "用户协议";
        privacyTwoStr = "隐私政策";
    }

    public void needRealAuth(boolean needRealAuth) {
        this.indulge_auth = needRealAuth ? 1 : 0;
    }


    public void canCloseRealAuth(boolean canCloseRealAuth) {
        this.canCloseRealAuth = canCloseRealAuth;
    }

    /**
     * @param privacyMap key url
     *                   value 显示名称
     */
    public void setPrivacies(LinkedHashMap<String, Object> privacyMap) {
        this.privacyMap = privacyMap;
    }

    /**
     * 账号密码登录方式键盘类型，1 全键盘  2 数字键盘 3 邮箱键盘  默认全键盘
     */
    @Deprecated
    public void keyboardType(int loginType) {
        this.loginType = loginType;
    }

    /**
     * 显示账号密码登录或验证码登录，0 账号密码登录  1 验证码登录  默认验证码登录
     */
    @Deprecated
    public void loginViewType(int loginType) {
        isCaptchaLogin = loginType > 0;
    }

    public void isShowClose(boolean cancelable) {
        isCancelable = cancelable;
    }

}
