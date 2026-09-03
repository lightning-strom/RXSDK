package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.pm.ActivityInfo;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import cn.m4399.operate.OperateCenter;
import cn.m4399.operate.OperateConfig;
import cn.m4399.operate.User;

public class M4399SdkApiImpl extends RXSdkApi {

    private final BillingClient billingClient;
    private final OperateCenter mOpeCenter;
    OnLogoutCallback logoutCallback;

    Map<String, Object> loginMap;
    RXJSONCallback loginCallback;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);

    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);

    }

    @Override
    public void onStop(Activity activity) {
        super.onStop(activity);

    }

    @Override
    public void onDestroy(Activity activity) {
        super.onDestroy(activity);

    }

    static class Single {
        final static M4399SdkApiImpl INSTANCE = new M4399SdkApiImpl();
    }

    protected M4399SdkApiImpl() {
        mOpeCenter = OperateCenter.getInstance();
        billingClient = new M4399BillingImpl();
    }

    @NonNull
    public static M4399SdkApiImpl getInstance() {
        return Single.INSTANCE;
    }


    @Override
    public boolean jumpToAppStore(Activity activity) {
        mOpeCenter.showGameCommentArea(activity);
        return true;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        RXLogger.i("4399 sdk version:" + OperateCenter.getVersion());
        if (!hashMap.containsKey("appid")) {
            RXLogger.e("4399 appid is null error");
            JSONObject jsonObject = RXErrorCode.INIT_PARAMS_ERROR.toJSONObject();
            callback.onFailed(jsonObject);
            RxErrorReportUtil.ThirdInitError.isError = true;
            RxErrorReportUtil.ThirdInitError.thirdName = "4399";
            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
            return;
        }
        int screen_orientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        if (hashMap.containsKey("screen_orientation")) {
            screen_orientation = ObjectUtils.toInt(hashMap.get("screen_orientation"));
        }
        // 初始化选项，传入游戏配置，更多说明见接入文档
        OperateConfig config = new OperateConfig.Builder(activity)
                // 设置调试模式，可选，true时打开，默认false,发布前必须设置为false或删除该行
                .setDebugEnabled(ObjectUtils.toBoolean(hashMap.get("debug")))
                // 设置游戏运营 key，此参数需要在原创开放平台注册应用后得到
                .setGameKey((String) hashMap.get("appid"))
                // 设置SDK页面方向，应与游戏方向一致，部分第三方页面需要在AndroidManifest中设置
                .setOrientation(screen_orientation)
                // 设置悬浮窗风格（3.20+ 仅 ONE/TWO/THREE）
                .setPopLogoStyle(OperateConfig.PopLogoStyle.POPLOGOSTYLE_THREE)
                // 设置悬浮窗初始位置，有四种，分别在屏幕上下左右
                .setPopWinPosition(OperateConfig.PopWinPosition.POS_LEFT)
                // 设置游戏充值是否支持超出金额，true时支持，默认true
                // 也可以每次充值通过 OperateCenter.setSupportExcess 设置
                .setSupportExcess(ObjectUtils.toBoolean(hashMap.get("support_excess")))
                // 设置游戏是否兼在高于Android 9.0版本系统容全面屏，默认不兼容
                .compatNotch(ObjectUtils.toBoolean(hashMap.get("compat_notch"))).build();
        mOpeCenter.setConfig(config);

        // A1: 初始化SDK
        // 此过程中检查当前帐号是否在登录中，只有在init之后， isLogin()返回的状态才可靠
        // 注意：初始化完成后，其他接口才可用
        mOpeCenter.init(activity, new OperateCenter.OnInitGlobalListener() {
            // 执行化结果处理
            @Override
            public void onInitFinished(boolean isLogin, User user) {
                isInited.set(true);
                RXLogger.i("onInitFinished isLogin:" + isLogin);
                if (callback != null) {
                    callback.onSuccess(null);
                }
            }

            /*
             * 注销帐号的回调，游戏一般应在此回到登录场景
             * fromUserCenter 区分是否是从悬浮窗-个人中心("4399游戏助手页面")注销的，若是则为true，不是为false
             */
            @Override
            public void onUserAccountLogout(boolean fromUserCenter) {
                RXLogger.i("onUserAccountLogout fromUserCenter:" + fromUserCenter);
                M4399SdkApiImpl.super.logout(logoutCallback);
            }

            // 个人中心里切换帐号的回调，游戏一般应在此回到选服场景（分区服），或者其他初始场景
            @Override
            public void onSwitchUserAccountFinished(boolean fromUserCenter, User user) {
                RXLogger.i("onSwitchUserAccountFinished fromUserCenter:" + fromUserCenter);
                if (!onSwitchAccount(fromUserCenter ? 0 : 1, new Gson().toJson(user)) && loginMap != null) {
                    login(activity, loginMap, loginCallback == null ? callback : loginCallback);
                }
            }
        });
    }


    @Override
    public void login(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.M4399);
        }
        this.loginMap = hashMap;
        this.loginCallback = callback;
        super.login(activity, hashMap, callback);
    }


    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        callback.onSuccess("");
        return true;
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        mOpeCenter.logout();
        logoutCallback = callback;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        // 游戏退出
        mOpeCenter.shouldQuitGame(activity, new OperateCenter.OnQuitGameListener() {
            @Override
            public void onQuitGame(boolean shouldQuit) {
//                toastAndLog("Agree quit game? " + shouldQuit);
                if (callback != null) {
                    if (shouldQuit) {
                        callback.onExitConfirm("");
                        //                    android.os.Process.killProcess(android.os.Process.myPid());
                    } else {
                        callback.onExitCancel();
                    }
                }
            }
        });
        return true;
    }


    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!mOpeCenter.isLogin()) // 注意：SDK 只是检查当前运行时状态，游戏应该去服务端检查或者每次都调用登录接口
            mOpeCenter.login(activity, new OperateCenter.OnLoginFinishedListener() {
                @Override
                public void onLoginFinished(boolean success, int resultCode, User user) {
                    if (success) {
                        invokeLoginSuccess(user, callback);
                    } else if (resultCode == 1) {
                        callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(resultCode, M4399Config.getErrMsg(resultCode)));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(resultCode, M4399Config.getErrMsg(resultCode)));
                    }
                    RXLogger.i("onLoginFinished" + resultCode);

                }
            });
        else {
            invokeLoginSuccess(mOpeCenter.getCurrentAccount(), callback);
        }
        return true;
    }

    //uid	string	用户id
    //state	string	登录后SDK获取的服务端TOKEN
    //nickname	string	昵称
    private void invokeLoginSuccess(User user, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("uid", user.getUid());
        map.put("state", user.getState());
        map.put("nickname", user.getNick());
        callback.onSuccess(new JSONObject(map));
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("4399").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    /**
     * @param activity 应用 activity
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }

    @Override
    public void share(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.share(activity, hashMap, callback);
    }
}
