package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.base.CaptchaPurpose;
import com.ruixue.callback.RXUICallback;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.openapi.Constants;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


class LoginCaptchaView extends LoginBaseView {

    public LoginCaptchaView(Context context) {
        super(context);
    }

    public static LoginCaptchaView create(Context context) {
        return new LoginCaptchaView(context);
    }

    public void setLoginType(int login_type) {
        if (login_type != 0) {
            this.loginType = login_type;
        }
    }

    private @Constants.RegisterType int loginType = Constants.REGISTER_TYPE_PHONE;

    private String usernameHintText;


    @Override
    public int getResId() {
        return R.layout.rx_login_captcha;
    }

    /**
     * @param usernameHintText 用户名提示文本
     */
    public LoginCaptchaView setUsernameHintText(String usernameHintText) {
        this.usernameHintText = usernameHintText;
        return this;
    }


    @Override
    public void setLoginMethods(List<String> loginMethods) {
        List<String> methods = new ArrayList<>();
        if (loginMethods != null) {
            for (String method : loginMethods) {
                if (!method.equals(LoginMethod.CAPTCHACODE)) {
                    methods.add(method);
                }
            }
        }
        super.setLoginMethods(loginMethods);
    }


    public LoginCaptchaView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }

    @Override
    void switchMethodShow(boolean isCaptchaLogin) {

    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        EditText username = view.findViewById(R.id.username);
        Button login = view.findViewById(R.id.login_default);
        if (AppUtils.isUsePortMatch(getContext())) {
            LinearLayout ly_content = view.findViewById(R.id.ly_content);
            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) ly_content.getLayoutParams();
            layoutParams.leftMargin = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_19);
            layoutParams.rightMargin = layoutParams.leftMargin;
        }
        if (loginType == Constants.REGISTER_TYPE_PHONE) {
            username.setInputType(EditorInfo.TYPE_CLASS_PHONE);
            username.setHint(R.string.txt_enter_phone);
        } else if (loginType == Constants.REGISTER_TYPE_EMAIL) {
            username.setInputType(EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
            username.setHint(R.string.txt_enter_email);
        } else {
            username.setInputType(EditorInfo.TYPE_CLASS_TEXT);
            username.setHint(R.string.txt_enter_account);
        }
        if (!TextUtils.isEmpty(usernameHintText)) {
            username.setHint(usernameHintText);
        }
        SomeMonitorEditText someMonitorEditText = SomeMonitorEditText.create(login, username);

        login.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                checkAgreedPrivacy(LoginMethod.CAPTCHACODE, new PrivacyAgreeClickListener() {
                    @Override
                    public void onAgree() {
                        //验证码登录获取验证码
                        showCaptchaInputView(String.valueOf(username.getText()), 0);
                    }
                });
            }
        });
    }
    CaptchaInputView captchaInputView;

    protected void showCaptchaInputView(String username, int isQuickBtn) {
        captchaInputView = CaptchaInputView.create(getContext(), username, CaptchaPurpose.LOGIN, new CaptchaInputView.OnCaptchaCallback() {
            @Override
            public void onFinish(Dialog dialog, String account, @Nullable String captcha) {
                Map<String, Object> map = new HashMap<>();
                map.put("username", account);
                Map<String, Object> ext = new HashMap<>();
                ext.put("captcha_code", captcha);
                map.put("ext", ext);
                notifyLoginClicked(LoginMethod.CAPTCHACODE, isQuickBtn, map);
            }

            @Override
            public void onClosed() {

            }
        });
        captchaInputView.show();
    }
    @Override
    public void close() {
        if (captchaInputView != null) {
            captchaInputView.close();
            captchaInputView = null;
        }
        super.close();
    }

}
