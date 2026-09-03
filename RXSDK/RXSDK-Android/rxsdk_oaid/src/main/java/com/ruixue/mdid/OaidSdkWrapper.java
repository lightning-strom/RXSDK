package com.ruixue.mdid;

import android.content.Context;
import android.util.Log;

import com.bun.miitmdid.core.ErrorCode;
import com.bun.miitmdid.core.MdidSdkHelper;
import com.bun.miitmdid.interfaces.IIdentifierListener;
import com.bun.miitmdid.interfaces.IdSupplier;
import com.ruixue.RuiXueSdk;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public final class OaidSdkWrapper {
    private static String TAG = "OaidSdkWrapper";
    private boolean isInited = false;
    private String OAID = "";
    private String VAID = "";
    private String AAID = "";
    private boolean isSupported = false;

    public boolean isSDKLogOn() {
        return isSDKLogOn;
    }

    public void setSDKLogOn(boolean SDKLogOn) {
        isSDKLogOn = SDKLogOn;
    }

    private ThrowableCatch throwableCatch;

    public interface ThrowableCatch {
        void onThrowable(Throwable throwable);
    }

    public void setThrowableCatch(ThrowableCatch throwableCatch) {
        this.throwableCatch = throwableCatch;
    }

    boolean isSDKLogOn;

    private static class Single {
        static OaidSdkWrapper sInstance = new OaidSdkWrapper();
    }

    //单例禁止外部构造
    private OaidSdkWrapper() {
    }

    public static OaidSdkWrapper getInstance() {
        return Single.sInstance;
    }

    public static int initOaidSdk(Context ctx, boolean isSDKLogOn) {
        getInstance().setSDKLogOn(isSDKLogOn);
        return getInstance().initOaidSdk(ctx);
    }

    public static int getVersion() {
        return 1;
    }

    /**
     * @param ctx 应用上下文
     */
    public int initOaidSdk(Context ctx) {
        if (isInited) {
            Log.i(TAG, "MDID SDK 已经初始化！");
            return 0;
        }
        isInited = true;

        try {
            int nres = MdidSdkHelper.InitSdk(ctx, isSDKLogOn, new IIdentifierListener() {
                @Override
                public void OnSupport(boolean isSupport, IdSupplier idSupplier) {
                    if (idSupplier == null) {
                        return;
                    }
                    isSupported = isSupport;
                    if (isSupport) {
                        OAID = idSupplier.getOAID();
                        VAID = idSupplier.getVAID();
                        AAID = idSupplier.getAAID();
                        Log.i(TAG, "rxid = " + OAID);
                        RuiXueSdk.setOAID(OAID);
                    } else {
                        Log.i(TAG, "unsupport get rxid ");
                    }
                }
            });

            if (nres == ErrorCode.INIT_ERROR_DEVICE_NOSUPPORT) {//1008612 不支持的设备
                Log.i(TAG, "MDID SDK 初始化 1008612 不支持的设备: " + String.valueOf(nres));
            } else if (nres == ErrorCode.INIT_ERROR_LOAD_CONFIGFILE) {//1008613 加载配置文件出错
                Log.i(TAG, "MDID SDK 初始化 1008613 加载配置文件出错: " + String.valueOf(nres));
            } else if (nres == ErrorCode.INIT_ERROR_MANUFACTURER_NOSUPPORT) {//1008611 不支持的设备厂商
                Log.i(TAG, "MDID SDK 初始化 1008611 不支持的设备厂商: " + String.valueOf(nres));
            } else if (nres == ErrorCode.INIT_ERROR_RESULT_DELAY) {//1008614 获取接口是异步的，结果会在回调中返回，回调执行的回调可能在工作线程
                Log.i(TAG, "MDID SDK 初始化 1008614 获取接口是异步的，结果会在回调中返回，回调执行的回调可能在工作线程: " + String.valueOf(nres));
            } else if (nres == ErrorCode.INIT_HELPER_CALL_ERROR) {//1008615 反射调用出错
                Log.i(TAG, "MDID SDK 初始化 1008615 反射调用出错: " + String.valueOf(nres));
            } else {
                Log.i(TAG, "MDID SDK 初始化成功：" + String.valueOf(nres));
            }
            if (throwableCatch != null && (nres != ErrorCode.INIT_ERROR_BEGIN && nres != ErrorCode.INIT_ERROR_RESULT_DELAY)) {
                throwableCatch.onThrowable(new Throwable("init failed code:" + nres));
            }
            return nres;
        } catch (Exception e) {
            e.printStackTrace();
            if (throwableCatch != null) {
                throwableCatch.onThrowable(e);
            }
            Log.e(TAG, "unsupport get OAID");
        }
        return -1;
    }

    public static boolean isSupport() {
        return getInstance().isSupported;
    }

    public static String getOAID() {
//        Log.i(TAG, "get OAID = " + OAID);
        return getInstance().OAID;
    }

    public static String getVAID() {
        return getInstance().VAID;
    }

    public static String getAAID() {
        return getInstance().AAID;
    }

    /**
     * 从asset文件读取证书内容
     * @param context
     * @param assetFileName
     * @return 证书字符串
     */
    public static String loadPemFromAssetFile(Context context, String assetFileName) {
        try {
            InputStream is = context.getAssets().open(assetFileName);
            BufferedReader in = new BufferedReader(new InputStreamReader(is));
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                builder.append(line);
                builder.append('\n');
            }
            return builder.toString();
        } catch (IOException e) {
            Log.e(TAG, "loadPemFromAssetFile failed");
            return "";
        }
    }
}