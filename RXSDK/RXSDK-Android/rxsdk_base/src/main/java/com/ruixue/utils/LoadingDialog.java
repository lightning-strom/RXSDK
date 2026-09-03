package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.animation.AnimationSet;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.StyleRes;

import com.ruixue.base.R;


public class LoadingDialog extends Dialog {

    @SuppressLint("StaticFieldLeak")
    private static LoadingDialog instance;

    public static LoadingDialog getInstance(Context context) {
        if (instance == null) {
            instance = create(context);
        }
        return instance;
    }

    public static LoadingDialog showLoading(Context context) {
        LoadingDialog ld = getInstance(context);
        ld.show();
        return ld;
    }

    /**
     * 隐藏虚拟栏 ，显示的时候再隐藏掉
     */
    public void hideNavigationBar(Window window) {
        window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        window.getDecorView().setOnSystemUiVisibilityChangeListener(visibility -> {
            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            window.getDecorView().setSystemUiVisibility(uiOptions);
        });
    }

    public static void dismissLoading() {
        if (LoadingDialog.instance != null) {
            LoadingDialog.instance.dismiss();
        }
        LoadingDialog.instance = null;
    }

    private final Handler mTimerHandler = new Handler(Looper.getMainLooper());

    private LoadingDialog(@NonNull Context context, @StyleRes int themeResId) {
        super(context, themeResId);
    }


    private ImageView mAnimationView;
    private AnimationSet animationSet;
    private RotateAnimation rotateAnimation;

    LoadingDialog(Context context) {
        super(context);
        setCancelable(false);
        setCanceledOnTouchOutside(false);

        //        LayoutInflater inflater = LayoutInflater.from(context);
        //        View v = inflater.inflate(R.layout.ruixue_loading_dialog_layout, null);// 得到加载view
        //        LinearLayout layout = v.findViewById(R.id.dialog_loading_view);// 加载布局
        ////        TextView tipTextView = (TextView) v.findViewById(R.id.tipTextView);// 提示文字
        ////        tipTextView.setText(msg);// 设置加载信息
        //        mAnimationView = v.findViewById(R.id.ruixue_iv_loading);
        //        Animation mAnimation = AnimationUtils.loadAnimation(context, R.anim.rotaterepeat);
        //        mAnimationView.startAnimation(mAnimation);
        //
        //        Dialog loadingDialog = new Dialog(context, R.style.LoadingDialog);// 创建自定义样式dialog
        //        loadingDialog.setCancelable(true); // 是否可以按“返回键”消失
        //        loadingDialog.setCanceledOnTouchOutside(false); // 点击加载框以外的区域
        //        loadingDialog.setContentView(layout, new LinearLayout.LayoutParams(
        //                LinearLayout.LayoutParams.MATCH_PARENT,
        //                LinearLayout.LayoutParams.MATCH_PARENT));// 设置布局
        //        /**
        //         *将显示Dialog的方法封装在这里面
        //         */
        //        Window window = loadingDialog.getWindow();
        //        WindowManager.LayoutParams lp = window.getAttributes();
        //        lp.width = WindowManager.LayoutParams.MATCH_PARENT;
        //        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        //        window.setGravity(Gravity.CENTER);
        //        window.setAttributes(lp);
        //        window.setWindowAnimations(R.style.AlphaFade);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
//        getWindow().requestFeature(Window.FEATURE_NO_TITLE);
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        setDimAmount(0.1f);
        this.setContentView(R.layout.rx_loading_dialog);
        mAnimationView = findViewById(R.id.rx_iv_loading);
        hideNavigationBar(getWindow());
        //加载动画
        initAnimation();
    }

    public void setDimAmount(float amount) {
        getWindow().setDimAmount(amount);
    }

    @Override
    protected void onStart() {
        super.onStart();
        mAnimationView.post(() -> mAnimationView.startAnimation(animationSet));
    }

    @Override
    protected void onStop() {
        super.onStop();
        stopAnimation();
    }

    //加载动画
    private void initAnimation() {
        animationSet = new AnimationSet(true);
        rotateAnimation = new RotateAnimation(0, +359, RotateAnimation.RELATIVE_TO_SELF, 0.5f, RotateAnimation.RELATIVE_TO_SELF, 0.5f);
        //第一个参数fromDegrees为动画起始时的旋转角度 //第二个参数toDegrees为动画旋转到的角度
        //第三个参数pivotXType为动画在X轴相对于物件位置类型 //第四个参数pivotXValue为动画相对于物件的X坐标的开始位置
        //第五个参数pivotXType为动画在Y轴相对于物件位置类型 //第六个参数pivotYValue为动画相对于物件的Y坐标的开始位置
        rotateAnimation.setRepeatCount(-1);
        rotateAnimation.setStartOffset(0);
        rotateAnimation.setDuration(1000);
        LinearInterpolator lir = new LinearInterpolator();
        animationSet.setInterpolator(lir);
        animationSet.addAnimation(rotateAnimation);
    }

    private void stopAnimation() {
        if (mAnimationView != null) {
            mAnimationView.clearAnimation();
        }
    }

    public LoadingDialog setDuration(long durationMillis) {
        if (rotateAnimation != null && durationMillis > 0) {
            rotateAnimation.setDuration(durationMillis);
        }
        return this;
    }


    public static LoadingDialog create(Context context) {
        return new LoadingDialog(context);
    }

    public static LoadingDialog createLoadingDialog(Context context, String msg) {
        LoadingDialog ld = LoadingDialog.create(context);
        ld.closeDelay(15000);
        ld.show();
        return ld;
    }

    /**
     * 关闭dialog
     * @param dialog dialog
     */
    public static void closeDialog(Dialog dialog) {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    public LoadingDialog setLoadingText(String text) {
        return this;
    }

    @Override
    public void dismiss() {
        try {
            mTimerHandler.removeCallbacksAndMessages(null);
            super.dismiss();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public LoadingDialog close() {
        dismiss();
        return this;
    }

    public LoadingDialog closeDelay(long delayMillis) {
        mTimerHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                dismiss();
            }
        }, delayMillis);
        return this;
    }

    public LoadingDialog showDelay(long delayMillis) {
        mTimerHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    show();
                } catch (Exception ignore) {
                }
            }
        }, delayMillis);
        return this;
    }


}

