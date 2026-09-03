package com.ruixue.share.media;

import com.ruixue.utils.EntityUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

public class QQMiniObject extends BaseMediaObject {
        public static final MediaType MEDIA_TYPE = MediaType.WEBPAGE;
    private String miniAppId = "";
    private String path = "";
    private String qtype = "";

    public String getMiniAppId() {
        return this.miniAppId;
    }

    public void setMiniAppId(String appid) {
        this.miniAppId = appid;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getQtype() {
        return this.qtype;
    }

    public void setQtype(String qtype) {
        this.qtype = qtype;
    }

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    public Map<String, Object> toUrlExtraParams() {
        HashMap<String,Object> var1 = new HashMap<>();
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

    public QQMiniObject(String var1) {
        super(var1);
    }
}
