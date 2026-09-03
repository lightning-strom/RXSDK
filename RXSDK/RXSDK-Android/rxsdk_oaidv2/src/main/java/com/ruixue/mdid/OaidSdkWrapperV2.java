package com.ruixue.mdid;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;

import com.bun.miitmdid.core.InfoCode;
import com.bun.miitmdid.core.MdidSdkHelper;
import com.bun.miitmdid.interfaces.IIdentifierListener;
import com.bun.miitmdid.interfaces.IdSupplier;
import com.bun.miitmdid.pojo.IdSupplierImpl;
import com.ruixue.RuiXueSdk;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class OaidSdkWrapperV2 {
    private static final String TAG = "rxsdk";
    private AtomicBoolean isInited = new AtomicBoolean(false);
    protected String OAID = "";


    protected String VAID = "";
    protected String AAID = "";


    protected boolean isSupport = false;
    protected boolean isLimited = false;
    public long startTimeMillis;
    public long endTimeMillis;
    private boolean isCertInit = false;
    private boolean isSupportRequestOAIDPermission = false;

    private boolean isSDKLogOn = false;
    private boolean isArchSupport = false;
    public final static String MSAOAIDSEC = "msaoaidsec";

    private AppOAIDListener oaidListener;

    private ThrowableCatch throwableCatch;

    public interface ThrowableCatch {
        void onThrowable(Throwable throwable);
    }

    public interface AppOAIDListener {
        void onOAIDReply(String oaid);
    }

    public OaidSdkWrapperV2() {
        loadLibrary();
        throwableCatch = throwable -> {
            try {
                Map<String, Object> map = new HashMap<>();
                map.put("msg", throwable.getMessage());
                RuiXueSdk.getRXSdkApi().dataTrack("#oaid_failed", null, map);
            } catch (Exception ignore) {
            }
        };
    }

    public void loadLibrary() {
        String value = "arm";
        try {
            @SuppressLint("PrivateApi") Class<?> clazz = Class.forName("android.os.SystemProperties");
            Method get = clazz.getMethod("get", String.class, String.class);
            value = (String) (get.invoke(clazz, "ro.product.cpu.abi", ""));
            if (value != null && value.contains("x86")) {
                isArchSupport = false;
            } else {
                isArchSupport = true;
                System.loadLibrary(MSAOAIDSEC);
            }
        } catch (Throwable e) {
            e.printStackTrace();
            if (throwableCatch != null) {
                throwableCatch.onThrowable(e);
            }
        }
        if (!isArchSupport) {
            Log.e("rxsdk", "Arch: x86\n");
        } else {
            Log.i("rxsdk", "Arch: " + value);
        }
    }

    public boolean isSupport() {
        return isSupport;
    }

    public String getOAID() {
        return OAID;
    }

    public String getVAID() {
        return VAID;
    }

    public String getAAID() {
        return AAID;
    }

    public boolean isSDKLogOn() {
        return isSDKLogOn;
    }

    public void setSDKLogOn(boolean SDKLogOn) {
        isSDKLogOn = SDKLogOn;
    }

    public void setThrowableCatch(ThrowableCatch throwableCatch) {
        this.throwableCatch = throwableCatch;
    }


    public void setOaidListener(AppOAIDListener oaidListener) {
        this.oaidListener = oaidListener;
    }

    /**
     * @param ctx          应用上下文
     * @param certString   msa官方申请的证书
     * @param oaidListener 获取oaid回调，注意部分机型没有回调，不能使用回调作为关键路径依赖
     */
    public int initOaidSdk(Context ctx, String certString, AppOAIDListener oaidListener) {
        setOaidListener(oaidListener);
        return this.initOaidSdk(ctx, certString);
    }

    /**
     * @param ctx 应用上下文p
     */
    public int initOaidSdk(Context ctx, String certString) {
        if (isInited.get()) {
            Log.i(TAG, "MDID SDK 已经初始化！");
            return 0;
        }
        startTimeMillis = System.nanoTime();
        if (!isCertInit) { // 证书只需初始化一次
            // 证书为PEM文件中的所有文本内容（包括首尾行、换行符）
            try {
                startTimeMillis = System.nanoTime();
                certString = certString.startsWith("-----BEGIN CERTIFICATE-----") ? certString : getStringFromAssetFile(ctx, certString);
                isCertInit = MdidSdkHelper.InitCert(ctx, certString);
            } catch (Error e) {
                e.printStackTrace();
                if (throwableCatch != null) {
                    throwableCatch.onThrowable(e);
                }
            }
            if (!isCertInit) {
                Log.w(TAG, "cert init failed version");
                if (throwableCatch != null) {
                    throwableCatch.onThrowable(new Throwable("cert init failed "));
                }
            }
        }
        int code = -1;
        long time;
        try {
            code = MdidSdkHelper.InitSdk(ctx, isSDKLogOn, listener);
            IdSupplierImpl unsupportedIdSupplier = new IdSupplierImpl();
            if (code == InfoCode.INIT_ERROR_CERT_ERROR) { // 证书未初始化或证书无效，SDK内部不会回调onSupport
                Log.w(TAG, "cert not init or check not pass");
                listener.onSupport(unsupportedIdSupplier);
            } else if (code == InfoCode.INIT_ERROR_DEVICE_NOSUPPORT) { // 不支持的设备, SDK内部不会回调onSupport
                Log.w(TAG, "device not supported");
                listener.onSupport(unsupportedIdSupplier);
            } else if (code == InfoCode.INIT_ERROR_LOAD_CONFIGFILE) { // 加载配置文件出错, SDK内部不会回调onSupport
                Log.w(TAG, "failed to load config file");
                listener.onSupport(unsupportedIdSupplier);
            } else if (code == InfoCode.INIT_ERROR_MANUFACTURER_NOSUPPORT) { // 不支持的设备厂商, SDK内部不会回调onSupport
                Log.w(TAG, "manufacturer not supported");
                listener.onSupport(unsupportedIdSupplier);
            } else if (code == InfoCode.INIT_ERROR_SDK_CALL_ERROR) { // sdk调用出错, SSDK内部不会回调onSupport
                Log.w(TAG, "sdk call error");
                listener.onSupport(unsupportedIdSupplier);
            } else if (code == InfoCode.INIT_INFO_RESULT_DELAY) { // 获取接口是异步的，SDK内部会回调onSupport
                Log.i(TAG, "result delay (async)");
            } else if (code == InfoCode.INIT_INFO_RESULT_OK) { // 获取接口是同步的，SDK内部会回调onSupport
                Log.i(TAG, "result ok (sync)");
            } else {
                // sdk版本高于DemoHelper代码版本可能出现的情况，无法确定是否调用onSupport
                // 不影响成功的OAID获取
                Log.w(TAG, "getDeviceIds: unknown code: " + code);
            }
            isInited.set(true);
        } catch (Exception | Error e) {
            e.printStackTrace();
            if (throwableCatch != null) {
                throwableCatch.onThrowable(e);
            }
            listener.onSupport(new IdSupplierImpl());
            Log.e(TAG, "unsupport get OAID sdk ");
        } finally {
            time = endTimeMillis - startTimeMillis;
            Log.d(TAG, "Time Consume:" + time);
        }
        if (throwableCatch != null && (code != InfoCode.INIT_INFO_RESULT_OK && code != InfoCode.INIT_INFO_RESULT_DELAY)) {
            throwableCatch.onThrowable(new Throwable("init failed code=" + code + ",time=" + time));
        }
        return code;
    }


    IIdentifierListener listener = new IIdentifierListener() {
        @Override
        public void onSupport(IdSupplier idSupplier) {
            if (idSupplier == null) {
                Log.w(TAG, "onSupport: supplier is null");
                if (throwableCatch != null) {
                    throwableCatch.onThrowable(new Throwable("onSupport: supplier is null"));
                }
                return;
            }
            if (isArchSupport || idSupplier.isSupported()) {
                // 获取Id信息
                // 注：IdSupplier中的内容为本次调用MdidSdkHelper.InitSdk()的结果，不会实时更新。
                // 如需更新，需调用MdidSdkHelper.InitSdk()
                isSupport = idSupplier.isSupported();
                isLimited = idSupplier.isLimited();
                OAID = idSupplier.getOAID();
                VAID = idSupplier.getVAID();
                AAID = idSupplier.getAAID();
            } else {
                isSupport = false;
                isLimited = false;
                OAID = null;
                VAID = null;
                AAID = null;
                Log.i(TAG, "unsupport get rxid ");
            }
            isSupportRequestOAIDPermission = idSupplier.isSupportRequestOAIDPermission();
            endTimeMillis = System.nanoTime();
            float timeConsume = (endTimeMillis - startTimeMillis) / 1000000f;
            String idsText = "support: " + (isSupport ? "true" : "false") + ",limit: " + (isLimited ? "true" : "false") + ",Is arch Support: " + (isArchSupport ? "true" : "false") + ",OAID: " + OAID + ",VAID: " + VAID + ",AAID: " + AAID + ",Consume: " + timeConsume + "ms" + ",";
            Log.d(TAG, idsText);
            RuiXueSdk.setOAID(OAID);
            if (oaidListener != null) {
                oaidListener.onOAIDReply(OAID);
            }
        }
    };


//    public static String getCertInfo(String appCertPem) {
//        CertificateFactory fact;
//        InputStream in = new ByteArrayInputStream(appCertPem.getBytes());
//        X509Certificate appCert;
//        try {
//            fact = CertificateFactory.getInstance("X.509");
//            appCert = (X509Certificate) fact.generateCertificate(in);
//        } catch (CertificateException e) {
//            return "[Cert Format Error]";
//        }
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String certInfo = "Cert: \nSubjectName: " + appCert.getSubjectX500Principal().getName() +
//                "\nNot Before: " + sdf.format(appCert.getNotBefore()) +
//                "\nNot After: " + sdf.format(appCert.getNotAfter());
//        try {
//            appCert.checkValidity();
//        } catch (CertificateExpiredException e) {
//            return certInfo + "\n[Expired]";
//        } catch (CertificateNotYetValidException e) {
//            return certInfo + "\n[NotYetValid]";
//        }
//        return certInfo + "\n[Valid]";
//    }

    /**
     * 从asset文件读取证书内容
     * @param context
     * @param assetFileName
     * @return 证书字符串
     */
    public String getStringFromAssetFile(Context context, String assetFileName) {
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