package com.ruixue.share;

import androidx.annotation.Keep;
import androidx.annotation.StringDef;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

// url 分享链接 image 分享图片 a2m app分享至小游戏 text 分享文本 atlas 多图
@StringDef({ShareMediaType.WEBPAGE, ShareMediaType.IMAGE, ShareMediaType.LANDING, ShareMediaType.A2M, ShareMediaType.CARD,
        ShareMediaType.TEXT, ShareMediaType.VIDEO, ShareMediaType.MUSIC, ShareMediaType.TEXT_IMAGE, ShareMediaType.ATLAS})
@Retention(RetentionPolicy.SOURCE)
@Keep
public @interface ShareMediaType {
    /**
     * Share 分享链接
     */
    @Keep
    String WEBPAGE = "link";

    /**
     * Share 分享图片
     */
    @Keep
    String IMAGE = "image";

    /**
     * 分享图片并增加二维码
     */
    @Keep
    String LANDING = "landing";

    /**
     * Share app分享至小游戏
     */
    @Keep
    String A2M = "a2m";

    /**
     * Share 小程序卡片
     */
    @Keep
    String CARD = "card";

    /**
     * Share 分享文本
     */
    @Keep
    String TEXT = "text";

    @Keep
    String TEXT_IMAGE = "text_image";

    @Keep
    String VIDEO = "video";

    @Keep
    String MUSIC = "music";

    @Keep
    String ATLAS = "atlas";
}
