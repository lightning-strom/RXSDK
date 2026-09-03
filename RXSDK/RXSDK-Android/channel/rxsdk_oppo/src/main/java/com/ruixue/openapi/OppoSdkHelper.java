package com.ruixue.openapi;

import com.google.gson.JsonSyntaxException;
import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.sdk.OppoBean;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class OppoSdkHelper {

    public static void doGetTokenAndSsoid(RXJSONCallback callback) {
        GameCenterSDK.getInstance().doGetTokenAndSsoid(new ApiCallback() {
            @Override
            public void onSuccess(String resultMsg) {
                try {
                    JSONObject jsonObject = OppoBean.fromJson(resultMsg).toJSONObject();
                    callback.onSuccess(jsonObject);
                } catch (NullPointerException | JsonSyntaxException | ClassCastException e) {
                    callback.onError(new RXException(e));
                }
            }

            @Override
            public void onFailure(String content, int resultCode) {
                RXLogger.i("ssoid onFailure", content);
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(resultCode, content));
            }
        });
    }

    public static void checkPayResult(String order, RXStringCallback callback) {
        GameCenterSDK.getInstance().checkPayResult(order, new ApiCallback() {
            @Override
            public void onSuccess(String s) {
                callback.onSuccess(s);
            }

            @Override
            public void onFailure(String s, int i) {
                callback.onFailed(i,s,"");
            }
        });
    }
}
