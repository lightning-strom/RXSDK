package com.ruixue.sdk;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.qooapp.opensdk.QooAppOpenSDK;
import com.qooapp.opensdk.common.QooAppCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class QooSdkApiImpl extends RXSdkApi {

    private final String TAG = "QooSdkApiImpl";

    private final QoobillingImpl mLDBillingImpl;

    static class Single {
        final static QooSdkApiImpl INSTANCE = new QooSdkApiImpl();
    }

    private QooSdkApiImpl mLoginObj;

    protected QooSdkApiImpl() {
        mLDBillingImpl = new QoobillingImpl();
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder()
                .setName("qoo")
                .setState(1)
                .setVersion(RuiXueSdk.getSdkVersion())
                .build();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        QooSdkHelper.openGameDetail(activity);
        return true;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
//        super.initThirdSdk(activity, map, callback);
        QooAppOpenSDK.initialize(new QooAppCallback() {
            @Override
            public void onSuccess(String response) {
                Log.d(TAG, "Qoo初始化成功：" + response);
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    response)
                    );
                }
            }

            @Override
            public void onError(String error) {
                Log.d(TAG, "Qoo初始化失败：" + error);
                if (callback != null) {
                    JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), error);
                    callback.onFailed(jsonObject);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "qoo";
                    RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                }
            }
        }, activity);

    }

    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.QOO);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {

        boolean forbidVisitor = false;
        try {
            if (map != null && map.get("forbid_visitor") != null) {
                forbidVisitor = (boolean) map.get("forbid_visitor");
            }
        } catch (Exception e) {
        }

        Log.d(TAG, "thirdLogin forbidVisitor ：" + forbidVisitor);

        QooAppOpenSDK.getInstance().login(new QooAppCallback() {
            @Override
            public void onSuccess(String response) {
                if (callback != null) {

                    Log.d(TAG, "Qoo login success: " + response);

                    try {
                        Map<String, String> hashMap = new HashMap<>();
                        hashMap.put("data", JSONUtil.toJSONObject(response).optString("data"));
                        hashMap.put("signature", JSONUtil.toJSONObject(response).optString("signature"));

                        Log.d(TAG, "执行 瑞雪登录。。。");

                        callback.onSuccess(new JSONObject(hashMap));

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onError(String s) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    s)
                    );
                }
            }
        }, activity, forbidVisitor);
        return true;
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> map, RXJSONCallback callback) {
        mLDBillingImpl.pay(activity, map, callback);
    }


    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {

        QooAppOpenSDK.logout(new QooAppCallback() {

            @Override
            public void onSuccess(String response) {
                callback.onSuccess(response);
            }


            @Override
            public void onError(String error) {
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), error);
            }

        }, RXGlobalData.getContext());

        return true;
    }
}
