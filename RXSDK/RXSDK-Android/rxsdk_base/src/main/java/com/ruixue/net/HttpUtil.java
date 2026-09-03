package com.ruixue.net;

import android.content.Context;
import android.content.res.Configuration;
import android.net.Uri;
import android.text.TextUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.RuiXueSdkVersion;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.StringUtils;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/17
 */
public class HttpUtil {
    public static int checkDuration(String name, long duration, TimeUnit unit) {
        if (duration < 0)
            throw new IllegalArgumentException(name + " < 0");
        if (unit == null)
            throw new NullPointerException("unit == null");
        long millis = unit.toMillis(duration);
        if (millis > Integer.MAX_VALUE)
            throw new IllegalArgumentException(name + " too large.");
        if (millis == 0 && duration > 0)
            throw new IllegalArgumentException(name + " too small.");
        return (int) millis;
    }

    public static String getHeaderCurlFormat(Map<String, List<String>> headers) {
        StringBuilder curHeader = new StringBuilder();
        if (null != headers && headers.size() > 0) {
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                curHeader.append(" -H \"").append(entry.getKey()).append(": ").append(StringUtils.strip(entry.getValue().toString(), "[]")).append("\"");
            }
        }
        return curHeader.toString();
    }


    public static Map<String, String> getDefaultHeaders() {
        return getDefaultHeaders(UUID.randomUUID().toString());
    }

    public static String getWebViewJson(Context context, Map<String, Object> extParams) {
        return getWebViewJson(context, extParams, null, RXGlobalData.getUserCenterCfg(), null, false);
    }

    public static String getWebViewJson(Context context, Map<String, Object> customParams, boolean syncInfoEnable) {
        return getWebViewJson(context, null, customParams, RXGlobalData.getUserCenterCfg(), null, syncInfoEnable);
    }

    public static String getWebViewJson(Context context, Map<String, Object> customParams, Map<String, Object> configParams, boolean syncInfoEnable) {
        return getWebViewJson(context, null, customParams, configParams, null, syncInfoEnable);
    }

    public static String getWebViewJson(Context context, Map<String, Object> extParams, Map<String, Object> customParams, Map<String, Object> configParams, Map<String, Object> realAuthParams, boolean syncInfoEnable) {
        Map<String, Object> map = extParams != null ? extParams : new HashMap<>();
        Map<String, Object> api_params = new HashMap<>();
        api_params.put("cpid", (RuiXueSdk.getCpId()));
        api_params.put("productid", (RuiXueSdk.getProductId()));
        api_params.put("channelid", (RuiXueSdk.getChannelId()));
        api_params.put("platformid", String.valueOf(RuiXueSdk.PLATFORM_ID));
        api_params.put("version", RuiXueSdkVersion.BUILD);
        api_params.put("devicecode", RuiXueSdk.getDeviceCode());
        api_params.put("language", RXGlobalData.getLanguage());//需求如此
        api_params.put("tzoffset", DateUtils.getTimeZoneDecimal());
        api_params.put("domain", RuiXueSdk.getFirstBaseUrl());
        api_params.put("country_code", RXGlobalData.COUNTRY);
        api_params.put("area", RXGlobalData.AREA);

        map.put("api_params", new JSONObject(api_params).toString());
        if (customParams != null) {
            if (customParams.containsKey("game_user_id")) {
                customParams.put("game_user_id", String.valueOf(customParams.get("game_user_id")));
            }
            map.put("custom_params", new JSONObject(customParams).toString());
        }

        if (realAuthParams != null) {
            map.put("real_auth", new JSONObject(realAuthParams).toString());
        }

        LoginUIConfig loginUIConfig = LoginUIConfig.getInstance();
        if (loginUIConfig != null) {
            map.put("methods", new Gson().toJson(loginUIConfig.getLoginMethodList()));
        }

        if (configParams != null) {
            map.put("config_params", new JSONObject(configParams).toString());
        }
        map.put("setSyncInfoEnable", syncInfoEnable);
        LoginData loginData = RuiXueSdk.getLoginData();

        if (loginData != null) {
            map.put("login_data", loginData.toJson());
        }

        String sdkInitConfigData = RXGlobalData.getSdkInitAllConfigData();
        if (sdkInitConfigData != null) {
            map.put("init_data", sdkInitConfigData);
        }

        int top = AppUtils.px2dp(context, AppUtils.getTopDisplayCutout(context));
        Map<String, Object> device = new HashMap<>();
        device.put("naviBarHeight", top);
        Configuration configuration = context.getResources().getConfiguration();
        int screenSize = configuration.screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK;
        device.put("isPad", screenSize < Configuration.SCREENLAYOUT_SIZE_LARGE ? 0 : 1);
        map.put("device", new Gson().toJson(device));

        Map<String, Object> passwordStrength = new HashMap<>();
        passwordStrength.put("password_type", RXGlobalData.getPasswordStrength().name().toLowerCase());
        passwordStrength.put("pattern", RXGlobalData.getPwdPattern());
        map.put("passwordStrength", new Gson().toJson(passwordStrength));

        map.put("request_headers", new Gson().toJson(PassportManager.getInstance().getDefaultHeaders()));
        String str = JSONUtil.toJSONString(map);
        RXLogger.i(str);
        return str;

    }

    public static boolean parseUrlScheme(WebView webView, Class<?> cls, Object obj, Uri uri) {
        if (uri != null && uri.getScheme().startsWith("rx")) {
            String authority = uri.getAuthority();
            try {
                Method m = cls.getMethod(authority, String.class);
                Map<String, Object> qm = parseUrlQuery(uri.getQuery());
                Object invoke2 = m.invoke(obj != null ? obj : cls.newInstance(), (String) qm.get("data"));
                RXLogger.i("debug:" + (String) invoke2);
                if (invoke2 != null) {
                    webView.post(() -> webView.evaluateJavascript(authority + "Callback('" + URLHelper.urlEncode((String) invoke2) + "');", t -> {
                        RXLogger.i("debug1:" + t);
                    }));
                }
            } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException | InstantiationException e) {
                e.printStackTrace();
            }
            return true;
        }
        return false;
    }

    public static Map<String, Object> parseUrlQuery(String query) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (!TextUtils.isEmpty(query)) {
                String[] arrs = query.split("&");
                for (String arr : arrs) {
                    if (arr.contains("=")) {
                        String[] arrChild = arr.split("=");
                        int arrLen = arrChild.length;
                        if (arrLen > 0) {
                            String t = "";
                            if (arrLen > 1) {
                                try {
                                    t = URLDecoder.decode(arrChild[1], "utf-8");
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                            map.put(arrChild[0], t);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    public static String getDefaultUserAgent() {
        try {
            Context context = RXGlobalData.getContext();
            if (null != context) {
                return WebSettings.getDefaultUserAgent(context);
            } else {
                return System.getProperty("http.agent");
            }
        } catch (Throwable t) {
            return System.getProperty("http.agent");
        }
    }

    public static String getAcceptLanguage() {
        return RXGlobalData.LANGUAGE + "-" + RXGlobalData.COUNTRY;
    }


    public static Map<String, String> getDefaultHeaders(String traceId) {

        HashMap<String, String> headerMap = new HashMap<>();
        headerMap.put("Connection", "Keep-Alive");
        headerMap.put("Charset", "UTF-8");
        headerMap.put("accept", "application/json");
        headerMap.put("Content-Type", "application/json; charset=UTF-8"); // 设置文件类型:
        headerMap.put("user-agent", getDefaultUserAgent());
        headerMap.put("Accept-Language", getAcceptLanguage());
        headerMap.put("ruixue-language", RXGlobalData.getLanguage());//需求要求只传语言不传地区
        headerMap.put("ruixue-tzoffset", DateUtils.getTimeZoneDecimal());

        headerMap.put("ruixue-traceid", traceId);
        headerMap.put("ruixue-cpid", String.valueOf(RuiXueSdk.getCpId()));
        headerMap.put("ruixue-productid", String.valueOf(RuiXueSdk.getProductId()));
        headerMap.put("ruixue-channelid", String.valueOf(RuiXueSdk.getChannelId()));
        headerMap.put("ruixue-platformid", String.valueOf(RuiXueSdk.PLATFORM_ID));
        headerMap.put("ruixue-version", RuiXueSdkVersion.BUILD);
        Map<String, Object> appInfoMap = new HashMap<>();
        appInfoMap.put("version", AppUtils.getVersionName(RXGlobalData.getContext()));
        headerMap.put("ruixue-appinfo", URLHelper.buildQuery(appInfoMap));
        headerMap.put("ruixue-devicecode", RuiXueSdk.getDeviceCode());
        if (!TextUtils.isEmpty(RXGlobalData.getGameRoleId())) {
            headerMap.put("ruixue-cp-role-id", RXGlobalData.getGameRoleId());
        }
        if (!TextUtils.isEmpty(RXGlobalData.getGameRegionTag())) {
            headerMap.put("ruixue-region", RXGlobalData.getGameRegionTag());
        }
        if (!TextUtils.isEmpty(RXGlobalData.AREA)) {
            headerMap.put("ruixue-area", RXGlobalData.AREA);
        }
        return headerMap;
    }

    public static String streamToString(InputStream stream) throws IOException {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(stream))) {
            String inputLine = "";
            StringBuilder response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            //System.out.println("The content of response is: " + response);
            return response.toString();
        }
    }
}
