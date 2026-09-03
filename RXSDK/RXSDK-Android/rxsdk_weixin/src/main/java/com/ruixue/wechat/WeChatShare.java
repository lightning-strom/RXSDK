package com.ruixue.wechat;

import static com.ruixue.wechat.WeChatShare.WXScene.share_favorite;
import static com.ruixue.wechat.WeChatShare.WXScene.share_session;
import static com.ruixue.wechat.WeChatShare.WXScene.share_timeline;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_image;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_miniProgram;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_music;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_text;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_video;
import static com.ruixue.wechat.WeChatShare.WXShareType.type_webPage;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
import android.widget.Toast;

import androidx.annotation.IntDef;

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject;
import com.tencent.mm.opensdk.modelmsg.WXMusicObject;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXVideoObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/1
 */
public class WeChatShare {

    @IntDef({share_session, share_timeline, share_favorite})// 枚举数据
    @Retention(RetentionPolicy.SOURCE) //告诉编译器在生成.class文件时不保留枚举注解数据
    public @interface WXScene {
        // 发送到聊天界面——WXSceneSession
        int share_session = SendMessageToWX.Req.WXSceneSession;
        // 发送到朋友圈——WXSceneTimeline
        int share_favorite = SendMessageToWX.Req.WXSceneFavorite;
        // 添加到微信收藏——WXSceneFavorite
        int share_timeline = SendMessageToWX.Req.WXSceneTimeline;
    }

    @IntDef({type_text, type_image, type_video, type_music, type_webPage, type_miniProgram})//枚举类型
    @Retention(RetentionPolicy.SOURCE) //告诉编译器在生成.class文件时不保留枚举注解数据
    public @interface WXShareType {
        int type_text = 0;
        int type_image = 1;
        int type_video = 2;
        int type_music = 3;
        int type_webPage = 4;
        int type_miniProgram = 5;
    }

    // 第三方APP和微信通信的openApi接口
    private static IWXAPI iwxapi;
    @SuppressLint("StaticFieldLeak")
    private static Context mContext;
    private int share_to = share_session;
    private int share_type = -1;
    private String url = "";
    private String title = "";
    private String description = "";
    private String shareText = "";
    private Bitmap imageBitmap = null;
    private String miniProgramId = "";
    private String miniProgramPath = "";

    public static WeChatShare regToWx(Context context, String appid) {
        mContext = context;
        // WXAPIFactory工厂，获取IWXAPI实例
        iwxapi = WXAPIFactory.createWXAPI(context, appid, false);
        // 注册应用
        boolean flag = iwxapi.registerApp(appid);
        Toast.makeText(context, "flag:" + flag, Toast.LENGTH_SHORT).show();
        return new WeChatShare();
    }

    public WeChatShare setWhere(@WXScene int shareTo) {
        share_to = shareTo;
        return this;
    }

    /**
     * 分享的类型
     *
     * @param type
     * @return
     */
    public WeChatShare setType(@WXShareType int type) {
        share_type = type;
        return this;
    }

    /**
     * 分享的Url
     *
     * @param url
     * @return
     */
    public WeChatShare addUrl(String url) {
        this.url = url;
        return this;
    }

    /**
     * 分享的标题
     *
     * @param title
     * @return
     */
    public WeChatShare addTitle(String title) {
        this.title = title;
        return this;
    }

    /**
     * 描述
     *
     * @param description
     * @return
     */
    public WeChatShare addDescription(String description) {
        this.description = description;
        return this;
    }

    /**
     * 分享的图片url
     *
     * @param imageUrl
     * @return
     */
    public WeChatShare addImage(String imageUrl) {
        if (TextUtils.isEmpty(imageUrl)) {
            throw new NullPointerException("imageUrl is empty.");
        }
        addImage(BitmapUtils.getBitmap(imageUrl));
        return this;
    }

    /**
     * 分享的图片资源ID
     *
     * @param imageResource
     * @return
     */
    public WeChatShare addImage(int imageResource) {
        addImage(BitmapFactory.decodeResource(mContext.getResources(), imageResource));
        return this;
    }

    /**
     * 分享的图片bitmap
     *
     * @param imageBitmap
     * @return
     */
    public WeChatShare addImage(Bitmap imageBitmap) {
        this.imageBitmap = imageBitmap;
        return this;
    }

    /**
     * 分享的wenbennr
     *
     * @param shareText
     * @return
     */
    public WeChatShare addShareText(String shareText) {
        this.shareText = shareText;
        return this;
    }

    /**
     * 分享小程序的原始Id
     *
     * @param miniProgramId
     * @return
     */
    public WeChatShare addMiniProgramId(String miniProgramId) {
        this.miniProgramId = miniProgramId;
        return this;
    }

    /**
     * 分享小程序的path
     *
     * @param miniProgramPath
     * @return
     */
    public WeChatShare addMiniProgramPath(String miniProgramPath) {
        this.miniProgramPath = miniProgramPath;
        return this;
    }

    public void share() {
        WXMediaMessage msg = new WXMediaMessage();
        if (share_type < 0) {
            throw new NullPointerException("you should set share type first.");
        }
        // 标题
        if (!TextUtils.isEmpty(title)) {
            msg.title = title;
        }

        // 描述
        if (!TextUtils.isEmpty(description)) {
            msg.description = description;
        }

        String transaction = "";
        switch (share_type) {
            case type_text:
                // 分享文本
                transaction = "text";
                msg.description = shareText;
                WXTextObject textObject = new WXTextObject();
                textObject.text = shareText;
                msg.mediaObject = textObject;
                break;
            case type_image:
                // 分享图片
                transaction = "img";
                if (null == imageBitmap) {
                    throw new NullPointerException("bitmap is null.");
                }
                msg.mediaObject = new WXImageObject(imageBitmap);
                break;
            case type_video:
                // 分享视频
                transaction = "video";
                WXVideoObject videoObject;
                videoObject = new WXVideoObject();
                videoObject.videoUrl = url;
                msg.mediaObject = videoObject;
                break;
            case type_music:
                // 分享音频
                transaction = "music";
                WXMusicObject musicObject = new WXMusicObject();
                musicObject.musicUrl = url;
                msg.mediaObject = musicObject;
                break;
            case type_webPage:
                // 分享网页
                transaction = "webpage";
                WXWebpageObject webpageObject = new WXWebpageObject();
                webpageObject.webpageUrl = url;
                msg.mediaObject = webpageObject;
                break;
            case type_miniProgram:
                /**
                 * 注: 要求发起分享的App与小程序属于同一微信开放平台帐号。
                 * 小程序的原始ID获取方法：登录小程序后台-设置-基本设置-帐号信息
                 */
                // 分享小程序
                if (TextUtils.isEmpty(miniProgramId)) {
                    throw new NullPointerException("miniProgramId is empty.");
                }
                if (TextUtils.isEmpty(miniProgramPath)) {
                    throw new NullPointerException("miniProgramPath is empty.");
                }
                if (TextUtils.isEmpty(url)) {
                    throw new NullPointerException("the url for lower WeChat to open is empty.");
                }
                transaction = "webpage";
                WXMiniProgramObject miniProgramObject = new WXMiniProgramObject();
                miniProgramObject.webpageUrl = url;// 低版本微信将打开的url
                miniProgramObject.userName = miniProgramId; // 跳转的小程序的原始ID
                miniProgramObject.path = miniProgramPath; // 小程序的path
                msg.mediaObject = miniProgramObject;
                break;
        }

        // 缩略图
        if (null != imageBitmap) {
            Bitmap bmp = Bitmap.createScaledBitmap(imageBitmap, 80, 80, true);
            imageBitmap.recycle();
            msg.thumbData = BitmapUtils.Bitmap2Bytes(bmp);
        }
        sendMsg(msg, transaction);
    }

    /**
     * 调起微信分享
     *
     * @param mediaMessage
     */
    private void sendMsg(WXMediaMessage mediaMessage, String transaction) {
        if (TextUtils.isEmpty(transaction)) {
            throw new NullPointerException("you should set share type first.");
        }
        // 构造Req
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction(transaction);
        req.message = mediaMessage;
        req.scene = share_to;
        iwxapi.sendReq(req);
    }

    private String buildTransaction(String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }
}
