package com.ruixue.socialize;

import android.graphics.Color;
import android.text.TextUtils;

import androidx.annotation.IntDef;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
public class ShareDialogConfig {
    /**
     * viewpage
     */
    public static final int LAYOUT_VIEW_PAGER = 0;
    /**
     * 滚动方式
     */
    public static final int LAYOUT_VIEW_SCROLL = 1;

    /**
     * 上方
     */
    static final int LAYOUT_POSITION_TOP = 1;
    /**
     * 居中
     */
    public static final int LAYOUT_POSITION_CENTER = 2;
    /**
     * 下方
     */
    public static final int LAYOUT_POSITION_BOTTOM = 3;
    /**
     * 页面圆角dp
     */
    public static final int LAYOUT_CORNER_RADIUS = 14;

    public static final int BG_SHAPE_NONE = 0;
    /**
     * 圆形
     */
    public static final int BG_SHAPE_CIRCULAR = 1;
    /**
     * 圆角
     */
    public static final int BG_SHAPE_ROUNDED_SQUARE = 2;

    static final int CENTER_MENU_LEFT_PADDING = 15;
    static final int TITLE_TEXT_SIZE_IN_SP = 16;
    static final int TITLE_TOP_MARGIN = 20;
    static final int MENU_TOP_MARGIN = 20;
    static final int VIEW_PAGER_LEFT_MARGIN = 10;

    private static final int MENU_COLUMN_NUM = 4;
    private static final int MENU_COLUMN_NUM_CENTER = 3;
    private static final int MENU_COLUMN_NUM_HORIZONTAL = 6;
    private static final int MENU_COLUMN_NUM_HORIZONTAL_CENTER = 5;

    static final int MENU_ROW_MARGIN = 20;
    static final int INDICATOR_BOTTOM_MARGIN = 20;
    static final int INDICATOR_SIZE = 3;
    static final int INDICATOR_SPACE = 5;

    static final int CANCEL_BTN_HEIGHT = 50;
    static final int CANCEL_BTN_TEXT_SIZE_IN_SP = 15;

    @IntDef(value = {BG_SHAPE_NONE, BG_SHAPE_CIRCULAR, BG_SHAPE_ROUNDED_SQUARE})
    @Retention(RetentionPolicy.SOURCE)
    public @interface BackgroundShape {
    }

    @IntDef(value = {LAYOUT_POSITION_TOP, LAYOUT_POSITION_CENTER, LAYOUT_POSITION_BOTTOM})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LayoutPosition {
    }

    @IntDef(value = {LAYOUT_VIEW_PAGER, LAYOUT_VIEW_SCROLL})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LayoutStyle {

    }

    boolean mTitleVisibility;
    String mTitleText;
    int mTitleTextColor;
    boolean mCancelBtnVisibility;
    String mCancelBtnText;
    int mCancelBtnColor;
    int mCancelBtnBgColor;
    int mCancelBtnBgPressedColor;
    int mShareLayoutPosition;
    int mShareLayoutBgColor;
    int mMenuBgShape;
    int mMenuBgShapeAngle;
    int mMenuBgColor;
    int mMenuBgPressedColor;
    int mMenuTextColor;
    int mMenuIconPressedColor;
    int mTopMargin;
    /**
     * 列数
     */
    int mMenuColumnNum = MENU_COLUMN_NUM;

    int mMenuRowNum = 2;

    boolean mIndicatorVisibility;
    int mIndicatorNormalColor;
    int mIndicatorSelectedColor;


    @LayoutStyle
    int mLayoutStyle = LAYOUT_VIEW_SCROLL;

    private ShareClickListener shareClickListener;

    private Map<String, Object> shareParamsMap;
    private boolean mCanceledOnTouchOutside = true;

    public int getLayoutStyle() {
        return mLayoutStyle;
    }

    /**
     * 设置布局样式
     *
     * @param mLayoutStyle {@link LayoutStyle}
     */
    public void setLayoutStyle(@LayoutStyle int mLayoutStyle) {
        this.mLayoutStyle = mLayoutStyle;
    }

    public ShareDialogConfig() {
        this.setDefaultValue();
    }

    private void setDefaultValue() {
        int titleCol = Color.parseColor("#575A5C");
        String bgColor = "#fff8f8f8";
        String pressColor = "#22000000";
        String layoutBgClr = "#ffffffff";
        String title = "分享到";
        String cancelText = "取消分享";
        this.setShareLayoutBackgroundColor(Color.parseColor(layoutBgClr));
        this.setShareLayoutPosition(LAYOUT_POSITION_BOTTOM);
        this.setTitleText(title);
        this.setTitleTextColor(titleCol);
        byte shapeAngel = 12;
        this.setMenuItemBackgroundShape(BG_SHAPE_ROUNDED_SQUARE, shapeAngel);
        this.setMenuItemBackgroundColor(Color.parseColor(bgColor), Color.parseColor(pressColor));
        this.setMenuItemIconPressedColor(Color.parseColor(pressColor));
        this.setMenuItemTextColor(titleCol);
        this.setCancelButtonText(cancelText);
        this.setCancelButtonTextColor(titleCol);
        this.setCancelButtonBackground(Color.parseColor(bgColor), Color.parseColor(pressColor));
        this.setIndicatorColor(Color.parseColor("#C2C9CC"), Color.parseColor("#0086DC"));
    }

    public Map<String, Object> getShareParamsMap() {
        return shareParamsMap;
    }

    public void setShareParamsMap(Map<String, Object> shareParamsMap) {
        this.shareParamsMap = shareParamsMap;
    }

    public boolean isCanceledOnTouchOutside() {
        return mCanceledOnTouchOutside;
    }

    public void setCanceledOnTouchOutside(boolean cancel) {
        this.mCanceledOnTouchOutside = cancel;
    }

    /**
     * @param shareClickListener 分享按钮点击回调,此回调不为空时不再执行结果回调
     */
    void setShareClickListener(ShareClickListener shareClickListener) {
        this.shareClickListener = shareClickListener;
    }

    ShareClickListener getShareClickListener() {
        return this.shareClickListener;
    }

    public int getMenuRowNum() {
        return mMenuRowNum;
    }

    /**
     * LAYOUT_VIEW_PAGER 可配置页面按钮多行展示
     *
     * @param mMenuRowNum 按钮行数 setLayoutStyle 为 LAYOUT_VIEW_PAGER 时生效
     */
    public void setMenuRowNum(int mMenuRowNum) {
        this.mMenuRowNum = mMenuRowNum;
    }

    public ShareDialogConfig setTitleVisibility(boolean isVisible) {
        this.mTitleVisibility = isVisible;
        return this;
    }

    public ShareDialogConfig setTitleText(String titleText) {
        if (TextUtils.isEmpty(titleText)) {
            this.setTitleVisibility(false);
        } else {
            this.setTitleVisibility(true);
            this.mTitleText = titleText;
        }

        return this;
    }

    public ShareDialogConfig setTitleTextColor(int titleTextColor) {
        this.mTitleTextColor = titleTextColor;
        return this;
    }

    public ShareDialogConfig setCancelButtonVisibility(boolean cancelButtonVisibility) {
        this.mCancelBtnVisibility = cancelButtonVisibility;
        return this;
    }

    public ShareDialogConfig setCancelButtonText(String cancelButtonText) {
        if (TextUtils.isEmpty(cancelButtonText)) {
            this.setCancelButtonVisibility(false);
        } else {
            this.setCancelButtonVisibility(true);
            this.mCancelBtnText = cancelButtonText;
        }

        return this;
    }

    public ShareDialogConfig setCancelButtonTextColor(int cancelButtonTextColor) {
        this.mCancelBtnColor = cancelButtonTextColor;
        return this;
    }

    public ShareDialogConfig setCancelButtonBackground(int cancelButtonBackground) {
        this.setCancelButtonBackground(cancelButtonBackground, 0);
        return this;
    }

    /**
     * 取消按钮背景色
     *
     * @param bgColor      常态颜色
     * @param bgPressColor 按下颜色 ,默认 0
     */
    public ShareDialogConfig setCancelButtonBackground(int bgColor, int bgPressColor) {
        this.mCancelBtnBgColor = bgColor;
        this.mCancelBtnBgPressedColor = bgPressColor;
        return this;
    }

    /**
     * 设置背景色
     *
     * @param bgColor 背景色
     */
    public ShareDialogConfig setShareLayoutBackgroundColor(int bgColor) {
        this.mShareLayoutBgColor = bgColor;
        return this;
    }

    public ShareDialogConfig setShareLayoutPosition(@LayoutPosition int position) {
        if (position != LAYOUT_POSITION_BOTTOM && position != LAYOUT_POSITION_CENTER && position != LAYOUT_POSITION_TOP) {
            position = LAYOUT_POSITION_BOTTOM;
        }

        this.mShareLayoutPosition = position;
        return this;
    }

    public ShareDialogConfig setMenuItemBackgroundShape(@BackgroundShape int bgShape) {
        this.setMenuItemBackgroundShape(bgShape, this.mMenuBgShapeAngle);
        return this;
    }

    public ShareDialogConfig setMenuItemBackgroundShape(@BackgroundShape int bgShape, int shapeAngel) {
        if (bgShape != BG_SHAPE_CIRCULAR && bgShape != BG_SHAPE_ROUNDED_SQUARE) {
            bgShape = BG_SHAPE_NONE;
            shapeAngel = 0;
        }

        this.mMenuBgShape = bgShape;
        this.mMenuBgShapeAngle = shapeAngel;
        return this;
    }

    public ShareDialogConfig setMenuItemBackgroundColor(int bgColor) {
        this.setMenuItemBackgroundColor(bgColor, 0);
        return this;
    }

    public ShareDialogConfig setMenuItemBackgroundColor(int bgColor, int bgPressedColor) {
        this.mMenuBgColor = bgColor;
        this.mMenuBgPressedColor = bgPressedColor;
        return this;
    }

    public ShareDialogConfig setMenuItemTextColor(int textColor) {
        this.mMenuTextColor = textColor;
        return this;
    }

    public ShareDialogConfig setMenuItemIconPressedColor(int iconPressedColor) {
        this.mMenuIconPressedColor = iconPressedColor;
        return this;
    }

    public ShareDialogConfig setIndicatorColor(int indicatorColor) {
        this.setIndicatorColor(indicatorColor, 0);
        return this;
    }

    public ShareDialogConfig setIndicatorColor(int var1, int var2) {
        if (var1 != 0) {
            this.mIndicatorNormalColor = var1;
        }

        if (var2 != 0) {
            this.mIndicatorSelectedColor = var2;
        }

        this.setIndicatorVisibility(true);
        return this;
    }

    /**
     * 页码状态 翻页标识
     *
     * @param visibility 是否显示
     */
    public ShareDialogConfig setIndicatorVisibility(boolean visibility) {
        this.mIndicatorVisibility = visibility;
        return this;
    }


    /**
     * @return 页容量
     */
    public int getPageCapacity() {
        return this.mMenuColumnNum * mMenuRowNum;
    }



    public ShareDialogConfig setStatusBarHeight(int var1) {
        this.mTopMargin = var1;
        return this;
    }

    void setOrientation(boolean isLandscape) {
        if (isLandscape) {
            if (this.mShareLayoutPosition == LAYOUT_POSITION_BOTTOM) {
                this.mMenuColumnNum = MENU_COLUMN_NUM_HORIZONTAL;
            } else if (this.mShareLayoutPosition == LAYOUT_POSITION_CENTER) {
                this.mMenuColumnNum = MENU_COLUMN_NUM_HORIZONTAL_CENTER;
            }
        } else if (this.mShareLayoutPosition == LAYOUT_POSITION_BOTTOM) {
            this.mMenuColumnNum = MENU_COLUMN_NUM;
        } else if (this.mShareLayoutPosition == LAYOUT_POSITION_CENTER) {
            this.mMenuColumnNum = MENU_COLUMN_NUM_CENTER;
        }
    }

    int calcViewPagerHeightDp(int count) {
        byte rowHeight = 80;
        byte rowMargin = MENU_ROW_MARGIN;
        int rowNum;
        if (count <= this.mMenuColumnNum) {
            rowNum = 1;
        } else if (count <= this.mMenuColumnNum * mMenuRowNum) {
            rowNum = mMenuRowNum;
        } else {
            rowNum = mMenuRowNum;
        }
        int height = rowHeight * rowNum + rowMargin * (rowNum - 1) + INDICATOR_BOTTOM_MARGIN;
        return height;
    }
}
