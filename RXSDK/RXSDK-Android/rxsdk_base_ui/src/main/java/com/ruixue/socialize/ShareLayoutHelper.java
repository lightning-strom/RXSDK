package com.ruixue.socialize;

import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.ruixue.share.PlatformSns;
import com.ruixue.socialize.common.ResUtil;
import com.ruixue.widget.ImageButton;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/31
 */
public abstract class ShareLayoutHelper {
    protected ShareDialogConfig mShareDialogConfig;

    public ShareLayoutHelper(ShareDialogConfig shareDialogConfig) {
        this.mShareDialogConfig = shareDialogConfig;
    }

    protected View createSnsButton(Context context, final PlatformSns snsPlatform) {
        LinearLayout linearLayout = new LinearLayout(context);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.weight = 1.0F;
        linearLayout.setLayoutParams(layoutParams);
        linearLayout.setGravity(Gravity.CENTER);
        if (snsPlatform != null) {
            ResUtil var5 = ResUtil.get(context);
            View snsButton = LayoutInflater.from(context).inflate(var5.layout("rx_sns_button"), (ViewGroup) null);
            ImageButton imageView = (ImageButton) snsButton.findViewById(var5.id("sns_btn_icon"));
            TextView textView = (TextView) snsButton.findViewById(var5.id("sns_btn_text"));
            if (this.mShareDialogConfig.mMenuBgColor != 0 && this.mShareDialogConfig.mMenuBgShape != ShareDialogConfig.BG_SHAPE_NONE) {
                imageView.setBackgroundColor(this.mShareDialogConfig.mMenuBgColor, this.mShareDialogConfig.mMenuBgPressedColor);
                imageView.setBackgroundShape(this.mShareDialogConfig.mMenuBgShape, this.mShareDialogConfig.mMenuBgShapeAngle);
            } else {
                imageView.setPadding(0, 0, 0, 0);
            }

            if (this.mShareDialogConfig.mMenuIconPressedColor != 0) {
                imageView.setPressedColor(this.mShareDialogConfig.mMenuIconPressedColor);
            }

            String snsName = "";

            try {
                snsName = snsPlatform.mShowWord;
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (!TextUtils.isEmpty(snsName)) {
                textView.setText(snsPlatform.mShowWord);
            }

            textView.setGravity(Gravity.CENTER);
            int resId = 0;
            try {
                resId = ResUtil.getResourceId(context, "drawable", snsPlatform.mIcon);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (resId != 0) {
                imageView.setImageResource(resId);
            }

            if (this.mShareDialogConfig.mMenuTextColor != 0) {
                textView.setTextColor(this.mShareDialogConfig.mMenuTextColor);
            }

            snsButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View var1) {
                     if (ShareLayoutHelper.this.mShareDialogConfig != null && ShareLayoutHelper.this.mShareDialogConfig.getShareClickListener() != null) {
                        ShareLayoutHelper.this.mShareDialogConfig.getShareClickListener().onClick(snsPlatform, snsPlatform.mPlatform);
                    }
                }
            });
            linearLayout.addView(snsButton);
        }

        return linearLayout;
    }

    protected int dip2px(Context context, float dp) {
        float density = context.getResources().getDisplayMetrics().density;
        return (int) (dp * density + 0.5F);
    }
}
