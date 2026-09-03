package com.ruixue.openapi;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.net.HttpMethod;
import com.ruixue.unity.UnityRXJSONCallback;
import com.ruixue.unity.UnityRXRequestCallback;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/1/13
 */
public interface IRXRequest {

    IRXRequest setCallback(RXJSONCallback mCallback);

    IRXRequest setMethod(HttpMethod method);

    IRXRequest setRestfulData(boolean restfulData);

    IRXRequest addHeaders(Map<String, String> headerMap);

    IRXRequest addHeaders(String key, String value);

    IRXRequest setBody(String jsonStr);

    IRXRequest setBody(JSONObject jsonObject);

    IRXRequest setBody(Map<String, Object> bodyMap);

    IRXRequest setNeedLoggedIn(boolean needLoggedIn);

    HttpMethod getMethod();

    Map<String, String> getHeaders();

    Map<String, Object> getBody();

    String getBodyString();

    String getQuery();

    String getApiPath();


    boolean isRequesting();
    boolean isFullUrl();

    String getUUID();

    int getHashCode();

    JSONObject execRequest();

    JSONObject post(RXJSONCallback callback);

    void execRequestAsync();

    void getAsync(@NonNull RXJSONCallback callback);

    void getAsync(@NonNull UnityRXRequestCallback callback);

    void postAsync();

    void postAsync(@NonNull RXJSONCallback callback);

    void postAsync(@NonNull UnityRXRequestCallback callback);


}
