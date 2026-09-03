package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;

import com.ruixue.base.CaptchaPurpose;
import com.ruixue.openapi.Constants;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.MobileUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

public class CaptchaCommonView extends RXView {
    protected OnCaptchaCallback callback;
    private String purpose = "";
    private @StringRes int titleResId = 0;
    private @StringRes int accountHintResId = 0;
    private boolean passwordShow = true;
    private boolean captchaShow = true;
    private int registerType = -1;
    /**
     * 返回按钮
     */
    protected boolean goBackEnable = true;


    public CaptchaCommonView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }

    public CaptchaCommonView setCallback(OnCaptchaCallback callback) {
        this.callback = callback;
        return this;
    }

    public CaptchaCommonView(Context context) {
        super(context);
    }

    /**
     * 绑定手机号UI
     * @param context context
     * @param purpose 验证码类型
     */
    public static CaptchaCommonView create(Context context, String purpose) {
        return new CaptchaCommonView(context).setPurpose(purpose);
    }

    public static CaptchaCommonView create(Context context, String purpose, OnCaptchaCallback callback) {
        return new CaptchaCommonView(context).setPurpose(purpose).setCallback(callback);
    }

    public interface OnCaptchaCallback {
        void onFinish(Dialog dialog, String account, @Nullable String captcha, @Nullable String password);

        void onClosed();
    }

    public CaptchaCommonView setPurpose(String purpose) {
        this.purpose = purpose;
        return this;
    }

    public CaptchaCommonView setTitle(@StringRes int resId) {
        this.titleResId = resId;
        return this;
    }

    public CaptchaCommonView setPasswordVisible(boolean visible) {
        this.passwordShow = visible;
        return this;
    }

    public CaptchaCommonView setCaptchaVisible(boolean visible) {
        this.captchaShow = visible;
        return this;
    }

    public CaptchaCommonView setRegisterType(int registerType) {
        this.registerType = registerType;
        return this;
    }


    public CaptchaCommonView setAccountHint(@StringRes int resId) {
        this.accountHintResId = resId;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_captcha_obtain;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setEnabled(isCancelable());
        close.setVisibility((!isCancelable() || goBackEnable) ? View.GONE : View.VISIBLE);
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            dialog.dismiss();
        });
        dialog.setOnCancelListener(new OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                if (callback != null) {
                    callback.onClosed();
                }
            }
        });
        TextView title = view.findViewById(R.id.title);
        EditText etPwd = view.findViewById(R.id.password);
        EditText etAccount = view.findViewById(R.id.phone);
        EditText etCaptcha = view.findViewById(R.id.et_captcha);
        RelativeLayout rlCaptcha = view.findViewById(R.id.rl_captcha);
        if (titleResId != 0) {
            title.setText(titleResId);
        }
        rlCaptcha.setVisibility(captchaShow ? View.VISIBLE : View.GONE);
        etCaptcha.setVisibility(captchaShow ? View.VISIBLE : View.GONE);
        etPwd.setVisibility(passwordShow ? View.VISIBLE : View.GONE);
        if (registerType == Constants.REGISTER_TYPE_PHONE) {
            etAccount.setInputType(EditorInfo.TYPE_CLASS_PHONE);
            etAccount.setHint(R.string.txt_enter_phone);
        } else if (registerType == Constants.REGISTER_TYPE_EMAIL) {
            etAccount.setInputType(EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
            etAccount.setHint(R.string.txt_enter_email);
        } else {
            etAccount.setInputType(EditorInfo.TYPE_CLASS_TEXT);
            etAccount.setHint(R.string.txt_enter_account);
        }
        if (accountHintResId != 0) {
            etAccount.setHint(accountHintResId);
        }
        TextView tvGetCode = view.findViewById(R.id.tv_get_code);
        Button btnFinish = view.findViewById(R.id.btn_finish);
        if (titleResId != 0) {
            btnFinish.setText(titleResId);
        }
        if (!passwordShow && captchaShow) {
            btnFinish.setText(R.string.rx_txt_next);
            SomeMonitorEditText.create(btnFinish, etAccount, etCaptcha);
        } else {
            SomeMonitorEditText.create(btnFinish, etAccount, etPwd, etCaptcha);
        }
        tvGetCode.setOnClickListener(v -> {
            String accountStr = etAccount.getText().toString().trim();
            boolean isEmail = CaptchaPurpose.BINDEMAIL.equals(purpose) || CaptchaPurpose.UNBINDEMAIL.equals(purpose) || (CaptchaPurpose.REGISTER.equals(purpose) && registerType != Constants.REGISTER_TYPE_PHONE);
            if (TextUtils.isEmpty(accountStr)) {
                com.ruixue.utils.UIToast.showToast(getContext(), isEmail ? R.string.rx_tips_enter_email : R.string.rx_tips_enter_phone);
                return;
            } else if (isEmail && !MobileUtils.isEmail(accountStr)) {
                com.ruixue.utils.UIToast.showToast(getContext(), R.string.rx_tips_email_format_err);
                return;
            }
            CaptchaHelper.requestCaptcha(getContext(), tvGetCode, purpose, accountStr, isEmail);
        });

        btnFinish.setOnClickListener(v -> {
            etPwd.clearFocus();
            etAccount.clearFocus();
            etCaptcha.clearFocus();
            if (callback != null) {
                callback.onFinish(dialog, etAccount.getText().toString().trim(), etCaptcha.getText().toString().trim(), etPwd.getText().toString().trim());
            } else {
                dialog.dismiss();
            }
        });
    }
}
