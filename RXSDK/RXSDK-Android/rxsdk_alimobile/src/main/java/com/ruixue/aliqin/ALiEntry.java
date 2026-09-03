package com.ruixue.aliqin;

import androidx.annotation.Keep;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

public class ALiEntry {

    @Keep
    private String carrierFailedResultData;
    @Keep
    private String code;
    @Keep
    private String msg;
    @Keep
    private int requestCode;
    @Keep
    private String requestId;
    @Keep
    private String token;
    @Keep
    private String vendorName;

    public String getCarrierFailedResultData() {
        return carrierFailedResultData;
    }

    public void setCarrierFailedResultData(String carrierFailedResultData) {
        this.carrierFailedResultData = carrierFailedResultData;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getRequestCode() {
        return requestCode;
    }

    public void setRequestCode(int requestCode) {
        this.requestCode = requestCode;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public static ALiEntry fromJson(String json) {
        return new Gson().fromJson(json, ALiEntry.class);
    }

    public Map<String,Object> toMap() {
        Map<String,Object> map=new HashMap<>();
        return map;
    }
}
