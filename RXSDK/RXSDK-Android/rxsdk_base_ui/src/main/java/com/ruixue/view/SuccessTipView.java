package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruixue.RXJSONCallback;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

public class SuccessTipView extends RXView {

    String title;
    String content;
    String btnText;

    int btnTextResId;
    int titleResId;
    int contentResId;
    int icoResId;
    RXJSONCallback callback;

    public SuccessTipView(Context context) {
        super(context);
    }

    public static SuccessTipView create(Context activity) {
        return new SuccessTipView(activity);
    }

    public static SuccessTipView create(Context activity, int titleResId, int contentResId, RXJSONCallback channelCallback) {
        return new SuccessTipView(activity).setTitle(activity.getString(titleResId)).setContent(activity.getString(contentResId)).setCallback(channelCallback);
    }

    public static SuccessTipView create(Context activity, String titleStr, String contextStr, RXJSONCallback channelCallback) {
        return new SuccessTipView(activity).setTitle(titleStr).setContent(contextStr).setCallback(channelCallback);
    }

    public SuccessTipView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public SuccessTipView setButtonText(String name) {
        this.btnText = name;
        return this;
    }

    public SuccessTipView setButtonText(int btnTextResId) {
        this.btnTextResId = btnTextResId;
        return this;
    }

    public SuccessTipView setContent(String content) {
        this.content = content;
        return this;
    }

    public SuccessTipView setContent(int contentResId) {
        this.contentResId = contentResId;
        return this;
    }

    public SuccessTipView setTitle(String title) {
        this.title = title;
        return this;
    }

    public SuccessTipView setTitle(int titleResId) {
        this.titleResId = titleResId;
        return this;
    }

    public SuccessTipView setIcoResId(int resid) {
        this.icoResId = resid;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_success_tips;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        dialog.setOnCancelListener(dialog1 -> {
            if (callback != null) {
                callback.onSuccess(null);
            }
        });
        if (icoResId != 0) {
            ImageView ico_success = view.findViewById(R.id.ico_success);
            ico_success.setBackgroundResource(icoResId);
        }
        TextView tvTitle = view.findViewById(R.id.title);
        if (!TextUtils.isEmpty(title)) {
            tvTitle.setText(this.title);
        } else if (titleResId != 0) {
            tvTitle.setText(titleResId);
        }
        TextView tvContent = view.findViewById(R.id.content);
        if (!TextUtils.isEmpty(content)) {
            tvContent.setText(this.content);
        } else if (contentResId != 0) {
            tvContent.setText(contentResId);
        }

        Button ok = view.findViewById(R.id.ok);
        if (!TextUtils.isEmpty(btnText)) {
            ok.setText(btnText);
        } else if (btnTextResId != 0) {
            ok.setText(btnTextResId);
        }
        ok.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onSuccess(null);
            }
        });
    }
}
