package com.ruixue.view;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.IRXView;
import com.ruixue.passport.LoginData;
import com.ruixue.utils.ObjectUtils;

import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/14
 */
public class DeregisterHelper {

    public static IRXView deregisterUI(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        LoginData loginData = RuiXueSdk.getLoginData();
        if (loginData != null && loginData.isDeregistering()) {
            return DeregisterRecallView.create(activity).setLoginContinue(ObjectUtils.toBoolean(map.get("is_login_continue"))).setCallback(callback);
        } else {
            return DeregisterView.create(activity, map).setCallback(callback).setCancelable(true);
        }
    }
}
