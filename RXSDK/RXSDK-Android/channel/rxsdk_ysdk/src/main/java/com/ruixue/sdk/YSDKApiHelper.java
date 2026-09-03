package com.ruixue.sdk;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.ysdk.R;
import com.tencent.bugly.opengame.crashreport.CrashReport;
import com.tencent.ysdk.api.YSDKApi;
import com.tencent.ysdk.framework.common.eFlag;
import com.tencent.ysdk.framework.common.ePlatform;
import com.tencent.ysdk.module.antiaddiction.listener.QueryCertificationCallback;
import com.tencent.ysdk.module.antiaddiction.model.CertificationRect;
import com.tencent.ysdk.module.pay.PayItem;
import com.tencent.ysdk.module.pay.PayListener;
import com.tencent.ysdk.module.share.ShareApi;
import com.tencent.ysdk.module.user.UserLoginRet;

import java.io.ByteArrayOutputStream;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/24
 */
public class YSDKApiHelper {


    //游戏自定义透传信息，用来区分当前分享场景，会通过回调结果回传给游戏、输出至统计报表。
    // 建议不同分享场景构造不同extInfo做区分
    private static final String EXTRA_INFO = RuiXueSdk.TAG;//只可包含字母数字下划线20位以内

    private static String shareToQQ(Activity activity, String title, String description, String transmit) {
        ShareApi.getInstance().shareToQQFriend(getBitMap(activity), title, description, TextUtils.isEmpty(transmit) ? EXTRA_INFO : transmit);
        return "";
    }

    private static String shareToWX(Activity activity, String title, String description, String transmit) {
        ShareApi.getInstance().shareToWXFriend(getBitMap(activity), title, description, TextUtils.isEmpty(transmit) ? EXTRA_INFO : transmit);
        return "";
    }

    private static String shareToWXTimeLine(Activity activity, String title, String description, String transmit) {
        ShareApi.getInstance().shareToWXTimeline(getBitMap(activity), title, description, TextUtils.isEmpty(transmit) ? EXTRA_INFO : transmit);
        return "";
    }

    private static String shareToQZone(Activity activity, String title, String description, String transmit) {
        ShareApi.getInstance().shareToQZone(getBitMap(activity), title, description,
                TextUtils.isEmpty(transmit) ? EXTRA_INFO : transmit);
        return "";
    }

    private static String showShareView(Activity activity, String title, String description, String transmit) {
        ShareApi.getInstance().share(getBitMap(activity), title, description, TextUtils.isEmpty(transmit) ? EXTRA_INFO : transmit);
        return "";
    }

    private static Bitmap getBitMap(@NonNull  Activity activity) {
        Bitmap bitmap;
//        if (sCacheBitmap != null) {
//            bitmap = sCacheBitmap.get();
//            if (bitmap != null) {
//                return bitmap;
//            }
//        }
        View view = activity.getWindow().getDecorView();
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache();
        Rect rect = new Rect();
        view.getWindowVisibleDisplayFrame(rect);
        int statusBarHeight = rect.top;
        WindowManager windowManager = activity.getWindowManager();
        DisplayMetrics outMetrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(outMetrics);
        int width = outMetrics.widthPixels;
        int height = outMetrics.heightPixels;
        bitmap = Bitmap.createBitmap(view.getDrawingCache(), 0, statusBarHeight, width,
                height - statusBarHeight);
//        sCacheBitmap = new WeakReference<>(bitmap);
        view.destroyDrawingCache();
        view.setDrawingCacheEnabled(false);
        return bitmap;
    }

    /**
     * @return 游戏代币图标的二进制数据
     */
    @NonNull
    public static byte[] getBytes(Activity activity ) {
        return getBytes(activity, R.drawable.sample_yuanbao);
    }
    public static byte[] getBytes(Activity activity,int resId) {
        Bitmap bmp = BitmapFactory.decodeResource(activity.getResources(),resId);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, baos);
        byte[] appResData = baos.toByteArray();//游戏代币图标的二进制数据
        bmp.recycle();
        return appResData;
    }

    public static String buyGoodsFromServer(Activity activity, String input, PayListener payListener) {
        String[] paraArr = input.split(" ");
        if (paraArr.length > 1 && null != paraArr[0]) {
            byte[] appResData = getBytes(activity);
            String ysdkExt = "ysdkExt";
            com.tencent.ysdk.api.YSDKApi.buyGoods(paraArr[0], paraArr[1], appResData, ysdkExt, payListener
            );
        } else {
            RXLogger.e("para is bad:" + input);
        }
        return "";
    }

    private static String buyGoodsFromClient(Activity activity, String input, String midasAppKey, PayListener payListener) {
        String[] paraArr = input.split(" ");
        if (paraArr.length > 0 && null != paraArr[0]) {
            PayItem item = new PayItem();
            item.id = paraArr[1];
            item.name = paraArr[2];
            item.desc = paraArr[3];
            item.price = Integer.parseInt(paraArr[4]);
            item.num = Integer.parseInt(paraArr[5]);
            byte[] appResData = getBytes(activity);
            String ysdkExt = "ysdkExt";
            String midasExt = "midasExt";
            com.tencent.ysdk.api.YSDKApi.buyGoods(false, paraArr[0], item, midasAppKey,
                    appResData, midasExt, ysdkExt, payListener);
        } else {
            RXLogger.e("para is bad:" + input);
        }
        return "";
    }

    private static String getPfAndPfKey() {
        String pf = com.tencent.ysdk.api.YSDKApi.getPf();
        String pfKey = com.tencent.ysdk.api.YSDKApi.getPfKey();
        return "Pf = " + pf + "\n pfKey = " + pfKey;
    }

    /**
     * 防沉迷本地调试能力（本地测试使用）
     * 在需要展现调试界面的Activity的onReusme()里调用YSDKApi.showDebugIcon()
     */
    public static void showDebugIcon(Activity activity) {
        YSDKApi.showDebugIcon(activity);
    }

    /**
     * 请使用YSDKApi.init(false)进行初始化的开发者注意，这个接口不会触发YSDK内部的自动登录接口，
     * 而YSDK的自动登录会校验缓存的token的有效性，并刷新token，然后将结果通过UserListener回调返回给开发者，
     * 因此，为了避免因为token过期导致支付失败等情况，一定要在合适的地方调用YSDKApi.autoLogin()触发自动登录，
     * 而不是仅仅通过YSDKApi.getLoginRecord()来获取登录态。
     */
    public static void autoLogin() {
        YSDKApi.autoLogin();
    }

    public static UserLoginRet getLoginRecord() {
        UserLoginRet ret = new UserLoginRet();
        YSDKApi.getLoginRecord(ret);
        return ret;
    }

    public static ePlatform getPlatform() {
        UserLoginRet ret = getLoginRecord();
        if (ret.flag == eFlag.Succ) {
            return ePlatform.getEnum(ret.platform);
        }
        return ePlatform.None;
    }

    public static void openSensitivePermissionSwitchOpen() {
        RXLogger.i("敏感权限开关已打开");
        com.tencent.ysdk.api.YSDKApi.setSensitivePermissionSwitchStatus(true);
    }

    public static String getChannelId() {
        return com.tencent.ysdk.api.YSDKApi.getChannelId();
    }

    public static String getRegisterChannelId() {
        return com.tencent.ysdk.api.YSDKApi.getRegisterChannelId();
    }

    public static String getSDKVersion() {
        return com.tencent.ysdk.api.YSDKApi.getVersion();
    }

    public static String isPlatformInstall(ePlatform platform) {
        boolean isInstall = com.tencent.ysdk.api.YSDKApi.isPlatformInstalled(platform);
        return String.valueOf(isInstall);
    }

    public static String getPlatformVersion(ePlatform platform) {
        return com.tencent.ysdk.api.YSDKApi.getPlatformAppVersion(platform);
    }

    public static String nativeCrashTest() {
        CrashReport.testNativeCrash();
        return null;
    }

    public static String mathCrashTest() {
        int i = 0;
        int j = 100 / i;
        return null;
    }

    public static String npeExceptionTest() {
        String aa = null;
        boolean isOK = aa.equals("aa");
        return null;
    }

    public  static void queryCertification() {
        YSDKApi.queryCertification(rect -> {
            // 这一段主要是为了展示所有的情况，使用时请开发者根据自己的需要调用相应接口即可
            if (rect.getErrorCode() != 0) {
                // 请求失败，请重试
            } else {
                // 是否已实名认证，未实名认证为0，已实名认证为1
                int realName = rect.isRealName();
                if (realName != 1) {
                    // 未实名，adultType的值没有意义
                    return;
                }
                // 是否已成年，0表示未知，1表示未成年，2表示成年
                int adultType = rect.getAdultType();
                switch (adultType) {
                    case 0:
                        // 未知
                        break;
                    case 1:
                        // 未成年
                        break;
                    case 2:
                        // 已成年
                        break;
                    default:
                        break;
                }
            }
        });
    }
}
