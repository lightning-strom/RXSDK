package com.ruixue.openapi;

import android.app.Activity;

import com.ruixue.RXJSONCallback;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/6/21
 */
public interface IRXLoginUI extends IRXView {

    boolean showLoginUI(Activity activity, LoginUIConfig loginUIConfig, RXJSONCallback callback);

    boolean showLoginUI(Activity activity, Map<String, Object> map, RXJSONCallback callback);
}
