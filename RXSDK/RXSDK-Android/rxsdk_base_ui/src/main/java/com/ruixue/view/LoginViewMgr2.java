package com.ruixue.view;

import android.app.Activity;
import android.app.Dialog;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.Constants;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.Account;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.MobileUtils;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginViewMgr2 {

    private static LoginViewMgr2 instanceField;

    public static LoginViewMgr2 getInstance() {
        LoginViewMgr2 instance = instanceField;
        if (instance == null) {
            synchronized (LoginViewMgr2.class) {
                if (instanceField == null) {
                    instanceField = new LoginViewMgr2();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    LoginQuickView loginQuickView;
    LoginMethodView loginMethodView;
    LoginMoreMethodView loginMoreMethodView;
    RXUICallback registerCallback;

    public IRXView createLoginView(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback) {
        return createLoginView(activity, config, null, callback);
    }

    public IRXView createLoginView(Activity activity, LoginUIConfig config, Map<String, Object> map, @NonNull RXUICallback callback) {
        return createLoginView(activity, config, map, callback, null);
    }

    public IRXView createLoginView(Activity activity, LoginUIConfig config, Map<String, Object> map, @NonNull RXUICallback callback, RXUICallback registerCallback) {
        if (config == null) {
            config = RXGlobalData.getPassportCfg();
        }
        if (map != null && !map.isEmpty()) {
            config.setCustomParams(map);
        }
        config.initPrivacyTitle();
        String openid = RuiXueSdk.getOpenid();
        this.registerCallback = registerCallback;

        Account account = AccountHelper.findAccountByOpenid(openid, 0);
        if (config.isHistoryViewEnable() && account != null) {
            loginQuickView = LoginQuickView.create(activity);
            loginQuickView.setCancelable(config.isCancelable());
            loginQuickView.setAccount(account);
            loginQuickView.setLogo(config.getLogoDrawable());
            loginQuickView.setLoginClickListener(getLoginClickListener(activity, config, true, callback));
            LoginUIConfig finalConfig = config;
            loginQuickView.setShowLoginViewListener(map1 -> {
                if (map1 == null && loginQuickView != null) {
                    loginQuickView.dismiss();
                    loginQuickView = null;
                }
                showLoginView(activity, finalConfig, map1 == null ? null : (String) map1.get("method"), map1 == null ? null : (String) map1.get("username"), callback);
            });
            loginQuickView.setOnViewCloseListener(v -> {
                loginQuickView = null;
                JSONObject cancelJsonObject = RXErrorCode.LOGIN_CANCEL.toJSONObject();
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                        "", "rxlog_error_login", cancelJsonObject);
                callback.onFailed(cancelJsonObject);
            });
            return loginQuickView;
        } else {
            return getLoginView(activity, config, getLoginClickListener(activity, config, callback));
        }
    }

    @NonNull
    private LoginClickListener getLoginClickListener(Activity activity, LoginUIConfig config, @NonNull RXUICallback callback) {
        return getLoginClickListener(activity, config, false, callback);
    }

    int loginTag = 0;

    @NonNull
    private LoginClickListener getLoginClickListener(Activity activity, LoginUIConfig config, boolean isAgreedPrivacy, @NonNull RXUICallback callback) {
        return (view, method, isQuickBtn, loginMap) -> {
            loginMap = loginMap != null ? loginMap : new HashMap<>();
            Map<String, Object> btnConfig = config.getLoginMethodConfig(method);
            if (btnConfig != null) {
                if (loginMap.containsKey("ext")) {
                    loginMap.putAll(btnConfig);
                } else {
                    loginMap.put("ext", btnConfig);
                }
            }

            if (isQuickBtn > 1 && !method.equals(LoginMethod.MORE)) {
                PresetEventHelper.loginClick(method);
            }

            if (isQuickBtn > 1 && (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME))) {
                Map<String, Object> finalLoginMap = loginMap;
                if (config.isShowPrivacy()) {
                    PrivacyListView.create(activity, config.getPrivacyList()).setCallback(new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            showLoginView(activity, config, method, (String) finalLoginMap.get("username"), callback);
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            PresetEventHelper.privacyClick(false);
                        }
                    }).show();
                } else {
                    showLoginView(activity, config, method, (String) finalLoginMap.get("username"), callback);
                }

            } else if (isQuickBtn > 1 && method.equals(LoginMethod.MORE)) {
                showMoreMethodView(activity, config, getLoginClickListener(activity, config, callback));
            } else {
                if (config.getCustomParams() != null) {
                    loginMap.putAll(config.getCustomParams());
                }
                loginTag = isQuickBtn;
                loginMap.put("method", method);
                if (!config.isShowPrivacy() || isAgreedPrivacy || method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME)) {
                    doLogin(activity, view, true, config, loginMap, callback);
                } else {
                    doPrivacyLogin(activity, view, true, config, loginMap, callback);
                }
            }
        };
    }


    @NonNull
    private LogoBaseView getLoginView(Activity activity, LoginUIConfig config, LoginClickListener loginClickListener) {
        loginMethodView = LoginMethodView.create(activity);
        loginMethodView.setLogo(config.getLogoDrawable());
        loginMethodView.setLoginMethodList(config.getLoginMethodList());
        loginMethodView.setLoginClickListener(loginClickListener);
        PresetEventHelper.loginShow();
        return loginMethodView;
    }

    private void showMoreMethodView(Activity activity, LoginUIConfig config, LoginClickListener loginClickListener) {
        loginMoreMethodView = new LoginMoreMethodView(activity);
        loginMoreMethodView.setLoginMethodList(config.getLoginMethodList());
        loginMoreMethodView.setLoginClickListener(loginClickListener);
        loginMoreMethodView.setIcoType(String.valueOf(Constants.REGISTER_TYPE_EMAIL));
        loginMoreMethodView.show();
    }

    void showLoginView(Activity activity, LoginUIConfig config, String method, String username, RXUICallback callback) {
        if (method != null && method.equals(LoginMethod.CAPTCHACODE) && !MobileUtils.isEmail(username)) {
            LoginViewCaptcha.create(activity).setLoginClickListener(getLoginClickListener(activity, config, callback)).setUsername(username).setLogo(config.getLogoDrawable()).setBackEnable(true).show();
        } else if (method != null && (method.equals(LoginMethod.USERNAME) || MobileUtils.isEmail(username))) {
            LoginViewUsername.create(activity).setLoginMethod(TextUtils.isEmpty(username) ? LoginMethod.CAPTCHACODE : method).setLoginClickListener(getLoginClickListener(activity, config, callback)).setRegisterCallback(new RXUICallback() {
                @Override
                public Map<String, Object> onClickHandle(Map<String, Object> params) {
                    return registerCallback != null ? registerCallback.onClickHandle(params) : callback.onClickHandle(params);
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    PresetEventHelper.emailRegister(true, null);
                    if (registerCallback != null) {
                        registerCallback.onSuccess(data);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    PresetEventHelper.emailRegister(false, cause);
                    if (registerCallback != null) {
                        registerCallback.onFailed(cause);
                    }
                }
            }).setForgotUrl(config.getForgotUrl()).setUsername(username).setLogo(config.getLogoDrawable()).setBackEnable(true).show();
        } else {
            getLoginView(activity, config, getLoginClickListener(activity, config, callback)).setBackEnable(loginQuickView != null).show();
        }

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

    public void doPrivacyLogin(Activity activity, RXView view, boolean showLoginLoading, LoginUIConfig config, Map<String, Object> hashMap, RXUICallback callback) {
        PrivacyListView.create(activity, config.getPrivacyList()).setCallback(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                doLogin(activity, view, showLoginLoading, config, hashMap, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {

            }
        }).show();
    }

    public void doLogin(Activity activity, RXView view, boolean showLoginLoading, LoginUIConfig config, Map<String, Object> hashMap, RXUICallback callback) {
        hashMap = hashMap != null ? hashMap : new HashMap<>();
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
            LoadingDialog loadingDialog = LoadingDialog.create(activity);
            if (showLoginLoading) {
                loadingDialog.showDelay(500).closeDelay(7000);
            }
            RXSdkApi.getInstance().login(activity, finalHashMap, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    AccountHelper.updateAccountCache(RuiXueSdk.getLoginData(), password);
                    loadingDialog.close();
                    handleLogin(config.isIndulgeAuth(), config.getRealAuthRegion(), config.isCanCloseRealAuth(), new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject ignore) {
                            LoginData loginData = RuiXueSdk.getLoginData();
                            if (data != null && loginData != null) {
                                try {
                                    data.put("attr", loginData.getAttr());
                                    data.put("age", loginData.getAge());
                                    data.put("flag", loginData.getFlag());

                                } catch (JSONException ignore1) {
                                }
                            }
                            callback.onSuccess(data);
                            view.close();
                            if (loginQuickView != null) {
                                loginQuickView.dismiss();
                                loginQuickView = null;
                            }
                            if (loginMethodView != null) {
                                loginMethodView.dismiss();
                                loginMethodView = null;
                            }
                            if (loginMoreMethodView != null) {
                                loginMoreMethodView.dismiss();
                                loginMoreMethodView = null;
                            }
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                        }
                    });
                }

                private void handleLogin(int indulge_auth, String realAuthRegion, boolean isCanCloseRealAuth, RXJSONCallback handleCallback) {
                    LoginData loginData = PassportManager.getInstance().getLoginData();
                    if (indulge_auth > 0 && !loginData.isRealName()) {
                        // 和陈汉确认过了，海外都走 H5 实名认证，且是强实名
                        RXSdkUI.getInstance().realAuthH5UI(activity, realAuthRegion, isCanCloseRealAuth, handleCallback).show();
                    } else if (config.isDeregisterShow() && loginData.isDeregistering()) {
                        DeregisterRecallView.create(activity).setLoginContinue(config.isLoginContinue()).setCallback(handleCallback).show();
                    } else {
                        handleCallback.onSuccess(null);
                    }
                    if (config.isFirstNeedSetPassword() && loginData != null && loginData.isNewUser() && !loginData.isPasswordSet() && loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE) && loginData.getMethod().equals("email")) {
                        ChangePasswordView.create(activity).setIsPasswordSet(loginData.isPasswordSet()).show();
                    }
                }

                private boolean isQuickError(int code) {
                    return loginTag == 1 && (code == 3101 || code == 312204 || code == 312222 || code == 312215 || (LoginMethod.USERNAME.equals(finalHashMap.get("method")) && TextUtils.isEmpty(password)));
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    int code;
                    try {
                        code = cause.getInt("code");
                        if (code == RXErrorCode.LOGIN_OPENID_ERROR || code == 302204 || isQuickError(code)) {
                            if (code == 312204) {
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
                            if (isQuickError(code) || LoginMethod.CAPTCHACODE.equals(finalHashMap.get("method")) || code == 302204) {
                                loadingDialog.close();
                                if (ObjectUtils.toBoolean(finalHashMap.get("auto_send_captcha"))) {
                                    doLoginCaptcha(activity, config, finalHashMap, rxjsonCallback);
                                } else {
                                    showLoginView(activity, config, (String) finalHashMap.get("method"), (String) finalHashMap.get("username"), callback);
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
