package com.ruixue.utils;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.EncodeHintType;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Reader;
import com.google.zxing.Result;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.qrcode.encoder.ByteMatrix;
import com.google.zxing.qrcode.encoder.Encoder;
import com.google.zxing.qrcode.encoder.QRCode;

import java.util.Hashtable;
import java.util.Map;

public class QRCodeUtil {
    public static Bitmap createQRCodeBitmap(String content, int width, int height, int margin) {
        return createQRCodeBitmap(content, width, height, "UTF-8", "L", margin, Color.BLACK, Color.WHITE, null, 0F, null);
    }

    /**
     * 生成自定义二维码
     * @param content                字符串内容
     * @param width                  二维码宽度
     * @param height                 二维码高度
     * @param character_set          编码方式（一般使用UTF-8）
     * @param error_correction_level 容错率 L：7% M：15% Q：25% H：35%
     * @param margin                 空白边距（二维码与边框的空白区域）
     * @param color_black            黑色色块
     * @param color_white            白色色块
     * @param logoBitmap             logo图片（传null时不添加logo）
     * @param logoPercent            logo所占百分比
     * @param bitmap_black           用来代替黑色色块的图片（传null时不代替）
     * @return
     */
    public static Bitmap createQRCodeBitmap(String content, int width, int height, String character_set, String error_correction_level, int margin, int color_black, int color_white, Bitmap logoBitmap, float logoPercent, Bitmap bitmap_black) {
        // 宽和高>=0
        if (TextUtils.isEmpty(content) || (width - margin * 2) <= 0 || (height - margin * 2) <= 0) {
            return null;
        }
        try {
            /** 1.设置二维码相关配置,生成BitMatrix(位矩阵)对象 */
            Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
            // 字符转码格式设置
            if (!TextUtils.isEmpty(character_set)) {
                hints.put(EncodeHintType.CHARACTER_SET, character_set);
            }
            // 容错率设置
            if (!TextUtils.isEmpty(error_correction_level)) {
                hints.put(EncodeHintType.ERROR_CORRECTION, error_correction_level);
            }
            // 空白边距设置
//            if (!TextUtils.isEmpty(margin)) {
            hints.put(EncodeHintType.MARGIN, 0);
//            }
            /** 2.将配置参数传入到QRCodeWriter的encode方法生成BitMatrix(位矩阵)对象 */
//            BitMatrix bitMatrix = new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            BitMatrix bitMatrix = encode(content, width, height, hints);

            int w = bitMatrix.getWidth();
            int h = bitMatrix.getHeight();

            /** 3.创建像素数组,并根据BitMatrix(位矩阵)对象为数组元素赋颜色值 */
            if (bitmap_black != null) {
                //从当前位图按一定的比例创建一个新的位图
                bitmap_black = Bitmap.createScaledBitmap(bitmap_black, w, h, false);
            }

            int[] pixels = new int[w * h];
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    //bitMatrix.get(x,y)方法返回true是黑色色块，false是白色色块
                    if (bitMatrix.get(x, y)) {// 黑色色块像素设置
                        if (bitmap_black != null) {//图片不为null，则将黑色色块换为新位图的像素。
                            pixels[y * w + x] = bitmap_black.getPixel(x, y);
                        } else {
                            pixels[y * w + x] = color_black;
                        }
                    } else {
                        pixels[y * w + x] = color_white;// 白色色块像素设置
                    }
                }
            }

            /** 4.创建Bitmap对象,根据像素数组设置Bitmap每个像素点的颜色值,并返回Bitmap对象 */
            Bitmap bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, w, 0, 0, w, h);

            /** 5.为二维码添加logo图标 */
            if (logoBitmap != null) {
                return addLogo(bitmap, logoBitmap, logoPercent);
            }

            int totalWidth = width - 2 * margin;
            int totalHeight = height - 2 * margin;
            Bitmap originalBitmap = Bitmap.createScaledBitmap(bitmap, totalWidth, totalHeight, false);
            bitmap.recycle();
            if (margin <= 0) {
                return originalBitmap;
            } else {
                Bitmap resultBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(resultBitmap);
                // 设置边框颜色
                Paint paint = new Paint();
                paint.setColor(Color.WHITE);
                paint.setStyle(Paint.Style.FILL);
                canvas.drawRect(0, 0, width, margin, paint);
                canvas.drawRect(0, height - margin, width, height, paint);
                canvas.drawRect(0, 0, margin, height, paint);
                canvas.drawRect(width - margin, 0, width, height, paint);
                canvas.drawBitmap(originalBitmap, margin, margin, null);
                originalBitmap.recycle();
                return resultBitmap;
            }
        } catch (WriterException e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 向二维码中间添加logo图片(图片合成)
     * @param srcBitmap   原图片（生成的简单二维码图片）
     * @param logoBitmap  logo图片
     * @param logoPercent 百分比 (用于调整logo图片在原图片中的显示大小, 取值范围[0,1] )
     *                    原图片是二维码时,建议使用0.2F,百分比过大可能导致二维码扫描失败。
     * @return
     */
    @Nullable
    private static Bitmap addLogo(@Nullable Bitmap srcBitmap, @Nullable Bitmap logoBitmap, float logoPercent) {
        if (srcBitmap == null) {
            return null;
        }
        if (logoBitmap == null) {
            return srcBitmap;
        }
        //传值不合法时使用0.2F
        if (logoPercent < 0F || logoPercent > 1F) {
            logoPercent = 0.2F;
        }

        /** 1. 获取原图片和Logo图片各自的宽、高值 */
        int srcWidth = srcBitmap.getWidth();
        int srcHeight = srcBitmap.getHeight();
        int logoWidth = logoBitmap.getWidth();
        int logoHeight = logoBitmap.getHeight();

        /** 2. 计算画布缩放的宽高比 */
        float scaleWidth = srcWidth * logoPercent / logoWidth;
        float scaleHeight = srcHeight * logoPercent / logoHeight;

        /** 3. 使用Canvas绘制,合成图片 */
        Bitmap bitmap = Bitmap.createBitmap(srcWidth, srcHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawBitmap(srcBitmap, 0, 0, null);
        canvas.scale(scaleWidth, scaleHeight, srcWidth / 2f, srcHeight / 2f);
        canvas.drawBitmap(logoBitmap, srcWidth / 2f - logoWidth / 2f, srcHeight / 2f - logoHeight / 2f, null);

        return bitmap;
    }

    //    * Android生成二维码、去除白边
    public static Bitmap generateBitmap(String content, int width, int height, boolean needDeleteWhiteBorder) {
        try {
            Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
//            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 0);

            BitMatrix matrix = new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            if (needDeleteWhiteBorder) {
                matrix = deleteWhite(matrix);//删除白边
            }

            width = matrix.getWidth();
            height = matrix.getHeight();
            int[] pixels = new int[width * height];

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (matrix.get(x, y)) {
                        pixels[y * width + x] = Color.BLACK;
                    } else {
                        pixels[y * width + x] = Color.WHITE;
                    }
                }
            }

            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (Exception e) {
            return null;
        }
    }

    public static Bitmap generateBitmap(BitMatrix matrix, boolean needDeleteWhiteBorder) {
        try {
//            Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
//            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
////            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
//            hints.put(EncodeHintType.MARGIN, 0);
//

            if (needDeleteWhiteBorder) {
                matrix = deleteWhite(matrix);//删除白边
            }

            int width = matrix.getWidth();
            int height = matrix.getHeight();
            int[] pixels = new int[width * height];

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (matrix.get(x, y)) {
                        pixels[y * width + x] = Color.BLACK;
                    } else {
                        pixels[y * width + x] = Color.WHITE;
                    }
                }
            }

            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (Exception e) {
            return null;
        }
    }

    private static BitMatrix deleteWhite(BitMatrix matrix) {
        int[] rec = matrix.getEnclosingRectangle();
        int resWidth = rec[2] + 1;
        int resHeight = rec[3] + 1;

        BitMatrix resMatrix = new BitMatrix(resWidth, resHeight);
        resMatrix.clear();
        for (int i = 0; i < resWidth; i++) {
            for (int j = 0; j < resHeight; j++) {
                if (matrix.get(i + rec[0], j + rec[1]))
                    resMatrix.set(i, j);
            }
        }
        return resMatrix;
    }

    public static String decodeQrCode(Bitmap bm) {
        String contents = null;

        int[] intArray = new int[bm.getWidth() * bm.getHeight()];
        bm.getPixels(intArray, 0, bm.getWidth(), 0, 0, bm.getWidth(), bm.getHeight());

        LuminanceSource source = new RGBLuminanceSource(bm.getWidth(), bm.getHeight(), intArray);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

        Reader reader = new MultiFormatReader();// use this otherwise ChecksumException
        try {
            Result result = reader.decode(bitmap);
            contents = result.getText();
            //byte[] rawBytes = result.getRawBytes();
            //BarcodeFormat format = result.getBarcodeFormat();
            //ResultPoint[] points = result.getResultPoints();
        } catch (Exception ignored) {
        }
        return contents;
    }


    private static final int QUIET_ZONE_SIZE = 4;

    /**
     * 对 zxing 的 QRCodeWriter 进行扩展, 解决白边过多的问题
     */
    private static BitMatrix encode(String content, Integer w, Integer h, Map<EncodeHintType, Object> hints) throws WriterException {
        ErrorCorrectionLevel errorCorrectionLevel = ErrorCorrectionLevel.L;
        int quietZone = 1;
        if (hints != null) {
            if (hints.containsKey(EncodeHintType.ERROR_CORRECTION)) {
                errorCorrectionLevel = ErrorCorrectionLevel.valueOf(hints.get(EncodeHintType.ERROR_CORRECTION).toString());
            }
            if (hints.containsKey(EncodeHintType.MARGIN)) {
                quietZone = Integer.parseInt(hints.get(EncodeHintType.MARGIN).toString());
            }

            if (quietZone > QUIET_ZONE_SIZE) {
                quietZone = QUIET_ZONE_SIZE;
            } else if (quietZone < 0) {
                quietZone = 0;
            }
        }

        QRCode code = Encoder.encode(content, errorCorrectionLevel, hints);
        return renderResult(code, w, h, quietZone);
    }


    /**
     * 对 zxing 的 QRCodeWriter 进行扩展, 解决白边过多的问题
     * <p/>
     * @param code
     * @param width
     * @param height
     * @param quietZone 取值 [0, 4]
     * @return
     */
    private static BitMatrix renderResult(QRCode code, int width, int height, int quietZone) {
        ByteMatrix input = code.getMatrix();
        if (input == null) {
            throw new IllegalStateException();
        }

        // xxx 二维码宽高相等, 即 qrWidth == qrHeight
        int inputWidth = input.getWidth();
        int inputHeight = input.getHeight();
        int qrWidth = inputWidth + (quietZone * 2);
        int qrHeight = inputHeight + (quietZone * 2);


        // 白边过多时, 缩放
        int minSize = Math.min(width, height);
        int scale = calculateScale(qrWidth, minSize);
        if (scale > 0) {

//            RXLogger.d(String.format("qrCode scale enable! scale: {}, qrSize:{}, expectSize:{}x{}", scale, qrWidth, width, height));


            int padding, tmpValue;
            // 计算边框留白
            padding = (minSize - qrWidth * scale) / QUIET_ZONE_SIZE * quietZone;
            tmpValue = qrWidth * scale + padding;
            if (width == height) {
                width = tmpValue;
                height = tmpValue;
            } else if (width > height) {
                width = width * tmpValue / height;
                height = tmpValue;
            } else {
                height = height * tmpValue / width;
                width = tmpValue;
            }
        }

        int outputWidth = Math.max(width, qrWidth);
        int outputHeight = Math.max(height, qrHeight);

        int multiple = Math.min(outputWidth / qrWidth, outputHeight / qrHeight);
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


    /**
     * 如果留白超过15% , 则需要缩放
     * (15% 可以根据实际需要进行修改)
     * @param qrCodeSize 二维码大小
     * @param expectSize 期望输出大小
     * @return 返回缩放比例, <= 0 则表示不缩放, 否则指定缩放参数
     */
    private static int calculateScale(int qrCodeSize, int expectSize) {
        if (qrCodeSize >= expectSize) {
            return 0;
        }

        int scale = expectSize / qrCodeSize;
        int abs = expectSize - scale * qrCodeSize;
        if (abs < expectSize * 0.15) {
            return 0;
        }

        return scale;
    }
}
