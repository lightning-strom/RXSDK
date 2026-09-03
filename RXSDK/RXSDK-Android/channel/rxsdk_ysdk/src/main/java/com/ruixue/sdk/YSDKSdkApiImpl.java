package com.ruixue.sdk;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.BitmapDrawable;
import android.util.SparseArray;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.PopupWindow;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.ysdk.R;
import com.tencent.smtt.sdk.WebSettings;
import com.tencent.smtt.sdk.WebView;
import com.tencent.smtt.sdk.WebViewClient;
import com.tencent.ysdk.api.YSDKApi;
import com.tencent.ysdk.framework.common.BaseRet;
import com.tencent.ysdk.framework.common.eFlag;
import com.tencent.ysdk.framework.common.ePlatform;
import com.tencent.ysdk.framework.login.IYsdkLoginCallback;
import com.tencent.ysdk.framework.login.IYsdkLoginController;
import com.tencent.ysdk.framework.login.YsdkLoginConfig;
import com.tencent.ysdk.module.antiaddiction.listener.AntiAddictListener;
import com.tencent.ysdk.module.antiaddiction.model.AntiAddictRet;
import com.tencent.ysdk.module.user.PersonInfo;
import com.tencent.ysdk.module.user.UserListener;
import com.tencent.ysdk.module.user.UserLoginRet;
import com.tencent.ysdk.module.user.UserRelationRet;
import com.tencent.ysdk.module.user.WakeupRet;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class YSDKSdkApiImpl extends RXSdkApi implements UserListener, AntiAddictListener {

    private final YSDKBillingImpl billingClient;
    private RXJSONCallback loginCallback;
    private AntiAddictDelegate antiAddictDelegate;
    // 防沉迷指令执行状态
    public static boolean mAntiAddictExecuteState = false;

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.tencent.andROId.QQdownloader");
    }

    private final AtomicBoolean isInited = new AtomicBoolean(false);

    protected Context getContext() {
        return RuiXueSdk.getContext();
    }

    private static final SparseArray<String> PLATFORM_STR = new SparseArray<String>() {
        {
            put(ePlatform.PLATFORM_ID_QQ, "QQ");
            put(ePlatform.PLATFORM_ID_WX, "微信");
        }
    };

    private void onLoginSuccess(UserLoginRet ret) {
        YSDKApi.getLoginRecord(ret);
        RXLogger.i("eFlag.Succ", ret.toString());
        if (ret.getLoginType() != UserLoginRet.LOGIN_TYPE_TIMER) {
            //定时登录，不需要设置防沉迷统计开始
            YSDKApi.setAntiAddictGameStart();
        }
        billingClient.setUserLoginRet(ret);

        int platform = ret.platform;
        String from = ePlatform.getEnum(platform).platformStr();
        if (platform == ePlatform.PLATFORM_ID_QQ) {
            from = "qq";
        } else if (platform == ePlatform.PLATFORM_ID_WX) {
            from = "wechat";
        }
        String accessToken = ret.getAccessToken();
        String openid = ret.open_id;

//        String payToken = ret.getPayToken();
//        int flag = ret.flag;
//        String msg = ret.msg;
//        String pf = ret.pf;
//        String pf_key = ret.pf_key;

        Map<String, String> hashMap = new HashMap<>();
        hashMap.put("nickname", ret.nick_name);
        hashMap.put("openid", openid);
        hashMap.put("from", from);

        hashMap.put("accessToken", accessToken);

//          hashMap.put("avatar", ret.);
        //true即为游客模式  false既非游客模式
        if (YSDKApi.isVisitorState()) {
            hashMap.put("isvisitorstate", Boolean.toString(true));
        } else {
            hashMap.put("isvisitorstate", Boolean.toString(false));
        }
        if (null != this.loginCallback) {
            this.loginCallback.onSuccess(new JSONObject(hashMap));
        }
    }


    /**
     * @param ret flag {@link eFlag}
     */
    @Override
    public void OnLoginNotify(UserLoginRet ret) {
        RXLogger.d("OnWakeupNotify=========");
        if (ret.ret == BaseRet.RET_SUCC) {
            onLoginSuccess(ret);
        } else {
            RXLogger.e("OnLoginNotify " + ret);
            if (this.loginCallback != null) {
                this.loginCallback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(ret.flag, ret.msg + " code:" + ret.errorCode));
            }
            YSDKApi.logout();
        }
    }

    @Override
    public void OnWakeupNotify(WakeupRet ret) {
        RXLogger.d("OnWakeupNotify=======");
        if (eFlag.Wakeup_YSDKLogining == ret.flag) {
            // 用拉起的账号登录，登录结果在OnLoginNotify()中回调
        } else if (ret.flag == eFlag.Wakeup_NeedUserSelectAccount) {
            // 异账号时，游戏需要弹出提示框让用户选择需要登录的账号
            RXLogger.d("OnWakeupNotify diff account");
//                    mainActivity.showDiffLogin();
        } else if (ret.flag == eFlag.Wakeup_NeedUserLogin) {
            // 没有有效的票据，登出游戏让用户重新登录
            YSDKApi.logout();
        } else {
            YSDKApi.logout();
        }
    }

    @Override
    public void OnRelationNotify(UserRelationRet relationRet) {
        String result = "";
        result = result + "flag:" + relationRet.flag + "\n";
        result = result + "msg:" + relationRet.msg + "\n";
        result = result + "platform:" + relationRet.platform + "\n";
        if (relationRet.persons != null && relationRet.persons.size() > 0) {
            PersonInfo personInfo = (PersonInfo) relationRet.persons.firstElement();
            String builder = "UserInfoResponse json: \n" + "nick_name: " + personInfo.nickName + "\n" + "open_id: " + personInfo.openId + "\n" + "userId: " + personInfo.userId + "\n" + "gender: " + personInfo.gender + "\n" + "picture_small: " + personInfo.pictureSmall + "\n" + "picture_middle: " + personInfo.pictureMiddle + "\n" + "picture_large: " + personInfo.pictureLarge + "\n" + "provice: " + personInfo.province + "\n" + "city: " + personInfo.city + "\n" + "country: " + personInfo.country + "\n";
            result = result + builder;
        } else {
            result = result + "relationRet.persons is bad";
        }
        RXLogger.d("OnRelationNotify OnRelationNotify" + result);
    }


    /**
     * 防沉迷通知
     */
    @SuppressLint("SetJavaScriptEnabled")
    public void onAntiAddictLimitNotify(AntiAddictRet ret) {
        if (AntiAddictRet.RET_SUCC == ret.ret) {
            final int modal = ret.modal;
            if (ret.type == AntiAddictRet.TYPE_TIPS || ret.type == AntiAddictRet.TYPE_LOGOUT) {
                // 防沉迷指令-弹窗提示 // 防沉迷指令-强制下线
                if (!mAntiAddictExecuteState) {
                    mAntiAddictExecuteState = true;
                    AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                    builder.setTitle(ret.title);
                    builder.setMessage(ret.content);
                    builder.setPositiveButton("知道了", (dialog, whichButton) -> {
                        if (modal == 1) {
                            // 根据modal字段来判断是否需要强制用户下线
                            // 强制用户下线
                            doLogout();
                        }
                        mAntiAddictExecuteState = (false);
                    });
                    builder.setCancelable(false);
                    builder.show();
                    // 已执行指令
                    YSDKApi.reportAntiAddictExecute(ret, System.currentTimeMillis());

                }
            } else if (ret.type == AntiAddictRet.TYPE_OPEN_URL) {
                // 防沉迷指令-打开指定的web页面
                if (!mAntiAddictExecuteState) {
                    mAntiAddictExecuteState = true;
                    View popwindowView = View.inflate(getContext(), R.layout.pop_window_web_layout, null);
                    WebView webView = popwindowView.findViewById(R.id.pop_window_webview);
                    Button closeButton = popwindowView.findViewById(R.id.pop_window_close);

                    WebSettings settings = webView.getSettings();
                    settings.setJavaScriptEnabled(true);
                    webView.setWebViewClient(new WebViewClient());
                    webView.loadUrl(ret.url);

                    final PopupWindow popupWindow = new PopupWindow(popwindowView, 1000, 1000);
                    popupWindow.setTouchable(true);
                    popupWindow.setOutsideTouchable(false);
                    popupWindow.setBackgroundDrawable(new BitmapDrawable());

                    closeButton.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if (modal == 1) {
                                doLogout();
                            }
                            popupWindow.dismiss();
                            mAntiAddictExecuteState = (false);
                        }
                    });

                    popupWindow.showAtLocation(popwindowView, Gravity.CENTER, 0, 0);
                    // 已执行指令
                    YSDKApi.reportAntiAddictExecute(ret, System.currentTimeMillis());
                    if (this.antiAddictDelegate != null)
                        this.antiAddictDelegate.didAddictInfoUpdate(new Gson().toJson(ret));
                }
            }
        }
    }

    public void doLogout() {
        YSDKApi.logout();
    }

    @Override
    public void onLoginLimitNotify(AntiAddictRet ret) {
        onAntiAddictLimitNotify(ret);
    }

    @Override
    public void onTimeLimitNotify(AntiAddictRet ret) {
        onAntiAddictLimitNotify(ret);
    }

    static class Single {
        final static YSDKSdkApiImpl INSTANCE = new YSDKSdkApiImpl();
    }

    protected YSDKSdkApiImpl() {
        billingClient = new YSDKBillingImpl();
    }

    @NonNull
    public static YSDKSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        YSDKApi.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("ysdk").setVersion(YSDKApiHelper.getSDKVersion()).setExt("ysdk_channel=" + YSDKApiHelper.getChannelId()).build();
    }

    @Override
    public void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate) {
        this.antiAddictDelegate = antiAddictDelegate;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (isInited.compareAndSet(false, true)) {
            YSDKApi.init();
            YSDKApi.start();
            YSDKApi.setUserListener(this);
            YSDKApi.setAntiAddictListener(this);
        }
        if (callback != null) {
            callback.onSuccess(null);
        }
        //        YSDKApi.autoLogin();
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.YSDK);
        }
        super.login(activity, hashMap, callback);
    }

    private boolean isNeedShowLoginUi = false;

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isInited.get()) {
            RXLogger.e("error: sdk not init, please call initThirdSdk first");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR));
        } else if (hashMap.containsKey("ysdk_login_type") && RXYsdkConstant.YSDK_LOGIN_TYPE_UI.equals(ObjectUtils.toString(hashMap.get("ysdk_login_type")))) {
            ysdkLoginUI(activity, hashMap, callback);
        } else if (hashMap.containsKey("platform_type")) {
            ePlatform loginType = ePlatform.getEnum(ObjectUtils.toInt(hashMap.get("platform_type")));
            if (loginType != ePlatform.None) {
                if (YSDKApi.isPlatformInstalled(loginType)) {
                    this.loginCallback = callback;
                    isNeedShowLoginUi = false;
                    YSDKApi.login(loginType);
                    return true;
                } else {
                    String tips = PLATFORM_STR.indexOfKey(loginType.val()) > 0 ? PLATFORM_STR.get(loginType.val()) : loginType.platformStr();
                    String msg = "请先安装 " + tips;
//                    Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show();
                    RXLogger.e(msg);
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), msg));
                }
            } else {
                String msg = "不支持的登录方式 " + loginType;
                RXLogger.e(msg);
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), msg));
            }
        } else {
            RXLogger.e("error: required for platform_type params");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
        }
        return true;
    }

    private void ysdkLoginUI(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        this.loginCallback = callback;
        RXYsdkLoginConfig rxYsdkLoginConfig = RXYsdkLoginConfig.fromMap(hashMap);
        YsdkLoginConfig ysdkLoginConfig;
        if (rxYsdkLoginConfig == null) {
            ysdkLoginConfig = new YsdkLoginConfig.Builder().create();
        } else {
            boolean isCpSetUseRealAuth = (rxYsdkLoginConfig.isSkipYsdkAntiAddiction() != null);
            boolean skipYsdkAntiAddiction = rxYsdkLoginConfig.isSkipYsdkAntiAddiction() != null && rxYsdkLoginConfig.isSkipYsdkAntiAddiction();
            RXLogger.d("isCpSetUseRealAuth " + isCpSetUseRealAuth);
            if (!isCpSetUseRealAuth) {
                RXLogger.d("调用方未设置防沉迷，调用瑞雪防沉迷配置 " + RXGlobalData.isNeedRealauth());
                // 需要实名认证，skipYsdkAntiAddiction 即 跳过应用宝防沉迷配置为 true
                skipYsdkAntiAddiction = RXGlobalData.isNeedRealauth();
            } else {
                RXLogger.d("调用方设置调用防沉迷，所以不调用瑞雪防沉迷配置 skipYsdkAntiAddiction " + skipYsdkAntiAddiction);
            }
            ysdkLoginConfig = new YsdkLoginConfig.Builder()
                    .configShowCloseButton(rxYsdkLoginConfig.isShowCloseButton())
                    // 是否展示手机号码登录UI，默认false
                    .configPhoneLoginPlatform(rxYsdkLoginConfig.isShowPhoneLoginPlatform())
                    // 配置宝券、悬浮球等弹窗展示的activity
                    .configCouponViewShownInActivityClassName(rxYsdkLoginConfig.getCouponViewShownInActivityClassName())
                    // 配置YSDK是否使用登录缓存进行自动登录，默认true
                    .configYsdkAutoLogin(rxYsdkLoginConfig.isAutoLogin())
                    // 配置是否跳过防沉迷，默认false
                    .configSkipYsdkAntiAddiction(skipYsdkAntiAddiction)
                    // 配置是否使用YSDK防沉迷托管模式（即由YSDK接管防沉迷,不需要CP自行处理回调），默认true
                    .configYsdkAntiAddictionDialog(rxYsdkLoginConfig.isUseYsdkAntiAddictionDialog())
                    .configPrivacyInfo(rxYsdkLoginConfig.getPrivacyInfo())
                    .configShowLoginFailToast(rxYsdkLoginConfig.isShowLoginFailToast())
                    .configLoginUiOrientation(getYsdkLoginUiOrientation(rxYsdkLoginConfig))
                    .create();
        }

        isNeedShowLoginUi = true;

        YSDKApi.loginWithUi(ysdkLoginConfig, activity, new IYsdkLoginCallback() {
            @Override
            public void onYsdkLoginSuccess(@NonNull UserLoginRet userLoginRet, @NonNull IYsdkLoginController iYsdkLoginController) {
                iYsdkLoginController.onGameLoginSuccess();
                onLoginSuccess(userLoginRet);
            }

            @Override
            public boolean onYsdkLoginFail(@NonNull UserLoginRet ret) {
                // 是否隐藏Ysdk的登录页面，一般登录失败后，ysdk会自动再把登录页面拉起来，如果开发者有特殊需求的话，
                // 可以通过返回true的方式，限制Ysdk自动拉起登录页面；默认false

                // 这里应用宝 API 有 bug，一旦设置了这个 callback，后面就算调用单纯的 api 登录，也会回调到这里，所以这里暂时通过一个全局属性做下判断
                if (isNeedShowLoginUi) {
                    return false;
                } else {
                    OnLoginNotify(ret);
                    return true;
                }
            }

            @Override
            public void onYsdkLoginKickOut(@NonNull UserLoginRet userLoginRet) {
                // ysdk定时刷新登录态的时候失败了，需要重新拉起登录
                doLogout();
            }

            @Override
            public void onYsdkLoginUiClose(@NonNull UserLoginRet ret) {
                // 登录弹窗手动关闭的时候，会通过这个接口通知开发者
                if (loginCallback != null) {
                    loginCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
                    loginCallback = null;
                }
            }

            @Override
            public void onAntiAddictionLoginLimit(@NonNull AntiAddictRet antiAddictRet) {
                onAntiAddictLimitNotify(antiAddictRet);
            }

            @Override
            public void onAntiAddictionTimeLimit(@NonNull AntiAddictRet antiAddictRet) {
                onAntiAddictLimitNotify(antiAddictRet);
            }
        });
    }

    private YsdkLoginConfig.YsdkLoginUiOrientation getYsdkLoginUiOrientation(RXYsdkLoginConfig rxYsdkLoginConfig) {
        YsdkLoginConfig.YsdkLoginUiOrientation orientation = YsdkLoginConfig.YsdkLoginUiOrientation.DEFAULT;
        if (rxYsdkLoginConfig.getOrientation() == RXYsdkLoginConfig.RXYsdkLoginUiOrientation.LANDSCAPE) {
            orientation = YsdkLoginConfig.YsdkLoginUiOrientation.LANDSCAPE;
        } else if (rxYsdkLoginConfig.getOrientation() == RXYsdkLoginConfig.RXYsdkLoginUiOrientation.PORTRAIT) {
            orientation = YsdkLoginConfig.YsdkLoginUiOrientation.PORTRAIT;
        } else if (rxYsdkLoginConfig.getOrientation() == RXYsdkLoginConfig.RXYsdkLoginUiOrientation.SENSOR_LANDSCAPE) {
            orientation = YsdkLoginConfig.YsdkLoginUiOrientation.SENSOR_LANDSCAPE;
        } else if (rxYsdkLoginConfig.getOrientation() == RXYsdkLoginConfig.RXYsdkLoginUiOrientation.SENSOR_PORTRAIT) {
            orientation = YsdkLoginConfig.YsdkLoginUiOrientation.SENSOR_PORTRAIT;
        }
        return orientation;
    }

    @Override
    public boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        YSDKApi.logout();
        callback.onSuccess("");
        return true;
    }


    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }

    @Override
    public void share(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.share(activity, hashMap, callback);
    }
}
