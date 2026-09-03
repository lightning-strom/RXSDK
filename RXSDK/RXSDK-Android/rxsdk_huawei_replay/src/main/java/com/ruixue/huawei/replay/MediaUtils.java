package com.ruixue.huawei.replay;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.MD5;
import com.ruixue.utils.ThreadUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/11/15
 */
class MediaUtils {

    public interface DownloadCallback {
        void onComplete(Map<String, String> url2PathMap);
        void onError(String msg);
    }

    public static void downloadFiles(Context context, List<String> urls, DownloadCallback callback) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Map<String, String> urlMap = new ConcurrentHashMap<>();
        for (String url : urls) {
            executor.execute(() -> {
                String filename = getFileName(url);
                File outFile = new File(context.getCacheDir(), filename);
                if (outFile.exists()) {
                    urlMap.put(url, outFile.getAbsolutePath());
                    RXLogger.d("file exist, " + url + ", so not download.");
                } else {
                    RXLogger.d("file not exist, " + url + ", so download from network.");
                    InputStream stream = HttpClient.getInputStream(url);
                    File file = saveContentLocally(context, stream, url);
                    if (file == null || !file.exists()) {
                        executor.shutdown();
                        ThreadUtils.getMainLooperHandler().post(() -> {
                            if (callback != null) {
                                callback.onError("download url :" + url + " failed.");
                            }
                        });
                        return;
                    } else {
                        urlMap.put(url, file.getAbsolutePath());
                    }
                }
                if (urlMap.size() == urls.size()) {
                    executor.shutdown();
                    ThreadUtils.getMainLooperHandler().post(new Runnable() {
                        @Override
                        public void run() {
                            Iterator<Map.Entry<String, String>> iter = urlMap.entrySet().iterator();
                            HashMap<String, String> url2PathMap = new HashMap<>();
                            while (iter.hasNext()) {
                                Map.Entry<String, String> entry = iter.next();
                                url2PathMap.put(entry.getKey(), entry.getValue());
                            }
                            if (callback != null) {
                                callback.onComplete(url2PathMap);
                            }
                        }
                    });
                }
            });
        }

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

    private static String getFileName(String url) {
        String extension = FileUtil.getFileExtensionFromUrl(url);
        String filename;
        if (TextUtils.isEmpty(extension)) {
            filename = Objects.requireNonNull(MD5.hexdigest(url));
        } else {
            filename = Objects.requireNonNull(MD5.hexdigest(url)) + "." + extension;
        }
        return filename;
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
