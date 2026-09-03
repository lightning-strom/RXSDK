package com.ruixue.demo.overseas;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareScene;

import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2024/3/21.
public class ZaloShareHelper {

    private final Activity activity;

    public ZaloShareHelper(Activity activity) {
        this.activity = activity;
    }

    public void shareLinkToZaloFriend(String url, String title, String content, RXJSONCallback callback) {
        shareLinkToZalo(ShareScene.SESSION, url, title, content, callback);
    }

    public void shareLinkToZaloFeed(String url, String title, String content, RXJSONCallback callback) {
        shareLinkToZalo(ShareScene.TIMELINE, url, title, content, callback);
    }

    public void shareLinkToZalo(String url, String title, String content, RXJSONCallback callback) {
        shareLinkToZalo(ShareScene.SELECT, url, title, content, callback);
    }

    private void shareLinkToZalo(int scene, String url, String title, String content, RXJSONCallback callback) {
        Map<String, Object> shareParams = new HashMap<>();
        shareParams.put("platform", "zalo");
        shareParams.put("material_type", ShareMediaType.WEBPAGE);
        shareParams.put("shareScene", scene);
        shareParams.put("url", url);
        shareParams.put("title", title);
        shareParams.put("content", content);
        shareParams.put("func", "zalo");
        shareParams.put("auto_share", true);
        shareParams.put("auto_report", true);
        RXSdkApi.getInstance().share(activity, shareParams, callback);
    }
}
