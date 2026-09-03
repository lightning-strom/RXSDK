package com.ruixue.demo.widget;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.DisplayCutout;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.List;

/**
 * 迷你状态栏
 * <p>
 * 紧凑显示：包名 + 版本号
 * 自动适配系统状态栏高度、刘海屏、挖孔屏
 *
 * @since 2.0
 */
public class MiniStatusBar extends LinearLayout {

    private TextView txtPackage;
    private TextView txtVersion;
    private OnStatusClickListener clickListener;
    private int statusBarHeight = 0;

    public interface OnStatusClickListener {
        void onStatusClick();
    }

    public MiniStatusBar(@NonNull Context context) {
        super(context);
        init(context);
    }

    public MiniStatusBar(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    private void init(Context context) {
        setOrientation(HORIZONTAL);
        setGravity(Gravity.CENTER_VERTICAL | Gravity.END);
        setBackgroundColor(0xE6334155); // 深灰蓝半透明

        // 获取状态栏高度
        statusBarHeight = getStatusBarHeight(context);

        // 设置 padding，顶部加上状态栏高度
        setPadding(dp2px(12), statusBarHeight + dp2px(2), dp2px(12), dp2px(2));

        // 包名
        txtPackage = new TextView(context);
        txtPackage.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        txtPackage.setTextColor(0xFFD1D5DB);
        txtPackage.setSingleLine(true);
        LayoutParams pkgLp = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f);
        txtPackage.setLayoutParams(pkgLp);
        addView(txtPackage);

        // 分隔点
        TextView dot = new TextView(context);
        dot.setText(" · ");
        dot.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        dot.setTextColor(0xFF9CA3AF);
        addView(dot);

        // 版本
        txtVersion = new TextView(context);
        txtVersion.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        txtVersion.setTextColor(0xFF60A5FA); // 亮蓝色
        addView(txtVersion);

        // 点击复制
        setOnClickListener(v -> {
            if (clickListener != null) {
                clickListener.onStatusClick();
            } else {
                copyInfo();
            }
        });

        setOnLongClickListener(v -> {
            copyInfo();
            return true;
        });

        // 监听 WindowInsets 变化，处理刘海屏
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            setOnApplyWindowInsetsListener((v, insets) -> {
                handleWindowInsets(insets);
                return insets;
            });
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        // 请求 WindowInsets
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            requestApplyInsets();
        }
    }

    /**
     * 处理 WindowInsets，适配刘海屏和挖孔屏
     */
    private void handleWindowInsets(WindowInsets insets) {
        int topInset = 0;
        int leftInset = 0;
        int rightInset = 0;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            DisplayCutout cutout = insets.getDisplayCutout();
            if (cutout != null) {
                topInset = Math.max(topInset, cutout.getSafeInsetTop());
                leftInset = cutout.getSafeInsetLeft();
                rightInset = cutout.getSafeInsetRight();
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            topInset = Math.max(topInset, insets.getSystemWindowInsetTop());
        }

        // 更新 padding
        setPadding(
                dp2px(12) + leftInset,
                topInset + dp2px(2),
                dp2px(12) + rightInset,
                dp2px(2)
        );
    }

    /**
     * 获取状态栏高度
     */
    private int getStatusBarHeight(Context context) {
        int result = dp2px(24); // 默认 24dp
        int resourceId = context.getResources().getIdentifier(
                "status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = context.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    /**
     * 设置包名
     */
    public void setPackageName(String packageName) {
        txtPackage.setText(packageName);
    }

    /**
     * 设置版本
     */
    public void setVersion(String version) {
        txtVersion.setText(version);
    }

    /**
     * 设置点击监听
     */
    public void setOnStatusClickListener(OnStatusClickListener listener) {
        this.clickListener = listener;
    }

    private void copyInfo() {
        String info = txtPackage.getText() + " " + txtVersion.getText();
        ClipboardManager clipboard = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("App Info", info);
        clipboard.setPrimaryClip(clip);
        Toast.makeText(getContext(), "已复制: " + info, Toast.LENGTH_SHORT).show();
    }

    private int dp2px(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp,
                getResources().getDisplayMetrics()
        );
    }
}
