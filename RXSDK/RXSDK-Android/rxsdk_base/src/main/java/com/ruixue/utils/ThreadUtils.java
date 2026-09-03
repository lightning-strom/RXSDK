package com.ruixue.utils;

import android.os.AsyncTask;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;

import com.ruixue.RuiXueSdk;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ThreadUtils {

    private static final String TAG = RuiXueSdk.TAG;

    //线程池 线程数量
    private static final int THREAD_COUNT = 8;

    // 定长线程池
    private final ExecutorService executorService;

    // 单线程的定时任务调度线程池,支持定时以及周期性执行任务
    private final ScheduledExecutorService scheduledExecutorService;
    private volatile ExecutorService sCachedExecutors;
//    ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(1);


    // 主线程Handler：便于和主线程进行通信，用于前台UI刷新用途
    private final Handler mainHandler;

    // 工作线程：用于后台耗时任务
    private final Handler bgHandler;
    private HandlerThread bgThread;


    private static class Companion {
        private static final ThreadUtils INSTANCE = new ThreadUtils();
    }

    public static ThreadUtils getInstance() {
        return Companion.INSTANCE;
    }

    public Handler getMainHandler() {
        return mainHandler;
    }

    public ThreadUtils() {
        // 创建一个定长线程池
        executorService = Executors.newFixedThreadPool(THREAD_COUNT);
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
        mainHandler = new Handler(Looper.getMainLooper());
        bgThread = new HandlerThread("backgroundThread");
        bgThread.start();
        bgHandler = new Handler(bgThread.getLooper());
    }

    public static String getMethodName() {
        StackTraceElement[] stacktrace = Thread.currentThread().getStackTrace();
        StackTraceElement e = stacktrace[2];
        String methodName = e.getMethodName();
        return methodName;
    }

    public static Handler getMainLooperHandler() {
        return getInstance().getMainHandler();
    }

    public ExecutorService getNewCachedExecutor() {
        if (sCachedExecutors == null) {
            try {
                sCachedExecutors = Executors.newCachedThreadPool();
            } catch (Exception var1) {
            }
        }
        return sCachedExecutors;
    }

    /*
     *   a. 继承AsyncTask类
     *   b. 为3个泛型参数指定类型；若不使用，可用java.lang.Void类型代替
     *      此处指定为：输入参数 = String类型、执行进度 = Integer类型、执行结果 = String类型
     *   c. 根据需求，在AsyncTask子类内实现核心方法
     */
    private class MyTask extends AsyncTask<String, Integer, String> {
        // 方法1：onPreExecute（）
        // 作用：执行 线程任务前的操作
        // 注：根据需求复写
        @Override
        protected void onPreExecute() {
        }

        // 方法2：doInBackground（）
        // 作用：接收输入参数、执行任务中的耗时操作、返回 线程任务执行的结果
        // 注：必须复写，从而自定义线程任务
        @Override
        protected String doInBackground(String... params) {
            // 自定义的线程任务

            // 可调用publishProgress（）显示进度, 之后将执行onProgressUpdate（）
//            publishProgress(count);
            return "";
        }

        // 方法3：onProgressUpdate（）
        // 作用：在主线程 显示线程任务执行的进度
        // 注：根据需求复写
        @Override
        protected void onProgressUpdate(Integer... progresses) {

        }

        // 方法4：onPostExecute（）
        // 作用：接收线程任务执行结果、将执行结果显示到UI组件
        // 注：必须复写，从而自定义UI操作
        @Override
        protected void onPostExecute(String result) {
            // UI操作
        }

        // 方法5：onCancelled()
        // 作用：将异步任务设置为：取消状态
        @Override
        protected void onCancelled() {

        }
    }

    /**
     * 定长线程池
     */
    public void runOnBgThreadUseExecutor(Runnable task) {
        executorService.execute(task);
    }

    /**
     * 单线程的定时任务调度线程池
     */
    public void runOnBgThreadDelayUseExecutor(Runnable task, long delayTime) {
//        Log.d(TAG, "call runOnBgThreadDelayUseExecutor");
        scheduledExecutorService.schedule(task, delayTime, TimeUnit.MILLISECONDS);
    }

    public boolean isMainThread() {
        return Looper.myLooper() == Looper.getMainLooper();
    }

    /**
     * 刷新UI
     */
    public void runOnUiThread(Runnable task) {
        if (isMainThread()) {
            task.run();
        } else {
            mainHandler.post(task);
        }
    }

    public void execute(Runnable runnable) {
        ExecutorService var1;
        if ((var1 = getNewCachedExecutor()) != null) {
            var1.execute(runnable);
        } else {
            (new Thread(runnable)).start();
        }
    }

    /**
     * 延时刷新UI
     */
    public void runOnUiThreadDelay(Runnable task, long time) {
//        Log.d(TAG, "call runOnUiThreadDelay");
        mainHandler.postDelayed(task, time);
    }

    /**
     * 工作线程：用于执行后台耗时任务
     */
    public void runOnBgThread(Runnable task) {
        bgHandler.post(task);
    }

    public void removeBgCallbacks(Runnable task) {
        if (task != null)
            bgHandler.removeCallbacks(task);
    }

    /**
     * 工作线程：用于延时执行后台耗时任务
     */
    public void runOnBgThreadDelay(Runnable task, long time) {
//        Log.d(TAG, "call runOnBgThreadDelay");
        bgHandler.postDelayed(task, time);
    }
}

