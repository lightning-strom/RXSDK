package com.ruixue.socialize;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.PopupWindow;

import androidx.annotation.Nullable;

import com.ruixue.openapi.IRXView;
import com.ruixue.share.PlatformSns;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareAction;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ShareDialogAction extends ShareAction {

    private int mGravity = Gravity.BOTTOM;
    private View view = null;
    private ShareClickListener shareClickListener = null;
    private SharePopupWindow shareDialog;
    private PopupWindow.OnDismissListener mOnDismissListener;

    public ShareDialogAction(Activity activity) {
        super(activity);
    }

    /**
     * 设置分享按钮点击回调,空时候自动执行分享动作
     * @param shareClickListener 分享按钮点击回调
     */
    public ShareDialogAction setShareClickCallback(ShareClickListener shareClickListener) {
        this.shareClickListener = shareClickListener;
        return this;
    }

    public ShareDialogAction setOnDismissListener(PopupWindow.OnDismissListener onDismissListener) {
        this.mOnDismissListener = onDismissListener;
        return this;
    }

    PopupWindow.OnDismissListener getOnDismissListener() {
        return this.mOnDismissListener;
    }

    public ShareDialogAction setDisplayList(List<PlatformType> platformTypes) {
        if (platformTypes != null) {
            this.snsPlatforms.clear();
            for (PlatformType sm : platformTypes) {
                this.snsPlatforms.add(sm.toSnsPlatform());
            }
        }
        return this;
    }

    /**
     * @param platformTypes 分享平台集合
     */
    public ShareDialogAction setDisplayList(PlatformType... platformTypes) {
        return setDisplayList(Arrays.asList(platformTypes));
    }

    /**
     * 添加自定义按钮
     * @param showWord 显示文本
     * @param keyword  唯一关键字标识
     * @param icon     icon res name
     * @param grayIcon 灰色 icon res name
     */
    public ShareDialogAction addButton(String showWord, String keyword, String icon, String grayIcon) {
        this.snsPlatforms.add(PlatformSns.create(showWord, keyword, icon, grayIcon, 0));
        return this;
    }

    /**
     * 显示在 xx 窗口上
     * @param view    要显示的父窗口
     * @param gravity 位置
     */
    public ShareDialogAction withParentView(View view, int gravity) {
        this.mGravity = gravity;
        this.view = view;
        return this;
    }


    public IRXView open(@Nullable ShareDialogConfig config) {
        if (this.snsPlatforms == null || this.snsPlatforms.size() == 0) {
            this.snsPlatforms = getDefaultPlatforms();
        }

        try {
            this.shareDialog = new SharePopupWindow(this.activity, this.snsPlatforms, config);
            this.shareDialog.setShareClickListener(new ShareClickListener() {
                public boolean onClick(PlatformSns snsPlatform, PlatformType platformType) {
                    if (shareClickListener == null || !shareClickListener.onClick(snsPlatform, platformType)) {
                        setPlatform(platformType);
                        share(config != null ? config.getShareParamsMap() : null);
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            this.shareDialog.setOnDismissListener(new PopupWindow.OnDismissListener() {
                @Override
                public void onDismiss() {
                    if (getOnDismissListener() != null) {
                        getOnDismissListener().onDismiss();
                    }
                }
            });

            this.shareDialog.setFocusable(true);
            this.shareDialog.setBackgroundDrawable(new BitmapDrawable(null, (Bitmap) null));
            if (this.view == null) {
                this.view = this.activity.getWindow().getDecorView();//获取最顶层的View
            }

            this.shareDialog.showAtLocation(this.view, this.mGravity, 0, 0);
            return this.shareDialog;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    public IRXView open() {
        return this.open((ShareDialogConfig) null);
    }

    public void close() {
        if (this.shareDialog != null) {
            this.shareDialog.dismiss();
            this.shareDialog = null;
        }
    }

    private List<PlatformSns> getDefaultPlatforms() {
        List<PlatformSns> snsPlatforms = new ArrayList<>();
        snsPlatforms.add(PlatformType.WECHAT.toSnsPlatform());
        snsPlatforms.add(PlatformType.WECHAT_CIRCLE.toSnsPlatform());

        return snsPlatforms;
    }

    /**
     * @return 界面位置
     */
    public static Rect locateView(View view) {
        int[] pos = new int[2];
        if (view == null) {
            return null;
        } else {
            try {
                view.getLocationOnScreen(pos);
            } catch (NullPointerException e) {
                e.printStackTrace();
                return null;
            }

            Rect rect = new Rect();
            rect.left = pos[0];
            rect.top = pos[1];
            rect.right = rect.left + view.getWidth();
            rect.bottom = rect.top + view.getHeight();
            return rect;
        }
    }
}
