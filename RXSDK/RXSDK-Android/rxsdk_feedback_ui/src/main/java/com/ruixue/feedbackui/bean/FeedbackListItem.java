package com.ruixue.feedbackui.bean;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class FeedbackListItem {


    @SerializedName("code")
    private Integer code;
    @SerializedName("data")
    private DataDTO data;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public DataDTO getData() {
        return data;
    }

    public void setData(DataDTO data) {
        this.data = data;
    }

    public static class DataDTO {
        @SerializedName("page")
        private Integer page;
        @SerializedName("size")
        private Integer size;
        @SerializedName("total")
        private Integer total;
        @SerializedName("list")
        private List<ListDTO> list;

        public Integer getPage() {
            return page;
        }

        public void setPage(Integer page) {
            this.page = page;
        }

        public Integer getSize() {
            return size;
        }

        public void setSize(Integer size) {
            this.size = size;
        }

        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }

        public List<ListDTO> getList() {
            return list;
        }

        public void setList(List<ListDTO> list) {
            this.list = list;
        }

        public static class ListDTO {
            @SerializedName("id")
            private Integer id;
            @SerializedName("content")
            private String content;
            @SerializedName("created_at")
            private String createdAt;
            @SerializedName("status")
            private Integer status;
            @SerializedName("recover_at")
            private String recoverAt;
            @SerializedName("is_prop")
            private Integer isProp;

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

            public Integer getIsProp() {
                return isProp;
            }

            public void setIsProp(Integer isProp) {
                this.isProp = isProp;
            }
        }
    }
}
