package com.ruixue.sdk.facebook;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Message;

import com.ruixue.net.HttpClient;

import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class ImageUtils {
    static  class Execute{
        static final ExecutorService instance = Executors.newSingleThreadExecutor();
    }

    public static void getNetBitmap(String urlStr, Handler handler) {
        Execute.instance.execute(new Runnable() {
            @Override
            public void run() {
                InputStream stream = HttpClient.getInputStream(urlStr);
                Bitmap bitmap = null;
                Message msg = Message.obtain();
                if (null != stream) {
                    bitmap = BitmapFactory.decodeStream(stream);
                }
                msg.obj = bitmap;
                handler.sendMessage(msg);
            }
        });
    }
}
