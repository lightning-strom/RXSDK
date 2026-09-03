package com.ruixue.openapi;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/14
 */
public interface OnClickHandler {
    Map<String, Object> onClick(String tag, Map<String, Object> loginParams);
}
