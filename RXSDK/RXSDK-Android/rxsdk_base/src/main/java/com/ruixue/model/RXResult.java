package com.ruixue.model;

import com.google.gson.Gson;

public class RXResult extends BaseResult {
    private String traceId;

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public RXResult fromJson(String json) {
        return new Gson().fromJson(json, RXResult.class);
    }

    public String toJson() {
        return new Gson().toJson(this);
    }
}
