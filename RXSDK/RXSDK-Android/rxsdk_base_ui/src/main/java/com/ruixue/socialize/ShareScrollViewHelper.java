package com.ruixue.socialize;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;

import com.ruixue.share.PlatformSns;

import java.util.List;

class ShareScrollViewHelper extends ShareLayoutHelper {
    private static String TAG = ShareScrollViewHelper.class.getSimpleName();

    public ShareScrollViewHelper(ShareDialogConfig shareDialogConfig) {
        super(shareDialogConfig);
    }

    public View createLinearLayout(Context context, List<PlatformSns> snsPlatforms) {
        LinearLayout linearLayout = new LinearLayout(context);
        linearLayout.setOrientation(LinearLayout.HORIZONTAL);
        linearLayout.setGravity(Gravity.CENTER);

        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT);
        layoutParams.weight = 1.0F;
         linearLayout.setLayoutParams(layoutParams);

        for (int i = 0; i < snsPlatforms.size(); ++i) {
            View var7 = this.createSnsButton(context, snsPlatforms.get(i));
             LinearLayout.LayoutParams  lyp= (LinearLayout.LayoutParams) var7.getLayoutParams();
             if (i>0) {
                 lyp.leftMargin = dip2px(context, 15);
             }
             linearLayout.addView(var7);
        }

        return linearLayout;
    }

}