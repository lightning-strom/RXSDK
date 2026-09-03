package com.ruixue.sdk.tiktok;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.logger.RXLogger;
import com.ruixue.share.ShareMediaType;
import com.ruixue.utils.ObjectUtils;
import com.tiktok.open.sdk.share.Format;
import com.tiktok.open.sdk.share.MediaType;
import com.tiktok.open.sdk.share.ShareApi;
import com.tiktok.open.sdk.share.ShareRequest;
import com.tiktok.open.sdk.share.model.MediaContent;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/9
 */
public class TiktokSdkHelper {

    public static boolean isInstalled(Context context) {
        String[] possiblePackages = {
                "com.zhiliaoapp.musically",       // TikTok 国际版
                "com.ss.android.ugc.trill",       // TikTok 国内或某些地区变种
        };

        PackageManager pm = context.getPackageManager();
        for (String pkg : possiblePackages) {
            try {
                pm.getPackageInfo(pkg, PackageManager.GET_META_DATA);
                return true;
            } catch (PackageManager.NameNotFoundException ignored) {
            }
        }
        return false;
    }

    public static boolean isSupport(String type) {
        return type != null && (type.equals(ShareMediaType.IMAGE) || type.equals(ShareMediaType.ATLAS));
    }

    public static boolean share(Activity activity, Map<String, Object> paramsMap) {
        String type = (String) paramsMap.get("material_type");
        if (isSupport(type)) {
            ArrayList<String> li = getMediaList(paramsMap);

            String clientKey = (String) paramsMap.get("clientKey");
            if (TextUtils.isEmpty(clientKey)) {
                clientKey = (String) paramsMap.get("appid");
            }
            return TiktokSdkHelper.share(activity, clientKey, Objects.requireNonNull(type), li, ObjectUtils.toInt(paramsMap.get("format")));
        } else {
            RXLogger.e("nonsupport share type " + type);
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    @NonNull
    public static ArrayList<String> getMediaList(Map<String, Object> paramsMap) {
        ArrayList<String> li = new ArrayList<>();
        if (paramsMap.containsKey("image")) {
            li.add((String) paramsMap.get("image"));
        }
        Object images = paramsMap.get("images");
        if (images != null) {
            if (images instanceof String[]) {
                li.addAll(Arrays.asList((String[]) images));
            } else if (images instanceof List) {
                li.addAll((Collection<? extends String>) images);
            }
        }
        if (paramsMap.containsKey("video")) {
            li.add((String) paramsMap.get("video"));
        }
        Object videos = paramsMap.get("videos");
        if (videos != null) {
            if (videos instanceof String[]) {
                li.addAll(Arrays.asList((String[]) videos));
            } else if (videos instanceof List) {
                li.addAll((Collection<? extends String>) videos);
            }
        }
        return li;
    }

    public static boolean share(Activity activity, String clientKey, @ShareMediaType String mediaType, ArrayList<String> mediaUrls, int format) {
        ShareApi shareApi = new ShareApi(activity);

        MediaType mediaType1 = MediaType.IMAGE;
        if (mediaType.equals(ShareMediaType.VIDEO)) {
            mediaType1 = MediaType.VIDEO;
        }
        Format f = Format.DEFAULT;
        if (format == Format.GREEN_SCREEN.getFormat()) {
            f = Format.GREEN_SCREEN;
        }
        MediaContent mediaContent = new MediaContent(mediaType1, mediaUrls);
        String packageName = activity.getPackageName();
        String resultActivityFullPath = "com.ruixue.sdk.tiktok.ShareResultActivity";
        ShareRequest shareRequest = new ShareRequest(clientKey, mediaContent, f, packageName, resultActivityFullPath);
        return shareApi.share(shareRequest);
    }

}
