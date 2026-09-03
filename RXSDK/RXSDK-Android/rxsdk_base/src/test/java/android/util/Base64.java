package android.util;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/13
 */
public class Base64 {

    public static byte[] encode(byte[] input, int flags) {
        return java.util.Base64.getEncoder().encode(input);
    }

    public static byte[] decode(byte[] input, int flags) {
        return java.util.Base64.getDecoder().decode(input);
    }
}
