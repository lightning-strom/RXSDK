package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.os.Parcel;
import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.ruixue.share.ShareScene;

import java.util.HashMap;
import java.util.Map;

public abstract class BaseMediaObject implements IMediaObject {
    public static String PROTOCOL_KEY_FURL = "furl";
    public static String PROTOCOL_KEY_FTYPE = "ftype";
    public static String PROTOCOL_KEY_TITLE = "title";

    @Keep
    protected @ShareScene
    int shareScene;

    @Keep
    protected String url = "";
    @Keep
    protected String title = "";
    @Keep
    protected String description = "";

    @Keep
    protected int x;
    @Keep
    protected int y;
    @Keep
    protected int wh;
    /**
     * 缩略图或图片对象
     */
    @Keep
    protected ImageObject thumb;
    @Keep
    protected Map<String, Object> mExtra = new HashMap<>();

    public BaseMediaObject() {
    }

    public void setThumb(ImageObject imageObject) {
        this.thumb = imageObject;
    }

    public BaseMediaObject(String url) {
        this.url = url;
    }

    public String getDescription() {
        return this.description;
    }

    public Map<String, Object> getExtra() {
        return this.mExtra;
    }

    public void setExtra(String key, Object obj) {
        this.mExtra.put(key, obj);
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String toUrl() {
        return this.url;
    }

    public ImageObject getThumbImage() {
        return this.thumb;
    }

    public boolean isUrlMedia() {
        return !TextUtils.isEmpty(this.url);
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Keep
    protected BaseMediaObject(Parcel parcel) {
        if (parcel != null) {
            this.url = parcel.readString();
            this.title = parcel.readString();
        }
    }

    @NonNull
    public String toString() {
        return "BaseMediaObject [url=" + this.url + ", title=" + this.title + ", thumb=" + "]";
    }
}
