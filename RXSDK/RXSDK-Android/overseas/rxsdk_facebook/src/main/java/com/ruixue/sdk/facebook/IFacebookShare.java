package com.ruixue.sdk.facebook;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.CallbackManager;
import com.facebook.share.model.ShareContent;
import com.ruixue.RXJSONCallback;
import com.ruixue.share.ShareObject;

import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */

public interface IFacebookShare {
    CallbackManager sCallbackManager = CallbackManager.Factory.create();

    default CallbackManager getCallbackManager() {
        return sCallbackManager;
    }

    boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback);

    void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data);

    void share(Activity activity, ShareContent content);

    /**
     * 分享链接
     * @param activity 应用上下文
     * @param url      链接
     * @param callback 分享回调
     */
    void shareLink(Activity activity, @NonNull String url, RXJSONCallback callback);

    /**
     * 分享链接
     * @param activity activity
     * @param url      链接
     * @param hashTag  话题标签
     * @param callback 分享回调
     */
    void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, RXJSONCallback callback);

    /**
     * @param activity activity
     * @param url      链接
     * @param hashTag  话题标签
     * @param quote    引文
     * @param callback 分享回调
     */
    void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, @Nullable String quote, RXJSONCallback callback);


    void shareImage(Activity activity, FBShareObject shareObject, RXJSONCallback callback);

    /**
     * @param activity activity
     * @param bitmap   图片位图对象
     * @param callback 分享回调
     */
    void shareImage(Activity activity, Bitmap bitmap, RXJSONCallback callback);

    /**
     * 分享图片
     * @param activity activity
     * @param imgPath  图片地址
     * @param callback callback
     */
    void shareImage(Activity activity, String imgPath, RXJSONCallback callback);

    /**
     * @param activity 应用上下文
     * @param videoUrl 视频链接地址
     * @param callback callback
     */
    void shareVideo(Activity activity, String videoUrl, RXJSONCallback callback);

    /**
     * 用户每次可以分享最多包含 6 个照片和视频元素的内容。
     * @param activity 应用上下文
     * @param photos   分享照片列表
     * @param videos   视频 地址 列表
     * @param callback callback
     */
    void shareMedia(Activity activity, List<String> photos, List<String> videos, RXJSONCallback callback);
}


