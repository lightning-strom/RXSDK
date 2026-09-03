package com.ruixue.view.mail.bean;

import com.google.gson.annotations.SerializedName;

public class MailItemBean {


    @SerializedName("rx_mail_id")
    private Integer rxMailId;
    @SerializedName("title")
    private String title;
    @SerializedName("send_at")
    private String sendAt;
    @SerializedName("status")
    private Integer status;
    @SerializedName("send_time")
    private String sendTime;

    public Integer getRxMailId() {
        return rxMailId;
    }

    public void setRxMailId(Integer rxMailId) {
        this.rxMailId = rxMailId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSendAt() {
        return sendAt;
    }

    public void setSendAt(String sendAt) {
        this.sendAt = sendAt;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getSendTime() {
        return sendTime;
    }

    public void setSendTime(String sendTime) {
        this.sendTime = sendTime;
    }
}
