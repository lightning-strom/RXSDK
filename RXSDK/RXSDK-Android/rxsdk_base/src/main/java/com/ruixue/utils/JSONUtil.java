package com.ruixue.utils;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.RXGlobalData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@SuppressWarnings("unused")
public class JSONUtil {

    public static JSONObject toJSONObject(Map<String, Object> jsonMap, int code, String msg, String traceId, Object thirdCode, String thirdMsg) {
//        String json = "{\"code\":\"" + code + ", \"msg\":\"" + msg + "} ";
        jsonMap.put("code", code);
        String cusMsg = RXGlobalData.getCustomErrorMsg(code);
        if (!TextUtils.isEmpty(cusMsg)) {
            cusMsg = cusMsg.replace("$code$", "" + code);
            if (msg != null) {
                cusMsg = cusMsg.replace("$msg$", msg);
            } else {
                cusMsg = cusMsg.replace("$msg$", "");
            }
            if (thirdCode != null) {
                cusMsg = cusMsg.replace("$thirdcode$", "" + thirdCode);
            } else {
                cusMsg = cusMsg.replace("$thirdcode$", "");
            }
            if (thirdMsg != null) {
                cusMsg = cusMsg.replace("$thirdmsg$", thirdMsg);
            } else {
                cusMsg = cusMsg.replace("$thirdmsg$", "");
            }
            msg = cusMsg;
        }


        jsonMap.put("msg", msg);

        if (thirdCode != null) {
            jsonMap.put("thirdcode", thirdCode);
        }
        if (thirdMsg != null) {
            jsonMap.put("thirdmsg", thirdMsg);
        }
        if (!TextUtils.isEmpty(traceId)) {
            jsonMap.put("trace_id", traceId);
        }
        return new JSONObject(jsonMap);
    }

    public static JSONObject toJSONObject(Map<String, Object> jsonMap, int code, String msg, String traceId) {
        toJSONObject(jsonMap, code, msg, traceId, null, null);
        return new JSONObject(jsonMap);
    }

    public static JSONObject toJSONObject(int code, String msg, String traceId) {
        Map<String, Object> jsonMap = new HashMap<>();
        return toJSONObject(jsonMap, code, msg, traceId);
    }

    public static JSONObject toJSONObject(int code, String msg) {
//        String json = "{\"code\":\"" + code + ", \"msg\":\"" + msg + "} ";
        return toJSONObject(code, msg, "");
    }

    public static JSONObject toJSONObject(RXErrorCode codeEnum) {
        return codeEnum.toJSONObject();
    }

    public static JSONObject toJSONObject(Map<String, Object> map) {
        if (map != null) {
            return new JSONObject(map);
        } else {
            return null;
        }
    }

    public static JSONObject toJSONObject(String jsonStr) {
        try {
            return new JSONObject(ObjectUtils.requireNonNull(jsonStr));
        } catch (Exception e) {
            e.printStackTrace();
            return toJSONObject(-1, jsonStr);
        }
    }

    public static String toJSONString(int code, String msg) {
        String json = "{\"code\":" + code + ",\"msg\":\"" + msg + "\"}";
        return json;
    }

    public static <T> String toJSONString(Map<String, T> map) {
        if (null != map) {
            return toJSONString(new JSONObject(map));
        }
        return null;
    }

    public static String toJSONString(JSONObject jsonObject) {
        String bodyStr = null;
        if (null != jsonObject) {
            bodyStr = jsonObject.toString();
        }
        return bodyStr;
    }


//    /**
//     * 根据json字符串返回Map对象
//     *
//     * @param json json
//     */
//    public static Map<String, Object> toMapByGson(String json) throws com.google.gson.JsonSyntaxException {
//         com.google.gson.JsonObject jsonObject= com.google.gson.JsonParser.parseString(json).getAsJsonObject();
//        return toMap(jsonObject);
//    }

    public static JSONObject putMap(JSONObject jsonObject, @NonNull Map<String, Object> map) {
        Map<String, Object> cMap = toMap(jsonObject);
        if (cMap != null) {
            map.putAll(cMap);
        }
        return new JSONObject(map);
    }

    /**
     * 将JSONObjec对象转换成Map-List集合
     * @param json json
     */
    public static Map<String, Object> toMap(com.google.gson.JsonObject json) {

        Map<String, Object> map = new HashMap<>();
        Set<Map.Entry<String, com.google.gson.JsonElement>> entrySet = json.entrySet();
        for (Map.Entry<String, com.google.gson.JsonElement> entry : entrySet) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof com.google.gson.JsonArray)
                map.put(key, toList((com.google.gson.JsonArray) value));
            else if (value instanceof com.google.gson.JsonObject)
                map.put(key, toMap((com.google.gson.JsonObject) value));
            else
                map.put(key, value);
        }
        return map;
    }


    /**
     * 将JSONArray对象转换成List集合
     * @param json json
     */
    public static Collection<Object> toList(com.google.gson.JsonArray json) {
        Collection<Object> list = new ArrayList<Object>();
        for (int i = 0; i < json.size(); i++) {
            Object value = json.get(i);
            if (value instanceof com.google.gson.JsonArray) {
                list.add(toList((com.google.gson.JsonArray) value));
            } else if (value instanceof com.google.gson.JsonObject) {
                list.add(toMap((com.google.gson.JsonObject) value));
            } else {
                list.add(value);
            }
        }
        return list;
    }

    public static String toJson(Object obj) {
        return new Gson().toJson(obj);
    }

    /**
     * @param src       the object for which JSON representation is to be created
     * @param typeOfSrc The specific genericized type of src. You can obtain this type by using the TypeToken class. For example, to get the type for Collection<Foo>, you should use:
     *                  Type typeOfSrc = new TypeToken<Collection<Foo>>(){}.getType();
     * @return Json representation of src
     */
    public static String toJson(Object src, Type typeOfSrc) {
        return new Gson().toJson(src, typeOfSrc);
    }

    public static List<Map<String, Object>> toListMap(@Nullable JSONArray json) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (json != null) {
            for (int i = 0; i < json.length(); i++) {
                Object value = json.opt(i);
                if (value instanceof JSONObject) {
                    list.add(toMap((JSONObject) value));
                }
            }
        }
        return list;
    }

    public static Collection<Object> toList(JSONArray json) {
        Collection<Object> list = new ArrayList<>();
        for (int i = 0; i < json.length(); i++) {
            Object value = json.opt(i);
            if (value instanceof JSONArray) {
                list.add(toList((JSONArray) value));
            } else if (value instanceof JSONObject) {
                list.add(toMap((JSONObject) value));
            } else if (null != value) {
                list.add(value);
            }
        }
        return list;
    }

    public static List<String> toStringList(JSONArray json) {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < json.length(); i++) {
            String value = json.optString(i);
            if (null != value) {
                list.add(value);
            }
        }
        return list;
    }

    public static Map<String, Object> toMapNonNull(JSONObject jsonObject) {
        Map<String, Object> map = toMap(jsonObject);
        if (map == null) {
            map = new HashMap<>();
        }
        return map;
    }

    public static Map<String, Object> toMap(JSONObject jsonObject) {
        if (jsonObject == null) {
            return null;
        }
        try {
            Map<String, Object> hashMap = new HashMap<>();
            Iterator<String> it = jsonObject.keys();
            while (it.hasNext()) {
                String key = it.next();
                Object value = jsonObject.opt(key);
                if (value instanceof JSONObject) {
                    hashMap.put(key, toMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    hashMap.put(key, toList((JSONArray) value));
                } else {
                    hashMap.put(key, value);
                }
            }
            return hashMap;
        } catch (Exception e) {
            return null;
        }
    }

    public static Map<String, Object> toMap(Object obj) {
        if (obj instanceof JSONObject) {
            return toMap((JSONObject) obj);
        } else {
            return toMap(new Gson().toJson(obj));
        }
    }

    public static Map<String, Object> toMap(String jsonStr) {
        try {
            JSONObject jsonObject = new JSONObject(jsonStr);
            return toMap(jsonObject);
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static void jsonObjectClear(JSONObject jsonObject) {
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            keys.next();
            keys.remove();
        }
    }

    public static boolean jsonObjectContainsValue(JSONObject jsonObject, Object value) {
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            Object thisValue = jsonObject.opt(keys.next());
            if (thisValue != null && thisValue.equals(value)) {
                return true;
            }
        }
        return false;
    }

    private static final class JSONObjectEntry implements Map.Entry<String, Object> {
        private final String key;
        private final Object value;

        JSONObjectEntry(String key, Object value) {
            this.key = key;
            this.value = value;
        }

        @Override
        public String getKey() {
            return this.key;
        }

        @Override
        public Object getValue() {
            return this.value;
        }

        @Override
        public Object setValue(Object object) {
            throw new UnsupportedOperationException("JSONObjectEntry is immutable");
        }
    }

    public static Set<Map.Entry<String, Object>> jsonObjectEntrySet(JSONObject jsonObject) {
        HashSet<Map.Entry<String, Object>> result = new HashSet<>();

        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = jsonObject.opt(key);
            result.add(new JSONObjectEntry(key, value));
        }
        return result;
    }

    public static Set<String> jsonObjectKeySet(JSONObject jsonObject) {
        HashSet<String> result = new HashSet<>();
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            result.add(keys.next());
        }
        return result;
    }

    public static void jsonObjectPutAll(JSONObject jsonObject, Map<String, Object> map) {
        Set<Map.Entry<String, Object>> entrySet = map.entrySet();
        for (Map.Entry<String, Object> entry : entrySet) {
            try {
                jsonObject.putOpt(entry.getKey(), entry.getValue());
            } catch (JSONException e) {
                throw new IllegalArgumentException(e);
            }
        }
    }

    public static Collection<Object> jsonObjectValues(JSONObject jsonObject) {
        ArrayList<Object> result = new ArrayList<>();
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            result.add(jsonObject.opt(keys.next()));
        }
        return result;
    }

    /**
     * json字符串转bean对象
     * @param json
     */
    public static <T> T fromJson(String json, Type typeOfT) {
        Gson gson = new GsonBuilder().registerTypeAdapter(typeOfT, new MapTypeAdapter()).create();
        return gson.fromJson(json, typeOfT);

    }

    public static class MapTypeAdapter extends TypeAdapter<Object> {
        private final TypeAdapter<Object> delegate = new Gson().getAdapter(Object.class);

        @Override
        public Object read(JsonReader in) throws IOException {
            JsonToken token = in.peek();
            switch (token) {
                case BEGIN_ARRAY:
                    List<Object> list = new ArrayList<>();
                    in.beginArray();
                    while (in.hasNext()) {
                        list.add(read(in));
                    }
                    in.endArray();
                    return list;

                case BEGIN_OBJECT:
                    Map<String, Object> map = new LinkedTreeMap<>();
                    in.beginObject();
                    while (in.hasNext()) {
                        map.put(in.nextName(), read(in));
                    }
                    in.endObject();
                    return map;

                case STRING:
                    return in.nextString();

                case NUMBER:
                    /**
                     * 改写数字的处理逻辑，将数字值分为整型与浮点型。
                     */
                    double dbNum = in.nextDouble();

                    // 数字超过long的最大值，返回浮点类型
                    if (dbNum > Long.MAX_VALUE) {
                        return dbNum;
                    }
                    // 判断数字是否为整数值
                    long lngNum = (long) dbNum;
                    if (dbNum == lngNum) {
                        try {
                            return (int) lngNum;
                        } catch (Exception e) {
                            return lngNum;
                        }
                    } else {
                        return dbNum;
                    }

                case BOOLEAN:
                    return in.nextBoolean();

                case NULL:
                    in.nextNull();
                    return null;

                default:
                    throw new IllegalStateException();
            }
        }

        @Override
        public void write(JsonWriter out, Object value) throws IOException {
            delegate.write(out, value);
        }

    }
}
