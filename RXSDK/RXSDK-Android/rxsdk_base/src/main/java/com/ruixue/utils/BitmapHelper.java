package com.ruixue.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.PixelFormat;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.qrcode.encoder.ByteMatrix;
import com.google.zxing.qrcode.encoder.Encoder;
import com.google.zxing.qrcode.encoder.QRCode;
import com.ruixue.openapi.RXGlobalData;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;


public class BitmapHelper {

    /**
     * 添加二维码
     * @param source 源 bitmap 使用后自动 recycle
     * @param qrUrl  二维码链接
     * @param width  尺寸 大于 0
     * @param height 尺寸 大于 0
     * @param x      x 位置
     * @param y      y 位置
     * @return 带二维码的 bitmap
     */
    public static Bitmap addQRToBitmap(@NonNull Bitmap source, @NonNull String qrUrl, int width, int height, int x, int y) {
        return addQRToBitmap(source, qrUrl, width, height, x, y, 0);
    }

    public static Bitmap addQRToBitmap(@NonNull Bitmap source, @NonNull String qrUrl, int width, int height, int x, int y, int margin) {
        Bitmap qrBitmap = BitmapHelper.syncEncodeQRCode(qrUrl, width, height,margin);
        Bitmap outBitmap = BitmapHelper.combineBitmap(source, qrBitmap, x, y);
        qrBitmap.recycle();
        source.recycle();
        return outBitmap;
    }

    /**
     * 生成Bitmap
     * @param content QR内容
     * @param size    尺寸
     */
    public static Bitmap syncEncodeQRCode(String content, int size) {
        return syncEncodeQRCode(content, size, size);
    }

    public static Bitmap syncEncodeQRCode(String content, int width, int height, int margin) {
        Bitmap bitmap = null;
        if (width > 0 && height > 0) {
            bitmap = QRCodeUtil.createQRCodeBitmap(content, width, height, margin);
        }
        return bitmap;
    }

    public static Bitmap syncEncodeQRCode(String content, int width, int height) {
        return syncEncodeQRCode(content, width, height, 0);
    }


    /**
     * 图片合成
     * 两张图都拿到了 现在就是把2个Bitmap合成一张就可以了
     * @param background 背景图
     * @param foreground 前景图
     * @return
     */
    public static Bitmap combineBitmap(Bitmap background, Bitmap foreground, int x, int y) {
        if (background == null) {
            return null;
        }
        if (foreground == null) {
            return null;
        }
        int bgWidth = background.getWidth();
        int bgHeight = background.getHeight();
        Bitmap newmap = Bitmap.createBitmap(bgWidth, bgHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(newmap);
        canvas.drawBitmap(background, 0, 0, null);
        canvas.drawBitmap(foreground, x, y, null);//设置二维码所在的位置 这个可以写死
        canvas.save();
        canvas.restore();
        return newmap;
    }


    /**
     * 将bitmap转换为本地的图片
     * @param bitmap
     * @return
     */
    public static String bitmap2Path(Bitmap bitmap, String path) {
        try {
            OutputStream os = new FileOutputStream(path);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, os);
            os.flush();
            os.close();
        } catch (Exception e) {
            Log.e("TAG", "", e);
        }
        return path;
    }


    /**
     * 根据指定的高度进行缩放（source是bitmap）
     */
    public static Bitmap bitmapZoomByHeight(Bitmap srcBitmap, float newHeight) {
        float scale = newHeight / (((float) srcBitmap.getHeight()));
        return bitmapZoomByScale(srcBitmap, scale, scale);
    }

    /**
     * 根据指定的高度进行缩放（source是drawable）
     */
    public static Bitmap bitmapZoomByHeight(Drawable drawable, float newHeight) {
        Bitmap bitmap = drawableToBitmap(drawable);
        float scale = newHeight / (((float) bitmap.getHeight()));
        return bitmapZoomByScale(bitmap, scale, scale);
    }

    /**
     * 根据指定的宽度比例值和高度比例值进行缩放
     */
    public static Bitmap bitmapZoomByScale(Bitmap srcBitmap, float scaleWidth, float scaleHeight) {
        int width = srcBitmap.getWidth();
        int height = srcBitmap.getHeight();
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap bitmap = Bitmap.createBitmap(srcBitmap, 0, 0, width, height, matrix, true);
        if (bitmap != null) {
            return bitmap;
        } else {
            return srcBitmap;
        }
    }

    /**
     * 将drawable对象转成bitmap对象
     */
    public static Bitmap drawableToBitmap(Drawable drawable) {
        int width = drawable.getIntrinsicWidth();
        int height = drawable.getIntrinsicHeight();
        Bitmap.Config config = drawable.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888 : Bitmap.Config.RGB_565;
        Bitmap bitmap = Bitmap.createBitmap(width, height, config);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, width, height);
        drawable.draw(canvas);
        return bitmap;
    }

    /**
     * 将drawable对象转成bitmap对象
     */
    public static Bitmap drawableToBitmap2(Drawable drawable) {
        BitmapDrawable bd = (BitmapDrawable) drawable;
        Bitmap bm = bd.getBitmap();
        return bm;
    }

    public static void saveBitmapToSDCard(Bitmap bitmap, File file) {
        if (file.exists()) {
            file.delete();
        }
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, ((OutputStream) fileOutputStream));//设置PNG的话，透明区域不会变成黑色

            fileOutputStream.close();
            System.out.println("----------save success-------------------");
        } catch (Exception v0) {
            v0.printStackTrace();
        }
    }

    /**
     * 将bitmap对象保存成图片到sd卡中
     */
    public static void saveBitmapToSDCard(Bitmap bitmap, String path) {
        File file = new File(path);
        saveBitmapToSDCard(bitmap, file);

    }

    /**
     * 从sd卡中获取图片的bitmap对象
     */
    public static Bitmap getBitmapFromSDCard(String path) {

        Bitmap bitmap = null;
        try {
            FileInputStream fileInputStream = new FileInputStream(path);
            if (fileInputStream != null) {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = 2; //当图片资源太大的适合，会出现内存溢出。图片宽高都为原来的二分之一，即图片为原来的四分一
                bitmap = BitmapFactory.decodeStream(((InputStream) fileInputStream), null, options);
            }
        } catch (Exception e) {
            return null;
        }
        return bitmap;
    }

    public static BitMatrix encode(String contents, BarcodeFormat format, int width, int height, Map<EncodeHintType, ?> hints) throws WriterException {

        if (contents.isEmpty()) {
            throw new IllegalArgumentException("Found empty contents");
        }

        if (format != BarcodeFormat.QR_CODE) {
            throw new IllegalArgumentException("Can only encode QR_CODE, but got " + format);
        }

        if (width < 0 || height < 0) {
            throw new IllegalArgumentException("Requested dimensions are too small: " + width + 'x' + height);
        }

        ErrorCorrectionLevel errorCorrectionLevel = ErrorCorrectionLevel.L;
        int quietZone = 0;
//        int quietZone = QUIET_ZONE_SIZE;
        if (hints != null) {
            ErrorCorrectionLevel requestedECLevel = (ErrorCorrectionLevel) hints.get(EncodeHintType.ERROR_CORRECTION);
            if (requestedECLevel != null) {
                errorCorrectionLevel = requestedECLevel;
            }
            Integer quietZoneInt = (Integer) hints.get(EncodeHintType.MARGIN);
            if (quietZoneInt != null) {
                quietZone = quietZoneInt;
            }
        }

        QRCode code = Encoder.encode(contents, errorCorrectionLevel, hints);
        return renderResult(code, width, height, quietZone);
    }


    private static BitMatrix renderResult(QRCode code, int width, int height, int quietZone) {
        ByteMatrix input = code.getMatrix();
        if (input == null) {
            throw new IllegalStateException();
        }
        int inputWidth = input.getWidth();
        int inputHeight = input.getHeight();
        //以下两行源码是原始代码中控制边距的参数
        //int qrWidth = inputWidth + (quietZone << 1);
        //int qrHeight = inputHeight + (quietZone << 1);
        //以下两行源码是修改后的控制边距的参数
        int qrWidth = inputWidth + 2;
        int qrHeight = inputHeight + 2;
        int outputWidth = Math.max(width, qrWidth);
        int outputHeight = Math.max(height, qrHeight);

        int multiple = Math.min(outputWidth / qrWidth, outputHeight / qrHeight);
        // Padding includes both the quiet zone and the extra white pixels to accommodate the requested
        // dimensions. For example, if input is 25x25 the QR will be 33x33 including the quiet zone.
        // If the requested size is 200x160, the multiple will be 4, for a QR of 132x132. These will
        // handle all the padding from 100x100 (the actual QR) up to 200x160.
        int leftPadding = (outputWidth - (inputWidth * multiple)) / 2;
        int topPadding = (outputHeight - (inputHeight * multiple)) / 2;

        BitMatrix output = new BitMatrix(outputWidth, outputHeight);

        for (int inputY = 0, outputY = topPadding; inputY < inputHeight; inputY++, outputY += multiple) {
            // Write the contents of this row of the barcode
            for (int inputX = 0, outputX = leftPadding; inputX < inputWidth; inputX++, outputX += multiple) {
                if (input.get(inputX, inputY) == 1) {
                    output.setRegion(outputX, outputY, multiple, multiple);
                }
            }
        }

        return output;
    }

    public static int getdip2px(float dpValue) {
        final float scale = RXGlobalData.getContext().getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }
}
