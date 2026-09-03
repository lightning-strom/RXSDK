package com.ruixue.openapi;

import androidx.annotation.IntDef;
import androidx.annotation.StringDef;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/20
 */
public class Constants {

    /**
     * 用户名注册
     */
    public static final int REGISTER_TYPE_USERNAME = 1;
    /**
     * 手机号注册
     */
    public static final int REGISTER_TYPE_PHONE = 2;
    /**
     * 邮箱注册
     */
    public static final int REGISTER_TYPE_EMAIL = 3;

    @IntDef({REGISTER_TYPE_USERNAME, REGISTER_TYPE_PHONE, REGISTER_TYPE_EMAIL})
    @Retention(RetentionPolicy.SOURCE)
    public @interface RegisterType {

    }

    @StringDef({CAPTCHA_PURPOSE_REGISTER, CAPTCHA_PURPOSE_BINDPHONE, CAPTCHA_PURPOSE_UNBINDPHONE, CAPTCHA_PURPOSE_RESETPWD,
            CAPTCHA_PURPOSE_BINDEMAIL, CAPTCHA_PURPOSE_UNBINDEMAIL, CAPTCHA_PURPOSE_LOGIN, CAPTCHA_PURPOSE_SETPWD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface CaptchaPurpose {

    }

    /**
     * 短信意图-注册
     */
    public static final String CAPTCHA_PURPOSE_REGISTER = "register";
    /**
     * 短信意图-绑定手机
     */
    public static final String CAPTCHA_PURPOSE_BINDPHONE = "bindphone";
    /**
     * 短信意图-解绑手机
     */
    public static final String CAPTCHA_PURPOSE_UNBINDPHONE = "unbindphone";
    /**
     * 短信意图-重置密码
     */
    public static final String CAPTCHA_PURPOSE_RESETPWD = "resetpwd";
    /**
     * 验证码意图 绑定邮箱
     */
    public static final String CAPTCHA_PURPOSE_BINDEMAIL = "bindemail";
    /**
     * 验证码意图 解绑邮箱
     */
    public static final String CAPTCHA_PURPOSE_UNBINDEMAIL = "unbindemail";
    /**
     * 登录
     */
    public static final String CAPTCHA_PURPOSE_LOGIN = "login";
    /**
     * 设置密码
     */
    public static final String CAPTCHA_PURPOSE_SETPWD = "setpwd";

}
