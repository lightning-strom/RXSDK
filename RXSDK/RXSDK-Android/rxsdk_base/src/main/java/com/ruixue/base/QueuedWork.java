package com.ruixue.base;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/19
 */

import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class QueuedWork {

    private static boolean isUseThreadPool = false;

    private static Handler uiHandler;

    private static final ExecutorService mLogicExecutor = Executors.newFixedThreadPool(5);

    private static final ExecutorService mNetExecutor = Executors.newFixedThreadPool(5);

    public static void setUseThreadPool(boolean isUseThreadPool) {
        QueuedWork.isUseThreadPool = isUseThreadPool;
    }

    public static void runInMain(Runnable paramRunnable) {
        if (uiHandler == null)
            uiHandler = new Handler(Looper.getMainLooper());
        uiHandler.post(paramRunnable);
    }

    public static void runInBack(Runnable paramRunnable, boolean isNetWorker) {
        if (isUseThreadPool) {
            if (isNetWorker) {
                mNetExecutor.execute(paramRunnable);
            } else {
                mLogicExecutor.execute(paramRunnable);
            }
        } else {
            (new Thread(paramRunnable)).start();
        }
    }

    public static abstract class DialogThread<T> extends AsyncTask<T> {
        Dialog dialog = null;

        public DialogThread(Context context) {
        }

        protected void onPostExecute(T param1Object) {
            super.onPostExecute(param1Object);
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
                dialog = null;
            }
        }

        protected void onPreExecute() {
            super.onPreExecute();
            if (dialog != null && !dialog.isShowing()) {
                dialog.show();
            }
        }
    }

    public static abstract class AsyncTask<Result> {
        protected Runnable thread;

        protected void onPreExecute() {
        }

        protected abstract Result doInBackground();

        protected void onPostExecute(Result param1Result) {
        }

        public final AsyncTask<Result> execute() {
            this.thread = new Runnable() {
                public void run() {
                    final Result result = AsyncTask.this.doInBackground();
                    QueuedWork.runInMain(new Runnable() {
                        public void run() {
                            AsyncTask.this.onPostExecute(result);
                        }
                    });
                }
            };
            QueuedWork.runInMain(new Runnable() {
                public void run() {
                    AsyncTask.this.onPreExecute();
                }
            });
            QueuedWork.runInBack(this.thread, false);
            return this;
        }
    }
}
