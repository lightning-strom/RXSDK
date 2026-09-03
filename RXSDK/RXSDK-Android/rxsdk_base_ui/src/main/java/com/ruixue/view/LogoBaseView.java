package com.ruixue.view;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.ImageView;

import com.ruixue.base.PresetEventHelper;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

public abstract class LogoBaseView extends RXView {

    /**
     * 返回按钮
     */
    protected boolean goBackEnable = false;
    protected Drawable mLogoDrawable = null;

    protected OnViewCloseListener onViewCloseListener = null;

    public LogoBaseView(Context context) {
        super(context);
    }

    public LogoBaseView setLogo(Drawable background) {
        mLogoDrawable = background;
        return this;
    }

    public LogoBaseView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }

    public void setOnViewCloseListener(OnViewCloseListener onViewCloseListener) {
        this.onViewCloseListener = onViewCloseListener;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility((!isCancelable() || goBackEnable) ? View.GONE : View.VISIBLE);
        close.setOnClickListener(v -> {
            dialog.cancel();
            if (this instanceof LoginMethodView) {
                PresetEventHelper.loginHide();
            }
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            dialog.dismiss();
        });

        dialog.setOnCancelListener(new OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                if (onViewCloseListener != null) {
                    onViewCloseListener.onClosed(LogoBaseView.this);
                }
            }
        });
        if (mLogoDrawable != null) {
            view.findViewById(R.id.tv_title).setVisibility(View.GONE);
            view.findViewById(R.id.iv_title).setVisibility(View.VISIBLE);
            view.findViewById(R.id.iv_title).setBackground(mLogoDrawable);
        }
    }
}
