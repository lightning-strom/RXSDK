package com.ruixue.wechat;

import android.text.TextUtils;

import androidx.annotation.IntDef;
import androidx.annotation.Keep;

import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.share.ShareScene;
import com.ruixue.utils.EntityUtils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/23
 */
public class WXShareObject extends ShareObject {

    @Keep
    protected Boolean show_content_in_circle = false;


    @Keep
    protected String appid;
    //微信 openid
    @Keep
    protected String openId;
    @Keep
    protected String username;
    @Keep
    protected String path = "";
    @Keep
    protected Boolean withShareTicket = true;
    protected String extData;


    public String getExtData() {
        return extData;
    }

    public boolean getShowContentInCircle() {
        return show_content_in_circle;
    }

    /**
     * 微信 appid
     */
    public String getAppid() {
        return appid;
    }

    /**
     * @return 微信 openid
     */
    public String getOpenId() {
        return openId;
    }

    /**
     * a2m使用的公众号 gh_id
     */
    public String getUsername() {
        return username;
    }

    /**
     * 小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
     */
    public String getPath() {
        return path;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public void setPath(String path) {
        this.path = path;
    }

    /**
     * 通常开发者希望分享出去的小程序被二次打开时可以获取到更多信息，例如群的标识。可以设置 withShareTicket 为 true，当分享卡片在群聊中被其他用户打开时，可以获取到 shareTicket，用于获取更多分享信息。详见小程序获取更多分享信息 ，最低客户端版本要求：6.5.13
     */
    public boolean getWithShareTicket() {
        return withShareTicket;
    }

    @Override
    public boolean checkShareParam() {
        boolean baseCheck = super.checkShareParam();
        if (baseCheck) {
            if (TextUtils.isEmpty(appid)) {
                return false;
            }
            switch (this.material_type) {
                case ShareMediaType.TEXT:
                    return isNotEmpty(this.title);
                case ShareMediaType.IMAGE:
                case ShareMediaType.LANDING:
                    return isNotEmpty(this.image);
                case ShareMediaType.WEBPAGE:
                    return isNotEmpty(this.title) && isNotEmpty(this.url);
                case ShareMediaType.A2M:
                    return isNotEmpty(this.username) && isNotEmpty(title);
                default:
                    return super.checkShareParam();
            }
        } else {
            return false;
        }
    }

    @Override
    public String getTitle() {
        if (show_content_in_circle && shareScene == ShareScene.TIMELINE) {
            return content;
        } else {
            return super.getTitle();
        }
    }

    @IntDef({MiniprogramType.RELEASE, MiniprogramType.TYPE_TEST, MiniprogramType.TYPE_PREVIEW})
    @Retention(RetentionPolicy.SOURCE)
    public @interface MiniprogramType {
        //正式版
        int RELEASE = 0;
        //测试版
        int TYPE_TEST = 1;
        //预览版
        int TYPE_PREVIEW = 2;
    }

    @Keep
    protected int miniprogramType = MiniprogramType.RELEASE;

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this);
    }


    public static WXShareObject fromMap(Map<String, Object> mapObj) {
        return EntityUtils.mapToEntity(mapObj, WXShareObject.class);
    }

    public static WXShareObject fromMap(Map<String, Object> mapObj, PlatformType platformType) {
        WXShareObject shareObject = fromMap(mapObj);
        if (ShareScene.SELECT != platformType.getShareScene()) {
            shareObject.shareScene = platformType.getShareScene();
        }
        return shareObject;
    }

    public WXShareObject() {
    }

    private WXShareObject(Builder builder) {
        this.appid = builder.appid;
        this.material_type = builder.type;
        this.shareScene = builder.shareScene;
        this.title = builder.title;
        this.content = builder.description;
        this.image = builder.imageUrl;
        this.url = builder.url;
        this.username = builder.username;
        this.path = builder.path;
        this.withShareTicket = builder.withShareTicket;
        this.miniprogramType = builder.miniprogramType;
        this.show_content_in_circle = builder.show_content_in_circle;
        this.x = builder.x;
        this.y = builder.y;

        this.width = builder.width;
        this.height = builder.height;
//        this.isSystemShare = builder.isSystemShare;
        this.openId = builder.openId;
        this.platform = builder.platform;
        this.platform = builder.platform;
        this.extData = builder.extData;
    }

    public int getMiniprogramType() {
        return miniprogramType;
    }

    public static class Builder {
        private String platform;
        private String appid;
        private String openId;
        private @ShareMediaType String type;
        private @ShareScene int shareScene;
        private String title;
        private String description;
        private String imageUrl;
        private String url;
        private String username;
        private String path = "";
        private boolean withShareTicket = true;

        private String extData = "";


        private boolean show_content_in_circle = false;
        private @MiniprogramType int miniprogramType = MiniprogramType.RELEASE;
        private int x;
        private int y;
        private int width = 150;
        private int height = 150;

        public WXShareObject build() {
            return new WXShareObject(this);
        }

        public Builder setShowContentInCircle(boolean show_content_in_circle) {
            this.show_content_in_circle = show_content_in_circle;
            return this;
        }

        public Builder setExtData(String extData) {
            this.extData = extData;
            return this;
        }

        /**
         * 微信 appid
         */
        public Builder setAppid(String appid) {
            this.appid = appid;
            return this;
        }

        /**
         * 微信 openid
         * @param openId 微信 openid
         */
        public Builder setOpenId(String openId) {
            this.openId = openId;
            return this;
        }

        /**
         * {@link ShareMediaType} 分享material素材类型 url 分享链接 image 分享图片 a2m app分享至小游戏 text 分享文本 card 小卡片
         */
        public Builder setType(@ShareMediaType String type) {
            this.type = type;
            return this;
        }

        /**
         * 分享场景 {@link ShareScene}
         */
        public Builder setShareScene(@ShareScene int shareScene) {
            this.shareScene = shareScene;
            return this;
        }

        /**
         * 标题
         */
        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }

        /**
         * 描述
         */
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        /**
         * 分享的图片或icon 地址
         */
        public Builder setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        /**
         * 分享的链接地址 或 分享图片类型时生成二维码
         */
        public Builder setUrl(String url) {
            this.url = url;
            return this;
        }

        /**
         * 分享小程序类型时使用 a2m使用的公众号 gh_id
         */
        public Builder setUsername(String username) {
            this.username = username;
            return this;
        }

        /**
         * 分享小程序类型时使用  小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
         */
        public Builder setPath(String path) {
            this.path = path;
            return this;
        }

        /**
         * @param withShareTicket 是否使用带 shareTicket 的分享
         */
        public Builder setWithShareTicket(boolean withShareTicket) {
            this.withShareTicket = withShareTicket;
            return this;
        }

        /**
         * @param miniprogramType 小程序的类型，默认正式版
         */
        public Builder setMiniprogramType(@MiniprogramType int miniprogramType) {
            this.miniprogramType = miniprogramType;
            return this;
        }

        /**
         * 二维码左上角坐标 x
         */
        public Builder setX(int x) {
            this.x = x;
            return this;
        }

        /**
         * 二维码左上角坐标 y
         */
        public Builder setY(int y) {
            this.y = y;
            return this;
        }

        /**
         * 尺寸 宽高不一致时取最大
         */
        public Builder setWidth(int width) {
            this.width = width;
            return this;
        }

        public Builder setHeight(int height) {
            this.height = height;
            return this;
        }
    }
}
