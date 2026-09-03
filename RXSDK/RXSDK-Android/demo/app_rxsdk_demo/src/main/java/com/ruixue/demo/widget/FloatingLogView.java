package com.ruixue.demo.widget;

import android.animation.ValueAnimator;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.method.ScrollingMovementMethod;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * 浮动日志视图 - 类似 vConsole
 * <p>
 * 提供悬浮窗口显示实时日志，支持拖拽、展开/收起、清除、复制功能
 *
 * @since 2.0
 */
public class FloatingLogView implements LogOutput {

    private static final int MAX_LOG_LINES = 500;
    private static final int COLLAPSED_HEIGHT_DP = 48;
    private static final int EXPANDED_HEIGHT_DP = 280;
    
    private final Context context;
    private final WindowManager windowManager;
    private final Handler mainHandler;
    private final SimpleDateFormat timeFormat;
    
    private FrameLayout rootView;
    private LinearLayout collapsedView;
    private LinearLayout expandedView;
    private TextView logTextView;
    private ScrollView scrollView;
    private TextView badgeView;
    
    private WindowManager.LayoutParams layoutParams;
    private boolean isExpanded = false;
    private boolean isShowing = false;
    private int unreadCount = 0;
    private StringBuilder logBuffer = new StringBuilder();
    private int logLineCount = 0;
    
    // 拖拽相关
    private float lastTouchX, lastTouchY;
    private int initialX, initialY;
    private boolean isDragging = false;

    public FloatingLogView(@NonNull Context context) {
        this.context = context.getApplicationContext();
        this.windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.timeFormat = new SimpleDateFormat("HH:mm:ss.SSS", Locale.US);
        initViews();
    }

    private void initViews() {
        // 根视图
        rootView = new FrameLayout(context);
        
        // 收起状态视图 - 悬浮球
        collapsedView = createCollapsedView();
        
        // 展开状态视图 - 日志面板
        expandedView = createExpandedView();
        expandedView.setVisibility(View.GONE);
        
        rootView.addView(collapsedView);
        rootView.addView(expandedView);
        
        // 初始化 WindowManager 参数
        initLayoutParams();
    }

    private LinearLayout createCollapsedView() {
        LinearLayout container = new LinearLayout(context);
        container.setOrientation(LinearLayout.HORIZONTAL);
        container.setGravity(Gravity.CENTER);
        
        int size = dp2px(48);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(size, size);
        container.setLayoutParams(lp);
        
        // 背景 - 半透明圆形
        container.setBackgroundColor(0xDD2563EB); // 蓝色
        container.setPadding(dp2px(4), dp2px(4), dp2px(4), dp2px(4));
        
        // 图标文字
        TextView iconText = new TextView(context);
        iconText.setText("📋");
        iconText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
        iconText.setGravity(Gravity.CENTER);
        container.addView(iconText);
        
        // 未读数徽章
        badgeView = new TextView(context);
        badgeView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        badgeView.setTextColor(0xFFFFFFFF);
        badgeView.setBackgroundColor(0xFFEF4444); // 红色
        badgeView.setPadding(dp2px(4), dp2px(1), dp2px(4), dp2px(1));
        badgeView.setGravity(Gravity.CENTER);
        badgeView.setVisibility(View.GONE);
        container.addView(badgeView);
        
        // 点击展开
        container.setOnClickListener(v -> {
            if (!isDragging) {
                toggleExpand();
            }
        });
        
        // 拖拽支持
        container.setOnTouchListener(this::onTouch);
        
        return container;
    }

    private LinearLayout createExpandedView() {
        LinearLayout container = new LinearLayout(context);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setBackgroundColor(0xF0FFFFFF);
        
        int width = dp2px(320);
        int height = dp2px(EXPANDED_HEIGHT_DP);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(width, height);
        container.setLayoutParams(lp);
        container.setElevation(dp2px(8));
        
        // 标题栏
        LinearLayout titleBar = new LinearLayout(context);
        titleBar.setOrientation(LinearLayout.HORIZONTAL);
        titleBar.setGravity(Gravity.CENTER_VERTICAL);
        titleBar.setBackgroundColor(0xFF2563EB);
        titleBar.setPadding(dp2px(12), dp2px(8), dp2px(8), dp2px(8));
        
        TextView title = new TextView(context);
        title.setText("📋 Console");
        title.setTextColor(0xFFFFFFFF);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        LinearLayout.LayoutParams titleLp = new LinearLayout.LayoutParams(0, 
                LinearLayout.LayoutParams.WRAP_CONTENT, 1f);
        title.setLayoutParams(titleLp);
        titleBar.addView(title);
        
        // 清除按钮
        TextView clearBtn = createToolButton("🗑️");
        clearBtn.setOnClickListener(v -> clearLog());
        titleBar.addView(clearBtn);
        
        // 复制按钮
        TextView copyBtn = createToolButton("📋");
        copyBtn.setOnClickListener(v -> copyLog());
        titleBar.addView(copyBtn);
        
        // 收起按钮
        TextView closeBtn = createToolButton("✖️");
        closeBtn.setOnClickListener(v -> toggleExpand());
        titleBar.addView(closeBtn);
        
        container.addView(titleBar);
        
        // 日志内容区域
        scrollView = new ScrollView(context);
        scrollView.setFillViewport(true);
        LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f);
        scrollView.setLayoutParams(scrollLp);
        
        logTextView = new TextView(context);
        logTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        logTextView.setTextColor(0xFF1F2937);
        logTextView.setLineSpacing(0, 1.2f);
        logTextView.setPadding(dp2px(8), dp2px(8), dp2px(8), dp2px(8));
        logTextView.setBackgroundColor(0xFFF8FAFC);
        logTextView.setTextIsSelectable(true);
        
        scrollView.addView(logTextView);
        container.addView(scrollView);
        
        // 拖拽支持
        titleBar.setOnTouchListener(this::onTouch);
        
        return container;
    }

    private TextView createToolButton(String emoji) {
        TextView btn = new TextView(context);
        btn.setText(emoji);
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        btn.setPadding(dp2px(8), dp2px(4), dp2px(8), dp2px(4));
        btn.setClickable(true);
        return btn;
    }

    private void initLayoutParams() {
        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O 
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
        
        layoutParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                type,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE 
                        | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT
        );
        layoutParams.gravity = Gravity.TOP | Gravity.START;
        layoutParams.x = dp2px(16);
        layoutParams.y = dp2px(100);
    }

    private boolean onTouch(View v, MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                lastTouchX = event.getRawX();
                lastTouchY = event.getRawY();
                initialX = layoutParams.x;
                initialY = layoutParams.y;
                isDragging = false;
                return false;
                
            case MotionEvent.ACTION_MOVE:
                float dx = event.getRawX() - lastTouchX;
                float dy = event.getRawY() - lastTouchY;
                
                if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                    isDragging = true;
                }
                
                if (isDragging) {
                    layoutParams.x = initialX + (int) dx;
                    layoutParams.y = initialY + (int) dy;
                    windowManager.updateViewLayout(rootView, layoutParams);
                }
                return isDragging;
                
            case MotionEvent.ACTION_UP:
                if (isDragging) {
                    // 短暂延迟后重置拖拽状态，防止触发点击
                    mainHandler.postDelayed(() -> isDragging = false, 100);
                    return true;
                }
                return false;
        }
        return false;
    }

    private void toggleExpand() {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            collapsedView.setVisibility(View.GONE);
            expandedView.setVisibility(View.VISIBLE);
            unreadCount = 0;
            updateBadge();
            // 滚动到底部
            mainHandler.post(() -> scrollView.fullScroll(View.FOCUS_DOWN));
        } else {
            collapsedView.setVisibility(View.VISIBLE);
            expandedView.setVisibility(View.GONE);
        }
        
        windowManager.updateViewLayout(rootView, layoutParams);
    }

    /**
     * 显示浮窗
     */
    public void show() {
        if (!isShowing) {
            try {
                windowManager.addView(rootView, layoutParams);
                isShowing = true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 隐藏浮窗
     */
    public void hide() {
        if (isShowing) {
            try {
                windowManager.removeView(rootView);
                isShowing = false;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 添加日志
     */
    @Override
    public void log(String message) {
        log(LogOutput.Level.INFO, message);
    }

    /**
     * 添加日志（带级别）
     */
    @Override
    public void log(String level, String message) {
        mainHandler.post(() -> {
            String time = timeFormat.format(new Date());
            String levelIcon = getLevelIcon(level);
            String logLine = String.format(Locale.US, "[%s] %s %s\n", time, levelIcon, message);
            
            logBuffer.append(logLine);
            logLineCount++;
            
            // 限制日志行数
            if (logLineCount > MAX_LOG_LINES) {
                int firstNewline = logBuffer.indexOf("\n");
                if (firstNewline > 0) {
                    logBuffer.delete(0, firstNewline + 1);
                    logLineCount--;
                }
            }
            
            logTextView.setText(logBuffer.toString());
            
            // 更新未读数
            if (!isExpanded) {
                unreadCount++;
                updateBadge();
            } else {
                // 自动滚动到底部
                scrollView.post(() -> scrollView.fullScroll(View.FOCUS_DOWN));
            }
        });
    }

    private String getLevelIcon(String level) {
        switch (level.toUpperCase()) {
            case "ERROR": return "❌";
            case "WARN": return "⚠️";
            case "SUCCESS": return "✅";
            case "DEBUG": return "🔍";
            default: return "ℹ️";
        }
    }

    private void updateBadge() {
        if (unreadCount > 0) {
            badgeView.setText(unreadCount > 99 ? "99+" : String.valueOf(unreadCount));
            badgeView.setVisibility(View.VISIBLE);
        } else {
            badgeView.setVisibility(View.GONE);
        }
    }

    /**
     * 清除日志
     */
    @Override
    public void clearLog() {
        logBuffer = new StringBuilder();
        logLineCount = 0;
        logTextView.setText("");
        unreadCount = 0;
        updateBadge();
    }

    /**
     * 复制日志到剪贴板
     */
    @Override
    public void copyLog() {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("RXSDK Log", logBuffer.toString());
        clipboard.setPrimaryClip(clip);
        Toast.makeText(context, "日志已复制", Toast.LENGTH_SHORT).show();
    }

    /**
     * 是否正在显示
     */
    public boolean isShowing() {
        return isShowing;
    }

    private int dp2px(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp,
                context.getResources().getDisplayMetrics()
        );
    }
}
