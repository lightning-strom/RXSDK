package com.ruixue.oss;

/**
 * Created by wangliang on 2024/8/20
 */
public interface RXProgressListener {

    void onProgress(String objectKey, long bytesWritten, long contentLength);
}
