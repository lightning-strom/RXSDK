package com.ruixue.view;

import android.content.Context;
import android.text.InputType;
import android.text.TextUtils;
import android.util.SparseIntArray;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.listener.OnMultiClickListener;

import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.MobileUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

/**
 * 忘记密码手机号验证
 */
public class ForgotPasswordView extends RXView {
    /**
     * Interface definition for a callback to be invoked when a view is clicked.
     */
    public interface OnForgotPasswordListener {
        void onConfirm(RXErrorCode code, String username, String captcha_code, String password);
    }

    protected OnForgotPasswordListener callback;

    String title;
    String phoneTxt;

    String pwdHits;
    boolean isBackVisible = false;
    ConfirmPasswordView modifyPasswordDialog;

    int accountType = CaptchaPurpose.ACCOUNT_TYPE_PHONE;

    private final SparseIntArray codeMsg = new SparseIntArray();

    public ForgotPasswordView setCallback(OnForgotPasswordListener callback) {
        this.callback = callback;
        return this;
    }

    public void setPwdHits(String pwdHits) {
        this.pwdHits = pwdHits;
    }

    public ForgotPasswordView setAccountType(int type) {
        this.accountType = type;
        return this;
    }

    public void setBackVisible(boolean visible) {
        isBackVisible = visible;
    }

    public ForgotPasswordView(Context context) {
        super(context);
        codeMsg.put(CaptchaPurpose.ACCOUNT_TYPE_NORMAL, R.string.txt_enter_account);
        codeMsg.put(CaptchaPurpose.ACCOUNT_TYPE_PHONE, R.string.txt_enter_phone);
        codeMsg.put(CaptchaPurpose.ACCOUNT_TYPE_EMAIL, R.string.txt_enter_email);
    }

    /**
     * 找回密码UI
     * @param activity activity
     */
    public static ForgotPasswordView create(Context activity) {
        return new ForgotPasswordView(activity);
    }

//    @Override
//    public int getStyleId() {
//        return R.style.Dialog_None_Ani;
//    }

    @Override
    public int getResId() {
        return R.layout.rx_forgot_password;
    }

    @Override
    public void close() {
        if (modifyPasswordDialog != null) {
            modifyPasswordDialog.close();
            modifyPasswordDialog = null;
        }
        super.close();
    }

    public ForgotPasswordView setTitle(String title) {
        this.title = title;
        return this;
    }

    public ForgotPasswordView setPhoneTxt(String phoneTxt) {
        this.phoneTxt = phoneTxt;
        return this;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setOnClickListener(v -> {
            dialog.cancel();
        });
        btn_back.setVisibility(isBackVisible ? View.VISIBLE : View.GONE);
        close.setVisibility(!isCancelable() || isBackVisible ? View.GONE : View.VISIBLE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (null != callback) {
                callback.onConfirm(RXErrorCode.UI_CLOSE, null, null, null);
            }
        });
        if (!TextUtils.isEmpty(this.title)) {
            TextView tvTitle = view.findViewById(R.id.title);
            tvTitle.setText(this.title);
        }
        EditText phone = view.findViewById(R.id.phone);
        if (accountType == CaptchaPurpose.ACCOUNT_TYPE_EMAIL) {
            phone.setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        } else if (accountType == CaptchaPurpose.ACCOUNT_TYPE_PHONE) {
            phone.setInputType(InputType.TYPE_CLASS_PHONE);
        } else {
            phone.setInputType(InputType.TYPE_CLASS_TEXT);
        }
        int hintId = codeMsg.get(accountType);
        if (hintId != 0) {
            phone.setHint(hintId);
        }
        if (!TextUtils.isEmpty(phoneTxt)) {
            phone.setText(phoneTxt);
        }
        EditText code = view.findViewById(R.id.et_captcha);
        TextView tvGetCode = view.findViewById(R.id.tv_get_code);
        Button next = view.findViewById(R.id.next);
        SomeMonitorEditText.create(next, phone, code);

        tvGetCode.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                String phoneStr = phone.getText().toString().trim();
                if (!TextUtils.isEmpty(phoneStr)) {
                    CaptchaHelper.requestCaptcha(getContext(), tvGetCode, CaptchaPurpose.RESETPWD, phoneStr, MobileUtils.isEmail(phoneStr));
                } else {
                    ToastUtils.showToast(getContext(), codeMsg.get(accountType));
                }
            }
        });

        next.setOnClickListener(v -> {
            String captcha_code = code.getText().toString().trim();
            if (!TextUtils.isEmpty(captcha_code)) {
                String phoneStr = phone.getText().toString().trim();
                RXSdkApi.getInstance().verifyCaptcha(phoneStr, CaptchaPurpose.RESETPWD, MobileUtils.isEmail(phoneStr), captcha_code, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        showConfirmPasswordDialog(phone, captcha_code);
                    }

                    @Override
                    public void onError(RXException e) {
                        com.ruixue.utils.UIToast.showNetErrorToast(getContext(), e.getCode());
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        com.ruixue.utils.UIToast.showToast(getContext(), cause);
                    }
                });
            } else {
                com.ruixue.utils.UIToast.showToast(getContext(), R.string.txt_enter_captcha);
            }
        });
    }

    private void showConfirmPasswordDialog(EditText phone, String code) {
        modifyPasswordDialog = ConfirmPasswordView.create(getContext(), (isConfirm, password) -> {
            if (isConfirm) {
                if (!TextUtils.isEmpty(password)) {
                    callback.onConfirm(RXErrorCode.SUCCESS, phone.getText().toString().trim(), code, password);
                } else {
                    callback.onConfirm(RXErrorCode.PASSWORD_NULL_ERROR, phone.getText().toString().trim(), code, password);
                }
            }
//                ForgotPasswordView.this.show();
        }).setPasswordHint(pwdHits);
        modifyPasswordDialog.show();
//        this.hide();
    }
}


