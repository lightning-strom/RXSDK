package com.ruixue.net;

import android.net.Uri;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class URLHelper {

    public static String urlEncode(String param) {
        try {
            if (param == null || param.isEmpty()) {
                return param;
            }
            return URLEncoder.encode(param, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return param;
        }
    }

    public static String urlDecode(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        try {
            return URLDecoder.decode(input, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException e) {
            // 理论上不会触发，因为 UTF-8 是标准编码
            e.printStackTrace();
            return input;
        } catch (IllegalArgumentException e) {
            // 如果 input 不是合法的 URL 编码（比如有非法的 % 符号）
            e.printStackTrace();
            return input;
        }
    }

    public static String buildQuery(Map<String, Object> data) {
        if (null != data && data.size() > 0) {
            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                query.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
            return query.substring(0, query.length() - 1);
        }
        return "";
    }

    public static JSONObject queryToJSONObject(String paramStr) {
        // String paramStr = "a=a1&b=b1&c=c1";
        String[] params = paramStr.split("&");
        JSONObject obj = new JSONObject();
        for (String s : params) {
            String[] param = s.split("=");
            if (param.length >= 2) {
                String key = param[0];
                StringBuilder value = new StringBuilder(param[1]);
                for (int j = 2; j < param.length; j++) {
                    value.append("=").append(param[j]);
                }
                try {
                    obj.put(key, value.toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return obj;
    }

    public static String getQuery(String url) {
        Uri uri = Uri.parse(url);
        return uri.getQuery();
    }


    public static String paramJson(String paramIn) {
        paramIn = paramIn.replaceAll("=", "\":\"");
        paramIn = paramIn.replaceAll("&", "\",\"");
        return "{\"" + paramIn + "\"}";
    }

    public static String getSeparator(String url) {
        int q = url.lastIndexOf('?');
        if (q != -1) {
            return "&";
        } else {
            return "?";
        }
    }
}
