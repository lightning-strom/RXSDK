package com.ruixue.share;

import androidx.annotation.Keep;

import com.ruixue.utils.EntityUtils;

import java.util.Map;

// 多图分享，每张图中含有二维码 数据结构
// Created by wangliang on 2024/4/20.
@Keep
public class ShareImageObject {

    @Keep
    protected String image_url;

    @Keep
    protected String landing_url;

    @Keep
    protected int x;

    @Keep
    protected int y;

    @Keep
    protected int width;

    @Keep
    protected int height;

    @Keep
    public String getImage_url() {
        return image_url;
    }

    @Keep
    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    @Keep
    public String getLanding_url() {
        return landing_url;
    }

    @Keep
    public void setLanding_url(String landing_url) {
        this.landing_url = landing_url;
    }

    @Keep
    public int getX() {
        return x;
    }

    @Keep
    public void setX(int x) {
        this.x = x;
    }

    @Keep
    public int getY() {
        return y;
    }

    @Keep
    public void setY(int y) {
        this.y = y;
    }

    @Keep
    public int getWidth() {
        return width;
    }

    @Keep
    public void setWidth(int width) {
        this.width = width;
    }

    @Keep
    public int getHeight() {
        return height;
    }

    @Keep
    public void setHeight(int height) {
        this.height = height;
    }

    @Keep
    public static ShareImageObject fromMap(Map<String, Object> mapObj) {
        return EntityUtils.mapToEntity(mapObj, ShareImageObject.class);
    }

}
