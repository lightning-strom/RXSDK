package com.ruixue.view;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.error.RXException;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.ui.R;
import com.ruixue.utils.CountDownTimerTextView;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.UIToast;

import org.json.JSONObject;

import java.util.Objects;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/23
 */
public class CaptchaHelper {

    public static void requestCaptcha(Context context, TextView countDown, String purpose, String account, boolean isEmail) {

        LoadingDialog loadingDialog = LoadingDialog.createLoadingDialog(context, "");

        Handler myHandler = new Handler(Objects.requireNonNull(Looper.myLooper())) {
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                int surplus = Integer.parseInt(msg.obj.toString());
                UIToast.showSuccessToast(context, R.string.rx_toast_sent);
                if (countDown != null) {
                    CountDownTimerTextView.create(countDown, surplus * 1000L, 1000L).start();
                }
            }
        };

        boolean send = RXApiHelper.Passport.sendCaptcha(account, purpose, isEmail, null, null, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                loadingDialog.dismiss();
                PresetEventHelper.getCaptchaCode(true, purpose, isEmail, null);
                int surplus = 60;
                if (data != null) {
                    surplus = data.optInt("surplus", 60);
                }
                Message message = new Message();
                message.obj = surplus;
                myHandler.sendMessage(message);
                //                UIToast.showToast(context, R.string.rx_toast_sent);
                //                if (countDown != null) {
                //                    CountDownTimerTextView.create(countDown, surplus * 1000L, 1000L).start();
                //                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                loadingDialog.dismiss();
                PresetEventHelper.getCaptchaCode(false, purpose, isEmail, cause);
                int code = cause.optInt("code", 0);
                JSONObject data = cause.optJSONObject("data");
                int captcha_app_id = 0;
                if (data != null) {
                    captcha_app_id = data.optInt("captcha_app_id", 0);
                }
                if (code == 312241) {
                    CaptchaVerifyView.create(context, account, purpose, isEmail, this).setAppid(captcha_app_id).show();
                } else if (code > 0) {
                    com.ruixue.utils.UIToast.showToast(context, cause);
                }
            }

            @Override
            public void onError(RXException e) {
                loadingDialog.dismiss();
                PresetEventHelper.getCaptchaCode(false, purpose, isEmail, e.toJSONObject());
                com.ruixue.utils.UIToast.showNetErrorToast(context, e.getCode());
            }
        });

        if (!send) {
            loadingDialog.dismiss();
        }
    }

    public static void requestCaptcha(Context context, String purpose, String account, boolean isEmail) {
        requestCaptcha(context, null, purpose, account, isEmail);
    }


}
