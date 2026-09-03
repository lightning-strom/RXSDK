package com.ruixue.socialize;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.util.AttributeSet;
import android.view.View;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
public class IndicatorView extends View {
    private int mIndicatorWidth;
    private int mIndicatorMargin;
    private int mPageCount;
    private int mSelectPosition;
    private float mLeftPosition;
    private Paint mSelectPaint;
    private Paint mNormalPaint;

    public IndicatorView(Context context) {
        super(context);
    }

    public IndicatorView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    public IndicatorView(Context context, AttributeSet attributeSet, int var3) {
        super(context, attributeSet, var3);
    }

    public IndicatorView(Context context, AttributeSet attributeSet, int var3, int var4) {
        super(context, attributeSet, var3, var4);
    }

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        this.setMeasuredDimension(this.measureWidth(widthMeasureSpec), this.measureHeight(heightMeasureSpec));
    }

    private int measureWidth(int widthMeasureSpec) {
        int var2 = MeasureSpec.getMode(widthMeasureSpec);
        int var3 = MeasureSpec.getSize(widthMeasureSpec);
        int var5 = this.getPaddingLeft() + this.getPaddingRight() + this.mIndicatorWidth * this.mPageCount * 2 + this.mIndicatorMargin * (this.mPageCount - 1);
        this.mLeftPosition = (float)(this.getMeasuredWidth() - var5) / 2.0F + (float)this.getPaddingLeft();
        int var4;
        if (var2 == MeasureSpec.EXACTLY) {
            var4 = Math.max(var5, var3);
        } else if (var2 == MeasureSpec.AT_MOST) {
            var4 = Math.min(var5, var3);
        } else {
            var4 = var5;
        }

        return var4;
    }

    private int measureHeight(int heightMeasureSpec) {
        int var2 = MeasureSpec.getMode(heightMeasureSpec);
        int var3 = MeasureSpec.getSize(heightMeasureSpec);
        int var4;
        if (var2 ==  MeasureSpec.EXACTLY) {
            var4 = var3;
        } else {
            int var5 = this.getPaddingTop() + this.getPaddingBottom() + this.mIndicatorWidth * 2;
            if (var2 == MeasureSpec.AT_MOST) {
                var4 = Math.min(var5, var3);
            } else {
                var4 = var5;
            }
        }

        return var4;
    }

    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (this.mSelectPaint != null && this.mNormalPaint != null) {
            float var2 = this.mLeftPosition;
            var2 += (float)this.mIndicatorWidth;

            for(int i = 0; i < this.mPageCount; ++i) {
                canvas.drawCircle(var2, (float)this.mIndicatorWidth, (float)this.mIndicatorWidth, i == this.mSelectPosition ? this.mSelectPaint : this.mNormalPaint);
                var2 += (float)(this.mIndicatorMargin + this.mIndicatorWidth * 2);
            }

        }
    }

    public void setSelectedPosition(int selectedPosition) {
        this.mSelectPosition = selectedPosition;
        this.invalidate();
    }

    public void setPageCount(int pageCount) {
        this.mPageCount = pageCount;
        this.invalidate();
    }

    public void setIndicator(int width, int margin) {
        this.mIndicatorMargin = this.dip2px((float)margin);
        this.mIndicatorWidth = this.dip2px((float)width);
    }

    public void setIndicatorColor(int normalColor, int selectColor) {
        this.mSelectPaint = new Paint();
        this.mSelectPaint.setStyle(Style.FILL);
        this.mSelectPaint.setAntiAlias(true);
        this.mSelectPaint.setColor(selectColor);
        this.mNormalPaint = new Paint();
        this.mNormalPaint.setStyle(Style.FILL);
        this.mNormalPaint.setAntiAlias(true);
        this.mNormalPaint.setColor(normalColor);
    }

    protected int dip2px(float dp) {
        float density = this.getContext().getResources().getDisplayMetrics().density;
        return (int)(dp * density + 0.5F);
    }
}
