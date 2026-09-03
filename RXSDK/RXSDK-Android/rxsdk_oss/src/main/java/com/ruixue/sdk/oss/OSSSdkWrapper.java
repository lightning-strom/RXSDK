package com.ruixue.sdk.oss;

import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.oss.ClientConfiguration;
import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSSClient;
import com.alibaba.sdk.android.oss.ServiceException;
import com.alibaba.sdk.android.oss.callback.OSSCompletedCallback;
import com.alibaba.sdk.android.oss.callback.OSSProgressCallback;
import com.alibaba.sdk.android.oss.common.auth.OSSCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSFederationCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSFederationToken;
import com.alibaba.sdk.android.oss.internal.OSSAsyncTask;
import com.alibaba.sdk.android.oss.model.PutObjectRequest;
import com.alibaba.sdk.android.oss.model.PutObjectResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public final class OSSSdkWrapper {

    static class Single {
        final static OSSSdkWrapper INSTANCE = new OSSSdkWrapper();
    }

    public static OSSSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    public OSSSdkWrapper() {

    }

    public interface OSSCallback {

        void onSuccess(String url);

        void onFailure(int code, String msg, Exception e);
    }

    OSSClient ossClient;
    OSSConfig ossConfig;

    public void init(Context context, OSSConfig config) {
        // yourEndpoint填写Bucket所在地域对应的Endpoint。以华东1（杭州）为例，Endpoint填写为https://oss-cn-hangzhou.aliyuncs.com。
        String endpoint = config.oss_endpoint;
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        String accessKeyId = config.oss_access_key_id;
        String accessKeySecret = config.oss_access_key_secret;

        // 从STS服务获取的安全令牌（SecurityToken）。
        String securityToken = "yourSecurityToken";
        String tokenUrl = "yourSecurityToken";

        OSSCredentialProvider credentialProvider = new OSSFederationCredentialProvider() {
            @Override
            public OSSFederationToken getFederationToken() {
                try {
                    URL stsUrl = new URL(tokenUrl);
                    HttpURLConnection conn = (HttpURLConnection) stsUrl.openConnection();
                    String jsonText;
                    try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                        String inputLine;
                        StringBuilder response = new StringBuilder();
                        while ((inputLine = in.readLine()) != null) {
                            response.append(inputLine);
                        }
                        jsonText = response.toString();
                    }
//                    String jsonText = IOUtils.readStreamAsString(input, OSSConstants.DEFAULT_CHARSET_NAME);
                    JSONObject jsonObjs = new JSONObject(jsonText);
                    int status = jsonObjs.getInt("code");
                    if (status == 0 || status == 200) {
                        JSONObject jsonData = jsonObjs.getJSONObject("data");
                        String ak = jsonData.getString("AccessKeyId");
                        String sk = jsonData.getString("AccessKeySecret");
                        String token = jsonData.getString("SecurityToken");
                        String expiration = jsonData.getString("Expiration");
                        return new OSSFederationToken(ak, sk, token, expiration);
                    }
                } catch (MalformedURLException | JSONException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }

        };
        ClientConfiguration conf = new ClientConfiguration();
        conf.setConnectionTimeout(15 * 1000); // 连接超时，默认15秒。
        conf.setSocketTimeout(15 * 1000); // socket超时，默认15秒。
        conf.setMaxConcurrentRequest(5); // 最大并发请求数，默认5个。
        conf.setMaxErrorRetry(2); // 失败后最大重试次数，默认2次。
//oss = new OSSClient(args.getContext(), RXIMDefaultConfig.Ali.OSS_ENDPOINT, credentialProvider);
//        OSSCredentialProvider credentialProvider = new OSSStsTokenCredentialProvider(accessKeyId, accessKeySecret, securityToken);
        // 创建OSSClient实例。
        ossClient = new OSSClient(context, endpoint, credentialProvider);
    }

    public void uploadBytes(String objectKey, byte[] uploadData) {
        // 构造上传请求。
        // 依次填写Bucket名称（例如examplebucket）和Object完整路径（例如exampledir/exampleobject.txt）。
        // Object完整路径中不能包含Bucket名称。
        PutObjectRequest put = new PutObjectRequest(ossConfig.bucket_name, objectKey, uploadData);
        try {
            PutObjectResult putResult = ossClient.putObject(put);
            Log.d("PutObject", "UploadSuccess");
            Log.d("ETag", putResult.getETag());
            Log.d("RequestId", putResult.getRequestId());
        } catch (ClientException e) {
            // 客户端异常，例如网络异常等。
            e.printStackTrace();
        } catch (ServiceException e) {
            // 服务端异常。
            Log.e("RequestId", e.getRequestId());
            Log.e("ErrorCode", e.getErrorCode());
            Log.e("HostId", e.getHostId());
            Log.e("RawMessage", e.getRawMessage());
        }
    }

    public void uploadFiles(String objectKey, String uploadFilePath) {
        // 构造上传请求。
        // 依次填写Bucket名称（例如examplebucket）、Object完整路径（例如exampledir/exampleobject.txt）和本地文件完整路径（例如/storage/emulated/0/oss/examplefile.txt）。
        // Object完整路径中不能包含Bucket名称。
        PutObjectRequest put = new PutObjectRequest(ossConfig.bucket_name, objectKey, uploadFilePath);

        // 异步上传时可以设置进度回调。
        put.setProgressCallback(new OSSProgressCallback<PutObjectRequest>() {
            @Override
            public void onProgress(PutObjectRequest request, long currentSize, long totalSize) {
                Log.d("PutObject", "currentSize: " + currentSize + " totalSize: " + totalSize);
            }
        });

        OSSAsyncTask task = ossClient.asyncPutObject(put, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
                Log.d("PutObject", "UploadSuccess");
                Log.d("ETag", result.getETag());
                Log.d("RequestId", result.getRequestId());
            }

            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                // 请求异常。
                if (clientExcepion != null) {
                    // 客户端异常，例如网络异常等。
                    clientExcepion.printStackTrace();
                }
                if (serviceException != null) {
                    // 服务端异常。
                    Log.e("ErrorCode", serviceException.getErrorCode());
                    Log.e("RequestId", serviceException.getRequestId());
                    Log.e("HostId", serviceException.getHostId());
                    Log.e("RawMessage", serviceException.getRawMessage());
                }
            }
        });
        // 取消上传任务。
        // task.cancel();
        // 等待上传任务完成。
        // task.waitUntilFinished();
    }
}