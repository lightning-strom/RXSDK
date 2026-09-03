package com.ruixue.passport;

import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.storage.SharedPreferencesLoader;
import com.ruixue.storage.StorageString;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

class AccountCache extends StorageString {
    static final String CACHED_ACCOUNT_LIST_KEY = "com.ruixue.CachedAccountList";

    public AccountCache(String sharedPreferencesName) {
        super(SharedPreferencesLoader.get().loadPreferences(
                RuiXueSdk.getContext(), sharedPreferencesName), CACHED_ACCOUNT_LIST_KEY);
    }

    public List<Account> load() {
        String jsonString = this.get();
        if (jsonString == null || jsonString.isEmpty()) {
            return null;
        }
        try {
            return Account.fromJson(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void save(List<Account> account) {
        if (null != account && account.size() > 0) {
            String jsonString = new Gson().toJson(account);
            this.put(jsonString);
        } else {
            remove();
        }
    }
}
