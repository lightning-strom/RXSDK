package com.ruixue.base;

import android.graphics.Rect;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

public class AndroidBugFix {

    public static void rocFix(View view) {
        new AndroidBugFix(view);
    }

    private final View mChildOfContent;
    private int usableHeightPrevious;
    private final FrameLayout.LayoutParams frameLayoutParams;

    private AndroidBugFix(View view) {
//        FrameLayout content = (FrameLayout) activity.findViewById(android.R.id.content);
//        mChildOfContent = content.getChildAt(0);
        mChildOfContent = view;
        mChildOfContent.getViewTreeObserver().addOnGlobalLayoutListener(this::possiblyResizeChildOfContent);
        frameLayoutParams = (FrameLayout.LayoutParams) mChildOfContent.getLayoutParams();
    }

    private void possiblyResizeChildOfContent() {
        int usableHeightNow = computeUsableHeight();
        int rootViewHeight = mChildOfContent.getRootView().getHeight();
        int heightDifference = rootViewHeight - usableHeightNow;

        Log.d("AndroidBugFix", "usableHeightNow = " + usableHeightNow
                + " rootView height = " + rootViewHeight
                + " heightDifference = " + heightDifference
                + " params.height = " + frameLayoutParams.height);

        if (usableHeightNow != usableHeightPrevious) {
            if (Math.abs(heightDifference) > (rootViewHeight / 4)) {
                // 键盘弹出：缩小高度
                frameLayoutParams.height = usableHeightNow;
            } else {
                // 键盘隐藏：恢复原始高度
                frameLayoutParams.height = rootViewHeight;
            }

            mChildOfContent.requestLayout();
            usableHeightPrevious = usableHeightNow;

            Log.d("AndroidBugFix", "after fix → frameLayoutParams.height = " + frameLayoutParams.height);
        }

    }

    private int computeUsableHeight() {
        Rect r = new Rect();
        mChildOfContent.getWindowVisibleDisplayFrame(r);
        return (r.bottom - r.top);
    }

}