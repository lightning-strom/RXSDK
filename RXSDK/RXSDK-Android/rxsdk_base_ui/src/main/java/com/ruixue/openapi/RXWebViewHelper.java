package com.ruixue.openapi;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.net.HttpUtil;
import com.ruixue.passport.LoginData;
import com.ruixue.view.RXWebView;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/10
 */
public class RXWebViewHelper {

    public static IRXView createWebView(Context context, String url, Map<String, Object> customParams, RXJSONCallback callback) {
        RXWebView rxWebView = RXWebView.create(context, url);
        rxWebView.setOnGetParamsListener(() -> HttpUtil.getWebViewJson(context, customParams,false));
//        Map<String, String> cookieMap = getCookieMap();
//        rxWebView.setCookie(url, cookieMap);
//        rxWebView.setTitleBackgroundColor(Color.parseColor("#E0FFFC"));
//        rxWebView.setTitle(titleResId);
        rxWebView.setCallback(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null)
                    callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null)
                    callback.onFailed(cause);
            }
        });
        rxWebView.setBackEnable(true);
         return rxWebView;
    }
}
