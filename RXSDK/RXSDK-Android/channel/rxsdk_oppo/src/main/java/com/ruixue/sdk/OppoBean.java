package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

//{"token":"TICKET_Ajnx0SLbfzTxUbqR\/5oEvxzVM1pZ4Iz97Wt\/sKxLGhBKqR+Jf9dX\/b4r1i6vNFIqntHxq2ZFqFjYOWS4whsrCbTkp0cYuTxJ+wv+jZosGPpehTuMqyEfjk+Lpibfve3onBcPC\/UHDGLTXZEzQloXT+Rnil2FV77j5P1cfCg7JesgeD6dPmSLEyMsMQ\/url4uQBpprzFZIkRSId3l+TfdnzlLrtVYXfsTj0VzMa2uBihWctBfM\/1tMTaQPx2KNMDPP3nbtreOLhPqG85cDVA04iUILfUO\/5kp9dQoOEz5fZHHOpRVidKpjkWBXSG0VTMwUmla1etLJpiIIAzGFYyTdMuuNf74B3vL9qShXr2U\/WMq3HxTqgpv+uXLYh0xIev43Lokk+\/snVkOMDV\/PFbY3q+hUb919dVmQlbFi8lewNqAoTNYFXdophGPQVkld+BwEKv4Jf\/FXI\/mu5+DEvCZ1qDI8c4lvGcXr2YkQDJKtMg=","ssoid":"123512259","channel":0,"adId":"0"}
public class OppoBean {


    @Keep
    private String token;
    @Keep
    private String ssoid;
    @Keep
    private String channel;
    @Keep
    private String adId;

    public String getToken() {
        return token;
    }

    public String getSsoid() {
        return ssoid;
    }

    public String getChannel() {
        return channel;
    }

    public String getAdId() {
        return adId;
    }

    public static OppoBean fromJson(String json) {
        return ObjectUtils.requireNonNull(new Gson().fromJson(json, OppoBean.class),"oppo bean parse error!");
    }

    public JSONObject toJSONObject() {
        Map<String, String> map = new HashMap<>();
        map.put("token", token);
        map.put("ssoid", ssoid);
//        map.put("openid", ssoid);
        map.put("adId", adId);
        map.put("channel", String.valueOf( channel));
        return new JSONObject(map);
    }

}
