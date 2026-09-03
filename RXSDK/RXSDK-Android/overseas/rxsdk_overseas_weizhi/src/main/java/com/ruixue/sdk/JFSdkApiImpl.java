package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.jfsdk.billing.JFBillingClient;
import com.jfsdk.billing.utils.UniqueStringListManager;
import com.juefeng.sdk.juefengsdk.services.bean.CreatOrderInfo;
import com.juefeng.sdk.juefengsdk.services.bean.JfRoleInfo;
import com.juefeng.sdk.juefengsdk.services.bean.LogincallBack;
import com.juefeng.sdk.juefengsdk.services.bean.PayFaildInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginParams;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.Application;
import android.content.res.Configuration;

import com.juefeng.sdk.juefengsdk.JFSDK;
import com.juefeng.sdk.juefengsdk.interf.SDKEventListener;
import com.juefeng.sdk.juefengsdk.services.bean.LoginErrorMsg;
import com.juefeng.sdk.juefengsdk.services.bean.PaySuccessInfo;

import org.json.JSONObject;

public class JFSdkApiImpl extends RXSdkApi {
    JFBillingImpl billing;

    private final String[] PLUGIN_NAME = new String[]{"RX_PLUGIN_FACEBOOK", "RX_PLUGIN_GOOGLE", "RX_PLUGIN_FIREBASE", "RX_PLUGIN_LINE", "RX_PLUGIN_ADJUST", "RX_PLUGIN_ZALO", "RX_PLUGIN_TIKTOK", "RX_PLUGIN_SNAPCHAT", "RX_PLUGIN_INSTAGRAM", "RX_PLUGIN_REDDIT", "RX_PLUGIN_TOPON"};

    static class Single {
        final static JFSdkApiImpl INSTANCE = new JFSdkApiImpl();
    }

    private OverseasLoginParams mLoginObj;

    protected JFSdkApiImpl() {
        billing = new JFBillingImpl();
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.android.vending");
    }


    RXJSONCallback initCallback;
    RXJSONCallback loginCallback;
    SDKEventListener mSDKEventListener = new SDKEventListener() {
        @Override
        //{"jfUserId":"绝峰userId", "userName":"", "token":"","channelUserId":"下游渠道
        public void onLoginSuccess(LogincallBack logincallBack) {
            if (null != loginCallback) {
                Map<String, Object> map = new HashMap<>();
                map.put("mem_id", logincallBack.getJfUserId());
                map.put("user_token", logincallBack.getToken());
//                map.put("userName", logincallBack.getUserName());
//                map.put("channelUserId", logincallBack.getChannelUserId());

                loginCallback.onSuccess(new JSONObject(map));
                loginCallback = null;
            }
        }

        @Override
        public void onLoginFailed(LoginErrorMsg loginErrorMsg) {
            if (null != loginCallback) {
                loginCallback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(loginErrorMsg.getCode(), loginErrorMsg.getErrorMsg()));
                loginCallback = null;
            }
        }

        @Override
        public void onInitSuccess(String desc, boolean isAutoLogin) {
            if (null != initCallback) {
                initCallback.onSuccess(null);
                initCallback = null;
            }

        }

        @Override
        public void onInitFaild(String s) {
            if (null != initCallback) {
                initCallback.onFailed(RXErrorCode.INIT_ERROR.toJSONObject(-1, s));
                initCallback = null;
            }

        }

        @Override
        public void onPaySuccessCallback(PaySuccessInfo paySuccessInfo) {
            billing.onPaySuccessCallback(paySuccessInfo);
        }

        @Override
        public void onPayFaildCallback(PayFaildInfo payFaildInfo) {
            billing.onPayFaildCallback(payFaildInfo);
        }

        @Override
        public void onExit(String s) {

        }

        @Override
        public void onCancleExit(String s) {

        }

        @Override
        public void onCreatedOrder(CreatOrderInfo creatOrderInfo) {

        }

        @Override
        public void onLogoutLogin() {

        }

        @Override
        public void onSwitchAccountSuccess(LogincallBack logincallBack) {

        }

        @Override
        public void onGameSwitchAccount() {

        }

        @Override
        public void onSyncSuccess() {

        }

        @Override
        public void onSyncFailure(String s) {

        }
    };

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        initCallback = callback;
        JFSDK.getInstance().init(activity, mSDKEventListener);
    }

    @NonNull
    public static JFSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    public static final String Name = "weizhi";

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName(Name).setState(1).setVersion(RuiXueSdk.getSdkVersion()).setPlugins(getPlugins().keySet().toString()).build();
    }


    //  value=2: GAME_LOGIN
//  value=1 ：JUEFENG_LOGIN
//<meta-data android:name="JF_LOGIN_TYPE" android:value="1"/>
    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        loginCallback = callback;
        boolean isSupport = false;
        mLoginObj = OverseasLoginParams.fromMap(hashMap);
        com.juefeng.sdk.juefengsdk.services.bean.LoginType loginType = JFSDK.getInstance().getLoginType();
        if (Name.equals(mLoginObj.getMethod()) && com.juefeng.sdk.juefengsdk.services.bean.LoginType.JUEFENG_LOGIN.equals(loginType)) {
            JFSDK.getInstance().doLogin(activity);
        } else {
            IPluginSdk thirdSdk = getPlugins().get(mLoginObj.getMethod());
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
        if (mLoginObj != null) {
            IPluginSdk thirdSdk = getPlugins().get(mLoginObj.getMethod());
            if (thirdSdk != null) {
                return thirdSdk.doLogout(RuiXueSdk.getCurrentActivity(), callback);
            }
        }

        return false;
    }

    @Override
    public void ruixueLogin(Map<String, Object> map, RXJSONCallback callback) {
        com.juefeng.sdk.juefengsdk.services.bean.LoginType loginType = JFSDK.getInstance().getLoginType();
        if (com.juefeng.sdk.juefengsdk.services.bean.LoginType.GAME_LOGIN.equals(loginType)) {
            super.ruixueLogin(map, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data == null) {
                        if (callback != null) {
                            callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(-1, "Login data is null"));
                        }
                    } else {
                        LoginData loginData = LoginData.fromJson(data.toString());
                        JFSDK.getInstance().syncUserId(loginData.getOpenid(), loginData.getAccessToken().getAccess());
                        loginCallback = callback;
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (callback != null) {
                        callback.onFailed(cause);
                    }
                }
            });
        } else {
            super.ruixueLogin(map, callback);
        }

    }

    @Override
    public void onLoginResp(int code) {
        super.onLoginResp(code);
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        JFSDK.getInstance().logoutLogin(RuiXueSdk.getCurrentActivity());
        super.logout(callback);
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        JFSDK.getInstance().exitLogin(activity);
        return super.exitApp(activity, callback);
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

    public boolean getProductInfo(Activity activity, List<String> skusList, RXStringCallback callback) {
        if (activity == null || skusList == null || skusList.isEmpty() || callback == null) {

            if (callback != null) {
                callback.onError(new RXException(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "Invalid parameters: activity, skusList or callback is null/empty"));
            }
            return false;
        }

        UniqueStringListManager manager = new UniqueStringListManager();
        for (String sku : skusList) {
            manager.addElement(sku);
        }
        List<String> finalList = manager.getFinalList();
        if (finalList.isEmpty()) {
            callback.onError(new RXException(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "Final SKU list is empty"));
            return false;
        }

        // 调用计费客户端查询产品详情
        JFBillingClient.getInstance().queryProductDetailsAsync(activity, finalList, productDetailsList -> {
            if (productDetailsList == null || productDetailsList.isEmpty()) {
                // 无产品信息时回调错误
                callback.onError(new RXException(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "No product details found"));
                return;
            }

            callback.onSuccess(new Gson().toJson(productDetailsList));
        });
        return true;
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(BillingClient.KEY_HQ_TYPE)) {
            hashMap.put(BillingClient.KEY_HQ_TYPE, Name);
        }
        billing.pay(activity, hashMap, callback);
    }

    @Override
    public void setGameInfo(GameInfo gameInfo) {
        JfRoleInfo jfRoleInfo = new JfRoleInfo();
        jfRoleInfo.setServerName(gameInfo.getServerName());
        jfRoleInfo.setServerId(gameInfo.getServerId());
        jfRoleInfo.setRoleName(gameInfo.getRoleName());
        jfRoleInfo.setRoleId(gameInfo.getRoleId());
        jfRoleInfo.setGameRoleLevel(gameInfo.getGameRoleLevel());
        jfRoleInfo.setType(String.valueOf(gameInfo.Type()));
        // 2. 条件字段映射（如角色创建时间仅在type=1时需要）
        if (gameInfo.Type() == 1) {
            jfRoleInfo.setRoleCreateTime(gameInfo.getRoleCreateTime());
        }
        // 3. 可选字段映射
        jfRoleInfo.setPartyId(gameInfo.getPartyId());
        jfRoleInfo.setPartyName(gameInfo.getPartyName());
        jfRoleInfo.setAttach(gameInfo.getAttach());
        jfRoleInfo.setExperience(gameInfo.getExperience());
        jfRoleInfo.setVipLevel(gameInfo.getVipLevel());
        jfRoleInfo.setGameRolePower(gameInfo.getGameRolePower());
        JFSDK.getInstance().syncInfo(jfRoleInfo);
        billing.setJfRoleInfo(jfRoleInfo);
        super.setGameInfo(gameInfo);
    }

    @Override
    public void onApplicationCreate(Application application) {
        JFSDK.getInstance().applicationOnCreate(application);
        super.onApplicationCreate(application);
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        JFSDK.getInstance().onCreate(activity, savedInstanceState);
        super.onCreate(activity, savedInstanceState);

    }

    @Override
    public void onStart(Activity activity) {
        JFSDK.getInstance().onStart(activity);
    }

    @Override
    public void onRestart(Activity activity) {
        JFSDK.getInstance().onRestart(activity);

    }

    @Override
    public void onResume(Activity activity) {
        JFSDK.getInstance().onResume(activity);
    }

    @Override
    public void onPause(Activity activity) {
        JFSDK.getInstance().onPause(activity);

    }

    @Override
    public void onStop(Activity activity) {
        JFSDK.getInstance().onStop(activity);

    }

    @Override
    public void onDestroy(Activity activity) {
        JFSDK.getInstance().onDestroy(activity);
    }

    @Override
    public void onBackPressed() {
        JFSDK.getInstance().onBackPressed(RuiXueSdk.getCurrentActivity());
    }

    @Override
    public void onNewIntent(Activity activity, Intent intent) {
        JFSDK.getInstance().onNewIntent(activity, intent);

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        JFSDK.getInstance().onActivityResult(activity, requestCode, resultCode, data);
        super.onActivityResult(activity, requestCode, resultCode, data);

    }

    @Override
    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        JFSDK.getInstance().onRequestPermissionsResult(activity, requestCode, permissions, grantResults);

    }

    @Override
    public void onConfigurationChanged(Activity activity, Configuration newConfig) {
        JFSDK.getInstance().onConfigurationChanged(activity.getApplication(), newConfig);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        JFSDK.getInstance().onWindowFocusChanged(hasFocus);

    }
}
