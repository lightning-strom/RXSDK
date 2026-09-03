package com.ruixue.view;

import android.content.Context;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.OnViewCloseListener;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Created by wangliang on 2024/8/21
 */
public class RealAuthH5View extends RXWebView {

    public static RXWebView create(Context activity, String region, boolean cancelable, RXJSONCallback callback) {
        String baseUrl = RuiXueSdk.getFirstBaseUrl();
        baseUrl += baseUrl.endsWith("/") ? "" : "/";
        String realAuthH5Url = baseUrl + "static/passport/#/oversea/realname";

        RXWebView webView = new RealAuthH5View(activity).loadUrl(realAuthH5Url).setCallback(callback);
        webView.setCloseEnable(cancelable);
        webView.setOnCloseListener(v -> {
            if (callback != null) {
                callback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
            }
        });
        Map<String, Object> realAuthParams = new HashMap<>();
        realAuthParams.put("closeVisible", cancelable);
        if (region == null) {
            realAuthParams.put("region", "");
        } else {
            realAuthParams.put("region", region.toUpperCase(Locale.ROOT));
        }
        webView.setRealAuthParams(realAuthParams);
        return webView;
    }

    public RealAuthH5View(Context context) {
        super(context);
    }
}
