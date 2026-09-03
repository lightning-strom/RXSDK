package com.ruixue.net;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.PassportManager;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class RXRequest implements IRXRequest {

    private String UUID_STRING;
    private final String API_PATH;
    private Map<String, Object> bodyMap;
    private Map<String, String> headerMap;
    private RXJSONCallback mCallback;
    private HttpMethod method;
    private boolean needSign = false;
    private boolean needLoggedIn;
    private final boolean isFullUrl;
    private final AtomicBoolean isRequesting;
    private boolean restfulData = true;
    private int connectTimeout;
    private int readTimeout;

    public static RXRequest create(String apiPath) {
        return new RXRequest(apiPath, false);
    }

    public static RXRequest create(String apiPath, boolean ignoreHeader) {
        return new RXRequest(apiPath, ignoreHeader);
    }

    protected RXRequest(@NonNull String apiPath, boolean ignoreHeader) {
        UUID_STRING = UUID.randomUUID().toString();
        API_PATH = apiPath;
        isFullUrl = API_PATH.startsWith("http");
        this.needLoggedIn = RXApiPath.needVerifyToken(API_PATH);
        this.mCallback = RXJSONCallback.EMPTY;
        method = HttpMethod.POST;
        isRequesting = new AtomicBoolean(false);
        updateHeaders();
    }

    public void setUUID(String uuid) {
        if (!TextUtils.isEmpty(uuid)) {
            this.UUID_STRING = uuid;
        }
    }

    public RXRequest setConnectTimeout(int connectTimeout) {
        this.connectTimeout = connectTimeout;
        return this;
    }

    public RXRequest setReadTimeout(int readTimeout) {
        this.readTimeout = readTimeout;
        return this;
    }

    @Override
    public boolean isRequesting() {
        return isRequesting.get();
    }


    @Override
    public RXRequest setCallback(RXJSONCallback mCallback) {
        this.mCallback = mCallback;
        return this;
    }

    @Override
    public HttpMethod getMethod() {
        return method;
    }

    @Override
    public RXRequest setMethod(HttpMethod method) {
        this.method = method;
        return this;
    }

    @Override
    public RXRequest setRestfulData(boolean restfulData) {
        this.restfulData = restfulData;
        return this;
    }

    public RXRequest sign(boolean needSign) {
        this.needSign = needSign;
        return this;
    }

    public RXRequest updateHeaders() {
        this.headerMap = HttpUtil.getDefaultHeaders(UUID_STRING);
        return this;
    }

    @Override
    public RXRequest addHeaders(Map<String, String> headerMap) {
        if (null != headerMap) {
            this.headerMap.putAll(headerMap);
        } else {
            this.headerMap = headerMap;
        }
        return this;
    }

    @Override
    public RXRequest addHeaders(String key, String value) {
        if (this.headerMap != null) {
            this.headerMap.put(key, value);
        }
        return this;
    }


    @Override
    public RXRequest setBody(String jsonStr) {
        return setBody(JSONUtil.toMap(jsonStr));
    }

    @Override
    public RXRequest setBody(JSONObject jsonObject) {
        return setBody(JSONUtil.toMap(jsonObject));
    }

    @Override
    public RXRequest setBody(Map<String, Object> bodyMap) {
        this.bodyMap = bodyMap;
        return this;
    }

    @Override
    public Map<String, Object> getBody() {
        return this.bodyMap;
    }

    @Override
    public String getQuery() {
        return URLHelper.buildQuery(this.bodyMap);
    }

    @Override
    public String getBodyString() {
        if (null != this.bodyMap) {
            JSONObject jsonObject = new JSONObject(this.bodyMap);
            return jsonObject.toString();
        } else {
            return "";
        }
    }

    @Override
    public boolean isFullUrl() {
        return isFullUrl;
    }

    @Override
    public String getUUID() {
        return UUID_STRING;
    }

    @Override
    public String getApiPath() {
        return API_PATH;
    }

    @Override
    public Map<String, String> getHeaders() {
        return this.headerMap != null ? this.headerMap : new HashMap<>();
    }

    /**
     * @return 是否需要已登录
     */
    public boolean isNeedLoggedIn() {
        return needLoggedIn;
    }

    @Override
    public RXRequest setNeedLoggedIn(boolean needLoggedIn) {
        this.needLoggedIn = needLoggedIn;
        return this;
    }

    public boolean isNeedSign() {
        return needSign;
    }

    @Override
    public int getHashCode() {
        return (getApiPath() + getBodyString()).hashCode();
    }

//    public String getSign() {
//        String signForamt = "appid=%s&nonce=%s&openid=%s&ts=%s";
//        String nonce = UUID_STRING.replaceAll("-", "");
//        //获取系统当前时间
//        long ts = System.currentTimeMillis() / 1000;
//        String signParams = String.format(signForamt, RuiXueSdk.getAppId(), nonce, RuiXueSdk.getLoginOpenid(), ts);
//        String sign = Md5Util.StringInMd5(signParams).toUpperCase();
//        signParams += "&sign=" + sign;
//        return signParams;
//    }

    @Override
    public JSONObject execRequest() {
        isRequesting.set(true);
        int code = 0;
        String msg = "";
        if (isNeedLoggedIn()) {
            if (PassportManager.getInstance().isCurrentAccessTokenExpired()) {
                JSONObject jsonObject = PassportManager.getInstance().fetchCurrentAccessToken();
                code = jsonObject.optInt("code", RXErrorCode.LOGIN_ERROR.getValue());
                msg = jsonObject.optString("msg", "access_token is null,please re login.");
            }
            AccessToken accessToken = PassportManager.getInstance().getCurrentAccessToken();
            if (null != accessToken) {
                addHeaders("ruixue-accesstoken", accessToken.getAccess());
            }
        }
        if (code == RXErrorCode.SUCCESS.getValue()) {
            String query = this.method == HttpMethod.GET ? getQuery() : JSONUtil.toJSONString(this.bodyMap);
            RXHttpClient.Builder builder = new RXHttpClient.Builder();
            builder.connectTimeout = connectTimeout;
            builder.readTimeout = readTimeout;
            builder.restfulData = restfulData;
            JSONObject retObj = builder.build().apiRequest(method, getApiPath(), query, getHeaders(), this.mCallback);
//            JSONObject retObj = HttpClient.apiRequest(this.method, getApiPath(), query, getHeaders(), this.restfulData, this.mCallback);
            code = retObj.optInt("code", -1);
            if (code == RXErrorCode.ACCESS_TOKEN_EXPIRE) {
                PassportManager.getInstance().setCurrentAccessTokenExpired();
            }
            isRequesting.set(false);
            return retObj;
        } else {
            if (mCallback != null) {
                int finalCode = code;
                String finalMsg = msg;
                ThreadUtils.getMainLooperHandler().post(() -> this.mCallback.onFailed(JSONUtil.toJSONObject(finalCode, finalMsg)));
            }
            isRequesting.set(false);
            return JSONUtil.toJSONObject(code, msg);
        }
    }

    @Override
    public void execRequestAsync() {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(this::execRequest);
    }

    public void executeConcurrentRequest() {
        List<String> baseUrls = RuiXueSdk.getBaseUrls();
        if (baseUrls == null || baseUrls.isEmpty()) {
            ThreadUtils.getMainLooperHandler().post(() -> mCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "Not init baseUrls")));
            return;
        }

        int total = baseUrls.size();
        ExecutorService executor = Executors.newFixedThreadPool(total);
        AtomicBoolean hasResponded = new AtomicBoolean(false);
        CountDownLatch latch = new CountDownLatch(total);
        List<Map.Entry<String, Long>> elapsedTimes = Collections.synchronizedList(new ArrayList<>());

        // 保存最后一次失败结果
        final JSONObject[] lastFailedResult = {null};
        final RXException[] lastError = {null};

        for (String domain : baseUrls) {
            executor.execute(() -> {
                try {
                    long startTime = System.currentTimeMillis();
                    String query = this.method == HttpMethod.GET ? getQuery() : JSONUtil.toJSONString(this.bodyMap);

                    RXHttpClient.Builder builder = new RXHttpClient.Builder();
                    builder.connectTimeout = connectTimeout;
                    builder.readTimeout = readTimeout;
                    builder.restfulData = restfulData;

                    String fullUrl = domain.endsWith("/") ? domain + getApiPath() : domain + "/" + getApiPath();

                    JSONObject result = builder.build().requestJSONObject(method, fullUrl, query, getHeaders(), null);

                    int code = result.optInt("code", -1);
                    long elapsed = System.currentTimeMillis() - startTime;
                    if (code == RXErrorCode.SUCCESS.getValue()) {
                        elapsedTimes.add(new AbstractMap.SimpleEntry<>(domain, elapsed));
                        if (hasResponded.compareAndSet(false, true)) {
                            ThreadUtils.getMainLooperHandler().post(() -> mCallback.onSuccess(result.optJSONObject("data")));
                        }
                    } else {
                        lastFailedResult[0] = result;
                        elapsedTimes.add(new AbstractMap.SimpleEntry<>(domain, 100000 + elapsed));
                    }

                } catch (Exception e) {
                    lastError[0] = new RXException(e);
                    elapsedTimes.add(new AbstractMap.SimpleEntry<>(domain, Long.MAX_VALUE));
                } finally {
                    latch.countDown();
                }
            });
        }

        new Thread(() -> {
            try {
                latch.await();
                if (!elapsedTimes.isEmpty()) {
                    Collections.sort(elapsedTimes, (a, b) -> Long.compare(a.getValue(), b.getValue()));
                    List<String> sortedUrls = new ArrayList<>();
                    for (Map.Entry<String, Long> entry : elapsedTimes) {
                        sortedUrls.add(entry.getKey());
                    }
                    RXLogger.d("pingTimes:" + elapsedTimes.toString());
                    RXGlobalData.setBaseUrls(sortedUrls);
                }
                if (!hasResponded.get()) {
                    ThreadUtils.getMainLooperHandler().post(() -> {
                        if (lastFailedResult[0] != null) {
                            mCallback.onFailed(lastFailedResult[0]);
                        } else if (lastError[0] != null) {
                            mCallback.onError(lastError[0]);
                        } else {
                            mCallback.onFailed(JSONUtil.toJSONObject(-1, "Unknown request failure"));
                        }
                    });
                }
            } catch (InterruptedException e) {
                if (hasResponded.compareAndSet(false, true)) {
                    ThreadUtils.getMainLooperHandler().post(() -> {
                        mCallback.onError(new RXException(e));
                    });
                }
            } finally {
                executor.shutdown();
            }
        }).start();
    }

    @Override
    public void getAsync(@NonNull RXJSONCallback callback) {
        this.mCallback = hookCallback(callback);
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                isRequesting.set(true);
//                HttpClient.get(getApiPath(), getQuery(), getHeaders(), restfulData, mCallback);
                RXHttpClient.Builder builder = new RXHttpClient.Builder();
                builder.connectTimeout = connectTimeout;
                builder.readTimeout = readTimeout;
                builder.restfulData = restfulData;
                builder.build().apiRequest(HttpMethod.GET, getApiPath(), getQuery(), getHeaders(), mCallback);
                isRequesting.set(false);
            }
        });
    }

    @Override
    public void getAsync(@NonNull UnityRXRequestCallback callback) {
        getAsync(UnityBaseCommonFun.convertCallback(callback));
    }

    public JSONObject get(@NonNull RXJSONCallback callback) {
        method = HttpMethod.GET;
        this.mCallback = hookCallback(callback);
        return execRequest();
    }


    public Runnable getAsyncDelay(@NonNull RXJSONCallback callback, long delayMillis) {
        Runnable getDelayRunnable = () -> get(callback);
        ThreadUtils.getInstance().runOnBgThreadDelay(getDelayRunnable, delayMillis);
        return getDelayRunnable;
    }

    @Override
    public void postAsync() {
        postAsync(this.mCallback);
    }

    @Override
    public void postAsync(@NonNull RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
            post(callback);
        });
    }

    @Override
    public void postAsync(@NonNull UnityRXRequestCallback callback) {
        postAsync(UnityBaseCommonFun.convertCallback(callback));
    }

    public void postAsyncDelay(@NonNull RXJSONCallback callback, long delayMillis) {
        ThreadUtils.getInstance().runOnBgThreadDelay(new Runnable() {
            @Override
            public void run() {
                post(callback);
            }
        }, delayMillis);
    }


    @Override
    public JSONObject post(RXJSONCallback callback) {
        method = HttpMethod.POST;
        this.mCallback = hookCallback(callback);
        return execRequest();
    }

    private RXJSONCallback hookCallback(RXJSONCallback callback) {
        this.mCallback = callback;
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    if (!cause.has("trace_id")) {
                        try {
                            cause.put("trace_id", UUID_STRING);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException exception) {
                if (callback != null) {
                    exception.setTraceId(UUID_STRING);
                    callback.onError(exception);
                }
            }
        };
    }
}
