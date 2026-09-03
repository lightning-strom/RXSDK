package com.ruixue.widget;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.PorterDuff.Mode;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;

public class ImageButton extends androidx.appcompat.widget.AppCompatImageButton {
    private boolean mIsSelected;
    private int mNormalColor;
    private int mPressedColor;
    private int mIconPressedColor;
    private boolean mIsPressEffect;
    private int mBgShape;
    public static int BG_SHAPE_NONE = 0;
    public static int BG_SHAPE_CIRCULAR = 1;
    public static int BG_SHAPE_ROUNDED_SQUARE = 2;
    protected Paint mNormalPaint;
    protected Paint mPressedPaint;
    private RectF mSquareRect;
    private int mAngle;//圆角弧度

    public ImageButton(Context context) {
        super(context);
        this.init();
    }

    public ImageButton(Context context, AttributeSet var2) {
        super(context, var2);
        this.init();
    }

    public ImageButton(Context context, AttributeSet var2, int var3) {
        super(context, var2, var3);
        this.init();
    }

    private void init() {
        this.setBackground((Drawable)null);
        this.setClickable(false);
        this.setScaleType(ScaleType.FIT_CENTER);
    }

    public void setBackgroundShape(int backgroundShape) {
        this.setBackgroundShape(backgroundShape, 0);
    }

    public void setBackgroundShape(int bgShape, int angle) {
        this.mBgShape = bgShape;
        if (bgShape != BG_SHAPE_ROUNDED_SQUARE) {
            this.mAngle = 0;
        } else {
            float density = this.getResources().getDisplayMetrics().density;
            this.mAngle = (int)((float)angle * density + 0.5F);
        }

    }

    public void setBackgroundColor(int backgroundColor) {
        this.setBackgroundColor(backgroundColor, 0);
    }

    public void setBackgroundColor(int normalCol, int pressCol) {
        this.mNormalColor = normalCol;
        this.mPressedColor = pressCol;
        this.setPressEffectEnable(pressCol != 0);
        if (this.mNormalColor != 0) {
            this.mNormalPaint = new Paint();
            this.mNormalPaint.setStyle(Style.FILL);
            this.mNormalPaint.setAntiAlias(true);
            this.mNormalPaint.setColor(normalCol);
        }

        if (this.mPressedColor != 0) {
            this.mPressedPaint = new Paint();
            this.mPressedPaint.setStyle(Style.FILL);
            this.mPressedPaint.setAntiAlias(true);
            this.mPressedPaint.setColor(pressCol);
        }

    }

    public void setPressedColor(int pressedColor) {
        this.setPressEffectEnable(pressedColor != 0);
        this.mIconPressedColor = pressedColor;
    }

    public void setPressEffectEnable(boolean pressEffectEnable) {
        this.mIsPressEffect = pressEffectEnable;
    }

    protected void drawableStateChanged() {
        super.drawableStateChanged();
        if (this.mIsPressEffect) {
            if (this.isPressed()) {
                if (BG_SHAPE_NONE == this.mBgShape) {
                    if (this.mIconPressedColor != 0) {
                        this.setColorFilter(this.mIconPressedColor, Mode.SRC_ATOP);
                    }
                } else {
                    this.mIsSelected = true;
                    this.invalidate();
                }
            } else if (BG_SHAPE_NONE == this.mBgShape) {
                this.clearColorFilter();
            } else {
                this.mIsSelected = false;
                this.invalidate();
            }

        }
    }

    protected void onDraw(Canvas canvas) {
        if (this.mBgShape == BG_SHAPE_NONE) {
            super.onDraw(canvas);
        } else {
            if (this.mIsSelected) {
                if (this.mIsPressEffect && this.mPressedPaint != null) {
                    if (this.mBgShape == BG_SHAPE_CIRCULAR) {
                        this.drawCircle(canvas, this.mPressedPaint);
                    } else if (this.mBgShape == BG_SHAPE_ROUNDED_SQUARE) {
                        this.drawRect(canvas, this.mPressedPaint);
                    }
                }
            } else if (this.mBgShape == BG_SHAPE_CIRCULAR) {
                this.drawCircle(canvas, this.mNormalPaint);
            } else if (this.mBgShape == BG_SHAPE_ROUNDED_SQUARE) {
                this.drawRect(canvas, this.mNormalPaint);
            }

            super.onDraw(canvas);
        }
    }

    private void drawCircle(Canvas canvas, Paint paint) {
        int var3 = this.getMeasuredWidth() / 2;
        canvas.drawCircle((float)var3, (float)var3, (float)var3, paint);
    }

    private void drawRect(Canvas canvas, Paint paint) {
        if (this.mSquareRect == null) {
            this.mSquareRect = new RectF();
            this.mSquareRect.left = 0.0F;
            this.mSquareRect.top = 0.0F;
            this.mSquareRect.right = (float)this.getMeasuredWidth();
            this.mSquareRect.bottom = (float)this.getMeasuredWidth();
        }

        canvas.drawRoundRect(this.mSquareRect, (float)this.mAngle, (float)this.mAngle, paint);
    }

    protected int dip2px(float var1) {
        float var2 = this.getContext().getResources().getDisplayMetrics().density;
        return (int)(var1 * var2 + 0.5F);
    }
}