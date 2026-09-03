package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.text.TextUtils;

import com.ruixue.RuiXueSdk;
import com.ruixue.passport.LoginData;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/3
 */
public class RXH5View extends RXWebView {

//    海外：
///oversea/bindemail   /oversea/changeemail 邮箱绑定换绑
///oversea/bindphone  /oversea/changephone 手机号绑定换绑
//国内：
///user/bindphone  /user/changephone 手机号绑定换绑

    public enum H5ViewType {
        BindEmail, BindPhone, ChangeEmail, ChangePhone
    }

    static Map<H5ViewType, String> map = new HashMap<>();

    static {

        boolean isOs = RuiXueSdk.isOasVersion();
        map.put(H5ViewType.BindPhone, isOs ? "oversea/changephone" : "user/changephone");
        map.put(H5ViewType.ChangePhone, isOs ? "oversea/changephone" : "user/changephone");
        map.put(H5ViewType.BindEmail, "oversea/changeemail");
        map.put(H5ViewType.ChangeEmail, "oversea/changeemail");
    }


    public static RXH5View create(Context activity, H5ViewType type) {

//        LoginData loginData = RuiXueSdk.getLoginData();
//        if (H5ViewType.BindPhone == type && loginData != null && loginData.isBindPhone()) {
//            type = H5ViewType.ChangePhone;
//        } else if (H5ViewType.BindEmail == type && loginData != null && loginData.isBindEmail()) {
//            type = H5ViewType.ChangeEmail;
//        }
        String url = RuiXueSdk.getFirstBaseUrl() +"static/passport/#/"+ map.get(type);
        return create(activity, url, new HashMap<>());
    }


    public static RXH5View create(Context activity, String url, Map<String, Object> map) {
        RXH5View rxServiceView = getInstance(activity);
        if (TextUtils.isEmpty(rxServiceView.getUrl()) || !rxServiceView.getUrl().equals(url)) {
            rxServiceView.loadUrl(url);
        }
        return rxServiceView;
    }


    @SuppressLint("StaticFieldLeak")
    public static RXH5View instance;

    public static RXH5View getInstance(Context activity) {
        if (instance == null) {
            instance = new RXH5View(activity);
        }
        return instance;
    }


    public RXH5View(Context context) {
        super(context);
    }

    @Override
    public void show() {
        super.show();
    }
}
