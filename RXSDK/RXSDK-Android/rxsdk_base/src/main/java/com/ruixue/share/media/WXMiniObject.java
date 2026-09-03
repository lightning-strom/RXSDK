package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import com.ruixue.utils.EntityUtils;

import java.util.HashMap;
import java.util.Map;

public class WXMiniObject extends BaseMediaObject {
    public static final MediaType MEDIA_TYPE = MediaType.WEBPAGE;
    /**
     * 小程序原始id
     */
    private String username;
    /**
     * 小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
     */
    private String path;
    /**
     * 通常开发者希望分享出去的小程序被二次打开时可以获取到更多信息，例如群的标识。可以设置 withShareTicket 为 true，当分享卡片在群聊中被其他用户打开时，可以获取到 shareTicket，用于获取更多分享信息。详见小程序获取更多分享信息 ，最低客户端版本要求：6.5.13
     */
    protected boolean withShareTicket = true;

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    public Map<String, Object> toUrlExtraParams() {
        HashMap<String, Object> hashMap = new HashMap<>();
        if (this.isUrlMedia()) {
            hashMap.put(BaseMediaObject.PROTOCOL_KEY_FURL, this.url);
            hashMap.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, this.getMediaType());
            hashMap.put(BaseMediaObject.PROTOCOL_KEY_TITLE, this.title);
        }
        return hashMap;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> hashMap = EntityUtils.entityToMap(this);
        hashMap.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, MEDIA_TYPE);
        return hashMap;
    }

    public WXMiniObject(String s) {
        super(s);
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public String getUserName() {
        return this.username;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPath() {
        return this.path;
    }

    public byte[] toByte() {
        return this.thumb != null ? this.thumb.toByte() : null;
    }

    public boolean isWithShareTicket() {
        return withShareTicket;
    }

    public void setWithShareTicket(boolean withShareTicket) {
        this.withShareTicket = withShareTicket;
    }

}
