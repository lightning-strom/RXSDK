package com.ruixue.demo.callback;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.demo.utils.Logger;
import com.ruixue.net.ToastUtils;

import java.lang.ref.WeakReference;

/**
 * Demo 结果显示实现类
 * <p>
 * 封装日志显示和 Toast 提示功能，使用弱引用避免内存泄漏
 *
 * @since 2.0
 */
public class DemoResultDisplay implements DemoCallback.ResultDisplay {

    private static final String TAG = "DemoResultDisplay";

    private final WeakReference<Activity> activityRef;
    private final int textViewId;
    private final Handler mainHandler;

    /**
     * 构造函数
     *
     * @param activity   Activity 实例
     * @param textViewId 用于显示日志的 TextView 资源 ID
     */
    public DemoResultDisplay(@NonNull Activity activity, int textViewId) {
        this.activityRef = new WeakReference<>(activity);
        this.textViewId = textViewId;
        this.mainHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public void showLog(String message) {
        Logger.i(TAG, "showLog: " + message);
        mainHandler.post(() -> {
            Activity activity = activityRef.get();
            if (activity != null && !activity.isFinishing()) {
                TextView textView = activity.findViewById(textViewId);
                if (textView != null) {
                    textView.setText(message);
                }
                ToastUtils.showLongToast(activity, message);
            }
        });
    }

    @Override
    public void showToast(String message) {
        mainHandler.post(() -> {
            Activity activity = activityRef.get();
            if (activity != null && !activity.isFinishing()) {
                ToastUtils.showToast(activity, message);
            }
        });
    }

    /**
     * 静态工厂方法
     *
     * @param activity   Activity 实例
     * @param textViewId 用于显示日志的 TextView 资源 ID
     * @return DemoResultDisplay 实例
     */
    public static DemoResultDisplay create(@NonNull Activity activity, int textViewId) {
        return new DemoResultDisplay(activity, textViewId);
    }
}
