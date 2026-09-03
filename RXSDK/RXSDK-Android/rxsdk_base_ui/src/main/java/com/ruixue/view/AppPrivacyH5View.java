package com.ruixue.view;

import android.content.Context;

import com.ruixue.RuiXueSdk;

import org.json.JSONObject;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/9/5
 */
public class AppPrivacyH5View extends RXWebView {

    protected static RXWebView create(Context activity, String key, Collection<String> key_list, String baseUrl, boolean isOasVersion) {
        if (key.startsWith("http")) {
            return new AppPrivacyH5View(activity).loadUrl(key);
        } else {
            Map<String, Object> map = new HashMap<>();
            map.put("key", key);
            map.put("key_list", key_list);
            String url = baseUrl + (isOasVersion ? "static/passport/#/oversea/protocol" : "static/passport/#/protocol/protocollist");
            return new AppPrivacyH5View(activity).setPrivacyParams(map).loadUrl(url);
        }
    }

    public static RXWebView create(Context activity, String key, Collection<String> key_list, String baseUrl) {
        return create(activity, key, key_list, baseUrl, RuiXueSdk.isOasVersion());
    }

    public static RXWebView create(Context activity, String key, Collection<String> key_list, boolean isOasVersion) {
        return create(activity, key, key_list, RuiXueSdk.getFirstBaseUrl(), isOasVersion);
    }

    public static RXWebView create(Context activity, String key, Collection<String> key_list) {
        return create(activity, key, key_list, RuiXueSdk.isOasVersion());
    }

    public AppPrivacyH5View(Context context) {
        super(context);
    }

    public AppPrivacyH5View setPrivacyParams(Map<String, Object> map) {
        Map<String, Object> map1 = new HashMap<>();
        map1.put("protocol", new JSONObject(map).toString());
        setExtParams(map1);
        return this;
    }
}
