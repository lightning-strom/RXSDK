package com.ruixue.base;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.legal.LegalData;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/7/9
 */
public class RXDataCache {
    private static JSONObject termsDataCache;

    public static JSONObject getTermsDataCache() {
        return termsDataCache;
    }

    public static void setTermsDataCache(JSONObject json) {
        termsDataCache = json;
    }

    public static void getDefaultTerms(RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        String keys = LegalData.KEY_SERVICE_AGREEMENT + "," + LegalData.KEY_PRIVACY_POLICY;
        map.put("keys", keys);
        RXSdkApi.getInstance().legalTerms(map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXDataCache.setTermsDataCache(data);
                callback.onSuccess(data);

            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(cause);
            }
        });
    }

    public static void clearTermsDataCache() {
        termsDataCache = null;
    }
}
