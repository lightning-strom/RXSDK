package com.ruixue.widget;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.GradientDrawable;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.animation.LinearInterpolator;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/17
 */
public class LoginButton extends RelativeLayout {
    private int color;
    private int[] colors;
    private int alpha;

    TextView textView;
    ImageView imageView;
    RelativeLayout rootLayout;
    View rxLoginLast;
    float oriY;

    public LoginButton(Context context) {
        super(context);
    }

    public LoginButton(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.setClipChildren(false);
        this.setClipToPadding(false);
        // 加载布局
//        LayoutInflater.from(context).inflate(AppUtils.isUsePortMatch(context) ? R.layout.rx_login_button_port : R.layout.rx_login_button, this);
        LayoutInflater.from(context).inflate( R.layout.rx_login_button, this);
        init(context, attrs);
        //        setWillNotDraw(false);
    }

    private void init(Context context, AttributeSet attrs) {
        // 获取控件
        rootLayout = findViewById(R.id.rel_root);
        imageView = findViewById(R.id.iv_ico_method);
        textView = findViewById(R.id.tv_name);
        rxLoginLast = findViewById(R.id.rx_last_login);
        oriY=AppUtils.dp2px(context,-9);

         //        TypedArray array = context.obtainStyledAttributes(attrs, R.styleable.LoginButtonConfig);
        //        color = array.getColor(R.styleable.LoginButtonLayout_background_color, 0X0000000);
        //        alpha = array.getInteger(R.styleable.LoginButtonLayout_background_alpha, 100);
        //        setColors();
        //        array.recycle();
    }

    @Override
    public void setVisibility(int visibility) {
        if (rxLoginLast != null) {
            rxLoginLast.setVisibility(visibility);
        }
        if (visibility != VISIBLE) {
            stopVerticalLoopAnimation();
        }
        super.setVisibility(visibility);
    }

    private ValueAnimator animator;

    public void startVerticalLoopAnimation() {
        if (null != rxLoginLast) {
            float distanceUp = -6f;
            long duration = 400;
            stopVerticalLoopAnimation();
            rxLoginLast.setVisibility(VISIBLE);
            // 创建一个从 0 到 1 的 ValueAnimator
            animator = ValueAnimator.ofFloat(0, 1);
            animator.setDuration(duration * 2); // 每次完整循环持续时间为 duration * 2
            animator.setInterpolator(new LinearInterpolator());
            animator.setRepeatCount(ValueAnimator.INFINITE); // 无限循环

            animator.addUpdateListener(animation -> {
                float animatedValue = (float) animation.getAnimatedValue();
                float translationY;

                if (animatedValue <= 0.5f) {
                    // 第一半程：向上移动
                    translationY = oriY + animatedValue * 2 * distanceUp;
                } else {
                    // 第二半程：向下移动
                    translationY = oriY + (1 - (animatedValue - 0.5f) * 2) * distanceUp;
                }
                rxLoginLast.setTranslationY(translationY);
            });
            animator.start();
        }
    }

    // 新增方法：停止动画
    public void stopVerticalLoopAnimation() {
        if (animator != null && animator.isRunning()) {
            animator.cancel();  // 停止动画
        }
        // 重置位置
        if (rxLoginLast != null) {
            rxLoginLast.setTranslationY(oriY);  // 恢复到初始位置
            rxLoginLast.setVisibility(GONE);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) { //构建圆形
        //        int width = getMeasuredWidth();
        //        Paint mPaint = new Paint();
        //        mPaint.setARGB(alpha, colors[0], colors[1], colors[2]);
        //        mPaint.setAntiAlias(true);
        //        float cirX = width / 2;
        //        float cirY = width / 2;
        //        float radius = width / 2;
        //        canvas.drawCircle(cirX, cirY, radius, mPaint);
        super.onDraw(canvas);
    }

    public void setName(String name) {
        textView.setText(name);
    }

    public static int dp2px(Context context, float dipValue) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (dipValue * scale + 0.5f);
        } catch (Exception e) {
            return (int) dipValue;
        }
    }

    public static int px2dp(Context context, float px) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (px / scale + 0.5f);
        } catch (Exception e) {
            return (int) px;
        }
    }

    public void setColor(int color) {
        textView.setTextColor(color);
        rootLayout.setBackground(getGradientDrawable(color));
        invalidate();
    }

    @NonNull
    private GradientDrawable getGradientDrawable(int color) {
        GradientDrawable gd = new GradientDrawable();
        gd.setCornerRadius(dp2px(this.getContext(), 12));
        gd.setStroke(dp2px(this.getContext(), 1), color);
        return gd;
    }

    public void setIconImage(int resId) {
        if (resId != 0) {
            imageView.setBackgroundResource(resId);
            invalidate();
        }
    }

}
