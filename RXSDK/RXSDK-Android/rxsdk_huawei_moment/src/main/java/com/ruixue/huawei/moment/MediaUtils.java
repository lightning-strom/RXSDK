package com.ruixue.huawei.moment;

import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
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
class MediaUtils {
    static class Execute {
        static final ExecutorService instance = Executors.newSingleThreadExecutor();
    }
    public static void getNetSource(Context context, String urlStr, Handler handler) {
        Execute.instance.execute(() -> {
            InputStream stream = HttpClient.getInputStream(urlStr);
            File file = saveContentLocally(context, stream, urlStr);

            Message msg = Message.obtain();
            msg.obj = file;
            handler.sendMessage(msg);
        });
    }

    public static File saveContentLocally(Context context, String uri) {
        try (InputStream inputStream = context.getContentResolver().openInputStream(Uri.parse(uri))) {
            return saveContentLocally(context, inputStream, uri);
        } catch (IOException e) {
            RXLogger.e("Could not open file:" + uri);
            return null;
        }
    }

    private static File saveContentLocally(Context context, InputStream inputStream, String uri) {
        if (inputStream == null) {
            RXLogger.e("File does not exist");
            return null;
        }
        try {
            String extension = FileUtil.getFileExtensionFromUrl(uri);
            String filename;
            if (TextUtils.isEmpty(extension)) {
                filename = Objects.requireNonNull(MD5.hexdigest(uri));
            } else {
                filename = Objects.requireNonNull(MD5.hexdigest(uri)) + "." + extension;
            }
            File outFile = new File(context.getCacheDir(), filename);
            copyFile(inputStream, outFile);
            return outFile;
        } catch (Exception e) {
            RXLogger.e("Failed save file locally");
            return null;
        }
    }

    private static void copyFile(InputStream inputStream, File file) throws IOException {
        byte[] buffer = new byte[1024];
        int length;

        try (FileOutputStream outputStream = new FileOutputStream(file)) {
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
        }
    }
}
