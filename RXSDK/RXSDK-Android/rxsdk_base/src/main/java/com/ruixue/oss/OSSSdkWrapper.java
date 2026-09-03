package com.ruixue.oss;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXHttpClient;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.oss.amazon.AmazonOssUploader;
import com.ruixue.oss.callback.OSSCompletedCallback;
import com.ruixue.oss.common.auth.OSSCredentialProvider;
import com.ruixue.oss.common.auth.OSSStsTokenCredentialProvider;
import com.ruixue.oss.common.utils.OSSUtils;
import com.ruixue.oss.model.PutObjectRequest;
import com.ruixue.oss.model.PutObjectResult;
import com.ruixue.oss.tencent.TencentOssUploader;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Map;


public final class OSSSdkWrapper {

    static class Single {
        final static OSSSdkWrapper INSTANCE = new OSSSdkWrapper();
    }

    public static OSSSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    public OSSSdkWrapper() {
    }

    public void getOssConfigData(RXJSONCallback callback) {
        RXRequest.create(RXApiPath.OSS_STS).getAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    public void putObject(OSSConfig ossConfig, String objectKey, byte[] bytes) {

        // yourEndpoint填写Bucket所在地域对应的Endpoint。以华东1（杭州）为例，Endpoint填写为https://oss-cn-hangzhou.aliyuncs.com。
        String endpoint = "https://" + ossConfig.getRegion() + ".aliyuncs.com";
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        String accessKeyId = ossConfig.getCredentials().getAccessKeyId();
        String accessKeySecret = ossConfig.getCredentials().getAccessKeySecret();
        // 从STS服务获取的安全令牌（SecurityToken）。
        String securityToken = ossConfig.getCredentials().getSecurityToken();

        RXHttpClient.Builder builder = new RXHttpClient.Builder();

        RXHttpClient rxHttpClient = builder.build();

        Map<String, String> extraHeaders = new HashMap<>();
        extraHeaders.put("x-oss-security-token", securityToken);
        extraHeaders.put("Date", DateUtils.formatRfc822Date());
        extraHeaders.put("Authorization", OSSUtils.sign(accessKeyId, accessKeySecret, ""));
        extraHeaders.put("Content-Type", "application/octet-stream");
        String url = endpoint + "/" + objectKey;

        HttpURLConnection connection = null;
        long length = bytes.length;
        try {
            connection = rxHttpClient.createURLConnection(HttpMethod.PUT, url);
            if (extraHeaders != null) {
                for (Map.Entry<String, String> entry : extraHeaders.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }

            connection.setFixedLengthStreamingMode(bytes.length);
            try (OutputStream out = connection.getOutputStream(); BufferedOutputStream bout = new BufferedOutputStream(out);) {
                bout.write(bytes);
                bout.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
//                String result = toResponseResult(connection);
//                resultLog += result;
//                RXLogger.i(curlLog + resultLog);
//                return result;
            } else {
//                String errMsg = toErrorResult(connection);
//                resultLog += "errMsg:" + errMsg + " ,responseCode:" + responseCode;
//                RXLogger.e(curlLog + resultLog);
//                throw new NetworkException(responseCode, errMsg);
            }
        } catch (final IOException e) {
            e.printStackTrace();
//            resultLog += e.getMessage();

//            map.put("result", (curlLog).replaceAll("(\\r\\n|\\n|\\r)",""));

//            throw new NetworkException(e);
        } catch (OutOfMemoryError e) {
//            throw new NetworkException(e);
        } finally {
            if (null != connection) {
                connection.disconnect();
            }
        }
    }

    public void uploadFile(Context context, String objectKey, byte[] data, RXJSONCallback callback) {
        uploadFile(context, objectKey, data, callback, null);
    }

    public void uploadFile(Context context, String objectKey, byte[] data, RXJSONCallback callback, RXProgressListener listener) {
        getOssConfigData(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject result) {
                if (result == null) {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "oss config data null"));
                    }
                    return;
                }

                try {
                    OSSConfig config = OSSConfig.objectFromData(result.toString());
                    if (OSSConfig.PROVIDER_ALI.equals(config.getProvider())) { // 阿里
                        PutObjectRequest put = new PutObjectRequest(config.getBucket(), objectKey, data);
                        put.setProgressCallback((request, currentSize, totalSize) -> {
                            if (listener != null) {
                                listener.onProgress(objectKey, currentSize, totalSize);
                            }
                        });
                        uploadFileToAli(context, config, objectKey, put, callback);
                    } else if (OSSConfig.PROVIDER_TENCENT.equals(config.getProvider())) { // 腾讯云
                        uploadFileToTencent(config, data, null, objectKey, callback, listener);
                    } else if (OSSConfig.PROVIDER_AWS.equals(config.getProvider())) {
                        uploadFileToAmazon(config, data, null, objectKey, callback, listener);
                    } else {
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "oss unsupport provider:" + config.getProvider()));
                        }
                    }
                } catch (Exception e) {
                    RXLogger.e(e.getMessage());
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "uploadFiles error"));
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    public void uploadFile(Context context, String objectKey, String uploadFilePath, RXJSONCallback callback) {
        uploadFile(context, objectKey, uploadFilePath, callback, null);
    }

    public void uploadFile(Context context, String objectKey, String uploadFilePath, RXJSONCallback callback, RXProgressListener listener) {
        if (TextUtils.isEmpty(uploadFilePath)) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "uploadFilePath is null"));
            }
            return;
        }
        File file = new File(uploadFilePath);
        if (!file.exists()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "uploadFilePath " + uploadFilePath + " is not exist"));
            }
            return;
        }
        getOssConfigData(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "oss config data null"));
                    }
                    return;
                }

                try {
                    OSSConfig config = OSSConfig.objectFromData(data.toString());
                    if (OSSConfig.PROVIDER_ALI.equals(config.getProvider())) { // 阿里
                        PutObjectRequest put = new PutObjectRequest(config.getBucket(), objectKey, uploadFilePath);
                        put.setProgressCallback((request, currentSize, totalSize) -> {
                            if (listener != null) {
                                listener.onProgress(objectKey, currentSize, totalSize);
                            }
                        });
                        uploadFileToAli(context, config, objectKey, put, callback);
                    } else if (OSSConfig.PROVIDER_TENCENT.equals(config.getProvider())) { // 腾讯云
                        uploadFileToTencent(config, null, uploadFilePath, objectKey, callback, listener);
                    } else if (OSSConfig.PROVIDER_AWS.equals(config.getProvider())) { // 亚马逊
                        uploadFileToAmazon(config, null, uploadFilePath, objectKey, callback, listener);
                    } else {
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "oss unsupport provider:" + config.getProvider()));
                        }
                    }
                } catch (Exception e) {
                    RXLogger.e(e.getMessage());
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "uploadFiles error"));
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    private void uploadFileToTencent(OSSConfig config, byte[] data, String uploadFilePath, String objectKey, RXJSONCallback callback, RXProgressListener listener) {
        TencentOssUploader uploader = new TencentOssUploader(config);
        uploader.upload(data, uploadFilePath, objectKey, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("url", config.getDomain() + "/" + objectKey);
                    callback.onSuccess(JSONUtil.toJSONObject(map));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        }, listener);
    }

    private void uploadFileToAmazon(OSSConfig config, byte[] data, String uploadFilePath, String objectKey, RXJSONCallback callback, RXProgressListener listener) {
        AmazonOssUploader uploader = new AmazonOssUploader(config);
        uploader.upload(data, uploadFilePath, objectKey, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("url", config.getDomain() + "/" + objectKey);
                    callback.onSuccess(JSONUtil.toJSONObject(map));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        }, listener);
    }

    private void uploadFileToAli(Context context, OSSConfig ossConfig, String objectKey, PutObjectRequest por, RXJSONCallback callback) {
        String accessKeyId = ossConfig.getCredentials().getAccessKeyId();
        String accessKeySecret = ossConfig.getCredentials().getAccessKeySecret();
        String securityToken = ossConfig.getCredentials().getSecurityToken();
        ClientConfiguration config = new ClientConfiguration();
        config.setSocketTimeout(10 * 60 * 1000);
        config.setConnectionTimeout(60 * 1000);
        OSSCredentialProvider credentialProvider = new OSSStsTokenCredentialProvider(accessKeyId, accessKeySecret, securityToken);
        OSSClient ossClient = new OSSClient(context, ossConfig.getDomain(), credentialProvider, config);
        ossClient.asyncPutObject(por, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
//                String url = ossClient.presignPublicObjectURL(ossConfig.getBucket(), objectKey);
                if (callback != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("url", ossConfig.getDomain() + "/" + objectKey);
                    callback.onSuccess(JSONUtil.toJSONObject(map));
                }
            }

            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                // 请求异常。
                if (clientExcepion != null) {
                    // 客户端异常，例如网络异常等。
                    clientExcepion.printStackTrace();
                    if (callback != null) {
                        callback.onError(new RXException(clientExcepion));
                    }
                }
                if (serviceException != null) {
                    // 服务端异常。
                    Log.e("ErrorCode", serviceException.getErrorCode());
                    Log.e("RequestId", serviceException.getRequestId());
                    Log.e("HostId", serviceException.getHostId());
                    Log.e("RawMessage", serviceException.getRawMessage());
                    if (callback != null) {
                        callback.onError(new RXException(clientExcepion));
                    }
                }
            }
        });
    }
}