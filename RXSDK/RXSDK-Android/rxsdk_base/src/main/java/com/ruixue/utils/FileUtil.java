package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.StrictMode;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.internal.RXFileProvider;
import com.ruixue.logger.RXLogger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.HashMap;


@SuppressWarnings("unused")
public class FileUtil {

    private static final String TAG = RuiXueSdk.TAG;

    /**
     * 获取文件类型
     *
     * @param filePath
     * @return
     */
    public static String getFileType(String filePath) {
        return mFileTypes.get(getFileHeader(filePath));
    }

    public static String getMimeType(String ext) {
        return mMimeTypes.get(ext);
    }


    private static final HashMap<String, String> mMimeTypes = new HashMap<String, String>();
    private static final HashMap<String, String> mFileTypes = new HashMap<String, String>();

    // judge file type by file header content
    static {
        mMimeTypes.put(".3gp", "video/3gpp");
        mMimeTypes.put(".apk", "application/vnd.android.package-archive");
        mMimeTypes.put(".asf", "video/x-ms-asf");
        mMimeTypes.put(".avi", "video/x-msvideo");
        mMimeTypes.put(".bin", "application/octet-stream");
        mMimeTypes.put(".bmp", "image/bmp");
        mMimeTypes.put(".c", "text/plain");
        mMimeTypes.put(".class", "application/octet-stream");
        mMimeTypes.put(".conf", "text/plain");
        mMimeTypes.put(".cpp", "text/plain");
        mMimeTypes.put(".doc", "application/msword");
        mMimeTypes.put(".exe", "application/octet-stream");
        mMimeTypes.put(".gif", "image/gif");
        mMimeTypes.put(".gtar", "application/x-gtar");
        mMimeTypes.put(".gz", "application/x-gzip");
        mMimeTypes.put(".h", "text/plain");
        mMimeTypes.put(".htm", "text/html");
        mMimeTypes.put(".html", "text/html");
        mMimeTypes.put(".jar", "application/java-archive");
        mMimeTypes.put(".java", "text/plain");
        mMimeTypes.put(".jpeg", "image/jpeg");
        mMimeTypes.put(".jpg", "image/jpeg");
        mMimeTypes.put(".js", "application/x-javascript");
        mMimeTypes.put(".log", "text/plain");
        mMimeTypes.put(".m3u", "audio/x-mpegurl");
        mMimeTypes.put(".m4a", "audio/mp4a-latm");
        mMimeTypes.put(".m4b", "audio/mp4a-latm");
        mMimeTypes.put(".m4p", "audio/mp4a-latm");
        mMimeTypes.put(".m4u", "video/vnd.mpegurl");
        mMimeTypes.put(".m4v", "video/x-m4v");
        mMimeTypes.put(".mov", "video/quicktime");
        mMimeTypes.put(".mp2", "audio/x-mpeg");
        mMimeTypes.put(".mp3", "audio/x-mpeg");
        mMimeTypes.put(".mp4", "video/mp4");
        mMimeTypes.put(".mpc", "application/vnd.mpohun.certificate");
        mMimeTypes.put(".mpe", "video/mpeg");
        mMimeTypes.put(".mpeg", "video/mpeg");
        mMimeTypes.put(".mpg", "video/mpeg");
        mMimeTypes.put(".mpg4", "video/mp4");
        mMimeTypes.put(".mpga", "audio/mpeg");
        mMimeTypes.put(".msg", "application/vnd.ms-outlook");
        mMimeTypes.put(".ogg", "audio/ogg");
        mMimeTypes.put(".pdf", "application/pdf");
        mMimeTypes.put(".png", "image/png");
        mMimeTypes.put(".pps", "application/vnd.ms-powerpoint");
        mMimeTypes.put(".ppt", "application/vnd.ms-powerpoint");
        mMimeTypes.put(".prop", "text/plain");
        mMimeTypes.put(".rar", "application/x-rar-compressed");
        mMimeTypes.put(".rc", "text/plain");
        mMimeTypes.put(".rmvb", "audio/x-pn-realaudio");
        mMimeTypes.put(".rtf", "application/rtf");
        mMimeTypes.put(".sh", "text/plain");
        mMimeTypes.put(".tar", "application/x-tar");
        mMimeTypes.put(".tgz", "application/x-compressed");
        mMimeTypes.put(".txt", "text/plain");
        mMimeTypes.put(".wav", "audio/x-wav");
        mMimeTypes.put(".wma", "audio/x-ms-wma");
        mMimeTypes.put(".wmv", "audio/x-ms-wmv");
        mMimeTypes.put(".wps", "application/vnd.ms-works");
//        mMimeTypes.put(".xml", "text/xml");
        mMimeTypes.put(".xml", "text/plain");
        mMimeTypes.put(".z", "application/x-compress");
        mMimeTypes.put(".zip", "application/zip");
        mMimeTypes.put("", "*/*");


        mFileTypes.put("ffd8ffe000104a464946", "jpg"); //JPEG (jpg)
        mFileTypes.put("89504e470d0a1a0a0000", "png"); //PNG (png)
        mFileTypes.put("47494638396126026f01", "gif"); //GIF (gif)
        mFileTypes.put("49492a00227105008037", "tif"); //TIFF (tif)
        mFileTypes.put("424d228c010000000000", "bmp"); //16色位图(bmp)
        mFileTypes.put("424d8240090000000000", "bmp"); //24位位图(bmp)
        mFileTypes.put("424d8e1b030000000000", "bmp"); //256色位图(bmp)
        mFileTypes.put("41433130313500000000", "dwg"); //CAD (dwg)
        mFileTypes.put("3c21444f435459504520", "html"); //HTML (html)
        mFileTypes.put("3c21646f637479706520", "htm"); //HTM (htm)
        mFileTypes.put("48544d4c207b0d0a0942", "css"); //css
        mFileTypes.put("696b2e71623d696b2e71", "js"); //js
        mFileTypes.put("7b5c727466315c616e73", "rtf"); //Rich Text Format (rtf)
        mFileTypes.put("38425053000100000000", "psd"); //Photoshop (psd)
        mFileTypes.put("46726f6d3a203d3f6762", "eml"); //Email [Outlook Express 6] (eml)
        mFileTypes.put("d0cf11e0a1b11ae10000", "doc"); //MS Excel 注意：word、msi 和 excel的文件头一样
        mFileTypes.put("d0cf11e0a1b11ae10000", "vsd"); //Visio 绘图
        mFileTypes.put("5374616E64617264204A", "mdb"); //MS Access (mdb)
        mFileTypes.put("252150532D41646F6265", "ps");
        mFileTypes.put("255044462d312e350d0a", "pdf"); //Adobe Acrobat (pdf)
        mFileTypes.put("2e524d46000000120001", "rmvb"); //rmvb/rm相同
        mFileTypes.put("464c5601050000000900", "flv"); //flv与f4v相同
        mFileTypes.put("00000020667479706d70", "mp4");
        mFileTypes.put("49443303000000002176", "mp3");
        mFileTypes.put("000001ba210001000180", "mpg"); //
        mFileTypes.put("3026b2758e66cf11a6d9", "wmv"); //wmv与asf相同
        mFileTypes.put("52494646e27807005741", "wav"); //Wave (wav)
        mFileTypes.put("52494646d07d60074156", "avi");
        mFileTypes.put("4d546864000000060001", "mid"); //MIDI (mid)
        mFileTypes.put("504b0304140000000800", "zip");
        mFileTypes.put("526172211a0700cf9073", "rar");
        mFileTypes.put("235468697320636f6e66", "ini");
        mFileTypes.put("504b03040a0000000000", "jar");
        mFileTypes.put("4d5a9000030000000400", "exe");//可执行文件
        mFileTypes.put("3c25402070616765206c", "jsp");//jsp文件
        mFileTypes.put("4d616e69666573742d56", "mf");//MF文件
        mFileTypes.put("3c3f786d6c2076657273", "xml");//xml文件
        mFileTypes.put("494e5345525420494e54", "sql");//xml文件
        mFileTypes.put("7061636b616765207765", "java");//java文件
        mFileTypes.put("406563686f206f66660d", "bat");//bat文件
        mFileTypes.put("1f8b0800000000000000", "gz");//gz文件
        mFileTypes.put("6c6f67346a2e726f6f74", "properties");//bat文件
        mFileTypes.put("cafebabe0000002e0041", "class");//bat文件
        mFileTypes.put("49545346030000006000", "chm");//bat文件
        mFileTypes.put("04000000010000001300", "mxp");//bat文件
        mFileTypes.put("504b0304140006000800", "docx");//docx文件
        mFileTypes.put("d0cf11e0a1b11ae10000", "wps");//WPS文字wps、表格et、演示dps都是一样的
        mFileTypes.put("6431303a637265617465", "torrent");

        mFileTypes.put("6D6F6F76", "mov"); //Quicktime (mov)
        mFileTypes.put("FF575043", "wpd"); //WordPerfect (wpd)
        mFileTypes.put("CFAD12FEC5FD746F", "dbx"); //Outlook Express (dbx)
        mFileTypes.put("2142444E", "pst"); //Outlook (pst)
        mFileTypes.put("AC9EBD8F", "qdf"); //Quicken (qdf)
        mFileTypes.put("E3828596", "pwl"); //Windows Password (pwl)
        mFileTypes.put("2E7261FD", "ram"); //Real Audio (ram)
        mFileTypes.put("null", null); //null
    }

    /**
     * 获取文件头信息
     *
     * @param filePath
     * @return
     */
    public static String getFileHeader(String filePath) {
        File file = new File(filePath);
        if (!file.exists() || file.length() < 11) {
            return "null";
        }
        FileInputStream is = null;
        String value = null;
        try {
            is = new FileInputStream(file);
            byte[] b = new byte[10];
            is.read(b, 0, b.length);
            value = bytesToHexString(b);
        } catch (Exception e) {
        } finally {
            if (null != is) {
                try {
                    is.close();
                } catch (IOException e) {
                }
            }
        }
        return value;
    }

    /**
     * 将byte字节转换为十六进制字符串
     *
     * @param src
     * @return
     */
    private static String bytesToHexString(byte[] src) {
        StringBuilder builder = new StringBuilder();
        if (src == null || src.length <= 0) {
            return null;
        }
        String hv;
        for (int i = 0; i < src.length; i++) {
            hv = Integer.toHexString(src[i] & 0xFF).toUpperCase();
            if (hv.length() < 2) {
                builder.append(0);
            }
            builder.append(hv);
        }
        return builder.toString();
    }


    /**
     * 删除或增加图片、视频等媒体资源文件时 通知系统更新媒体库，重新扫描
     *
     * @param filePath 文件路径，包括后缀
     */
    public static void notifyScanMediaFile(Context context, String filePath) {
        if (context == null || TextUtils.isEmpty(filePath)) {
            RXLogger.e("notifyScanMediaFile context is null or filePath is empty.");
            return;
        }
        MediaScannerConnection.scanFile(context,
                new String[]{filePath}, null,
                new MediaScannerConnection.OnScanCompletedListener() {
                    public void onScanCompleted(String path, Uri uri) {
                        RXLogger.i("notifyScanMediaFile Scanned " + path);
                        RXLogger.i("notifyScanMediaFile -> uri=" + uri);
                    }
                });
    }

    public static Uri getFileUri(Context context, File file) {
        Uri uri;
        // 低版本直接用 Uri.fromFile
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            uri = Uri.fromFile(file);
        } else {
            //  使用 FileProvider 会在某些 app 下不支持（在使用FileProvider 方式情况下QQ不能支持图片、视频分享，微信不支持视频分享）
            uri = RXFileProvider.getUriForFile(context, file);

            ContentResolver cR = context.getContentResolver();
            if (uri != null && !TextUtils.isEmpty(uri.toString())) {
                String fileType = cR.getType(uri);
// 使用 MediaStore 的 content:// 而不是自己 FileProvider 提供的uri，不然有些app无法适配
                if (!TextUtils.isEmpty(fileType)) {
                    if (fileType.contains("video/")) {
                        uri = getVideoContentUri(context, file);
                    } else if (fileType.contains("image/")) {
                        uri = getImageContentUri(context, file);
                    } else if (fileType.contains("audio/")) {
                        uri = getAudioContentUri(context, file);
                    }
                }
            }
        }
        return uri;
    }


    /**
     * uri convert to file real path, don't support custom FileProvider
     *
     * @param context context
     * @param uri     uri
     * @return path
     */
    @SuppressLint({"Range", "ObsoleteSdkInt"})
    public static String getFileRealPath(final Context context, final Uri uri) {

        if (context == null) {
            Log.e(TAG, "getFileRealPath current activity is null.");
            return null;
        }

        if (uri == null) {
            Log.e(TAG, "getFileRealPath uri is null.");
            return null;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (DocumentsContract.isDocumentUri(context, uri)) {
                if (isExternalStorageDocument(uri)) {
                    final String docId = DocumentsContract.getDocumentId(uri);
                    final String[] split = docId.split(":");
                    final String type = split[0];

                    if ("primary".equalsIgnoreCase(type)) {
                        return Environment.getExternalStorageDirectory() + "/" + split[1];
                    }
                } else if (isDownloadsDocument(uri)) {
                    final String id = DocumentsContract.getDocumentId(uri);
                    final Uri contentUri = ContentUris.withAppendedId(
                            Uri.parse("content://downloads/public_downloads"), Long.parseLong(id));

                    return getDataColumn(context, contentUri, null, null);
                } else if (isMediaDocument(uri)) {
                    final String docId = DocumentsContract.getDocumentId(uri);
                    final String[] split = docId.split(":");
                    final String type = split[0];

                    Uri contentUri;
                    if ("image".equals(type)) {
                        contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                    } else if ("video".equals(type)) {
                        contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                    } else if ("audio".equals(type)) {
                        contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                    } else {
                        contentUri = MediaStore.Files.getContentUri("external");
                    }

                    final String selection = "_id=?";
                    final String[] selectionArgs = new String[]{split[1]};

                    return getDataColumn(context, contentUri, selection, selectionArgs);
                }
            } else if ("file".equalsIgnoreCase(uri.getScheme())) {
                return uri.getPath();
            }
        } else {
            String filePath = null;
            if ("content".equalsIgnoreCase(uri.getScheme())) {
                Cursor cursor = context.getContentResolver().query(uri,
                        new String[]{MediaStore.Files.FileColumns.DATA}, null, null, null);
                if (cursor != null) {
                    if (cursor.moveToFirst()) {
                        filePath = cursor.getString(cursor.getColumnIndex(MediaStore.Files.FileColumns.DATA));
                    }
                    cursor.close();
                }
            } else if ("file".equalsIgnoreCase(uri.getScheme())) {
                filePath = uri.getPath();
            }

            return filePath;
        }
        return null;
    }


    /**
     * forceGetFileUri
     *
     * @param shareFile shareFile
     * @return Uri
     */
    public static Uri forceGetFileUri(File shareFile) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try {
                @SuppressLint({"PrivateApi", "DiscouragedPrivateApi"})
                Method rMethod = StrictMode.class.getDeclaredMethod("disableDeathOnFileUriExposure");
                rMethod.invoke(null);
            } catch (Exception e) {
                Log.e(TAG, Log.getStackTraceString(e));
            }
        }

        return Uri.parse("file://" + shareFile.getAbsolutePath());
    }

    /**
     * getFileContentUri
     *
     * @param context context
     * @param file    file
     * @return Uri
     */
    public static Uri getFileContentUri(Context context, File file) {
        String volumeName = "external";
        String filePath = file.getAbsolutePath();
        String[] projection = new String[]{MediaStore.Files.FileColumns._ID};
        Uri uri = null;

        Cursor cursor = context.getContentResolver().query(MediaStore.Files.getContentUri(volumeName), projection,
                MediaStore.Images.Media.DATA + "=? ", new String[]{filePath}, null);
        if (cursor != null) {
            if (cursor.moveToFirst()) {
                @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.Files.FileColumns._ID));
                uri = MediaStore.Files.getContentUri(volumeName, id);
            }
            cursor.close();
        }

        return uri;
    }

    /**
     * Gets the content:// URI from the given corresponding path to a file
     *
     * @param context   context
     * @param imageFile imageFile
     * @return content Uri
     */
    public static Uri getImageContentUri(Context context, File imageFile) {
        String filePath = imageFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                new String[]{MediaStore.Images.Media._ID}, MediaStore.Images.Media.DATA + "=? ",
                new String[]{filePath}, null);
        Uri uri = null;

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
                Uri baseUri = Uri.parse("content://media/external/images/media");
                uri = Uri.withAppendedPath(baseUri, "" + id);
            }

            cursor.close();
        }

        if (uri == null) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DATA, filePath);
            uri = context.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        }

        return uri;
    }

    /**
     * Gets the content:// URI from the given corresponding path to a file
     *
     * @param context   context
     * @param videoFile videoFile
     * @return content Uri
     */
    public static Uri getVideoContentUri(Context context, File videoFile) {
        Uri uri = null;
        String filePath = videoFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                new String[]{MediaStore.Video.Media._ID}, MediaStore.Video.Media.DATA + "=? ",
                new String[]{filePath}, null);

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
                Uri baseUri = Uri.parse("content://media/external/video/media");
                uri = Uri.withAppendedPath(baseUri, "" + id);
            }

            cursor.close();
        }

        if (uri == null) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Video.Media.DATA, filePath);
            uri = context.getContentResolver().insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values);
        }

        return uri;
    }


    /**
     * Gets the content:// URI from the given corresponding path to a file
     *
     * @param context   context
     * @param audioFile audioFile
     * @return content Uri
     */
    public static Uri getAudioContentUri(Context context, File audioFile) {
        Uri uri = null;
        String filePath = audioFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                new String[]{MediaStore.Audio.Media._ID}, MediaStore.Audio.Media.DATA + "=? ",
                new String[]{filePath}, null);

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
                Uri baseUri = Uri.parse("content://media/external/audio/media");
                uri = Uri.withAppendedPath(baseUri, "" + id);
            }

            cursor.close();
        }
        if (uri == null) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Audio.Media.DATA, filePath);
            uri = context.getContentResolver().insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values);
        }

        return uri;
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is ExternalStorageProvider.
     */
    private static boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is DownloadsProvider.
     */
    private static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is MediaProvider.
     */
    private static boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    /**
     * Get the value of the data column for this Uri. This is useful for
     * MediaStore Uris, and other file-based ContentProviders.
     *
     * @param context       The context.
     * @param uri           The Uri to query.
     * @param selection     (Optional) Filter used in the query.
     * @param selectionArgs (Optional) Selection arguments used in the query.
     * @return The value of the _data column, which is typically a file path.
     */
    @SuppressLint("Range")
    private static String getDataColumn(Context context, Uri uri, String selection,
                                        String[] selectionArgs) {

        Cursor cursor = null;
        final String[] projection = {MediaStore.Files.FileColumns.DATA};

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                return cursor.getString(cursor.getColumnIndex(MediaStore.Files.FileColumns.DATA));
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
        return null;
    }

    /**
     * 给文件赋予别的应用访问权限
     *
     * @param context     上下文
     * @param file        文件
     * @param packageName 别的应用包名
     * @return Uri
     */
    public static Uri grantUri(Context context, @NonNull File file, String packageName) {
        return RXFileProvider.grantUri(context, file, packageName);
    }

    /**
     * @param pathAndName 路径名
     * @return 不带扩展名的文件名
     */
    public static String getFileName(String pathAndName) {
        int start = pathAndName.lastIndexOf("/");
        int end = pathAndName.lastIndexOf(".");
        if (start != -1 && end != -1) {
            end = end > start ? end : pathAndName.length() - 1;
            return pathAndName.substring(start + 1, end);
        } else {
            return null;
        }

    }

    /**
     * 获取 url 的后缀名，e.g xxx/yyy.jpg 则返回 jpg
     *
     * @param url
     * @return
     */
    public static String getFileExtensionFromUrl(String url) {
        // 解析 URL
        Uri uri = Uri.parse(url);

        if (uri == null) {
            return null;
        }

        // 获取路径的最后一部分（文件名）
        String path = uri.getLastPathSegment();

        if (path == null) {
            return null;
        }

        // 查找最后一个 "." 的位置
        int lastDotIndex = path.lastIndexOf(".");
        if (lastDotIndex != -1) {
            // 提取扩展名
            return path.substring(lastDotIndex + 1);
        }

        return null;
    }
}
