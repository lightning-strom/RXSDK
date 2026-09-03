package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.entity.Captcha;
import com.ruixue.error.RXException;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.CountDownTimerTextView;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.MobileUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.VerificationCodeView;

import org.json.JSONObject;

public class CaptchaInputView extends RXView {
    protected OnCaptchaCallback callback;

    private String phone;
    private String purpose;
    private TextView tv_count_down;
    private TextView tv_resend_captcha;


    public CaptchaInputView setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public CaptchaInputView setPurpose(String purpose) {
        this.purpose = purpose;
        return this;
    }

    public CaptchaInputView setCallback(OnCaptchaCallback callback) {
        this.callback = callback;
        return this;
    }

    public CaptchaInputView(Context context) {
        super(context);
    }

    /**
     * 绑定手机号UI
     * @param context  context
     * @param purpose  验证码类型
     * @param callback callback
     */
    public static CaptchaInputView create(Context context, String phone, String purpose, OnCaptchaCallback callback) {
        return new CaptchaInputView(context).setPhone(phone).setPurpose(purpose).setCallback(callback);
    }

    public interface OnCaptchaCallback {
        void onFinish(Dialog dialog, String account, @Nullable String captcha);

        void onClosed();
    }

    @Override
    public int getStyleId() {
        return com.ruixue.base.R.style.Dialog_None_Ani;
    }

    @Override
    public int getResId() {
        return R.layout.rx_input_captcha;
    }

    @Override
    public void show() {
        obtainCaptchaCode(new ObtainCaptchaCodeListener() {
            @Override
            public void onSent(boolean success) {
                if (success) {
                    CaptchaInputView.super.show();
                } else {
                    if (callback != null) {
                        callback.onClosed();
                    }
                }
            }
        });
    }

    public interface ObtainCaptchaCodeListener {
        void onSent(boolean success);
    }

    private void obtainCaptchaCode(ObtainCaptchaCodeListener listener) {
        LoadingDialog loadingDialog = LoadingDialog.createLoadingDialog(getContext(), "");
        loadingDialog.setDimAmount(0.5f);
        loadingDialog.setCancelable(true);
        RXSdkApi.getInstance().sendCaptcha(phone, purpose, MobileUtils.isEmail(phone), new RXJSONCallback() {
            @Override
            public void onError(RXException e) {
                com.ruixue.utils.UIToast.showNetErrorToast(getContext(), e.getCode());
                loadingDialog.dismiss();
                if (listener != null) {
                    listener.onSent(false);
                }
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                loadingDialog.dismiss();
                //显示验证码输入界面
                if (listener != null) {
                    listener.onSent(true);
                }
                int surplus = 60;
                if (data != null) {
                    surplus = data.optInt("surplus", 60);
                }
                if (tv_count_down != null) {
                    CountDownTimerTextView.create(tv_count_down, surplus * 1000L, 1000L).setTextSuffix(getContext().getString(R.string.rx_tips_resend)).setFinishListener(new CountDownTimerTextView.OnFinishListener() {
                        @Override
                        public void onFinish() {

                        }
                    }).start();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code");
                com.ruixue.utils.UIToast.showToast(getContext(), cause);
                loadingDialog.dismiss();
                if (listener != null) {
                    listener.onSent(code == Captcha.CAPTCHA_REPEAT_SEND || code == Captcha.CAPTCHA_TEST);
                }
            }
        });
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onClosed();
            }
        });
        tv_count_down = view.findViewById(R.id.tv_resend_captcha);
        TextView tv_phone = view.findViewById(R.id.tv_phone);
        tv_phone.setText(MobileUtils.getPhone(phone));
        tv_count_down.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                obtainCaptchaCode(null);
            }
        });

        VerificationCodeView capthca = view.findViewById(R.id.captcha_code);
        capthca.setOnCodeFinishListener(new VerificationCodeView.OnCodeFinishListener() {
            @Override
            public void onTextChange(View view, String content) {

            }

            @Override
            public void onComplete(View view, String content) {
//                dialog.dismiss();
                if (callback != null) {
                    callback.onFinish(dialog, phone, content);
                }
            }
        });
    }
}
