package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.os.Parcel;

import androidx.annotation.NonNull;

import com.ruixue.utils.EntityUtils;

import java.util.HashMap;
import java.util.Map;

public class MusicObject extends BaseMediaObject {
    public static final MediaType MEDIA_TYPE = MediaType.MUSIC;
    private String f;
    private String g;
    private String h;
    private String i;
    private int j;
    private String k;

    public void setmTargetUrl(String var1) {
        this.k = var1;
    }

    public String getmTargetUrl() {
        return this.k;
    }

    public int getDuration() {
        return this.j;
    }

    public void setDuration(int var1) {
        this.j = var1;
    }

    public String getLowBandUrl() {
        return this.i;
    }

    public void setLowBandUrl(String var1) {
        this.i = var1;
    }

    public MusicObject(String var1) {
        super(var1);
    }

    public String getHighBandDataUrl() {
        return this.g;
    }

    public void setHighBandDataUrl(String var1) {
        this.g = var1;
    }

    public String getH5Url() {
        return this.h;
    }

    public void setH5Url(String var1) {
        this.h = var1;
    }

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    protected MusicObject(Parcel var1) {
        super(var1);
    }

    public final Map<String, Object> toUrlExtraParams() {
        HashMap<String, Object> var1 = new HashMap<>();
        if (this.isUrlMedia()) {
            var1.put(BaseMediaObject.PROTOCOL_KEY_FURL, this.url);
            var1.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, this.getMediaType());
            var1.put(BaseMediaObject.PROTOCOL_KEY_TITLE, this.title);
        }

        return var1;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> hashMap = EntityUtils.entityToMap(this);
        hashMap.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, MEDIA_TYPE);
        return hashMap;
    }

    public byte[] toByte() {
        return this.thumb != null ? this.thumb.toByte() : null;
    }

    @NonNull
    public String toString() {
        return "Music [title=" + this.title + "media_url=" + this.url + ", qzone_title=" + this.title + ", qzone_thumb=" + "]";
    }

    public ImageObject getThumbImage() {
        return this.thumb;
    }

    public String getLowBandDataUrl() {
        return this.f;
    }

    public void setLowBandDataUrl(String var1) {
        this.f = var1;
    }
}
