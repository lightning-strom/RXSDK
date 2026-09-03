package com.ruixue.demo.widget;

import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * 可折叠分组工具
 * <p>
 * 自动扫描 ViewGroup 中带有 tag="collapsible" 的子 ViewGroup，
 * 将其第一个子 View 作为可点击标题，其余子 View 作为可折叠内容。
 * <p>
 * 使用方式：
 * <pre>
 * // XML 中将分组容器的 tag 设为 "collapsible"
 * &lt;LinearLayout android:tag="collapsible" ...&gt;
 *     &lt;TextView android:text="▼ 标题" /&gt;     -- 标题（自动绑定点击）
 *     &lt;FlowLayout ...&gt; ... &lt;/FlowLayout&gt;    -- 内容（点击标题切换显示/隐藏）
 * &lt;/LinearLayout&gt;
 *
 * // Activity.onCreate() 中一行调用：
 * CollapsibleHelper.bind(rootView);
 * </pre>
 */
public final class CollapsibleHelper {

    private static final String TAG_COLLAPSIBLE = "collapsible";
    private static final String TAG_COLLAPSED = "collapsed";
    private static final String ARROW_EXPANDED = "▼ ";
    private static final String ARROW_COLLAPSED = "▶ ";

    private CollapsibleHelper() {}

    /**
     * 扫描 root 下所有带 tag="collapsible" / "collapsed" 的直接或间接子 ViewGroup，
     * 自动绑定折叠行为。
     * <p>
     * tag="collapsible" → 默认展开<br>
     * tag="collapsed"  → 默认折叠
     */
    public static void bind(View root) {
        if (!(root instanceof ViewGroup)) return;
        bindRecursive((ViewGroup) root);
    }

    private static void bindRecursive(ViewGroup parent) {
        for (int i = 0; i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (!(child instanceof ViewGroup)) continue;

            Object tag = child.getTag();
            if (TAG_COLLAPSIBLE.equals(tag) || TAG_COLLAPSED.equals(tag)) {
                boolean startCollapsed = TAG_COLLAPSED.equals(tag);
                setupSection((ViewGroup) child, startCollapsed);
            } else {
                bindRecursive((ViewGroup) child);
            }
        }
    }

    private static void setupSection(ViewGroup section, boolean startCollapsed) {
        if (section.getChildCount() < 2) return;

        View header = section.getChildAt(0);
        header.setClickable(true);

        if (header instanceof TextView) {
            prependArrow((TextView) header, !startCollapsed);
        }

        if (startCollapsed) {
            setContentVisibility(section, View.GONE);
        }

        header.setOnClickListener(v -> {
            boolean anyVisible = false;
            for (int i = 1; i < section.getChildCount(); i++) {
                if (section.getChildAt(i).getVisibility() == View.VISIBLE) {
                    anyVisible = true;
                    break;
                }
            }
            int newVis = anyVisible ? View.GONE : View.VISIBLE;
            setContentVisibility(section, newVis);
            if (header instanceof TextView) {
                prependArrow((TextView) header, newVis == View.VISIBLE);
            }
        });
    }

    private static void setContentVisibility(ViewGroup section, int visibility) {
        for (int i = 1; i < section.getChildCount(); i++) {
            section.getChildAt(i).setVisibility(visibility);
        }
    }

    private static void prependArrow(TextView tv, boolean expanded) {
        String text = tv.getText().toString();
        if (text.startsWith(ARROW_EXPANDED) || text.startsWith(ARROW_COLLAPSED)) {
            text = text.substring(2);
        }
        tv.setText((expanded ? ARROW_EXPANDED : ARROW_COLLAPSED) + text);
    }
}
