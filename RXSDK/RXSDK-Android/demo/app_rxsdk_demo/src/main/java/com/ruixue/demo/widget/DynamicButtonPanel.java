package com.ruixue.demo.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.qipai.R;
import com.ruixue.demo.config.TestButtonConfig;

import java.util.List;

/**
 * 动态按钮面板
 * <p>
 * 根据配置动态生成按钮分组和按钮，支持自动换行
 *
 * @since 2.0
 */
public class DynamicButtonPanel extends LinearLayout {

    private static final int BUTTON_WIDTH_DP = 88;
    private static final int BUTTON_HEIGHT_DP = 36;
    private static final int BUTTON_MARGIN_DP = 4;
    private static final int BUTTON_TEXT_SIZE_SP = 11;

    public DynamicButtonPanel(@NonNull Context context) {
        super(context);
        init();
    }

    public DynamicButtonPanel(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public DynamicButtonPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        setOrientation(VERTICAL);
    }

    /**
     * 设置按钮配置并生成按钮
     */
    public void setButtonGroups(List<TestButtonConfig.ButtonGroup> groups) {
        removeAllViews();

        for (TestButtonConfig.ButtonGroup group : groups) {
            if (group.buttons.isEmpty()) continue;

            // 创建分组标题
            TextView title = new TextView(getContext());
            title.setText(group.emoji + " " + group.name);
            title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
            title.setTextColor(0xFF475569);
            title.setPadding(0, dp2px(8), 0, dp2px(4));
            addView(title);

            // 创建按钮容器（自动换行的 FlowLayout 实现）
            FlowLayoutContainer flowContainer = new FlowLayoutContainer(getContext());
            flowContainer.setLayoutParams(new LayoutParams(
                    LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
            addView(flowContainer);

            // 创建按钮
            for (TestButtonConfig.ButtonItem item : group.buttons) {
                Button button = createButton(item);
                flowContainer.addView(button);
            }
        }
    }

    /**
     * 创建单个按钮
     */
    private Button createButton(TestButtonConfig.ButtonItem item) {
        Button button = new Button(getContext());
        button.setText(item.text);
        button.setTextSize(TypedValue.COMPLEX_UNIT_SP, BUTTON_TEXT_SIZE_SP);
        button.setTextColor(0xFFFFFFFF);
        button.setAllCaps(false);
        button.setGravity(Gravity.CENTER);
        button.setPadding(dp2px(6), 0, dp2px(6), 0);
        button.setStateListAnimator(null);
        button.setElevation(dp2px(1));

        // 设置背景样式
        button.setBackgroundResource(getBackgroundResource(item.style));

        // 设置点击事件
        if (item.clickListener != null) {
            button.setOnClickListener(item.clickListener);
        }

        return button;
    }

    /**
     * 获取按钮背景资源
     */
    private int getBackgroundResource(TestButtonConfig.ButtonStyle style) {
        switch (style) {
            case PRIMARY:
                return R.drawable.rx_btn_primary;  // 蓝色
            case ACCENT:
                return R.drawable.rx_btn_pay;      // 绿色
            case DANGER:
                return R.drawable.rx_btn_danger;   // 红色
            default:
                return R.drawable.rx_btn_tools;    // 灰色
        }
    }

    private int dp2px(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp,
                getResources().getDisplayMetrics()
        );
    }

    /**
     * 自动换行的容器
     */
    private class FlowLayoutContainer extends ViewGroup {

        public FlowLayoutContainer(Context context) {
            super(context);
        }

        @Override
        protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
            int widthSize = MeasureSpec.getSize(widthMeasureSpec);
            int widthMode = MeasureSpec.getMode(widthMeasureSpec);

            int width = 0;
            int height = 0;
            int lineWidth = 0;
            int lineHeight = 0;

            int buttonWidth = dp2px(BUTTON_WIDTH_DP);
            int buttonHeight = dp2px(BUTTON_HEIGHT_DP);
            int margin = dp2px(BUTTON_MARGIN_DP);

            int childCount = getChildCount();
            for (int i = 0; i < childCount; i++) {
                View child = getChildAt(i);
                child.measure(
                        MeasureSpec.makeMeasureSpec(buttonWidth, MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(buttonHeight, MeasureSpec.EXACTLY)
                );

                int childWidth = buttonWidth + margin;
                int childHeight = buttonHeight + margin;

                if (lineWidth + childWidth > widthSize) {
                    width = Math.max(width, lineWidth);
                    lineWidth = childWidth;
                    height += lineHeight;
                    lineHeight = childHeight;
                } else {
                    lineWidth += childWidth;
                    lineHeight = Math.max(lineHeight, childHeight);
                }
            }

            width = Math.max(width, lineWidth);
            height += lineHeight;

            setMeasuredDimension(
                    widthMode == MeasureSpec.EXACTLY ? widthSize : width,
                    height
            );
        }

        @Override
        protected void onLayout(boolean changed, int l, int t, int r, int b) {
            int width = r - l;
            int buttonWidth = dp2px(BUTTON_WIDTH_DP);
            int buttonHeight = dp2px(BUTTON_HEIGHT_DP);
            int margin = dp2px(BUTTON_MARGIN_DP);

            int lineX = 0;
            int lineY = 0;
            int lineHeight = buttonHeight + margin;

            int childCount = getChildCount();
            for (int i = 0; i < childCount; i++) {
                View child = getChildAt(i);
                int childWidth = buttonWidth + margin;

                if (lineX + childWidth > width) {
                    lineX = 0;
                    lineY += lineHeight;
                }

                child.layout(lineX, lineY, lineX + buttonWidth, lineY + buttonHeight);
                lineX += childWidth;
            }
        }
    }
}
