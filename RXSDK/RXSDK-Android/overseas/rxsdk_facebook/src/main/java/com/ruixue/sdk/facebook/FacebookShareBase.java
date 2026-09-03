package com.ruixue.sdk.facebook;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.provider.MediaStore;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.share.Sharer;
import com.facebook.share.model.ShareContent;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.model.ShareMediaContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.model.ShareVideo;
import com.facebook.share.model.ShareVideoContent;
import com.facebook.share.widget.ShareDialog;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.share.ShareMediaType;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;

import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
abstract class FacebookShareBase implements IFacebookShare {

    protected abstract ShareDialog getShareDialog(Activity activity);

    protected abstract boolean canShow(Class<? extends ShareContent<?, ?>> contentClass);

    protected boolean registerShareCallback(Activity activity, Class<? extends ShareContent<?, ?>> contentClass, RXJSONCallback callback) {
        if (canShow(contentClass)) {
            getShareDialog(activity).registerCallback(sCallbackManager, new FacebookCallback<Sharer.Result>() {
                @Override
                public void onSuccess(Sharer.Result result) {
                    RXLogger.i("facebook share success:" + result.getPostId());
                    if (callback != null)
                        callback.onSuccess(null);
                }

                @Override
                public void onCancel() {
                    RXLogger.i("facebook share cancel");
                    if (callback != null)
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_CANCEL));
                }

                @Override
                public void onError(@NonNull FacebookException error) {
                    error.printStackTrace();
                    RXLogger.e("facebook share failed:" + error.getMessage());
                    if (callback != null)
                        callback.onError(new RXException(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), error));
                }
            });
            return true;
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "Unable to show the provided share " + contentClass != null ? contentClass.getName() : ""));
            return false;
        }
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback) {
        String material_type = paramsMap.get("material_type") != null ? String.valueOf(paramsMap.get("material_type")) : null;
        if (ShareMediaType.WEBPAGE.equals(material_type)) {
            String title = paramsMap.containsKey("copywriting") ? (String) paramsMap.get("copywriting") : "";
            shareLink(activity, (String) Objects.requireNonNull(paramsMap.get("url")), title, (String) paramsMap.get("content"), callback);
        } else if (ShareMediaType.IMAGE.equals(material_type) || ShareMediaType.LANDING.equals(material_type)) {
            Object bitmapObj = paramsMap.get("bitmap");
            if (paramsMap.containsKey("bitmap") && (bitmapObj instanceof Bitmap)) {
                shareImage(activity, (Bitmap) bitmapObj, (String) paramsMap.get("url"), ObjectUtils.toInt(paramsMap.get("width")), ObjectUtils.toInt(paramsMap.get("height")), ObjectUtils.toInt(paramsMap.get("x")), ObjectUtils.toInt(paramsMap.get("y")), ObjectUtils.toInt(paramsMap.get("border_size")), callback);
            } else {
                shareImage(activity, (String) paramsMap.get("image"), (String) paramsMap.get("url"), ObjectUtils.toInt(paramsMap.get("width")), ObjectUtils.toInt(paramsMap.get("height")), ObjectUtils.toInt(paramsMap.get("x")), ObjectUtils.toInt(paramsMap.get("y")), ObjectUtils.toInt(paramsMap.get("border_size")), callback);
            }
        } else if (ShareMediaType.VIDEO.equals(material_type)) {
            shareVideo(activity, (String) paramsMap.get("url"), callback);
        } else {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "unsupported share types " + material_type));
            }
        }
        return true;
    }

    /**
     * 分享链接
     * @param activity 应用上下文
     * @param url      链接
     * @param callback 分享回调
     */
    public void shareLink(Activity activity, @NonNull String url, RXJSONCallback callback) {
        shareLink(activity, url, null, null, callback);
    }

    /**
     * 分享链接
     * @param activity
     * @param url      链接
     * @param hashTag  话题标签
     * @param callback 分享回调
     */
    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, RXJSONCallback callback) {
        shareLink(activity, url, hashTag, null, callback);
    }

    /**
     * 分享链接
     * @param url      链接
     * @param hashTag  话题标签
     * @param quote    引文分享
     * @param callback 分享回调
     */
    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, @Nullable String quote, RXJSONCallback callback) {
        //分享链接
        if (registerShareCallback(activity, ShareLinkContent.class, callback)) {
            ShareLinkContent.Builder builder = new ShareLinkContent.Builder().setContentUrl(Uri.parse(url));
            if (!TextUtils.isEmpty(hashTag)) {
                //为链接分享添加话题标签。
                builder.setShareHashtag(new ShareHashtag.Builder().setHashtag(hashTag).build());
            }
            if (!TextUtils.isEmpty(quote)) {
                //引文分享
                builder.setQuote(quote);
            }
            ShareLinkContent content = builder.build();

            share(activity, content);
        }
    }

    public void share(Activity activity, ShareContent content) {
//      getShareDialog(activity).show(content, ShareDialog.Mode.AUTOMATIC);
        getShareDialog(activity).show(content);
    }

    /**
     * @param activity    应用activity
     * @param shareObject shareObject
     */
    public void shareImage(Activity activity, FBShareObject shareObject, RXJSONCallback callback) {
        if (shareObject.getBitmap() != null) {
            shareImage(activity, shareObject.getBitmap(), shareObject.getUrl(), shareObject.getWidth(), shareObject.getHeight(), shareObject.getX(), shareObject.getY(), callback);
        } else {
            shareImage(activity, shareObject.getImage(), shareObject.getUrl(), shareObject.getWidth(), shareObject.getHeight(), shareObject.getX(), shareObject.getY(), shareObject.getBorderSize(), callback);
        }
    }

    @Override
    public void shareImage(Activity activity, Bitmap bitmap, RXJSONCallback callback) {
        if (registerShareCallback(activity, SharePhotoContent.class, callback)) {
            if (null != bitmap) {
                shareImage(activity, bitmap, null, 0, 0, 0, 0);
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, Image cannot be read."));
            }
        }
    }

    /**
     * 分享图片
     * @param activity
     * @param imgPath  imgPath
     * @param callback
     */
    public void shareImage(Activity activity, String imgPath, RXJSONCallback callback) {
        shareImage(activity, imgPath, null, 0, 0, 0, 0, 0, callback);
    }

    public void shareImage(Activity activity, Bitmap bitmap, String qrUrl, int width, int height, int x, int y, int margin, RXJSONCallback callback) {
        //分享图片
        if (registerShareCallback(activity, SharePhotoContent.class, callback)) {
            if (null != bitmap) {
                shareImage(activity, bitmap, qrUrl, width, height, x, y, margin);
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, get image stream failed."));
            }
        }
    }

    /**
     * 分享图片
     * @param activity
     * @param bitmap   bitmap
     * @param callback
     */
    public void shareImage(Activity activity, Bitmap bitmap, String qrUrl, int width, int height, int x, int y, RXJSONCallback callback) {
        //分享图片
        if (registerShareCallback(activity, SharePhotoContent.class, callback)) {
            if (null != bitmap) {
                shareImage(activity, bitmap, qrUrl, width, height, x, y);
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, get image stream failed."));
            }
        }
    }

    public void shareImage(Activity activity, String imgPath, String qrUrl, int width, int height, int x, int y, RXJSONCallback callback) {
        shareImage(activity, imgPath, qrUrl, width, height, x, y, 0, callback);
    }

    /**
     * 分享图片
     * @param activity
     * @param imgPath  imgPath
     * @param callback
     */
    public void shareImage(Activity activity, String imgPath, String qrUrl, int width, int height, int x, int y, int margin, RXJSONCallback callback) {
        //分享图片
        if (registerShareCallback(activity, SharePhotoContent.class, callback)) {
            if (TextUtils.isEmpty(imgPath)) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, image is null error."));
            } else if (imgPath.startsWith("http")) {
                ImageUtils.getNetBitmap(imgPath, new Handler(Looper.getMainLooper()) {
                    @Override
                    public void handleMessage(Message msg) {
                        super.handleMessage(msg);
                        Bitmap bitmap = (Bitmap) msg.obj;
                        if (null != bitmap) {
                            shareImage(activity, bitmap, qrUrl, width, height, x, y, margin);
                        } else {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, get image stream failed."));
                        }
                    }
                });
            } else {
                try {
                    if (imgPath.startsWith("/")) {
                        imgPath = Uri.fromFile(new File(imgPath)).toString();
                    }
                    Bitmap imgBitmap = MediaStore.Images.Media.getBitmap(activity.getContentResolver(), Uri.parse(imgPath));
                    shareImage(activity, imgBitmap, qrUrl, width, height, x, y, margin);
                } catch (IOException e) {
                    e.printStackTrace();
                    Bitmap imgBitmap = BitmapFactory.decodeFile(imgPath);
                    if (imgBitmap != null) {
                        shareImage(activity, imgBitmap, qrUrl, width, height, x, y);
                    } else {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed, Image cannot be read."));
                    }
                }
            }
        }
    }

    private void shareImage(Activity activity, Bitmap img) {
        shareImage(activity, img, null, 0, 0, 0, 0);
    }


    protected void shareImage(Activity activity, Bitmap img, String qrUrl, int width, int height, int x, int y) {
        shareImage(activity, img, null, 0, 0, 0, 0, 0);

    }

    protected void shareImage(Activity activity, String url) {
        SharePhoto photo = new SharePhoto.Builder().setImageUrl(Uri.parse(url)).build();
        SharePhotoContent content = new SharePhotoContent.Builder().addPhoto(photo).build();
        share(activity, content);
    }

    protected void shareImage(Activity activity, Bitmap img, String qrUrl, int width, int height, int x, int y, int margin) {
        if (!TextUtils.isEmpty(qrUrl) && width > 0 && height > 0) {
            // 合成二维码写入相册
            img = BitmapHelper.addQRToBitmap(img, qrUrl, width, height, x, y, margin);
        }
        SharePhoto photo = new SharePhoto.Builder().setBitmap(img).build();
        SharePhotoContent content = new SharePhotoContent.Builder().addPhoto(photo).build();
        share(activity, content);
    }


    public void shareVideo(Activity activity, String videoUrl, RXJSONCallback callback) {
        if (registerShareCallback(activity, ShareVideoContent.class, callback)) {
            Uri videoFileUri = Uri.parse(videoUrl);
            ShareVideo video = new ShareVideo.Builder().setLocalUrl(videoFileUri).build();
            ShareVideoContent content = new ShareVideoContent.Builder().setVideo(video).build();
            share(activity, content);
        }
    }

    /**
     * 用户每次可以分享最多包含 6 个照片和视频元素的内容。
     * @param activity 应用上下文
     * @param photos   分享照片列表
     * @param videos   视频 地址 列表
     * @param callback callback
     */
    public void shareMedia(Activity activity, List<String> photos, List<String> videos, RXJSONCallback callback) {
        if (registerShareCallback(activity, ShareMediaContent.class, callback)) {
            try {
                ShareMediaContent.Builder builder = new ShareMediaContent.Builder();
                if (photos != null) {
                    for (String photo : photos) {
                        File file = new File(photo);
                        if (!file.exists()) {
                            RXLogger.e("Share IMG file no exists :" + photo);
                            continue;
                        }
                        Bitmap bitmap = BitmapFactory.decodeFile(photo);
                        SharePhoto sharePhoto = new SharePhoto.Builder().setBitmap(bitmap).build();
                        builder.addMedium(sharePhoto);
                    }
                }
                if (videos != null) {
                    for (String video : videos) {
                        ShareVideo shareVideo = new ShareVideo.Builder().setLocalUrl(Uri.parse(video)).build();
                        builder.addMedium(shareVideo);
                    }
                }
                share(activity, builder.build());
            } catch (Exception e) {
                callback.onError(new RXException(e));
            }
        }
    }
}
