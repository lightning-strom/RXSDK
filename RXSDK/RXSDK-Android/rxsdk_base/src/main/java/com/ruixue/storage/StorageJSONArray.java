package com.ruixue.storage;

import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.concurrent.Future;

public class StorageJSONArray extends SharedPreferencesStorage <JSONArray> {
    public StorageJSONArray(Future<SharedPreferences> loadStoredPreferences, String storageKey) {
        super(loadStoredPreferences, storageKey);
    }

    public StorageJSONArray(Future<SharedPreferences> loadStoredPreferences) {
        super(loadStoredPreferences, "json_array");
    }

    @Override
    JSONArray create() {
        return new JSONArray();
    }

    @Override
    void save(SharedPreferences.Editor editor, JSONArray data) {
        String stringData;
        if (data == null) {
            stringData = null;
        } else {
            // 对 data 加锁，避免与其它线程对同一 JSONArray 的 put() 并发导致 ConcurrentModificationException
            synchronized (data) {
                stringData = data.toString();
            }
        }
        editor.putString(this.storageKey, stringData);
        editor.apply();
    }

    @Override
    void load(SharedPreferences sharedPreferences) {
        String data = sharedPreferences.getString(this.storageKey, null);
        if (data == null) {
            put(create());
        } else {
            try {
                this.data = new JSONArray(data);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

}