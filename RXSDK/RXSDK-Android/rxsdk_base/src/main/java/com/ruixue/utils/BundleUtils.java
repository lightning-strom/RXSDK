package com.ruixue.utils;

import android.os.Bundle;
import android.os.Parcelable;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/9
 */
public class BundleUtils {

    @SuppressWarnings("unchecked")
    public static Bundle toBundle(Map<String, Object> map) {
        if (null == map) {
            return null;
        }
        Bundle bundle = new Bundle();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof Integer) {
                bundle.putInt(String.valueOf(key), (Integer) value);
            } else if (value instanceof Boolean) {
                bundle.putBoolean(String.valueOf(key), (Boolean) value);
            } else if (value instanceof Map) {
                bundle.putBundle(String.valueOf(key), toBundle((Map<String, Object>) value));
            } else {
                bundle.putString(String.valueOf(key), String.valueOf(value));
            }
        }
        return bundle;
    }

    public static Map<String, Object> toMap(Bundle bundle) {
        Map<String, Object> map = new HashMap<>();
        if (bundle != null) {
            for (String key : bundle.keySet()) {
                Object value = bundle.get(key);
                map.put(key, value);
            }
        }
        return map;
    }

    public static JSONObject toJSONObject(Bundle bundle) {
        return new JSONObject(toMap(bundle));
    }

    public static Bundle[] getBundleArrayFromBundle(Bundle bundle, String var1) {
        Parcelable[] parcelables;
        if (!((parcelables = bundle.getParcelableArray(var1)) instanceof Bundle[]) && parcelables != null) {
            Bundle[] bundles1;
            Bundle[] bundles = bundles1 = (Bundle[]) Arrays.copyOf(parcelables, parcelables.length, Bundle[].class);
            bundle.putParcelableArray(var1, bundles1);
            return bundles;
        } else {
            return (Bundle[]) parcelables;
        }
    }
}
