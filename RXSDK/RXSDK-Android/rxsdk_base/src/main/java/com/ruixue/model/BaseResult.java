package com.ruixue.model;

import androidx.annotation.Keep;

public abstract class BaseResult {
    @Keep
    private int code;
    @Keep
    private String msg;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

}