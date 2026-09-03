package com.ruixue.realauth;


import android.animation.Animator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.DecelerateInterpolator;
import android.widget.FrameLayout;
import android.widget.PopupWindow;

import androidx.annotation.NonNull;

// Created by wangliang on 2025/5/21.
public class AnimatedPopupWindow {

    private final PopupWindow popupWindow;
    private final View animatedView;
    private final View backgroundOverlay;

    public AnimatedPopupWindow(Context context, View rootView) {
        // 创建根布局（透明遮罩 + 内容视图）
        FrameLayout rootLayout = new FrameLayout(context);

        rootLayout.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        // 遮罩层
        backgroundOverlay = new FrameLayout(context);
        backgroundOverlay.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        backgroundOverlay.setBackgroundColor(Color.parseColor("#00000000")); // 透明（你也可以改为半透明）
        rootLayout.addView(backgroundOverlay);

        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.gravity = Gravity.BOTTOM | Gravity.CLIP_HORIZONTAL;
        // 内容视图
        rootLayout.addView(rootView, layoutParams);
        animatedView = rootView;
        popupWindow = new PopupWindow(rootLayout,
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                false);
        popupWindow.setClippingEnabled(false);
        popupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        popupWindow.setOutsideTouchable(false);
        popupWindow.setFocusable(false);

        // 初始设置位置
        rootLayout.post(() -> animatedView.setTranslationY(animatedView.getHeight()));

        // 点击遮罩层触发动画 dismiss
        backgroundOverlay.setOnClickListener(v -> dismissWithAnimation());
    }

    private int getRealScreenWidth(Context context) {
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics metrics = new DisplayMetrics();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (context.getDisplay() != null) {
                context.getDisplay().getRealMetrics(metrics);
            }
        } else {
            if (wm.getDefaultDisplay() != null) {
                wm.getDefaultDisplay().getRealMetrics(metrics);
            }

        }
        return metrics.widthPixels;
    }

    public void show(View parentView) {
        if (!popupWindow.isShowing()) {
            popupWindow.showAtLocation(parentView, Gravity.BOTTOM, 0, 0);
            animatedView.setVisibility(View.INVISIBLE);
            animatedView.post(new Runnable() {
                @Override
                public void run() {
                    animatedView.setTranslationY(animatedView.getHeight());
                    animatedView.animate()
                            .translationY(0)
                            .setDuration(300)
                            .setListener(new Animator.AnimatorListener() {
                                @Override
                                public void onAnimationStart(@NonNull Animator animation) {
                                    animatedView.setVisibility(View.VISIBLE);
                                }

                                @Override
                                public void onAnimationEnd(@NonNull Animator animation) {

                                }

                                @Override
                                public void onAnimationCancel(@NonNull Animator animation) {

                                }

                                @Override
                                public void onAnimationRepeat(@NonNull Animator animation) {

                                }
                            })
                            .setInterpolator(new DecelerateInterpolator())
                            .start();
                }
            });

        }
    }

    private boolean hideKeyboardAniming = false;

    public void dismissWithAnimation() {
        if (popupWindow.isShowing()) {
            if (hideKeyboardAniming) {
                return;
            }
            hideKeyboardAniming = true;
            animatedView.animate()
                    .translationY(animatedView.getHeight())
                    .setDuration(300)
                    .setInterpolator(new AccelerateInterpolator())
                    .withEndAction(() -> {
                        popupWindow.dismiss();
                        hideKeyboardAniming = false;
                    })
                    .start();
        } else {
            hideKeyboardAniming = false;
        }
    }

    public boolean isShowing() {
        return popupWindow.isShowing();
    }

    public void setOnDismissListener(PopupWindow.OnDismissListener listener) {
        popupWindow.setOnDismissListener(listener);
    }

    public View getContentView() {
        return animatedView;
    }

    public PopupWindow getPopupWindow() {
        return popupWindow;
    }
}
