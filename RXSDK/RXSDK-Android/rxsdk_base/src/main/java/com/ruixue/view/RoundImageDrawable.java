package com.ruixue.view;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/4/20
 * <p>
 * 四种屏幕尺寸分类：: small, normal, large, and xlarge
 * 四种密度分类: ldpi (low), mdpi (medium), hdpi (high), and xhdpi (extra high)
 * 四种屏幕的DPI：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi
 * 四种屏幕对应density：0.75,1,1.5,2
 * 四种图片资源文件夹：drawable-ldpi,drawable-mdpi,drawable-hdpi,drawable-xhdpi
 * <p>
 * 四种屏幕尺寸分类：: small, normal, large, and xlarge
 * 四种密度分类: ldpi (low), mdpi (medium), hdpi (high), and xhdpi (extra high)
 * 四种屏幕的DPI：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi
 * 四种屏幕对应density：0.75,1,1.5,2
 * 四种图片资源文件夹：drawable-ldpi,drawable-mdpi,drawable-hdpi,drawable-xhdpi
 * <p>
 * 四种屏幕尺寸分类：: small, normal, large, and xlarge
 * 四种密度分类: ldpi (low), mdpi (medium), hdpi (high), and xhdpi (extra high)
 * 四种屏幕的DPI：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi
 * 四种屏幕对应density：0.75,1,1.5,2
 * 四种图片资源文件夹：drawable-ldpi,drawable-mdpi,drawable-hdpi,drawable-xhdpi
 * <p>
 * 四种屏幕尺寸分类：: small, normal, large, and xlarge
 * 四种密度分类: ldpi (low), mdpi (medium), hdpi (high), and xhdpi (extra high)
 * 四种屏幕的DPI：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi
 * 四种屏幕对应density：0.75,1,1.5,2
 * 四种图片资源文件夹：drawable-ldpi,drawable-mdpi,drawable-hdpi,drawable-xhdpi
 */
/**
 * 四种屏幕尺寸分类：: small, normal, large, and xlarge
 * 四种密度分类: ldpi (low), mdpi (medium), hdpi (high), and xhdpi (extra high)
 * 四种屏幕的DPI：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi
 * 四种屏幕对应density：0.75,1,1.5,2
 * 四种图片资源文件夹：drawable-ldpi,drawable-mdpi,drawable-hdpi,drawable-xhdpi
 */

import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;

/**
 * 圆角
 *
 * @Project App_View
 * @Package com.android.view.drawable
 * @author chenlin
 * @version 1.0
 * @Note TODO
 */
public class RoundImageDrawable extends Drawable {
    private Paint mPaint;
    private Bitmap mBitmap;
    private RectF mRectF;
    private int mRound;

    public RoundImageDrawable(Bitmap bitmap) {
        this.mBitmap = bitmap;
        mPaint = new Paint();
        mPaint.setAntiAlias(true);
        BitmapShader shader = new BitmapShader(mBitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        mPaint.setShader(shader);
    }

    /**
     * 初始化区域
     */
    @Override
    public void setBounds(int left, int top, int right, int bottom) {
        mRectF = new RectF(left, top, right, bottom);
        super.setBounds(left, top, right, bottom);
    }

    /**
     * 核心代码： 绘制圆角
     */
    @Override
    public void draw(Canvas canvas) {
        canvas.drawRoundRect(mRectF, mRound, mRound, mPaint);
    }

    /**
     * 暴露给外面设置圆角的大小
     *
     * @param round
     */
    public void setRound(int round) {
        this.mRound = round;
    }

    /**
     * getIntrinsicWidth、getIntrinsicHeight主要是为了在View使用wrap_content的时候，
     * 提供一下尺寸，默认为-1可不是我们希望的
     */
    @Override
    public int getIntrinsicHeight() {
        return mBitmap.getHeight();
    }

    @Override
    public int getIntrinsicWidth() {
        return mBitmap.getWidth();
    }

    /**
     * 根据画笔设定drawable的透明度
     */
    @Override
    public void setAlpha(int alpha) {
        mPaint.setAlpha(alpha);
    }

    /**
     * 根据画笔设定drawable的颜色过滤器
     */
    @Override
    public void setColorFilter(ColorFilter cf) {
        mPaint.setColorFilter(cf);
    }

    @Override
    public int getOpacity() {
        return PixelFormat.TRANSLUCENT;
    }
}
