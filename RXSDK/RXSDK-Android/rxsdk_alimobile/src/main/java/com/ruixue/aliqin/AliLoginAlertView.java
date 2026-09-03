package com.ruixue.aliqin;

import android.content.Context;
import android.view.View;
import android.widget.ImageView;

import com.ruixue.alimobile.R;
import com.ruixue.openapi.RXView;
import com.ruixue.utils.AppUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.LoginButtonGroup;

import java.util.List;

/**
 * Created by wangliang on 2024/9/13
 */
public class AliLoginAlertView extends RXView {

    AliFailedCallback callback;

    boolean showCloseBtn = false;
    List<String> otherLoginMethods;

    public AliLoginAlertView(Context context) {
        super(context);
    }

    private static AliLoginAlertView instance;

    public static AliLoginAlertView create(Context activity) {

        if (instance == null) {
            instance = new AliLoginAlertView(activity);
        }
        return instance;
    }

    public static AliLoginAlertView create(Context activity, List<String> otherLoginMethods, AliFailedCallback channelCallback) {
        return create(activity).setOtherLoginMethods(otherLoginMethods).setCallback(channelCallback);
    }

    public AliLoginAlertView setOtherLoginMethods(List<String> otherLoginMethods) {
        this.otherLoginMethods = otherLoginMethods;
        return this;
    }

    public AliLoginAlertView setCallback(AliFailedCallback callback) {
        this.callback = callback;
        return this;
    }

    public AliLoginAlertView setShowCloseBtn(boolean showCloseBtn) {
        this.showCloseBtn = showCloseBtn;
        return this;
    }

    @Override
    public int getStyleId() {
        return com.ruixue.ui.R.style.ScaleFade;
    }

    @Override
    public int getResId() {
        return R.layout.dialog_ali_login_failed;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        view.findViewById(R.id.fullContainer).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.cancel();
            }
        });
        ImageView close = view.findViewById(R.id.btn_close);
        close.setVisibility(showCloseBtn ? View.VISIBLE : View.GONE);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.cancel();
            }
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (callback != null) {
                callback.onCancel();
            }
        });

        LoginButtonGroup otherLoginContainer = view.findViewById(R.id.other_login_container);
        if (otherLoginMethods == null || otherLoginMethods.isEmpty()) {
            otherLoginContainer.setVisibility(View.GONE);
        } else {
            otherLoginContainer.setVisibility(View.VISIBLE);
            int size = com.ruixue.utils.AppUtils.isUsePortMatch(getContext()) ? 4 : 3;
            otherLoginContainer.setLoginMethods(otherLoginMethods, otherLoginMethods.size() > size);
            otherLoginContainer.setLoginButtonClickListener(new LoginButtonGroup.LoginButtonClickListener() {
                @Override
                public void onLoginButtonClick(String method) {
                    dismiss();
                    if (callback != null) {
                        callback.onOtherLogin(method);
                    }
                }
            });
        }
    }

    public interface AliFailedCallback {

        void onCancel();

        void onOtherLogin(String loginMethod);
    }
}

