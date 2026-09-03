package com.ruixue.aliqin;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/12/25
 */
public interface AuthUIClickListener {

    void onClickClose(int code,String msg);

    void onClickOtherLogin( String method, Map<String, Object> map);

}
