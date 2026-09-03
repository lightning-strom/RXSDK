package com.ruixue.storage;

import android.content.SharedPreferences;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Future;

public class StorageList extends SharedPreferencesStorage<List<Map<String, Object>>> {
    Gson mGson;

    public StorageList(Future<SharedPreferences> loadStoredPreferences, String storageKey) {
        super(loadStoredPreferences, storageKey);
        mGson = new Gson();
    }

    public StorageList(Future<SharedPreferences> loadStoredPreferences) {
        super(loadStoredPreferences, "json_array");
        mGson = new Gson();
    }

    @Override
    List<Map<String, Object>> create() {
        return new CopyOnWriteArrayList<>();
    }

    @Override
    void save(SharedPreferences.Editor editor, List<Map<String, Object>> data) {
        String stringData = (data == null) ? null : mGson.toJson(data);
        editor.putString(this.storageKey, stringData);
        editor.apply();
    }

    @Override
    void load(SharedPreferences sharedPreferences) {
        String data = sharedPreferences.getString(this.storageKey, null);
        if (TextUtils.isEmpty(data)) {
            put(create());
        } else {
            Type listType = new TypeToken<List<Map<String, Object>>>() {
            }.getType();
            this.data = mGson.fromJson(data, listType);
        }
    }

    @Override
    public void put(List<Map<String, Object>> data) {
        super.put(data);
    }

    public void clear() {
        put(create());
    }

    public void clearBeforeIdx(int idx) {
        List<Map<String, Object>> tmp = get();
        if (tmp != null && idx > 0 && idx < tmp.size()) {
            tmp.subList(idx, tmp.size()).clear();
        } else {
            tmp = create();
        }
        put(tmp);
    }

    public List<Map<String, Object>> getFromIdx(int idx) {
        List<Map<String, Object>> tmp = get();
        if (tmp != null &&( idx > 0 && idx < tmp.size())) {
            return tmp.subList(idx, tmp.size());
        } else {
            return tmp;
        }
    }

    @SafeVarargs
    public final void add(Map<String, Object>... data) {
        if (data == null) {
            return;
        }
        List<Map<String, Object>> tmp = get();
        if (tmp != null) {
            tmp.addAll(Arrays.asList(data));
            put(tmp);
        } else {
            put(Arrays.asList(data));
        }
    }

}