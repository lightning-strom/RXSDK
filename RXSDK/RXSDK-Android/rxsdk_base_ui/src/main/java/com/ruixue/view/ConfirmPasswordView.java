package com.ruixue.view;

import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.ResUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.PwdEditText;
import com.ruixue.widget.SomeMonitorEditText;

/**
 * 忘记密码 设置新密码确认
 */
public class ConfirmPasswordView extends RXView {

    protected String title;
    protected String pwdHint;

    protected OnConfirmPasswordListener onConfirmPasswordListener;

    /**
     * Interface definition for a callback to be invoked when a view is clicked.
     */
    public interface OnConfirmPasswordListener {
        void onConfirm(boolean isConfirm, String password);
    }

    public ConfirmPasswordView setOnConfirmPasswordListener(OnConfirmPasswordListener onConfirmPasswordListener) {
        this.onConfirmPasswordListener = onConfirmPasswordListener;
        return this;
    }

    public ConfirmPasswordView(Context context) {
        super(context);
    }

    /**
     * 找回密码下一步Ui
     * @param activity   activity
     * @param rxCallback rxCallback
     */
    public static ConfirmPasswordView create(Context activity, OnConfirmPasswordListener rxCallback) {
        return new ConfirmPasswordView(activity).setOnConfirmPasswordListener(rxCallback);
    }


    public ConfirmPasswordView setTitle(String title) {
        this.title = title;
        return this;
    }

    public ConfirmPasswordView setPasswordHint(String pwdHint) {
        this.pwdHint = pwdHint;
        return this;
    }

    @Override
    public int getStyleId() {
        return com.ruixue.base.R.style.Dialog_None_Ani;
    }

    @Override
    public int getResId() {
        return R.layout.rx_confirm_password;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (onConfirmPasswordListener != null) {
                onConfirmPasswordListener.onConfirm(false, null);
            }
        });
        if (!TextUtils.isEmpty(this.title)) {
            TextView tvTitle = view.findViewById(R.id.title);
            tvTitle.setText(this.title);
        }

        PwdEditText etPwd = view.findViewById(R.id.password);
        if (!TextUtils.isEmpty(pwdHint)) {
            etPwd.setHint(pwdHint);
        }
        PwdEditText etConfirmPwd = view.findViewById(R.id.confirm_password);
        Button sureBtn = view.findViewById(R.id.sure);
        SomeMonitorEditText.create(sureBtn, etPwd.getEditText(), etConfirmPwd.getEditText());
        sureBtn.setOnClickListener(v -> {
            String password = etPwd.getText().toString().trim();
            String confirmPwd = etConfirmPwd.getText().toString().trim();
            if (TextUtils.isEmpty(password)) {
                // "新密码不能为空"
                ToastUtils.showToast(getContext(), (R.string.rx_error_empty_password_new));
                return;
            }
            if (TextUtils.isEmpty(confirmPwd)) {
                ToastUtils.showToast(getContext(), (R.string.rx_error_empty_password_new));
                return;
            }
            if (!confirmPwd.equals(password)) {
                ToastUtils.showToast(getContext(), (R.string.rx_error_password_diff));
                return;
            }
            if (onConfirmPasswordListener != null) {
                onConfirmPasswordListener.onConfirm(true, password);
            }
        });
    }
}
