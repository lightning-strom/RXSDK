package com.ruixue.widget;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.LinearInterpolator;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.ruixue.RuiXueSdk;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.logger.Logger;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/17
 */
public class LoginButtonGroup extends RelativeLayout {
    public static final String MORE = "more";
    RelativeLayout login_method_more;
    List<LoginButton> loginButtons;

    boolean fromOneKey;

    public interface LoginButtonClickListener {
        void onLoginButtonClick(String method);
    }

    LoginButtonClickListener loginButtonClickListener;


    public void setFromOneKey(boolean fromOneKey) {
        this.fromOneKey = fromOneKey;
    }

    public LoginButtonGroup(Context context) {
        this(context, null);
    }

    public LoginButtonGroup(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.setClipChildren(false);
        this.setClipToPadding(false);
        // 加载布局
        LayoutInflater.from(context).inflate(R.layout.rx_login_button_group, this);
        loginButtons = new ArrayList<>();
        loginButtons.add(findViewById(R.id.login_method_0));
        loginButtons.add(findViewById(R.id.login_method_1));
        loginButtons.add(findViewById(R.id.login_method_2));
        loginButtons.add(findViewById(R.id.login_method_3));
//        loginButtons.add(findViewById(R.id.login_method_more));

        for (LoginButton loginButton : loginButtons) {

            loginButton.setOnClickListener(new OnMultiClickListener() {
                @Override
                public void onMultiClick(View v) {
                    if (loginButtonClickListener != null) {
                        loginButtonClickListener.onLoginButtonClick((String) loginButton.getTag());
                    }
                }
            });
        }

        login_method_more = findViewById(R.id.login_method_more);
        View view1 = LayoutInflater.from(context).inflate(AppUtils.isUsePortMatch(context) ? R.layout.rx_login_button_port : R.layout.rx_login_button_more, null);
        login_method_more.addView(view1);
//        login_method_more.setVisibility(GONE);
        login_method_more.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                if (loginButtonClickListener != null) {
                    loginButtonClickListener.onLoginButtonClick(MORE);
                }
            }
        });
    }

    public String getLastMethod() {
        String method = RuiXueSdk.getLoginMethod();
//        if (fromOneKey && LoginMethod.CAPTCHACODE.equals(method)) {
//            return LoginMethod.USERNAME;
//        } else {
            return method;
//        }
    }

    private void update(LoginButton loginButton, String method) {
        loginButton.setTag(method);
        LoginMethod loginMethod = LoginMethod.create(method);
        loginButton.setName(loginMethod.getName());
        loginButton.setIconImage(loginMethod.getIcon());
        if (loginButton.getVisibility() == VISIBLE && Objects.equals(getLastMethod(), method)) {
            loginButton.startVerticalLoopAnimation();
        } else {
            loginButton.stopVerticalLoopAnimation();
        }
    }

    public void setLoginButtonClickListener(LoginButtonClickListener loginButtonClickListener) {
        this.loginButtonClickListener = loginButtonClickListener;
    }

    public void setLoginMethods(List<String> methodList, boolean showMore, Set<String> ignoreMethods) {
        List<String> methods;
        if (methodList == null) {
            methods = new ArrayList<>();
        } else {
            methods = new ArrayList<>(methodList);
        }
        if (ignoreMethods != null) {
            for (String ignoreMethod : ignoreMethods) {
                int idx = methods.indexOf(ignoreMethod);
                if (idx != -1) {
                    methods.remove(idx);
                }
            }
        }
        int methodSize = showMore ? Math.min(methods.size(), 3) : methods.size();
        for (int i = 0; i < loginButtons.size(); i++) {
            if (i < methodSize)
                update(loginButtons.get(i), methods.get(i));
            else
                loginButtons.get(i).setVisibility(GONE);
        }
        login_method_more.setVisibility(showMore ? VISIBLE : GONE);
    }

    public void setLoginMethods(List<String> methods, boolean showMore) {
        setLoginMethods(methods, showMore, null);
    }

    public void setMarginBottom(int px) {
        ViewGroup.LayoutParams layoutParams = this.getLayoutParams();

        if (layoutParams instanceof LinearLayout.LayoutParams) {
            LinearLayout.LayoutParams linearParams = (LinearLayout.LayoutParams) layoutParams;
            linearParams.bottomMargin = px;
            setLayoutParams(linearParams);
        }
    }

}
