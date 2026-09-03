package com.ruixue.share;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.share.media.IMediaObject;
import com.ruixue.share.media.ImageObject;
import com.ruixue.share.media.WebpageObject;

import java.io.File;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ShareAction {
    protected ShareContent shareContent = new ShareContent();
    protected PlatformType platformType = null;
    protected RXJSONCallback shareCallback = null;

    protected Activity activity;
    protected List<PlatformSns> snsPlatforms = new ArrayList<>();

    public ShareAction(Activity activity) {
        if (activity != null) {
            this.activity = (Activity) (new WeakReference<>(activity)).get();
        }
    }

    public ShareContent getShareContent() {
        return this.shareContent;
    }

    public boolean getUrlValid() {
        return this.shareContent == null || this.shareContent.mMedia == null || !(this.shareContent.mMedia instanceof WebpageObject) || this.shareContent.mMedia.toUrl() == null || this.shareContent.mMedia.toUrl().startsWith("http");
    }

    public PlatformType getPlatform() {
        return this.platformType;
    }

    /**
     * @param platformType 分享平台类型
     */
    public ShareAction setPlatform(PlatformType platformType) {
        this.platformType = platformType;
        return this;
    }

    public ShareAction setShareResultCallback(RXJSONCallback shareListener) {
        this.shareCallback = shareListener;
        return this;
    }

    public ShareAction setShareContent(ShareContent shareContent) {
        this.shareContent = shareContent;
        return this;
    }

    public ShareAction withText(String text) {
        this.shareContent.mText = text;
        return this;
    }

    public ShareAction withSubject(String subject) {
        this.shareContent.subject = subject;
        return this;
    }

    public ShareAction withFile(File file) {
        this.shareContent.file = file;
        return this;
    }

    public ShareAction withApp(File file) {
        this.shareContent.app = file;
        return this;
    }

    public ShareAction withMedias(ImageObject... images) {
        if (images != null && images.length > 0) {
            this.shareContent.mMedia = images[0];
        }
        this.shareContent.mMedias = images;
        return this;
    }

    public ShareAction withMedia(IMediaObject mediaObject) {
        this.shareContent.mMedia = mediaObject;

        return this;
    }

    public ShareAction withExtra(ImageObject extra) {
        this.shareContent.mExtra = extra;
        return this;
    }

    public void share(Map<String, Object> hashMap) {
        if (hashMap != null && platformType != null) {
            hashMap.remove("platform");
            // call share api
            ShareManager.getInstance().doShareByPlatform(activity, platformType, hashMap, shareCallback);
        } else if (shareCallback != null) {
            RXLogger.i("分享参数null,未设置分享参数");
            shareCallback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
        }
    }
}
