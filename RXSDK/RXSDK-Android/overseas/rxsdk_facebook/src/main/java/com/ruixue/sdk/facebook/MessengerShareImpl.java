package com.ruixue.sdk.facebook;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
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
import com.facebook.FacebookSdk;
import com.facebook.share.Sharer;
import com.facebook.share.model.ShareContent;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.model.ShareMediaContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.model.ShareVideo;
import com.facebook.share.model.ShareVideoContent;
import com.facebook.share.widget.MessageDialog;
import com.facebook.share.widget.ShareDialog;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.URLHelper;
import com.ruixue.share.ShareMediaType;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.ref.WeakReference;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
public class MessengerShareImpl extends FacebookShareBase {

    static class Single {
        static MessengerShareImpl INSTANCE = new MessengerShareImpl();
    }

    private MessengerShareImpl() {
    }

    public static MessengerShareImpl getInstance() {
        return Single.INSTANCE;
    }

    private WeakReference<MessageDialog> sShareDialog = null;

    protected ShareDialog getShareDialog(Activity activity) {
        if (sShareDialog == null || sShareDialog.get() == null) {
            sShareDialog = new WeakReference<>(new MessageDialog(activity));
        }
        return sShareDialog.get();
    }

    @Override
    protected boolean canShow(Class<? extends ShareContent<?, ?>> contentClass) {

//        return MessageDialog.canShow(contentClass);
        return true;
    }

    int REQUEST_CODE = 66200;
    String PACKAGE_FACE = "com.facebook.orca";

    @Override
    public void shareImage(Activity activity, String imgPath, String qrUrl, int width, int height, int x, int y, RXJSONCallback callback) {
        mCallback = callback;
        if (imgPath.startsWith("http")) {
            ImageUtils.getNetBitmap(imgPath, new Handler(Looper.getMainLooper()) {
                @Override
                public void handleMessage(Message msg) {
                    super.handleMessage(msg);
                    Bitmap bitmap = (Bitmap) msg.obj;
                    if (null != bitmap) {
                        shareImage(activity, bitmap, qrUrl, width, height, x, y);
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
                shareImage(activity, imgBitmap, qrUrl, width, height, x, y);
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

    @Override
    public void shareImage(Activity activity, Bitmap img, String qrUrl, int width, int height, int x, int y) {
        if (!TextUtils.isEmpty(qrUrl) && width > 0 && height > 0) {
            // 合成二维码写入相册
            img = BitmapHelper.addQRToBitmap(img, qrUrl, width, height, x, y);
        }
        String fileName = "share_messenger.png";
        File file = new File(activity.getCacheDir(), fileName);
        OutputStream fos = null;
        try {
            // 打开输出流，并将Bitmap压缩成PNG格式输出到文件中
            fos = new FileOutputStream(file);
            img.compress(Bitmap.CompressFormat.PNG, 100, fos);
            Uri uri = FileUtil.grantUri(activity, file, PACKAGE_FACE);
            shareLink(activity, uri.toString(), "image/*");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void shareLink(Activity activity, String str, String type) {
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType(type);
        if (type.equals("text/plain")) {
            intent.putExtra(Intent.EXTRA_TEXT, str);
        } else {
            intent.addCategory("android.intent.category.DEFAULT");
            intent.putExtra(Intent.EXTRA_STREAM, Uri.parse(str));
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        ComponentName comp = new ComponentName(PACKAGE_FACE, "com.facebook.messenger.intents.ShareIntentHandler");
        intent.setComponent(comp);
        activity.startActivityForResult(intent, REQUEST_CODE);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (mCallback != null && REQUEST_CODE == requestCode) {
            mCallback.onSuccess(null);
            mCallback = null;
        }
    }

    RXJSONCallback mCallback;

    @Override
    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, @Nullable String quote, RXJSONCallback callback) {
//        Uri uri = Uri.parse("fb-messenger://share/?link=" );
//        activity.startActivity(new Intent(Intent.ACTION_VIEW, uri));
        if (!TextUtils.isEmpty(hashTag) || !TextUtils.isEmpty(quote)) {
            mCallback = callback;
            String str = "";
            if (!TextUtils.isEmpty(quote))
                str = quote + " " + str;
            if (!TextUtils.isEmpty(hashTag))
                str = hashTag + "\n" + str;
            str += url;
            shareLink(activity, str, "text/plain");
        } else {
            super.shareLink(activity, url, hashTag, quote, callback);
        }
    }

}
