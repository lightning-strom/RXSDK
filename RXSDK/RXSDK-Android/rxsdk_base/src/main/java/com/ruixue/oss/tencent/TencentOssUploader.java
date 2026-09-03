package com.ruixue.oss.tencent;

import static com.ruixue.oss.tencent.HttpConstants.Header.AUTHORIZATION;
import static com.ruixue.oss.tencent.HttpConstants.Header.CONTENT_LENGTH;
import static com.ruixue.oss.tencent.HttpConstants.Header.CONTENT_MD5;
import static com.ruixue.oss.tencent.HttpConstants.Header.CONTENT_TYPE;
import static com.ruixue.oss.tencent.HttpConstants.Header.HOST;
import static com.ruixue.oss.tencent.HttpConstants.Header.USER_AGENT;
import static com.ruixue.oss.tencent.HttpConstants.Header.X_COS_SECURITY_TOKEN;

import android.annotation.SuppressLint;
import android.text.TextUtils;

import androidx.collection.ArrayMap;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.BuildConfig;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.oss.OSSConfig;
import com.ruixue.oss.RXProgressListener;
import com.ruixue.oss.RXProgressRequestBody;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
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
 * Created by wangliang on 2024/8/17
 */
public class TencentOssUploader {

    private int socketTimeout = 10 * 60 * 1000;
    private int connectionTimeout = 60 * 1000;

    private final OSSConfig config;

    public TencentOssUploader(OSSConfig config) {
        this.config = config;
    }

    /**
     * 腾讯云 OSS 上传文件方法
     *
     * @param data           字节数组上传数据，非 filePath 方式上传才有意义
     * @param uploadFilePath 如果非空，则为 filePath 方式上传
     * @param cosPath        腾讯云 OSS 远端 key
     * @param callback       瑞雪回调
     */
    public void upload(byte[] data, String uploadFilePath, String cosPath, RXJSONCallback callback, RXProgressListener listener) {
        if (config.getCredentials() == null) {
            if (callback != null)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "tencent oss config credentials is null"));
            return;
        }

        boolean isFilePathUpload = !TextUtils.isEmpty(uploadFilePath);
        if (isFilePathUpload) {
            File file = new File(uploadFilePath);
            if (!file.exists()) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "tencent oss upload filepath not exist : " + uploadFilePath));
                return;
            }
            RXLogger.d("filepath upload to tencent oss, filepath:" + uploadFilePath + ", cosPath:" + cosPath);
            RequestBody requestBody = new RXProgressRequestBody(file, cosPath, listener);
            upload(file.length(), Utils.getMD5(uploadFilePath), requestBody, cosPath, callback);
        } else {
            if (data == null || data.length == 0) {
                if (callback != null)
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "tencent oss upload bytes null"));
                return;
            }

            RXLogger.d("bytes upload to tencent oss, cosPath:" + cosPath);
            RequestBody requestBody = new RXProgressRequestBody(data, cosPath, listener);
            upload(data.length, Utils.getMD5(data), requestBody, cosPath, callback);
        }
    }

    private void upload(long contentLength, String contentMD5, RequestBody requestBody, String cosPath, RXJSONCallback callback) {
        try {
            String urlString = config.getDomain() + "/" + cosPath;
            URL url = new URL(urlString);
            String host = url.getHost();

            Map<String, String> headers = new ArrayMap<>();
            headers.put(CONTENT_TYPE, "application/octet-stream");
            headers.put(CONTENT_LENGTH, Long.toString(contentLength));
            headers.put(USER_AGENT, "ruixue-sdk-" + BuildConfig.BUILD);
            headers.put(HOST, host);
            headers.put(CONTENT_MD5, contentMD5);

            // User-Agent 不参与签名
            Set<String> signHeaders = new HashSet<>();
            signHeaders.add(CONTENT_LENGTH);
            signHeaders.add(CONTENT_MD5);
//            signHeaders.add(HOST);

            String signature = TencentOssSigner.generateSignature(headers, signHeaders, config.getCredentials(), url);

            Request.Builder requestBuilder = new Request.Builder()
                    .url(url)
                    .put(requestBody);

            // 添加 common headers
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                requestBuilder.addHeader(entry.getKey(), entry.getValue());
            }

            // 添加 tencent 鉴权 header : Authorization、x-cos-security-token
            requestBuilder.addHeader(AUTHORIZATION, signature);
            requestBuilder.addHeader(X_COS_SECURITY_TOKEN, config.getCredentials().getSecurityToken());

            OkHttpClient client = getOkHttpClient(urlString.startsWith("https"));
            client.newCall(requestBuilder.build()).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    RXLogger.i("TencentOssUploader upload exception " + e.getMessage());
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
                            RXLogger.i("TencentOssUploader upload failed code:" + response.code() + ", message:" + response.message());
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
