package com.ruixue.openapi;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.kwai.sdk.KwaiSdk;
import com.kwai.sdk.OnLoginResultListener;
import com.kwai.sdk.OnLogoffResultListener;
import com.kwai.sdk.subbus.account.login.bean.AccountModel;
import com.kwai.sdk.subbus.certification.CertificationResultListener;
import com.kwai.sdk.subbus.share.IShareCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLoginCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class KwaiSdkHelper {

    public static void switchLogin(@NonNull OnLoginCallback callback) {
        KwaiSdk.switchLogin(new OnLoginResultListener() {
            @Override
            public void onSuccess(AccountModel accountModel) {
                callback.onSuccess(new Gson().toJson(accountModel));
            }

            @Override
            public void onFail(int i) {
                callback.onFailed(i, "失败", "");
            }
        });
    }

    public static void logoff(@NonNull OnLogoutCallback callback) {
        KwaiSdk.logoff(new OnLogoffResultListener() {
            @Override
            public void onSuccess() {
                callback.onSuccess("");
            }

            @Override
            public void onFail(int i) {
                callback.onFailed(i, "登出失败");
            }
        });

    }

    public static void checkUpgrade() {
        KwaiSdk.checkUpgrade();
    }

    public static void addShareListener(RXJSONCallback callback) {

        KwaiSdk.addShareListener(new IShareCallback() {
            @Override
            public void onSuccess() {
                callback.onSuccess(null);
            }

            public void onPublishSuccess() {
                callback.onSuccess(null);
            }

            @Override
            public void onFail(String s) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), s));
            }
        });
    }

    public static void certification(RXJSONCallback callback) {
        KwaiSdk.certification(new CertificationResultListener() {
            @Override
            public void onSuccess() {
                callback.onSuccess(null);
            }

            @Override
            public void onFailed(int i, String s) {
                callback.onFailed(JSONUtil.toJSONObject(i, s));
            }
        });
    }

}
