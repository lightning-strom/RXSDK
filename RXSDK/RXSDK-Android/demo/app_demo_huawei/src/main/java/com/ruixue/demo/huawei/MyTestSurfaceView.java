package com.ruixue.demo.huawei;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import androidx.annotation.NonNull;

import com.ruixue.utils.AppUtils;

// Created by wangliang on 2025/1/8
public class MyTestSurfaceView extends SurfaceView implements SurfaceHolder.Callback {

    private LoopThread thread;

    public MyTestSurfaceView(Context context) {
        super(context);
        init();
    }

    public MyTestSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public MyTestSurfaceView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        SurfaceHolder holder = getHolder();
        holder.addCallback(this);
        thread = new LoopThread(holder, getContext());
    }

    @Override
    public void surfaceCreated(@NonNull SurfaceHolder holder) {
        thread.isRunning = true;
        thread.start();
    }




    @Override
    public void surfaceChanged(@NonNull SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(@NonNull SurfaceHolder holder) {
        thread.isRunning = false;
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * 执行绘制的绘制线程
     *
     * @author Administrator
     */
    class LoopThread extends Thread {

        SurfaceHolder surfaceHolder;
        Context context;
        boolean isRunning;
        float radius = 10f;
        Paint paint;
        Paint textPaint;
        private int number = 0;

        public LoopThread(SurfaceHolder surfaceHolder, Context context) {

            this.surfaceHolder = surfaceHolder;
            this.context = context;
            isRunning = false;

            paint = new Paint();
            paint.setColor(Color.YELLOW);
            paint.setStrokeWidth(AppUtils.dp2px(context, 1));
            paint.setStyle(Paint.Style.STROKE);

            textPaint = new Paint();
            textPaint.setTextSize(50);
            textPaint.setColor(Color.RED);
        }

        @Override
        public void run() {

            Canvas c = null;

            while (isRunning) {

                try {
                    synchronized (surfaceHolder) {

                        c = surfaceHolder.lockCanvas(null);
                        doDraw(c);
                        number += 50;
                        //通过它来控制帧数执行一次绘制后休息50ms
                        Thread.sleep(50);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    try {
                        surfaceHolder.unlockCanvasAndPost(c);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

            }

        }

        public void doDraw(Canvas c) {
            if (c == null) return;

            //这个很重要，清屏操作，清楚掉上次绘制的残留图像
            c.drawColor(Color.GREEN);

            c.translate(200, 200);
            c.drawCircle(0, 0, radius++, paint);

            c.drawText(String.valueOf(number/1000), 100, 100, textPaint);

            if (radius > 200) {
                radius = 10f;
            }

        }

    }
}
