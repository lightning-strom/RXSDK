package com.ruixue.net;

import static com.ruixue.net.HttpUtil.checkDuration;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.callback.RXApiCallback;
import com.ruixue.dnsmanager.DNSIntercepterChain;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;
import com.ruixue.error.NetworkException;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.AESUtil;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.MD5;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPOutputStream;

import javax.net.SocketFactory;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/17
 */
public class RXHttpClient implements Cloneable, RXCall.Factory {

    public static final int CONNECT_TIMEOUT = 7 * 1000;
    public static final int READ_TIMEOUT = 30 * 1000;
    public static final String KEY_RUIXUE_TRACE_ID = "ruixue-traceid";

    public static final String AES_REQ_KEY = "4ca7dacc9332d74e1292c83f0aa3b376";

    final SSLSocketFactory sslSocketFactory;
    final HostnameVerifier hostnameVerifier;
    final int connectTimeout;
    final int readTimeout;
    final boolean compress;
    final boolean restfulData;

    public RXHttpClient(Builder builder) {

        if (builder.sslSocketFactory != null) {
            this.sslSocketFactory = builder.sslSocketFactory;
        } else {
            this.sslSocketFactory = newSslSocketFactory(new TrustAllCerts());
        }

        this.hostnameVerifier = builder.hostnameVerifier;
        this.compress = builder.compress;
        this.restfulData = builder.restfulData;
        this.connectTimeout = builder.connectTimeout <= 0 ? CONNECT_TIMEOUT : builder.connectTimeout;
        this.readTimeout = builder.readTimeout <= 0 ? READ_TIMEOUT : builder.readTimeout;

//        if (interceptors.contains(null)) {
//            throw new IllegalStateException("Null interceptor: " + interceptors);
//        }
//        if (networkInterceptors.contains(null)) {
//            throw new IllegalStateException("Null network interceptor: " + networkInterceptors);
//        }
    }

    @NonNull
    @Override
    public RXHttpClient clone() {
        try {
            RXHttpClient clone = (RXHttpClient) super.clone();
            // TODO: copy mutable state here, so the clone can't change the internals of the original
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    private X509TrustManager systemDefaultTrustManager() {
        try {
            TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init((KeyStore) null);
            TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
            if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
                throw new IllegalStateException("Unexpected default trust managers:" + Arrays.toString(trustManagers));
            }
            return (X509TrustManager) trustManagers[0];
        } catch (GeneralSecurityException e) {
            throw new AssertionError(); // The system has no TLS. Just give up.
        }
    }

    //自定义SS验证相关类
    @SuppressLint("CustomX509TrustManager")
    private static class TrustAllCerts implements X509TrustManager {

        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }

        @SuppressLint("TrustAllX509TrustManager")
        public void checkClientTrusted(X509Certificate[] certs, String authType) {
        }

        public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateNotYetValidException, CertificateExpiredException {
            if ((chain != null)) {
                chain[0].checkValidity();
            }
        }
    }

    private static class TrustAllHostnameVerifier implements HostnameVerifier {
        @SuppressLint("BadHostnameVerifier")
        @Override
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    }

    private static SSLSocketFactory newSslSocketFactory(X509TrustManager trustManager) {
        SSLSocketFactory ssfFactory = null;
        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, new TrustManager[]{trustManager}, null);
            ssfFactory = sc.getSocketFactory();
        } catch (Exception ignored) {
        }
        return ssfFactory;
    }

    @Override
    public RXCall newCall(RXRequest request) {
        return RXCallImpl.newRXCall(this, request);
    }

    @NonNull
    public HttpURLConnection createURLConnection(HttpMethod method, String urlStr) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        if (conn instanceof HttpsURLConnection) {
            if (null != hostnameVerifier) {
                ((HttpsURLConnection) conn).setHostnameVerifier(hostnameVerifier);
            }
            ((HttpsURLConnection) conn).setSSLSocketFactory(sslSocketFactory);
        }
        conn.setRequestMethod(method.getValue());
        if (HttpMethod.POST == method || HttpMethod.PUT == method) {
            conn.setDoOutput(true);
            conn.setUseCaches(false);// POST方式不能缓存数据
        }
        conn.setConnectTimeout(connectTimeout);
        conn.setReadTimeout(readTimeout);
        return conn;
    }

    public String getTraceIdFromHeaders(Map<String, String> headers) {
        return headers != null && headers.containsKey(KEY_RUIXUE_TRACE_ID) ? headers.get(KEY_RUIXUE_TRACE_ID) : "";
    }

    private boolean checkUrl(String url) {
        if (TextUtils.isEmpty(url)) {
            return false;
        } else
            return url.startsWith("http");
    }

    private JSONObject toJSONObject(int code, String msg) {
        return JSONUtil.toJSONObject(code, msg);
    }

    public String get(String urlStr) {
        InputStream in1 = getInputStream(urlStr);
        if (in1 == null) {
            return "";
        }
        try (BufferedReader in = new BufferedReader(new InputStreamReader(in1))) {
            return getResponseDataFromStream(in);
        } catch (Exception e) {
            return "";
        }
    }

    public InputStream getInputStream(String urlStr) {
        try {
            HttpURLConnection conn = createURLConnection(HttpMethod.GET, urlStr);
            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                return conn.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Bitmap getRemoteBitmap(String urlStr) {
        try (InputStream inputStream = getInputStream(urlStr)) {
            return BitmapFactory.decodeStream(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public JSONObject apiRequest(HttpMethod method, @NonNull String apiPath, String body, Map<String, String> extHeaders, RXJSONCallback callback) {

        if (Looper.myLooper() == Looper.getMainLooper()) {
            System.out.println("ERROR: ruixue http request need post in work thread.");
            throw new RuntimeException("ERROR: ruixue http request need post in work thread.");
        }
        if (apiPath.startsWith("http")) {
            return requestJSONObject(method, apiPath, body, extHeaders, callback);
        } else {
            int code = RXException.URL_ERROR;
            String msg = "ERROR: all url request failed,See console for details.";
            List<String> baseUrls = RuiXueSdk.getBaseUrls();
            if (null != baseUrls && baseUrls.size() > 0) {
                for (int i = 0; i < baseUrls.size(); ++i) {
                    String baseUrl = baseUrls.get(i);
                    baseUrl += baseUrl.endsWith("/") ? "" : "/";
                    String fullUrl = baseUrl + apiPath;
                    try {
                        JSONObject jsonObject = requestJSONObjectImpl(method, fullUrl, body, extHeaders, callback);
                        RXGlobalData.urlMoveToFirst(i);
                        return jsonObject;
                    } catch (Exception e) {
                        e.printStackTrace();
                        msg = e.getMessage();
                        if (e instanceof NetworkException) {
                            code = ((NetworkException) e).getResponseCode();
                        } else if (e instanceof JSONException) {
                            code = RXException.JSON_ERROR;
                        }
                    }
                }
            } else {
                code = RXErrorCode.INIT_PARAMS_ERROR.getValue();
                msg = "ERROR: ruixue baseUrl is not initialized.";
            }
            if (null != callback) {
                String finalMsg = msg;
                int finalCode = code;
                ThreadUtils.getMainLooperHandler().post(() -> callback.onError(new RXException(finalCode, finalMsg)));
            }
            return toJSONObject(code, msg);
        }
    }

    protected JSONObject requestJSONObject(HttpMethod method, String url, String data, Map<String, String> extHeaders, RXJSONCallback callback) {
        int code;
        String msg;
        try {
            return requestJSONObjectImpl(method, url, data, extHeaders, callback);
        } catch (NetworkException e) {
            code = e.getResponseCode();
            msg = e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof JSONException) {
                code = RXException.JSON_ERROR;
            } else {
                code = RXException.CODE_ERROR;
            }
            msg = e.getMessage();
        }
        if (null != callback) {
            Handler mainHandler = ThreadUtils.getMainLooperHandler();
            mainHandler.post(() -> callback.onError(new RXException(code, msg)));
        }
        return toJSONObject(code, msg);
    }

    public JSONObject requestJSONObjectImpl(HttpMethod method, String url, String data, Map<String, String> extHeaders, RXJSONCallback callback) throws NetworkException, JSONException {
        if (!checkUrl(url)) {
            String msg = "ERROR:url format error :" + url;
            throw new NetworkException(RXException.URL_ERROR, msg);
        }
        String result = requestStringImpl(method, url, data, extHeaders);
        JSONObject jsonObject = new JSONObject(result);
        if (null != callback) {
            Handler mainHandler = ThreadUtils.getMainLooperHandler();
            int code = jsonObject.optInt("code", -1);
            if (code == 0 || (code == -1 && !restfulData)) {
                JSONObject dataObj = restfulData ? jsonObject.optJSONObject("data") : jsonObject;
                if (!restfulData && jsonObject.has("msg") && dataObj != null) {
                    dataObj.put("msg", jsonObject.optString("msg"));
                }
                mainHandler.post(() -> callback.onSuccess(dataObj));
            } else {
                if (!jsonObject.has("trace_id")) {
                    jsonObject.putOpt("trace_id", getTraceIdFromHeaders(extHeaders));
                }
                mainHandler.post(() -> callback.onFailed(jsonObject));
            }
        }
        return jsonObject;
    }

    public String requestString(HttpMethod method, @NonNull String apiPath, String body, Map<String, String> extHeaders, RXApiCallback callback) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            System.out.println("ERROR: ruixue http request need post in work thread.");
            throw new RuntimeException("ERROR: ruixue http request need post in work thread.");
        }
        if (apiPath.startsWith("http")) {
            String response = null;
            try {
                response = requestStringImpl(method, apiPath, body, extHeaders);
                if (callback != null) {
                    String finalResponse = response;
                    ThreadUtils.getMainLooperHandler().post(() -> callback.onResponse(finalResponse, false));
                }
            } catch (NetworkException e) {
                e.printStackTrace();
                if (callback != null) {
                    ThreadUtils.getMainLooperHandler().post(() -> callback.onError(new RXException(e, getTraceIdFromHeaders(extHeaders))));
                }
            }
            return response;
        } else {
            int code = RXException.URL_ERROR;
            String msg = "ERROR: all url request failed,See console for details.";
            List<String> baseUrls = RuiXueSdk.getBaseUrls();
            if (null != baseUrls && baseUrls.size() > 0) {
                for (int i = 0; i < baseUrls.size(); ++i) {
                    String baseUrl = baseUrls.get(i);
                    baseUrl += baseUrl.endsWith("/") ? "" : "/";
                    String fullUrl = baseUrl + apiPath;
                    try {
                        String response = requestStringImpl(method, fullUrl, body, extHeaders);
                        RXGlobalData.urlMoveToFirst(i);
                        if (callback != null) {
                            ThreadUtils.getMainLooperHandler().post(() -> callback.onResponse(response, false));
                        }
                        try {
                            JSONObject json = new JSONObject(response);
                            reportVersionRequestIfNeed(fullUrl, body, extHeaders, json.optInt("code"), json.optString("msg"));
                        } catch (Exception ignore) {
                        }
                        return response;
                    } catch (Exception e) {
                        e.printStackTrace();
                        msg = e.getMessage();
                        if (e instanceof NetworkException) {
                            code = ((NetworkException) e).getResponseCode();
                        }
                        reportVersionRequestIfNeed(fullUrl, body, extHeaders, code, msg);
                    }
                }
            } else {
                code = RXErrorCode.INIT_PARAMS_ERROR.getValue();
                msg = "ERROR: ruixue baseUrl is not initialized.";
            }
            if (null != callback) {
                String finalMsg = msg;
                int finalCode = code;
                ThreadUtils.getMainLooperHandler().post(() -> callback.onError(new RXException(finalCode, finalMsg, getTraceIdFromHeaders(extHeaders))));
            }
            return msg;
        }
    }

    private void reportVersionRequestIfNeed(String url, String body, Map<String, String> extHeaders, int code, String msg) {
        if (url == null) {
            return;
        }

        if (!url.contains("v1/vcapi/update")) {
            return;
        }

        boolean isSuccess = code == RXErrorCode.OK;
        Map<String, Object> map = JSONUtil.toMap(URLHelper.queryToJSONObject(body));
        Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("version_check", null, isSuccess ? "success" : "fail");
        if (!isSuccess) {
            properties.put("error_code", code);
            properties.put("error_msg", msg);
            properties.put("request_address", url);
            properties.put("request_body", map);
            properties.put("request_header", extHeaders);
        }
        UserActionTrackManager.getInstance().reportUserAction(properties);
    }

    /**
     * Gzip 压缩数据
     */
    public byte[] compressForGzip(String unGzipStr) throws IOException {
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


    private byte[] getBytes(String strData, boolean compress) throws IOException {
        if (compress) {
            return compressForGzip(strData);
        } else {
            return strData.getBytes(StandardCharsets.UTF_8);
        }
    }

    public static String getExceptionString(Exception e) {
        try {
            //读取异常堆栈信息
            ByteArrayOutputStream arrayOutputStream = new ByteArrayOutputStream();
            e.printStackTrace(new PrintStream(arrayOutputStream));
            //通过字节数组转换输入输出流
            BufferedReader fr = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(arrayOutputStream.toByteArray())));
            String str;
            StringBuilder exceptionStr = new StringBuilder();
            while ((str = fr.readLine()) != null) {
                exceptionStr.append(str);
            }
            //一定一定要关闭流
            fr.close();
            return exceptionStr.toString();
        } catch (Exception e1) {
            e.printStackTrace();
            return e1.getMessage();
        }
    }

    public String requestStringImpl(HttpMethod method, String url, String strData, Map<String, String> extraHeaders) throws NetworkException {
        return requestStringImpl(method, url, strData, extraHeaders, false);
    }

    public String requestStringImpl(HttpMethod method, String url, String strData, Map<String, String> extraHeaders, boolean retry) throws NetworkException {
        HttpURLConnection connection = null;
        String curlLog = "";
        String resultLog = "\r\n" + "response: ";
        try {
            if (HttpMethod.GET == method && !TextUtils.isEmpty(strData)) {
                url = url + URLHelper.getSeparator(url) + strData;
            }
            connection = createURLConnection(method, url);
            Map<String, String> headerSnapshot = new HashMap<>();
            if (extraHeaders != null) {
                for (Map.Entry<String, String> entry : extraHeaders.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), entry.getValue());
                    try {
                        headerSnapshot.put(entry.getKey(), entry.getValue());
                    } catch (Exception ignore){}
                }
            }

            String deviceCode = connection.getRequestProperty("ruixue-devicecode");

            if (deviceCode == null) {
                deviceCode = "";
            }

            // 白名单 v1/sdkconfig/init
            boolean needEncode = !retry && !url.contains("v1/sdkconfig/init") && RXGlobalData.isCpOf();

            if (needEncode) {
                connection.setRequestProperty("ruixue-encipher", "1");
                connection.setRequestProperty("Content-Type", "text/plain");
                headerSnapshot.put("ruixue-encipher", "1");
                headerSnapshot.put("Content-Type", "text/plain");
            }

            String d = (HttpMethod.GET == method || TextUtils.isEmpty(strData)) ? "" : " \\\r\n -d '" + strData + "'";
            curlLog = " \r\n" + method + " " + url + " \\\r\n" + HttpUtil.getHeaderCurlFormat(connection.getRequestProperties()) + d;

            if (HttpMethod.GET != method && null != strData) {
                byte[] bytes;
                if (needEncode) {
                    String key = MD5.hexdigest(deviceCode + AES_REQ_KEY);
                    String encryptData;
                    if (compress) {
                        byte[] data = compressForGzip(strData);
//                        RXLogger.d("data original length:" + strData.length() + "compress length:" + data.length);
                        encryptData = AESUtil.encryptCBCPKCS7(key, data);
//                        RXLogger.d("encryData length:" + encryData.length());
                    } else {
                        encryptData = AESUtil.encryptCBCPKCS7(key, strData);
                    }
                    if (encryptData == null) { // 加密失败
                        RXLogger.d("request encrypt failed, so not encrypt request and track one error.");
                        RxErrorReportUtil.setReqEncryptNetReportError(headerSnapshot, strData, url, null, key, "encrypt");
                        connection.setRequestProperty("ruixue-encipher", "0");
                        connection.setRequestProperty("Content-Type", "application/json");
                        headerSnapshot.put("ruixue-encipher", "0");
                        headerSnapshot.put("Content-Type", "application/json");
                        bytes = getBytes(strData, compress);
                    } else {
                        bytes = encryptData.getBytes(StandardCharsets.UTF_8);
                    }
                } else {
                    bytes = getBytes(strData, compress);
                }

                connection.setFixedLengthStreamingMode(bytes.length);
                try (OutputStream out = connection.getOutputStream(); BufferedOutputStream bout = new BufferedOutputStream(out);) {
                    bout.write(bytes);
                    bout.flush();
                }
            }
            int responseCode = connection.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                String result = toResponseResult(connection);
                String encipher = connection.getHeaderField("ruixue-encipher");
                try {
                    JSONObject jsonObject = new JSONObject(result);
                    int code = jsonObject.optInt("code", -1);
                    if ((code == 302015 || code == 302016) && !retry) { //服务端解密失败
                        resultLog += result;
                        RXLogger.d(curlLog + resultLog);

                        RXLogger.d("request decode failed, so retry once.");
                        return requestStringImpl(method, url, strData, extraHeaders, true);
                    }

                    // 只有标记值为加密，并且 code 为 0 才进行相应解密
                    if ("1".equals(encipher) && code == 0) {
                        String data = jsonObject.optString("data");
                        if (!TextUtils.isEmpty(data)) {
                            String key = MD5.hexdigest(deviceCode + AES_REQ_KEY);
                            String decodedData = AESUtil.decryptCBCPKCS7(key, data);
                            // 加密 data 非空，解密为空，说明解密失败，所以不加密重试一次
                            if (decodedData == null && !retry) {
                                resultLog += result;
                                RXLogger.d(curlLog + resultLog);

                                RxErrorReportUtil.setReqEncryptNetReportError(headerSnapshot, strData, url, result, key, "decrypt");
                                RXLogger.d("client decode failed, so retry once.");
                                return requestStringImpl(method, url, strData, extraHeaders, true);
                            }
                            if (decodedData != null && decodedData.startsWith("[")) {
                                jsonObject.remove("data");
                                try {
                                    jsonObject.put("data", new JSONArray(decodedData));
                                } catch (Exception ignore) {
                                    jsonObject.put("data", decodedData);
                                }
                            } else if (decodedData != null && decodedData.startsWith("{")) {
                                jsonObject.remove("data");
                                try {
                                    jsonObject.put("data", new JSONObject(decodedData));
                                } catch (Exception ignore) {
                                    jsonObject.put("data", decodedData);
                                }
                            } else if (decodedData != null) {
                                jsonObject.remove("data");
                                try {
                                    decodedData = new Gson().fromJson(decodedData, String.class);
                                } catch (Exception ignore) {}
                                jsonObject.put("data", decodedData);
                            }
                            result = jsonObject.toString();
                        }
                    }
                } catch (Exception e) {
                    RXLogger.d("response is not json, so do nothing.");
                }

                RxErrorReportUtil.setGateNetReportError(extraHeaders, strData, url, result);
                UserActionTrackManager.getInstance().trackRequestErrorIfNeed(method, extraHeaders, strData, url, result);

                resultLog += result;
                RXLogger.d(curlLog + resultLog);
                return result;
            } else {
                String errMsg = toErrorResult(connection);
                resultLog += "errMsg:" + errMsg + " ,responseCode:" + responseCode;
                RXLogger.e(curlLog + resultLog);
                NetworkException networkException = new NetworkException(responseCode, errMsg);
                try {
                    RxErrorReportUtil.setNetReportError(extraHeaders, strData, url,
                            networkException.getCode(), networkException.getMessage(),
                            networkException.getThirdCode(), networkException.getThirdMsg());

                    UserActionTrackManager.getInstance().trackRequestErrorIfNeed(method,
                            extraHeaders, strData, url,
                            networkException.getCode(), networkException.getMessage(),
                            networkException.getThirdCode(), networkException.getThirdMsg());
                } catch (Exception netLocalE) {
                    netLocalE.printStackTrace();
                }
                throw networkException;
            }
        } catch (final IOException e) {
            if (connection != null) {
                Log.d("handlednstransform", connection.getURL().toString() + "进入异常处理。。。");
            }

            IOException ioException = e;

            boolean isDNSHandle = e instanceof UnknownHostException
                    || e instanceof SocketTimeoutException
                    || e instanceof ConnectException
                    || (e.getMessage() != null && e.getMessage().contains("Unable to resolve host"));

            boolean interceptorExist = DNSIntercepterChain.getInstance().getInterceptorSize() > 0;
            boolean isUseDns = RXGlobalData.isIsUseDNS();

            if (isUseDns) {
                Log.d("handlednstransform", "用户开启 DNS 解析配置");
            } else {
                Log.d("handlednstransform", "用户未开启 DNS 解析配置");
            }

            if (isDNSHandle && interceptorExist && isUseDns && connection != null) {

                DNSRequestBean requestBean = new DNSRequestBean();
                requestBean.context = RuiXueSdk.getContext();
                requestBean.oldUrl = connection.getURL();
                requestBean.method = connection.getRequestMethod();
                requestBean.connectTimeout = connection.getConnectTimeout();
                requestBean.readTimeout = connection.getReadTimeout();
                requestBean.strData = strData;
                requestBean.extraHeaders = extraHeaders;
                requestBean.compress = compress;
                requestBean.lastException = ioException;

                DNSResponseBean responseBean = DNSIntercepterChain.getInstance().startProcess(requestBean);

                if (responseBean != null && responseBean.responseCode != -1) {

                    if (responseBean.responseCode == HttpURLConnection.HTTP_OK) {
                        Log.d("handlednstransform", "DNS 解析域名请求成功， code == 200");
                        resultLog += responseBean.msg;
                        RXLogger.i(curlLog + resultLog);
                        return responseBean.msg;
                    } else {
                        resultLog += "errMsg:" + responseBean.msg + " ,responseCode:" + responseBean.responseCode;
                        Log.d("handlednstransform", "DNS 解析域名请求失败， code ！= 200");
                        RXLogger.e(curlLog + resultLog);
                        NetworkException networkException = new NetworkException(responseBean.responseCode, responseBean.msg);
                        try {
                            RxErrorReportUtil.setNetReportError(extraHeaders, strData, url,
                                    networkException.getCode(), networkException.getMessage(),
                                    networkException.getThirdCode(), networkException.getThirdMsg());
                        } catch (Exception netLocalE) {
                            netLocalE.printStackTrace();
                        }
                        throw networkException;
                    }
                }

                if (responseBean != null && responseBean.currentException != null) {
                    ioException = responseBean.currentException;
                }

            } else {
                Log.d("handlednstransform", "当前无 DNS 拦截器 或 未触发dns解析条件");
            }
            Log.d("handlednstransform", "进入异常结果处理，抛出异常： " + ioException);
            ioException.printStackTrace();
            resultLog += ioException.getMessage();
            RXLogger.e(curlLog + resultLog);
            Map<String, Object> map = new HashMap<>();
            map.put("code", RXException.getCode(ioException));
            map.put("msg", ioException.getMessage());
            map.put("error", getExceptionString(ioException));
            map.put("url", url);
//            map.put("result", (curlLog).replaceAll("(\\r\\n|\\n|\\r)",""));
            reportNetError(url, map);
            NetworkException networkException = new NetworkException(ioException);
            try {
                if (connection != null) {
                    RxErrorReportUtil.setNetReportError(extraHeaders, strData, url,
                            networkException.getCode(), networkException.getMessage(),
                            networkException.getThirdCode(), networkException.getThirdMsg());
                    UserActionTrackManager.getInstance().trackRequestErrorIfNeed(method,
                            extraHeaders, strData, url,
                            networkException.getCode(), networkException.getMessage(),
                            networkException.getThirdCode(), networkException.getThirdMsg());
                }
            } catch (Exception netLocalE) {
                netLocalE.printStackTrace();
            }
            throw networkException;
        } catch (OutOfMemoryError | Exception e) {
            throw new NetworkException(e);
        } finally {
            if (null != connection) {
                connection.disconnect();
            }
        }
    }

    private void reportNetError(String url, Map<String, Object> map) {
        if (url != null && !url.contains(RXApiPath.Data.TRACK_DATA_API)) {
            ThreadUtils.getInstance().runOnBgThread(new Runnable() {
                @Override
                public void run() {
                    String ip = HttpClient.get("https://ifconfig.me/ip");
                    if (!TextUtils.isEmpty(ip)) {
                        map.put("ip", ip);
                    }
                    RxErrorReportUtil.reportError("#rxsdk_networkError", map);
                }
            });
        }
    }

    public static String toResponseResult(HttpURLConnection conn) throws IOException {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            return getResponseDataFromStream(in);
        }
    }

    public static String toErrorResult(HttpURLConnection conn) throws Exception {
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

    public static final class Builder {

        SocketFactory socketFactory;
        SSLSocketFactory sslSocketFactory;
        HostnameVerifier hostnameVerifier;
        boolean followSslRedirects;
        boolean followRedirects;
        boolean retryOnConnectionFailure;
        int callTimeout;
        int connectTimeout;
        int readTimeout;
        int writeTimeout;
        int pingInterval;


        boolean compress;


        boolean restfulData;

        public Builder() {
            followSslRedirects = true;
            followRedirects = true;
            retryOnConnectionFailure = true;
            callTimeout = 0;
            pingInterval = 0;
        }

        public Builder setRestfulData(boolean restfulData) {
            this.restfulData = restfulData;
            return this;
        }

        public Builder setCompress(boolean compress) {
            this.compress = compress;
            return this;
        }

        /**
         * Sets the default timeout for complete calls. A value of 0 means no timeout, otherwise values
         * must be between 1 and {@link Integer#MAX_VALUE} when converted to milliseconds.
         *
         * <p>The call timeout spans the entire call: resolving DNS, connecting, writing the request
         * body, server processing, and reading the response body. If the call requires redirects or
         * retries all must complete within one timeout period.
         */
        public Builder callTimeout(long timeout, TimeUnit unit) {
            callTimeout = checkDuration("timeout", timeout, unit);
            return this;
        }

        /**
         * Sets the default timeout for complete calls. A value of 0 means no timeout, otherwise values
         * must be between 1 and {@link Integer#MAX_VALUE} when converted to milliseconds.
         *
         * <p>The call timeout spans the entire call: resolving DNS, connecting, writing the request
         * body, server processing, and reading the response body. If the call requires redirects or
         * retries all must complete within one timeout period.
         */

        public Builder callTimeout(Duration duration) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                callTimeout = checkDuration("timeout", duration.toMillis(), TimeUnit.MILLISECONDS);
            }
            return this;
        }

        /**
         * Sets the default connect timeout for new connections. A value of 0 means no timeout,
         * otherwise values must be between 1 and {@link Integer#MAX_VALUE} when converted to
         * milliseconds.
         *
         * <p>The connect timeout is applied when connecting a TCP socket to the target host.
         * The default value is 10 seconds.
         */
        public Builder connectTimeout(long timeout, TimeUnit unit) {
            connectTimeout = checkDuration("timeout", timeout, unit);
            return this;
        }

        /**
         * Sets the default connect timeout for new connections. A value of 0 means no timeout,
         * otherwise values must be between 1 and {@link Integer#MAX_VALUE} when converted to
         * milliseconds.
         *
         * <p>The connect timeout is applied when connecting a TCP socket to the target host.
         * The default value is 10 seconds.
         */
//
//        public Builder connectTimeout(Duration duration) {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                connectTimeout = checkDuration("timeout", duration.toMillis(), TimeUnit.MILLISECONDS);
//            }
//            return this;
//        }
        public Builder readTimeout(long timeout, TimeUnit unit) {
            readTimeout = checkDuration("timeout", timeout, unit);
            return this;
        }


//        public Builder readTimeout(Duration duration) {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                readTimeout = checkDuration("timeout", duration.toMillis(), TimeUnit.MILLISECONDS);
//            }
//            return this;
//        }


        public Builder writeTimeout(long timeout, TimeUnit unit) {
            writeTimeout = checkDuration("timeout", timeout, unit);
            return this;
        }


        /**
         * Sets the socket factory used to secure HTTPS connections. If unset, the system default will
         * be used.
         *
         * @deprecated {@code SSLSocketFactory} does not expose its {@link X509TrustManager}, which is
         * a field that OkHttp needs to build a clean certificate chain. This method instead must
         * use reflection to extract the trust manager. Applications should prefer to call {@link
         * #sslSocketFactory(SSLSocketFactory, X509TrustManager)}, which avoids such reflection.
         */
        @Deprecated
        public Builder sslSocketFactory(SSLSocketFactory sslSocketFactory) {
            if (sslSocketFactory == null)
                throw new NullPointerException("sslSocketFactory == null");
            this.sslSocketFactory = sslSocketFactory;
//            this.certificateChainCleaner = Platform.get().buildCertificateChainCleaner(sslSocketFactory);
            return this;
        }

        /**
         * Sets the socket factory and trust manager used to secure HTTPS connections. If unset, the
         * system defaults will be used.
         *
         * <p>Most applications should not call this method, and instead use the system defaults. Those
         * classes include special optimizations that can be lost if the implementations are decorated.
         *
         * <p>If necessary, you can create and configure the defaults yourself with the following code:
         *
         * <pre>   {@code
         *
         *   TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(
         *       TrustManagerFactory.getDefaultAlgorithm());
         *   trustManagerFactory.init((KeyStore) null);
         *   TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
         *   if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
         *     throw new IllegalStateException("Unexpected default trust managers:"
         *         + Arrays.toString(trustManagers));
         *   }
         *   X509TrustManager trustManager = (X509TrustManager) trustManagers[0];
         *
         *   SSLContext sslContext = SSLContext.getInstance("TLS");
         *   sslContext.init(null, new TrustManager[] { trustManager }, null);
         *   SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
         *
         *   OkHttpClient client = new OkHttpClient.Builder()
         *       .sslSocketFactory(sslSocketFactory, trustManager)
         *       .build();
         * }</pre>
         */
        public Builder sslSocketFactory(SSLSocketFactory sslSocketFactory, X509TrustManager trustManager) {
            if (sslSocketFactory == null)
                throw new NullPointerException("sslSocketFactory == null");
            if (trustManager == null)
                throw new NullPointerException("trustManager == null");
            this.sslSocketFactory = sslSocketFactory;
//            this.certificateChainCleaner = CertificateChainCleaner.get(trustManager);
            return this;
        }

        /**
         * Sets the verifier used to confirm that response certificates apply to requested hostnames for
         * HTTPS connections.
         *
         * <p>If unset, a default hostname verifier will be used.
         */
        public Builder hostnameVerifier(HostnameVerifier hostnameVerifier) {
            if (hostnameVerifier == null)
                throw new NullPointerException("hostnameVerifier == null");
            this.hostnameVerifier = hostnameVerifier;
            return this;
        }


        /**
         * Configure this client to follow redirects from HTTPS to HTTP and from HTTP to HTTPS.
         *
         * <p>If unset, protocol redirects will be followed. This is different than the built-in {@code
         * HttpURLConnection}'s default.
         */
        public Builder followSslRedirects(boolean followProtocolRedirects) {
            this.followSslRedirects = followProtocolRedirects;
            return this;
        }

        /**
         * Configure this client to follow redirects. If unset, redirects will be followed.
         */
        public Builder followRedirects(boolean followRedirects) {
            this.followRedirects = followRedirects;
            return this;
        }


        public RXHttpClient build() {
            return new RXHttpClient(this);
        }
    }
}
