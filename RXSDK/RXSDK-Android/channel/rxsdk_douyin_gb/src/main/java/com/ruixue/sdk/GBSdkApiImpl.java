package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bytedance.ttgame.tob.common.host.api.GBCommonSDK;
import com.bytedance.ttgame.tob.common.host.api.callback.InitCallback;
import com.bytedance.ttgame.tob.optional.union.api.account.IAccountCallback;
import com.bytedance.ttgame.tob.optional.union.api.account.ILogoutCallback;
import com.bytedance.ttgame.tob.optional.union.api.account.UserInfoResult;
import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.GBSdkHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;


/**
 * https://game.open.douyin.com/platform/doc/8820
 */
public class GBSdkApiImpl extends RXSdkApi implements ILogoutCallback {

    private final GBBillingImpl billingClient;
    public static final int LOGIN_CANCEL = -100030;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    static class Single {
        final static GBSdkApiImpl INSTANCE = new GBSdkApiImpl();
    }

    protected GBSdkApiImpl() {
        billingClient = new GBBillingImpl();
    }

    @NonNull
    public static GBSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }


    public boolean IsInited() {
        return isInited.get();
    }

    @Override
    public void attachBaseContext(Context context) {
        super.attachBaseContext(context);
//        GBCommonSDK.attachBaseContext(context);
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        GBCommonSDK.onCreate(application);
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
        GBCommonSDK.setGameActivity(activity);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("douyin").setVersion(RuiXueSdk.getSdkVersion()).build();
    }


    /**
     * @param activity activity
     * @param hashMap  hashMap
     * @param callback callback
     */
    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        synchronized (activity) {
            activity.runOnUiThread(() -> GBCommonSDK.init(activity, new InitCallback() {
                @Override
                public void onSuccess() {
                    RXLogger.i("gbsdk init success");
                    isInited.set(true);
                    //6.2 支付成功全局监听
                    //SDK悬浮球内支持对部分历史订单进行支付，对这部分订单可以设置全局的监听，收到监听结果后及时给用户发货，更新游戏界面，优化用户体验。
                    GBSdkHelper.setPaySuccessListener(billingClient);
                    GBSdkHelper.setLogoutCallback(GBSdkApiImpl.this);
                    if (callback != null) {
                        callback.onSuccess(null);
                    }
                }

                /**
                 * @param errorCode -1	未知错误	一般是接入错误，和技术同学沟通
                 *                  -2	preInit失败	一般是接入错误，和技术同学沟通
                 *                  -3	init失败	一般是接入错误，和技术同学沟通
                 * @param errorMsg  errorMsg
                 */
                @Override
                public void onFailed(int errorCode, String errorMsg) {
                    RXLogger.i("gbsdk init failed code:" + errorMsg + " ,msg:" + errorMsg);
                    isInited.set(false);
                    JSONObject jsonObject = RXErrorCode.THIRD_INIT_ERROR.toJSONObject(errorCode, errorMsg);
                    callback.onFailed(jsonObject);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "douyin";
                    RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                }
            }));
        }
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.DOUYIN);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isInited.get()) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR));
        } else {
            GBSdkHelper.login(activity, new IAccountCallback<UserInfoResult>() {
                @Override
                public void onSuccess(@Nullable UserInfoResult userInfoResult) {
                    //获取用户token、extraData（isGuest是否游客、userType用户类型）
                    //接入方根据token,交给游戏服务端并与聚合sdk服务器进行交互获取sdk_open_id，
                    //verifyGameUser(userInfoResult);
                    if (null != userInfoResult) {
                        RXLogger.i("thirdLogin onSuccess" + new Gson().toJson(userInfoResult));
                        String token = userInfoResult.data.getToken();

                        billingClient.setOpenId(token);
                        Map<String, String> extMap = new HashMap<>();
//                        extMap.put("isNewUser", userInfoResult.data.getExtraData().getAvatarUrl());
//                        extMap.put("userId", userInfoResult.data.getExtraData().getAvatarUrl());
//                        extMap.put("nickname", userInfoResult.data.getExtraData().getNickname());
//                        extMap.put("avatarUrl", userInfoResult.data.getExtraData().getAvatarUrl());
                        extMap.put("access_token", token);
                        callback.onSuccess(new JSONObject(extMap));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(-1, "gb userInfoResult null error"));
                    }
                }

                @Override
                public void onFailed(@Nullable UserInfoResult userInfoResult) {
                    //获取token失败
                    if (null != userInfoResult) {
                        if (userInfoResult.code == LOGIN_CANCEL) {
                            callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(userInfoResult.code, userInfoResult.message));
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(userInfoResult.code, userInfoResult.message));
                        }
                    } else {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR));
                    }
                }
            });
        }
        return true;
    }


    @Override
    public void onLogout() {
        ruixueLogout(null);
        RXLogger.i("GB onLogout");
    }

    @Override
    public boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        GBSdkHelper.logout(RuiXueSdk.getCurrentActivity(), new IAccountCallback<UserInfoResult>() {
            @Override
            public void onSuccess(@Nullable UserInfoResult result) {
                callback.onSuccess("");
            }

            @Override
            public void onFailed(@Nullable UserInfoResult result) {
                if (result == null) {
                    callback.onFailed(-1, "登出失败");
                } else {
                    callback.onFailed(result.code, result.message);
                }
            }
        });
        return true;
    }


    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
