package com.ruixue.view;


import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruixue.RuiXueSdk;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.Account;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.DisplayUtils;
import com.ruixue.utils.MobileUtils;
import com.ruixue.widget.BaseDialog;

import java.util.Map;
import java.util.Objects;

public class LoginQuickView extends LoginBaseView {


    public interface OnShowLoginViewListener {
        void onShowLoinViewNotify(Map<String, Object> map);
    }

    public LoginQuickView(Context context) {
        super(context);
        setShowPrivacy(false);
    }

    @Override
    void switchMethodShow(boolean isCaptchaLogin) {

    }

    public static LoginQuickView create(Context context) {
        return new LoginQuickView(context);
    }

    public void setShowLoginViewListener(OnShowLoginViewListener onAccountEmptyListener) {
        this.onShowLoginViewListener = onAccountEmptyListener;
    }

    private OnShowLoginViewListener onShowLoginViewListener;

    public void setAccount(Account account) {
        this.mAccount = account;
    }

    private Account mAccount;

    @Override
    public int getResId() {
        return R.layout.rx_login_quick;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);

        Button login = view.findViewById(R.id.login_default);
        login.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                Account account = (Account) v.getTag();
                if (account != null) {
                    if (onShowLoginViewListener != null && account.getMethod().equals(LoginMethod.CAPTCHACODE) && TextUtils.isEmpty(account.getLoginOpenid())) {
                        onShowLoginViewListener.onShowLoinViewNotify(account.toLoginReqMap());
                    } else {
                        notifyLoginClicked(account.getMethod(), 1, account.toLoginReqMap());
                    }
                } else {
                    ToastUtils.showToast(getContext(), "unknown login method。");
                }
            }
        });

        ImageView btn_switch = view.findViewById(R.id.btn_switch);
        ImageView iv_ico_method = view.findViewById(R.id.iv_ico_method);
        TextView tv_username = view.findViewById(R.id.tv_username);
        if (mAccount != null) {
            updateAccountDisplay(mAccount, iv_ico_method, tv_username);
            login.setTag(mAccount);
        }
        btn_switch.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                LoginAccountListView loginAccountListView = LoginAccountListView.create(dialog.getContext(), onShowLoginViewListener);
                loginAccountListView.setCallback((dialog1, account, isDel) -> {
                    if (isDel) {
                        Account selAccount = (Account) login.getTag();
                        if (selAccount != null && !TextUtils.isEmpty(selAccount.getOpenid()) && Objects.equals(selAccount.getOpenid(), account.getOpenid())) {
                            Account account1 = loginAccountListView.getFirstAccount();
                            updateAccountDisplay(account1, iv_ico_method, tv_username);
                            login.setTag(account1);
                        }
                    } else {
                        updateAccountDisplay(account, iv_ico_method, tv_username);
                        login.setTag(account);
                    }
                });
//                loginAccountListView.setHeight(view.findViewById(R.id.cv_root).getMeasuredHeight());
//                loginAccountListView.setWidth(view.findViewById(R.id.cv_root).getMeasuredWidth());
                loginAccountListView.show();

            }

        });
        boolean invisible = this.loginMethods.size() > 0;
        view.findViewById(R.id.login_other_method).setVisibility(invisible ? View.GONE : View.VISIBLE);
        if (!invisible) {
            view.findViewById(R.id.login_other_method).setOnClickListener(new OnMultiClickListener() {
                @Override
                public void onMultiClick(View v) {
                    notifyLoginClicked(LoginMethod.MORE, LOGIN_TAG_QUICK, null);
                }
            });
        }
    }



    private void updateAccountDisplay(Account account, ImageView iv_ico_method, TextView tv_username) {
        if (account != null) {
            iv_ico_method.setBackgroundResource(getResIdByMethod(account.getMethod(), account.getUsername()));
            tv_username.setText(account.getDisplayUsername());
            tv_username.setTextDirection(DisplayUtils.isRtl(getContext())?View.TEXT_DIRECTION_RTL:View.TEXT_DIRECTION_LTR);
        }
    }

    private int getResIdByMethod(String method,String username) {
        String ext = RXSdkApi.getInstance().getSdkInfo().getState() != 0 &&( method.equals(LoginMethod.USERNAME)|| MobileUtils.isEmail(username)) ? "3" : "";
        return LoginMethod.create(method, ext).getIcon();
    }

}
