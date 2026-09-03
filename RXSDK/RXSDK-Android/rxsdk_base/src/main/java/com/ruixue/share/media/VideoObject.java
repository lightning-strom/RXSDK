package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import androidx.annotation.NonNull;

import com.ruixue.utils.EntityUtils;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class VideoObject extends BaseMediaObject {
    public static final MediaType MEDIA_TYPE = MediaType.VIDEO;
    private String f;
    private String g;
    private String h;
    private String i;
    private int j;
    private File k;

    public int getDuration() {
        return this.j;
    }

    public void setDuration(int var1) {
        this.j = var1;
    }

    public VideoObject(String var1) {
        super(var1);
    }

    public VideoObject(File var1) {
        this.k = var1;
    }

    public File getLocalVideoFile() {
        return this.k;
    }

    public String getLowBandUrl() {
        return this.f;
    }

    public String getLowBandDataUrl() {
        return this.g;
    }

    public void setLowBandDataUrl(String var1) {
        this.g = var1;
    }

    public String getHighBandDataUrl() {
        return this.h;
    }

    public void setHighBandDataUrl(String var1) {
        this.h = var1;
    }

    public String getH5Url() {
        return this.i;
    }

    public void setH5Url(String var1) {
        this.i = var1;
    }

    public void setLowBandUrl(String var1) {
        this.f = var1;
    }

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    public final Map<String, Object> toUrlExtraParams() {
        HashMap<String, Object> var1 = new HashMap<>();
        if (this.isUrlMedia()) {
            var1.put(BaseMediaObject.PROTOCOL_KEY_FURL, this.url);
            var1.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, this.getMediaType());
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
        return "Video [media_url=" + this.url + ", qzone_title=" + this.title + ", qzone_thumb=" + "media_url=" + this.url + ", qzone_title=" + this.title + ", qzone_thumb=" + "]";
    }
}
