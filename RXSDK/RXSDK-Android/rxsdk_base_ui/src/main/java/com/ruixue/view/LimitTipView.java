package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
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

public class LimitTipView extends RXView {

    String title;
    String content;
    String btnText;

    public LimitTipView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    RXJSONCallback callback;
    int contentHeight = ViewGroup.LayoutParams.WRAP_CONTENT;

    boolean showCloseBtn = false;

    public LimitTipView(Context context) {
        super(context);
    }

    public static LimitTipView create(Context activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback channelCallback) {
        return new LimitTipView(activity).setTitle(titleStr).setContentHeight(160).setContent(contextStr).setButtonText(buttonTxt).setCallback(channelCallback);
    }

    public LimitTipView setShowCloseBtn(boolean showCloseBtn) {
        this.showCloseBtn = showCloseBtn;
        return this;
    }

    /**
     * @param height #ViewGroup.LayoutParams or dp size
     */
    public LimitTipView setContentHeight(int height) {
        this.contentHeight = height > 0 ? DisplayUtils.dip2px(height) : height;
        return this;
    }

    public LimitTipView setButtonText(String name) {
        this.btnText = name;
        return this;
    }

    public LimitTipView setContent(String content) {
        this.content = content;
        return this;
    }

    public LimitTipView setTitle(String title) {
        this.title = title;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_limit_tips;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        TextView tvTitle = view.findViewById(R.id.title);
        tvTitle.setText(this.title);
        TextView tvContent = view.findViewById(R.id.content);
        tvContent.getLayoutParams().height = this.contentHeight;
        tvContent.setText(this.content);
        Button btn_exit = view.findViewById(R.id.btn_exit);
        if (!TextUtils.isEmpty(btnText)) {
            btn_exit.setText(btnText);
        }
        btn_exit.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onSuccess(null);
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
