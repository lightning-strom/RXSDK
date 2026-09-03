package com.ruixue.view.notice.bean;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class NoticeItemBean {


    @SerializedName("data")
    private List<DataDTO> data;
    @SerializedName("code")
    private Integer code;

    public List<DataDTO> getData() {
        return data;
    }

    public void setData(List<DataDTO> data) {
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public static class DataDTO {
        @SerializedName("id")
        private Integer id;
        @SerializedName("type")
        private Integer type;
        @SerializedName("timezone")
        private Integer timezone;
        @SerializedName("start")
        private String start;
        @SerializedName("end")
        private String end;
        @SerializedName("content_type")
        private Integer contentType;
        @SerializedName("is_popup")
        private Integer isPopup;
        @SerializedName("title")
        private String title;
        @SerializedName("content")
        private String content;
        @SerializedName("images")
        private List<ImageDTO> images;

        private boolean readed;

        private boolean selected;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getType() {
            return type;
        }

        public void setType(Integer type) {
            this.type = type;
        }

        public Integer getTimezone() {
            return timezone;
        }

        public void setTimezone(Integer timezone) {
            this.timezone = timezone;
        }

        public String getStart() {
            return start;
        }

        public void setStart(String start) {
            this.start = start;
        }

        public String getEnd() {
            return end;
        }

        public void setEnd(String end) {
            this.end = end;
        }

        public Integer getContentType() {
            return contentType;
        }

        public void setContentType(Integer contentType) {
            this.contentType = contentType;
        }

        public Integer getIsPopup() {
            return isPopup;
        }

        public void setIsPopup(Integer isPopup) {
            this.isPopup = isPopup;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public boolean isReaded() {
            return readed;
        }

        public void setReaded(boolean readed) {
            this.readed = readed;
        }

        public boolean isSelected() {
            return selected;
        }

        public void setSelected(boolean selected) {
            this.selected = selected;
        }

        public List<ImageDTO> getImages() {
            return images;
        }

        public void setImages(List<ImageDTO> images) {
            this.images = images;
        }
    }

    public static class ImageDTO {
        @SerializedName("image_url")
        private String imageUrl;
        @SerializedName("link_url")
        private String linkUrl;

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getLinkUrl() {
            return linkUrl;
        }

        public void setLinkUrl(String linkUrl) {
            this.linkUrl = linkUrl;
        }
    }

}
