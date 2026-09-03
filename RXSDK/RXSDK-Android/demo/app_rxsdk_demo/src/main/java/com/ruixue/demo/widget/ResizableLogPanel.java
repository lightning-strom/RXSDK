package com.ruixue.demo.widget;

import android.animation.ValueAnimator;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * 可调节高度的日志面板
 * <p>
 * 功能：
 * - 吸底显示
 * - 拖拽调节高度
 * - 点击标题栏展开/收起
 * - 自动记忆高度
 *
 * @since 2.0
 */
public class ResizableLogPanel extends LinearLayout implements LogOutput {

    private static final String PREF_NAME = "log_panel_pref";
    private static final String KEY_HEIGHT = "panel_height";
    private static final int MIN_HEIGHT_DP = 48;
    private static final int DEFAULT_HEIGHT_DP = 180;
    private static final int MAX_HEIGHT_DP = 400;
    private static final int MAX_LOG_LINES = 200;

    private LinearLayout titleBar;
    private View dragHandle;
    private ScrollView scrollView;
    private TextView logTextView;
    private TextView badgeView;
    private TextView toggleIcon;

    private int minHeight;
    private int defaultHeight;
    private int maxHeight;
    private int currentHeight;
    private int collapsedHeight;
    private boolean isExpanded = true;

    private float lastTouchY;
    private int initialHeight;
    private boolean isDragging = false;

    private StringBuilder logBuffer = new StringBuilder();
    private int logLineCount = 0;
    private int unreadCount = 0;
    private SimpleDateFormat timeFormat;

    public ResizableLogPanel(Context context) {
        super(context);
        init(context);
    }

    public ResizableLogPanel(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public ResizableLogPanel(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    private void init(Context context) {
        setOrientation(VERTICAL);
        setBackgroundColor(0xFFF8FAFC);
        setElevation(dp2px(8));

        minHeight = dp2px(MIN_HEIGHT_DP);
        defaultHeight = dp2px(DEFAULT_HEIGHT_DP);
        maxHeight = dp2px(MAX_HEIGHT_DP);
        collapsedHeight = dp2px(MIN_HEIGHT_DP);
        timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.US);

        // 读取保存的高度
        currentHeight = getSavedHeight();

        createViews(context);

        // 设置初始高度
        post(() -> {
            getLayoutParams().height = currentHeight;
            requestLayout();
        });
    }

    private void createViews(Context context) {
        // 拖拽手柄
        dragHandle = createDragHandle(context);
        addView(dragHandle);

        // 标题栏
        titleBar = createTitleBar(context);
        addView(titleBar);

        // 日志内容区域
        scrollView = new ScrollView(context);
        scrollView.setFillViewport(true);
        LayoutParams scrollLp = new LayoutParams(LayoutParams.MATCH_PARENT, 0, 1f);
        scrollView.setLayoutParams(scrollLp);

        logTextView = new TextView(context);
        logTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        logTextView.setTextColor(0xFF374151);
        logTextView.setLineSpacing(0, 1.3f);
        logTextView.setPadding(dp2px(12), dp2px(8), dp2px(12), dp2px(8));
        logTextView.setBackgroundColor(0xFFF1F5F9);
        logTextView.setTextIsSelectable(true);
        logTextView.setFontFeatureSettings("monospace");
        logTextView.setText("等待操作...");

        scrollView.addView(logTextView);
        addView(scrollView);
    }

    private View createDragHandle(Context context) {
        FrameLayout container = new FrameLayout(context);
        container.setBackgroundColor(0xFFE2E8F0);
        LayoutParams lp = new LayoutParams(LayoutParams.MATCH_PARENT, dp2px(12));
        container.setLayoutParams(lp);

        // 拖拽条
        View bar = new View(context);
        bar.setBackgroundColor(0xFF94A3B8);
        FrameLayout.LayoutParams barLp = new FrameLayout.LayoutParams(dp2px(40), dp2px(4));
        barLp.gravity = Gravity.CENTER;
        bar.setLayoutParams(barLp);
        container.addView(bar);

        // 拖拽事件
        container.setOnTouchListener(this::onDragTouch);

        return container;
    }

    private LinearLayout createTitleBar(Context context) {
        LinearLayout bar = new LinearLayout(context);
        bar.setOrientation(HORIZONTAL);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setBackgroundColor(0xFF3B82F6);
        bar.setPadding(dp2px(12), dp2px(6), dp2px(8), dp2px(6));
        LayoutParams lp = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        bar.setLayoutParams(lp);

        // 标题
        TextView title = new TextView(context);
        title.setText("📋 日志");
        title.setTextColor(Color.WHITE);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        LayoutParams titleLp = new LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f);
        title.setLayoutParams(titleLp);
        bar.addView(title);

        // 未读徽章
        badgeView = new TextView(context);
        badgeView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10);
        badgeView.setTextColor(Color.WHITE);
        badgeView.setBackgroundColor(0xFFEF4444);
        badgeView.setPadding(dp2px(6), dp2px(2), dp2px(6), dp2px(2));
        badgeView.setGravity(Gravity.CENTER);
        badgeView.setVisibility(GONE);
        bar.addView(badgeView);

        // 清除按钮
        TextView clearBtn = createToolButton("🗑️");
        clearBtn.setOnClickListener(v -> clearLog());
        bar.addView(clearBtn);

        // 复制按钮
        TextView copyBtn = createToolButton("📋");
        copyBtn.setOnClickListener(v -> copyLog());
        bar.addView(copyBtn);

        // 展开/收起图标
        toggleIcon = createToolButton("▼");
        bar.addView(toggleIcon);

        // 点击标题栏展开/收起
        bar.setOnClickListener(v -> toggleExpand());

        return bar;
    }

    private TextView createToolButton(String text) {
        TextView btn = new TextView(getContext());
        btn.setText(text);
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        btn.setPadding(dp2px(8), dp2px(4), dp2px(8), dp2px(4));
        btn.setClickable(true);
        return btn;
    }

    private boolean onDragTouch(View v, MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                lastTouchY = event.getRawY();
                initialHeight = getLayoutParams().height;
                isDragging = false;
                return true;

            case MotionEvent.ACTION_MOVE:
                float dy = lastTouchY - event.getRawY();
                if (Math.abs(dy) > 5) {
                    isDragging = true;
                }

                if (isDragging) {
                    int newHeight = initialHeight + (int) dy;
                    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

                    getLayoutParams().height = newHeight;
                    requestLayout();
                    currentHeight = newHeight;

                    // 确保展开状态
                    if (!isExpanded && newHeight > collapsedHeight) {
                        isExpanded = true;
                        scrollView.setVisibility(VISIBLE);
                        toggleIcon.setText("▼");
                    }
                }
                return true;

            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (isDragging) {
                    saveHeight(currentHeight);
                }
                isDragging = false;
                return true;
        }
        return false;
    }

    private void toggleExpand() {
        isExpanded = !isExpanded;

        int targetHeight = isExpanded ? currentHeight : collapsedHeight;

        ValueAnimator animator = ValueAnimator.ofInt(getLayoutParams().height, targetHeight);
        animator.setDuration(200);
        animator.addUpdateListener(animation -> {
            getLayoutParams().height = (int) animation.getAnimatedValue();
            requestLayout();
        });
        animator.start();

        scrollView.setVisibility(isExpanded ? VISIBLE : GONE);
        toggleIcon.setText(isExpanded ? "▼" : "▲");

        if (isExpanded) {
            unreadCount = 0;
            updateBadge();
            // 滚动到底部
            scrollView.post(() -> scrollView.fullScroll(View.FOCUS_DOWN));
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
        post(() -> {
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
            case "ERROR":
                return "❌";
            case "WARN":
                return "⚠️";
            case "SUCCESS":
                return "✅";
            case "DEBUG":
                return "🔍";
            default:
                return "ℹ️";
        }
    }

    private void updateBadge() {
        if (unreadCount > 0) {
            badgeView.setText(unreadCount > 99 ? "99+" : String.valueOf(unreadCount));
            badgeView.setVisibility(VISIBLE);
        } else {
            badgeView.setVisibility(GONE);
        }
    }

    /**
     * 清除日志
     */
    @Override
    public void clearLog() {
        logBuffer = new StringBuilder();
        logLineCount = 0;
        logTextView.setText("日志已清除");
        unreadCount = 0;
        updateBadge();
    }

    /**
     * 复制日志
     */
    @Override
    public void copyLog() {
        ClipboardManager clipboard = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("RXSDK Log", logBuffer.toString());
        clipboard.setPrimaryClip(clip);
        Toast.makeText(getContext(), "日志已复制", Toast.LENGTH_SHORT).show();
    }

    private int getSavedHeight() {
        SharedPreferences prefs = getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return prefs.getInt(KEY_HEIGHT, defaultHeight);
    }

    private void saveHeight(int height) {
        getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
                .edit()
                .putInt(KEY_HEIGHT, height)
                .apply();
    }

    private int dp2px(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp,
                getResources().getDisplayMetrics()
        );
    }
}
