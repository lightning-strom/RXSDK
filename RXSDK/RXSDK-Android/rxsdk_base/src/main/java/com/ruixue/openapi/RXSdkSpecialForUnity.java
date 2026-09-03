package com.ruixue.openapi;

import android.app.Activity;

import com.ruixue.RXRequestCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityUICommonFun;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.CaptchaVerifyView;

/**
 * Unity 中 桥接特殊的方法集合类
 * <p>
 * Created by wangliang on 2024/11/5
 */
public class RXSdkSpecialForUnity {

    /**
     * 展示滑块验证码 <br>
     * Note: 该方法只是给 Unity 使用（为了和 iOS 保持一致），瑞雪 SDK 原生请调用 RXSdkUI 中的方法
     *
     * @param activity
     * @param appid
     * @param callback
     */
    public static void showCaptchaVerifyUI(Activity activity, String appid, UnityRXRequestCallback callback) {
        UnityUICommonFun.runOnUINoTurn(activity, () -> showCaptchaVerifyUI(activity, appid, UnityUICommonFun.convertRXUICallback(callback)));
    }

    private static void showCaptchaVerifyUI(Activity activity, String appid, RXRequestCallback callback) {
        int appId = 0;
        try {
            appId = Integer.parseInt(appid);
        } catch (Exception e) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "appid must is number"));
            return;
        }
        new CaptchaVerifyView(activity, null).setAppid(appId).setCallback(callback).show();
    }
}
