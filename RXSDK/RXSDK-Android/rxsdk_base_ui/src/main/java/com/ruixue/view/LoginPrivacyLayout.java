package com.ruixue.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.widget.RelativeLayout;


public class LoginPrivacyLayout extends RelativeLayout {


    public LoginPrivacyLayout(Context context) {
        super(context);
    }

    public LoginPrivacyLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public LoginPrivacyLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public LoginPrivacyLayout(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        return false;
    }

}
