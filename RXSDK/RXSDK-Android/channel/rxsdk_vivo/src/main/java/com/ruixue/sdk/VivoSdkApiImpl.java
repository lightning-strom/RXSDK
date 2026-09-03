package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.VivoSdkHelper;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.vivo.unionsdk.open.VivoAccountCallback;
import com.vivo.unionsdk.open.VivoExitCallback;
import com.vivo.unionsdk.open.VivoUnionSDK;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class VivoSdkApiImpl extends RXSdkApi implements VivoAccountCallback {

    private VivoBillingImpl billingClient;
    private AtomicBoolean isInited = new AtomicBoolean(false);
    private RXJSONCallback loginCallback;
    private Map<String, String> loginDataCache;
    private boolean privacyExist = false;
    private boolean isPassPrivacy = false;

    static class Single {
        final static VivoSdkApiImpl INSTANCE = new VivoSdkApiImpl();
    }

    protected VivoSdkApiImpl() {
        billingClient = new VivoBillingImpl();
    }

    public static VivoSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
    }


    @Override
    public void onVivoAccountLogin(String userName, String _uid, String authToken) {
        Log.i("rxsdk", "onVivoAccountLogin success");
        billingClient.setUid(_uid);
        Map<String, String> loginData = new HashMap<>();
        loginData.put("authToken", authToken);
        loginData.put("userName", userName);
        loginData.put("_uid", _uid);
        loginDataCache = loginData;
        if (null != loginCallback) {
            loginCallback.onSuccess(new JSONObject(loginData));
            loginCallback=null;
        } else {
            Log.e("rxsdk", "login callback null error");
        }
    }

    @Override
    public void onVivoAccountLogout(int i) {
        Log.e("rxsdk", "onVivoAccountLogout " + i);
        ruixueLogout(OnLogoutCallback.EMPTY);
    }

    @Override
    public void onVivoAccountLoginCancel() {
        Log.i("rxsdk", "onVivoAccountLoginCancel ");
        if (null != loginCallback) {
            loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_CANCEL));
            loginCallback=null;
        } else {
            Log.e("rxsdk", "login callback null error");
        }
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isInited.get()) {
            Log.e("rxsdk", "please initThirdSdk first");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "error not initialized"));
        } else {
            this.loginCallback = callback;
            VivoSdkHelper.login(activity);
        }
        return true;
    }


    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack) {
        privacyExist = true;
        if (isInited.compareAndSet(false, true)) {
            VivoSdkHelper.onPrivacyAgreed(context);
        }
        super.setPrivacyAgree(context, privacyCallBack);
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        activity.runOnUiThread(() -> {
            try {
                if (isInited.compareAndSet(false, true)) {
                    VivoSdkHelper.onPrivacyAgreed(activity);
                }
                billingClient.init(activity);
                VivoUnionSDK.registerAccountCallback(activity, VivoSdkApiImpl.this);

                if (callback != null)
                    callback.onSuccess(null);

            } catch (Exception | NoClassDefFoundError e) {
                e.printStackTrace();
                RXLogger.e("rx init vivo sdk params error. detail see console log");
                if (callback != null) {
                    JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), e.getMessage());
                    callback.onFailed(jsonObject);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "vivo";
                    RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                }
            }
        });
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.VIVO);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("vivo").setVersion(AppUtils.getAppMetaData(RuiXueSdk.getContext(), "vivo_union_sdk")).build();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName() + "&th_name=need_comment", "com.bbk.appstore");
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        if (isInited.get()) {
            VivoUnionSDK.exit(activity, new VivoExitCallback() {
                @Override
                public void onExitCancel() {
                    if (null != callback) {
                        callback.onExitCancel();
                    }
                }

                @Override
                public void onExitConfirm() {
                    if (null != callback) {
                        callback.onExitConfirm("");
                    }
                }
            });
            return true;
        } else {
            return super.exitApp(activity, callback);
        }
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
