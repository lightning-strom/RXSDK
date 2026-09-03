package com.ruixue.net;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;

import com.ruixue.callback.RXApiCallback;

import java.io.InputStream;
import java.util.Map;


public class HttpClient {

    public static void requestString(HttpMethod method, @NonNull String apiPath, String body, Map<String, String> extHeaders, RXApiCallback callback) {
        new RXHttpClient.Builder().build().requestString(method, apiPath, body, extHeaders, callback);
    }

    public static InputStream getInputStream(String urlStr) {
        return new RXHttpClient.Builder().build().getInputStream(urlStr);

    }

    public static String get(String urlStr) {
        return new RXHttpClient.Builder().build().get(urlStr);

    }

    public static Bitmap getRemoteBitmap(String urlStr) {
        return new RXHttpClient.Builder().build().getRemoteBitmap(urlStr);
    }

}