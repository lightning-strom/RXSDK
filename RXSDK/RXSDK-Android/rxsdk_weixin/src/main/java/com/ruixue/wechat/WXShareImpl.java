package com.ruixue.wechat;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.FutureTarget;
import com.bumptech.glide.request.target.Target;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.utils.BitmapHelper;
import com.ruixue.utils.FileUtil;
import com.ruixue.utils.ImageUtil;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject;
import com.tencent.mm.opensdk.modelmsg.WXMusicVideoObject;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXVideoObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WXShareImpl {
    private static final int THUMB_SIZE = 150;
    private static final int MAX_THUMB_IMAGE_BYTES = 32 * 1024;    // 微信限定分享图片不得超过 32 K
    private static final int MAX_COVER_IMAGE_BYTES = 128 * 1024;    // 小程序消息封面图片，小于128k
    private static final ExecutorService singleExecutor = Executors.newSingleThreadExecutor();

    private final Context mContext;

    WXShareImpl(Context context) {
        mContext = context;
    }

    public Context getContext() {
        return mContext;
    }

    public void sendShareReq(IWXAPI api, WXShareObject shareObject, RXJSONCallback shareCallback) {
        singleExecutor.execute(() -> {
            try {
                boolean success = api.sendReq(createSendMessageToWXReq(shareObject));
                if (!success) {
                    shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                } else {
                    WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.SENDMESSAGE_TO_WX, new WXShareResp() {
                        @Override
                        public void onShareResp(int errCode) {
                            if (WXErrCode.ERR_OK == errCode) {
                                shareCallback.onSuccess(null);
                            } else {
                                shareCallback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(errCode, "分享" + WXErrCode.getMsg(errCode)));
                            }
                        }
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
                shareCallback.onError(new RXException(e));
            }
        });
    }


    // 使用contentPath作为文件路径进行分享
    private String getFileUri(Context context, File file) {
        if (file == null || !file.exists()) {
            return null;
        }
        if (null == context) {
            // Uri.fromFile 不允许跨越配置文件共享文件 ,接收者应用需要有READ_EXTERNAL_STORAGE
            return Uri.fromFile(file).toString();
        }
        //android 11 适配
        Uri uri = FileUtil.grantUri(context, file, "com.tencent.mm");
        return uri.toString();
    }

    //获取 bitmap 耗时操作不能工作在 ui 线程
    private Bitmap getThumbBitmap(Context context, String imagePath) throws IOException {
        Bitmap bitmap = null;
        if (TextUtils.isEmpty(imagePath)) {
            throw new NullPointerException("getBitmap imagePath is null error : ");
        }
        if (imagePath.startsWith("http")) {
            FutureTarget<Bitmap> futureTarget = Glide.with(context).asBitmap().load(imagePath).skipMemoryCache(true)//禁用内存缓存防止 recycle oom
                    .submit(Target.SIZE_ORIGINAL, Target.SIZE_ORIGINAL);
            try {
                bitmap = futureTarget.get();
            } catch (Exception e) {
                e.printStackTrace();
                bitmap = HttpClient.getRemoteBitmap(imagePath);

            }
        } else {
            try {
                if (imagePath.startsWith("/")) {
                    imagePath = Uri.fromFile(new File(imagePath)).toString();
                }
                bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), Uri.parse(imagePath));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                bitmap = BitmapFactory.decodeFile(imagePath);
            }
        }
        if (bitmap == null) {
            throw new NullPointerException("getBitmap bitmap is null error : " + imagePath);
        }
        return bitmap;
    }

    @NonNull
    private byte[] getThumbData(ShareObject shareObject) throws IOException {
        Bitmap thumbBmp = getThumbBitmap(shareObject);
        return ImageUtil.bmpToByteArray(thumbBmp, MAX_THUMB_IMAGE_BYTES, true);
    }

    @NonNull
    private Bitmap getThumbBitmap(ShareObject shareObject) throws IOException {
        Bitmap thumbBmp;
        Context context = getContext();
        String thumbUrl = shareObject.getImage();
        if (TextUtils.isEmpty(thumbUrl)) {
            thumbBmp = BitmapFactory.decodeResource(context.getResources(), context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName()));
            if (thumbBmp == null) {
                throw new IllegalArgumentException("ERROR: app icon name is not ic_launcher.");
            }
        } else {
            Bitmap tmp = getThumbBitmap(context, thumbUrl);
            thumbBmp = Bitmap.createScaledBitmap(tmp, THUMB_SIZE, THUMB_SIZE, true);
            if (tmp != null && !tmp.equals(thumbBmp)) {
                tmp.recycle();
            }
            if (thumbBmp == null) {
                throw new IllegalArgumentException("ERROR: image params is invalid.");
            }
        }
        return thumbBmp;
    }

    //封面图数据
    private byte[] getCoverData(Context context, String imagePath) throws IOException {
        Bitmap bitmap = getThumbBitmap(context, imagePath);
        return ImageUtil.bmpToByteArray(bitmap, MAX_COVER_IMAGE_BYTES, true);
    }


    //处理分享图片
    private String handleShareImage(Context context, ShareObject shareObject) throws IOException {
        String imageUrl = shareObject.getImage();
        String link = shareObject.getUrl();
        int width = shareObject.getWidth();
        int height = shareObject.getHeight();
        int x = shareObject.getX();
        int y = shareObject.getY();
        int permission = ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permission == PackageManager.PERMISSION_GRANTED || (!TextUtils.isEmpty(imageUrl) && imageUrl.startsWith("http")) || (!TextUtils.isEmpty(link) && link.startsWith("http"))) {
            String fileName = getFileNameWithoutExt(imageUrl);
            Bitmap bgbitmap = getThumbBitmap(context, imageUrl);
            if (!TextUtils.isEmpty(link)) {
                if (width > 0 && height > 0) {
                    // 合成二维码写入相册
                    bgbitmap = BitmapHelper.addQRToBitmap(bgbitmap, link, width, height, x, y, shareObject.getBorderSize());
                } else {
                    RXLogger.e("ERROR: Qr code generation error size:width=" + width + ",height=" + height);
                }
            }
            //写入相册
            String uriStr = ImageUtil.saveBitmapToFile(context, fileName, bgbitmap);
            bgbitmap.recycle();
            imageUrl = TextUtils.isEmpty(uriStr) ? imageUrl : uriStr;
        }
        if (!TextUtils.isEmpty(imageUrl)) {
            context.grantUriPermission("com.tencent.mm", Uri.parse(imageUrl), Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        RXLogger.i("share image uri:" + imageUrl);
        return imageUrl;
    }

    @NonNull
    private String getFileNameWithoutExt(String imageUrl) {
        String fileName = FileUtil.getFileName(ObjectUtils.requireNonNull(imageUrl, "params image is null error."));
        if (TextUtils.isEmpty(fileName)) {
            fileName = "wlshare_" + System.currentTimeMillis() / 1000 + ".png";
        } else if (fileName != null && !(fileName.endsWith(".png") || fileName.endsWith(".jpeg") || fileName.endsWith(".jpg"))) {
            fileName = fileName + ".jpg";
        }
        if (fileName == null) {
            throw new IllegalArgumentException("The file name was not obtained :" + imageUrl);
        }
        return fileName;
    }

    // text 长度需大于 0 且不超过 10KB
    private WXMediaMessage createTextMediaMessage(WXShareObject shareObject) {
        WXTextObject textObj = new WXTextObject();
        String text = shareObject.getTitle();
        if (TextUtils.isEmpty(text)) {
            throw new IllegalArgumentException("ERROR: title params is invalid");
        }
        textObj.text = text;
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        msg.description = textObj.text;
        return msg;
    }

    private WXMediaMessage createImageMediaMessage(ShareObject shareObject) throws IOException {
        String imagePath = handleShareImage(getContext(), shareObject);
        return createImageMediaMessage(getContext(), imagePath);
    }

    //imageData	byte[]	图片的二进制数据	内容大小不超过 1MB
    //imagePath	String	图片的本地路径	对应图片内容大小不超过 25MB
    private WXMediaMessage createImageMediaMessage(Context context, @NonNull String imagePath) throws IOException {
        WXMediaMessage msg = null;

        //初始化 WXImageObject 和 WXMediaMessage 对象
        WXImageObject imgObj = new WXImageObject();
        InputStream fis;
        if (imagePath.startsWith(ContentResolver.SCHEME_CONTENT)) {
            fis = context.getContentResolver().openInputStream(Uri.parse(imagePath));
            imgObj.setImagePath(imagePath);
        } else {
            fis = new FileInputStream(imagePath);
            String uriStr = getFileUri(context, new File(imagePath));
            if (!TextUtils.isEmpty(uriStr)) {
                imgObj.setImagePath(uriStr);
            } else {
                Log.e("share", "file not exists." + imagePath);
            }
        }
        msg = new WXMediaMessage();
        msg.mediaObject = imgObj;
        Bitmap bmp = BitmapFactory.decodeStream(fis);
        fis.close();
        //设置缩略图
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        msg.thumbData = ImageUtil.bmpToByteArray(thumbBmp, MAX_THUMB_IMAGE_BYTES, true);
        bmp.recycle();
        return msg;
    }


    private WXMediaMessage createWebpageMediaMessage(WXShareObject shareObject) throws IOException {
        if (TextUtils.isEmpty(shareObject.getUrl())) {
            throw new IllegalArgumentException("ERROR: url params is invalid.");
        }
        if (TextUtils.isEmpty(shareObject.getTitle()) && TextUtils.isEmpty(shareObject.getDescription())) {
            throw new IllegalArgumentException("ERROR: title and content params is invalid,at least one of them is not empty.");
        }
        //初始化一个WXWebpageObject，填写url
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = shareObject.getUrl();
        //用 WXWebpageObject 对象初始化一个 WXMediaMessage 对象
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = shareObject.getTitle();
        msg.description = shareObject.getDescription();
        msg.thumbData = getThumbData(shareObject);
        return msg;
    }


    private WXMediaMessage createMiniProgramMediaMessage(WXShareObject shareObject) throws IOException {
        WXMiniProgramObject miniProgramObj = new WXMiniProgramObject();
        String userName = shareObject.getUsername();
        String image = shareObject.getImage();
        String url = shareObject.getUrl();
        if (TextUtils.isEmpty(userName)) {
            throw new IllegalArgumentException("check gh_id username params is null error");
        }
        if (TextUtils.isEmpty(image)) {
            throw new IllegalArgumentException("image params should not be null");
        }
        if (TextUtils.isEmpty(url)) {
            throw new IllegalArgumentException("url params should not be null,compatible with lower versions of web links");
        }
        miniProgramObj.withShareTicket = shareObject.getWithShareTicket();
        miniProgramObj.webpageUrl = url; // 兼容低版本的网页链接
        miniProgramObj.miniprogramType = shareObject.getMiniprogramType();// 正式版:0，测试版:1，体验版:2
        miniProgramObj.userName = userName;     // 小程序原始id
        miniProgramObj.path = shareObject.getPath();            //小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
        WXMediaMessage msg = new WXMediaMessage(miniProgramObj);
        msg.title = shareObject.getTitle();                    // 小程序消息title
        msg.description = shareObject.getDescription();        // 小程序消息desc

        msg.thumbData = getCoverData(getContext(), image);   // 小程序消息封面图片，小于128k

        return msg;
    }


    private WXMediaMessage createVideoObject(WXShareObject shareObject) throws IOException {
        if (TextUtils.isEmpty(shareObject.getUrl())) {
            throw new IllegalArgumentException("ERROR: url params is invalid, videoUrl can't be null.");
        }
        WXVideoObject video = new WXVideoObject();
        video.videoUrl = shareObject.getUrl();
        video.videoLowBandUrl = shareObject.getUrl();
        //用 WXVideoObject 对象初始化一个 WXMediaMessage 对象
        WXMediaMessage msg = new WXMediaMessage(video);
        msg.title = shareObject.getTitle();
        msg.description = shareObject.getDescription();
        msg.thumbData = getThumbData(shareObject);
        return msg;
    }

    //todo 未完善
    private WXMediaMessage createMusicVideoObject(WXShareObject shareObject) throws IOException {
        WXMusicVideoObject musicVideo = new WXMusicVideoObject();
        musicVideo.musicUrl = shareObject.getUrl();     // 音乐url
        musicVideo.musicDataUrl = shareObject.getImage(); // 音乐音频url
        musicVideo.songLyric = null;    // 歌词
        musicVideo.hdAlbumThumbFilePath = null;     // 专辑图本地文件路径
        musicVideo.singerName = null;
        musicVideo.albumName = "album_xxx";
        musicVideo.musicGenre = "流行歌曲";
        musicVideo.issueDate = 1610713585;
        musicVideo.identification = "sample_identification";
        musicVideo.duration = 120000;    // 单位为毫秒

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = musicVideo;
        msg.title = shareObject.getTitle();    // 必填，不能为空
        msg.description = shareObject.getDescription();  // 选填，建议与歌手名字段 singerName 保持一致
        msg.messageExt = "额外信息";   // 微信跳回应用时会带上
        msg.thumbData = getThumbData(shareObject);   // 音乐卡片缩略图，不超过64KB

        return msg;
    }


    private SendMessageToWX.Req createSendMessageToWXReq(WXShareObject shareObject) throws IOException {
        //初始化一个 WXMediaMessage 对象
        WXMediaMessage mediaMessage = null;
        String shareType = shareObject.getType();
        if (TextUtils.isEmpty(shareType)) {
            throw new IllegalArgumentException("params material_type is null error");
        }
        switch (shareType) {
            case ShareMediaType.TEXT:
                mediaMessage = createTextMediaMessage(shareObject);
                break;
            case ShareMediaType.IMAGE:
            case ShareMediaType.LANDING:
                mediaMessage = createImageMediaMessage(shareObject);
                break;
            case ShareMediaType.A2M:
            case ShareMediaType.CARD:
                mediaMessage = createMiniProgramMediaMessage(shareObject);
                break;
            case ShareMediaType.WEBPAGE:
                mediaMessage = createWebpageMediaMessage(shareObject);
                break;
            case ShareMediaType.VIDEO:
                mediaMessage = createVideoObject(shareObject);
                break;
            case ShareMediaType.MUSIC:
                mediaMessage = createMusicVideoObject(shareObject);
                break;
            default:
                throw new IllegalArgumentException("Unsupported share type " + shareType);
        }

        //构造一个Req
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction(shareType);
        req.message = mediaMessage;
        req.scene = ShareMediaType.A2M.equals(shareType) ? SendMessageToWX.Req.WXSceneSession : shareObject.getShareScene();
        if (req.scene < 0) {
            throw new IllegalArgumentException("Unsupported share scene " + req.scene);
        }
        if (!TextUtils.isEmpty(shareObject.getOpenId())) {
            req.userOpenId = shareObject.getOpenId();
        }
        return req;
    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

}
