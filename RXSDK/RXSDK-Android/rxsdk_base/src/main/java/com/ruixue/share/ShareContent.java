package com.ruixue.share;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.text.TextUtils;

import androidx.annotation.IntDef;


import com.ruixue.share.media.ImageObject;
import com.ruixue.share.media.WXMiniObject;
import com.ruixue.share.media.QQMiniObject;
import com.ruixue.share.media.VideoObject;
import com.ruixue.share.media.WebpageObject;
import com.ruixue.share.media.IMediaObject;
import com.ruixue.share.media.MusicObject;

import java.io.File;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

//"title": "诱导类链接标题", // 标题
//"url": "https://domain-open.com/youdao?identity=9sz2oNCnR", // 链接
//"material_type": "link", // 素材类型
//"material_id": 1, // 素材ID
//"landing_id": 1, // 落地页ID
//"image": " ", // 图片地址
//"content": "诱导类链接文案" // 素材内容
//"x": 0, // 图片类型时 二维码x轴坐标
//"y": 0, // 图片类型时 二维码y轴坐标
//"width": 0, // 图片类型时 二维码宽度
//"height": 0 // 图片类型时 二维码高度
public class ShareContent {
    public String subject = "";
    public String mText = "";
    public String mFollow;
    public IMediaObject mMedia;
    public IMediaObject mExtra;

    public File file;
    public File app;
    public ImageObject[] mMedias;

    /**
     * 纯文本
     */
    public static final int TEXT_STYLE = 1;
    /**
     * 图片类型
     */
    public static final int IMAGE_STYLE = 1 << 1;

    public static final int TEXT_IMAGE_STYLE = IMAGE_STYLE | TEXT_STYLE;//2
    public static final int MUSIC_STYLE = 1 << 2;   //4
    public static final int VIDEO_STYLE = 1 << 3;   //8
    /**
     * 网页
     */
    public static final int WEB_STYLE = 1 << 4;     //16
    public static final int FILE_STYLE = 1 << 5;    //32
    public static final int EMOJI_STYLE = 1 << 6;   //64
    public static final int MINAPP_STYLE = 1 << 7;  //128
    public static final int QQMINI_STYLE = 1 << 8;  //256
    public static final int ERROR_STYLE = 0;

    @IntDef({TEXT_STYLE, IMAGE_STYLE, TEXT_IMAGE_STYLE, MUSIC_STYLE, VIDEO_STYLE, WEB_STYLE, FILE_STYLE, EMOJI_STYLE, MINAPP_STYLE, QQMINI_STYLE, ERROR_STYLE})
    @Retention(RetentionPolicy.SOURCE)
    public @interface ShareType {

    }

    public ShareContent() {
    }

    public int getShareType() {
        if (this.mMedia == null && this.mExtra == null && this.file == null) {
            return TextUtils.isEmpty(this.mText) ? ERROR_STYLE : TEXT_STYLE;
        } else if (this.file != null) {
            return FILE_STYLE;
        } else {
            if (this.mMedia != null) {
                if (this.mMedia instanceof ImageObject) {
                    if (TextUtils.isEmpty(this.mText)) {
                        return IMAGE_STYLE;
                    }
                    return TEXT_IMAGE_STYLE;
                }

                if (this.mMedia instanceof MusicObject) {
                    return MUSIC_STYLE;
                }

                if (this.mMedia instanceof VideoObject) {
                    return VIDEO_STYLE;
                }

                if (this.mMedia instanceof WebpageObject) {
                    return WEB_STYLE;
                }

                if (this.mMedia instanceof WXMiniObject) {
                    return MINAPP_STYLE;
                }

                if (this.mMedia instanceof QQMiniObject) {
                    return QQMINI_STYLE;
                }
            }
            return ERROR_STYLE;
        }
    }
}
