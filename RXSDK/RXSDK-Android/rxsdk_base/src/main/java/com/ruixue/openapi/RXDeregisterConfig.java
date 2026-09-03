package com.ruixue.openapi;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/1/15
 */
public class RXDeregisterConfig {


    public void setIdCard(String idcard) {
        this.idcard = idcard;
    }


    public void setRealName(String realname) {
        this.realname = realname;
    }


    public void setCpData(String cpdata) {
        this.cpdata = cpdata;
    }

    public void setThirdParams(Map<String, Object> thirdParams) {
        this.thirdParams = thirdParams;
    }

    public String idcard;
    public String realname;
    public String cpdata;
    public Map<String, Object> thirdParams;
}
