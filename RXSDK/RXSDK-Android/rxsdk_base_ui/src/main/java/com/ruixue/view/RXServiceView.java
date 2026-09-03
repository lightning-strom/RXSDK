package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.text.TextUtils;

import com.ruixue.RuiXueSdk;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/3
 */
public class RXServiceView extends RXServiceWeb {

    public static RXServiceView create(Context activity, Map<String, Object> map, boolean lightTheme) {
        String url = RuiXueSdk.getFirstBaseUrl() + "static/service/#/welcome";
        return create(activity, url, map,lightTheme);
    }

    public static RXServiceView create(Context activity, String url, Map<String, Object> map, boolean lightTheme) {
        RXServiceView rxServiceView = getInstance(activity);
        rxServiceView.setCustomParams(map);
        rxServiceView.setLightTheme(lightTheme);
        if (TextUtils.isEmpty(rxServiceView.getUrl()) || !rxServiceView.getUrl().equals(url)) {
            rxServiceView.loadUrl(url);
        }
        return rxServiceView;
    }

    public static RXServiceView create(Context activity, String url, Map<String, Object> map) {
        return create(activity, url, map, false);
    }

    @SuppressLint("StaticFieldLeak")
    public static RXServiceView instance;

    public static RXServiceView getInstance(Context activity) {
        if (instance == null) {
            instance = new RXServiceView(activity);
        }
        return instance;
    }


    @Override
    public void onClose() {
        super.onClose();
        instance = null;
    }

    public RXServiceView(Context context) {
        super(context);
        showHeader = true;
    }

    @Override
    public void show() {
        super.show();
    }
}
