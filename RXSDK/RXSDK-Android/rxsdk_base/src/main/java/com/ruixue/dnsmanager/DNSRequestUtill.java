package com.ruixue.dnsmanager;

import android.text.TextUtils;

import com.ruixue.dnsmanager.bean.DNSResponseBean;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPOutputStream;

public class DNSRequestUtill {

    public static HttpURLConnection createURLConnection(String method, String urlStr, int connectTimeout,
                                                 int readTimeout) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        if ("POST".equals(method) || "PUT".equals(method)) {
            conn.setDoOutput(true);
            conn.setUseCaches(false);// POST方式不能缓存数据
        }
        conn.setConnectTimeout(connectTimeout);
        conn.setReadTimeout(readTimeout);
        return conn;
    }

    public static DNSResponseBean callResult(HttpURLConnection connection, String strData, boolean compress) throws IOException {
        if (!"GET".equals(connection.getRequestMethod()) && null != strData) {
            byte[] bytes = getBytes(strData, compress);
            connection.setFixedLengthStreamingMode(bytes.length);
            try (OutputStream out = connection.getOutputStream(); BufferedOutputStream bout = new BufferedOutputStream(out);) {
                bout.write(bytes);
                bout.flush();
            }
        }

        int responseCode = connection.getResponseCode();

        DNSResponseBean responseBean = new DNSResponseBean();
        if (responseCode >= 300 && responseCode < 400) {
            responseBean.location = connection.getHeaderField("Location");
        }
        responseBean.responseCode = responseCode;
        if (responseCode == HttpURLConnection.HTTP_OK) {
            responseBean.msg = toResponseResult(connection);
        }else {
            responseBean.msg = toErrorResult(connection);

        }
        return responseBean;
    }

    private static byte[] getBytes(String strData, boolean compress) throws IOException {
        if (compress) {
            return compressForGzip(strData);
        } else {
            return strData.getBytes(StandardCharsets.UTF_8);
        }
    }

    /**
     * Gzip 压缩数据
     */
    public static byte[] compressForGzip(String unGzipStr) throws IOException {
        if (TextUtils.isEmpty(unGzipStr)) {
            return new byte[]{};
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();) {
            GZIPOutputStream gzip = new GZIPOutputStream(baos);
            gzip.write(unGzipStr.getBytes());
            gzip.close();
            byte[] encode = baos.toByteArray();
            baos.flush();
            return encode;
        }
    }

    public static String toResponseResult(HttpURLConnection conn) throws IOException {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            return getResponseDataFromStream(in);
        }
    }

    public static String toErrorResult(HttpURLConnection conn) throws IOException {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getErrorStream()))) {
            return getResponseDataFromStream(in);
        }
    }

    private static String getResponseDataFromStream(BufferedReader in) throws IOException {
        String inputLine = "";
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        //System.out.println("The content of response is: " + response);
        return response.toString();
    }

}
