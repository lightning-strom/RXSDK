package com.ruixue.utils;

import java.nio.charset.Charset;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/11
 */
public class HexUtils {

    private static final char[] DIGITS_UPPER = {'0', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
//    char[] DIGITS_UPPER = "0123456789ABCDEF".toCharArray();

    public static String toHexString(int hex) {
        if (hex >= 0 && hex < DIGITS_UPPER.length)
            return Character.toString(DIGITS_UPPER[hex]);
        else {
            return Integer.toHexString(hex);
        }
    }

    public static String bytes2Hex(byte[] inByte) {
        return bytes2Hex(inByte, null);
    }

    //byte数组转16进制字符串
    public static String bytes2Hex(byte[] inByte, String div) {
        StringBuilder sb = new StringBuilder();
        for (byte b : inByte) {
            String hex = Integer.toHexString(b & 0xff);
            if (hex.length() == 1) {
                sb.append("0");//当16进制为个位数时，在前面补0
            }
            sb.append(hex);//将16进制加入字符串
            if (div != null && !"".equals(div)) {
                sb.append(div);
            }
        }
        return sb.toString();
    }

    //16进制字符串转byte数组
    public static byte[] hex2Bytes(String hexStr) {
        if (hexStr.length() % 2 != 0) {//长度为单数
            hexStr = "0" + hexStr;//前面补0
        }
        char[] chars = hexStr.toCharArray();
        int len = chars.length / 2;
        byte[] byteArray = new byte[len];
        int x;
        for (int i = 0; i < len; i++) {
            x = i * 2;
            byteArray[i] = (byte) Integer.parseUnsignedInt(String.valueOf(new char[]{chars[x], chars[x + 1]}), 16);
        }
        return byteArray;
    }

    public static String string2HexString(String str, Charset charset) {
        StringBuilder sb = new StringBuilder();
        byte[] bs = str.getBytes(charset);
        int bit;
        for (int i = 0; i < bs.length; i++) {
            bit = (bs[i] & 0x0f0) >> 4;
            sb.append(DIGITS_UPPER[bit]);
            bit = bs[i] & 0x0f;
            sb.append(DIGITS_UPPER[bit]);
            // sb.append(' ');
        }
        return sb.toString().trim();
    }

    public static String hex2String(String source, Charset charset) throws Exception {
        source = source.toUpperCase();
        int sourceLen = source.length();
        char[] sourcechars = source.toCharArray();
        String hexDigital = "0123456789ABCDEF";
        byte[] resultBytes = new byte[(sourceLen) / 2];
        //3 循环老的字符串 依次将2位转成1位
        int n;
        for (int i = 0; i < resultBytes.length; i++) {
            n = hexDigital.indexOf(sourcechars[i * 2]) * 16 + hexDigital.indexOf(sourcechars[2 * i + 1]);
            resultBytes[i] = (byte) (n & 0xff);
        }
        return new String(resultBytes, charset);
    }
}
