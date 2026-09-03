package com.ruixue.huawei.moment;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.share.ShareData;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.MD5;
import com.ruixue.utils.ThreadUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
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
class ImageUtils {

    public interface DownloadCallback {
        void onComplete(List<String> filePaths);
        void onError(String msg);
    }

    public static void downloadImages(Context context, List<ShareData.ImageBean> imageBeans, DownloadCallback callback) {
        if (imageBeans == null || imageBeans.isEmpty()) {
            if (callback != null) {
                callback.onComplete(null);
            }
            return;
        }
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Map<String, String> urlMap = new ConcurrentHashMap<>();
        for (ShareData.ImageBean imageBean : imageBeans) {
            executor.execute(() -> {
                String filename = getFileName(imageBean.getImage_url(), imageBean.getLanding_url());
                File outFile = new File(context.getCacheDir(), filename);
                if (outFile.exists()) {
                    urlMap.put(imageBean.getImage_url(), outFile.getAbsolutePath());
                    RXLogger.d("file exist, " + imageBean.getImage_url() + ", so not download.");
                } else {
                    RXLogger.d("file not exist, " + imageBean.getImage_url() + ", so download from network.");
                    String filepath = getNetBitmap(context, imageBean.getImage_url(), imageBean.getLanding_url(), imageBean.getWidth(), imageBean.getHeight(), imageBean.getX(), imageBean.getY());
                    if (filepath != null) {
                        urlMap.put(imageBean.getImage_url(), filepath);
                    } else {
                        executor.shutdown();
                        ThreadUtils.getMainLooperHandler().post(new Runnable() {
                            @Override
                            public void run() {
                                if (callback != null) {
                                    callback.onError("download url :" + imageBean.getImage_url() + " failed.");
                                }
                            }
                        });
                        return;
                    }
                }

                if (urlMap.size() == imageBeans.size()) {
                    executor.shutdown();
                    List<String> filePaths = new ArrayList<>();
                    for (ShareData.ImageBean imageBean1 : imageBeans) {
                        filePaths.add(urlMap.get(imageBean1.getImage_url()));
                    }

                    ThreadUtils.getMainLooperHandler().post(new Runnable() {
                        @Override
                        public void run() {
                            if (callback != null) {
                                callback.onComplete(filePaths);
                            }
                        }
                    });
                }
            });
        }
    }

    public static String getNetBitmap(Context context, String imageUrl, String url, int width, int height, int x, int y) {
        InputStream stream = HttpClient.getInputStream(imageUrl);
        Bitmap bitmap = null;
        String filepath = null;
        if (null != stream) {
            bitmap = BitmapFactory.decodeStream(stream);
            if (!TextUtils.isEmpty(url) && width > 0 && height > 0) {
                bitmap = BitmapHelper.addQRToBitmap(bitmap, url, width, height, x, y);
            }
        }
        try {
            if (bitmap != null) {
                String filename = getFileName(imageUrl, url);
                File outFile = new File(context.getCacheDir(), filename);
                saveBitmapToFile(bitmap, outFile);
                filepath = outFile.getAbsolutePath();
            } else {
                RXLogger.e("error download:" + imageUrl);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return filepath;
    }

    private static String getFileName(String imageUrl, String qrCodeUrl) {
        String extension = FileUtil.getFileExtensionFromUrl(imageUrl);
        String filename;
        String uniqueUrl;
        if (!TextUtils.isEmpty(qrCodeUrl)) {
            uniqueUrl = imageUrl + "_" + qrCodeUrl;
        } else {
            uniqueUrl = imageUrl;
        }
        if (TextUtils.isEmpty(extension)) {
            filename = Objects.requireNonNull(MD5.hexdigest(uniqueUrl));
        } else {
            filename = Objects.requireNonNull(MD5.hexdigest(uniqueUrl)) + "." + extension;
        }
        return filename;
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