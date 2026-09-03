package com.ruixue.internal;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Build.VERSION;
import android.os.LocaleList;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.ruixue.RuiXueSdk;
import com.ruixue.core.rxid.compat.Oaid;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.MacUtil;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

public final class DeviceUtils {

    public static void init(Context context) {
        DeviceInfoCache.getInstance(context).load(context);
    }

    public static String getGAID(Context context) {
        return DeviceInfoCache.getInstance(context).getGaid();
    }

    public static void setGAID(Context context, String gaid) {
        DeviceInfoCache.getInstance(context).setGaid(gaid);
    }


    public static String getDistinctId(Context context) {
        return DeviceInfoCache.getInstance(context).getDistinctId();
    }

    public static String getDistinctIdPer(Context context) {
        return DeviceInfoCache.getInstance(context).getDistinctIdPer();
    }


    public static void removeDistinctId(Context context) {
        DeviceInfoCache.getInstance(context).removeDistinctId();
    }

    public static String getDeviceId(Context context) {
        DeviceInfoCache deviceInfoCache = DeviceInfoCache.getInstance(context);
        String deviceId = deviceInfoCache.getDeviceId();
        if (RuiXueSdk.isFullyInitialized() && TextUtils.isEmpty(deviceId) && RXGlobalData.readSensitiveInfoEnabled()) {
            deviceId = generateDeviceGUID(context);
            deviceInfoCache.setDeviceId(deviceId);
        }
        return deviceId == null ? "" : deviceId;
    }

    public static String setDeviceId(Context context, String deviceId, boolean replace) {
        DeviceInfoCache deviceInfoCache = DeviceInfoCache.getInstance(context);
        String deviceIdCache = deviceInfoCache.getDeviceId();
        if (TextUtils.isEmpty(deviceIdCache) || replace) {
            deviceInfoCache.setDeviceId(Objects.requireNonNull(deviceId));
            return deviceId;
        } else {
            return deviceIdCache;
        }
    }

    public static void setOAID(Context context, String oaid) {
        DeviceInfoCache.getInstance(context).setOAID(oaid);
    }

    public static String getOAID(Context context) {
        return DeviceInfoCache.getInstance(context).getOAID(context);
    }

    public static String getOAIDAsync(Context context, Oaid.IIdentifierCallback callback) {
        return DeviceInfoCache.getInstance(context).getOAIDAsync(context, callback);
    }

    /**
     * 生成设备 guid 因不同系统限制问题每次生成结果可能不同需要缓存
     * @param context 上下文
     * @return 设备硬件标识
     */
    public static String generateDeviceGUID(Context context) {
        StringBuilder sbDeviceId = new StringBuilder();
        //获得设备默认IMEI（>=6.0 需要ReadPhoneState权限）
        String imei = getIMEI(context);
        //追加imei
        if (imei != null && imei.length() > 0) {
            sbDeviceId.append(imei);
            sbDeviceId.append("|");
        }
        //获得设备序列号（>=8.0 需要ReadPhoneState权限）
        String serial = getSERIAL(context);
        //追加serial
        if (serial != null && serial.length() > 0) {
            sbDeviceId.append(serial);
            sbDeviceId.append("|");
        }

        //获得AndroidId（无需权限）
        String androidid = getAndroidId(context);

        //获得硬件uuid（根据硬件相关属性，生成uuid）（无需权限）
        String uuid = getDeviceUUID().replace("-", "");
        //追加androidid
        if (androidid != null && androidid.length() > 0) {
            sbDeviceId.append(androidid);
            sbDeviceId.append("|");
        }

        String oaid = getOAID(context);
        if (!TextUtils.isEmpty(oaid)) {
            sbDeviceId.append(oaid);
            sbDeviceId.append("|");
        }

        //追加硬件uuid
        if (uuid.length() > 0) {
            sbDeviceId.append(uuid);
        }

        //生成SHA1，统一DeviceId长度
        if (sbDeviceId.length() > 0) {
            try {
                if ((TextUtils.isEmpty(androidid) && TextUtils.isEmpty(oaid) && TextUtils.isEmpty(imei)) || !RXGlobalData.readSensitiveInfoEnabled()) {
                    sbDeviceId.append(generateDeviceGUIDV4());
                }
                String hashStr = getMd5String(sbDeviceId.toString());
                if (hashStr.length() > 0) {
                    //返回最终的DeviceId
                    return hashStr;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        //如果以上硬件标识数据均无法获得，
        //则DeviceId默认使用系统随机数，这样保证DeviceId不为空
        return generateDeviceGUIDV4();
    }

    public static String generateDeviceGUIDV4() {
        return UUID.randomUUID().toString().replace("-", "").toUpperCase();
    }


    /**
     * 获得设备的AndroidId
     * @param context 上下文
     * @return 设备的AndroidId
     */
    public static String getAndroidId(Context context) {
        try {
            if (RXGlobalData.readSensitiveInfoEnabled()) {
                @SuppressLint("HardwareIds") String androidId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
//            if ("9774d56d682e549c".equals(androidId)) {
//                androidId = UUID.randomUUID().toString();
//            }
                return androidId;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }

    /**
     * 获得设备序列号（如：WTK7N16923005607）, 个别设备无法获取
     * 8.0及以上系统需要权限
     * @return 设备序列号
     */
    @SuppressLint({"HardwareIds", "MissingPermission"})
    private static String getSERIAL(Context context) {
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            try {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                    return Build.SERIAL;
                } else {
                    if (checkReadPhoneState(context)) {
                        return Build.getSerial();
                    } else {
                        return "";
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return "";
    }

    private static boolean checkReadPhoneState(Context context) {
        return ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * 获得设备硬件uuid
     * 使用硬件信息，计算出一个随机数
     * @return 设备硬件uuid
     */
    @SuppressLint("HardwareIds")
    private static String getDeviceUUID() {
        try {
            String dev = "35" + Build.BOARD.length() % 10 + Build.BRAND.length() % 10 + Build.SUPPORTED_ABIS[0].length() % 10 + Build.DEVICE.length() % 10 + Build.DISPLAY.length() % 10 + Build.HOST.length() % 10 + Build.ID.length() % 10 + Build.MANUFACTURER.length() % 10 + Build.MODEL.length() % 10 + Build.PRODUCT.length() % 10 + Build.TAGS.length() % 10 + Build.TYPE.length() % 10 + Build.USER.length() % 10;
            return new UUID(dev.hashCode(), Build.SERIAL.hashCode()).toString();
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }

    /**
     * 获取系统的locale
     * Android 7.0 开始，系统语言支持多个，可手动排序，系统根据 App 本身支持的语言和手机出厂设置的语言等因素来调整 App 本身的默认语言
     * @return Locale对象
     */
    public static Locale getSystemLocale(Context context) {
        Locale locale;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            locale = LocaleList.getDefault().get(0);
        } else {
            locale = Locale.getDefault();
        }
        return locale;
    }

    //需要获得READ_PHONE_STATE权限，>=6.0，默认返回null
    @SuppressLint({"HardwareIds", "MissingPermission"})
    public static String getIMEI(Context context) {
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            //Android 6.0 以后需要获取动态权限  检查权限
            if (VERSION.SDK_INT >= Build.VERSION_CODES.M && ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                Log.i(RuiXueSdk.TAG, "getIMEI failed no granted READ_PHONE_STATE permission");
                return "";
            }
            try {
                TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
                if (null != tm) {
                    return tm.getDeviceId();
                }
            } catch (Exception ex) {
                Log.i(RuiXueSdk.TAG, "getIMEI failed  " + ex.getMessage());
            }
        }
        return "";
    }

    public static String getIPAddress(boolean useIPv4) {
        return MacUtil.getIPAddress(useIPv4);
    }

    public static String getMacAddress(Context context) {
        return MacUtil.getMacAddress(context);
    }


    public static String getSha1String(String data) {
        byte[] hash = getHashByString(data, "SHA1");
        return bytesToHex(hash);
    }

    public static String getMd5String(String data) {
        byte[] hash = getHashByString(data, "MD5");
        return bytesToHex(hash);
    }

    /**
     * 取SHA1
     * @param data 数据
     * @param type MD5 Or SHA1
     * @return 对应的hash值
     */
    private static byte[] getHashByString(String data, String type) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance(type);
            messageDigest.reset();
            messageDigest.update(data.getBytes(StandardCharsets.UTF_8));
            return messageDigest.digest();
        } catch (Exception e) {
            return "".getBytes();
        }
    }

    /**
     * 转16进制字符串
     * @param data 数据
     * @return 16进制字符串bytesToHex
     */
    private static String bytesToHex(byte[] data) {
        StringBuilder sb = new StringBuilder();
        String stmp;
        for (byte datum : data) {
            stmp = (Integer.toHexString(datum & 0xFF));
            if (stmp.length() == 1)
                sb.append("0");
            sb.append(stmp);
        }
        return sb.toString().toUpperCase(Locale.getDefault());
    }
}
