package com.ruixue.oss.tencent;

import android.util.Base64;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by wangliang on 2024/8/17
 */
public class Utils {
    private static final char[] DIGITS_LOWER;
    private static final char[] DIGITS_UPPER;

    private static Calendar calendar = Calendar.getInstance();

    static {
        calendar.set(2010, 0, 1);
    }

    // 精确到秒
    static long handleTimeAccuracy(long time) {
        return time > calendar.getTime().getTime() ? time / 1000 : time;
    }

    static {
        DIGITS_LOWER = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
        DIGITS_UPPER = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
    }

    public static byte[] decodeHex(String data) {
        return decodeHex(data.toCharArray());
    }

    public static byte[] decodeHex(char[] data) {
        int len = data.length;
        if ((len & 1) != 0) {
            throw new IllegalArgumentException("Odd number of characters.");
        } else {
            byte[] out = new byte[len >> 1];
            int i = 0;

            for (int j = 0; j < len; ++i) {
                int f = toDigit(data[j], j) << 4;
                ++j;
                f |= toDigit(data[j], j);
                ++j;
                out[i] = (byte) (f & 255);
            }

            return out;
        }
    }

    public static char[] encodeHex(byte[] data) {
        return encodeHex(data, true);
    }

    public static char[] encodeHex(byte[] data, boolean toLowerCase) {
        return encodeHex(data, toLowerCase ? DIGITS_LOWER : DIGITS_UPPER);
    }

    public static String encodeHexString(byte[] data) {
        return new String(encodeHex(data));
    }

    public static String encodeHexString(byte[] data, boolean toLowerCase) {
        return new String(encodeHex(data, toLowerCase));
    }

    public static byte[] sha1(String data) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
            return messageDigest.digest(QCloudStringUtils.getBytesUTF8(data));
        } catch (NoSuchAlgorithmException var2) {
            throw new IllegalArgumentException(var2);
        }
    }

    public static byte[] hmacSha1(String source, String secretKey) {
        String HMAC_ALGORITHM = "HmacSHA1";

        byte[] hmacSha1 = null;
        try {
            byte[] byteKey = QCloudStringUtils.getBytesUTF8(secretKey);
            SecretKey hmacKey = new SecretKeySpec(byteKey, HMAC_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(hmacKey);
            hmacSha1 = mac.doFinal(QCloudStringUtils.getBytesUTF8(source));

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        }
        return hmacSha1;
    }

    static char[] encodeHex(byte[] data, char[] toDigits) {
        int l = data.length;
        char[] out = new char[l << 1];
        int i = 0;

        for (int j = 0; i < l; ++i) {
            out[j++] = toDigits[(240 & data[i]) >>> 4];
            out[j++] = toDigits[15 & data[i]];
        }

        return out;
    }

    static int toDigit(char ch, int index) {
        int digit = Character.digit(ch, 16);
        if (digit == -1) {
            throw new IllegalArgumentException("Illegal hexadecimal character " + ch + " at index " + index);
        } else {
            return digit;
        }
    }

    static long[] parseKeyTimes(String keyTime) {
        String[] times = keyTime.split(";");
        long beginTime = Long.parseLong(times[0]);
        long expireTime = Long.parseLong(times[1]);
        return new long[] {
                beginTime, expireTime
        };
    }

    public static String getMD5(byte[] data) {
        try {
            // 创建 MD5 MessageDigest 实例
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 缓冲区大小为 8 KB
            int blockSize = 8192;
            int offset = 0;

            // 分块更新哈希值
            while (offset < data.length) {
                int chunkSize = Math.min(blockSize, data.length - offset);
                md.update(data, offset, chunkSize);
                offset += chunkSize;
            }

            // 计算最终的 MD5 值
            byte[] digest = md.digest();

            // 将字节数组转换为十六进制字符串
            return Base64.encodeToString(digest, Base64.NO_WRAP);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getMD5(String filePath) {
        InputStream is = null;
        try {
            // 创建一个 MessageDigest 实例
            MessageDigest digest = MessageDigest.getInstance("MD5");

            // 打开文件输入流
            File file = new File(filePath);
            is = new FileInputStream(file);

            // 创建一个字节数组，用于逐块读取文件
            byte[] buffer = new byte[8192];
            int bytesRead;

            // 逐块读取文件并更新 MessageDigest
            while ((bytesRead = is.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            // 将字节数组转换为十六进制字符串
            return Base64.encodeToString(digest.digest(), Base64.NO_WRAP);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
