package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.util.Log;

import androidx.annotation.Keep;

import com.ruixue.RuiXueSdk;
import com.ruixue.utils.EntityUtils;

import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Keep
public class ImageObject extends BaseMediaObject {

    public static final MediaType MEDIA_TYPE = MediaType.IMAGE;

    public static final int MAX_WIDTH = 768;
    public static final int MAX_HEIGHT = 1024;

    public static final int FILE_IMAGE = 1;
    public static final int URL_IMAGE = 2;
    public static final int RES_IMAGE = 3;
    public static final int BITMAP_IMAGE = 4;
    public static final int BINARY_IMAGE = 5;

    @Keep
    private ImageObject.ConfiguredConvertor convertor = null;
    public boolean isLoadImgByCompress = true;
    @Keep
    private ImageObject imageObject;
    public ImageObject.CompressStyle compressStyle;
    public CompressFormat compressFormat;
    @Keep
    private int imageStyle;

    public ImageObject(Context context, File file) {
        this.init(context, file);
    }

    public ImageObject(Context context, String url) {
        super(url);
        this.init(context, url);
    }

    public ImageObject(Context context, int resId) {
        this.init(context, resId);
    }

    public ImageObject(Context context, byte[] bytes) {
        this.init(context, bytes);
    }

    public ImageObject(Context context, Bitmap bitmap) {
        this.init(context, bitmap);
    }

    @Keep
    private void init(Context var1, Object o) {
        this.compressStyle = ImageObject.CompressStyle.SCALE;
        this.compressFormat = CompressFormat.JPEG;
        this.imageStyle = 0;
//        if (ContextUtil.getContext() == null) {
//            ContextUtil.setContext(var1.getApplicationContext());
//        }
//
        if (o instanceof File) {
            this.imageStyle = FILE_IMAGE;
            this.convertor = new FileConvertor((File) o);
        } else if (o instanceof String) {
            this.imageStyle = URL_IMAGE;
            this.convertor = new UrlConvertor((String) o);
        } else {
            if (o instanceof Integer) {
                this.imageStyle = RES_IMAGE;
                this.convertor = new ResConvertor(var1.getApplicationContext(), (Integer) o);
            } else if (o instanceof byte[]) {
                this.imageStyle = BINARY_IMAGE;
                this.convertor = new BinaryConvertor((byte[]) o);
            } else if (o instanceof Bitmap) {
                this.imageStyle = BITMAP_IMAGE;
                this.convertor = new BitmapConvertor((Bitmap) o);
            } else if (o != null) {
                Log.e(RuiXueSdk.TAG, "unknow image type " + o.getClass().getSimpleName());
            } else {
                Log.e(RuiXueSdk.TAG, "unknow image type is null");
            }
        }
    }

    public byte[] toByte() {
        return this.asBinImage();
    }

    public void setThumb(ImageObject imageObject) {
        this.imageObject = imageObject;
    }

    public ImageObject getThumbImage() {
        return this.imageObject;
    }

    public final Map<String, Object> toUrlExtraParams() {
        HashMap<String, Object> var1 = new HashMap<>();
        if (this.isUrlMedia()) {
            var1.put(BaseMediaObject.PROTOCOL_KEY_FURL, this.url);
            var1.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, this.getMediaType());
        }
        return var1;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> hashMap = EntityUtils.entityToMap(this);
        hashMap.put(BaseMediaObject.PROTOCOL_KEY_FTYPE, MEDIA_TYPE);
        return hashMap;
    }

    public MediaType getMediaType() {
        return MEDIA_TYPE;
    }

    public int getImageStyle() {
        return this.imageStyle;
    }

    public File asFileImage() {
        return this.convertor == null ? null : this.convertor.asFile();
    }

    public String asUrlImage() {
        return this.convertor == null ? null : this.convertor.asUrl();
    }

    public byte[] asBinImage() {
        return this.convertor == null ? null : this.convertor.asBinary();
    }

    public Bitmap asBitmap() {
        return this.convertor == null ? null : this.convertor.asBitmap();
    }

//    @Keep
//    private Bitmap toBitmap(Bitmap bitmap, boolean var2) {
//        if (this.h == null) {
//            return bitmap;
//        } else if (bitmap == null) {
//            return null;
//        } else {
//            try {
//                if (var2) {
//                    bitmap = this.toBitmap(bitmap);
//                }
//
//                return this.h.compound(bitmap);
//            } catch (Exception var4) {
////                SLog.error(var4);
//                return null;
//            }
//        }
//        return null;
//    }

    @Keep
    private Bitmap toBitmap(Context context, int resId) {
        if (resId != 0 && context != null) {
            InputStream is = null;

            try {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inJustDecodeBounds = true;
                is = context.getResources().openRawResource(resId);
                BitmapFactory.decodeStream(is, (Rect) null, options);
                this.close((Closeable) is);
                int scale = (int) this.zoomFactor((float) options.outWidth, (float) options.outHeight, (float) MAX_WIDTH, (float) MAX_HEIGHT);
                if (scale > 0) {
                    options.inSampleSize = scale;
                }
                options.inJustDecodeBounds = false;
                is = context.getResources().openRawResource(resId);
                return BitmapFactory.decodeStream(is, (Rect) null, options);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                this.close(is);
            }
            return null;
        } else {
            return null;
        }
    }

    @Keep
    private void close(Closeable closeable) {
        try {
            if (closeable != null) {
                closeable.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Keep
    private Bitmap toBitmap(byte[] bytes) {
        if (bytes != null) {
            try {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inJustDecodeBounds = true;
                BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
                int scale = (int) this.zoomFactor((float) options.outWidth, (float) options.outHeight, (float) MAX_WIDTH, (float) MAX_HEIGHT);
                if (scale > 0) {
                    options.inSampleSize = scale;
                }
                options.inJustDecodeBounds = false;
                return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } else {
            return null;
        }
    }

    @Keep
    private Bitmap toBitmap(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        float scale = this.zoomFactor((float) width, (float) height, (float) MAX_WIDTH, (float) MAX_HEIGHT);
        if (scale < 0.0F) {
            return bitmap;
        } else {
            scale = 1.0F / scale;
            Matrix matrix = new Matrix();
            matrix.postScale(scale, scale);
            Bitmap var6 = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, false);
            this.recycle(bitmap);
            return var6;
        }
    }

    @Keep
    private float zoomFactor(float width, float height, float maxWidth, float maxHeight) {
        if (width <= maxHeight && height <= maxHeight) {
            return -1.0F;
        } else {
            float w = width / maxWidth;
            float h = height / maxHeight;
            return Math.max(w, h);
        }
    }

    @Keep
    private void recycle(Bitmap bitmap) {
        try {
            if (bitmap != null && !bitmap.isRecycled()) {
                bitmap.recycle();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    interface IImageConvertor {
        File asFile();

        String asUrl();

        byte[] asBinary();

        Bitmap asBitmap();
    }

    abstract static class ConfiguredConvertor implements ImageObject.IImageConvertor {
        ConfiguredConvertor() {
        }
    }

    class ResConvertor extends ImageObject.ConfiguredConvertor {
        @Keep
        private Context context;
        @Keep
        private int resId = 0;

        public ResConvertor(Context context, int id) {
            this.context = context;
            this.resId = id;
        }

        public File asFile() {

//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.b(this.asBinary()) : null;
            return null;
        }

        public String asUrl() {
            return null;
        }

        public byte[] asBinary() {
//            return url.a(this.context, this.c, ImageObject.this.isLoadImgByCompress, UMImage.this.compressFormat);
            return null;
        }

        public Bitmap asBitmap() {
//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.a(this.asBinary()) : null;
            return null;
        }
    }

    class BinaryConvertor extends ImageObject.ConfiguredConvertor {
        @Keep
        private byte[] bytes;

        public BinaryConvertor(byte[] bytes) {
            this.bytes = bytes;
        }

        public File asFile() {
//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.b(this.asBinary()) : null;
            return null;
        }

        public String asUrl() {
            return null;
        }

        public byte[] asBinary() {
            return this.bytes;
        }

        public Bitmap asBitmap() {

//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.a(this.asBinary()) : null;
            return null;

        }
    }

    class UrlConvertor extends ImageObject.ConfiguredConvertor {
        @Keep
        private String url = null;

        public UrlConvertor(String var2) {
            this.url = var2;
        }

        public File asFile() {
//                return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.b(this.asBinary()) : null;
            return null;
        }

        public String asUrl() {
            return this.url;
        }

        public byte[] asBinary() {
//            return url.a(this.url);
            return null;
        }

        public Bitmap asBitmap() {
//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.a(this.asBinary()) : null;
            return null;

        }
    }

    class FileConvertor extends ImageObject.ConfiguredConvertor {
        @Keep
        private File file;

        public FileConvertor(File file) {
            this.file = file;
        }

        public File asFile() {
            return this.file;
        }

        public String asUrl() {
            return null;
        }

        public byte[] asBinary() {

//            return url.a(this.file, UMImage.this.compressFormat);
            return getBytes(this.file);
        }

        public Bitmap asBitmap() {
//                return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.a(UMImage.this.asBinImage()) : null;
            return null;
        }
    }


    class BitmapConvertor extends ImageObject.ConfiguredConvertor {
        @Keep
        private final Bitmap bitmap;

        public BitmapConvertor(Bitmap bitmap) {
            this.bitmap = bitmap;
        }

        public File asFile() {
//            byte[] var1 = url.a(this.bitmap, UMImage.this.compressFormat);
//            return SocializeUtils.assertBinaryInvalid(this.asBinary()) ? url.b(var1) : null;
            return null;
        }

        public String asUrl() {
            return null;
        }

        public byte[] asBinary() {
//            return url.a(this.bitmap, UMImage.this.compressFormat);

            byte[] data = getBytes(this.bitmap);
            return data;
        }

        public Bitmap asBitmap() {
            return this.bitmap;
        }
    }

    @Keep
    private byte[] getBytes(Bitmap bitmap) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(ImageObject.this.compressFormat, 100, baos);
        return baos.toByteArray();
    }

    @Keep
    private byte[] getBytes(File file) {
        byte[] buffer = null;
        try {
            FileInputStream fis = new FileInputStream(file);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] b = new byte[1024];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            fis.close();
            bos.close();
            buffer = bos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return buffer;
    }


    public static enum CompressStyle {
        SCALE,
        QUALITY;

        @Keep
        private CompressStyle() {
        }
    }
}

