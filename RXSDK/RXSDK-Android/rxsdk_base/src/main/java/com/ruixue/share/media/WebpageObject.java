package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */


import androidx.annotation.NonNull;

import com.ruixue.utils.EntityUtils;

import java.util.HashMap;
import java.util.Map;

public class WebpageObject extends BaseMediaObject {
        public static final MediaType MEDIA_TYPE = MediaType.WEBPAGE;
    public WebpageObject(String url) {
        super(url);
    }

    public WebpageObject(String url, String title, String desc, ImageObject thumb) {
        this.url = url;
        this.setThumb(thumb);
        this.description = desc;
        this.setTitle(title);
    }

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    public Map<String, Object> toUrlExtraParams() {
        Map<String, Object> var1 = new HashMap<>();
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
        return "WEB [media_url=" + this.url + ", title=" + this.title + "" + "media_url=" + this.url + ", des=" + this.description + ", qzone_thumb=" + "]";
    }
}
