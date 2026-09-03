package com.ruixue.net;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.ThreadUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RequestManager {
    private static RequestManager instanceField;

    public static RequestManager getInstance() {
        if (instanceField == null) {
            synchronized (RequestManager.class) {
                if (instanceField == null) {
                    instanceField = new RequestManager();
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private final ConcurrentHashMap<Integer, RXRequest> waitingRequestMap = new ConcurrentHashMap<>();

    private final ConcurrentHashMap<Integer, RXRequest> requestingMap = new ConcurrentHashMap<>();

    public Map<Integer, RXRequest> getWaitingRequestMap() {
        return waitingRequestMap;
    }

    public Map<Integer, RXRequest> getRequestingMap() {
        return requestingMap;
    }

    public void flushRequestQueue() {
        if (waitingRequestMap.size() > 0) {
            for (RXRequest request : waitingRequestMap.values()) {
                execRequestImpl(request);
            }
            waitingRequestMap.clear();
        }
    }

    public void getRequest(String apiPath, Map<String, Object> bodyMap, Map<String, String> extHeaders, RXJSONCallback callback) {
        execRequest(HttpMethod.GET, apiPath, bodyMap, extHeaders, callback);
    }

    public void postRequest(String apiPath, Map<String, Object> bodyMap, Map<String, String> extHeaders, RXJSONCallback callback) {
        execRequest(HttpMethod.POST, apiPath, bodyMap, extHeaders, callback);
    }

    public boolean execRequest(HttpMethod method, String apiPath, Map<String, Object> bodyMap, Map<String, String> extHeaders, RXJSONCallback callback) {
        RXRequest request = RXRequest.create(apiPath).setMethod(method).setBody(bodyMap).addHeaders(extHeaders);
        if (callback != null) {
            request.setCallback(callback);
        }
        return execRequest(request);
    }

    public boolean execRequest(RXRequest request) {
        int hashCode = request.getHashCode();
        if (!RuiXueSdk.isFullyInitialized()) {
            waitingRequestMap.put(hashCode, request);
            RXLogger.i("add to request waiting queue :" + request.getApiPath() + " , hashCode:" + hashCode);
            return false;
        } else {
            flushRequestQueue();
            return execRequestImpl(request);
        }
    }

    private boolean execRequestImpl(RXRequest request) {
        int hashCode = request.getHashCode();
        if (!requestingMap.containsKey(hashCode)) {
            requestingMap.put(hashCode, request);
            ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
                request.updateHeaders().execRequest();
                requestingMap.remove(hashCode);
            });
            RXLogger.i("exec request :" + request.getApiPath() + " , hashCode:" + hashCode);
            return true;
        } else {
            RXLogger.w("The request is already in the request. API:" + request.getApiPath());
            return false;
        }
    }
}
