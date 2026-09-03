package com.ruixue.oss.tencent;

import android.text.TextUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;

/**
 * Created by bradyxiao on 2017/7/21.
 * author bradyxiao
 */
public class QCloudStringUtils {
    public static boolean isEmpty(CharSequence str) {
        return str == null || str.length() == 0;
    }

    public static boolean equals(CharSequence cs1, CharSequence cs2) {
        return cs1 == cs2 ||
                ((cs1 != null && cs2 != null) &&
                        (cs1 instanceof String && cs2 instanceof String ?
                                cs1.equals(cs2) : regionMatches(cs1, false, 0, cs2,
                                0, Math.max(cs1.length(), cs2.length()))));
    }

    public static byte[] getBytesUTF8(String string) {
        return string.getBytes(Charset.forName("UTF-8"));
    }

    public static String newStringUTF8(byte[] bytes) {
        return new String(bytes, Charset.forName("UTF-8"));
    }

    /**
     *
     * @param name
     * @return
     */
    public static String getExtension(String name) {

        if (name == null) {
            return null;
        }
        int index = name.lastIndexOf(".");
        if (index >= 0) {
            return name.substring(index + 1);
        } else {
            return null;
        }
    }

    static boolean regionMatches(CharSequence cs, boolean ignoreCase, int thisStart,
                                 CharSequence substring, int start, int length) {
        if (cs instanceof String && substring instanceof String) {
            return ((String) cs).regionMatches(ignoreCase, thisStart, (String) substring, start, length);
        } else {
            int index1 = thisStart;
            int index2 = start;
            int tmpLen = length;

            while (tmpLen-- > 0) {
                char c1 = cs.charAt(index1++);
                char c2 = substring.charAt(index2++);
                if (c1 != c2) {
                    if (!ignoreCase) {
                        return false;
                    }

                    if (Character.toUpperCase(c1) != Character.toUpperCase(c2) &&
                            Character.toLowerCase(c1) != Character.toLowerCase(c2)) {
                        return false;
                    }
                }
            }

            return true;
        }
    }

    public static String urlDecodeString(String source) {
        try {
            return URLDecoder.decode(source, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static String urlEncodeString(String source) {
        try {
            if(TextUtils.isEmpty(source))return source;
            StringBuilder encoded = new StringBuilder();
            String[] spaceSegments = source.split(" ", -1);
            for(int i = 0, size = spaceSegments.length; i < size;  i++){
                if(i == 0 && "".equals(spaceSegments[i])){
                    encoded.append("%20");
                    continue;
                }
                if(size > 1 && i == size -1 && "".equals(spaceSegments[i])){
                    break;
                }
                // URLEncoder默认会对~进行编码， 但是cos后台不需要
                encoded.append(URLEncoder.encode(spaceSegments[i], "UTF-8").replace("%7E", "~"));
                if(i != size -1)encoded.append("%20");
            }
            // cos 后台需要对 * 做转义，而标准的 Java encode 不需要
            return encoded.toString().replaceAll("\\*", "%2A");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return null;
    }
}
