package com.ruixue.share;

import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
@Keep
public enum PlatformType {
    NONE(PlatformName.NONE, "rx_sns_icon_default"), WECHAT(PlatformName.WECHAT, "rx_socialize_wechat"), WECHAT_SESSION(PlatformName.WECHAT_SESSION, "rx_socialize_wechat"), WECHAT_CIRCLE(PlatformName.WECHAT_CIRCLE, "rx_socialize_wxcircle"), WECHAT_FAVORITE(PlatformName.WECHAT_FAVORITE, "rx_socialize_fav"), TIKTOK(PlatformName.TIKTOK, "rx_socialize_douyin"), DOUYIN(PlatformName.DOUYIN, "rx_socialize_douyin"), REDDIT(PlatformName.REDDIT, "rx_socialize_reddit"),
    FACEBOOK(PlatformName.FACEBOOK, "rx_socialize_facebook"), MESSENGER(PlatformName.MESSENGER, "rx_socialize_fbmessage"), INSTAGRAM(PlatformName.INSTAGRAM, "rx_socialize_instagram"), WHATSAPP(PlatformName.WHATSAPP, "rx_socialize_whatsapp"), LINE(PlatformName.LINE, "rx_socialize_line"), ZALO(PlatformName.ZALO, "rx_socialize_zalo"), SNAPCHAT(PlatformName.SNAPCHAT, "rx_socialize_snapchat"),
    SYSTEM(PlatformName.SYSTEM, "rx_socialize_more"), MORE(PlatformName.MORE, "rx_socialize_more");


    @Keep
    public static class PlatformName {
        public static String NONE = "未知";
        public static String SMS = "短信";
        public static String EMAIL = "邮件";
        public static String SINA = "新浪微博";
        public static String QZONE = "QQ空间";
        public static String QQ = "QQ好友";

        public static String WECHAT = "微信";
        public static String WECHAT_SESSION = "微信好友";
        public static String WECHAT_CIRCLE = "微信朋友圈";
        public static String WECHAT_FAVORITE = "微信收藏";
        public static String WEWORK = "企业微信";
        public static String TENCENT = "腾讯微博";
        //    public static String YIXIN = "易信好友";
//    public static String YIXIN_CIRCLE = "易信朋友圈";
        public static String ALIPAY = "支付宝";
        public static String DINGTALK = "钉钉";
        public static String MOSTONE = "默往";
        public static String DOUYIN = "抖音";

        public static String TIKTOK = "Tiktok";

        public static String REDDIT = "reddit";
        public static String GOOGLEPLUS = "GooglePlus";

        public static String FACEBOOK = "Facebook";
        public static String MESSENGER = "Messenger";
        public static String INSTAGRAM = "Instagram";
        public static String TWITTER = "Twitter";
        public static String LINKEDIN = "Linkedin";
        public static String WHATSAPP = "WhatsApp";

        public static String LINE = "LINE";

        public static String ZALO = "ZALO";

        public static String SNAPCHAT = "snapchat";

        public static String VKONTAKTE = "VKontakte";
        public static String SYSTEM = "系统";
        public static String MORE = "更多";
    }

    private final String name;
    private final String icon;

    PlatformType(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    @NonNull
    public static PlatformType toEnum(String enumStr) {
        if (TextUtils.isEmpty(enumStr)) {
            return NONE;
        } else {
            PlatformType[] values = values();
            String enumStrUpper = enumStr.toUpperCase();
            for (PlatformType value : values) {
                if (value.toString().trim().equals(enumStrUpper)) {
                    return value;
                }
            }
            return NONE;
        }
    }

//    @NonNull
//    @Override
//    public String toString() {
//        String str = super.toString();
//        if (str.equals("WECHAT_SESSION") || str.equals("WECHAT_CIRCLE") || str.equals("WECHAT_FAVORITE")) {
//            return WECHAT.toString();
//        } else {
//            return str;
//        }
//    }

    public boolean equals(PlatformType platformType) {
        return this.toString().equals(platformType.toString());
    }

    public String getKeyword() {
        if (this == WECHAT_SESSION || this == WECHAT_CIRCLE || this == WECHAT_FAVORITE) {
            return WECHAT.toString().toLowerCase();
        } else {
            return this.toString().toLowerCase();
        }
    }

    public String getShowWord() {
        return this.name;
    }

    public String getIcon() {
        return this.icon;
    }

    public int getShareScene() {
        if (this == WECHAT_SESSION) {
            return ShareScene.SESSION;
        } else if (this == WECHAT_CIRCLE) {
            return ShareScene.TIMELINE;
        } else if (this == WECHAT_FAVORITE) {
            return ShareScene.FAVORITE;
        } else {
            return ShareScene.SELECT;
        }
    }

    public PlatformSns toSnsPlatform() {
        return PlatformSns.create(this);
    }
}