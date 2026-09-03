package com.ruixue.share.system;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.RXFileProvider;
import com.ruixue.logger.RXLogger;
import com.ruixue.share.MIMEType;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.share.ShareScene;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.ImageUtil;
import com.ruixue.utils.JSONUtil;

import java.io.File;
import java.util.List;
import java.util.Objects;

@SuppressWarnings("unchecked")
public class SystemShare {

    private static final String TAG = RuiXueSdk.TAG;
    public static int REQUEST_CODE_SYSTEM_SHARE = 1024;
    /**
     * Current activity
     */
    private final Activity activity;

    private final String platform;

    /**
     * Share content type
     */
    private @MIMEType
    final String contentType;

    /**
     * Share title
     */
    private String title;

    /**
     * Share file Uri
     */
    private final Uri shareFileUri;

    /**
     * Share content text
     */
    private final String contentText;

    /**
     * Share to special component PackageName
     */
    private final String componentPackageName;

    /**
     * Share to special component ClassName
     */
    private final String componentClassName;

    /**
     * Share complete onActivityResult requestCode
     */
    private final int requestCode;

    /**
     * Forced Use System Chooser
     */
    private final boolean forcedUseSystemChooser;

    public static boolean share(Activity activity, ShareObject shareObject, RXJSONCallback callback) {
        try {
            switch (shareObject.getType()) {
                case ShareMediaType.TEXT:
                    return shareText(activity, shareObject);
                case ShareMediaType.IMAGE:
                    return shareImage(activity, shareObject, callback);
                case ShareMediaType.WEBPAGE:
                    return shareLink(activity, shareObject);
                case ShareMediaType.VIDEO:
                    return shareVideo(activity, shareObject, REQUEST_CODE_SYSTEM_SHARE);
                case ShareMediaType.CARD:
                default:
                    break;
            }
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "Unsupported share type " + shareObject.getType()));
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), e.getMessage()));
            return false;
        }
    }

    public static boolean shareLink(Activity activity, ShareObject shareObject) {
        SystemShare.Builder builder = new SystemShare.Builder(activity).setPlatform(shareObject.getPlatform()).forcedUseSystemChooser(shareObject.getForceUserSystemChooser()).setShareToComponent(shareObject.getPackageName(), shareObject.getClassName()).setContentType(MIMEType.TEXT).setTextContent(shareObject.getUrl()).setOnActivityResult(REQUEST_CODE_SYSTEM_SHARE).setTitle(shareObject.getTitle());
        if (shareObject.getShareScene() == ShareScene.SESSION) {//文本不支持朋友圈分享
            builder.setShareScene(shareObject.getShareScene());
        }
        return builder.build().shareBySystem();
    }

    //文本类型不支持微信朋友圈分享
    public static boolean shareText(Activity activity, ShareObject shareObject) {
        SystemShare.Builder builder = new SystemShare.Builder(activity).setPlatform(shareObject.getPlatform()).forcedUseSystemChooser(shareObject.getForceUserSystemChooser()).setShareToComponent(shareObject.getPackageName(), shareObject.getClassName()).setContentType(MIMEType.TEXT).setTextContent(shareObject.getDescription()).setOnActivityResult(REQUEST_CODE_SYSTEM_SHARE).setTitle(shareObject.getTitle());
        if (shareObject.getShareScene() == ShareScene.SESSION) {//文本不支持朋友圈分享
            builder.setShareScene(shareObject.getShareScene());
        }
        return builder.build().shareBySystem();
    }


    /**
     * @param activity    应用activity
     * @param shareObject shareObject
     */
    public static boolean shareImage(Activity activity, ShareObject shareObject, RXJSONCallback shareCallback) {

        Glide.with(activity).asBitmap().skipMemoryCache(true).diskCacheStrategy(DiskCacheStrategy.NONE)
                .load(shareObject.getImage()).into(new CustomTarget<Bitmap>() {
                    @Override
                    public void onLoadFailed(@Nullable Drawable errorDrawable) {
                        super.onLoadFailed(errorDrawable);
                        if (null != shareCallback) {
                            shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share image load failed ,please check file path."));
                        }
                    }

                    @Override
                    public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
                        try {
                            Bitmap bitmap = resource;
                            if (!TextUtils.isEmpty(shareObject.getUrl())) {
                                Bitmap fg = BitmapHelper.syncEncodeQRCode(shareObject.getUrl(), shareObject.getWidth(), shareObject.getHeight(),shareObject.getBorderSize());
                                if (fg != null) {
                                    bitmap = BitmapHelper.combineBitmap(resource, fg, shareObject.getX(), shareObject.getY());
                                }
                            }
                            String filePath = (MediaStore.Images.Media.insertImage(activity.getContentResolver(), bitmap, "rximg_" + System.currentTimeMillis(), shareObject.getImage()));
                            Uri imageUri;
                            if (TextUtils.isEmpty(filePath)) {
                                String filename = ImageUtil.saveToExternalCacheDir(activity, "rximg_" + System.currentTimeMillis() + ".jpg", bitmap);
                                imageUri = FileUtil.grantUri(activity, new File(Objects.requireNonNull(filename)), "com.tencent.mm");
                            } else {
                                imageUri = Uri.parse(filePath);
                            }
                            boolean result = shareImage(activity, shareObject, imageUri);
                            if (!result && null != shareCallback) {
                                RXLogger.e("share image failed " + imageUri);
                                shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share image failed code -1"));
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            if (null != shareCallback) {
                                shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), e.getMessage()));
                            }
                        }
                    }

                    @Override
                    public void onLoadCleared(@Nullable Drawable placeholder) {
                        if (null != shareCallback)
                            shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "share failed code -2"));
                    }

                });
        return true;
    }

    public static boolean shareImage(Activity activity, ShareObject shareObject, Uri imageUri) {
        return new SystemShare.Builder(activity).setPlatform(shareObject.getPlatform()).forcedUseSystemChooser(shareObject.getForceUserSystemChooser()).setShareToComponent(shareObject.getPackageName(), shareObject.getClassName()).setContentType(MIMEType.IMAGE).setShareFileUri(imageUri).setOnActivityResult(REQUEST_CODE_SYSTEM_SHARE).setShareScene(shareObject.getShareScene()).setTitle(shareObject.getTitle()).setTextContent(shareObject.getDescription()).build().shareBySystem();
    }

    public static boolean shareAudio(Activity activity, ShareObject shareObject) {
        return new SystemShare.Builder(activity).setPlatform(shareObject.getPlatform()).forcedUseSystemChooser(shareObject.getForceUserSystemChooser()).setShareToComponent(shareObject.getPackageName(), shareObject.getClassName()).setContentType(MIMEType.AUDIO).setShareFileUri(Uri.parse(shareObject.getUrl())).setTitle(shareObject.getTitle()).build().shareBySystem();
    }

    public static boolean shareVideo(Activity activity, ShareObject shareObject, int requestCode) {
        Uri uri;
        if (shareObject.getUrl().startsWith("/")) {
            uri = RXFileProvider.getUriForFile(activity, new File(shareObject.getUrl()));
        } else {
            uri = Uri.parse(shareObject.getUrl());
        }
        return new SystemShare.Builder(activity).setPlatform(shareObject.getPlatform()).forcedUseSystemChooser(shareObject.getForceUserSystemChooser()).setShareToComponent(shareObject.getPackageName(), shareObject.getClassName()).setContentType(MIMEType.FILE).setShareFileUri(uri).setTitle("Share File").setOnActivityResult(requestCode).build().shareBySystem();
    }

    public static boolean shareFile(Activity activity, ShareObject shareObject) {
//        new SystemShare.Builder(activity)
//                .setContentType(ShareContentType.FILE)
//                .setShareFileUri(getShareFileUri())
//                .setTitle("Share File")
//                .setOnActivityResult(REQUEST_SHARE_FILE_CODE)
//                .build()
//                .shareBySystem();
        return true;
    }

    /**
     * Get file uri
     * @param context          context
     * @param shareContentType shareContentType {@link MIMEType}
     * @param file             file
     * @return Uri
     */
    @SuppressLint("WrongConstant")
    public static Uri getFileUri(Context context, @MIMEType String shareContentType, File file) {

        if (context == null) {
            Log.e(TAG, "getFileUri current activity is null.");
            return null;
        }

        if (file == null || !file.exists()) {
            Log.e(TAG, "getFileUri file is null or not exists.");
            return null;
        }

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            Log.e(TAG, "getFileUri miss WRITE_EXTERNAL_STORAGE permission.");
            return null;
        }

        Uri uri = null;

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            uri = Uri.fromFile(file);
        } else {

            if (TextUtils.isEmpty(shareContentType)) {
                shareContentType = MIMEType.FILE;
            }

            switch (shareContentType) {
                case MIMEType.IMAGE:
                    uri = FileUtil.getImageContentUri(context, file);
                    break;
                case MIMEType.VIDEO:
                    uri = FileUtil.getVideoContentUri(context, file);
                    break;
                case MIMEType.AUDIO:
                    uri = FileUtil.getAudioContentUri(context, file);
                    break;
                case MIMEType.FILE:
                    uri = FileUtil.getFileContentUri(context, file);
                    break;
                default:
                    break;
            }
        }

        if (uri == null) {
            uri = FileUtil.forceGetFileUri(file);
        }

        return uri;
    }

    private SystemShare(@NonNull Builder builder) {
        this.activity = builder.activity;
        this.contentType = builder.contentType;
        this.title = builder.title;
        this.shareFileUri = builder.shareFileUri;
        this.contentText = builder.textContent;
        this.componentPackageName = builder.componentPackageName;
        this.componentClassName = builder.componentClassName;
        this.requestCode = builder.requestCode;
        this.forcedUseSystemChooser = builder.forcedUseSystemChooser;
        this.platform = builder.platform;
    }

    /**
     * shareBySystem
     */
    @SuppressLint("QueryPermissionsNeeded")
    public boolean shareBySystem() {
        if (checkShareParam()) {
            Intent shareIntent = createShareIntent();
            if (shareIntent == null) {
                Log.e(TAG, "shareBySystem cancel.");
                return false;
            }
            if (title == null) {
                title = "";
            }

            if (forcedUseSystemChooser) {
                shareIntent = Intent.createChooser(shareIntent, title);
            }

            if (shareIntent.resolveActivity(activity.getPackageManager()) != null) {
                try {
                    if (requestCode != -1) {
                        activity.startActivityForResult(shareIntent, requestCode);
                    } else {
                        activity.startActivity(shareIntent);
                    }
                } catch (Exception e) {
                    Log.e(TAG, Log.getStackTraceString(e));
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    private Intent createShareIntent() {
        Intent shareIntent = new Intent();
        shareIntent.setAction(Intent.ACTION_SEND);
        shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        shareIntent.addCategory("android.intent.category.DEFAULT");

        if (!TextUtils.isEmpty(this.componentPackageName) && !TextUtils.isEmpty(componentClassName)) {
            ComponentName comp = new ComponentName(componentPackageName, componentClassName);
            shareIntent.setComponent(comp);
        }
        if (!TextUtils.isEmpty(contentText)) {
            shareIntent.putExtra("Kdescription", contentText);
        }

        switch (contentType) {
            case MIMEType.TEXT:
                shareIntent.putExtra(Intent.EXTRA_TEXT, contentText);
                shareIntent.setType("text/plain");
                break;
            case MIMEType.IMAGE:
            case MIMEType.AUDIO:
            case MIMEType.VIDEO:
            case MIMEType.FILE:
                shareIntent.setAction(Intent.ACTION_SEND);
                shareIntent.addCategory("android.intent.category.DEFAULT");
                shareIntent.setType(contentType);
                shareIntent.putExtra(Intent.EXTRA_STREAM, shareFileUri);
                shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                Log.d(TAG, "Share uri: " + shareFileUri.toString());

                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
                    List<ResolveInfo> resInfoList = activity.getPackageManager().queryIntentActivities(shareIntent, PackageManager.MATCH_DEFAULT_ONLY);
                    for (ResolveInfo resolveInfo : resInfoList) {
                        String packageName = resolveInfo.activityInfo.packageName;
                        activity.grantUriPermission(packageName, shareFileUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    }
                }
                break;
            default:
                Log.e(TAG, contentType + " is not support share type.");
                shareIntent = null;
                break;
        }

        return shareIntent;
    }


    private boolean checkShareParam() {
        if (this.activity == null) {
            Log.e(TAG, "activity is null.");
            return false;
        }

        if (TextUtils.isEmpty(this.contentType)) {
            Log.e(TAG, "Share content type is empty.");
            return false;
        }

        if (MIMEType.TEXT.equals(contentType)) {
            if (TextUtils.isEmpty(contentText)) {
                Log.e(TAG, "Share text context is empty.");
                return false;
            }
        } else {
            if (this.shareFileUri == null) {
                Log.e(TAG, "Share file path is null.");
                return false;
            }
        }

        return true;
    }

    public static class Builder {
        private final Activity activity;
        private String platform;
        private @MIMEType String contentType = MIMEType.FILE;
        private String title;
        private String componentPackageName;
        private String componentClassName;
        private Uri shareFileUri;
        private String textContent;
        private int requestCode = -1;
        private boolean forcedUseSystemChooser = true;

        public Builder(Activity activity) {
            this.activity = activity;
        }

        /**
         * Set Content Type
         * @param contentType {@link MIMEType}
         * @return Builder
         */
        public Builder setContentType(@MIMEType String contentType) {
            this.contentType = contentType;
            return this;
        }

        public Builder setPlatform(String platform) {
            this.platform = platform;
            return this;
        }

        /**
         * Set Title
         * @param title title
         * @return Builder
         */
        public Builder setTitle(@NonNull String title) {
            this.title = title;
            return this;
        }

        /**
         * Set share file path
         * * 在 Android 7.0 以后，系统对 scheme 为 file:// 的 uri 进行了限制，所以之前进行文件分享的一些接口就不能用了，
         * 此时就得使用其他的URI scheme 来代替 file://，比如 MediaStore 的 content:// 或者FileProvider 。
         * @param shareFileUri shareFileUri
         * @return Builder
         */
        public Builder setShareFileUri(Uri shareFileUri) {
            this.shareFileUri = shareFileUri;
            return this;
        }

        /**
         * Set text content
         * @param textContent textContent
         * @return Builder
         */
        public Builder setTextContent(String textContent) {
            this.textContent = textContent;
            return this;
        }

        /**
         * Set Share To Component
         * @param componentPackageName componentPackageName
         * @param componentClassName   componentPackageName
         * @return Builder
         */
        public Builder setShareToComponent(String componentPackageName, String componentClassName) {
            this.componentPackageName = componentPackageName;
            this.componentClassName = componentClassName;
            return this;
        }

        /**
         * 设置分享场景
         * @param scene 0 微信好友 1 微信朋友圈
         */
        public Builder setShareScene(@ShareScene int scene) {
            switch (scene) {
                case ShareScene.SESSION:
                    if (platform != null && platform.equals(PlatformType.WECHAT.getKeyword()))
                        setShareToComponent("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
                    break;
                case ShareScene.TIMELINE:
                    if (platform != null && platform.equals(PlatformType.WECHAT.getKeyword()))
                        setShareToComponent("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");
                    break;
                case ShareScene.FAVORITE:
                case ShareScene.SPECIFIED_CONTACT:
                case ShareScene.STATUS:
                case ShareScene.SELECT:
                default:
                    break;
            }
            return this;
        }

        /**
         * Set onActivityResult requestCode, default value is -1
         * @param requestCode requestCode
         * @return Builder
         */
        public Builder setOnActivityResult(int requestCode) {
            this.requestCode = requestCode;
            return this;
        }

        /**
         * Forced Use System Chooser To Share
         * @param enable default is true
         * @return Builder
         */
        public Builder forcedUseSystemChooser(boolean enable) {
            this.forcedUseSystemChooser = enable;
            return this;
        }

        /**
         * build
         * @return Share2
         */
        public SystemShare build() {
            return new SystemShare(this);
        }

    }
}
