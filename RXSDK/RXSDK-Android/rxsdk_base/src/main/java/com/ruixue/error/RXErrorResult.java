package com.ruixue.error;

import com.google.gson.Gson;

public class RXErrorResult {

    private int code;
    private String msg = "";

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

    public static String resultJson(RXErrorCode errorCode) {
        RXErrorResult rxErrorResult = new RXErrorResult();
        rxErrorResult.setCode(errorCode.getValue());
        rxErrorResult.setMsg(errorCode.getDesc());
        return new Gson().toJson(rxErrorResult);
    }


    public static String resultJson(int code,String msg) {
        RXErrorResult rxErrorResult = new RXErrorResult();
        rxErrorResult.setCode(code);
        rxErrorResult.setMsg(msg);
        return new Gson().toJson(rxErrorResult);
    }

    public static String resultJson(Object o) {
        return new Gson().toJson(o);
    }
}
