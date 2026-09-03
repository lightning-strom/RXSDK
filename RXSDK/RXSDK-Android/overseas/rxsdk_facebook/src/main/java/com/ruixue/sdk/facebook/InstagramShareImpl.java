package com.ruixue.sdk.facebook;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.text.TextUtils;

import com.facebook.FacebookSdk;
import com.facebook.share.model.ShareContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.model.ShareStoryContent;
import com.facebook.share.widget.MessageDialog;
import com.facebook.share.widget.ShareDialog;
import com.ruixue.RXJSONCallback;
import com.ruixue.utils.BitmapHelper;

import java.lang.ref.WeakReference;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
public class InstagramShareImpl extends FacebookShareBase {

    public static String TYPE_TEXT = "text/plain";
    public static String TYPE_IMAGE = "image/*";
    public static String TYPE_VIDEO = "video/*";

    static class Single {
        static InstagramShareImpl INSTANCE = new InstagramShareImpl();
    }

    private InstagramShareImpl() {
    }

    public static InstagramShareImpl getInstance() {
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

    @Override
    protected boolean canShow(Class<? extends ShareContent<?, ?>> contentClass) {
        return true;
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    public void share(Activity activity, ShareContent content) {
        Uri uri = content.getContentUrl();

        // Define photo or video asset URI
        Uri backgroundAssetUri = Uri.parse("your-image-asset-uri-goes-here");

        // 调起ins动态
        // shareIntent = new Intent(“com.instagram.share.ADD_TO_FEED”);
        // 调起ins快拍
        // shareIntent = new Intent(“com.instagram.share.ADD_TO_STORY”);

        // Instantiate implicit intent with ADD_TO_STORY action
        Intent intent = new Intent("com.facebook.stories.ADD_TO_STORY");
        intent.setPackage("com.instagram.android");
        intent.setDataAndType(backgroundAssetUri, "text/plain");
        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.putExtra("com.facebook.platform.extra.APPLICATION_ID", FacebookSdk.getApplicationId());

        // Instantiate activity and verify it will resolve implicit intent

        if (activity.getPackageManager().resolveActivity(intent, 0) != null) {
            activity.startActivityForResult(intent, 0);
        }
    }

    protected void shareImage(Activity activity, Bitmap img, String qrUrl, int width, int height, int x, int y) {
        if (!TextUtils.isEmpty(qrUrl) && width > 0 && height > 0) {
            // 合成二维码写入相册
            img = BitmapHelper.addQRToBitmap(img, qrUrl, width, height, x, y);
        }
        SharePhoto photo = new SharePhoto.Builder().setBitmap(img).build();
//        SharePhotoContent content = new SharePhotoContent.Builder().addPhoto(photo).build();
        ShareStoryContent content = new ShareStoryContent.Builder().setBackgroundAsset(photo).build();
        share(activity, content);
//String type = "image/*";
//String filename = "/myPhoto.jpg";
//String mediaPath = Environment.getExternalStorageDirectory() + filename;
//    // Create the new Intent using the 'Send' action.
//    Intent share = new Intent(Intent.ACTION_SEND);
//
//    // Set the MIME type
//    share.setType(type);
//
//    // Create the URI from the media
//    File media = new File(mediaPath);
//    Uri uri = Uri.fromFile(media);
//
//    // Add the URI to the Intent.
//    share.putExtra(Intent.EXTRA_STREAM, uri);
//
//    // Broadcast the Intent.
//    startActivity(Intent.createChooser(share, "Share to"));
    }

    protected void shareImage(Activity activity, String url) {
        SharePhoto photo = new SharePhoto.Builder().setImageUrl(Uri.parse(url)).build();
//        SharePhotoContent content = new SharePhotoContent.Builder().addPhoto(photo).build();
        // Add to ShareStoryContent
        ShareStoryContent content = new ShareStoryContent.Builder().setBackgroundAsset(photo).build();
        share(activity, content);
    }
}
