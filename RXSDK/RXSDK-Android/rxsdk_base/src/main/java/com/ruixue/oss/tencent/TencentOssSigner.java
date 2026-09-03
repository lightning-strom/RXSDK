package com.ruixue.oss.tencent;

import android.text.TextUtils;

import com.ruixue.oss.OSSConfig;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Created by wangliang on 2024/8/20
 */
public class TencentOssSigner {

    public static String generateSignature(Map<String, String> headers, Set<String> signHeaders, OSSConfig.CredentialsBean credentials, URL url) {
        String keyTime = credentials.getStartUnixTime() + ";" + credentials.getExpirationUnixTime();
        StringBuilder authorization = new StringBuilder();

        Map<String, List<String>> map = new HashMap<>();
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            List<String> values = new ArrayList<>();
            values.add(entry.getValue());
            map.put(entry.getKey(), values);
        }

        String source = source(map, signHeaders, url, keyTime);
        // 签名算法
        String signature = signature(source, getSignKey(credentials.getAccessKeySecret(), keyTime));

        authorization.append(AuthConstants.Q_SIGN_ALGORITHM).append("=").append(AuthConstants.SHA1).append("&")
                .append(AuthConstants.Q_AK).append("=")
                .append(credentials.getAccessKeyId()).append("&")
                .append(AuthConstants.Q_SIGN_TIME).append("=")
                .append(keyTime).append("&")
                .append(AuthConstants.Q_KEY_TIME).append("=")
                .append(keyTime).append("&")
                .append(AuthConstants.Q_HEADER_LIST).append("=")
                .append(getRealHeaderList(signHeaders).toLowerCase(Locale.ROOT)).append("&")
                .append(AuthConstants.Q_URL_PARAM_LIST).append("=")
                .append("").append("&")
                .append(AuthConstants.Q_SIGNATURE).append("=").append(signature);

        return authorization.toString();
    }

    private static String source(Map<String, List<String>> headers, Set<String> signHeaders, URL url, String keyTime) {
        // 添加method
        StringBuilder formatString = new StringBuilder("put");
        formatString.append("\n");

        // 添加path
        String path = QCloudStringUtils.urlDecodeString(url.getPath());
        formatString.append(path);
        formatString.append("\n");

        // 添加parameters
        formatString.append("");
        formatString.append("\n");


        // 添加header，得到最终的formatString
        String headerString = "";
        if (headers != null) {
            headerString = headersStringForKeys(headers, signHeaders);
        }
        formatString.append(headerString);
        formatString.append("\n");

        StringBuilder stringToSign = new StringBuilder();

        // 追加 q-sign-algorithm
        stringToSign.append(AuthConstants.SHA1);
        stringToSign.append("\n");

        // 追加q-sign-time
        stringToSign.append(keyTime);
        stringToSign.append("\n");

        // 追加 sha1Hash(formatString)
        String formatStringSha1 = Utils.encodeHexString(Utils.sha1(formatString.toString()));
        stringToSign.append(formatStringSha1);
        stringToSign.append("\n");
        return stringToSign.toString();
    }

    private static String getSignKey(String secretKey, String keyTime) {
        byte[] hmacSha1 = (Utils.hmacSha1(keyTime, secretKey));
        if (hmacSha1 != null) {
            return new String(Utils.encodeHex(hmacSha1)); // 用secretKey来加密keyTime
        }
        return null;
    }

    private static String getRealHeaderList(Set<String> signHeaders) {
        return sortAndJoinSemicolon(signHeaders);
    }

    private static String sortAndJoinSemicolon(Set<String> values) {
        if (values == null) {
            return "";
        }

        // 这里也需要先按字典顺序进行排序
        Set<String> set = new TreeSet<>(values);

        StringBuilder str = new StringBuilder();
        for (String value : set) {
            if (!QCloudStringUtils.isEmpty(str.toString())) {
                str.append(";");
            }
            str.append(value);
        }

        return str.toString();
    }

    private static String headersStringForKeys(Map<String, List<String>> headers, Set<String> keys) {
        StringBuilder out = new StringBuilder();
        boolean isFirst = true;

        // 1、将所有的key值进行 url 编码，然后转化为小写，并进行排序
        List<String> orderKeys = new LinkedList<>();
        for (String key : keys) {
            String urlEncodeString = QCloudStringUtils.urlEncodeString(key);
            if (urlEncodeString != null) {
                orderKeys.add(urlEncodeString.toLowerCase(Locale.ROOT));
            }
        }
        Collections.sort(orderKeys, new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        });

        // 2、获得headers所有的name，并进行小写映射
        Set<String> headerNames = headers.keySet();
        Map<String, String> maps = new HashMap<>();
        for (String name : headerNames) {
            maps.put(name.toLowerCase(Locale.ROOT), name);
        }

        // 3、取出需要的参数
        for (String key : orderKeys) {
            List<String> values = headers.get(maps.get(key));
            if (values != null) {
                for (String value : values) {
                    if (!isFirst) {
                        out.append('&');
                    }
                    isFirst = false;
                    out.append(key.toLowerCase(Locale.ROOT)).append('=');
                    if (!TextUtils.isEmpty(value)) {
                        out.append(QCloudStringUtils.urlEncodeString(value));
                    }
                }
            }
        }

        return out.toString();
    }

    private static String signature(String source, String signKey) {
        byte[] sha1Bytes = Utils.hmacSha1(source, signKey);
        String signature = "";
        if (sha1Bytes != null) {
            signature = new String(Utils.encodeHex(sha1Bytes));
        }
        return signature;
    }
}
