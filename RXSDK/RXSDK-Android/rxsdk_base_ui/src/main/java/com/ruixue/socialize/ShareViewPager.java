package com.ruixue.socialize;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.StateListDrawable;
import android.text.TextUtils.TruncateAt;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Px;
import androidx.cardview.widget.CardView;
import androidx.viewpager.widget.ViewPager;

import com.ruixue.share.PlatformSns;

import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

public class ShareViewPager extends ShareLayout {
    private ShareDialogConfig mConfig;

    public ShareViewPager(Context context) {
        super(context);
    }

    @Override
    View createShareLayout(@NonNull List<PlatformSns> snsPlatforms, @NonNull ShareDialogConfig config) {
        this.mConfig = config;
        LinearLayout linearLayout = new LinearLayout(this.getContext());
        linearLayout.setBackgroundColor(this.mConfig.mShareLayoutBgColor);
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        if (this.mConfig.mShareLayoutPosition == ShareDialogConfig.LAYOUT_POSITION_CENTER && this.mConfig.mTopMargin != 0) {
            layoutParams.topMargin = this.mConfig.mTopMargin;
        }

        linearLayout.setOrientation(LinearLayout.VERTICAL);
        linearLayout.setLayoutParams(layoutParams);
        if (this.mConfig.mTitleVisibility) {
            View shareTitle = this.createShareTitle();
            linearLayout.addView(shareTitle);
        }

        int height = this.mConfig.calcViewPagerHeightDp(snsPlatforms.size());
        ViewPager viewPager = new ViewPager(this.getContext());
        ShareViewPagerAdapter socializeMenuPagerAdapter = new ShareViewPagerAdapter(this.getContext(), this.mConfig);
        socializeMenuPagerAdapter.setData(snsPlatforms);
        this.setViewPagerLayout(viewPager, height);
        linearLayout.addView(viewPager);
        viewPager.setAdapter(socializeMenuPagerAdapter);
        final IndicatorView indicatorView = this.mConfig.mIndicatorVisibility ? this.createIndicatorView() : null;
        if (indicatorView != null) {
            indicatorView.setPageCount(socializeMenuPagerAdapter.getCount());
            linearLayout.addView(indicatorView);
        }

        ViewPager.OnPageChangeListener pageChangeListener = new ViewPager.OnPageChangeListener() {
            public void onPageScrolled(int position, float positionOffset, @Px int positionOffsetPixels) {
            }

            public void onPageSelected(int var1) {
                if (indicatorView != null) {
                    indicatorView.setSelectedPosition(var1);
                }
            }

            public void onPageScrollStateChanged(int var1) {
            }
        };
        viewPager.addOnPageChangeListener(pageChangeListener);

        if (this.mConfig.mCancelBtnVisibility) {
            View cancelBtn = this.createCancelBtn();
            linearLayout.addView(cancelBtn);
        }

        CardView cardView = new CardView(this.getContext());
        cardView.setLayoutParams(layoutParams);
        cardView.setRadius(dip2px(ShareDialogConfig.LAYOUT_CORNER_RADIUS));
        cardView.addView(linearLayout);
        cardView.setClickable(true);
        cardView.setFocusable(true);
        return cardView;
    }


    private View createShareTitle() {
        TextView textView = new TextView(this.getContext());
        textView.setText(this.mConfig.mTitleText);
        textView.setTextColor(this.mConfig.mTitleTextColor);
        textView.setTextSize(ShareDialogConfig.TITLE_TEXT_SIZE_IN_SP);
        textView.setGravity(Gravity.CENTER);
        textView.setMaxLines(1);
        textView.setEllipsize(TruncateAt.END);
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        layoutParams.topMargin = this.dip2px(ShareDialogConfig.TITLE_TOP_MARGIN);
        textView.setLayoutParams(layoutParams);
        return textView;
    }


    private void setViewPagerLayout(View view, int height) {
        int var3 = this.dip2px(ShareDialogConfig.MENU_TOP_MARGIN);
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, this.dip2px((float) height));
        layoutParams.topMargin = var3;
        layoutParams.leftMargin = layoutParams.rightMargin = this.dip2px(ShareDialogConfig.VIEW_PAGER_LEFT_MARGIN);
        view.setLayoutParams(layoutParams);
        view.setPadding(0, 0, 0, var3);
    }

    public IndicatorView createIndicatorView() {
        int px = this.dip2px(ShareDialogConfig.INDICATOR_BOTTOM_MARGIN);
        IndicatorView indicatorView = new IndicatorView(this.getContext());
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        layoutParams.bottomMargin = px;
        indicatorView.setLayoutParams(layoutParams);
        indicatorView.setIndicatorColor(this.mConfig.mIndicatorNormalColor, this.mConfig.mIndicatorSelectedColor);
        indicatorView.setIndicator(ShareDialogConfig.INDICATOR_SIZE, ShareDialogConfig.INDICATOR_SPACE);
        return indicatorView;
    }

    /**
     * 取消按钮
     */
    public View createCancelBtn() {
        TextView textView = new TextView(this.getContext());
        textView.setText(this.mConfig.mCancelBtnText);
        textView.setTextColor(this.mConfig.mCancelBtnColor);
        textView.setClickable(true);
        textView.setTextSize(ShareDialogConfig.CANCEL_BTN_TEXT_SIZE_IN_SP);
        textView.setGravity(Gravity.CENTER);
        if (this.mConfig.mCancelBtnBgPressedColor != 0) {
            textView.setBackground(this.getBtnBg());
        } else {
            textView.setBackgroundColor(this.mConfig.mCancelBtnBgColor);
        }
        textView.setOnClickListener(new OnClickListener() {
            public void onClick(View var1) {
                if (ShareViewPager.this.mDismissListener != null) {
                    ShareViewPager.this.mDismissListener.onDismiss();
                }
            }
        });
        int var2 = this.dip2px(ShareDialogConfig.CANCEL_BTN_HEIGHT);
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, var2);
        textView.setLayoutParams(layoutParams);
        return textView;
    }

    private StateListDrawable getBtnBg() {
        ColorDrawable var1 = new ColorDrawable(this.mConfig.mCancelBtnBgColor);
        ColorDrawable colorDrawable = new ColorDrawable(this.mConfig.mCancelBtnBgPressedColor);
        StateListDrawable stateListDrawable = new StateListDrawable();

        stateListDrawable.addState(new int[]{android.R.attr.state_pressed}, colorDrawable);
        stateListDrawable.addState(new int[0], var1);
        return stateListDrawable;
    }

}
