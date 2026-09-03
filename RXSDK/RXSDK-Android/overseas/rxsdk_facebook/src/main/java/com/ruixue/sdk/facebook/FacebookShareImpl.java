package com.ruixue.sdk.facebook;

import android.app.Activity;
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
public class FacebookShareImpl extends FacebookShareBase {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    static class Single {
        static FacebookShareImpl INSTANCE = new FacebookShareImpl();
    }

    public static FacebookShareImpl getInstance() {
        return Single.INSTANCE;
    }

    private WeakReference<ShareDialog> sShareDialog = null;

    @Override
    protected ShareDialog getShareDialog(Activity activity) {
        if (sShareDialog == null || sShareDialog.get() == null) {
            sShareDialog = new WeakReference<>(new ShareDialog(activity));
        }
        return sShareDialog.get();
    }

    //Unable to show the provided content via the web or the installed version of the Facebook app. Some dialogs are only supported starting API 14
    @Override
    protected boolean canShow(Class<? extends ShareContent<?, ?>> contentClass) {
        return ShareDialog.canShow(contentClass);
//        return true;
    }
}
