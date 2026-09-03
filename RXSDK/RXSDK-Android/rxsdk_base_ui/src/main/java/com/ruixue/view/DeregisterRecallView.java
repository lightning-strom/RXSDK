package com.ruixue.view;

import android.content.Context;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

import org.json.JSONException;
import org.json.JSONObject;

//撤销注销账号申请界面
public class DeregisterRecallView extends RXView {

    protected String content;
    protected boolean isLoginContinue = true;
    protected String continueText;
    protected RXJSONCallback callback;

    public DeregisterRecallView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public DeregisterRecallView setLoginContinue(boolean loginContinue) {
        isLoginContinue = loginContinue;
        return this;
    }

    public DeregisterRecallView setContinueText(String continueText) {
        this.continueText = continueText;
        return this;
    }


    public static DeregisterRecallView create(Context context) {
        return new DeregisterRecallView(context);
    }

    public DeregisterRecallView(Context context) {
        super(context);
        setCancelable(false);
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public int getResId() {
        return R.layout.rx_account_revoke;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
            dialog.cancel(); //此函数 先执行 onCancel 然后执行 onDismiss
        });
        dialog.setOnCancelListener(new OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                if (callback != null) {
                    callback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
                }
            }
        });
        TextView tvContent = view.findViewById(R.id.tv);
        if (!TextUtils.isEmpty(content)) {
            tvContent.setText(content);
        }
        Button cancel_request = view.findViewById(R.id.cancel_request);
        Button login_continue = view.findViewById(R.id.login_continue);
        if (TextUtils.isEmpty(continueText)) {
            login_continue.setText(isLoginContinue ? R.string.txt_continue_login : R.string.txt_exit_login);
        } else {
            login_continue.setText(continueText);
        }
        cancel_request.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                RXSdkApi.getInstance().deregisterCancel(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        JSONObject jsonObject = data == null ? RXErrorCode.SUCCESS.toJSONObject() : data;
                        try {
                            jsonObject.put("btn_title", login_continue.getText());
                            jsonObject.put("btn_type", 1);
                            jsonObject.put("login_continue", true);
                        } catch (JSONException ignore) {
                        }
                        if (callback != null)
                            callback.onSuccess(jsonObject);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        try {
                            cause.put("btn_title", login_continue.getText());
                            cause.put("btn_type", 1);
                            cause.put("login_continue", isLoginContinue);
                        } catch (JSONException ignore) {
                        }
                        if (callback != null)
                            callback.onFailed(cause);
                    }
                });
            }
        });
        login_continue.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                try {
                    if (isLoginContinue) {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("btn_title", login_continue.getText());
                        jsonObject.put("btnType", 0);
                        jsonObject.put("login_continue", isLoginContinue);
                        callback.onSuccess(jsonObject);
                    } else {
                        JSONObject jsonObject = RXErrorCode.LOGIN_CANCEL.toJSONObject();
                        jsonObject.put("btn_title", login_continue.getText());
                        jsonObject.put("btn_type", 0);
                        jsonObject.put("login_continue", isLoginContinue);
                        callback.onFailed(jsonObject);
                    }
                } catch (JSONException ignore) {
                }
            }
        });
    }
}
