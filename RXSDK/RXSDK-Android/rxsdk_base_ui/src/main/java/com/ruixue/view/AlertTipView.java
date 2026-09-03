package com.ruixue.view;

import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.DisplayUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.widget.BaseDialog;

public class AlertTipView extends RXView {

    String title = "";
    int gravity = Gravity.CENTER;
    String content = "";
    String btnOkText;
    String btnCancelText;
    RXJSONCallback callback;
    int contentHeight = ViewGroup.LayoutParams.WRAP_CONTENT;

    boolean showCloseBtn = false;

    boolean textIsSelectable = false;

    public AlertTipView setTextIsSelectable(boolean textIsSelectable) {
        this.textIsSelectable = textIsSelectable;
        return this;
    }

    public AlertTipView(Context context) {
        super(context);
    }

    public static AlertTipView create(Context activity) {
        return new AlertTipView(activity);
    }

    public static AlertTipView create(Context activity, String titleStr, String contextStr, RXJSONCallback channelCallback) {
        return new AlertTipView(activity).setTitle(titleStr).setContent(contextStr).setCallback(channelCallback);
    }

    public AlertTipView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public AlertTipView setShowCloseBtn(boolean showCloseBtn) {
        this.showCloseBtn = showCloseBtn;
        return this;
    }

    /**
     * @param height #ViewGroup.LayoutParams or dp size
     */
    public AlertTipView setContentHeight(int height) {
        this.contentHeight = height > 0 ? DisplayUtils.dip2px(height) : height;
        return this;
    }

    public AlertTipView setOkText(String text) {
        this.btnOkText = text;
        return this;
    }

    public AlertTipView setCancelText(String text) {
        this.btnCancelText = text;
        return this;
    }

    public AlertTipView setTitle(String title) {
        this.title = title;
        return this;
    }

    public AlertTipView setContent(String content) {
        this.content = content;
        return this;
    }

    public AlertTipView setContentGravity(int gravity) {
        if (gravity != Gravity.NO_GRAVITY) {
            this.gravity = gravity;
        }
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_ok_cancel_dialog;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        TextView tvTitle = view.findViewById(R.id.title);
        if (!TextUtils.isEmpty(this.title)) {
            tvTitle.setText(this.title);
        }
        TextView tvContent = view.findViewById(R.id.content);
        tvContent.getLayoutParams().height = this.contentHeight;
        tvContent.setGravity(gravity);
        tvContent.setText(this.content);
        tvContent.setTextIsSelectable(textIsSelectable);

        Button cancel_btn = view.findViewById(R.id.cancel_btn);
        Button sure_btn = view.findViewById(R.id.sure_btn);
        cancel_btn.setText(R.string.txt_cancel);
        sure_btn.setText(R.string.txt_ok);
        if (!TextUtils.isEmpty(btnCancelText)) {
            cancel_btn.setText(btnCancelText);
        }
        if (!TextUtils.isEmpty(btnOkText)) {
            sure_btn.setText(btnOkText);
        }

        sure_btn.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onSuccess(null);
            }
        });
        cancel_btn.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
            }
        });
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(showCloseBtn ? View.VISIBLE : View.GONE);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.cancel();
            }
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UI_CLOSE));
            }
        });
    }
}
