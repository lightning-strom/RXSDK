package com.ruixue.feedbackui.bean;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class FeedbackDetailItem {


    @SerializedName("code")
    private Integer code;
    @SerializedName("msg")
    private String msg;
    @SerializedName("data")
    private DataDTO data;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public DataDTO getData() {
        return data;
    }

    public void setData(DataDTO data) {
        this.data = data;
    }

    public static class DataDTO {
        @SerializedName("id")
        private Integer id;
        @SerializedName("content")
        private String content;
        @SerializedName("attachments")
        private List<String> attachments;
        @SerializedName("created_at")
        private String createdAt;
        @SerializedName("status")
        private Integer status;
        @SerializedName("recover_at")
        private String recoverAt;
        @SerializedName("recover_content")
        private String recoverContent;
        @SerializedName("recover_attachments")
        private List<String> recoverAttachments;
        @SerializedName("is_prop")
        private Integer isProp;
        @SerializedName("get_prop")
        private Integer getProp;
        @SerializedName("prop")
        private List<PropDTO> prop;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public List<String> getAttachments() {
            return attachments;
        }

        public void setAttachments(List<String> attachments) {
            this.attachments = attachments;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }

        public String getRecoverAt() {
            return recoverAt;
        }

        public void setRecoverAt(String recoverAt) {
            this.recoverAt = recoverAt;
        }

        public String getRecoverContent() {
            return recoverContent;
        }

        public void setRecoverContent(String recoverContent) {
            this.recoverContent = recoverContent;
        }

        public List<String> getRecoverAttachments() {
            return recoverAttachments;
        }

        public void setRecoverAttachments(List<String> recoverAttachments) {
            this.recoverAttachments = recoverAttachments;
        }

        public Integer getIsProp() {
            return isProp;
        }

        public void setIsProp(Integer isProp) {
            this.isProp = isProp;
        }

        public Integer getGetProp() {
            return getProp;
        }

        public void setGetProp(Integer getProp) {
            this.getProp = getProp;
        }

        public List<PropDTO> getProp() {
            return prop;
        }

        public void setProp(List<PropDTO> prop) {
            this.prop = prop;
        }

        public static class PropDTO {
            @SerializedName("name")
            private String name;
            @SerializedName("tag")
            private String tag;
            @SerializedName("time_limit")
            private Integer timeLimit;
            @SerializedName("icon")
            private String icon;
            @SerializedName("count")
            private String count;
            @SerializedName("describe")
            private String describe;

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

            public String getIcon() {
                return icon;
            }

            public void setIcon(String icon) {
                this.icon = icon;
            }

            public String getCount() {
                return count;
            }

            public void setCount(String count) {
                this.count = count;
            }

            public String getDescribe() {
                return describe;
            }

            public void setDescribe(String describe) {
                this.describe = describe;
            }
        }
    }
}
