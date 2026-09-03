package com.ruixue.socialize;

import android.content.Context;
import android.graphics.drawable.GradientDrawable;
import android.util.AttributeSet;
import android.view.Gravity;
import android.widget.PopupWindow;
import android.graphics.Color;

import android.view.View;
import android.view.animation.AlphaAnimation;
import android.widget.RelativeLayout;
import android.widget.PopupWindow.OnDismissListener;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.share.PlatformSns;

import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

public abstract class ShareLayout extends RelativeLayout {

    protected PopupWindow.OnDismissListener mDismissListener;

    public ShareLayout(Context context) {
        super(context);
    }

    public ShareLayout(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    public ShareLayout(Context context, AttributeSet attributeSet, int var3) {
        super(context, attributeSet, var3);
    }

    public ShareLayout(Context context, AttributeSet attributeSet, int var3, int var4) {
        super(context, attributeSet, var3, var4);
    }

    public void setSnsPlatformData(List<PlatformSns> snsPlatforms) {
        ShareDialogConfig var2 = new ShareDialogConfig();
        this.setSnsPlatformData(snsPlatforms, var2);
    }

    public void setSnsPlatformData(@NonNull List<PlatformSns> snsPlatforms, @Nullable ShareDialogConfig config) {

        this.init(snsPlatforms, config);
    }

    private void init(@NonNull List<PlatformSns> snsPlatforms, @Nullable ShareDialogConfig config) {
        if (config == null) {
            config = new ShareDialogConfig();
        }
        ShareDialogConfig finalConfig = config;

        this.setBackgroundColor(Color.argb(100, 0, 0, 0));

        AlphaAnimation alphaAnimation = new AlphaAnimation(0.0F, 1.0F);
        alphaAnimation.setDuration(100L);
        this.setAnimation(alphaAnimation);
//        this.setOrientation(LinearLayout.VERTICAL);
        if (config.mShareLayoutPosition == ShareDialogConfig.LAYOUT_POSITION_BOTTOM) {
            this.setGravity(Gravity.BOTTOM);
        } else if (config.mShareLayoutPosition == ShareDialogConfig.LAYOUT_POSITION_CENTER) {
            this.setGravity(Gravity.CENTER);
            int lrPadding = this.dip2px(ShareDialogConfig.CENTER_MENU_LEFT_PADDING);
            this.setPadding(lrPadding, 0, lrPadding, 0);
        }

        this.setOnClickListener(new OnClickListener() {
            public void onClick(View var1) {
                if (finalConfig.isCanceledOnTouchOutside() && ShareLayout.this.mDismissListener != null) {
                    ShareLayout.this.mDismissListener.onDismiss();
                }
            }
        });
        View shareLayout = this.createShareLayout(snsPlatforms, config);
        this.addView(shareLayout);
    }

    abstract View createShareLayout(@NonNull List<PlatformSns> snsPlatforms, @NonNull ShareDialogConfig config);

    /**
     * @return 获取圆角背景 shape
     */
    @NonNull
    protected GradientDrawable getGradientDrawable() {
        GradientDrawable gradientDrawable = new GradientDrawable();
        gradientDrawable.setShape(GradientDrawable.RECTANGLE);
        gradientDrawable.setColor(Color.WHITE);
//        gradientDrawable.setStroke(10, Color.BLUE);
        gradientDrawable.setCornerRadius(dip2px(ShareDialogConfig.LAYOUT_CORNER_RADIUS));
//        gradientDrawable.setSize(50, 50);
        return gradientDrawable;
    }


    protected int dip2px(float dip) {
        float density = this.getContext().getResources().getDisplayMetrics().density;
        return (int) (dip * density + 0.5F);
    }

    void setDismissListener(OnDismissListener onDismissListener) {
        this.mDismissListener = onDismissListener;
    }
}
