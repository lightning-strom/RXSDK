package com.ruixue.widget;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/23
 */

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.CountDownTimer;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.TranslateAnimation;
import android.widget.RelativeLayout;

import androidx.annotation.LayoutRes;

import com.ruixue.utils.AppUtils;

public class FloatIconView extends RelativeLayout {

    private int millisInFuture = 3;//半隐藏悬浮球倒计时 秒
    private CountDownTimer countDownTimer;//倒计时 半隐藏悬浮球logo定时器

    private final static int LEFT = 0;
    private final static int RIGHT = 1;
    private final static int MARGIN_RIGHT = 60;

    private int defPosition = RIGHT; //可变参数，随着吸附左右改变
    private WindowManager.LayoutParams layoutParams;
    private WindowManager wm;
    private int screenHeight;
    private int screenWidth;
    private float mTouchStartX, mTouchStartY;
    private float x, y;
    private boolean isScroll;
    private int dpi;
    protected Context activity;
    protected View view;
    OnClickListener mOnClickListener;


    public FloatIconView(Context activity, @LayoutRes int resId) {
        super(activity);
        this.activity = activity;
        init(activity, resId);
        initTimer();
    }


    public void init(Context activity, @LayoutRes int resId) {
        view = LayoutInflater.from(activity).inflate(resId, this);
        DisplayMetrics dm = activity.getResources().getDisplayMetrics();
        int widthPixels = dm.widthPixels;
        int heightPixels = dm.heightPixels;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(activity)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + activity.getPackageName()));
            activity.startActivity(intent);
        }
        wm = (WindowManager) activity.getSystemService(Context.WINDOW_SERVICE);

        //屏宽
        screenWidth = wm.getDefaultDisplay().getWidth();
        //屏高
        screenHeight = wm.getDefaultDisplay().getHeight();
        //通过像素密度来设置按钮的大小
        dpi = dpi(dm.densityDpi);

        layoutParams = new WindowManager.LayoutParams();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && Settings.canDrawOverlays(activity)) {
            layoutParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutParams.type = WindowManager.LayoutParams.TYPE_APPLICATION;
//            layoutParams.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
        }

//        layoutParams.format = PixelFormat.RGBA_8888;//设置背景图片
        layoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        layoutParams.gravity = Gravity.LEFT | Gravity.TOP;//
        layoutParams.x = widthPixels - AppUtils.dp2px(activity, MARGIN_RIGHT); //设置位置像素
        layoutParams.y = heightPixels - AppUtils.dp2px(activity, 100);
        layoutParams.width = ViewGroup.LayoutParams.WRAP_CONTENT; //设置图片大小
        layoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;

//        view.setPivotX(100);
//        view.setPivotY(100);
//        ValueAnimator valueAnimator = ValueAnimator.ofFloat(0, 1);
//        valueAnimator.setDuration(200).start();
//        valueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
//            @Override
//            public void onAnimationUpdate(ValueAnimator animation) {
//                Float value = (Float) animation.getAnimatedValue();
//                view.setScaleX(value);
//                view.setScaleY(value);
//            }
//        });

        wm.addView(view, layoutParams);

    }

    public void dismiss() {
        wm.removeView(view);
    }

    public void setOnClickListener(OnClickListener onClickListener) {
        this.mOnClickListener = onClickListener;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        // 获取相对屏幕的坐标， 以屏幕左上角为原点
        x = event.getRawX();
        y = event.getRawY();

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                // 获取相对View的坐标，即以此View左上角为原点
                mTouchStartX = event.getX();
                mTouchStartY = event.getY();
                //无论悬浮窗是否处于隐藏状态，点击以后让悬浮窗显示出来即可
                view.setScrollX(0);
                break;
            case MotionEvent.ACTION_MOVE:
                if (isScroll) {
                    updateViewPosition();
                } else {
                    // 当前不处于连续滑动状态 则滑动小于图标1/3则不滑动
                    if (Math.abs(mTouchStartX - event.getX()) > dpi / 3 || Math.abs(mTouchStartY - event.getY()) > dpi / 3) {
                        updateViewPosition();
                    } else {
                        break;
                    }
                }
                isScroll = true;
                break;
            case MotionEvent.ACTION_UP:
                // 拖动
                if (isScroll) {
                    //自动贴边代码增加在此处
                    autoView();
                    //倒计时自动半隐藏
//                    countDownTimer.start();
                } else {
                    //点击悬浮窗
                    clickView();

                }
                isScroll = false;
                mTouchStartX = mTouchStartY = 0;
                break;
        }
        return true;
    }

    /**
     * 自动移动位置
     */
    private void autoView() {
        // 得到view在屏幕中的位置
        int[] location = new int[2];
        getLocationOnScreen(location);
        //左侧
        if (location[0] < screenWidth / 2 - getWidth() / 2) {
            updateViewPosition(LEFT);
        } else {
            updateViewPosition(RIGHT);
        }
    }

    /**
     * 更新浮动窗口位置参数
     */
    private void updateViewPosition() {
        layoutParams.x = (int) (x - mTouchStartX);
        // 不设置为全屏(状态栏存在) 标题栏是屏幕的1/25
        layoutParams.y = (int) (y - mTouchStartY - screenHeight / 25);
        wm.updateViewLayout(view, layoutParams);

    }

    /**
     * 手指释放更新悬浮窗位置
     */
    private void updateViewPosition(int l) {
        switch (l) {
            case LEFT:
                defPosition = LEFT;
                //吸附后开启倒计时,倒计时结束后缩小图标
                layoutParams.x = AppUtils.dp2px(activity, 20);

                break;
            case RIGHT:
                defPosition = RIGHT;
                int x = screenWidth - AppUtils.dp2px(activity, MARGIN_RIGHT);
                layoutParams.x = x;
                 break;
        }
        wm.updateViewLayout(view, layoutParams);
    }

    /**
     * 根据密度选择控件大小
     */
    private int dpi(int densityDpi) {

        if (densityDpi <= 120) {

            return 36;

        } else if (densityDpi <= 160) {

            return 48;

        } else if (densityDpi <= 240) {

            return 72;

        } else if (densityDpi <= 320) {

            return 96;

        }

        return 108;

    }


//    public void moveAni(int tox, int toy) {
//        /*
//        AnimationSet相当于一个动画的集合，true表示使用Animation的interpolator
//        false则是使用自己的。
//        Interpolator 被用来修饰动画效果，定义动画的变化率，可以使存在的动画效果
//        accelerated(加速)，decelerated(减速),repeated(重复),bounced(弹跳)等。
//       */
//
//        //利用AnimatorSet和ObjectAnimator实现平移动画
//        AnimatorSet animatorSet = new AnimatorSet();
//        animatorSet.playTogether(
//                ObjectAnimator.ofFloat(view, "translationX", 20, tox).setDuration(2000),
//                ObjectAnimator.ofFloat(view, "translationY", 20, toy).setDuration(2000));
//        animatorSet.start();
////
////        AnimationSet animationSet = new AnimationSet(true);
////      /*
////          Animation还有几个方法
////          setFillAfter(boolean fillAfter)
////          如果fillAfter的值为真的话，动画结束后，控件停留在执行后的状态
////          setFillBefore(boolean fillBefore)
////          如果fillBefore的值为真的话，动画结束后，控件停留在动画开始的状态
////          setStartOffset(long startOffset)
////          设置动画控件执行动画之前等待的时间
////          setRepeatCount(int repeatCount)
////          设置动画重复执行的次数
////       */
////        TranslateAnimation translateAnimation = new TranslateAnimation(
////                //X轴初始位置
////                Animation.RELATIVE_TO_SELF, 0.0f,
////                //X轴移动的结束位置
////                Animation.RELATIVE_TO_SELF, 0.5f,
////                //y轴开始位置
////                Animation.RELATIVE_TO_SELF, 0.0f,
////                //y轴移动后的结束位置
////                Animation.RELATIVE_TO_SELF, 1.5f);
////
////        //3秒完成动画
////        translateAnimation.setDuration(2000);
////        //如果fillAfter的值为真的话，动画结束后，控件停留在执行后的状态
////        animationSet.setFillAfter(true);
////        //将AlphaAnimation这个已经设置好的动画添加到 AnimationSet中
////        animationSet.addAnimation(translateAnimation);
//        //启动动画
////        MainActivity.this.image.startAnimation(animationSet);
//    }

    private void initTimer() {
        countDownTimer = new CountDownTimer(millisInFuture * 1000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                if (isScroll) {
                    timeCancel();
                }
            }

            @Override
            public void onFinish() {
                System.out.println("倒计时完成");
                if (!isScroll) {
                    if (defPosition == LEFT) {

                        view.setScrollX(view.getWidth() / 2);
                    } else {

                        view.setScrollX(-view.getWidth() / 2);
                    }
                    wm.updateViewLayout(view, layoutParams);

                } else {
                    timeCancel();
                }
            }
        };
//        countDownTimer.start();
    }

    /**
     * 取消倒计时
     */
    private void timeCancel() {
        countDownTimer.cancel();
    }

    //当悬浮按钮被点击
    public void clickView() {
        if (mOnClickListener != null) {
            mOnClickListener.onClick(this);
        }
    }
}