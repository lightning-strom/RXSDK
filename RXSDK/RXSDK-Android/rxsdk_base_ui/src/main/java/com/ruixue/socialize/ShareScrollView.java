package com.ruixue.socialize;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.HorizontalScrollView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.share.PlatformSns;
import com.ruixue.socialize.common.ResUtil;
import com.ruixue.ui.R;

import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/27
 */
public class ShareScrollView extends ShareLayout {

    private ShareScrollViewHelper mMenuHelper;

    public ShareScrollView(Context context) {
        super(context);
//        LayoutParams layoutParams = new LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
//        this.setGravity(Gravity.CENTER);
//        this.setBackgroundColor(Color.RED);
    }

    @Override
    View createShareLayout(@NonNull List<PlatformSns> snsPlatforms, @NonNull ShareDialogConfig config) {
        ResUtil var5 = ResUtil.get(getContext());
        View view = LayoutInflater.from(getContext()).inflate(var5.layout("rx_sns_scroll_layout1"), (ViewGroup) null);
        HorizontalScrollView scrollView = view.findViewById(R.id.layout_share_btns);

        View cancelTxvBtn = view.findViewById(R.id.txv_cancel);
        cancelTxvBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ShareScrollView.this.mDismissListener != null) {
                    ShareScrollView.this.mDismissListener.onDismiss();
                }
            }
        });
        RelativeLayout.LayoutParams layoutParams = new LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(CENTER_IN_PARENT);
        view.setLayoutParams(layoutParams);

//        view.setBackgroundColor(Color.BLUE);
        this.mMenuHelper = new ShareScrollViewHelper(config);
        View var3 = this.mMenuHelper.createLinearLayout(getContext(), snsPlatforms);
        scrollView.addView(var3);
        return view;
    }
}
