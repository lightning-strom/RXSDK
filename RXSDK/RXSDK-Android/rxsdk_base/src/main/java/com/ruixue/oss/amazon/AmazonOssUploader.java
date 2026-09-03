package com.ruixue.oss.amazon;

import android.annotation.SuppressLint;
import android.text.TextUtils;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.oss.OSSConfig;
import com.ruixue.oss.RXProgressListener;
import com.ruixue.oss.RXProgressRequestBody;
import com.ruixue.oss.amazon.auth.AWS4SignerBase;
import com.ruixue.oss.amazon.auth.AWS4SignerForAuthorizationHeader;
import com.ruixue.oss.amazon.util.BinaryUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by wangliang on 2024/8/20
 */
public class AmazonOssUploader {

    private int socketTimeout = 10 * 60 * 1000;
    private int connectionTimeout = 60 * 1000;

    private final OSSConfig config;

    public AmazonOssUploader(OSSConfig config) {
        this.config = config;
    }

    /**
     * 亚马逊 OSS 上传文件方法
     *
     * @param data           字节数组上传数据，非 filePath 方式上传才有意义
     * @param uploadFilePath 如果非空，则为 filePath 方式上传
     * @param cosPath        腾讯云 OSS 远端 key
     * @param callback       瑞雪回调
     */
    public void upload(byte[] data, String uploadFilePath, String cosPath, RXJSONCallback callback, RXProgressListener listener) {
        if (config.getCredentials() == null) {
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "amazon oss config credentials is null"));
            return;
        }

        boolean isFilePathUpload = !TextUtils.isEmpty(uploadFilePath);
        if (isFilePathUpload) {
            File file = new File(uploadFilePath);
            if (!file.exists()) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "amazon oss upload filepath not exist : " + uploadFilePath));
                return;
            }
            RXLogger.d("filepath upload to amazon oss, filepath:" + uploadFilePath + ", cosPath:" + cosPath);
            byte[] contentHash = AWS4SignerBase.hashFilePath(uploadFilePath);
            if (contentHash == null) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "amazon oss upload filepath data error : " + uploadFilePath));
                return;
            }
            String contentHashString = BinaryUtils.toHex(contentHash);
            RequestBody requestBody = new RXProgressRequestBody(file, cosPath, listener);
            upload(file.length(), contentHashString, requestBody, cosPath, callback);
        } else {
            if (data == null || data.length == 0) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "amazon oss upload bytes null"));
                return;
            }

            RXLogger.d("bytes upload to amazon oss, cosPath:" + cosPath);
            byte[] contentHash = AWS4SignerBase.hash(data);
            String contentHashString = BinaryUtils.toHex(contentHash);
            RequestBody requestBody = new RXProgressRequestBody(data, cosPath, listener);
            upload(data.length, contentHashString, requestBody, cosPath, callback);
        }
    }

    private void upload(long contentLength, String contentMD5, RequestBody requestBody, String cosPath, RXJSONCallback callback) {
        try {
            String urlString = config.getDomain() + "/" + cosPath;
            URL url = new URL(urlString);

            // precompute hash of the body content
            Map<String, String> headers = new HashMap<>();
            headers.put("x-amz-content-sha256", contentMD5);
            headers.put("content-length", Long.toString(contentLength));
            headers.put("content-type", "application/octet-stream");
            headers.put("x-amz-security-token", config.getCredentials().getSecurityToken());

            AWS4SignerForAuthorizationHeader signer = new AWS4SignerForAuthorizationHeader(url, "PUT", "s3", config.getRegion());
            String authorization = signer.computeSignature(
                    headers,
                    null,// no query parameters
                    contentMD5,
                    config.getCredentials().getAccessKeyId(),
                    config.getCredentials().getAccessKeySecret());

            // express authorization for this as a header
            headers.put("Authorization", authorization);

            Request.Builder requestBuilder = new Request.Builder()
                    .url(url)
                    .put(requestBody);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                requestBuilder.addHeader(entry.getKey(), entry.getValue());
            }

            OkHttpClient client = getOkHttpClient(urlString.startsWith("https"));
            client.newCall(requestBuilder.build()).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    RXLogger.i("AmazonOssUploader upload exception " + e.getMessage());
                    ThreadUtils.getMainLooperHandler().post(() -> {
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN, e.getMessage()));
                        }
                    });
                }

                @Override
                public void onResponse(Call call, Response response) {
                    if (response.isSuccessful()) {
                        ThreadUtils.getMainLooperHandler().post(() -> {
                            if (callback != null) {
                                callback.onSuccess(null);
                            }
                        });
                    } else {
                        ThreadUtils.getMainLooperHandler().post(() -> {
                            RXLogger.i("AmazonOssUploader upload failed code:" + response.code() + ", message:" + response.message());
                            if (callback != null) {
                                callback.onFailed(JSONUtil.toJSONObject(response.code(), response.message()));
                            }
                        });
                    }
                }
            });
        } catch (Throwable e) {
            ThreadUtils.getMainLooperHandler().post(() -> {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN, e.getMessage()));
                }
            });
        }
    }

    @SuppressLint("CustomX509TrustManager")
    private OkHttpClient getOkHttpClient(boolean isHttps) throws Exception {
        if (!isHttps) {
            return new OkHttpClient.Builder().connectTimeout(connectionTimeout, TimeUnit.MILLISECONDS)
                    .readTimeout(socketTimeout, TimeUnit.MILLISECONDS)
                    .writeTimeout(socketTimeout, TimeUnit.MILLISECONDS).build();
        }

        // 创建一个信任所有证书的 TrustManager
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {

                    @SuppressLint("TrustAllX509TrustManager")
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {

                    }

                    @SuppressLint("TrustAllX509TrustManager")
                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {

                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                }
        };

        // 安装信任所有证书的 TrustManager
        final SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

        // 创建一个不验证主机名的 HostnameVerifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };

        return new OkHttpClient.Builder()
                .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustAllCerts[0])
                .hostnameVerifier(allHostsValid)
                .connectTimeout(connectionTimeout, TimeUnit.MILLISECONDS)
                .readTimeout(socketTimeout, TimeUnit.MILLISECONDS)
                .writeTimeout(socketTimeout, TimeUnit.MILLISECONDS)
                .build();
    }
}
