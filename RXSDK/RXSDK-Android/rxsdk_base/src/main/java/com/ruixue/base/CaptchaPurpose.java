package com.ruixue.base;

import androidx.annotation.StringDef;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue 验证码意图标识
 * @Author: ROC LEE
 * @Date: 2022/4/22
 */
public class CaptchaPurpose {
    //    注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）
    public static final int ACCOUNT_TYPE_NORMAL = 1;
    public static final int ACCOUNT_TYPE_PHONE = 2;
    public static final int ACCOUNT_TYPE_EMAIL = 3;

    @Retention(RetentionPolicy.SOURCE)
    @StringDef({REGISTER, BINDPHONE, UNBINDPHONE, RESETPWD, BINDEMAIL, UNBINDEMAIL, LOGIN, SETPWD})
    public @interface CaptchaPurposeDef {
    }

    public final String purpose;

    public CaptchaPurpose(@CaptchaPurposeDef String purpose) {
        this.purpose = purpose;
    }

    //意图 key 字段
    public static final String PURPOSE_KEY = "purpose";

    /**
     * 短信意图-注册
     */
    public static final String REGISTER = "register";
    /**
     * 短信意图-绑定手机
     */
    public static final String BINDPHONE = "bindphone";
    /**
     * 短信意图-解绑手机
     */
    public static final String UNBINDPHONE = "unbindphone";
    /**
     * 短信意图-重置密码
     */
    public static final String RESETPWD = "resetpwd";
    /**
     * 验证码意图 绑定邮箱
     */
    public static final String BINDEMAIL = "bindemail";
    /**
     * 验证码意图 解绑邮箱
     */
    public static final String UNBINDEMAIL = "unbindemail";
    /**
     * 登录
     */
    public static final String LOGIN = "login";
    /**
     * 设置密码
     */
    public static final String SETPWD = "setpwd";

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put(PURPOSE_KEY, purpose);
        return map;
    }
}
