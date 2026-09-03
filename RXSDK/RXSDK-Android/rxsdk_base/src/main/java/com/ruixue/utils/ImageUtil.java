package com.ruixue.utils;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
//noinspection ExifInterface
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.view.TouchDelegate;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.ruixue.logger.RXLogger;
import com.ruixue.share.media.ImageObject;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Objects;

public class ImageUtil {


    public static void expandTouchArea(final View view, final int extraPadding) {
        final View parent = (View) view.getParent();
        parent.post(() -> {
            Rect rect = new Rect();
            view.getHitRect(rect);  // 获取 view 的初始点击区域
            rect.top -= extraPadding;    // 向上扩展
            rect.bottom += extraPadding; // 向下扩展
            rect.left -= extraPadding;   // 向左扩展
            rect.right += extraPadding;  // 向右扩展
            parent.setTouchDelegate(new TouchDelegate(rect, view)); // 设置 TouchDelegate
        });
    }

    /**
     * 保存图片
     * @param context  应用上下文
     * @param bitmap   图片 bitmap
     * @param fileName 图片名字
     * @return 相册图片的uri string
     */
    public static String saveBitmapToFile(Context context, String fileName, Bitmap bitmap) throws IOException {
        int permission = ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permission != PackageManager.PERMISSION_GRANTED) {
//            if (context instanceof Activity) {
//                ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 0);
//            }
//            RXLogger.e("saveBitmap java.lang.SecurityException: Permission Denial: writing com.android.providers.media.MediaProvider");
            return saveToExternalCacheDir(context, fileName, bitmap);
        } else {
            return saveToGallery(context, fileName, bitmap);
        }
    }

    public static String saveToExternalCacheDir(Context context, String fileName, Bitmap bitmap) throws IOException {
        String path = context.getExternalCacheDir() + File.separator + fileName;
        File filePic = new File(path);
        if (!filePic.exists()) {
            if (Objects.requireNonNull(filePic.getParentFile()).mkdirs()) {
                RXLogger.i("create new parent path :" + path);
            }
            if (!filePic.createNewFile()) {
                return null;
            }
        }
        try (FileOutputStream fos = new FileOutputStream(filePic)) {
            if (!bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos)) {
                throw new IOException("Error:Write a compressed version of the bitmap to the specified " + fileName);
            }
            fos.flush();
        }
        RXLogger.i("saveToExternalCacheDir path:" + path);
        return path;
    }

    public static String saveToGallery(Context context, String fileName, Bitmap bitmap) throws IOException {
        Uri uri = null;
        ContentResolver resolver = context.getContentResolver();
        try {
            long mImageTime = System.currentTimeMillis();
            // 通过 MediaStore API 插入file （因为App没有权限不能访问公共存储空间，需要通过 MediaStore API来操作）
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
            values.put(MediaStore.MediaColumns.DATE_ADDED, mImageTime / 1000);
            values.put(MediaStore.Images.Media.DATE_MODIFIED, mImageTime / 1000);
//        values.put(MediaStore.MediaColumns.MIME_TYPE, "image/png");
//        values.put(MediaStore.MediaColumns.DATE_EXPIRES, (mImageTime + DateUtils.MINUTE_IN_MILLIS ) / 1000);
//        values.put(MediaStore.Images.Media.IS_PENDING, 1);
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//        values.put(MediaStore.Images.Media.RELATIVE_PATH, "share/" + fileName);
//        }
            uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) {
                RXLogger.e("rx error: insertUri = NULL! " + fileName);
                //插入错误
                throw new IOException("rx error:Inserts a row into a table at the given URL values: " + values);
            }
            try (OutputStream out = resolver.openOutputStream(uri)) {
                if (!bitmap.compress(Bitmap.CompressFormat.PNG, 95, out)) {
                    throw new IOException("rx error:Write a compressed version of the bitmap to the specified " + fileName);
                }
            }
            // Everything went well above, publish it!
//                values.clear();
//            values.put(MediaStoreImages.Media.IS_PENDING, 0);
//            values.putNull(MediaStore..MediaColumns.DATE_EXPIRES);
//                resolver.update(uri, values, null, null);
            return uri.toString();
        } catch (IOException e) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                resolver.delete(uri, null);
            }
            throw e;
        }
    }

    public static String saveFile(Context context, File imageFile) {
        if (!imageFile.exists()) {
            return null;
        }
        try {
            String fileName = imageFile.getName();
            FileInputStream fis = new FileInputStream(imageFile);
            Bitmap bitmap = BitmapFactory.decodeStream(fis);
            return saveBitmapToFile(context, fileName, bitmap);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 旋转图片
     * @param angle
     * @param bitmap
     * @return Bitmap
     */
    public static Bitmap rotatingImageView(int angle, Bitmap bitmap) {
        // 旋转图片 动作
        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        System.out.println("angle2=" + angle);
        // 创建新的图片
        Bitmap resizedBitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
        return resizedBitmap;
    }

    /**
     * 读取图片属性：旋转的角度
     * @param path 图片绝对路径
     * @return degree旋转的角度
     */
    public static int readPictureDegree(String path) {
        int degree = 0;
        try {
            ExifInterface exifInterface = new ExifInterface(path);
            int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    degree = 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    degree = 180;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    degree = 270;
                    break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return degree;
    }

    /**
     * 将图片的旋转角度置为0
     * @param path
     * @return void
     * @Title: setPictureDegreeZero
     * @date 2012-12-10 上午10:54:46
     */
    public static void setPictureDegreeZero(String path) {
        int degree = readPictureDegree(path);
        if (degree > 0) {
            Bitmap cbitmap = BitmapFactory.decodeFile(path);
            /** * 把图片旋转为正的方向 */
            Bitmap newbitmap = rotatingImageView(degree, cbitmap);
            bmpToFile(newbitmap, path);
            cbitmap.recycle();
            newbitmap.recycle();
        }
    }


    public static File bmpToFile(Bitmap bitmap, String outputPath) {
        File ret = null;
        BufferedOutputStream stream = null;
        try {
            ret = new File(outputPath);
            FileOutputStream fstream = new FileOutputStream(ret);
            stream = new BufferedOutputStream(fstream);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
            stream.flush();
            stream.close();
            fstream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }


    public static byte[] bmpToByteArray(@NonNull final Bitmap bmp, Bitmap.CompressFormat format, int maxByte, final boolean needRecycle) {
        int quality = 100;

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(format, quality, output);

        while (output.toByteArray().length > maxByte && quality != 10) {
            output.reset(); //清空output
            bmp.compress(format, quality, output);//这里压缩quality%，把压缩后的数据存放到output中
            quality -= 10;
        }

        if (needRecycle) {
            bmp.recycle();
        }
        return output.toByteArray();
    }

    // 会被游戏直接调用
    public static byte[] bmpToByteArray(@NonNull final Bitmap bmp, int maxByte, final boolean needRecycle) {
        return bmpToByteArray(bmp, Bitmap.CompressFormat.JPEG, maxByte, needRecycle);
    }

    /**
     * 根据Uri获取图片路径
     * @param context
     * @param uri
     * @return
     */
    public static String getFilePathByContentResolver(Context context, Uri uri) {
        if (null == uri) {
            return null;
        }
        Cursor c = context.getContentResolver().query(uri, null, null, null, null);
        String filePath = null;
        if (null == c) {
            throw new IllegalArgumentException("Query on " + uri + " returns null result.");
        }
        try {
            if ((c.getCount() != 1) || !c.moveToFirst()) {
            } else {
                filePath = c.getString(c.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA));
            }
        } finally {
            c.close();
        }
        return filePath;
    }

    public static byte[] compress(ImageObject imageObject, int compressSize) {
        if (imageObject == null)
            return new byte[1];
        if (imageObject.asBinImage() == null || available(imageObject) < compressSize)
            return imageObject.asBinImage();
        if (imageObject.compressStyle != ImageObject.CompressStyle.QUALITY)
            try {
                byte[] arrayOfByte = imageObject.asBinImage();
                if (arrayOfByte == null)
                    return new byte[1];
                if (arrayOfByte.length <= 0)
                    return imageObject.asBinImage();
                Bitmap bitmap = BitmapFactory.decodeByteArray(arrayOfByte, 0, arrayOfByte.length);
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                byteArrayOutputStream.write(arrayOfByte, 0, arrayOfByte.length);
                while ((byteArrayOutputStream.toByteArray()).length > compressSize) {
                    double d = Math.sqrt(1.0D * arrayOfByte.length / compressSize);
                    assert bitmap != null;
                    int i = (int) (bitmap.getWidth() / d);
                    int j = (int) (bitmap.getHeight() / d);
                    bitmap = Bitmap.createScaledBitmap(bitmap, i, j, true);
                    byteArrayOutputStream.reset();
                    if (bitmap != null) {
                        bitmap.compress(imageObject.compressFormat, 100, byteArrayOutputStream);
                        arrayOfByte = byteArrayOutputStream.toByteArray();
                    }
                }
                if ((byteArrayOutputStream.toByteArray()).length > compressSize)
                    return null;
                return arrayOfByte;
            } catch (Throwable throwable) {
                throwable.printStackTrace();
                return new byte[1];
            }
        return compress(imageObject.asBinImage(), compressSize, imageObject.compressFormat);
    }

    public static int available(ImageObject imageObject) {
        if (imageObject.getImageStyle() == ImageObject.FILE_IMAGE)
            return available(imageObject.asFileImage());
        return available(imageObject.asBinImage());
    }


    public static class ImageType {
        public static final int JPEG = 0;

        public static final int GIF = 1;

        public static final int PNG = 2;

        public static final int bmp = 3;

        public static final int pcx = 4;

        public static final int iff = 5;

        public static final int ras = 6;

        public static final int pbm = 7;

        public static final int pgm = 8;

        public static final int ppm = 9;

        public static final int psd = 10;

        public static final int swf = 11;

        public static final String[] ext = new String[]{"jpeg", "gif", "png", "bmp", "pcx", "iff", "ras", "pbm", "pgm", "ppm", "psd", "swf"};

        public static String getExt(byte[] paramArrayOfbyte) {
            ByteArrayInputStream byteArrayInputStream = null;
            try {
                byteArrayInputStream = new ByteArrayInputStream(paramArrayOfbyte);
                int i = byteArrayInputStream.read();
                int j = byteArrayInputStream.read();
                if (i == 71 && j == 73)
                    return ext[GIF];
                if (i == 137 && j == 80)
                    return ext[PNG];
                if (i == 255 && j == 216)
                    return ext[JPEG];
                if (i == 66 && j == 77)
                    return ext[bmp];
                if (i == 10 && j < 6)
                    return ext[pcx];
                if (i == 70 && j == 79)
                    return ext[iff];
                if (i == 89 && j == 166)
                    return ext[ras];
                if (i == 80 && j >= 49 && j <= 54) {
                    int k = j - 48;
                    if (k < 1 || k > 6)
                        return "";
                    int[] arrayOfInt = {pbm, pgm, ppm};
                    int m = arrayOfInt[(k - 1) % 3];
                    return ext[m];
                }
                if (i == 56 && j == 66)
                    return ext[psd];
                if (i == 70 && j == 87)
                    return ext[swf];
                return "";
            } catch (Exception exception) {
//                SLog.error(UmengText.IMAGE.CHECK_FORMAT_ERROR, exception);
                return "";
            } finally {
                if (byteArrayInputStream != null)
                    try {
                        byteArrayInputStream.close();
                    } catch (IOException iOException) {
//                        SLog.error(UmengText.IMAGE.CLOSE, iOException);
                    }
            }
        }
    }

    public static String getImageExt(byte[] bytes) {
        return ImageType.getExt(bytes);
    }

    private static byte[] toBytes(Bitmap bitmap, Bitmap.CompressFormat compressFormat) {
        ByteArrayOutputStream baos = null;
        if (bitmap == null || bitmap.isRecycled())
            return null;
        try {
            baos = new ByteArrayOutputStream();
            int size = bitmap.getRowBytes() * bitmap.getHeight() / 1024;
            int j = 100;
            if (size > 3072.0F)
                j = (int) (3072.0F / size * j);
            bitmap.compress(compressFormat, j, baos);
            return baos.toByteArray();
        } catch (Exception exception) {
            exception.printStackTrace();
        } finally {
            if (baos != null)
                try {
                    baos.close();
                } catch (IOException iOException) {
                }
        }
        return new byte[1];
    }


    private static Bitmap toBitmap(@NonNull Drawable drawable) {
        int w = drawable.getIntrinsicWidth();
        int h = drawable.getIntrinsicHeight();
        Bitmap.Config config = (drawable.getOpacity() != PixelFormat.OPAQUE) ? Bitmap.Config.ARGB_8888 : Bitmap.Config.RGB_565;
        Bitmap bitmap = Bitmap.createBitmap(w, h, config);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, w, h);
        drawable.draw(canvas);
        return bitmap;
    }

    public static Bitmap toBitmap(byte[] bytes) {
        if (bytes != null)
            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        return null;
    }

//    public static File getFile() throws IOException {
//        File file = new File(RuiXueSdk.getContext().getExternalCacheDir(), System.currentTimeMillis() + ".jpg");
//        if (file.exists())
//            file.delete();
//        file.createNewFile();
//        return file;
//    }

    public static File writeFile(Context context, byte[] bytes) {
        File file = new File(context.getExternalCacheDir(), System.currentTimeMillis() + ".jpg");
        writeFile(bytes, file);
        return file;
    }

    private static void writeFile(byte[] paramArrayOfByte, File paramFile) {
        BufferedOutputStream bos = null;
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(paramFile);
            bos = new BufferedOutputStream(fileOutputStream);
            bos.write(paramArrayOfByte);
        } catch (Exception exception) {
            exception.printStackTrace();
        } finally {
            if (bos != null)
                try {
                    bos.close();
                } catch (IOException ignored) {
                }
        }
    }


    /**
     * 获取 图片 bytes
     */
    public static byte[] getBytes(Context context, int resId, boolean isRaw, Bitmap.CompressFormat compressFormat) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        if (!isRaw) {
            Drawable drawable;
//            Resources resources = context.getResources();
            drawable = ContextCompat.getDrawable(context, resId); // resources.getDrawable(resId, null);
            if (drawable != null) {
                Bitmap bitmap = toBitmap(drawable);
                if (bitmap != null) {
                    bitmap.compress(compressFormat, 100, byteArrayOutputStream);
                }
            }
            return byteArrayOutputStream.toByteArray();
        }
        byte[] bytes = new byte[0];
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.RGB_565;
            InputStream inputStream = context.getResources().openRawResource(resId);
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream, null, options);
            if (bitmap != null)
                bitmap.compress(compressFormat, 100, byteArrayOutputStream);
            bytes = byteArrayOutputStream.toByteArray();
        } catch (Error error) {
            error.printStackTrace();
        }
        return bytes;
    }

    public static byte[] getBytes(File file) {
        byte[] arrayOfByte;
        FileInputStream fileInputStream = null;
        ByteArrayOutputStream baos = null;
        try {
            fileInputStream = new FileInputStream(file);
            baos = new ByteArrayOutputStream();
            byte[] arrayOfByte1 = new byte[4096];
            int i;
            while ((i = fileInputStream.read(arrayOfByte1)) != -1)
                baos.write(arrayOfByte1, 0, i);
            arrayOfByte = baos.toByteArray();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
            return new byte[1];
        } finally {
            try {
                if (fileInputStream != null)
                    fileInputStream.close();
                if (baos != null)
                    baos.close();
            } catch (IOException iOException) {
                iOException.printStackTrace();
            }
        }
        return arrayOfByte;
    }


    private static BitmapFactory.Options createOptions(byte[] bytes, int maxWidth, int maxHeight) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
        int i = (int) Math.ceil(options.outWidth / maxWidth);
        int j = (int) Math.ceil((options.outHeight / maxHeight));
        if (j > 1 && i > 1) {
            if (j > i) {
                options.inSampleSize = j;
            } else {
                options.inSampleSize = i;
            }
        } else if (j > 2) {
            options.inSampleSize = j;
        } else if (i > 2) {
            options.inSampleSize = i;
        }
        options.inJustDecodeBounds = false;
        return options;
    }

    private static byte[] compress(File file, Bitmap.CompressFormat compressFormat, int maxWidth, int maxHeight) {
        if (file == null || !file.getAbsoluteFile().exists())
            return null;
        byte[] arrayOfByte = getBytes(file);
        if (arrayOfByte != null && arrayOfByte.length > 0) {
            String str = getImageExt(arrayOfByte);
            if (ImageType.ext[1].equals(str))//gif 格式不压缩
                return arrayOfByte;
            return compress(arrayOfByte, compressFormat, maxWidth, maxHeight);
        }
        return null;
    }

    /**
     * 格式转换
     * @param bytes
     * @param compressFormat
     */
    private static byte[] compress(byte[] bytes, Bitmap.CompressFormat compressFormat, int maxWidth, int maxHeight) {
        Bitmap bitmap;
        byte[] arrayOfByte = null;
        try {
            BitmapFactory.Options options = createOptions(bytes, maxWidth, maxHeight);
            bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            if (bitmap != null) {
                bitmap.compress(compressFormat, 100, byteArrayOutputStream);
                bitmap.recycle();
                System.gc();
            }
            arrayOfByte = byteArrayOutputStream.toByteArray();
            byteArrayOutputStream.close();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return arrayOfByte;
    }

    public static byte[] compress(byte[] bytes, int compressSize, Bitmap.CompressFormat compressFormat) {
        boolean compressFinish = false;
        if (bytes != null && bytes.length >= compressSize) {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
            byte num = 1;
            double d;
            while (!compressFinish && num <= 10) {
                d = Math.pow(0.8D, num);
                int quality = (int) (100.0D * d);
                if (bitmap != null)
                    bitmap.compress(compressFormat, quality, byteArrayOutputStream);
                if (byteArrayOutputStream.size() < compressSize) {
                    compressFinish = true;
                    continue;
                }
                byteArrayOutputStream.reset();
                num++;
            }
            byte[] arrayOfByte = byteArrayOutputStream.toByteArray();
            if (bitmap != null && !bitmap.isRecycled())
                bitmap.recycle();

            return arrayOfByte;
        }
        return bytes;
    }


    public static int available(byte[] paramArrayOfbyte) {
        if (paramArrayOfbyte != null)
            return paramArrayOfbyte.length;
        return 0;
    }

    //如果是本地文件的话，用此方法就返回实际文件的大小
    public static int available(File paramFile) {
        if (paramFile != null) {
            try (FileInputStream fis = new FileInputStream(paramFile)) {
                return fis.available();
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        }
        return 0;
    }

}
