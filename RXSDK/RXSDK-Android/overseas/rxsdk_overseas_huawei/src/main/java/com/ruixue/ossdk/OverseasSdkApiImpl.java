package com.ruixue.ossdk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.agconnect.common.network.AccessNetworkManager;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXException;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

public class OverseasSdkApiImpl extends RXSdkApi {

    private final String[] PLUGIN_NAME = new String[]{"RX_PLUGIN_FACEBOOK", "RX_PLUGIN_FIREBASE", "RX_PLUGIN_LINE", "RX_PLUGIN_ADJUST", "RX_PLUGIN_ZALO", "RX_PLUGIN_TIKTOK", "RX_PLUGIN_SNAPCHAT", "RX_PLUGIN_INSTAGRAM"};

    static class Single {
        final static OverseasSdkApiImpl INSTANCE = new OverseasSdkApiImpl();
    }

    String method;

    protected OverseasSdkApiImpl() {
        registerPlugin(HmsOSSdkWrapper.getInstance());
        registerPlugin(GoogleLoginWrapper.getInstance());
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.huawei.appmarket");
    }

    @NonNull
    public static OverseasSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
    }

    @Override
    public void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback) {
        if (isAgree) {
            AccessNetworkManager.getInstance().setAccessNetwork(true);
        }
        super.setPrivacyAgree(context, isAgree, privacyCallback);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("hwjos").setState(1).setVersion(RuiXueSdk.getSdkVersion()).setPlugins(getPlugins().keySet().toString()).build();
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
    }

    @Override
    public void login(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        if (!map.containsKey(KEY_LOGIN_METHOD)) {
            map.put(KEY_LOGIN_METHOD, LoginMethod.HWJOS);
        }
        super.login(activity, map, callback);
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        boolean isSupport = GoogleLoginWrapper.getInstance().doLogin(activity, hashMap, callback);
        if (!isSupport) {
            isSupport =  HmsOSSdkWrapper.getInstance().doLogin(activity, hashMap, callback);
        }
        String method = (String) hashMap.get("method");
        this.method = method;
        if (!isSupport && !TextUtils.isEmpty(method)) {
            IPluginSdk thirdSdk = getPlugins().get(method);
            if (thirdSdk != null) {
                isSupport = thirdSdk.doLogin(activity, hashMap, callback);
            } else {
                callback.onError(new RXException("Login method is abnormal."));
            }
        }
        return isSupport;
    }

    @Override
    public boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        if (method != null) {
            IPluginSdk thirdSdk = getPlugins().get(method);
            if (thirdSdk != null) {
                return thirdSdk.doLogout(RuiXueSdk.getCurrentActivity(), callback);
            }
        }
        return false;
    }

    protected Throwable getTargetException(Exception e) {
        if (e instanceof InvocationTargetException) {
            return ((InvocationTargetException) e).getTargetException();// 获取目标异常
        }
        return e;
    }

    protected void printStackTrack(Exception e) {
        getTargetException(e).printStackTrace();
    }

    public Class<?> getClass(String package_class_name) {
        Class<?> currentClass = null;
        if (!TextUtils.isEmpty(package_class_name)) {
            try {
                currentClass = Class.forName(package_class_name);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return currentClass;
    }


    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        HmsOSSdkWrapper.getInstance().doPay(activity, hashMap, callback);
    }
}
