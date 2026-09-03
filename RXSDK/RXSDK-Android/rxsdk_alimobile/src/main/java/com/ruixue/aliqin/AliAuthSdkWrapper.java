package com.ruixue.aliqin;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.view.LoginBaseView;
import com.ruixue.view.LoginMoreMethodView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/12/7
 */
public class AliAuthSdkWrapper extends PluginSdk {

    static class Single {
        final static AliAuthSdkWrapper INSTANCE = new AliAuthSdkWrapper();
    }

    private AliAuthSdkWrapper() {

    }

    @NonNull
    public static AliAuthSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return LoginMethod.QUICKPHONE;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        return true;
    }

    public void checkEnvAvailable(Activity context, RXJSONCallback callback) {
        AliAuthUI.getInstance().checkEnvAvailable(context, callback);
    }

    @SuppressWarnings("unchecked")
    public void showLoginUI(Activity activity, LoginUIConfig loginUIConfig, @NonNull RXUICallback callback) {
        Map<String, Object> cmap = loginUIConfig.getCustomParams();
        if (cmap == null) {
            cmap = new HashMap<>();
        }
        cmap.put("method", "quickphone");

        Map<String, Object> ext = cmap.get("ext") != null ? (Map<String, Object>) cmap.get("ext") : new HashMap<>();
        if (ext == null) {
            ext = new HashMap<>();
        }
        Map<String, Object> e1 = loginUIConfig.getLoginMethodConfig(LoginMethod.QUICKPHONE);
        if (e1 != null) {
            ext.putAll(e1);
        }

        ext.put("loginMethods", loginUIConfig.getLoginMethodList());


        cmap.put("ext", ext);

        Map<String, Object> handMap = callback.onClickHandle(cmap);
        if (handMap != null) {
            cmap.putAll(handMap);
        }

        cmap.put("showBackBtn", loginUIConfig.isShowBackBtn());
        RXJSONCallback rxjsonCallback = getCallback(activity, loginUIConfig, callback, cmap);
        AliAuthUI.getInstance().showLoginUI(activity, cmap, rxjsonCallback);
    }

    @NonNull
    private RXJSONCallback getCallback(Activity activity, LoginUIConfig loginUIConfig, @NonNull RXUICallback callback, Map<String, Object> cmap) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Map<String, Object> map = cmap != null ? new HashMap<>(cmap) : new HashMap<>();
                Map<String, Object> customExt = loginUIConfig.getCustomExt();
                if (customExt != null) {
                    map.put("custom_ext", customExt);
                }
                map.put("method", "quickphone");
                map.put("ext", data);

                RXSdkApi.getInstance().ruixueLogin(map, handleCallback(true, callback));
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code", -1);
                if (code == RXErrorCode.OTHER_LOGIN.getValue()) {
                    Map<String, Object> otherMap = JSONUtil.toMap(cause.optJSONObject("redirect"));
                    if (otherMap == null) {
                        otherMap = new HashMap<>();
                    }
                    Map<String, Object> customExt = loginUIConfig.getCustomExt();
                    if (customExt != null) {
                        otherMap.put("custom_ext", customExt);
                    }

                    boolean need_show_ui = cause.optBoolean("need_show_ui", false);
                    if (need_show_ui) {
                        String method = cause.optString("method", "");
                        loginUIConfig.setShowBackBtn(true);
                        if (method.equals("more")) {
                            showMoreUi(otherMap, RuiXueSdk.getCurrentActivity(), loginUIConfig, callback);
                        } else {
//                            LoginData loginData = RuiXueSdk.getLoginData();
//                            if (loginData != null) {
//                                loginUIConfig.setCaptchaLogin(loginData.isCaptchaLogin());
//                            } else {
//                                loginUIConfig.setCaptchaLogin(!loginUIConfig.getLoginMethodList().contains(LoginMethod.USERNAME) && loginUIConfig.getLoginMethodList().contains(LoginMethod.CAPTCHACODE));
//                            }
                            loginUIConfig.setCaptchaLogin(LoginMethod.CAPTCHACODE.equals(method));
                            loginUIConfig.setAgreedPrivacy(AliAuthUI.getInstance().isProtocolAgreed());
                            IRXView loginView = RXSdkUI.getInstance().loginUI(RuiXueSdk.getCurrentActivity(), loginUIConfig, handleCallback(false, callback));
                            if (loginView instanceof LoginBaseView) {
                                LoginBaseView loginBaseView = (LoginBaseView) loginView;
                                loginBaseView.setOnViewBackListener((v, agreePrivacy) -> AliAuthUI.getInstance().setProtocolAgreed(agreePrivacy));
                            }
                            loginView.show();
                        }
                    } else {
                        Map<String, Object> customMap = callback.onClickHandle(otherMap);
                        if (customMap != null) {
                            if (ObjectUtils.toBoolean(customMap.get("break"))) {
                                RXLogger.i("The request is break");
                                return;
                            } else {
                                otherMap.putAll(customMap);
                            }
                        }
                        RuiXueSdk.login(activity, otherMap, handleCallback(true, callback));
                    }
                } else if (code == RXErrorCode.THIRD_LOGIN_ERROR.getValue()) {
                    RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                            "quickphone", "rxlog_error_login", RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject());
                    // 新需求阿里一键登录失败就跳转至密码登录页
                    boolean showBackBtn = cause.optBoolean("showBackBtn", false);
                    loginUIConfig.setShowBackBtn(showBackBtn);
                    //新需求 当不支持用户名登录，但支持验证码登录时，启用 CaptchaLogin 模式。 如果任一条件不满足，CaptchaLogin 则为 false。
                    loginUIConfig.setCaptchaLogin(!loginUIConfig.getLoginMethodList().contains(LoginMethod.USERNAME) && loginUIConfig.getLoginMethodList().contains(LoginMethod.CAPTCHACODE));
                    RXSdkUI.getInstance().loginUI(activity, loginUIConfig, handleCallback(false, callback)).show();
                } else {
                    callback.onFailed(cause);
                    RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                            "quickphone", "rxlog_error_login", cause);
                }
            }

            @Override
            public void onError(RXException e) {
                callback.onError(e);
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                        "quickphone", "rxlog_error_login", e.toJSONObject());
            }
        };
    }

    private void showMoreUi(Map<String, Object> map, Activity activity, LoginUIConfig loginUIConfig, @NonNull RXUICallback callback) {
        List<String> loginMethods = new ArrayList<>(Objects.requireNonNull(loginUIConfig.getLoginMethodList()));
        int idx = loginMethods.indexOf(LoginMethod.QUICKPHONE);
        if (idx != -1) {
            loginMethods.remove(idx);
        }
        int fromIndex = 3;
        LoginMoreMethodView loginMoreMethodView = new LoginMoreMethodView(activity);
        loginMoreMethodView.setLoginMethodList(fromIndex < loginMethods.size() ? loginMethods.subList(fromIndex, loginMethods.size()) : null);
        loginMoreMethodView.setLoginClickListener((view, method, isQuickBtn, loginMap) -> {
            view.close();
            if (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME)) {
                RXLogger.i("click " + method);

                //新需求 当不支持用户名登录，但支持验证码登录时，启用 CaptchaLogin 模式。 如果任一条件不满足，CaptchaLogin 则为 false。
                loginUIConfig.setCaptchaLogin(!loginUIConfig.getLoginMethodList().contains(LoginMethod.USERNAME) && loginUIConfig.getLoginMethodList().contains(LoginMethod.CAPTCHACODE));
                RXSdkUI.getInstance().loginUI(activity, loginUIConfig, handleCallback(false, callback)).show();
            } else {
                map.put("method", method);
                if (loginMap != null) {
                    map.putAll(loginMap);
                }
                Map<String, Object> customMap = callback.onClickHandle(map);
                if (customMap != null) {
                    if (ObjectUtils.toBoolean(customMap.get("break"))) {
                        RXLogger.i("The request is break");
                        return;
                    } else {
                        map.putAll(customMap);
                    }
                }
                RuiXueSdk.login(activity, map, handleCallback(true, callback));
            }
        });
        loginMoreMethodView.setBackClickListener(v -> {

        });
        loginMoreMethodView.show();
    }

    @Deprecated
    public void showLoginUI(Activity activity, Map<String, Object> paramsMap, @NonNull RXUICallback callback) {
        AliAuthUI.getInstance().showLoginUI(activity, paramsMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Map<String, Object> map = new HashMap<>(paramsMap);
                map.put("method", "quickphone");
                map.put("ext", data);
                RXSdkApi.getInstance().ruixueLogin(map, callback);
            }

            @SuppressWarnings("unchecked")
            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code", -1);
                if (code == RXErrorCode.OTHER_LOGIN.getValue()) {
                    Map<String, Object> otherMap = JSONUtil.toMap(cause.optJSONObject("redirect"));
                    if (otherMap == null) {
                        otherMap = new HashMap<>();
                    }
                    Map<String, Object> customMap = callback.onClickHandle(otherMap);
                    if (customMap != null) {
                        if (ObjectUtils.toBoolean(customMap.get("break"))) {
                            RXLogger.i("The request is break");
                            return;
                        } else {
                            otherMap.putAll(customMap);
                        }
                    }
                    boolean need_show_ui = cause.optBoolean("need_show_ui", false);
                    if (need_show_ui) {
                        String method = (String) otherMap.get("method");
                        LoginUIConfig loginUIConfig = new LoginUIConfig();

//                        //新需求 当不支持用户名登录，但支持验证码登录时，启用 CaptchaLogin 模式。 如果任一条件不满足，CaptchaLogin 则为 false。
//                        loginUIConfig.setCaptchaLogin(!loginUIConfig.getLoginMethodList().contains(LoginMethod.USERNAME) && loginUIConfig.getLoginMethodList().contains(LoginMethod.CAPTCHACODE));
                        loginUIConfig.setCaptchaLogin(LoginMethod.CAPTCHACODE.equals(method));
                        loginUIConfig.setLoginMethods((List<String>) otherMap.get("other_methods"));
                        loginUIConfig.setShowBackBtn(true);
                        loginUIConfig.setAgreedPrivacy(AliAuthUI.getInstance().isProtocolAgreed());
                        IRXView loginView = RXSdkUI.getInstance().loginUI(activity, loginUIConfig, handleCallback(false, callback));
                        if (loginView instanceof LoginBaseView) {
                            LoginBaseView loginBaseView = (LoginBaseView) loginView;
                            loginBaseView.setOnViewBackListener((v, agreePrivacy) -> AliAuthUI.getInstance().setProtocolAgreed(agreePrivacy));
                        }
                        loginView.show();
                    } else if (code == RXErrorCode.THIRD_LOGIN_ERROR.getValue()) {
                        // 新需求阿里一键登录失败就跳转至密码登录页
                        LoginUIConfig loginUIConfig = new LoginUIConfig();
                        boolean showBackBtn = cause.optBoolean("showBackBtn", false);
                        loginUIConfig.setShowBackBtn(showBackBtn);

                        //新需求 当不支持用户名登录，但支持验证码登录时，启用 CaptchaLogin 模式。 如果任一条件不满足，CaptchaLogin 则为 false。
                        loginUIConfig.setCaptchaLogin(!loginUIConfig.getLoginMethodList().contains(LoginMethod.USERNAME) && loginUIConfig.getLoginMethodList().contains(LoginMethod.CAPTCHACODE));
                        RXSdkUI.getInstance().loginUI(activity, loginUIConfig, handleCallback(false, callback)).show();
                    } else {
                        RuiXueSdk.login(activity, otherMap, handleCallback(true, callback));
                    }
                } else {
                    callback.onFailed(cause);
                }
            }
        });
    }

    private RXUICallback handleCallback(boolean isLoginQuick, @NonNull RXUICallback callback) {
        Activity activity = RuiXueSdk.getCurrentActivity();
        LoadingDialog loadingDialog = null;
        if (isLoginQuick && activity != null) {
            loadingDialog = LoadingDialog.create(activity);
            loadingDialog.showDelay(500).closeDelay(7000);
        }
        LoadingDialog finalLoadingDialog = loadingDialog;
        return new RXUICallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                return callback.onClickHandle(params);
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                AliAuthUI.getInstance().dismiss();
                if (isLoginQuick) {
                    AccountHelper.updateAccountCache(RuiXueSdk.getLoginData(), null);
                }
                if (finalLoadingDialog != null) {
                    finalLoadingDialog.close();
                }
                callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (finalLoadingDialog != null)
                    finalLoadingDialog.close();
                try {
                    if (!cause.has("show")) {
                        cause.put("show", isLoginQuick);
                    }
                } catch (JSONException ignore) {
                }
                callback.onFailed(cause);
            }
        };
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        AliAuthUI.getInstance().showLoginUI(activity, paramsMap, callback);
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }
}
