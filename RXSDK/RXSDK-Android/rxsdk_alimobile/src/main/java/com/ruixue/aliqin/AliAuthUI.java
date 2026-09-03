package com.ruixue.aliqin;

import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.LinearInterpolator;
import android.widget.Button;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.mobile.auth.gatewayauth.AuthRegisterViewConfig;
import com.mobile.auth.gatewayauth.PhoneNumberAuthHelper;
import com.mobile.auth.gatewayauth.ResultCode;
import com.mobile.auth.gatewayauth.TokenResultListener;
import com.mobile.auth.gatewayauth.model.TokenRet;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.alimobile.R;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.view.AppPrivacyView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public class AliAuthUI implements IRXView {
    private static final String TAG = "AliAuthUI";

    public static final int ACTIVITY_REQUEST_CODE = 1;

    private PhoneNumberAuthHelper mAliAuthHelper;

    private OnDismissListener onDismissListener;

    boolean isVisible = false;
    private Context mContext;

//    static final Map<String, Integer> otherLoginMethods = new HashMap<>();
//
//
//w
//    static {
//        otherLoginMethods.put(LoginMethod.GUEST, R.id.btn_login_guest);
//        otherLoginMethods.put(LoginMethod.USERNAME, R.id.btn_login_username);
//        otherLoginMethods.put(LoginMethod.WECHAT, R.id.btn_login_wechat);
//
//    }

    /**
     * 超时时间（单位：ms）
     */
    public static final int TOTAL_TIMEOUT = 3000;

    @SuppressLint("StaticFieldLeak")
    private static AliAuthUI _instance = null;

    public static AliAuthUI getInstance() {
        if (null == _instance) {
            _instance = new AliAuthUI();
        }
        return _instance;
    }

    public static IRXView create(Context context, Map<String, Object> params, RXJSONCallback callback) {
        return getInstance();
    }

    public static void doLogin(Context context, Map<String, Object> map, RXJSONCallback callback) {
        getInstance().showLoginUI(context, map, callback);
    }

    public static void closeUI() {
        getInstance().dismiss();
    }

    public void setOnDismissListener(OnDismissListener onDismissListener) {
        this.onDismissListener = onDismissListener;
    }

    /**
     * 返回默认上⽹卡运营商
     * @return CMCC、CUCC、CTCC
     */
    public static String getDeviceCurrentCarrierName(Context context) {
        return getInstance().getCurrentCarrierName(context);
    }

    public void checkEnvAvailable(Context context, RXJSONCallback callback) {
        try {
            PhoneNumberAuthHelper.getInstance(context, getTokenResultListener(null, null, callback)).checkEnvAvailable(PhoneNumberAuthHelper.SERVICE_TYPE_AUTH);
        } catch (Exception e) {
            callback.onError(new RXException(e));
        }
    }

    private boolean showBackBtn = false;

    @SuppressWarnings("unchecked")
    public IRXView showLoginUI(Context context, Map<String, Object> params, RXJSONCallback callback) {
        if (isShowing()) {
            dismiss();
        }

        mContext = context;
        Map<String, Object> map = params;

        if (params.containsKey("ext")) {
            Map<String, Object> ext = (Map<String, Object>) params.get("ext");
            if (ext != null)
                map.putAll(ext);

        }
        if (map != null) {
            // 这里 hack 一下，由于上面 map 经过 ext 流转，所以这个参数得从 params 中取
            if (params.get("showBackBtn") != null) {
                try {
                    showBackBtn = (boolean) params.get("showBackBtn");
                    map.put("showBackBtn", params.get("showBackBtn"));
                } catch (Exception ignore) {
                }
            }
            String alikey = (String) map.get("alikey");
            if (TextUtils.isEmpty(alikey)) {
                alikey = (String) map.get("quickphone_key");
            }
            if (TextUtils.isEmpty(alikey)) {
                alikey = RXGlobalData.getQuickPhoneKey();
            }
            if (TextUtils.isEmpty(alikey) && callback != null) {
                Map<String, Object> jsonMap = new HashMap<>();
                jsonMap.put("showBackBtn", showBackBtn);

                Map<String, Object> properties = new HashMap<>();
                properties.put("error_code", RXErrorCode.THIRD_LOGIN_ERROR.getValue());
                properties.put("error_msg", "登录错误，alikey 参数为空");
                userActionTrack("show_fail", properties);
                callback.onFailed(JSONUtil.toJSONObject(jsonMap, RXErrorCode.THIRD_LOGIN_ERROR.getValue(), "登录错误，alikey 参数为空", ""));
                return this;
            }

            AliAuthUIConfig aliUIConfig = AliAuthUIConfig.fromMap(context, map);
            PhoneNumberAuthHelper authHelper = PhoneNumberAuthHelper.getInstance(context, getTokenResultListener(params, aliUIConfig, callback));
            authHelper.expandAuthPageCheckedScope(true);
            authHelper.getReporter().setLoggerEnable(true);
            authHelper.setAuthSDKInfo(alikey);
            authHelper.keepAuthPageLandscapeFullSreen(true);
            authHelper.keepAllPageHideNavigationBar();
            authHelper.setAuthPageUseDayLight(false);

            authHelper.addAuthRegisterXmlConfig(aliUIConfig.createAuthRegisterXmlConfig(context, new AuthUIClickListener() {
                @Override
                public void onClickClose(int code, String msg) {
                    dismiss();
                    if (callback != null)
                        callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(code, msg));
                    userActionTrack("close", null);
                }

                @Override
                public void onClickOtherLogin(String method, Map<String, Object> m) {


                    doOtherLogin(method, map, aliUIConfig, callback);
                }
            }));

//            authHelper.addAuthRegisterXmlConfig(aliUIConfig.createAuthRegisterXmlConfig(new AuthUIControlClickListener() {
//                @Override
//                public void onClick(String code, Context context, String jsonString) {
//                    if (Objects.equals(code, "700000") || Objects.equals(code, "700001")) {
//                        dismiss();
//                        if (callback != null)
//                            callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(code, jsonString));
//                    }
//                }
//            }));
//

//            addCustomLayout(context, map, callback, authHelper, aliUIConfig);
            if (RuiXueSdk.getLoginMethod().equals(LoginMethod.QUICKPHONE)) {
                // 显示上次登录
                addLastLoginView(context, authHelper, aliUIConfig);
            }
            addPrivacyXml(context, authHelper, aliUIConfig);
            authHelper.setAuthUIConfig(aliUIConfig.createAuthUIConfig());

            authHelper.setUIClickListener((s, context1, s1) -> {
                // 700000	点击返回，⽤户取消免密登录。
                //700001	点击切换按钮，⽤户取消免密登录。
                //700002	点击登录按钮事件。
                //700003	点击check box事件。
                //700004	点击协议富文本文字事件。
                //700006	点击一键登录拉起授权页二次弹窗。
                //700007	隐私协议二次弹窗关闭。
                //700008	点击隐私协议二次弹窗上同意并继续。
                //700009	点击隐私协议二次弹窗上的协议富文本文字。
                try {
                    if (s1 != null) {
                        JSONObject jsonObject = JSONUtil.toJSONObject(s1);
                        int code = Integer.parseInt(s);
                        if (code == 700003) {
                            boolean isChecked = jsonObject.optBoolean("isChecked");
                            isProtocolAgreed = isChecked;
                            if (isChecked) {
                                RXSdkApi.getInstance().setPrivacyAgree(context1, isChecked, null);
                            }
                        }
                        if (code == 700004 || code == 700009) {
                            String url = jsonObject.optString("url");
                            Map<String, Object> properties = new HashMap<>();
                            properties.put("url", url);
                            userActionTrack("privacy", properties);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            this.mAliAuthHelper = authHelper;
            show();
            userActionTrack("show", null);
        }
        return this;
    }

//    @SuppressWarnings("unchecked")
//    private void addCustomLayout(Context context, Map<String, Object> map, RXJSONCallback callback, PhoneNumberAuthHelper authHelper, AliAuthUIConfig aliUIConfig) {
//        List<String> allLoginMethods = aliUIConfig.getCustomLoginMethods();
//        List<String> loginMethods = new ArrayList<>();
//        loginMethods.add(LoginMethod.USERNAME);
//        if (allLoginMethods != null) {
//            for (int i = 0; i < allLoginMethods.size(); i++) {
//                String method = allLoginMethods.get(i);
////                if (LoginMethod.QUICKPHONE.equals(method)) {
////                    continue;
////                }
//                if (LoginMethod.USERNAME.equals(method) || LoginMethod.CAPTCHACODE.equals(method) || LoginMethod.QUICKPHONE.equals(method)) {
//                    continue;
//                }
//                loginMethods.add(method);
//            }
//        }
//
//
//
//        int paddingTop = AppUtils.dp2px(context, aliUIConfig.getCustomLayY());
//
//        // 增加一个固定的账号登录快捷入口，用线性布局添加这个 View 和原来的 登录入口集合
//        RelativeLayout.LayoutParams containerLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
//        containerLayoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
//
//        LinearLayout container = new LinearLayout(context);
//        container.setOrientation(LinearLayout.VERTICAL);
//        container.setGravity(Gravity.CENTER_HORIZONTAL);
//        container.setClipChildren(false);
//        container.setClipToPadding(false);
//        container.setPadding(0, paddingTop, 0, 0);
//        container.setBackgroundColor(Color.BLUE);
//        if (!loginMethods.isEmpty()) {
//
//            View customView = LayoutInflater.from(context).inflate(R.layout.ali_custom_layout, new RelativeLayout(context), false);
//
//            LinearLayout.LayoutParams loginLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
////            loginLayoutParams.topMargin = AppUtils.dp2px(context, com.ruixue.utils.AppUtils.isUsePortMatch(context) ? 8 : 12);
////
//            LoginButtonGroup loginButtonGroup = customView.findViewById(R.id.login_btn_group);
//            int size = 4;// com.ruixue.utils.AppUtils.isUsePortMatch(context) ? 4 : 3;
//            loginButtonGroup.setLoginMethods(loginMethods, loginMethods.size() > size);
//            loginButtonGroup.setLoginButtonClickListener(method -> {
//                doOtherLogin(method, map, aliUIConfig, callback);
//            });
//
//            container.addView(customView);
//            customView.setLayoutParams(loginLayoutParams);
//        }
////        container.setLayoutParams(containerLayoutParams);
//        //防止重复调用时，自定义ui显示不出来
//        ThreadUtils.getMainLooperHandler().post(new Runnable() {
//            @Override
//            public void run() {
//                authHelper.addAuthRegisterXmlConfig(new AuthRegisterXmlConfig.Builder().setLayout(R.layout.ali_custom_layout, new AbstractPnsViewDelegate() {
//                    @Override
//                    public void onViewCreated(View customView) {
//                        List<String> allLoginMethods = aliUIConfig.getCustomLoginMethods();
//                        List<String> loginMethods = new ArrayList<>();
//                        loginMethods.add(LoginMethod.USERNAME);
//                        if (allLoginMethods != null) {
//                            for (int i = 0; i < allLoginMethods.size(); i++) {
//                                String method = allLoginMethods.get(i);
////                if (LoginMethod.QUICKPHONE.equals(method)) {
////                    continue;
////                }
//                                if (LoginMethod.USERNAME.equals(method) || LoginMethod.CAPTCHACODE.equals(method) || LoginMethod.QUICKPHONE.equals(method)) {
//                                    continue;
//                                }
//                                loginMethods.add(method);
//                            }
//                        }
//
//
//
//                        int paddingTop = AppUtils.dp2px(context, aliUIConfig.getCustomLayY());
//                        LoginButtonGroup loginButtonGroup = customView.findViewById(R.id.login_btn_group);
//                        int size = 4;// com.ruixue.utils.AppUtils.isUsePortMatch(context) ? 4 : 3;
//                        loginButtonGroup.setLoginMethods(loginMethods, loginMethods.size() > size);
//                        loginButtonGroup.setLoginButtonClickListener(method -> {
//                            doOtherLogin(method, map, aliUIConfig, callback);
//                        });
//                    }
//                }).build());
//                authHelper.addAuthRegistViewConfig("other_login_method", new AuthRegisterViewConfig.Builder().setRootViewId(AuthRegisterViewConfig.RootViewId.ROOT_VIEW_ID_BODY).setView(container).build());
//            }
//        });
//    }

    private void startVerticalLoopAnimation(View rxLoginLast) {
        if (null != rxLoginLast) {
            float distanceUp = -6f;
            long duration = 400;
            // 创建一个从 0 到 1 的 ValueAnimator
            ValueAnimator animator = ValueAnimator.ofFloat(0, 1);
            animator.setDuration(duration * 2); // 每次完整循环持续时间为 duration * 2
            animator.setInterpolator(new LinearInterpolator());
            animator.setRepeatCount(ValueAnimator.INFINITE); // 无限循环
            animator.addUpdateListener(animation -> {
                float animatedValue = (float) animation.getAnimatedValue();
                float translationY;

                if (animatedValue <= 0.5f) {
                    // 第一半程：向上移动
                    translationY = animatedValue * 2 * distanceUp;
                } else {
                    // 第二半程：向下移动
                    translationY = (1 - (animatedValue - 0.5f) * 2) * distanceUp;
                }
                rxLoginLast.setTranslationY(translationY);
            });
            animator.start();
        }
    }

    private void addLastLoginView(Context context, PhoneNumberAuthHelper authHelper, AliAuthUIConfig aliUIConfig) {
        RelativeLayout.LayoutParams containerLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
//        containerLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        RelativeLayout container = new RelativeLayout(context);
        container.setClipChildren(false);
        container.setClipToPadding(false);

        int paddingTop = AppUtils.dp2px(context, aliUIConfig.getLoginBtnY() - 20);
        container.setPadding(0, paddingTop, AppUtils.dp2px(context, 30), 0);

        @SuppressLint("InflateParams") View view = LayoutInflater.from(context).inflate(R.layout.rx_last_login, null);
        view.setVisibility(View.VISIBLE);
        startVerticalLoopAnimation(view);
        // 设置 view 的布局参数，使其在 container 的最右边
        RelativeLayout.LayoutParams viewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        viewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_END); // 对齐到 container 的最右边
        view.setLayoutParams(viewLayoutParams);
        container.addView(view);
        container.setLayoutParams(containerLayoutParams);

//        authHelper.addAuthRegisterXmlConfig(new AuthRegisterXmlConfig());
        authHelper.addAuthRegistViewConfig("last_login", new AuthRegisterViewConfig.Builder().setRootViewId(AuthRegisterViewConfig.RootViewId.ROOT_VIEW_ID_BODY).setView(container).build());
    }


    private void addPrivacyXml(Context context, PhoneNumberAuthHelper authHelper, AliAuthUIConfig aliUIConfig) {
        RelativeLayout.LayoutParams containerLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);

        containerLayoutParams.addRule(RelativeLayout.CENTER_VERTICAL);
        RelativeLayout container = new RelativeLayout(context);

        // 设置 view 的布局参数，使其在 container 的最右边
//        RelativeLayout.LayoutParams viewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
//        viewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_END); // 对齐到 container 的最右边
//        view.setLayoutParams(viewLayoutParams);
        container.setLayoutParams(containerLayoutParams);
// 创建并配置 Button 的布局参数，使其垂直居中
        RelativeLayout.LayoutParams buttonLayoutParams = new RelativeLayout.LayoutParams(AppUtils.dp2px(context, aliUIConfig.getPrivacyAlertBtnWidth()), AppUtils.dp2px(context, 38));

        buttonLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP); // 垂直居中
        buttonLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_START); // 水平靠左
        buttonLayoutParams.leftMargin = AppUtils.dp2px(context, aliUIConfig.getPrivacyAlertBtnHorMargin());
        buttonLayoutParams.topMargin = AppUtils.dp2px(context, aliUIConfig.getPrivacyAlertBtnOffsetY());

        Button cancelBtn = new Button(context);
        cancelBtn.setId(R.id.cancel_btn);
        cancelBtn.setLayoutParams(buttonLayoutParams);
        cancelBtn.setPadding(0, 0, 0, 2);
        cancelBtn.setBackground(ContextCompat.getDrawable(context, R.drawable.shape_btn_2_normal));
        cancelBtn.setStateListAnimator(null); // 禁用按钮的默认点击动画
        cancelBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                authHelper.removePrivacyAuthRegisterViewConfig();
                authHelper.quitPrivacyPage();
            }
        });
        cancelBtn.setText(R.string.txt_disagree);
        cancelBtn.setTextColor(ContextCompat.getColor(context, R.color.color_20c0b3));
        cancelBtn.setTextSize(16);
        container.addView(cancelBtn);

        authHelper.addPrivacyAuthRegistViewConfig("rx_privacy", new AuthRegisterViewConfig.Builder().setRootViewId(AuthRegisterViewConfig.RootViewId.ROOT_VIEW_ID_NUMBER).setView(container).build());

    }


    public PhoneNumberAuthHelper getPhoneNumberAuthHelper() {
        return this.mAliAuthHelper;
    }

    //700000	点击返回，⽤户取消免密登录。
    //700001	点击切换按钮，⽤户取消免密登录。
    //700002	点击登录按钮事件。
    //700003	点击check box事件。
    //700004	点击协议富文本文字事件。
    //700006	点击一键登录拉起授权页二次弹窗。
    //700007	隐私协议二次弹窗关闭。
    //700008	点击隐私协议二次弹窗上同意并继续。
    //700009	点击隐私协议二次弹窗上的协议富文本文字。
    @NonNull
    private TokenResultListener getTokenResultListener(Map<String, Object> params, AliAuthUIConfig aliUIConfig, RXJSONCallback callback) {
        AtomicBoolean haveShown = new AtomicBoolean(false);
        TokenResultListener tokenListener = new TokenResultListener() {
            @Override
            public void onTokenSuccess(String s) {
                Log.i(TAG, "on token success=" + s);

                TokenRet tokenRet = TokenRet.fromJson(s);
                String resultCode = tokenRet.getCode();
                if (ResultCode.CODE_START_AUTHPAGE_SUCCESS.equals(resultCode)) {
                    isVisible = true;
                    haveShown.set(true);
                    Log.i(TAG, "拉起授权页成功: " + s);
                    closeLoading();
                    userActionTrack("show_success", null);
                } else if (ResultCode.CODE_SUCCESS.equals(resultCode)) {

                    Log.i(TAG, "获取 token 成功：" + s);
                    dismiss();

                    try {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.putOpt("access_token", tokenRet.getToken());
                        if (null != callback)
                            callback.onSuccess(jsonObject);
                    } catch (JSONException e) {
                        e.printStackTrace();
                        if (null != callback)
                            callback.onError(new RXException(RXErrorCode.LOGIN_ERROR.getValue(), e).setExt("show", haveShown.get()));
                    }
                }
            }

            @Override
            public void onTokenFailed(String s) {
                Log.e(TAG, "rxsdk on token fail=" + s);
                try {
                    TokenRet tokenRet = TokenRet.fromJson(s);
                    int resultCode = Integer.parseInt(tokenRet.getCode());
                    if (null != callback) {
                        if (resultCode == 700000 || resultCode == 700001) {
                            callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(toMap(resultCode, tokenRet.getMsg(), tokenRet.getRequestId(), haveShown.get())));
                            userActionTrack("close", null);
                            dismiss();
                        } else {
                            if (haveShown.get()) { // 已经展示了，直接提示
                                if (mAliAuthHelper != null) {
                                    mAliAuthHelper.hideLoginLoading();
                                }
                                showLoginFailedAlert(params, aliUIConfig, callback);
                                Map<String, Object> properties = new HashMap<>();
                                properties.put("error_code", resultCode);
                                properties.put("error_msg", tokenRet.getMsg());
                                userActionTrack("fail", properties);
                            } else { // 没展示授权，说明拉取失败，按原逻辑直接跳转账号密码登录
                                Map<String, Object> properties = new HashMap<>();
                                properties.put("error_code", resultCode);
                                properties.put("error_msg", tokenRet.getMsg());
                                userActionTrack("show_fail", properties);

                                Map<String, Object> jsonMap = new HashMap<>();
                                jsonMap.put("showBackBtn", showBackBtn);
                                callback.onFailed(JSONUtil.toJSONObject(jsonMap, RXErrorCode.THIRD_LOGIN_ERROR.getValue(), "请重试或使用其他登录方式", ""));
                                dismiss();
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    if (null != callback)
                        callback.onError(new RXException(RXErrorCode.LOGIN_ERROR.getValue(), e).setExt("show", haveShown.get()));
                }
            }
        };
        return tokenListener;
    }


    private final Handler handler = new Handler(Looper.getMainLooper());

    //阿里错误提示框
    private void showLoginFailedAlert(Map<String, Object> params, AliAuthUIConfig aliUIConfig, RXJSONCallback callback) {
        closeLoading();
        AliLoginAlertView dialog = AliLoginAlertView.create(RuiXueSdk.getCurrentActivity()).setOtherLoginMethods(aliUIConfig.getCustomLoginMethods()).setShowCloseBtn(true).setCallback(new AliLoginAlertView.AliFailedCallback() {
            @Override
            public void onCancel() {

            }

            @Override
            public void onOtherLogin(String loginMethod) {
                doOtherLogin(loginMethod, params, aliUIConfig, callback);
            }
        });

        dialog.show();
//        handler.postDelayed(dialog::show, 300);
    }

    private boolean isProtocolAgreed = false;

    public boolean isProtocolAgreed() {
        return isProtocolAgreed;
    }

    public void setProtocolAgreed(boolean agreed) {
        if (mAliAuthHelper != null) {
            mAliAuthHelper.setProtocolChecked(agreed);
        }
    }

    @SuppressWarnings("unchecked")
    private void doOtherLogin(String method, Map<String, Object> map, AliAuthUIConfig aliUIConfig, RXJSONCallback callback) {
        boolean need_show_ui = method.equals(LoginMethod.USERNAME) || method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.MORE);
        if (!need_show_ui && !isProtocolAgreed) {
            LinkedHashMap<String, String> privacyMap = getPrivacyMap(map);

            String privacy = RuiXueSdk.getCurrentActivity().getString(com.ruixue.ui.R.string.rx_txt_privacy_sure) + getPrivacyLinkString(privacyMap);
            AppPrivacyView.create(RuiXueSdk.getCurrentActivity(), privacy, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    setProtocolAgreed(true);
                    doOtherLogin(method, map, aliUIConfig, callback);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
//                    ToastUtils.showToast(getContext(), RXErrorCode.DISAGREE_PRIVACY.getDesc());
                    setProtocolAgreed(false);
                }
            }).show();
//            ToastUtils.showToast(RuiXueSdk.getCurrentActivity(), "请先同意用户协议与隐私政策");
            return;
        }
//                if (need_show_ui) {
//                    dismiss();
//                }

        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("method", method);

        Map<String, Object> redirectMap = new HashMap<>();

        if (method.equals(LoginMethod.WECHAT) && !TextUtils.isEmpty(aliUIConfig.getWXAppid())) {
            redirectMap.put("appid", aliUIConfig.getWXAppid());
        }
        if (map.containsKey("ext") && map.get("ext") != null) {
            redirectMap.putAll((Map<String, Object>) Objects.requireNonNull(map.get("ext")));
        }
        redirectMap.put("method", method);

        // 进行登录重定向
        jsonMap.put("redirect", redirectMap);

        jsonMap.put("need_show_ui", need_show_ui);
        if (map.containsKey("redirectLogin")) {
            jsonMap.put("redirectLogin", need_show_ui ? false : map.get("redirectLogin"));
        } else {
            jsonMap.put("redirectLogin", false);
        }
        if (null != callback)
            callback.onFailed(JSONUtil.toJSONObject(jsonMap, RXErrorCode.OTHER_LOGIN.getValue(), "点击其他登录方式", ""));
    }

    private String getPrivacyTitleString(LinkedHashMap<String, String> privacyMap) {
        StringBuilder agreement = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = privacyMap.entrySet().iterator();
        int i = 0;
        while (it.hasNext() && i < 2) {
            Map.Entry<String, String> item = it.next();
            agreement.append(item.getValue());
            if (i < 1) {
                agreement.append(RuiXueSdk.getCurrentActivity().getString(com.ruixue.ui.R.string.rx_txt_and));
            }
            i++;
        }
        return agreement.toString();
    }

    private String getPrivacyLinkString(LinkedHashMap<String, String> privacyMap) {
        StringBuilder agreement = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = privacyMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> item = it.next();
            agreement.append(String.format("<a href='%s' >%s</a>", item.getKey(), item.getValue()));
            if (it.hasNext()) {
                agreement.append("、");
            }
        }
        return agreement.toString();
    }


    public LinkedHashMap<String, String> getPrivacyMap(Map<String, Object> map) {
        LinkedHashMap<String, String> privacyMap = new LinkedHashMap<>();
        try {
            if (map.containsKey("privacyOneUrl") && map.containsKey("privacyOneStr")) {
                String privacyOneUrl = (String) map.get("privacyOneUrl");
                String privacyOneStr = (String) map.get("privacyOneStr");
                if (!TextUtils.isEmpty(privacyOneUrl)) {
                    privacyMap.put(privacyOneUrl, privacyOneStr);
                }
            }

            if (map.containsKey("privacyTwoUrl") && map.containsKey("privacyTwoStr")) {
                String privacyTwoUrl = (String) map.get("privacyTwoUrl");
                String privacyTwoStr = (String) map.get("privacyTwoStr");
                if (!TextUtils.isEmpty(privacyTwoUrl)) {
                    privacyMap.put(privacyTwoUrl, privacyTwoStr);
                }
            }

            if (map.containsKey("privacyThreeUrl") && map.containsKey("privacyThreeStr")) {
                String privacyThreeUrl = (String) map.get("privacyThreeUrl");
                String privacyThreeStr = (String) map.get("privacyThreeStr");
                if (!TextUtils.isEmpty(privacyThreeUrl)) {
                    privacyMap.put(privacyThreeUrl, privacyThreeStr);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            RXLogger.e(e.getMessage());
        }

        // 和陈汉确认 iOS 有默认值，android 同步一下
        if (privacyMap.isEmpty()) {
            privacyMap.put(RuiXueSdk.getFirstBaseUrl() + "static/landing/#/v1/legal/terms/" + RuiXueSdk.getProductId() + "/" + RuiXueSdk.getChannelId() + "/00001", "用户协议");
            privacyMap.put(RuiXueSdk.getFirstBaseUrl() + "static/landing/#/v1/legal/terms/" + RuiXueSdk.getProductId() + "/" + RuiXueSdk.getChannelId() + "/00002", "隐私政策");
        }

        return privacyMap;
    }

    public Map<String, Object> toMap(Object thirdCode, String thirdMsg, String traceId, boolean shown) {
        Map<String, Object> map = new HashMap<>();
        map.put("thirdcode", thirdCode);
        map.put("thirdmsg", thirdMsg);
        if (!TextUtils.isEmpty(traceId)) {
            map.put("trace_id", traceId);
        }
        map.put("show", shown);
        return map;
    }

    public String getCurrentCarrierName(Context context) {
        PhoneNumberAuthHelper authHelper = PhoneNumberAuthHelper.getInstance(context, getTokenResultListener(null, null, null));
        return authHelper.getCurrentCarrierName();
    }

    LoadingDialog loadingDialog = null;

    @Override
    public void show() {
        if (mContext != null) {
            loadingDialog = LoadingDialog.create(mContext);
            loadingDialog.showDelay(500).closeDelay(TOTAL_TIMEOUT);
        }
        //* 获取登录Token调起⼀键登录授权⻚⾯，在用户授权后获取⼀键登录的Token
        if (mAliAuthHelper != null && !isVisible) {
            mAliAuthHelper.getLoginToken(mContext, TOTAL_TIMEOUT);
            isVisible = true;
        }
    }

    @Override
    public void cancel() {
        dismiss();
    }

    @Override
    public void dismiss() {
        isVisible = false;
        isProtocolAgreed = false;
        PhoneNumberAuthHelper phoneNumberAuthHelper = getPhoneNumberAuthHelper();
        if (phoneNumberAuthHelper != null) {
            phoneNumberAuthHelper.removeAuthRegisterXmlConfig();
            phoneNumberAuthHelper.removeAuthRegisterViewConfig();
            phoneNumberAuthHelper.quitLoginPage();
            if (onDismissListener != null) {
                onDismissListener.onDismiss(this);
            }
        }
        handler.removeCallbacksAndMessages(null);
        closeLoading();
    }

    private void closeLoading() {
        if (loadingDialog != null) {
            loadingDialog.close();
            loadingDialog = null;
        }
    }

    @Override
    public IRXView setCancelable(boolean flag) {
        return null;
    }

    @Override
    public IRXView setCanceledOnTouchOutside(boolean cancel) {
        return null;
    }

    @Override
    public boolean isCancelable() {
        return true;
    }

    @Override
    public boolean isShowing() {
        return isVisible;
    }

    private void userActionTrack(String action, Map<String, Object> ext) {
        Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("login", "quickphone", action);
        if (ext != null && !ext.isEmpty()) {
            properties.putAll(ext);
        }
        UserActionTrackManager.getInstance().reportUserAction(properties);
    }
}
