package com.ruixue.demo.overseas;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Build;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.sdk.facebook.FBShareObject;
import com.ruixue.sdk.facebook.FacebookSdkWrapper;
import com.ruixue.sdk.facebook.IFacebookShare;
import com.ruixue.sdk.facebook.InstagramShareImpl;
import com.ruixue.sdk.facebook.MessengerShareImpl;
import com.ruixue.share.ShareMediaType;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FacebookShareHelper {

    //    IFacebookShare iFacebookShare;
    String platform;

    FacebookShareHelper(Activity activity, RXJSONCallback callback, String platform) {
        this.activity = activity;
        this.callback = callback;
        this.platform = platform;
//        if (platform == 0) {
//            iFacebookShare = MessengerShareImpl.getInstance();
//        } else if (platform == 1) {
//            iFacebookShare = FacebookSdkWrapper.getInstance();
//        } else if (platform == 2) {
//            iFacebookShare = InstagramShareImpl.getInstance();
//        }
    }

    Activity activity;
    RXJSONCallback callback;



    public void shareText(Activity activity, @NonNull String text, String content) {
        Map<String, Object> shreParams = new HashMap<>();
        shreParams.put("platform", platform);
        shreParams.put("material_type", ShareMediaType.TEXT);
        shreParams.put("title", text);
        shreParams.put("content", "描述 " + content);
        RXSdkApi.getInstance().share(activity, shreParams, callback);


    }

    public void shareLink(Activity activity, @NonNull String url, @Nullable String hashTag, @Nullable String quote) {
        if (TextUtils.isEmpty(url)) {
            //add test link
            url = "https://developers.facebook.com/docs/sharing/android/?translation";
        }

        Map<String, Object> shreParams = new HashMap<>();
        shreParams.put("platform", platform);
        shreParams.put("material_type", ShareMediaType.WEBPAGE);
        shreParams.put("url", url);
        shreParams.put("title", hashTag);
        shreParams.put("content", quote);

        RXSdkApi.getInstance().share(activity, shreParams, callback);

//        iFacebookShare.shareLink(activity, url, hashTag, quote, callback);
    }

    public void shareVideo(Activity activity, String url) {
        Map<String, Object> shareMap = new HashMap<>();
        shareMap.put("platform", platform);
        shareMap.put("material_type", ShareMediaType.VIDEO);
        shareMap.put("url", url);
//        shareMap.put("clientKey", "awp02ajdec3p5091");
        shareMap.put("clientKey", "awu72crzsonssopy");


        RXSdkApi.getInstance().share(activity, shareMap, callback);
//        iFacebookShare.shareVideo(activity, url, callback);
    }

    public void shareMedia(Activity activity, List<String> photos, List<String> videos) {
//        iFacebookShare.shareMedia(activity, photos, videos, callback);
    }

    public void shareImage(Activity activity, @NonNull String image) {
        Map<String, Object> shareMap = new HashMap<>();
        shareMap.put("platform", platform);
        shareMap.put("material_type", ShareMediaType.IMAGE);
        shareMap.put("image", image);
        shareMap.put("images", Arrays.asList(image + "dd"));
//        shareMap.put("clientKey", "awp02ajdec3p5091");
        shareMap.put("clientKey", "awu72crzsonssopy");
        RXSdkApi.getInstance().share(activity, shareMap, callback);
//        iFacebookShare.shareImage(activity, image, callback);
    }

    public void shareImageWithQR(Activity activity) {
        String image = "https://cdn.pixabay.com/photo/2022/04/20/06/28/flowers-7144466_1280.jpg";
        String url = "https://www.baidu.com/";
        int width = 120, height = 120;
        int x = 0, y = 100;
        FBShareObject shareObject = new FBShareObject();
        shareObject.setImage(image);
        shareObject.setUrl(url);
        shareObject.setWidth(width);
        shareObject.setHeight(height);
        shareObject.setX(x);
        shareObject.setY(y);
        Map<String, Object> shareMap = shareObject.toMap();
        shareMap.put("platform", platform);
        shareMap.put("material_type", ShareMediaType.IMAGE);
        RXSdkApi.getInstance().share(activity, shareMap, callback);
//        iFacebookShare.shareImage(activity, shareObject, callback);
    }
}
