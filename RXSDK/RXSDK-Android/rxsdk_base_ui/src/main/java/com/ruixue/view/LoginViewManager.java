package com.ruixue.view;

import android.app.Activity;
import android.app.Dialog;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXLoginUIModel;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.Account;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.PassportManager;
import com.ruixue.reflect.AliOAuthLoginManager;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.UIToast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class LoginViewManager {

    private static LoginViewManager instanceField;

    public static LoginViewManager getInstance() {
        LoginViewManager instance = instanceField;
        if (instance == null) {
            synchronized (LoginViewManager.class) {
                if (instanceField == null) {
                    instanceField = new LoginViewManager();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    LoginQuickView mLoginQuickView;
    LoginView mLoginUI;

    private interface OtherLoginCallback {
        void otherLogin(LoginUIConfig config);
    }

    // 定义变量，便于在登录成功后 dismiss
    private LoginAccountListView loginAccountListView;


    //对外调用的入口
    public void showLoginView(Activity activity, RXLoginUIModel config, @NonNull RXUICallback callback) {
        if (config == null)
            config = new RXLoginUIModel();

        RXLoginUIModel finalConfig = config;
        checkQuickLogin(activity, config, new RXUICallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int errorCode = cause.optInt("code", -1);
                if (errorCode == -1 || errorCode == 302204 || errorCode == 302205 || errorCode == 302202) {
                    // 需求改成默认无论是否配置一键登录，都需要启动一键登录页
                    //        boolean containsQuickPhone = true; //Objects.requireNonNull(config).getLoginMethodList() != null && (config.getLoginMethodList()).contains(LoginMethod.QUICKPHONE);
                    if (AliOAuthLoginManager.isSupport(activity)) {
                        showOAuthLoginView(activity, finalConfig, Objects.requireNonNull(callback));
                    } else {
                        createLoginView(activity, finalConfig, finalConfig.getCustomParams(), Objects.requireNonNull(callback)).show();
                        if (finalConfig.getLoginMode() == 1) { // 快速模式
                            if (hasHistoryAccount()) {
                                showAccountListView(activity, finalConfig, callback, new OtherLoginCallback() {
                                    @Override
                                    public void otherLogin(LoginUIConfig config) {
                                        createLoginView(activity, config, config.getCustomParams(), Objects.requireNonNull(callback)).show();
                                    }
                                });
                            } else {
                                createLoginView(activity, finalConfig, finalConfig.getCustomParams(), Objects.requireNonNull(callback)).show();
                            }
                        } else {
                            createLoginView(activity, finalConfig, finalConfig.getCustomParams(), Objects.requireNonNull(callback)).show();
                        }
                    }

                } else {
                    callback.onFailed(cause);
                }
            }
        });
    }

    private void checkQuickLogin(Activity activity, RXLoginUIModel config, @NonNull RXUICallback callback) {
        if (!TextUtils.isEmpty(config.getMethod()) && !TextUtils.isEmpty(config.getLoginOpenid())) {
            Map<String, Object> map = new HashMap<>(config.getCustomParams());
            map.put("method", config.getMethod());
            map.put("login_openid", config.getLoginOpenid());
            loginTag = 1; //sign quick login tag
            doLogin(activity, null, false, config, map, callback);
        } else {
            callback.onFailed(JSONUtil.toJSONObject(-1, "please show ui"));
        }
    }


    private void showAccountListView(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback, @NonNull OtherLoginCallback otherLoginCallback) {
        if (loginAccountListView != null && loginAccountListView.isShowing()) {
            loginAccountListView.dismiss();
        }
        loginAccountListView = LoginAccountListView.create(activity, map -> {
            // 账号清空后跳转下一个页面时由于这个页面空了关闭了，所以下个页面展示关闭按钮，不展示 back 按钮
            config.setShowBackBtn(false);
            otherLoginCallback.otherLogin(config);
            loginAccountListView = null;
        }).setGoBackEnable(false).setShowOtherLoginBtn(true).setOtherLoginClickListener(v -> {
            // 点击其它登录按钮，当前页面没有关闭，所以下一个页面需要展示 back 按钮
            config.setShowBackBtn(true);
            otherLoginCallback.otherLogin(config);
        }).setCallback((dialog, account, isDel) -> {
            // 删除操作这里无需处理，点击操作后直接回调给上层，loginAccountListView dismiss 并置空
            if (!isDel) {
                try {
                    JSONObject data = JSONUtil.toJSONObject(JSONUtil.toJson(account));
                    data.put("login_type", 1);
                    data.put("cpNickname", account.getNickname());
                    callback.onSuccess(data);
                } catch (JSONException e) {
                    RXLogger.e(e.getMessage());
                    callback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject());
                }
                loginAccountListView = null;
            }
        }).setClickCloseListener(v -> {
            callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
        });
        loginAccountListView.show();
    }

    //UI 2024年11月02日13:37:46
    public void showOAuthLoginView(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback) {
        if (config == null) {
            config = RXGlobalData.getPassportCfg();
        }
        RXLogger.i(config.toString());

        if (config.getLoginMode() == 1) {
            // 快速模式
            if (hasHistoryAccount()) {
                showAccountListView(activity, config, callback, new OtherLoginCallback() {
                    @Override
                    public void otherLogin(LoginUIConfig config) {
                        showOAuthLoginViewForce(activity, config, true, callback);
                    }
                });
            } else {
                showOAuthLoginViewForce(activity, config, true, callback);
            }
        } else {
            if (isHistoryEnable(config)) {
                createLoginView(activity, config, config.getCustomParams(), callback).show();
            } else {
                showOAuthLoginViewForce(activity, config, true, callback);
            }
        }
    }

    private void showOAuthLoginViewForce(Activity activity, LoginUIConfig config, boolean showNext, @NonNull RXUICallback callback) {
        AliOAuthLoginManager.showLoginUI(activity, config, new RXUICallback() {
            String method;

            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                method = (params != null && params.containsKey("method")) ? String.valueOf(params.get("method")) : "";
                return callback.onClickHandle(params);
            }

            private void handleLogin(Activity activity, LoginUIConfig config, int indulge_auth, RXJSONCallback handleCallback) {
                LoginData loginData = PassportManager.getInstance().getLoginData();
                if (indulge_auth > 0 && loginData != null && !loginData.isRealName()) {
                    RXSdkUI.getInstance().realAuthUI(activity, config.isCanCloseRealAuth(), handleCallback).show();
                } else if (config.isDeregisterShow() && loginData.isDeregistering()) {
                    DeregisterRecallView.create(activity).setLoginContinue(config.isLoginContinue()).setCallback(handleCallback).show();
                } else {
                    handleCallback.onSuccess(null);
                }
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
//                callback.onSuccess(data);
//                loginMap.put("indulge_auth", config.isIndulgeAuth());
                if (!TextUtils.isEmpty(method) && (!method.equals(LoginMethod.USERNAME) && !method.equals(LoginMethod.CAPTCHACODE))) {
                    handleLogin(activity, config, config.isIndulgeAuth(), new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject ignore) {
                            LoginData loginData = RuiXueSdk.getLoginData();
                            if (data != null && loginData != null) {
                                try {
                                    data.put("attr", loginData.getAttr());
                                    data.put("age", loginData.getAge());
                                    data.put("flag", loginData.getFlag());
                                    data.put("aas", loginData.getAas());
                                } catch (JSONException ignore1) {
                                }
                            }
                            callback.onSuccess(data);
                            if (mLoginQuickView != null) {
                                mLoginQuickView.dismiss();
                                mLoginQuickView = null;
                            }
                            if (mLoginUI != null) {
                                mLoginUI.dismiss();
                                mLoginUI = null;
                            }
                            if (loginAccountListView != null) {
                                loginAccountListView.dismiss();
                                loginAccountListView = null;
                            }
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            callback.onFailed(cause);
                        }
                    });
                } else {
                    callback.onSuccess(data);
                    if (mLoginQuickView != null) {
                        mLoginQuickView.dismiss();
                        mLoginQuickView = null;
                    }
                    if (mLoginUI != null) {
                        mLoginUI.dismiss();
                        mLoginUI = null;
                    }
                    if (loginAccountListView != null) {
                        loginAccountListView.dismiss();
                        loginAccountListView = null;
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code");
                if (code != RXErrorCode.LOGIN_CANCEL.getValue()) {
                    boolean show = cause.optBoolean("show");
                    if (showNext && !show) {
                        if (mLoginUI == null || !mLoginUI.isShowing()) {
                            Activity act = RuiXueSdk.getCurrentActivity();
                            if (act == null) {
                                act = activity;
                            }
                            createLoginView(act, config, config.getCustomParams(), callback).show();
                        } else {
                            RXLogger.i("rx login view is showing " + cause);
                        }

                    } else {
                        UIToast.showToast(activity, cause.optString("thirdmsg", cause.optString("msg")));
                        callback.onFailed(cause);
                    }
                } else {
                    callback.onFailed(cause);
                }
            }
        });
    }


    public LoginBaseView createLoginView(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback) {
        return createLoginView(activity, config, null, callback);
    }

    public boolean isHistoryEnable(LoginUIConfig config) {
        String openid = RuiXueSdk.getOpenid();
        Account account = AccountHelper.findAccountByOpenid(openid, 0);
        return config.isHistoryViewEnable() && account != null;
    }

    private boolean hasHistoryAccount() {
        String openid = RuiXueSdk.getOpenid();
        Account account = AccountHelper.findAccountByOpenid(openid, 0);
        return account != null;
    }

    public LoginBaseView createLoginView(Activity activity, LoginUIConfig config, Map<String, Object> map, @NonNull RXUICallback callback) {
        if (config == null) {
            config = RXGlobalData.getPassportCfg();
        }
        if (map != null && !map.isEmpty()) {
            config.setCustomParams(map);
        }
        RXLogger.i(config.toString());
        String openid = RuiXueSdk.getOpenid();
        LoginClickListener loginClickListener = getLoginClickListener(activity, config, callback);
        Account account = AccountHelper.findAccountByOpenid(openid, 0);
        if (config.isHistoryViewEnable() && account != null) {
            mLoginQuickView = LoginQuickView.create(activity);
            mLoginQuickView.setCancelable(config.isCancelable());
//            mLoginQuickView.setAppPrivacyOne(config.getPrivacyOneStr(), config.getPrivacyOneUrl());
//            mLoginQuickView.setAppPrivacyTwo(config.getPrivacyTwoStr(), config.getPrivacyTwoUrl());
//            mLoginQuickView.setAppPrivacyThree(config.getPrivacyThreeStr(), config.getPrivacyThreeUrl());
            mLoginQuickView.setPrivacyMap(config.getPrivacyMap());
            mLoginQuickView.setAccount(account);
            mLoginQuickView.setLogo(config.getLogoDrawable());
            mLoginQuickView.setLoginClickListener(loginClickListener);
            LoginUIConfig finalConfig = config;
            mLoginQuickView.setShowLoginViewListener(map1 -> {
                if (map1 == null && mLoginQuickView != null) {
                    mLoginQuickView.dismiss();
                    mLoginQuickView = null;
                }

                // 注意：这里 验证码失效和快捷登录方式清空后都会走这里，容易忽略 case
                // LoginQuickView 点击开始登录，如果是验证码登录且已经失效了则需要自动跳转至登录页并切换到验证码登录，其他条件跳转至快捷登录
                boolean showCaptchaLoginView = (map1 != null && Objects.equals(map1.get("method"), LoginMethod.CAPTCHACODE));
                if (showCaptchaLoginView) {
                    showLoginView(activity, finalConfig, map1, callback);
                } else {
                    finalConfig.setShowBackBtn(false);
                    // 国内快捷登录清空后，默认回一键登录页，不支持则跳转到登录页
                    if (!AliOAuthLoginManager.isSupport(activity)) {
                        showLoginView(activity, finalConfig, map1, callback);
                    } else {
                        showOAuthLoginViewForce(activity, finalConfig, false, callback);
                    }
                }
            });
            mLoginQuickView.setOnViewCloseListener((v) -> {
                mLoginQuickView = null;
                JSONObject cancelJsonObject = RXErrorCode.LOGIN_CANCEL.toJSONObject();
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), "", "rxlog_error_login", cancelJsonObject);
                callback.onFailed(cancelJsonObject);
            });
            return mLoginQuickView;
        } else {
            return getLoginView(activity, config, callback, loginClickListener);
        }
    }

    int loginTag = 0;

    @NonNull
    private LoginClickListener getLoginClickListener(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback) {
        /**
         * isQuickBtn 1 快速开始按钮 ，2 导航栏登录按钮事件点击
         */
        return (view, method, isQuickBtn, loginMap) -> {
            loginMap = loginMap != null ? loginMap : new HashMap<>();
            loginMap.put("indulge_auth", config.isIndulgeAuth());

            Map<String, Object> btnConfig = config.getLoginMethodConfig(method);
            if (btnConfig != null) {
                if (loginMap.containsKey("ext")) {
                    loginMap.putAll(btnConfig);
                } else {
                    loginMap.put("ext", btnConfig);
                }
            }

            if (isQuickBtn > 1 && (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME) || method.equals(LoginMethod.MORE))) {
                boolean isVerifyLogin = config.isCaptchaLogin();
                if (!method.equals(LoginMethod.MORE)) {
                    isVerifyLogin = method.equals(LoginMethod.CAPTCHACODE);
                }
                LoginBaseView loginUI = getLoginView(activity, config, isVerifyLogin, callback);
                loginUI.setLoginClickListener(getLoginClickListener(activity, config, callback));
                if (!method.equals(LoginMethod.MORE)) {
                    view.close();
                    if (mLoginQuickView != null) {
                        loginUI.setBackEnable(true);
                    }
                    loginUI.show();
                } else {
                    if (!AliOAuthLoginManager.isSupport(activity)) {
                        config.setShowBackBtn(true);
                        showLoginView(activity, config, loginMap, callback);
                    } else {
                        config.setShowBackBtn(true);
                        showOAuthLoginViewForce(activity, config, false, callback);
                    }
                }
            } else {
                if (config.getCustomParams() != null) {
                    try {
                        for (String key : config.getCustomParams().keySet()) {
                            Object customsubObject = config.getCustomParams().get(key);
                            Object lgoinsubObject = loginMap.get(key);

                            if (loginMap.containsKey(key) && (customsubObject instanceof Map) && (lgoinsubObject instanceof Map)) {
                                @SuppressWarnings("unchecked") Map<String, Object> customsubMap = (Map<String, Object>) customsubObject;
                                @SuppressWarnings("unchecked") Map<String, Object> loginsubMap = (Map<String, Object>) lgoinsubObject;
                                loginsubMap.putAll(customsubMap);
                            } else {
                                loginMap.put(key, config.getCustomParams().get(key));
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                loginTag = isQuickBtn;
                loginMap.put("method", method);
                String login_openid = (String) loginMap.get("login_openid");

//                if (TextUtils.isEmpty(login_openid) && LoginMethod.QUICKPHONE.equals(method) && !AliOAuthLoginManager.isSupport(activity)) {
//
//                }
                if (TextUtils.isEmpty(login_openid) && LoginMethod.QUICKPHONE.equals(method)) // (loginTag == 2 && LoginMethod.QUICKPHONE.equals(method))
                {
                    if (!AliOAuthLoginManager.isSupport(activity)) {
                        showLoginView(activity, config, loginMap, callback);
                    } else {
                        showOAuthLoginViewForce(activity, config, false, callback);
                    }
                } else {
                    doLogin(activity, view, true, config, loginMap, callback);
                }
            }
        };
    }

    @NonNull
    private LoginBaseView getLoginView(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback, LoginClickListener loginClickListener) {
        LoginBaseView loginView = getLoginView(activity, config, config.isCaptchaLogin(), callback);
        loginView.setLoginClickListener(loginClickListener);
        return loginView;
    }

    @NonNull
    private LoginBaseView getLoginView(Activity activity, LoginUIConfig config, boolean isCaptchaLogin, @NonNull RXUICallback callback) {
        LoginView loginUI;
        if (mLoginUI != null) {
            mLoginUI.close();
            mLoginUI = null;
        }
        loginUI = LoginView.create(activity, isCaptchaLogin);
        loginUI.setShowPrivacy(config.isShowPrivacy());
        loginUI.isAgreedPrivacy = config.isAgreedPrivacy();
        loginUI.setQuickButtonBarVisible(config.isQuickButtonBarVisible());
        loginUI.setCancelable(config.isCancelable());
        loginUI.setLoginType(config.getLoginType());
        loginUI.setLogo(config.getLogoDrawable());
        loginUI.setLoginMethods(config.getLoginMethodList());
        loginUI.setUsernameHintText(config.getUsernameHintText());
        loginUI.setUsername(config.getUsernameText());
        loginUI.setForgotUrl(config.getForgotUrl());
//        loginUI.setAppPrivacyOne(config.getPrivacyOneStr(), config.getPrivacyOneUrl());
//        loginUI.setAppPrivacyTwo(config.getPrivacyTwoStr(), config.getPrivacyTwoUrl());
//        loginUI.setAppPrivacyThree(config.getPrivacyThreeStr(), config.getPrivacyThreeUrl());
        loginUI.setPrivacyMap(config.getPrivacyMap());
        loginUI.setBackEnable(config.isShowBackBtn());
        loginUI.setOnViewCloseListener(new OnViewCloseListener() {

            @Override
            public void onClosed(IRXView v) {
                JSONObject cancelObj = RXErrorCode.LOGIN_CANCEL.toJSONObject();
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), "", "rxlog_error_login", cancelObj);

                if (mLoginQuickView != null) {
                    mLoginQuickView.dismiss();
                    mLoginQuickView = null;
                }
                if (loginAccountListView != null) {
                    loginAccountListView.dismiss();
                    loginAccountListView = null;
                }

                //账号登录界面关闭不关闭阿里
                if (!AliOAuthLoginManager.isShowing(activity)) {
                    callback.onFailed(cancelObj);
                }
//                AliOAuthLoginManager.closeUI(activity);
            }
        });
        mLoginUI = loginUI;
        return loginUI;
    }

    void showLoginView(Activity activity, LoginUIConfig config, Map<String, Object> hashMap, RXUICallback callback) {
        LoginUIConfig configT = config.clone();
        if (hashMap != null) {
            configT.setUsernameText((String) hashMap.get("username"));
            configT.setCaptchaLogin(LoginMethod.CAPTCHACODE.equals(hashMap.get("method")) || LoginMethod.QUICKPHONE.equals(hashMap.get("method")));
        }
        LoginBaseView loginView = getLoginView(activity, configT, callback, getLoginClickListener(activity, configT, callback));
        loginView.setBackEnable(mLoginQuickView != null);
        loginView.show();
    }

    protected void doLoginCaptcha(Activity activity, LoginUIConfig config, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {

        CaptchaInputView.create(activity, (String) hashMap.get("username"), CaptchaPurpose.LOGIN, new CaptchaInputView.OnCaptchaCallback() {
            @Override
            public void onFinish(Dialog dialog, String account, @Nullable String captcha) {
                hashMap.put("method", LoginMethod.CAPTCHACODE);
                hashMap.put("username", account);
                Map<String, Object> ext = new HashMap<>();
                ext.put("captcha_code", captcha);
                hashMap.put("ext", ext);
                RXSdkApi.getInstance().login(activity, hashMap, callback);
            }

            @Override
            public void onClosed() {

            }
        }).show();
    }


    public void doLogin(Activity activity, @Nullable RXView view, boolean showLoginLoading, LoginUIConfig config, Map<String, Object> hashMap, RXUICallback callback) {
        hashMap = hashMap != null ? hashMap : new HashMap<>();
        hashMap.put("indulge_auth", config.isIndulgeAuth());
        Map<String, Object> customExt = config.getCustomExt();
        if (customExt != null) {
            hashMap.put("custom_ext", customExt);
        }
        if (callback != null) {
            Map<String, Object> customMap = callback.onClickHandle(new HashMap<>(hashMap));
            if (customMap != null) {
                hashMap.putAll(customMap);
            }
        }
        boolean hide_toast = ObjectUtils.toBoolean(hashMap.get("hide_toast"));
        if (callback != null && !ObjectUtils.toBoolean(hashMap.get("break"))) {
            String method = (String) hashMap.get("method");
            String password = (String) hashMap.get("password");
            Map<String, Object> finalHashMap = hashMap;
            String login_openid = (String) hashMap.get("login_openid");
            if (TextUtils.isEmpty(login_openid) && LoginMethod.QUICKPHONE.equals(method) && !AliOAuthLoginManager.isSupport(activity)) {
                callback.onFailed(RXErrorCode.UNSUPPORTED_LOGIN.toJSONObject());
                return;
            }
            LoadingDialog loadingDialog = LoadingDialog.create(activity);
            if (showLoginLoading) {
                loadingDialog.showDelay(500).closeDelay(7000);
            }
            RXSdkApi.getInstance().login(activity, finalHashMap, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    AccountHelper.updateAccountCache(RuiXueSdk.getLoginData(), password);
                    loadingDialog.close();
                    handleLogin(ObjectUtils.toInt(finalHashMap.get("indulge_auth")), new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject ignore) {

                            LoginData loginData = RuiXueSdk.getLoginData();
                            if (data != null && loginData != null) {
                                try {
                                    data.put("attr", loginData.getAttr());
                                    data.put("age", loginData.getAge());
                                    data.put("flag", loginData.getFlag());
                                    data.put("aas", loginData.getAas());
                                } catch (JSONException ignore1) {
                                }
                            }
                            callback.onSuccess(data);
                            if (null != view) {
                                view.close();
                            }
                            if (mLoginQuickView != null) {
                                mLoginQuickView.dismiss();
                                mLoginQuickView = null;
                            }
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            try {
                                cause.put("show", true);//不显示toast
                            } catch (JSONException ignore) {
                            }
                            callback.onFailed(cause);
                        }
                    });
                }

                private void handleLogin(int indulge_auth, RXJSONCallback handleCallback) {
                    LoginData loginData = PassportManager.getInstance().getLoginData();
                    if (config.isFirstNeedSetPassword() && loginData != null && loginData.isNewUser() && !loginData.isPasswordSet() && loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
                        ChangePasswordView.create(activity).setOnDismissListener(dialogInterface -> handleRealAuth(loginData, indulge_auth, handleCallback)).setIsPasswordSet(loginData.isPasswordSet()).show();
                    } else {
                        handleRealAuth(loginData, indulge_auth, handleCallback);
                    }
                }


                private void handleRealAuth(LoginData loginData, int indulge_auth, RXJSONCallback handleCallback) {
                    if (indulge_auth > 0 && loginData != null && !loginData.isRealName()) {
                        RXSdkUI.getInstance().realAuthUI(activity, config.isCanCloseRealAuth(), handleCallback).show();
                    } else if (loginData != null && config.isDeregisterShow() && Objects.requireNonNull(loginData).isDeregistering()) {
                        DeregisterRecallView.create(activity).setLoginContinue(config.isLoginContinue()).setCallback(handleCallback).show();
                    } else {
                        handleCallback.onSuccess(null);
                    }
                }


                public static final int ERR_USERNAME_INVALID = 312204;   //账号密码不存在
                public static final int ERR_SECURITY_VERIFY = 322201;    //触发登录安全验证需要使用验证码登录
                public static final int ERR_CODE_VERIFY = 312222;    //验证码无效
                public static final int ERR_MODIFY_PWD = 312215;    //修改密码

                private boolean isQuickError(int code) {
                    return loginTag == 1 && (code == 3101 || code == ERR_SECURITY_VERIFY || code == ERR_USERNAME_INVALID || code == ERR_CODE_VERIFY || code == ERR_MODIFY_PWD || (LoginMethod.USERNAME.equals(finalHashMap.get("method")) && TextUtils.isEmpty(password)));
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    int code;
                    try {
                        code = cause.getInt("code");
                        if (code == ERR_SECURITY_VERIFY && view instanceof LoginView) {
                            loadingDialog.close();
                            if (!hide_toast) {
                                com.ruixue.utils.UIToast.showToast(activity, cause);
                            }
                            ((LoginView) view).switchMethodShow(true);
                        } else if (code == RXErrorCode.LOGIN_OPENID_ERROR || code == 302204 || isQuickError(code)) {
                            //登录失败 token 失效等情况处理
                            if (code == ERR_USERNAME_INVALID || LoginMethod.QUICKPHONE.equals(finalHashMap.get("method"))) {
                                finalHashMap.remove("username");
                            }
                            AccountHelper.deleteAccountLoginOpenid(login_openid);
                            finalHashMap.remove("login_openid");
                            RXJSONCallback rxjsonCallback = new RXJSONCallback() {
                                @Override
                                public void onError(RXException e) {
                                    loadingDialog.close();
                                    if (!hide_toast) {
                                        com.ruixue.utils.UIToast.showNetErrorToast(activity, e.getCode());
                                    }
                                    callback.onError(e);
                                }

                                @Override
                                public void onSuccess(@Nullable JSONObject data) {
                                    AccountHelper.updateAccountCache(RuiXueSdk.getLoginData(), password);
                                    callback.onSuccess(data);
                                    loadingDialog.close();
                                    if (null != view)
                                        view.close();
                                }

                                @Override
                                public void onFailed(@NonNull JSONObject cause1) {
                                    loadingDialog.close();
                                    if (!hide_toast) {
                                        com.ruixue.utils.UIToast.showToast(activity, cause1);
                                    }
                                    callback.onFailed(cause1);
                                }
                            };
                            if (isQuickError(code) || LoginMethod.CAPTCHACODE.equals(finalHashMap.get("method")) || (LoginMethod.QUICKPHONE.equals(finalHashMap.get("method")))) {
                                loadingDialog.close();
                                if (ObjectUtils.toBoolean(finalHashMap.get("auto_send_captcha"))) {
                                    doLoginCaptcha(activity, config, finalHashMap, rxjsonCallback);
                                } else {
                                    if (code == ERR_SECURITY_VERIFY && !hide_toast) {
                                        com.ruixue.utils.UIToast.showToast(activity, cause);
                                    }
                                    if (LoginMethod.QUICKPHONE.equals(finalHashMap.get("method")) && AliOAuthLoginManager.isSupport(activity)) {
                                        showOAuthLoginViewForce(activity, config, false, callback);
                                    } else {
                                        showLoginView(activity, config, finalHashMap, callback);
                                    }
                                }
                            } else {
                                RXSdkApi.getInstance().login(activity, finalHashMap, rxjsonCallback);
                            }
                        } else {
                            loadingDialog.close();
                            if (!(LoginMethod.QUICKPHONE.equals(finalHashMap.get("method")) && RXErrorCode.LOGIN_CANCEL.getValue() == code)) {
                                if (!hide_toast) {
                                    com.ruixue.utils.UIToast.showToast(activity, cause);
                                }
                                callback.onFailed(cause);
                            }
                        }
                    } catch (Exception e) {
                        loadingDialog.close();
                        callback.onError(new RXException(RXErrorCode.LOGIN_ERROR.getValue(), e));
                    }
                }

                @Override
                public void onError(RXException e) {
                    loadingDialog.close();
                    com.ruixue.utils.UIToast.showNetErrorToast(activity, e.getCode());
                    callback.onError(e);
                }
            });
        }
    }
}
