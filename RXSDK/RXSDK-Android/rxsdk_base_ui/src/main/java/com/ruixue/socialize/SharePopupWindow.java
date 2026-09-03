package com.ruixue.socialize;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.content.res.Configuration;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.LinearLayout;
import android.widget.PopupWindow;

import androidx.annotation.Nullable;

import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXView;
import com.ruixue.share.PlatformType;
import com.ruixue.share.PlatformSns;

import java.util.List;

public class SharePopupWindow extends android.widget.PopupWindow implements IRXView {
    private final ShareDialogConfig popupWindowConfig;

    public SharePopupWindow(Context context, List<PlatformSns> snsPlatforms) {
        this(context, snsPlatforms, (ShareDialogConfig) null);
    }

    public SharePopupWindow(Context context, List<PlatformSns> snsPlatforms, @Nullable ShareDialogConfig sharePopupWindowConfig) {
        super(context);
        this.setWindowLayoutMode(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        if (sharePopupWindowConfig == null) {
            sharePopupWindowConfig = new ShareDialogConfig();
        }
        this.popupWindowConfig = sharePopupWindowConfig;
        boolean isLandscape = context.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        sharePopupWindowConfig.setOrientation(isLandscape);

        ShareLayout shareLayout = this.popupWindowConfig.getLayoutStyle() == ShareDialogConfig.LAYOUT_VIEW_SCROLL ? new ShareScrollView(context) : new ShareViewPager(context);

        shareLayout.setSnsPlatformData(snsPlatforms, sharePopupWindowConfig);
        LayoutParams layoutParams = new LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        shareLayout.setLayoutParams(layoutParams);
        shareLayout.setDismissListener(new PopupWindow.OnDismissListener() {
            public void onDismiss() {
                SharePopupWindow.this.dismiss();
            }
        });

        this.setContentView(shareLayout);
        this.setFocusable(true);
    }

    @Override
    public IRXView setCancelable(boolean flag) {

        return this;
    }

    public IRXView setCanceledOnTouchOutside(boolean cancel) {
        if (popupWindowConfig != null)
            this.popupWindowConfig.setCanceledOnTouchOutside(cancel);
        return this;
    }

    @Override
    public boolean isCancelable() {
        return false;
    }

    @Override
    public void show() {

    }

    public void setShareClickListener(final ShareClickListener shareClickListener) {
        if (this.popupWindowConfig != null) {
            this.popupWindowConfig.setShareClickListener(new ShareClickListener() {
                public boolean onClick(PlatformSns var1x, PlatformType var2) {
                    SharePopupWindow.this.setOnDismissListener((PopupWindow.OnDismissListener) null);
                    SharePopupWindow.this.dismiss();
                    if (shareClickListener != null) {
                        return shareClickListener.onClick(var1x, var2);
                    } else {
                        return false;
                    }
                }
            });
        } else {
            RXLogger.e("popupWindowConfig is null error");
        }
    }

    @Override
    public void cancel() {

    }
}
