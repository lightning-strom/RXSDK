package com.ruixue.oss.amazon.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by wangliang on 2024/8/26
 */
public class HttpUtils {
    public static String urlEncode(String url, boolean keepPathSlash) {
        String encoded;
        try {
            encoded = URLEncoder.encode(url, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("UTF-8 encoding is not supported.", e);
        }
        if (keepPathSlash) {
            encoded = encoded.replace("%2F", "/");
        }
        return encoded;
    }
}
