package com.ruixue.rxsdk_performance;

import android.view.Choreographer;

public class FpsMonitor {
    private long lastFrameTimeNanos = 0;
    private final Choreographer choreographer;
    private final Choreographer.FrameCallback frameCallback;
    private final int mTargetFPS = 60;
    private FPSCallBack mFPSCallBack;

    public FpsMonitor() {
        choreographer = Choreographer.getInstance();
        frameCallback = new Choreographer.FrameCallback() {
            @Override
            public void doFrame(long frameTimeNanos) {
                if (lastFrameTimeNanos == 0) {
                    lastFrameTimeNanos = frameTimeNanos;
                    choreographer.postFrameCallback(this);
                    return;
                }
                long diff = frameTimeNanos - lastFrameTimeNanos;
                double fps = 0;
                if (diff > 0) {
                    fps = 1e9 / diff;
                }
                if (mFPSCallBack != null) {
                    double jank = fps - mTargetFPS;
                    if (jank > 0) {
                        jank = 0;
                    }
                    mFPSCallBack.onValue(fps, jank);
                }
                lastFrameTimeNanos = frameTimeNanos;
//                choreographer.postFrameCallback(this);
                stop();
            }
        };
    }

    public void start(FPSCallBack fpsCallBack) {
        this.mFPSCallBack = fpsCallBack;
        lastFrameTimeNanos = 0;
        if (choreographer != null) {
            choreographer.postFrameCallback(frameCallback);
        }
    }

    public void stop() {
        if (choreographer != null) {
            choreographer.removeFrameCallback(frameCallback);
        }
    }

    public interface FPSCallBack {
        void onValue(double fps, double jank);
    }

}
