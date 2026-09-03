package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.error.RXException;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

public class ChangePhoneView extends RXView {

    protected RXJSONCallback callback;

    public ChangePhoneView setShowOldPhoneInput(boolean showOldPhoneInput) {
        this.showOldPhoneInput = showOldPhoneInput;
        return this;
    }

    public ChangePhoneView setOldPhone(String oldPhone) {
        this.oldPhone = oldPhone;
        return this;
    }

    boolean showOldPhoneInput;

    String oldPhone;

    public ChangePhoneView(Context context) {
        super(context);
    }

    public ChangePhoneView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    /**
     * UI
     * @param activity activity
     * @param callback callback
     */
    public static ChangePhoneView create(Activity activity, RXJSONCallback callback) {
        return new ChangePhoneView(activity).setCallback(callback);
    }

    @Override
    public int getResId() {
        return R.layout.rx_change_phone;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
        });

        EditText et_old_phone = view.findViewById(R.id.et_old_phone);
        if (!TextUtils.isEmpty(oldPhone)) {
            et_old_phone.setText(oldPhone);
        } else if (!showOldPhoneInput) {
            et_old_phone.setVisibility(View.GONE);
        }
        EditText et_old_captcha = view.findViewById(R.id.et_old_captcha);
        TextView tv_old_get_code = view.findViewById(R.id.tv_old_get_code);
        tv_old_get_code.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CaptchaHelper.requestCaptcha(getContext(), tv_old_get_code, CaptchaPurpose.UNBINDPHONE, et_old_phone.getText().toString(), false);
            }
        });

        EditText tv_new_phone = view.findViewById(R.id.tv_new_phone);
        EditText et_new_captcha = view.findViewById(R.id.et_new_captcha);
        TextView tv_get_code = view.findViewById(R.id.tv_get_code);
        tv_get_code.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CaptchaHelper.requestCaptcha(getContext(), tv_get_code, CaptchaPurpose.BINDPHONE, tv_new_phone.getText().toString(), false);
            }
        });

        Button btn_finish = view.findViewById(R.id.btn_finish);

        SomeMonitorEditText.create(btn_finish, tv_new_phone, et_new_captcha, et_old_captcha);

        btn_finish.setOnClickListener(v -> {
            LoadingDialog xdialog = LoadingDialog.createLoadingDialog(getContext(), "");
            RXSdkApi.getInstance().changePhone(tv_new_phone.getText().toString(), et_new_captcha.getText().toString(), et_old_captcha.getText().toString(), null, new RXJSONCallback() {
                @Override
                public void onError(RXException e) {
                    xdialog.close();
                    if (null != callback) {
                        callback.onError(e);
                    }
                     com.ruixue.utils.UIToast.showNetErrorToast(getContext(), e.getCode());
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    xdialog.close();
                    dialog.dismiss();
                    ToastUtils.showToast(getContext(), R.string.rx_tips_modify_success_relogin);
                    if (null != callback) {
                        callback.onSuccess(data);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (null != callback) {
                        callback.onFailed(cause);
                    }
                    xdialog.close();
                    com.ruixue.utils.UIToast.showToast(getContext(), cause);
                }
            });

        });
    }
}
