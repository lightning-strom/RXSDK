package com.ruixue.view.mail.bean;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class MailDetailBean {


    @SerializedName("content")
    private String content;
    @SerializedName("props")
    private List<PropsDTO> props;
    @SerializedName("sign")
    private String sign;
    @SerializedName("status")
    private Integer status;
    @SerializedName("title")
    private String title;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<PropsDTO> getProps() {
        return props;
    }

    public void setProps(List<PropsDTO> props) {
        this.props = props;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public static class PropsDTO {
        @SerializedName("count")
        private Integer count;
        @SerializedName("describe")
        private String describe;
        @SerializedName("icon")
        private String icon;
        @SerializedName("is_permanent")
        private Integer isPermanent;
        @SerializedName("name")
        private String name;
        @SerializedName("tag")
        private String tag;
        @SerializedName("time_limit")
        private Integer timeLimit;
        @SerializedName("count_format")
        private String countFormat;

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }

        public String getDescribe() {
            return describe;
        }

        public void setDescribe(String describe) {
            this.describe = describe;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public Integer getIsPermanent() {
            return isPermanent;
        }

        public void setIsPermanent(Integer isPermanent) {
            this.isPermanent = isPermanent;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public Integer getTimeLimit() {
            return timeLimit;
        }

        public void setTimeLimit(Integer timeLimit) {
            this.timeLimit = timeLimit;
        }

        public String getCountFormat() {
            return countFormat;
        }

        public void setCountFormat(String countFormat) {
            this.countFormat = countFormat;
        }
    }
}
