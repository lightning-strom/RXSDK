package com.ruixue.net;

import androidx.annotation.NonNull;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/17
 */
public class RXResponse implements Closeable {

    int code;
    String message;
    BufferedReader body;
    RXRequest request;

    public RXRequest request() {
        return request;
    }

    /**
     * Returns the HTTP status code.
     */
    public int code() {
        return code;
    }

    /**
     * Returns true if the code is in [200..300), which means the request was successfully received,
     * understood, and accepted.
     */
    public boolean isSuccessful() {
        return code >= 200 && code < 300;
    }

    /**
     * Returns the HTTP status message.
     */
    public String message() {
        return message;
    }

    public BufferedReader body() {
        return body;
    }

    @Override
    public void close() throws IOException {
        if (body == null) {
            throw new IOException("response is not eligible for a body and must not be closed");
        }
        body.close();
    }

}
