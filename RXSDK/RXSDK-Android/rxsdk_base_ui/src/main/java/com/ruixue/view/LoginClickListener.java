package com.ruixue.view;

import com.ruixue.openapi.RXView;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/19
 */
public interface LoginClickListener {

    void onLoginClick(RXView context, String method, int loginTag, Map<String, Object> loginMap);
}
