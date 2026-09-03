/*
 * Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.ruixue.utils;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaPlayer;

import androidx.annotation.Nullable;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * @desc assets 工具类
 * @auth apple_lee
 * @time 2022-04-21 10:03:37
 */
public class AssetsUtil {
    private AssetsUtil() {
        /* cannot be instantiated */
        throw new UnsupportedOperationException("cannot be instantiated");
    }


    /**
     * 加载assets目录下的网页,返回一个路径
     * webView.loadUrl("file:///android_asset/html/index.htmll");
     *
     * @param htmlFileName 带后缀 如 index.html
     * @return file路径
     */
    public static String getHtml(String htmlFileName) {
        return "file:///android_asset/html/" + htmlFileName;
    }

    /**
     * @param context  应用上下文
     * @param fileName 文件名带后缀
     * @return 文件字符串内容
     */
    public static String getString(Context context, String fileName) {
        try (InputStream is = getInputStream(context, fileName)) {
            if (is != null) {
                try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                    byte[] bytes = new byte[4 * 1024];
                    int len = 0;
                    while ((len = is.read(bytes)) != -1) {
                        bos.write(bytes, 0, len);
                    }
                    return bos.toString();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 加载assets目录下的图片资源
     *
     * @param fileName 带后缀
     */
    public static Bitmap getBitmap(Context ctx, String fileName) {
        try (InputStream is = getInputStream(ctx, fileName)) {
            return BitmapFactory.decodeStream(is);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Nullable
    private static InputStream getInputStream(Context ctx, String fileName) throws IOException {
        return ctx.getResources().getAssets().open(fileName);
    }

    /**
     * 加载assets目录下文本文件
     *
     * @param ctx
     * @param fileName 带后缀
     * @return
     */
    public static String getFile(Context ctx, String fileName) {
        String result = "";
        try {
            InputStream in = ctx.getResources().getAssets().open(fileName);
            // 获取文件的字节数
            int lenght = in.available();
            // 创建byte数组
            byte[] buffer = new byte[lenght];
            // 将文件中的数据读到byte数组中
            in.read(buffer);
            result = new String(buffer, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 加载assets目录下音乐
     *
     * @param ctx
     * @param musicFileName 带后缀
     */
    public static void openMusic(Context ctx, String musicFileName) {
        AssetFileDescriptor afd = null;
        MediaPlayer mPlayer = new MediaPlayer();
        try {
            // 打开指定音乐文件,获取assets目录下指定文件的AssetFileDescriptor对象
            afd = ctx.getResources().getAssets().openFd(musicFileName);

            mPlayer.reset();
            // 使用MediaPlayer加载指定的声音文件。
            mPlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            // 准备声音
            mPlayer.prepare();
            // 播放
            mPlayer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static void copyFromAssets(Context context, String fileType) {
        // copy files form asstes folder to files
        AssetManager assetManager = context.getAssets();
        try {
            String[] list = assetManager.list("");
            for (String item : list) {
                if (item.endsWith(fileType)) {
                    FileOutputStream fileOutputStream = new FileOutputStream(new File(context.getExternalFilesDir(null), item));
                    BufferedInputStream bufferedInputStream = new BufferedInputStream(assetManager.open(item));
                    int len;
                    byte[] buf = new byte[1024];
                    while ((len = bufferedInputStream.read(buf)) > 0) {
                        fileOutputStream.write(buf, 0, len);
                    }
                    fileOutputStream.close();
                    bufferedInputStream.close();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 从assets目录中复制整个文件夹内容
     *
     * @param context Context 使用CopyFiles类的Activity
     * @param oldPath String  基于assets原文件路径  如：/aa
     * @param newPath String  复制后路径  如：xx:/bb/cc
     */
    public static boolean copyFilesFromAssets(Context context, String oldPath, String newPath) {
        try {
            String[] fileNames = context.getAssets().list(oldPath);//获取assets目录下的所有文件及目录名
            if (fileNames.length > 0) {//如果是目录
                File file = new File(newPath);
                file.mkdirs();//如果文件夹不存在，则递归
                for (String fileName : fileNames) {
                    copyFilesFromAssets(context, oldPath + "/" + fileName, newPath + "/" + fileName);
                }
            } else {//如果是文件
                InputStream is = context.getAssets().open(oldPath);
                FileOutputStream fos = new FileOutputStream(new File(newPath));
                byte[] buffer = new byte[1024];
                int byteCount = 0;
                while ((byteCount = is.read(buffer)) != -1) {//循环从输入流读取 buffer字节
                    fos.write(buffer, 0, byteCount);//将读取的输入流写入到输出流
                }
                fos.flush();//刷新缓冲区
                fos.close();
                is.close();
            }
            return true;
        } catch (Exception e) {
            //   Auto-generated catch block
            e.printStackTrace();
            return false;
        }
    }


}