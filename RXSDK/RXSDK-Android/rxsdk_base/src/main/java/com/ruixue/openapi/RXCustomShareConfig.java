package com.ruixue.openapi;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.EntityUtils;
import com.ruixue.utils.JSONUtil;

import java.lang.reflect.Type;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/1/25
 */
@Keep
public class RXCustomShareConfig extends ShareObject {

    @Keep
    protected Boolean show_content_in_circle = false;
    @Keep
    protected String appid;
    //微信 openid
    @Keep
    protected String openId;
    @Keep
    protected String username;
    @Keep
    protected String path = "";
    protected String use_scheme ;
    protected String protocol_ios ;
    protected String protocol_android ;

    @Keep
    protected Boolean withShareTicket = true;
    protected String extData;

    public String getUseScheme() {
        return use_scheme;
    }

    public void setUseScheme(String use_scheme) {
        this.use_scheme = use_scheme;
    }

    public String getIOSProtocol() {
        return protocol_ios;
    }

    public void setIOSProtocol(String protocol_ios) {
        this.protocol_ios = protocol_ios;
    }

    public String getAndroidProtocol() {
        return protocol_android;
    }

    public void setAndroidProtocol(String protocol_android) {
        this.protocol_android = protocol_android;
    }

    public Boolean getShow_content_in_circle() {
        return show_content_in_circle;
    }

    public void setShow_content_in_circle(Boolean show_content_in_circle) {
        this.show_content_in_circle = show_content_in_circle;
    }

    public String getThirdAppid() {
        return appid;
    }

    public void setThirdAppid(String appid) {
        this.appid = appid;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Boolean getWithShareTicket() {
        return withShareTicket;
    }

    public void setWithShareTicket(Boolean withShareTicket) {
        this.withShareTicket = withShareTicket;
    }

    public String getExtData() {
        return extData;
    }

    public void setExtData(String extData) {
        this.extData = extData;
    }

    // fix vivo system bug
    public Map<String, Object> toMap() {
         Type type = new TypeToken<Map<String, Object>>() {}.getType();
         Map<String, Object> map = JSONUtil.fromJson(new Gson().toJson(this),type);
        return  map;
//        return EntityUtils.entityToMap(this,true,false);
    }
}
