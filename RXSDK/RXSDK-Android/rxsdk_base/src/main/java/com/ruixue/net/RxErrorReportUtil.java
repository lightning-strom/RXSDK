package com.ruixue.net;

import android.text.TextUtils;

import com.ruixue.RuiXueSdk;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class RxErrorReportUtil {
    public static void trackAtTimeAsync(String eventName, Map<String, Object> properties) {
        TrackDataMgr.getInstance().trackAtTimeAsync(eventName, properties);
    }

    public static void setGateNetReportError(Map<String, String> roperties, String strData, String url, String result) {
        try {

            if (url != null && url.contains("v1/data/api/track")) {
                return;
            }

            JSONObject responseObj = new JSONObject(result);

            int responseCode = responseObj.optInt("code");
            if (String.valueOf(responseCode).length() == 6 && "20".equals(String.valueOf(responseCode).substring(2, 4))) {
                TraceBean traceBean = new TraceBean();
                traceBean.trace_id = roperties.get("ruixue-traceid");
                traceBean.request_address = url;
                traceBean.request_header = roperties;
                traceBean.request_body = JSONUtil.toMap(URLHelper.queryToJSONObject(strData));
                traceBean.error_code = responseCode;
                traceBean.error_message = responseObj.optString("msg");
                report(traceBean);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    public static void setReqEncryptNetReportError(Map<String, String> headers, String requestData, String url, String responseData, String key, String action) {
        try {
            if (url != null && url.contains("v1/data/api/track")) {
                return;
            }

            TraceBean traceBean = new TraceBean();
            traceBean.trace_id = headers.get("ruixue-traceid");
            traceBean.request_address = url;
            traceBean.request_header = headers;
            traceBean.request_body = JSONUtil.toMap(URLHelper.queryToJSONObject(requestData));
            if (responseData != null) {
                traceBean.request_response = responseData;
            }
            traceBean.key = key;
            traceBean.error_action = action;
            report(traceBean);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void setNetReportError(Map<String, String> roperties, String strData, String url, int code, String msg, Object thirdCode, String thirdmsg) {
        try {

            if (url != null && url.contains("v1/data/api/track")) {
                return;
            }

            if (code >= 2000 || (code + "").length() >= 5) {
                return;
            }

            TraceBean traceBean = new TraceBean();
            traceBean.trace_id = roperties.get("ruixue-traceid");
            traceBean.request_address = url;
            traceBean.request_header = roperties;
            traceBean.request_body = JSONUtil.toMap(URLHelper.queryToJSONObject(strData));
            traceBean.error_code = code;
            traceBean.error_message = msg;
            traceBean.error_code_tripartite = thirdCode;
            traceBean.error_message_tripartite = thirdmsg;
            report(traceBean);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void setBusinessReportError(Map<String, String> roperties, Map<String, Object> bodyMap, String type, String action, JSONObject cause) {

        try {
            int code = cause.optInt("code");

            if (code < 2000 || (code + "").length() >= 5) {
                return;
            }

            String msg = cause.optString("msg");
            Object thirdcode = cause.opt("thirdcode");
            String thirdmsg = cause.optString("thirdmsg");
            String trace_id = cause.optString("trace_id");

            TraceBean traceBean = new TraceBean();
            if (TextUtils.isEmpty(trace_id)) {
                traceBean.trace_id = UUID.randomUUID().toString();
            } else {
                traceBean.trace_id = trace_id;
            }
            traceBean.error_action = action;
            traceBean.type_tripartite = type;
            traceBean.request_header = roperties;
            traceBean.request_body = bodyMap;
            traceBean.error_code = code;
            traceBean.error_message = msg;
            traceBean.error_code_tripartite = thirdcode;
            traceBean.error_message_tripartite = thirdmsg;
            report(traceBean);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void report(TraceBean traceBean) {
        if (traceBean == null) {
            return;
        }
        Map<String, Object> properties = new HashMap<>();
        properties.put("error_type", "sdk");
        properties.put("rx_version", RuiXueSdk.getSdkVersion());
        if (!TextUtils.isEmpty(traceBean.trace_id)) {
            properties.put("trace_id", traceBean.trace_id);
        }
        if (!TextUtils.isEmpty(traceBean.error_action)) {
            properties.put("error_action", traceBean.error_action);
        }
        if (!TextUtils.isEmpty(traceBean.request_address)) {
            properties.put("request_address", traceBean.request_address);
        }
        if (!TextUtils.isEmpty(traceBean.type_tripartite)) {
            properties.put("type_tripartite", traceBean.type_tripartite);
        }
        if (traceBean.request_header != null && !traceBean.request_header.isEmpty()) {
            properties.put("request_header", traceBean.request_header);
        }
        if (traceBean.request_body != null && !traceBean.request_body.isEmpty()) {
            properties.put("request_body", traceBean.request_body);
        }
        if (traceBean.request_response != null && !TextUtils.isEmpty(traceBean.request_response)) {
            properties.put("request_response", traceBean.request_response);
        }

        if (traceBean.key != null && !TextUtils.isEmpty(traceBean.key)) {
            properties.put("key", traceBean.key);
        }

        properties.put("error_code", traceBean.error_code);
        if (!TextUtils.isEmpty(traceBean.error_message)) {
            properties.put("error_message", traceBean.error_message);
        }
        if (traceBean.error_code_tripartite != null) {
            properties.put("error_code_tripartite", traceBean.error_code_tripartite);
        }
        if (!TextUtils.isEmpty(traceBean.error_message_tripartite)) {
            properties.put("error_message_tripartite", traceBean.error_message_tripartite);
        }
        if (RuiXueSdk.getLoginData() != null && !TextUtils.isEmpty(RuiXueSdk.getLoginData().getCp_user_id())) {
            properties.put("cp_userid", RuiXueSdk.getLoginData().getCp_user_id());
        }
        properties.put("error_ext", "请前往 https://doc.ruixueyun.com/#/view?path=1e320cec-2bd2-4ae1-9c7b-3c44a645ead5 查看解决方案");
        reportError("#rx_error", properties);
    }

    public static void reportError(String eventName, Map<String, Object> properties) {
        TrackDataMgr.getInstance().errorReport(eventName, properties);
    }


    private static class TraceBean {
        String trace_id;
        String error_action;
        String request_address;
        String type_tripartite;
        Map<String, String> request_header;
        Map<String, Object> request_body;
        String request_response;
        String key; // 请求加解密错误用
        int error_code;
        String error_message;
        Object error_code_tripartite;
        String error_message_tripartite;
    }

    public static class ThirdInitError {
        // 是否存在第三方初始化错误
        public static boolean isError = false;
        public static String thirdName = "";

        public static JSONObject cause;

    }

}
