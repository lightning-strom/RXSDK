package com.ruixue.socialize;

import android.text.TextUtils;

import com.ruixue.share.PlatformType;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
public class PlatformConfig {
    public static Map<PlatformType, Platform> configs = new HashMap<>();

    public PlatformConfig() {
    }




//
//    public static void setSinaFileProvider(String var0) {
//        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.SINA);
//        var1.fileProvider = var0.replace(" ", "");
//    }
//
//    public static void setTwitter(String var0, String var1) {
//        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.TWITTER);
//        var2.appId = var0.replace(" ", "");
//        var2.appkey = var1.replace(" ", "");
//    }
//
//    public static void setAlipay(String var0) {
//        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.ALIPAY);
//        var1.appId = var0.replace(" ", "");
//    }

//    public static void setDropbox(String var0, String var1) {
//        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.DROPBOX);
//        var2.appId = var0.replace(" ", "");
//        var2.appkey = var1.replace(" ", "");
//    }





//    public static void setVKontakte(String var0, String var1) {
//        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.VKONTAKTE);
//        var2.appId = var0.replace(" ", "");
//        var2.appkey = var1.replace(" ", "");
//    }

    public static void setWeixin(String var0, String var1) {
        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT);
        var2.appId = var0.replace(" ", "");
        var2.appkey = var1.replace(" ", "");
        PlatformConfig.APPIDPlatform var3 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT_CIRCLE);
        var3.appId = var0.replace(" ", "");
        var3.appkey = var1.replace(" ", "");
        PlatformConfig.APPIDPlatform var4 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT_FAVORITE);
        var4.appId = var0.replace(" ", "");
        var4.appkey = var1.replace(" ", "");
    }


    public static void setWXFileProvider(String var0) {
        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT);
        var1.fileProvider = var0.replace(" ", "");
        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT_CIRCLE);
        var2.fileProvider = var0.replace(" ", "");
        PlatformConfig.APPIDPlatform var3 = (PlatformConfig.APPIDPlatform)configs.get(PlatformType.WECHAT_FAVORITE);
        var2.fileProvider = var0.replace(" ", "");
    }


//
//    public static void setLaiwang(String var0, String var1) {
//        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.LAIWANG);
//        var2.appId = var0.replace(" ", "");
//        var2.appkey = var1.replace(" ", "");
//        PlatformConfig.APPIDPlatform var3 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.LAIWANG_DYNAMIC);
//        var3.appId = var0.replace(" ", "");
//        var3.appkey = var1.replace(" ", "");
//    }
//
//    public static void setYixin(String var0) {
//        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.YIXIN);
//        var1.appId = var0.replace(" ", "");
//        PlatformConfig.APPIDPlatform var2 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.YIXIN_CIRCLE);
//        var2.appId = var0.replace(" ", "");
//    }
//
//    public static void setPinterest(String var0) {
//        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.PINTEREST);
//        var1.appId = var0.replace(" ", "");
//    }
//
//    public static void setKakao(String var0) {
//        PlatformConfig.APPIDPlatform var1 = (PlatformConfig.APPIDPlatform)configs.get(SHARE_MEDIA.KAKAO);
//        var1.appId = var0.replace(" ", "");
//    }

    public static PlatformConfig.Platform getPlatform(PlatformType var0) {
        return (PlatformConfig.Platform)configs.get(var0);
    }

    static {
//        configs.put(PlatformType.QQ, new PlatformConfig.APPIDPlatform(PlatformType.QQ));
//        configs.put(PlatformType.QZONE, new PlatformConfig.APPIDPlatform(PlatformType.QZONE));
        configs.put(PlatformType.WECHAT, new PlatformConfig.APPIDPlatform(PlatformType.WECHAT));
//        configs.put(SHARE_MEDIA.VKONTAKTE, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.WECHAT));
        configs.put(PlatformType.WECHAT_CIRCLE, new PlatformConfig.APPIDPlatform(PlatformType.WECHAT_CIRCLE));
        configs.put(PlatformType.WECHAT_FAVORITE, new PlatformConfig.APPIDPlatform(PlatformType.WECHAT_FAVORITE));
//        configs.put(PlatformType.WEWORK, new PlatformConfig.APPIDPlatform(PlatformType.WEWORK));
        configs.put(PlatformType.MESSENGER, new PlatformConfig.CustomPlatform(PlatformType.MESSENGER));
//        configs.put(SHARE_MEDIA.DOUBAN, new PlatformConfig.CustomPlatform(SHARE_MEDIA.DOUBAN));
//        configs.put(SHARE_MEDIA.LAIWANG, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.LAIWANG));
//        configs.put(SHARE_MEDIA.LAIWANG_DYNAMIC, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.LAIWANG_DYNAMIC));
//        configs.put(SHARE_MEDIA.YIXIN, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.YIXIN));
//        configs.put(SHARE_MEDIA.YIXIN_CIRCLE, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.YIXIN_CIRCLE));
//        configs.put(PlatformType.SINA, new PlatformConfig.APPIDPlatform(PlatformType.SINA));
//        configs.put(PlatformType.TENCENT, new PlatformConfig.CustomPlatform(PlatformType.TENCENT));
//        configs.put(PlatformType.ALIPAY, new PlatformConfig.APPIDPlatform(PlatformType.ALIPAY));
//        configs.put(SHARE_MEDIA.RENREN, new PlatformConfig.CustomPlatform(SHARE_MEDIA.RENREN));
//        configs.put(SHARE_MEDIA.DROPBOX, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.DROPBOX));
//        configs.put(PlatformType.GOOGLEPLUS, new PlatformConfig.CustomPlatform(PlatformType.GOOGLEPLUS));
        configs.put(PlatformType.FACEBOOK, new PlatformConfig.CustomPlatform(PlatformType.FACEBOOK));
//        configs.put(PlatformType.TWITTER, new PlatformConfig.APPIDPlatform(PlatformType.TWITTER));
//        configs.put(SHARE_MEDIA.TUMBLR, new PlatformConfig.CustomPlatform(SHARE_MEDIA.TUMBLR));
//        configs.put(SHARE_MEDIA.PINTEREST, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.PINTEREST));
//        configs.put(SHARE_MEDIA.POCKET, new PlatformConfig.CustomPlatform(SHARE_MEDIA.POCKET));
        configs.put(PlatformType.WHATSAPP, new PlatformConfig.CustomPlatform(PlatformType.WHATSAPP));
//        configs.put(PlatformType.EMAIL, new PlatformConfig.CustomPlatform(PlatformType.EMAIL));
//        configs.put(PlatformType.SMS, new PlatformConfig.CustomPlatform(PlatformType.SMS));
//        configs.put(PlatformType.LINKEDIN, new PlatformConfig.CustomPlatform(PlatformType.LINKEDIN));
        configs.put(PlatformType.LINE, new PlatformConfig.CustomPlatform(PlatformType.LINE));
//        configs.put(SHARE_MEDIA.FLICKR, new PlatformConfig.CustomPlatform(SHARE_MEDIA.FLICKR));
//        configs.put(SHARE_MEDIA.EVERNOTE, new PlatformConfig.CustomPlatform(SHARE_MEDIA.EVERNOTE));
//        configs.put(SHARE_MEDIA.FOURSQUARE, new PlatformConfig.CustomPlatform(SHARE_MEDIA.FOURSQUARE));
//        configs.put(SHARE_MEDIA.YNOTE, new PlatformConfig.CustomPlatform(SHARE_MEDIA.YNOTE));
//        configs.put(SHARE_MEDIA.KAKAO, new PlatformConfig.APPIDPlatform(SHARE_MEDIA.KAKAO));
        configs.put(PlatformType.INSTAGRAM, new PlatformConfig.CustomPlatform(PlatformType.INSTAGRAM));
        configs.put(PlatformType.MORE, new PlatformConfig.CustomPlatform(PlatformType.MORE));
//        configs.put(PlatformType.DINGTALK, new PlatformConfig.APPIDPlatform(PlatformType.MORE));
    }

    public interface Platform {
        PlatformType getName();

        void parse(JSONObject var1);

        boolean isConfigured();

        String getAppid();

        String getAppSecret();
    }

    public static class APPIDPlatform implements PlatformConfig.Platform {
        public String appId = null;
        public String appkey = null;
        public String redirectUrl = null;
        public String fileProvider = null;
        public String agentId = null;
        public String schema = null;
        private PlatformType platformType;

        public APPIDPlatform(PlatformType platformType) {
            this.platformType = platformType;
        }

        public PlatformType getName() {
            return this.platformType;
        }

        public void parse(JSONObject var1) {
        }

        public boolean isConfigured() {
            return !TextUtils.isEmpty(this.appId) && !TextUtils.isEmpty(this.appkey);
        }

        public String getAppid() {
            return this.appId;
        }

        public String getAppSecret() {
            return this.appkey;
        }
    }

    public static class CustomPlatform implements PlatformConfig.Platform {
        public static final String Name = "g+";
        public String appId = null;
        public String appkey = null;
        private PlatformType p;

        public CustomPlatform(PlatformType var1) {
            this.p = var1;
        }

        public PlatformType getName() {
            return this.p;
        }

        public void parse(JSONObject var1) {
        }

        public boolean isConfigured() {
            return true;
        }

        public String getAppid() {
            return this.appId;
        }

        public String getAppSecret() {
            return this.appkey;
        }
    }
}