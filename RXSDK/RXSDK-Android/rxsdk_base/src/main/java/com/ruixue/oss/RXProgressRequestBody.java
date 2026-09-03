package com.ruixue.oss;

import androidx.annotation.NonNull;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okio.BufferedSink;

/**
 * Created by wangliang on 2024/8/20
 */
public class RXProgressRequestBody extends RequestBody {
    private static final int SEGMENT_SIZE = 2048; // okio.Segment.SIZE

    private final File file;
    private final byte[] data;
    private final String objectKey;
    private final RXProgressListener listener;
    private boolean isFileUpload = false;

    public RXProgressRequestBody(byte[] data, String objectKey, RXProgressListener listener) {
        this.file = null;
        this.isFileUpload = false;
        this.data = data;
        this.objectKey = objectKey;
        this.listener = listener;
    }

    public RXProgressRequestBody(File file, String objectKey, RXProgressListener listener) {
        this.file = file;
        this.isFileUpload = true;
        this.data = null;
        this.objectKey = objectKey;
        this.listener = listener;
    }

    @Override
    public MediaType contentType() {
        return MediaType.parse("application/octet-stream");
    }

    @Override
    public long contentLength() throws IOException {
        if (isFileUpload) {
            return file == null ? 0 : file.length();
        } else {
            return data == null ? 0 : data.length;
        }
    }

    @Override
    public void writeTo(@NonNull BufferedSink sink) throws IOException {
        long contentLength = contentLength();
        long bytesWritten = 0;

        if (isFileUpload) {
            try (FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[SEGMENT_SIZE];
                int read;
                while ((read = fis.read(buffer)) != -1) {
                    sink.write(buffer, 0, read);
                    bytesWritten += read;
                    if (listener != null) {
                        listener.onProgress(objectKey, bytesWritten, contentLength);
                    }
                }
            }
        } else {
            if (data == null) {
                return;
            }

            int offset = 0;
            while (offset < data.length) {
                int bytesToWrite = Math.min(SEGMENT_SIZE, data.length - offset);
                sink.write(data, offset, bytesToWrite);
                bytesWritten += bytesToWrite;
                offset += bytesToWrite;

                // 通知进度更新
                if (listener != null) {
                    listener.onProgress(objectKey, bytesWritten, contentLength);
                }
            }
        }
    }


}

