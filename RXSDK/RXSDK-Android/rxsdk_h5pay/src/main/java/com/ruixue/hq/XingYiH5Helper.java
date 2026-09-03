package com.ruixue.hq;

import androidx.annotation.Nullable;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

final class XingYiH5Helper {

    static final String HQ_TYPE = "xy";
    static final String EXT_IS_H5 = "is_h5";
    @Deprecated
    static final String LEGACY_HQ_TYPE_H5 = "xyh5";

    private XingYiH5Helper() {
    }

    static void normalizePayRequest(Map<String, Object> hashMap) {
        Object payType = hashMap.get(HQT5.KEY);
        if (LEGACY_HQ_TYPE_H5.equals(payType)) {
            hashMap.put(HQT5.KEY, HQ_TYPE);
            ensureIsH5Ext(hashMap);
        }
    }

    static void ensureIsH5Ext(Map<String, Object> hashMap) {
        @SuppressWarnings("unchecked")
        Map<String, Object> ext = (Map<String, Object>) hashMap.get("ext");
        if (ext == null) {
            ext = new HashMap<>();
            hashMap.put("ext", ext);
        }
        if (!ext.containsKey(EXT_IS_H5)) {
            ext.put(EXT_IS_H5, 1);
        }
    }

    static boolean isH5Pay(Map<String, Object> hashMap, @Nullable JSONObject orderData) {
        if (isTruthy(getExtValue(hashMap.get("ext"), EXT_IS_H5))) {
            return true;
        }
        if (orderData != null) {
            JSONObject ext = orderData.optJSONObject("ext");
            if (ext != null && isTruthy(ext.opt(EXT_IS_H5))) {
                return true;
            }
        }
        return false;
    }

    @Nullable
    private static Object getExtValue(@Nullable Object extObj, String key) {
        if (extObj instanceof Map) {
            return ((Map<?, ?>) extObj).get(key);
        }
        return null;
    }

    static boolean isTruthy(@Nullable Object value) {
        if (value == null) {
            return false;
        }
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue() == 1;
        }
        String text = String.valueOf(value);
        return "1".equals(text) || "true".equalsIgnoreCase(text);
    }
}
