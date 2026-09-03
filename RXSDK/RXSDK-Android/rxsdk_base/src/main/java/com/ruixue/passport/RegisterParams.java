package com.ruixue.passport;

import androidx.annotation.Keep;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

public class RegisterParams {

    @Keep
    protected String captcha_code;
    @Keep
    protected String username;
    @Keep
    protected String password;
    @Keep
    protected String nickname;
    @Keep
    protected String sex;
    @Keep
    protected String avatarUrl;
    @Keep
    protected Map<String, Object> user_source;
    @Keep
    protected Object migrate_args;
    @Keep
    protected Map<String, Object> device;

    public RegisterParams() {
    }

    public void setCaptcha_code(String captcha_code) {
        this.captcha_code = captcha_code;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setUser_source(Map<String, Object> user_source) {
        this.user_source = user_source;
    }

    public void setMigrate_args(Object migrate_args) {
        this.migrate_args = migrate_args;
    }

    public void setDevice(Map<String, Object> device) {
        this.device = device;
    }

    public static RegisterParams fromMap(Map<String, Object> loginMap) {
        return EntityUtils.mapToEntity(loginMap, RegisterParams.class);
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


}
