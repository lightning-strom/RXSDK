package com.ruixue.storage;

import android.content.SharedPreferences;
import android.text.TextUtils;
import java.util.concurrent.Future;

public class StorageString extends SharedPreferencesStorage<String> {

    public StorageString(Future<SharedPreferences> loadStoredPreferences, String storageKey) {
        super(loadStoredPreferences, storageKey);
    }

    @Override
    String create() {
        return "";
    }

    @Override
    public void save(SharedPreferences.Editor editor, String value) {
        editor.putString(this.storageKey, value);
        editor.apply();
    }

    @Override
    public void load(SharedPreferences sharedPreferences) {
        String data = sharedPreferences.getString(this.storageKey, "");
        if (TextUtils.isEmpty(data)) {
            put(create());
        } else {
            this.data = data;
        }
    }
}