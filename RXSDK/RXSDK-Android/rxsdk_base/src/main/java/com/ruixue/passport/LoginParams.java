package com.ruixue.passport;

import androidx.annotation.Keep;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

public class LoginParams {
    @Keep
    protected
    String method;
    @Keep
    protected String login_openid;
    @Keep
    protected String username;
    @Keep
    protected String password;
    @Keep
    protected String appid;
    @Keep
    protected int bind_thirdparty;

    @Keep
    protected String[] sign_fields;
    @Keep
    protected final int ts = (int) System.currentTimeMillis();

    @Keep
    protected Map<String, Object> user_source;

    @Keep
    protected Object migrate_args;

    @Keep
    protected Map<String, Object> device;
    @Keep
    protected Map<String, Object> ext;


    public LoginParams() {
    }

    public LoginParams(  String method) {
        this.method = method;
    }

    public static LoginParams fromMap(Map<String, Object> loginMap) {
        return EntityUtils.mapToEntity(loginMap, LoginParams.class);
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, false);
    }

    public JSONObject toJSONObject() {
        return new JSONObject(toMap());
    }

    public String toJSONString() {
        return new JSONObject(toMap()).toString();
    }

    /**
     * @return 登录方式 {@link LoginMethod}
     */
    public String getMethod() {
        return method;
    }

    /**
     * @param method 登录方式 {@link LoginMethod}
     */
    public void setMethod(String method) {
        this.method = method;
    }

    /**
     * @return 二次登录凭证，首次登录成功后可拿到
     */
    public String getLoginOpenid() {
        return login_openid;
    }

    /**
     * @param wxappid 微信登录使用 微信appid
     */
    public void setWxAppId(String wxappid) {
        this.appid = wxappid;
    }

    /**
     * @param login_openid 二次登录凭证，首次登录成功后可拿到
     */
    public void setLoginOpenid(String login_openid) {
        this.login_openid = login_openid;
    }

    /**
     * 本次是否为绑定三方登录方式的登录行为（1是，0否）
     */
    public int getBindThirdParty() {
        return bind_thirdparty;
    }

    /**
     * @param bind_thirdparty 本次是否为绑定三方登录方式的登录行为，（1是，0否）默认 0
     */
    public void setBindThirdParty(int bind_thirdparty) {
        this.bind_thirdparty = bind_thirdparty;
    }

    public String getUsername() {
        return username;
    }

    /**
     * @param username 用户名（method= {@link LoginMethod#USERNAME} 时有用）
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return 密码（method = {@link LoginMethod#USERNAME} 时有用）
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password 密码（method = {@link LoginMethod#USERNAME} 时有用）
     */
    public void setPassword(String password) {
        this.password = password;
    }

    public void setUserSource(Map<String, Object> user_source) {
        this.user_source = user_source;
    }

    public void setSignFields(String[] sign_fields) {
        this.sign_fields = sign_fields;
    }

    public void setMigrateArgs(Object migrate_args) {
        this.migrate_args = migrate_args;
    }

    /**
     * @return 设备标识信息
     * android_id 可空
     * oaid 可空
     * mac 可空
     * imei 可空
     */
    public Map<String, Object> getDevice() {
        return device;
    }

    /**
     * @param device 设备标识信息
     *               android_id
     *               oaid
     *               mac
     *               imei
     */
    public void setDevice(Map<String, Object> device) {
        this.device = device;
    }

    public Map<String, Object> getExt() {
        return ext;
    }

    public void setExt(Map<String, Object> ext) {
        this.ext = ext;
    }
}
