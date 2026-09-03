package com.ruixue.websocket;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import org.json.JSONObject;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/21
 */

public class DataBean implements Serializable {

    @SerializedName("msg_type")
    protected Integer msgType;

    @SerializedName("uuid")
    protected String uuid;
    @SerializedName("body")
    protected BodyBean body;

    public Map<String, Object> getExt() {
        return ext;
    }

    public void setExt(Map<String, Object> ext) {
        this.ext = ext;
    }

    protected Map<String,Object> ext;

    public Integer getMsgType() {
        return msgType;
    }

    public String getUUID() {
        return uuid;
    }

    public BodyBean getBody() {
        return body;
    }

    public static String getCloseBean() {
        Map<String, Object> msg = new HashMap<>();
        msg.put("msg_type", -1);
        return new JSONObject(msg).toString();
    }
    public static String getResp() {
        Map<String, Object> msg = new HashMap<>();
        msg.put("msg_type", 99);
        return new JSONObject(msg).toString();
    }

    public static DataBean objectFromData(String str) {
        try {
            return new Gson().fromJson(str, DataBean.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static class BodyBean {
        protected String event="";
        protected Map<String, Object> info;

        public Map<String, Object> getInfo() {
            return info;
        }

        public String getEvent() {
            return event;
        }

    }
}
