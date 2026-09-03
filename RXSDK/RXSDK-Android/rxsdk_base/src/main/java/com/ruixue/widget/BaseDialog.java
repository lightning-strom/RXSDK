package com.ruixue.widget;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.view.ContextThemeWrapper;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import androidx.annotation.LayoutRes;
import androidx.annotation.NonNull;
import androidx.annotation.StyleRes;

import com.ruixue.RuiXueSdk;
import com.ruixue.base.R;
import com.ruixue.openapi.RXGlobalData;


import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

public class BaseDialog extends Dialog {

    @Retention(RetentionPolicy.SOURCE)
    public @interface AniStyle {
        int ScaleFade = R.style.ScaleFade; //淡入淡出缩放动画
        int Slide = R.style.Slide; //自下而上进入滑动动画
        int Default = android.R.style.Theme_Dialog;
    }

    private int height = WindowManager.LayoutParams.MATCH_PARENT;
    private ViewCreateListener listener;
    private @LayoutRes int resource;
    private @StyleRes int themeResId;

    public interface ViewCreateListener {
        void onCreateView(BaseDialog dialog, View view);
    }

    public BaseDialog setViewCreateListener(ViewCreateListener listener) {
        this.listener = listener;
        return this;
    }


    public BaseDialog(@NonNull Context context, @LayoutRes int resource, @StyleRes int themeResId) {
        super((context), themeResId);
        this.themeResId = themeResId;
        init(context, resource);
    }

    public BaseDialog(@NonNull Context context, @LayoutRes int resource, @StyleRes int themeResId, ViewCreateListener listener) {
        super((context), themeResId);
        this.themeResId = themeResId;
        this.listener = listener;
        init(context, resource);
    }

    public BaseDialog(@NonNull Context context, @LayoutRes int resource) {
        super((context), AniStyle.ScaleFade);
        this.themeResId=AniStyle.ScaleFade;
        init(context, resource);

    }

    @SuppressLint("WrongConstant")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        RXGlobalData.updateLanguage(getContext());
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        View view = LayoutInflater.from(getContext().getApplicationContext()).inflate(resource, null);
        setContentView(view);

        setDimAmount(0.5f);
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        WindowManager.LayoutParams lp = window.getAttributes();
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
//            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
//        }
//        //设置dialog在屏幕位置
        window.setGravity(Gravity.CENTER);
//        window.getDecorView().setPadding(padingLeft, padingTop, padingRight, padingBottom);
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, height);
        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        this.onCreateView(view);
    }


    @Override
    public boolean onTouchEvent(@NonNull MotionEvent event) {
        if (MotionEvent.ACTION_UP == event.getAction()) {
            hideSoftKeyBoard(getWindow());
            return true;
        }
        return super.onTouchEvent(event);
    }

    /**
     * 关闭软键盘
     * @param window
     */
    public static void hideSoftKeyBoard(final Window window) {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (null != window && window.getCurrentFocus() != null) {
                    InputMethodManager inputManager = (InputMethodManager) window.getContext().getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputManager.hideSoftInputFromWindow(window.getCurrentFocus().getWindowToken(), 0);
                }
            }
        }, 200);
    }

    /**
     * 根据传入控件的坐标和用户的焦点坐标，判断是否隐藏键盘，如果点击的位置在控件内，则不隐藏键盘
     * @param view  控件view
     * @param event 焦点位置
     * @return 是否隐藏
     */
    public static void hideKeyboard(MotionEvent event, View view, Activity activity) {
        try {
            if (view == null)
                return;
            if (view instanceof EditText) {
                int[] location = {0, 0};
                view.getLocationInWindow(location);
                int left = location[0], top = location[1], right = left + view.getWidth(), bootom = top + view.getHeight();
                // （判断是不是EditText获得焦点）判断焦点位置坐标是否在控件所在区域内，如果位置在控件区域外，则隐藏键盘
                if (event.getRawX() < left || event.getRawX() > right || event.getY() < top || event.getRawY() > bootom) {
                    // 隐藏键盘
                    IBinder token = view.getWindowToken();
                    InputMethodManager inputMethodManager = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(token, InputMethodManager.HIDE_NOT_ALWAYS);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 隐藏软键盘
     * @param view :一般为EditText
     */
    public static void hideKeyboard(View view) {
        try {
            if (view != null) {
                InputMethodManager manager = (InputMethodManager) view.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                manager.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void init(@NonNull Context context, @LayoutRes int resource) {
        this.resource = resource;
    }

    //  overrdie in subclass
    public void onCreateView(View view) {
        if (null != listener) {
            listener.onCreateView(this, view);
        }
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

    /**
     * dialog 需要全屏的时候用，和clearFocusNotAle() 成对出现
     * 在show 前调用  focusNotAle   show后调用clearFocusNotAle
     * @param window
     */
    public void focusNotAle(Window window) {
        window.setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
    }

    /**
     * dialog 需要全屏的时候用，focusNotAle() 成对出现
     * 在show 前调用  focusNotAle   show后调用clearFocusNotAle
     * @param window
     */
    public void clearFocusNotAle(Window window) {
        window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
    }

    @Override
    public void show() {
        focusNotAle(getWindow());
        super.show();
        hideNavigationBar(getWindow());
        clearFocusNotAle(getWindow());
    }

    public void setDimAmount(float amount) {
        getWindow().setDimAmount(amount);
    }

    public BaseDialog setHeight(int height) {
        this.height = height;
        return this;
    }


}