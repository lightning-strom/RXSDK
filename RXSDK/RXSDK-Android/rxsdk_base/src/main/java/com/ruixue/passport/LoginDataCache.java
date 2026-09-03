package com.ruixue.passport;

import com.ruixue.RuiXueSdk;
import com.ruixue.storage.SharedPreferencesLoader;
import com.ruixue.storage.StorageString;

class LoginDataCache extends StorageString {

    static final String CACHED_LOGIN_DATA_KEY = "com.ruixue.CachedLoginData";

    public LoginDataCache(String sharedPreferencesName) {
        super(SharedPreferencesLoader.get().loadPreferences(
                RuiXueSdk.getContext(), sharedPreferencesName), CACHED_LOGIN_DATA_KEY);
    }

    public LoginData load() {
        String jsonString = this.get();
        if (jsonString == null || jsonString.isEmpty()) {
            return null;
        }
        try {
            return LoginData.fromJson(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void save(LoginData loginData) {
        if (null != loginData) {
            String jsonString = loginData.toJson();
            this.put(jsonString);
        } else {
            remove();
        }
    }

    public void clear() {
        this.remove();
    }
}
