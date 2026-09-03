package com.ruixue.entity;

import com.ruixue.model.BaseResult;

/**
 * 防沉迷
 */
public class Aas extends BaseResult {
    private int aas;
    private int aas_type;
    private int attr;
    private int age;
    private int today_time;
    private int limit_seconds;
    public int getAas() {
        return aas;
    }

    public void setAas(int aas) {
        this.aas = aas;
    }

    public int getAttr() {
        return attr;
    }

    public void setAttr(int attr) {
        this.attr = attr;
    }

    public int getAas_type() {
        return aas_type;
    }

    public void setAas_type(int aas_type) {
        this.aas_type = aas_type;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getToday_time() {
        return today_time;
    }

    public void setToday_time(int today_time) {
        this.today_time = today_time;
    }

    public int getLimit_seconds() {
        return limit_seconds;
    }

    public void setLimit_seconds(int limit_seconds) {
        this.limit_seconds = limit_seconds;
    }
}
