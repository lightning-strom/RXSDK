package com.ruixue.sdk.snapchat;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.MD5;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/15
 */
class ImageUtils {
    static class Execute {
        static final ExecutorService instance = Executors.newSingleThreadExecutor();
    }

    public static void getNetBitmap(Context context, String imageUrl, String url, int width, int height, int x, int y, Handler handler) {
        Execute.instance.execute(new Runnable() {
            @Override
            public void run() {
                InputStream stream = HttpClient.getInputStream(imageUrl);
                Bitmap bitmap = null;
                Message msg = Message.obtain();
                if (null != stream) {
                    bitmap = BitmapFactory.decodeStream(stream);
                    if (!TextUtils.isEmpty(url) && width > 0 && height > 0) {
                        bitmap = BitmapHelper.addQRToBitmap(bitmap, url, width, height, x, y);
                    }
                }
                try {
                    if (bitmap != null) {
                        String extension = FileUtil.getFileExtensionFromUrl(imageUrl);
                        String filename;
                        if (TextUtils.isEmpty(extension)) {
                            filename = Objects.requireNonNull(MD5.hexdigest(imageUrl));
                        } else {
                            filename = Objects.requireNonNull(MD5.hexdigest(imageUrl)) + "." + extension;
                        }
                        File outFile = new File(context.getCacheDir(), filename);
                        saveBitmapToFile(bitmap, outFile);
                        msg.obj = outFile.getAbsolutePath();
                    } else {
                        RXLogger.e("error download:" + imageUrl);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    handler.sendMessage(msg);
                }
            }
        });
    }

    public static void saveBitmapToFile(Bitmap bitmap, File file) {
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(file);
            // 使用JPEG格式压缩Bitmap到文件输出流
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fileOutputStream);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (fileOutputStream != null) {
                    fileOutputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}