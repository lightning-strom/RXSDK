package com.ruixue.view;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatTextView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.callback.RXUICallback;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.openapi.Constants;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.UIToast;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.PwdEditText;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoginViewUsername extends LogoBaseView {


    public static LoginViewUsername create(Context context) {
        return new LoginViewUsername(context);
    }

    public LoginViewUsername(Context context) {
        super(context);
    }


    private @Constants.RegisterType int loginType = Constants.REGISTER_TYPE_EMAIL;

    private String usernameHintText;

    private String usernameText;

    private String forgotUrl;
    private boolean useH5ForgotPwd = true;
    EditText username;
    PwdEditText password;
    EditText et_captcha;
    LinearLayout rl_password;
    LinearLayout rl_captcha;
    AppCompatTextView switchType;
    Button login;
    protected LoginClickListener loginClickListener;
    protected RXUICallback registerCallback;

    private Map<String, Object> hashMap;

    public void setCustomMap(Map<String, Object> hashMap) {
        this.hashMap = hashMap;
    }

    public LoginViewUsername setLoginClickListener(LoginClickListener loginClickListener) {
        this.loginClickListener = loginClickListener;
        return this;
    }

    public LoginViewUsername setRegisterCallback(RXUICallback registerCallback) {
        this.registerCallback = registerCallback;
        return this;
    }

    public LoginViewUsername setForgotUrl(String forgotUrl) {
        if (!TextUtils.isEmpty(forgotUrl) && !forgotUrl.startsWith("http")) {
            String baseUrl = RuiXueSdk.getFirstBaseUrl();
            baseUrl += baseUrl.endsWith("/") ? "" : "/";
            forgotUrl = baseUrl + forgotUrl;
        }
        this.forgotUrl = forgotUrl;
        return this;
    }

    public void setLoginType(int login_type) {
        if (login_type != 0) {
            this.loginType = login_type;
        }
    }

    public LoginViewUsername setLoginMethod(String method) {
        if (method != null && method.equals(LoginMethod.CAPTCHACODE)) {
            loginType = Constants.REGISTER_TYPE_EMAIL;
        } else {
            loginType = Constants.REGISTER_TYPE_USERNAME;
        }
        return this;
    }

    public void setUseH5ForgotPwd(boolean useH5ForgotPwd) {
        this.useH5ForgotPwd = useH5ForgotPwd;
    }

    @Override
    public int getResId() {
//        return R.layout.rx_login_2_username;
        return R.layout.rx_login_2_email;
    }

    protected List<String> loginTmpMethods;

    /**
     * @param usernameHintText 用户名提示文本
     */
    public LoginViewUsername setUsernameHintText(String usernameHintText) {
        this.usernameHintText = usernameHintText;
        return this;
    }

    public LoginViewUsername setUsername(String username) {
        this.usernameText = username;
        return this;
    }


    public LoginViewUsername setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        username = view.findViewById(R.id.username);
        password = view.findViewById(R.id.password);
        rl_password = view.findViewById(R.id.rl_password);
        rl_captcha = view.findViewById(R.id.rl_captcha);
        et_captcha = view.findViewById(R.id.et_captcha);

        TextView tv_get_captcha = view.findViewById(R.id.tv_get_captcha);
        tv_get_captcha.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                boolean isEmail = loginType == Constants.REGISTER_TYPE_EMAIL;
                String accountStr = username.getText().toString().trim();
                if (TextUtils.isEmpty(username.getText().toString().trim())) {
                    com.ruixue.utils.UIToast.showToast(getContext(), isEmail ? R.string.rx_tips_email_format_err : R.string.txt_enter_phone);
                    return;
                }
                CaptchaHelper.requestCaptcha(getContext(), tv_get_captcha, CaptchaPurpose.LOGIN, accountStr, isEmail);
            }
        });
        TextView findpass = view.findViewById(R.id.findpass);
        findpass.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                onClickForgotPassword(username, password);
            }
        });
        if (!TextUtils.isEmpty(usernameHintText)) {
            username.setHint(usernameHintText);
        }
        if (!TextUtils.isEmpty(usernameText)) {
            username.setText(usernameText);
        }
        login = view.findViewById(R.id.login_default);
        if (AppUtils.isUsePortMatch(getContext())) {
            LinearLayout ly_content = view.findViewById(R.id.ly_content);
            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) ly_content.getLayoutParams();
            layoutParams.leftMargin = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_19);
            layoutParams.rightMargin = layoutParams.leftMargin;
        }

        login.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                String method = isCaptchaLogin() ? LoginMethod.CAPTCHACODE : LoginMethod.USERNAME;
                Map<String, Object> map = new HashMap<>();
                map.put("username", username.getText().toString().trim());
                if (isCaptchaLogin()) {
                    Map<String, Object> ext = new HashMap<>();
                    String captcha = et_captcha.getText().toString().trim();
                    if (TextUtils.isEmpty(captcha)) {
                        UIToast.showToast(getContext(), R.string.txt_enter_captcha);
                        return;
                    }
                    ext.put("captcha_code", captcha);
                    map.put("ext", ext);
                } else {
                    String pwd = password.getText().toString().trim();
                    if (TextUtils.isEmpty(pwd)) {
                        UIToast.showToast(getContext(), R.string.txt_enter_pwd);
                        return;
                    }
                    map.put("password", pwd);
                }
                if (loginClickListener != null) {
                    loginClickListener.onLoginClick(LoginViewUsername.this, method, 0, map);
                }
            }
        });

        switchType = view.findViewById(R.id.tv_switch);
        switchType.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                loginType = (loginType == Constants.REGISTER_TYPE_USERNAME) ? Constants.REGISTER_TYPE_EMAIL : Constants.REGISTER_TYPE_USERNAME;
                changePwdOrCaptchaLogin(true);
            }
        });
        changePwdOrCaptchaLogin(false);
    }


    private boolean isCaptchaLogin() {
        return loginType != Constants.REGISTER_TYPE_USERNAME;
    }

    private AnimatorSet animator;

    private void changePwdOrCaptchaLogin(boolean withAnim) {
        boolean isCaptchaLogin = isCaptchaLogin();
        switchType.setText(isCaptchaLogin ? R.string.txt_password_login : R.string.txt_captcha_login);
        SomeMonitorEditText.create(login, username, isCaptchaLogin() ? et_captcha : password.getEditText());
        if (withAnim) {
            if (animator != null && animator.isRunning()) {
                animator.cancel();
            }
            animator = new AnimatorSet();
            float translateX;
            if (isCaptchaLogin) {   // 验证码登录
                translateX = rl_captcha.getWidth();
                ObjectAnimator captchaAnim = ObjectAnimator.ofFloat(rl_captcha, "translationX", translateX, 0);
                ObjectAnimator passwordAnim = ObjectAnimator.ofFloat(rl_password, "translationX", 0, -translateX);
                captchaAnim.setStartDelay(50);
                animator.playTogether(captchaAnim, passwordAnim);
                animator.setDuration(300);
                animator.addListener(new Animator.AnimatorListener() {
                    @Override
                    public void onAnimationStart(@NonNull Animator animation) {
                        rl_captcha.setTranslationX(translateX);
                        rl_captcha.setVisibility(View.VISIBLE);
                    }

                    @Override
                    public void onAnimationEnd(@NonNull Animator animation) {
                        rl_password.setVisibility(View.INVISIBLE);
                        rl_captcha.setVisibility(View.VISIBLE);
                        rl_password.setTranslationX(0);
                        rl_captcha.setTranslationX(0);
                    }

                    @Override
                    public void onAnimationCancel(@NonNull Animator animation) {
                        rl_password.setVisibility(View.INVISIBLE);
                        rl_captcha.setVisibility(View.VISIBLE);
                        rl_password.setTranslationX(0);
                        rl_captcha.setTranslationX(0);
                    }

                    @Override
                    public void onAnimationRepeat(@NonNull Animator animation) {

                    }
                });
            } else { // 密码登录
                translateX = rl_password.getWidth();
                ObjectAnimator captchaAnim = ObjectAnimator.ofFloat(rl_captcha, "translationX", 0, translateX);
                ObjectAnimator passwordAnim = ObjectAnimator.ofFloat(rl_password, "translationX", -translateX, 0);
                animator.playTogether(captchaAnim, passwordAnim);
                passwordAnim.setStartDelay(50);
                animator.setDuration(300);
                animator.addListener(new Animator.AnimatorListener() {
                    @Override
                    public void onAnimationStart(@NonNull Animator animation) {
                        rl_password.setTranslationX(-translateX);
                        rl_password.setVisibility(View.VISIBLE);
                    }

                    @Override
                    public void onAnimationEnd(@NonNull Animator animation) {
                        rl_password.setVisibility(View.VISIBLE);
                        rl_captcha.setVisibility(View.INVISIBLE);
                        rl_password.setTranslationX(0);
                        rl_captcha.setTranslationX(0);
                    }

                    @Override
                    public void onAnimationCancel(@NonNull Animator animation) {
                        rl_password.setVisibility(View.VISIBLE);
                        rl_captcha.setVisibility(View.INVISIBLE);
                        rl_password.setTranslationX(0);
                        rl_captcha.setTranslationX(0);
                    }

                    @Override
                    public void onAnimationRepeat(@NonNull Animator animation) {

                    }
                });
            }
            animator.start();
        } else {
            rl_password.setTranslationX(0);
            rl_captcha.setTranslationX(0);
            rl_password.setVisibility(isCaptchaLogin ? View.INVISIBLE : View.VISIBLE);
            rl_captcha.setVisibility(isCaptchaLogin ? View.VISIBLE : View.INVISIBLE);
        }
    }

    private void register(View view) {
        TextView tv_register = view.findViewById(R.id.tv_register);
        tv_register.setVisibility(RXGlobalData.isEmailRegDisable() ? View.GONE : View.VISIBLE);
        SomeMonitorEditText.create(login, username, password.getEditText());
        tv_register.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                username.clearFocus();
                password.clearFocus();
                CaptchaCommonHelper.registerEmailUI(getContext(), hashMap, true, new RXUICallback() {
                    @Override
                    public Map<String, Object> onClickHandle(Map<String, Object> params) {
                        return registerCallback != null ? registerCallback.onClickHandle(params) : params;
                    }

                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        if (data != null && data.has("username")) {
                            username.setText(data.optString("username", ""));
                        }
                        if (registerCallback != null) {
                            registerCallback.onSuccess(data);
                        }
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (registerCallback != null) {
                            registerCallback.onFailed(cause);
                        }
                    }
                }).show();
            }
        });
    }

    private void onClickForgotPassword(EditText username, PwdEditText password) {
        if (useH5ForgotPwd) {
            RXWebView.create(getContext(), forgotUrl).setBackEnable(true).setTitleBackgroundColor(Color.parseColor("#E0FFFC")).setTitle(mLogoDrawable).setCallback(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data != null) {
                        String usernameStr = data.optString("username");
                        if (!TextUtils.isEmpty(usernameStr))
                            username.setText(usernameStr);
                        String new_password = data.optString("password");
                        if (!TextUtils.isEmpty(new_password))
                            password.setText(new_password);
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
                    return params;
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data != null) {
                        String usernameStr = data.optString("username");
                        if (!TextUtils.isEmpty(usernameStr))
                            username.setText(usernameStr);
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

}
