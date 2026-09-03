package com.ruixue.utils;

import java.io.UnsupportedEncodingException;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {
    public static String strip(String str) {
        return strip(str, null);
    }

    // LTR 和 RTL 控制字符
    private static final char LRM = '\u200E'; // Left-to-Right Mark
    private static final char RLM = '\u200F'; // Right-to-Left Mark

    /**
     * 强制将文本以 LTR 方向呈现（适合手机号、金额、ID 等）
     */
    public static String enforceLTR(String content) {
        if (content == null)
            return null;
        return LRM + content;
    }

    /**
     * 强制 RTL 显示（如果需要，如阿拉伯语标签）
     */
    public static String enforceRTL(String content) {
        if (content == null)
            return null;
        return RLM + content;
    }

    /**
     * 自动判断是否需要 LTR 包裹（默认：只要是纯数字/英文/符号混排，就加）
     */
    public static String formatSafe(String content) {
        if (content == null)
            return null;

        if (content.matches("^[\\d\\+\\-\\*#().\\s]+$") || content.matches("^[A-Za-z0-9\\-_@.]+$")) {
            return enforceLTR(content);
        }
        return content;
    }

    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    public static String join(Set<String> str, String splitChar) {
        return join(str.toArray(new String[0]), splitChar);
    }

    public static String join(String[] str, String splitChar) {
        StringBuffer sb = new StringBuffer();
        if (str != null) {
            for (int i = 0; i < str.length; i++) {
                sb.append(str[i]);
                if ((i + 1) != str.length) {
                    sb.append(splitChar);
                }
            }
        }
        return sb.toString();
    }

    public static String strip(String str, String stripChars) {
        if (isEmpty(str)) {
            return str;
        }
        str = stripStart(str, stripChars);
        return stripEnd(str, stripChars);
    }

    public static String stripStart(String str, String stripChars) {
        int strLen;
        if ((str == null) || ((strLen = str.length()) == 0))
            return str;

        int start = 0;
        if (stripChars == null) {
            while ((start != strLen) && (Character.isWhitespace(str.charAt(start))))
                start++;
        }
        if (stripChars.isEmpty()) {
            return str;
        }
        while ((start != strLen) && (stripChars.indexOf(str.charAt(start)) != -1)) {
            start++;
        }

        return str.substring(start);
    }

    public static String stripEnd(String str, String stripChars) {
        int end;
        if ((str == null) || ((end = str.length()) == 0)) {
            return str;
        }

        if (stripChars == null) {
            while ((end != 0) && (Character.isWhitespace(str.charAt(end - 1))))
                end--;
        }
        if (stripChars.isEmpty()) {
            return str;
        }
        while ((end != 0) && (stripChars.indexOf(str.charAt(end - 1)) != -1)) {
            end--;
        }

        return str.substring(0, end);
    }

    /**
     * unicode编码转换为字符的形式
     * @param str
     * @return
     */
    public static String unicodeToString(String str) {
        // XDigit是POSIX字符类，表示十六进制数字，\p{XDigit}等价于[a-fA-F0-9]
        // pattern用于匹配形如\\u6211的字符串
        Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
        Matcher matcher = pattern.matcher(str);
        char ch;
        while (matcher.find()) {
            ch = (char) Integer.parseInt(Objects.requireNonNull(matcher.group(2)), 16);
            str = str.replace(Objects.requireNonNull(matcher.group(1)), ch + "");
        }
        return str;
    }

//    public static String getEncoding(String str) {
//        String encode = "GB2312";
//        try {
//            if (isEncoding(str, encode)) { // 判断是不是GB2312
//                return encode;
//            }
//        } catch (Exception ignored) {
//        }
//        encode = "ISO-8859-1";
//        try {
//            if (isEncoding(str, encode)) { // 判断是不是ISO-8859-1
//                return encode;
//            }
//        } catch (Exception ignored) {
//        }
//        encode = "UTF-8";
//        try {
//            if (isEncoding(str, encode)) { // 判断是不是UTF-8
//                return encode;
//            }
//        } catch (Exception ignored) {
//        }
//        encode = "GBK";
//        try {
//            if (isEncoding(str, encode)) { // 判断是不是GBK
//                return encode;
//            }
//        } catch (Exception ignored) {
//        }
//        return ""; // 如果都不是，说明输入的内容不属于常见的编码格式。
//    }
//
//    public static boolean isEncoding(String str, String encode) {
//        try {
//            if (str.equals(new String(str.getBytes(), encode))) {
//                return true;
//            }
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
//        return false;
//    }

}
