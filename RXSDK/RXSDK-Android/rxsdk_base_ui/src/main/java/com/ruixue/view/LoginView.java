package com.ruixue.view;

import android.animation.AnimatorSet;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.callback.RXUICallback;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.openapi.Constants;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.MobileUtils;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.PwdEditText;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class LoginView extends LoginBaseView {

    public LoginView(Context context) {
        super(context);
    }

    public static LoginView create(Context context, boolean isCaptcha) {
        return new LoginView(context).setCaptchaLogin(isCaptcha);
    }

    private @Constants.RegisterType int loginType = Constants.REGISTER_TYPE_USERNAME;

    private String usernameHintText;

    private String usernameText;
    private boolean isCaptchaLogin;
    private String forgotUrl;
    private boolean useH5ForgotPwd = true;
    EditText username;
    PwdEditText et_password;
    RelativeLayout rl_password;
    RelativeLayout rl_captcha;
    EditText et_captcha;
    Button login;
    View view;
//    TextView changePassBtn;
//    TextView changeCaptchaBtn;

//    // 是否自动切换到验证码登录
//    private boolean hasPhoneQuickChangeToCaptcha = false;

    public boolean isCaptchaLogin() {
        return isCaptchaLogin;
    }

    public void setForgotUrl(String forgotUrl) {
        if (!TextUtils.isEmpty(forgotUrl) && !forgotUrl.startsWith("http")) {
            String baseUrl = RuiXueSdk.getFirstBaseUrl();
            baseUrl += baseUrl.endsWith("/") ? "" : "/";
            forgotUrl = baseUrl + forgotUrl;
        }
        this.forgotUrl = forgotUrl;
    }

    public void setLoginType(int login_type) {
        if (login_type != 0) {
            this.loginType = login_type;
        }
    }

    public LoginView setCaptchaLogin(boolean isCaptcha) {
        this.isCaptchaLogin = isCaptcha;
        return this;
    }

    public void setUseH5ForgotPwd(boolean useH5ForgotPwd) {
        this.useH5ForgotPwd = useH5ForgotPwd;
    }

    @Override
    public int getResId() {
//        return AppUtils.isUsePortMatch(getContext()) ? R.layout.rx_login_port : R.layout.rx_login;
        return R.layout.rx_login;
    }

    public void reset() {
        if (this.username != null) {
            this.username.setText("");
        }
        if (this.et_password != null) {
            this.et_password.setText("");
        }
        if (this.et_captcha != null) {
            this.et_captcha.setText("");
        }
    }

    @Override
    public void show() {
        super.show();
    }

    protected List<String> loginTmpMethods;

    /**
     * @param usernameHintText 用户名提示文本
     */
    public LoginView setUsernameHintText(String usernameHintText) {
        this.usernameHintText = usernameHintText;
        return this;
    }

    public LoginView setUsername(String username) {
        this.usernameText = username;
//        if (this.username != null) {
//            this.username.setText(username);
//        }
        return this;
    }

    @Override
    public void setLoginMethods(List<String> loginMethods) {
        loginTmpMethods = loginMethods;
        List<String> methods = new ArrayList<>();
        if (loginMethods != null) {
            for (String method : loginMethods) {
                // 三种方式都不在底部展示，改成在上面切换
//                if (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME) || method.equals(LoginMethod.QUICKPHONE)) {
//                    continue;
//                }
                if (method.equals(LoginMethod.QUICKPHONE)) {
                    continue;
                }
                if (isCaptchaLogin) {
                    if (method.equals(LoginMethod.CAPTCHACODE)) {
                        continue;
                    }
                } else if (method.equals(LoginMethod.USERNAME)) {
                    continue;
                }
                methods.add(method);
            }
        }
        super.setLoginMethods(methods);
    }

    //需求改成只显示关闭
    public LoginView setBackEnable(boolean backEnable) {
//        this.goBackEnable = backEnable;
        return this;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        this.view = view;
        username = view.findViewById(R.id.username);
        et_password = view.findViewById(R.id.password);
        et_captcha = view.findViewById(R.id.et_captcha);

        TextView findpass = view.findViewById(R.id.findpass);
        TextView tv_get_captcha = view.findViewById(R.id.tv_get_captcha);
        login = view.findViewById(R.id.login_default);
//        if (AppUtils.isUsePortMatch(getContext())) {
//            LinearLayout ly_content = view.findViewById(R.id.ly_content);
//            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) ly_content.getLayoutParams();
//            layoutParams.leftMargin = getContext().getResources().getDimensionPixelSize(R.dimen.dp_19);
//            layoutParams.rightMargin = layoutParams.leftMargin;
//            layoutParams.topMargin = getContext().getResources().getDimensionPixelSize(R.dimen.dp_15);
//        }
        //        if (AppUtils.isUsePortMatch(getContext())) {
//            updateViewHeight(username, 40);
//            updateViewHeight(et_password, 40);
//            updateViewHeight(et_captcha, 40);
//            updateViewMarginTop(view.findViewById(R.id.rl_password), 12);
//            updateViewMarginTop(view.findViewById(R.id.rl_captcha), 12);
//            updateViewMarginTop(view.findViewById(R.id.login_default), 16);
//            view.findViewById(R.id.otherBottomLayout).setPadding(0, AppUtils.dp2px(getContext(), 14), 0, 0);
//            updateViewMarginTop(view.findViewById(R.id.ll_privacy), 5);
//            CheckBox checkBox = view.findViewById(R.id.ischeck);
//            checkBox.setTextSize(14);
//            TextView tvPrivacy = view.findViewById(R.id.xieyi);
//            tvPrivacy.setTextSize(14);
//        }

        rl_password = view.findViewById(R.id.rl_password);
        rl_captcha = view.findViewById(R.id.rl_captcha);


        username.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
//                // 如果是忘记密码回来设置的时候，这里不响应，否则横竖屏切换会重影
//                if (isResetPassword) {
//                    return;
//                }
//                String accountStr = username.getText().toString().trim();
//                if (accountStr.length() != 11) {
//                    return;
//                }
//                if (!hasPhoneQuickChangeToCaptcha && !isCaptchaLogin && MobileUtils.isMobileNO(accountStr) && password.getEditText().getText().length() == 0) {
//                    changePwdOrCaptchaLogin(true, true);
//                    hasPhoneQuickChangeToCaptcha = true;
//                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

//        changeCaptchaBtn = view.findViewById(R.id.changeCaptcha);
//        changePassBtn = view.findViewById(R.id.changePass);
//
//        // 默认状态就是账号密码登录，设置一下
//        changeCaptchaBtn.setVisibility(View.VISIBLE);
//        changePassBtn.setVisibility(View.INVISIBLE);

//        rl_password.setVisibility(View.VISIBLE);
//        rl_captcha.setVisibility(View.INVISIBLE);

//        changePassBtn.setOnClickListener(v -> {
//            changePwdOrCaptchaLogin(false, true);
//        });
//
//        changeCaptchaBtn.setOnClickListener(v -> {
//            changePwdOrCaptchaLogin(true, true);
//        });

        switchMethodShow(isCaptchaLogin);
        if (!showPrivacy) {
            loginButtonGroup.setMarginBottom(AppUtils.dp2px(getContext(), 18));
        }
        login.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                userActionTrack("login");
                checkAgreedPrivacy(LoginMethod.USERNAME, new PrivacyAgreeClickListener() {
                    @Override
                    public void onAgree() {
                        Map<String, Object> map = new HashMap<>();
                        map.put("username", username.getText().toString().trim());
                        if (isCaptchaLogin) {
                            Map<String, Object> ext = new HashMap<>();
                            ext.put("captcha_code", et_captcha.getText().toString().trim());
                            map.put("ext", ext);
                            notifyLoginClicked(LoginMethod.CAPTCHACODE, 0, map);
                        } else {
                            map.put("password", et_password.getText().toString().trim());
                            notifyLoginClicked(LoginMethod.USERNAME, 0, map);
                        }
                    }
                });
            }
        });

        tv_get_captcha.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                userActionTrack("captchacode_send");
                String accountStr = username.getText().toString().trim();
                boolean isEmail = loginType == Constants.REGISTER_TYPE_EMAIL;
                if (TextUtils.isEmpty(accountStr)) {
                    com.ruixue.utils.UIToast.showToast(getContext(), isEmail ? R.string.txt_enter_email : R.string.txt_enter_phone);
                    return;
                }
                if (!isEmail && !MobileUtils.isMobileNO(accountStr)) {
                    com.ruixue.utils.UIToast.showToast(getContext(), R.string.rx_tips_phone_number_err);
                    return;
                }
                checkAgreedPrivacy(LoginMethod.USERNAME, new PrivacyAgreeClickListener() {
                    @Override
                    public void onAgree() {
                        CaptchaHelper.requestCaptcha(getContext(), tv_get_captcha, CaptchaPurpose.LOGIN, accountStr, isEmail);
                    }
                });
            }
        });

        findpass.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                onClickForgotPassword(username, et_password);
                userActionTrack("forgot_password");
            }
        });
    }

    private void updateViewHeight(View view, int dp) {
        ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
        layoutParams.height = AppUtils.dp2px(getContext(), dp);
        view.setLayoutParams(layoutParams);
    }

    private void updateViewMarginTop(View view, int dp) {
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        layoutParams.topMargin = AppUtils.dp2px(getContext(), dp);
        view.setLayoutParams(layoutParams);
    }

    @Override
    protected void switchMethodShow(boolean isCaptchaLogin) {
        changePwdOrCaptchaLogin(isCaptchaLogin, false);
    }

    private AnimatorSet animator;

    private void changePwdOrCaptchaLogin(boolean isCaptchaLogin, boolean withAnim) {
        this.isCaptchaLogin = isCaptchaLogin;
        setLoginMethods(this.loginTmpMethods);

//        if (withAnim) {
//            if (animator != null && animator.isRunning()) {
//                animator.cancel();
//            }
//            if (isCaptchaLogin) { // 验证码登录
//                animator = new AnimatorSet();
//                float translateX = rl_captcha.getWidth();
//                ObjectAnimator captchaAnim = ObjectAnimator.ofFloat(rl_captcha, "translationX", translateX, 0);
//                ObjectAnimator passwordAnim = ObjectAnimator.ofFloat(rl_password, "translationX", 0, -translateX);
//                captchaAnim.setStartDelay(50);
//                rl_captcha.setVisibility(View.VISIBLE);
//                animator.playTogether(captchaAnim, passwordAnim);
//                animator.setDuration(300);
//                animator.addListener(new Animator.AnimatorListener() {
//                    @Override
//                    public void onAnimationStart(@NonNull Animator animation) {
//                        rl_captcha.setTranslationX(translateX);
//                        rl_captcha.setVisibility(View.VISIBLE);
//                        changeCaptchaBtn.setVisibility(View.INVISIBLE);
//                        changePassBtn.setVisibility(View.VISIBLE);
//                    }
//
//                    @Override
//                    public void onAnimationEnd(@NonNull Animator animation) {
//                        rl_password.setVisibility(View.INVISIBLE);
//                        rl_captcha.setVisibility(View.VISIBLE);
//                        rl_password.setTranslationX(0);
//                        rl_captcha.setTranslationX(0);
//                    }
//
//                    @Override
//                    public void onAnimationCancel(@NonNull Animator animation) {
//                        rl_password.setVisibility(View.INVISIBLE);
//                        rl_captcha.setVisibility(View.VISIBLE);
//                        rl_password.setTranslationX(0);
//                        rl_captcha.setTranslationX(0);
//                    }
//
//                    @Override
//                    public void onAnimationRepeat(@NonNull Animator animation) {
//
//                    }
//                });
//                animator.start();
//            } else { // 密码登录
//                animator = new AnimatorSet();
//                float translateX = rl_password.getWidth();
//                ObjectAnimator captchaAnim = ObjectAnimator.ofFloat(rl_captcha, "translationX", 0, translateX);
//                ObjectAnimator passwordAnim = ObjectAnimator.ofFloat(rl_password, "translationX", -translateX, 0);
//                animator.playTogether(captchaAnim, passwordAnim);
//                passwordAnim.setStartDelay(50);
//                animator.setDuration(300);
//                animator.addListener(new Animator.AnimatorListener() {
//                    @Override
//                    public void onAnimationStart(@NonNull Animator animation) {
//                        rl_password.setTranslationX(-translateX);
//                        rl_password.setVisibility(View.VISIBLE);
//                        changePassBtn.setVisibility(View.INVISIBLE);
//                        changeCaptchaBtn.setVisibility(View.VISIBLE);
//                    }
//
//                    @Override
//                    public void onAnimationEnd(@NonNull Animator animation) {
//                        rl_password.setVisibility(View.VISIBLE);
//                        rl_captcha.setVisibility(View.INVISIBLE);
//                        rl_password.setTranslationX(0);
//                        rl_captcha.setTranslationX(0);
//                    }
//
//                    @Override
//                    public void onAnimationCancel(@NonNull Animator animation) {
//                        rl_password.setVisibility(View.VISIBLE);
//                        rl_captcha.setVisibility(View.INVISIBLE);
//                        rl_password.setTranslationX(0);
//                        rl_captcha.setTranslationX(0);
//                    }
//
//                    @Override
//                    public void onAnimationRepeat(@NonNull Animator animation) {
//
//                    }
//                });
//                animator.start();
//            }
//        } else {
//            rl_password.setTranslationX(0);
//            rl_captcha.setTranslationX(0);
//            changePassBtn.setVisibility(isCaptchaLogin ? View.VISIBLE : View.INVISIBLE);
//            changeCaptchaBtn.setVisibility(isCaptchaLogin ? View.INVISIBLE : View.VISIBLE);
//            rl_password.setVisibility(isCaptchaLogin ? View.INVISIBLE : View.VISIBLE);
//            rl_captcha.setVisibility(isCaptchaLogin ? View.VISIBLE : View.INVISIBLE);
//        }

        //add
        rl_password.setVisibility(isCaptchaLogin ? View.INVISIBLE : View.VISIBLE);
        rl_captcha.setVisibility(isCaptchaLogin ? View.VISIBLE : View.INVISIBLE);

        // fill login info
        LoginData loginData = RuiXueSdk.getLoginData();
        if (loginData != null && TextUtils.isEmpty(username.getText())) {
            if (isCaptchaLogin && loginData.isCaptchaLogin()) {
//                isCaptchaLogin = true;
//                switchMethodShow(isCaptchaLogin);
                username.setText(loginData.getLoginUsername());
            } else if (!isCaptchaLogin && loginData.isUsernameLogin()) {
//                isCaptchaLogin = false;
//                switchMethodShow(isCaptchaLogin);
                username.setText(loginData.getLoginUsername());
            }
        }


        if (isCaptchaLogin && et_password.getEditText().hasFocus()) { // 要切换验证码但是展示的是密码键盘，隐藏键盘
            hideKeyboard(et_password.getEditText());
        }

        if (!isCaptchaLogin && et_captcha.hasFocus()) { // 要切换密码但是展示的是验证码键盘，隐藏键盘
            hideKeyboard(et_captcha);
        }

        getWindow().getDecorView().invalidate();

        if (username != null) {
            username.setOnFocusChangeListener((v, hasFocus) -> {
                if (hasFocus) {
                    userActionTrack("account_tf");
                }
            });
        }

        if (et_captcha != null) {
            et_captcha.setOnFocusChangeListener((v, hasFocus) -> {
                if (hasFocus) {
                    userActionTrack("captchacode_tf");
                }
            });
        }

        if (et_password != null && et_password.getEditText() != null) {
            et_password.getEditText().setOnFocusChangeListener((v, hasFocus) -> {
                if (hasFocus) {
                    userActionTrack("password_tf");
                }
            });
        }

        setEditTextSetting();
        if (Build.VERSION.SDK_INT == Build.VERSION_CODES.O_MR1) {
            username.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    setEditTextSetting();
                }
            });
        }

        // 切换后需要显示的处理下，因为这时候可能没触发 TextWatcher
        boolean loginEnable;
        if (isCaptchaLogin) {
            loginEnable = (et_captcha.getText().length() > 0 && username.getText().length() > 0);
        } else {
            loginEnable = (et_password.getEditText().getText().length() > 0 && username.getText().length() > 0);
        }
        login.setEnabled(loginEnable);
        SomeMonitorEditText.create(login, username, isCaptchaLogin ? et_captcha : et_password.getEditText());
        userActionTrack("show");
    }

    private void hideKeyboard(View view) {
        InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    private void setEditTextSetting() {
        if (isCaptchaLogin) {
            username.setInputType(EditorInfo.TYPE_CLASS_PHONE);
            username.setHint(R.string.txt_enter_phone);
        } else {
            username.setInputType(EditorInfo.TYPE_CLASS_TEXT);
            username.setHint(R.string.txt_enter_account);
        }
//        if ((isCaptchaLogin && loginType != Constants.REGISTER_TYPE_EMAIL) || loginType == Constants.REGISTER_TYPE_PHONE) {
//            username.setInputType(EditorInfo.TYPE_CLASS_PHONE);
//            username.setHint(R.string.txt_enter_phone);
////            password.getEditText().setHint(R.string.rx_txt_input_captcha);
////            password.getEditText().setInputType(EditorInfo.TYPE_CLASS_NUMBER);
//        } else if (loginType == Constants.REGISTER_TYPE_EMAIL) {
//            username.setInputType(EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
//            username.setHint(R.string.txt_enter_email);
////            password.getEditText().setHint(R.string.txt_enter_pwd);
////            password.getEditText().setInputType(EditorInfo.TYPE_TEXT_VARIATION_PASSWORD);
//        } else {
//            username.setInputType(EditorInfo.TYPE_CLASS_TEXT);
//            username.setHint(R.string.txt_enter_account);
////            password.getEditText().setHint(R.string.txt_enter_pwd);
////            password.getEditText().setInputType(EditorInfo.TYPE_TEXT_VARIATION_PASSWORD);
//        }
        if (!TextUtils.isEmpty(usernameHintText)) {
            username.setHint(usernameHintText);
        }
        if (!TextUtils.isEmpty(usernameText)) {
            username.setText(usernameText);
        }

    }

    private boolean isResetPassword = false;

    private void onClickForgotPassword(EditText username, PwdEditText password) {
        if (useH5ForgotPwd) {
            RXWebView.create(getContext(), forgotUrl).setBackEnable(true).setTitleBackgroundColor(Color.parseColor("#E0FFFC")).setTitle(mLogoDrawable).setCallback(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data != null) {
                        isResetPassword = true;
                        String usernameStr = data.optString("username");
                        if (!TextUtils.isEmpty(usernameStr))
                            username.setText(usernameStr);
                        String new_password = data.optString("password");
                        if (!TextUtils.isEmpty(new_password))
                            password.setText(new_password);
                        isResetPassword = false;
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {

                }
            }).show();
        } else {
            ForgotPasswordHelper.createDialog(getContext(), null, new RXUICallback() {
                @Override
                public Map<String, Object> onClickHandle(Map<String, Object> params) {
                    return null;
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data != null) {
                        isResetPassword = true;
                        String usernameStr = data.optString("username");
                        if (!TextUtils.isEmpty(usernameStr))
                            username.setText(usernameStr);
                        isResetPassword = false;
//                        String new_password = data.optString("password");
//                        password.setText(new_password);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                }
            }).setAccountType(loginType).setPhoneTxt(username.getText().toString().trim()).show();
        }
    }

    @Override
    public void updateAgreementText(View view) {
        if (tvAgreement == null) {
            return;
        }

        String prefix = getContext().getString(R.string.rx_agreement_accept) + " ";
        RichTextUtils.updateTextViewClickable(getContext(), tvAgreement, prefix + getPrivacyLinkString(), new RichTextUtils.OnClickedLinkCallback() {
            @Override
            public void onClicked(String url) {
                userActionTrack("privacy", url);
            }
        });
    }

    private void userActionTrack(String action) {
        userActionTrack(action, null);
    }

    private void userActionTrack(String action, String url) {
        String method = isCaptchaLogin ? "captchacode" : "username";
        Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("login", method, action);
        if (!TextUtils.isEmpty(url)) {
            properties.put("url", url);
        }
        UserActionTrackManager.getInstance().reportUserAction(properties);
    }

}
