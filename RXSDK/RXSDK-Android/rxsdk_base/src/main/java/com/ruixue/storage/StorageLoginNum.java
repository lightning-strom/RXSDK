package com.ruixue.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.ruixue.openapi.RXGlobalData;

public class StorageLoginNum extends SharedPreferencesStorage<Integer> {
    static class Single {
        static StorageLoginNum INSTANCE = new StorageLoginNum(RXGlobalData.getContext());

        private Single() {
        }
    }

    public static StorageLoginNum getInstance() {
        return Single.INSTANCE;
    }

    private static final String PREFERENCE_NAME = "spUtils";

    StorageLoginNum(Context context) {
        super(SharedPreferencesLoader.get().loadPreferences(context, PREFERENCE_NAME), "login_count");
    }

    @Override
    protected void save(SharedPreferences.Editor editor, Integer interval) {
        editor.putInt(storageKey, interval);
        editor.apply();
    }

    @Override
    protected void load(SharedPreferences sharedPreferences) {
        data = sharedPreferences.getInt(this.storageKey, -1);
    }

    /**
     * @return 是否首次启动
     */
    public boolean isFirstStart() {
        return this.get() == -1;
    }

    /**
     * @return 是否首次登录
     */
    public boolean isFirstLogin() {
        return this.get() <= 0;
    }

    /**
     * 自增数量
     *
     * @return 登录次数加 1
     */
    public Integer addSelf() {
        if (data == null) data = this.get();
        data++;
        this.put(data);
        return data;
    }
}