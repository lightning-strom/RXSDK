package com.ruixue.openapi;

import com.ruixue.passport.LoginMethod;

import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/10
 */
@Deprecated
public class LoginButtonConfig {


    protected final String method;
    protected Map<String, Object> methodConfig;

    public LoginButtonConfig(  String method) {
        this.method = method;
    }

    public Map<String, Object> getMethodConfig() {
        return methodConfig;
    }

    public void setMethodConfig(Map<String, Object> methodConfig) {
        this.methodConfig = methodConfig;
    }

    public String getMethod() {
        return method;
    }

}
